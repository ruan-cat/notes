import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../has-used-sub2api-json");
const TARGET_FILE_NAME = "2026-7-14-01-k12.json";
const ACCOUNT_BATCH_PREFIX = "2026-7-14-01-k12";
const notes =
	"2026-7-14-01-k12 2个 1.8元 \n https://pay.ldxp.cn/shop/TTEF5IWE \n https://pay.ldxp.cn/item/cq9fqx \n https://cvt.okcode.cc.cd";

const CONFIG: RewriteSub2ApiAccountNamesConfig = {
	inputPath: path.join(DATA_DIRECTORY, TARGET_FILE_NAME),
	namePrefix: ACCOUNT_BATCH_PREFIX,
	notes: notes || ACCOUNT_BATCH_PREFIX,
	outputPath: path.join(DATA_DIRECTORY, TARGET_FILE_NAME),
};

export interface RewriteSub2ApiAccountNamesConfig {
	inputPath: string;
	namePrefix: string;
	notes?: string;
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
	notes?: string;
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

function rewriteAccountMetadata(
	account: AccountRecord,
	params: Pick<RewriteSub2ApiAccountNamesConfig, "namePrefix" | "notes">,
): AccountRecord {
	const { name: _name, notes: _notes, ...rest } = account;

	return {
		name: `${params.namePrefix}|${getEmailLocalName(account)}`,
		...(params.notes === undefined ? {} : { notes: params.notes }),
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
		accounts: source.accounts.map((account) =>
			rewriteAccountMetadata(account, {
				namePrefix: config.namePrefix,
				notes: config.notes,
			}),
		),
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
