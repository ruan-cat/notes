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
	exported_at?: string;
	proxies?: unknown[];
	[key: string]: unknown;
}

export interface RewriteSub2ApiJsonOptions {
	accountBatchPrefix: string;
	exportedAt?: string;
	notes: string;
}

export interface RewrittenAccountPreview {
	afterName: string;
	beforeName: string;
	emailLocalName: string;
	index: number;
}

export interface RewriteSub2ApiJsonResult {
	accountCount: number;
	duplicateNames: string[];
	output: Sub2ApiExportFile;
	preview: RewrittenAccountPreview[];
}

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function resolveEmailLocalName(account: AccountRecord, index: number) {
	const emailSource = account.extra?.email ?? account.extra?.name ?? account.credentials?.email ?? account.name ?? "";
	const emailLocalName = String(emailSource).split("@")[0];

	if (!emailLocalName) {
		throw new Error(`Cannot resolve email local name from account at index ${index}.`);
	}

	return emailLocalName;
}

function toPreviewName(name: unknown) {
	return name === undefined || name === null ? "" : String(name);
}

function collectDuplicateNames(names: string[]) {
	const seenNames = new Set<string>();
	const duplicateNames = new Set<string>();

	for (const name of names) {
		if (seenNames.has(name)) {
			duplicateNames.add(name);
			continue;
		}

		seenNames.add(name);
	}

	return Array.from(duplicateNames);
}

export function parseSub2ApiJsonText(text: string): Sub2ApiExportFile {
	let value: unknown;

	try {
		value = JSON.parse(text);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Invalid JSON text: ${message}`);
	}

	if (!isJsonRecord(value)) {
		throw new Error("Sub2API JSON root must be an object.");
	}

	return value as Sub2ApiExportFile;
}

export function rewriteSub2ApiJson(
	source: Sub2ApiExportFile,
	options: RewriteSub2ApiJsonOptions,
): RewriteSub2ApiJsonResult {
	const accountBatchPrefix = options.accountBatchPrefix;

	if (!accountBatchPrefix.trim()) {
		throw new Error("ACCOUNT_BATCH_PREFIX cannot be blank.");
	}

	if (!Array.isArray(source.accounts)) {
		throw new Error("Sub2API JSON must contain an accounts array.");
	}

	if (source.proxies !== undefined && !Array.isArray(source.proxies)) {
		throw new Error("Sub2API JSON proxies field must be an array when present.");
	}

	const rewrittenNames: string[] = [];
	const preview: RewrittenAccountPreview[] = [];
	const notesValue = options.notes || accountBatchPrefix;
	const accounts = source.accounts.map((account, index) => {
		if (!isJsonRecord(account)) {
			throw new Error(`Account at index ${index} must be an object.`);
		}

		const emailLocalName = resolveEmailLocalName(account, index);
		const nextName = `${accountBatchPrefix}|${emailLocalName}`;
		const { name: _oldName, notes: _oldNotes, ...rest } = account;

		rewrittenNames.push(nextName);
		preview.push({
			afterName: nextName,
			beforeName: toPreviewName(account.name),
			emailLocalName,
			index,
		});

		return {
			name: nextName,
			notes: notesValue,
			...rest,
		};
	});

	return {
		accountCount: accounts.length,
		duplicateNames: collectDuplicateNames(rewrittenNames),
		output: {
			...source,
			exported_at: source.exported_at ?? options.exportedAt ?? new Date().toISOString(),
			proxies: source.proxies ?? [],
			accounts,
		},
		preview,
	};
}

export function stringifySub2ApiJson(value: Sub2ApiExportFile): string {
	return `${JSON.stringify(value, null, "\t")}\n`;
}

export function sanitizeJsonFileName(fileName: string): string {
	const sanitizedName = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, "").trim() || "sub2api-output";

	return sanitizedName.toLowerCase().endsWith(".json") ? sanitizedName : `${sanitizedName}.json`;
}

export function createDefaultOutputFileName(sourceFileName: string | undefined, accountBatchPrefix: string): string {
	const fileName = sourceFileName?.trim() || `${accountBatchPrefix}.json`;

	return sanitizeJsonFileName(fileName);
}
