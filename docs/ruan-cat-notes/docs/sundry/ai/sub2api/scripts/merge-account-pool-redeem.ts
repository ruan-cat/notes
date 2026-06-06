import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 手动配置区
 *
 * 每次执行脚本前，按本批次数据手动修改以下字段。
 */
const CONFIG: MergeAccountPoolRedeemConfig = {
	dataDirectory: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../has-used-sub2api-json"),
	inputFileNames: [
		"account-pool-redeem-sub2api-2026-06-06T09-16-40-340Z.json",
		"account-pool-redeem-sub2api-2026-06-06T09-17-50-682Z.json",
		"account-pool-redeem-sub2api-2026-06-06T09-18-09-585Z.json",
	],
	namePrefix: "2026-6-6-02-ldxp:G5V6NZEZ:g46pmy|",
	notes: "2026-6-6-02-ldxp:G5V6NZEZ:g46pmy ",
	outputFileName: "2026-6-6-02-ldxp-G5V6NZEZ.json",
};

export interface MergeAccountPoolRedeemConfig {
	dataDirectory: string;
	inputFileNames: string[];
	namePrefix: string;
	notes: string;
	outputFileName: string;
}

export interface MergeAccountPoolRedeemSummary {
	accountCount: number;
	outputPath: string;
}

export interface AccountRecord {
	name?: string;
	notes?: string;
	credentials?: {
		email?: string;
		[key: string]: unknown;
	};
	extra?: {
		email?: string;
		name?: string;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

export interface AccountPoolRedeemFile {
	accounts?: AccountRecord[];
	[key: string]: unknown;
}

function getAccountIdentity(account: AccountRecord) {
	const identitySource =
		account.extra?.name ?? account.extra?.email ?? account.credentials?.email ?? account.name ?? "";
	const identity = String(identitySource).split("@")[0];
	if (!identity) {
		throw new Error(`Cannot resolve account identity from account: ${JSON.stringify(account)}`);
	}
	return identity;
}

export function mergeAccounts(
	accounts: AccountRecord[],
	params: Pick<MergeAccountPoolRedeemConfig, "namePrefix" | "notes">,
) {
	return accounts.map((account) => {
		const { name: _name, notes: _notes, ...rest } = account;

		return {
			name: `${params.namePrefix}${getAccountIdentity(account)}`,
			notes: params.notes,
			...rest,
		};
	});
}

function readSourceAccounts(config: MergeAccountPoolRedeemConfig) {
	return config.inputFileNames.flatMap((fileName) => {
		const filePath = path.join(config.dataDirectory, fileName);
		const source = JSON.parse(fs.readFileSync(filePath, "utf8")) as AccountPoolRedeemFile;

		if (!Array.isArray(source.accounts)) {
			throw new Error(`Source file has no accounts array: ${filePath}`);
		}

		return source.accounts;
	});
}

export function runMergeAccountPoolRedeem(config: MergeAccountPoolRedeemConfig): MergeAccountPoolRedeemSummary {
	const accounts = readSourceAccounts(config);
	const outputAccounts = mergeAccounts(accounts, {
		namePrefix: config.namePrefix,
		notes: config.notes,
	});
	const outputPath = path.join(config.dataDirectory, config.outputFileName);

	fs.writeFileSync(outputPath, `${JSON.stringify({ accounts: outputAccounts }, null, "\t")}\n`, "utf8");

	return {
		accountCount: outputAccounts.length,
		outputPath,
	};
}

function isMainModule() {
	return process.argv[1] ? fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) : false;
}

if (isMainModule()) {
	const summary = runMergeAccountPoolRedeem(CONFIG);
	console.log(`Merged ${summary.accountCount} accounts into ${summary.outputPath}`);
}
