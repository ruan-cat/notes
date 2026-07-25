import { test, describe, expect } from "vitest";

import {
	createDefaultOutputFileName,
	parseSub2ApiJsonText,
	rewriteSub2ApiJson,
	sanitizeJsonFileName,
	stringifySub2ApiJson,
	type Sub2ApiExportFile,
} from "../docs/sundry/ai/sub2api/sub2api-json-rewriter-core";

describe("sub2api json rewriter core", () => {
	test("uses extra.email before credentials.email", () => {
		const result = rewriteSub2ApiJson(
			createSource({
				name: "old-name",
				credentials: {
					email: "credentials-name@example.com",
				},
				extra: {
					email: "extra-email@example.com",
					name: "extra-name@example.com",
				},
			}),
			createOptions(),
		);

		expect(result.output.accounts?.[0]).toMatchObject({
			name: "batch-01|extra-email",
			notes: "batch notes",
			credentials: {
				email: "credentials-name@example.com",
			},
			extra: {
				email: "extra-email@example.com",
				name: "extra-name@example.com",
			},
		});
		expect(result.preview[0]).toEqual({
			afterName: "batch-01|extra-email",
			beforeName: "old-name",
			emailLocalName: "extra-email",
			index: 0,
		});
	});

	test("uses credentials.email when extra email and name are missing", () => {
		const result = rewriteSub2ApiJson(
			createSource({
				credentials: {
					email: "credential-only@example.com",
				},
			}),
			createOptions(),
		);

		expect(result.output.accounts?.[0]?.name).toBe("batch-01|credential-only");
	});

	test("uses extra.name when extra email is missing", () => {
		const result = rewriteSub2ApiJson(
			createSource({
				credentials: {
					email: "credential-name@example.com",
				},
				extra: {
					name: "extra-name@example.com",
				},
			}),
			createOptions(),
		);

		expect(result.output.accounts?.[0]?.name).toBe("batch-01|extra-name");
	});

	test("uses name as the final fallback", () => {
		const result = rewriteSub2ApiJson(createSource({ name: "fallback-name@example.com" }), createOptions());

		expect(result.output.accounts?.[0]?.name).toBe("batch-01|fallback-name");
	});

	test("preserves multiline notes as escaped newlines after stringify", () => {
		const result = rewriteSub2ApiJson(
			createSource({ name: "account@example.com" }),
			createOptions({
				notes: "line one\nline two",
			}),
		);

		expect(result.output.accounts?.[0]?.notes).toBe("line one\nline two");
		expect(stringifySub2ApiJson(result.output)).toContain('"notes": "line one\\nline two"');
	});

	test("falls back to prefix when notes are blank", () => {
		const result = rewriteSub2ApiJson(
			createSource({ name: "account@example.com" }),
			createOptions({
				notes: "",
			}),
		);

		expect(result.output.accounts?.[0]?.notes).toBe("batch-01");
	});

	test("preserves existing top-level fields and account fields", () => {
		const source = createSource(
			{
				name: "old-name@example.com",
				platform: "claude",
				priority: 2,
			},
			{
				skipped_not_workspace: ["skip-one"],
				type: "sub2api",
				version: 1,
			},
		);

		const result = rewriteSub2ApiJson(source, createOptions());

		expect(result.output).toMatchObject({
			exported_at: "2026-07-25T00:00:00.000Z",
			proxies: [{ name: "proxy-a" }],
			skipped_not_workspace: ["skip-one"],
			type: "sub2api",
			version: 1,
		});
		expect(result.output.accounts?.[0]).toMatchObject({
			name: "batch-01|old-name",
			notes: "batch notes",
			platform: "claude",
			priority: 2,
		});
	});

	test("adds missing exported_at and proxies fields", () => {
		const result = rewriteSub2ApiJson(
			{
				accounts: [{ name: "account@example.com" }],
			},
			createOptions({
				exportedAt: "2026-07-25T12:00:00.000Z",
			}),
		);

		expect(result.output.exported_at).toBe("2026-07-25T12:00:00.000Z");
		expect(result.output.proxies).toEqual([]);
	});

	test("throws for invalid JSON root values", () => {
		expect(() => parseSub2ApiJsonText("[]")).toThrow("root must be an object");
	});

	test("throws for missing accounts array", () => {
		expect(() => rewriteSub2ApiJson({}, createOptions())).toThrow("accounts array");
	});

	test("throws when proxies is present but not an array", () => {
		expect(() =>
			rewriteSub2ApiJson(
				{
					accounts: [{ name: "account@example.com" }],
					proxies: "not-array" as never,
				},
				createOptions(),
			),
		).toThrow("proxies field must be an array");
	});

	test("throws for invalid account items with index", () => {
		expect(() =>
			rewriteSub2ApiJson(
				{
					accounts: [{ name: "valid@example.com" }, null as never],
				},
				createOptions(),
			),
		).toThrow("index 1");
	});

	test("throws for accounts without a resolvable email local name", () => {
		expect(() =>
			rewriteSub2ApiJson(
				{
					accounts: [{ credentials: { email: "@example.com" } }],
				},
				createOptions(),
			),
		).toThrow("index 0");
	});

	test("reports duplicate rewritten names", () => {
		const result = rewriteSub2ApiJson(
			{
				accounts: [
					{ extra: { email: "same@example.com" } },
					{ credentials: { email: "same@example.org" } },
					{ name: "other@example.net" },
					{ name: "same@example.edu" },
				],
			},
			createOptions(),
		);

		expect(result.duplicateNames).toEqual(["batch-01|same"]);
		expect(result.accountCount).toBe(4);
	});

	test("sanitizes output file names", () => {
		expect(sanitizeJsonFileName('  bad<name>:"/\\|?*\u0001  ')).toBe("badname.json");
		expect(sanitizeJsonFileName("already.json")).toBe("already.json");
		expect(createDefaultOutputFileName("upload?.json", "batch-01")).toBe("upload.json");
		expect(createDefaultOutputFileName(undefined, "batch:01")).toBe("batch01.json");
	});
});

function createOptions(
	options: Partial<Parameters<typeof rewriteSub2ApiJson>[1]> = {},
): Parameters<typeof rewriteSub2ApiJson>[1] {
	return {
		accountBatchPrefix: "batch-01",
		notes: "batch notes",
		...options,
	};
}

function createSource(
	account: NonNullable<Sub2ApiExportFile["accounts"]>[number],
	rest: Partial<Sub2ApiExportFile> = {},
) {
	return {
		exported_at: "2026-07-25T00:00:00.000Z",
		proxies: [{ name: "proxy-a" }],
		...rest,
		accounts: [account],
	};
}
