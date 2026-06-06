import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIRECTORY = "C:/Users/pc/Desktop/wishtoapp.com/2500-form-part";

const CONFIG: RewriteSub2ApiAccountNamesConfig = {
	inputPath: path.join(DATA_DIRECTORY, "sub2api-2026-06-06_21-36-16.json"),
	namePrefix: "2026-6-6-06",
	outputPath: path.join(DATA_DIRECTORY, "2026-6-6-06.json"),
};

export interface RewriteSub2ApiAccountNamesConfig {
	inputPath: string;
	namePrefix: string;
	outputPath: string;
}

export interface RewriteSub2ApiAccountNamesSummary {
	accountCount: number;
	outputPath: string;
}

export interface AccountRecord {
	credentials?: {
		email?: string;
		[key: string]: unknown;
	};
	extra?: {
		email?: string;
		name?: string;
		[key: string]: unknown;
	};
	name?: string;
	[key: string]: unknown;
}

export interface Sub2ApiExportFile {
	accounts?: AccountRecord[];
	[key: string]: unknown;
}

function getEmailLocalName(account: AccountRecord) {
	const emailSource = account.extra?.email ?? account.extra?.name ?? account.credentials?.email ?? account.name ?? "";
	const emailLocalName = String(emailSource).split("@")[0];

	if (!emailLocalName) {
		throw new Error(`Cannot resolve email local name from account: ${JSON.stringify(account)}`);
	}

	return emailLocalName;
}

function rewriteAccountName(account: AccountRecord, namePrefix: string): AccountRecord {
	const { name: _name, ...rest } = account;

	return {
		name: `${namePrefix}|${getEmailLocalName(account)}`,
		...rest,
	};
}

export function rewriteSub2ApiAccountNames(
	config: RewriteSub2ApiAccountNamesConfig,
): RewriteSub2ApiAccountNamesSummary {
	const source = JSON.parse(fs.readFileSync(config.inputPath, "utf8")) as Sub2ApiExportFile;

	if (!Array.isArray(source.accounts)) {
		throw new Error(`Source file has no accounts array: ${config.inputPath}`);
	}

	const output = {
		...source,
		accounts: source.accounts.map((account) => rewriteAccountName(account, config.namePrefix)),
	};

	fs.mkdirSync(path.dirname(config.outputPath), { recursive: true });
	fs.writeFileSync(config.outputPath, `${JSON.stringify(output, null, "\t")}\n`, "utf8");

	return {
		accountCount: output.accounts.length,
		outputPath: config.outputPath,
	};
}

function isMainModule() {
	return process.argv[1] ? fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) : false;
}

if (isMainModule()) {
	const summary = rewriteSub2ApiAccountNames(CONFIG);
	console.log(`Rewrote ${summary.accountCount} account names`);
	console.log(`Wrote ${summary.outputPath}`);
}
