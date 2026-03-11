import { config as loadDotenvx } from "@dotenvx/dotenvx";
import { resolve } from "node:path";
import { createError, type H3Event } from "h3";
import { Octokit } from "octokit";

let _octokit: Octokit;
let _githubToken = "";
let _envLoaded = false;

function isVercelRuntime() {
	return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

function loadGithubEnv() {
	if (_envLoaded || isVercelRuntime()) {
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

function readRuntimeGithubToken(event?: H3Event) {
	const runtimeConfig = event ? useRuntimeConfig(event) : useRuntimeConfig();

	return runtimeConfig.githubToken?.trim() || "";
}

function getGithubToken(event?: H3Event) {
	const runtimeToken = readRuntimeGithubToken(event);

	if (runtimeToken) {
		return runtimeToken;
	}

	loadGithubEnv();

	const token = process.env.NUXT_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || "";

	if (!token) {
		throw createError({
			statusCode: 500,
			statusMessage:
				"Missing GitHub token. Set Vercel Production env NUXT_GITHUB_TOKEN, or define it in docs/my-pull-requests/.env(.local) for local development.",
		});
	}

	return token;
}

export function useOctokit(event?: H3Event) {
	const token = getGithubToken(event);

	if (!_octokit || _githubToken !== token) {
		_githubToken = token;
		_octokit = new Octokit({
			auth: token,
		});
	}
	return _octokit;
}

const RepoCache = new Map();

export async function fetchRepo(owner: string, name: string, event?: H3Event) {
	if (RepoCache.has(`${owner}/${name}`)) {
		return RepoCache.get(`${owner}/${name}`);
	}
	const { data } = await useOctokit(event).request("GET /repos/{owner}/{name}", {
		owner,
		name,
	});

	RepoCache.set(`${owner}/${name}`, data);
	return data;
}
