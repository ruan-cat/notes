import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { describe, expect, test } from "vitest";

import { rewriteSub2ApiAccountNames } from "../docs/sundry/ai/sub2api/scripts/rewrite-wishtoapp-sub2api-name";

describe("rewrite wishtoapp sub2api account name", () => {
	test("rewrites account name with prefix and email local name", () => {
		const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "sub2api-rewrite-name-"));
		const inputPath = path.join(temporaryDirectory, "input.json");
		const outputPath = path.join(temporaryDirectory, "2026-6-6-05.json");

		try {
			fs.writeFileSync(
				inputPath,
				JSON.stringify({
					exported_at: "2026-06-06T13:29:18.889Z",
					proxies: [],
					accounts: [
						{
							name: "old-name",
							credentials: {
								email: "credential-name@wishtoapp.edu.kg",
							},
							extra: {
								email: "extra-name@wishtoapp.edu.kg",
							},
						},
					],
				}),
				"utf8",
			);

			const summary = rewriteSub2ApiAccountNames({
				inputPath,
				namePrefix: "2026-6-6-05",
				outputPath,
			});
			const output = JSON.parse(fs.readFileSync(outputPath, "utf8"));

			expect(summary).toEqual({
				accountCount: 1,
				outputPath,
			});
			expect(output.accounts[0].name).toBe("2026-6-6-05|extra-name");
			expect(output.accounts[0].credentials.email).toBe("credential-name@wishtoapp.edu.kg");
			expect(output.exported_at).toBe("2026-06-06T13:29:18.889Z");
		} finally {
			fs.rmSync(temporaryDirectory, { force: true, recursive: true });
		}
	});
});
