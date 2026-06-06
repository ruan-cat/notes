import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { describe, expect, test } from "vitest";

import { mergeAccounts, runMergeAccountPoolRedeem } from "../docs/sundry/ai/sub2api/scripts/merge-account-pool-redeem";

describe("merge account pool redeem json", () => {
	test("uses extra account identity as name suffix and keeps name notes first", () => {
		const accounts = mergeAccounts(
			[
				{
					name: "old-name",
					credentials: {
						email: "credential-value@teamtc.lol",
					},
					extra: {
						email: "extra-email-value@teamtc.lol",
						name: "extra-name-value@teamtc.lol",
						source: "aether_pool_redeem_export",
					},
					platform: "openai",
				},
			],
			{
				namePrefix: "2026-6-6-02-ldxp:G5V6NZEZ:g46pmy|",
				notes: "2026-6-6-02-ldxp:G5V6NZEZ:g46pmy ",
			},
		);

		expect(Object.keys(accounts[0]).slice(0, 2)).toEqual(["name", "notes"]);
		expect(accounts[0].name).toBe("2026-6-6-02-ldxp:G5V6NZEZ:g46pmy|extra-name-value");
		expect(accounts[0].notes).toBe("2026-6-6-02-ldxp:G5V6NZEZ:g46pmy ");
		expect(accounts[0].extra).toEqual({
			email: "extra-email-value@teamtc.lol",
			name: "extra-name-value@teamtc.lol",
			source: "aether_pool_redeem_export",
		});
	});

	test("falls back to extra email before credential email", () => {
		const accounts = mergeAccounts(
			[
				{
					credentials: {
						email: "credential-value@teamtc.lol",
					},
					extra: {
						email: "extra-email-value@teamtc.lol",
					},
				},
			],
			{
				namePrefix: "batch|",
				notes: "batch ",
			},
		);

		expect(accounts[0].name).toBe("batch|extra-email-value");
	});

	test("reads multiple source files and writes merged target json", () => {
		const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "sub2api-merge-"));

		try {
			fs.writeFileSync(
				path.join(temporaryDirectory, "source-a.json"),
				JSON.stringify({
					accounts: [
						{
							credentials: {
								email: "first-credentials@teamtc.lol",
							},
							extra: {
								email: "first-extra@teamtc.lol",
								name: "first-extra-name@teamtc.lol",
								source: "aether_pool_redeem_export",
							},
							platform: "openai",
						},
					],
				}),
				"utf8",
			);
			fs.writeFileSync(
				path.join(temporaryDirectory, "source-b.json"),
				JSON.stringify({
					accounts: [
						{
							credentials: {
								email: "second-credentials@teamtc.lol",
							},
							extra: {
								email: "second-extra@teamtc.lol",
								source: "aether_pool_redeem_export",
							},
							platform: "openai",
						},
					],
				}),
				"utf8",
			);

			const summary = runMergeAccountPoolRedeem({
				dataDirectory: temporaryDirectory,
				inputFileNames: ["source-a.json", "source-b.json"],
				namePrefix: "batch-prefix|",
				notes: "batch-notes ",
				outputFileName: "target.json",
			});
			const output = JSON.parse(fs.readFileSync(path.join(temporaryDirectory, "target.json"), "utf8"));

			expect(summary).toEqual({
				accountCount: 2,
				outputPath: path.join(temporaryDirectory, "target.json"),
			});
			expect(output.accounts.map((account: { name: string }) => account.name)).toEqual([
				"batch-prefix|first-extra-name",
				"batch-prefix|second-extra",
			]);
			expect(output.accounts.every((account: { notes: string }) => account.notes === "batch-notes ")).toBe(true);
			expect(Object.keys(output.accounts[0]).slice(0, 2)).toEqual(["name", "notes"]);
		} finally {
			fs.rmSync(temporaryDirectory, { force: true, recursive: true });
		}
	});
});
