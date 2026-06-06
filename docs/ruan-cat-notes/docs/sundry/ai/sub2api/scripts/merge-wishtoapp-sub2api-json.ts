import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const CONFIG: MergeSub2ApiJsonConfig = {
	sourceDirectory: "C:/Users/pc/Desktop/wishtoapp.com",
	outputPath: path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		"../has-used-sub2api-json/2026-6-6-04-wishtoapp-merged.json",
	),
};

export interface MergeSub2ApiJsonConfig {
	exportedAt?: string;
	outputPath: string;
	sourceDirectory: string;
}

export interface MergeSub2ApiJsonSummary {
	accountCount: number;
	outputPath: string;
	proxyCount: number;
	sourceFileCount: number;
}

export interface Sub2ApiExportFile {
	accounts?: unknown[];
	exported_at?: string;
	proxies?: unknown[];
	[key: string]: unknown;
}

function readJsonFile(filePath: string): Sub2ApiExportFile {
	const value = JSON.parse(fs.readFileSync(filePath, "utf8"));

	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new Error(`Source file must be a JSON object: ${filePath}`);
	}

	return value as Sub2ApiExportFile;
}

function collectJsonFiles(directoryPath: string): string[] {
	const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
	const files = entries.flatMap((entry) => {
		const entryPath = path.join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			return collectJsonFiles(entryPath);
		}

		if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
			return [entryPath];
		}

		return [];
	});

	return files.sort((left, right) => left.localeCompare(right, "en"));
}

function dedupeProxies(proxies: unknown[]) {
	const seen = new Set<string>();
	const output: unknown[] = [];

	for (const proxy of proxies) {
		const key = JSON.stringify(proxy);
		if (!seen.has(key)) {
			seen.add(key);
			output.push(proxy);
		}
	}

	return output;
}

export function mergeSub2ApiJsonFiles(config: MergeSub2ApiJsonConfig): MergeSub2ApiJsonSummary {
	const sourceFiles = collectJsonFiles(config.sourceDirectory);
	const accounts: unknown[] = [];
	const proxies: unknown[] = [];

	for (const sourceFile of sourceFiles) {
		const source = readJsonFile(sourceFile);

		if (!Array.isArray(source.accounts)) {
			throw new Error(`Source file has no accounts array: ${sourceFile}`);
		}

		accounts.push(...source.accounts);

		if (source.proxies !== undefined) {
			if (!Array.isArray(source.proxies)) {
				throw new Error(`Source file proxies field must be an array: ${sourceFile}`);
			}

			proxies.push(...source.proxies);
		}
	}

	const output = {
		exported_at: config.exportedAt ?? new Date().toISOString(),
		proxies: dedupeProxies(proxies),
		accounts,
	};

	fs.mkdirSync(path.dirname(config.outputPath), { recursive: true });
	fs.writeFileSync(config.outputPath, `${JSON.stringify(output, null, "\t")}\n`, "utf8");

	return {
		accountCount: accounts.length,
		outputPath: config.outputPath,
		proxyCount: output.proxies.length,
		sourceFileCount: sourceFiles.length,
	};
}

function isMainModule() {
	return process.argv[1] ? fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) : false;
}

if (isMainModule()) {
	const summary = mergeSub2ApiJsonFiles(CONFIG);
	console.log(`Read ${summary.sourceFileCount} JSON files`);
	console.log(`Merged ${summary.accountCount} accounts`);
	console.log(`Merged ${summary.proxyCount} proxies`);
	console.log(`Wrote ${summary.outputPath}`);
}
