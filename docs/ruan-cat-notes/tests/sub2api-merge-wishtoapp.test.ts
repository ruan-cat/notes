import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { describe, expect, test } from "vitest";

import { mergeSub2ApiJsonFiles } from "../docs/sundry/ai/sub2api/scripts/merge-wishtoapp-sub2api-json";

describe("merge wishtoapp sub2api json", () => {
	test("recursively merges source accounts and writes one sub2api json file", () => {
		const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "sub2api-wishtoapp-"));
		const sourceDirectory = path.join(temporaryDirectory, "source");
		const outputPath = path.join(temporaryDirectory, "output", "merged.json");

		try {
			fs.mkdirSync(path.join(sourceDirectory, "group_002"), { recursive: true });
			fs.mkdirSync(path.join(sourceDirectory, "group_001"), { recursive: true });
			fs.writeFileSync(
				path.join(sourceDirectory, "group_002", "0002.json"),
				JSON.stringify({
					exported_at: "2026-06-06T12:02:00+00:00",
					proxies: [{ name: "proxy-a" }],
					accounts: [{ name: "second@wishtoapp.edu.kg" }],
				}),
				"utf8",
			);
			fs.writeFileSync(
				path.join(sourceDirectory, "group_001", "0001.json"),
				JSON.stringify({
					exported_at: "2026-06-06T12:01:00+00:00",
					proxies: [{ name: "proxy-a" }, { name: "proxy-b" }],
					accounts: [{ name: "first@wishtoapp.edu.kg" }],
				}),
				"utf8",
			);

			const summary = mergeSub2ApiJsonFiles({
				exportedAt: "2026-06-06T13:00:00.000Z",
				outputPath,
				sourceDirectory,
			});
			const output = JSON.parse(fs.readFileSync(outputPath, "utf8"));

			expect(summary).toEqual({
				accountCount: 2,
				outputPath,
				proxyCount: 2,
				sourceFileCount: 2,
			});
			expect(output).toEqual({
				exported_at: "2026-06-06T13:00:00.000Z",
				proxies: [{ name: "proxy-a" }, { name: "proxy-b" }],
				accounts: [{ name: "first@wishtoapp.edu.kg" }, { name: "second@wishtoapp.edu.kg" }],
			});
		} finally {
			fs.rmSync(temporaryDirectory, { force: true, recursive: true });
		}
	});
});
