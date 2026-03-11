import { config as loadDotenvx } from "@dotenvx/dotenvx";
import { resolve } from "node:path";
import { createError } from "h3";
import { Octokit } from "octokit";

let _octokit: Octokit;
let _githubToken = "";
let _envLoaded = false;

function loadGithubEnv() {
	if (_envLoaded) {
		return;
	}

	_envLoaded = true;

	const cwd = process.cwd();
	const envPaths = Array.from(
		new Set([
			resolve(cwd, ".env.local"),
			resolve(cwd, ".env"),
			resolve(cwd, "docs/my-pull-requests/.env.local"),
			resolve(cwd, "docs/my-pull-requests/.env"),
			resolve(cwd, "../../.env.local"),
			resolve(cwd, "../../.env"),
		]),
	);

	loadDotenvx({
		path: envPaths,
		quiet: true,
		ignore: ["MISSING_ENV_FILE"],
	});
}

function getGithubToken() {
	loadGithubEnv();

	const token = process.env.NUXT_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || "";

	if (!token) {
		throw createError({
			statusCode: 500,
			statusMessage:
				"Missing GitHub token. Set NUXT_GITHUB_TOKEN or GITHUB_TOKEN in Vercel, or define it in docs/my-pull-requests/.env(.local).",
		});
	}

	return token;
}

export function useOctokit() {
	const token = getGithubToken();

	if (!_octokit || _githubToken !== token) {
		_githubToken = token;
		_octokit = new Octokit({
			auth: token,
		});
	}
	return _octokit;
}

const RepoCache = new Map();

export async function fetchRepo(owner: string, name: string) {
	if (RepoCache.has(`${owner}/${name}`)) {
		return RepoCache.get(`${owner}/${name}`);
	}
	const { data } = await useOctokit().request("GET /repos/{owner}/{name}", {
		owner,
		name,
	});

	RepoCache.set(`${owner}/${name}`, data);
	return data;
}
