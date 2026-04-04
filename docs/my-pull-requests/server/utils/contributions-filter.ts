import type { PullRequest } from "../../shared/types";

/** 解析查询参数中的 includeOwnRepos 开关，默认关闭。 */
export function parseIncludeOwnReposQuery(value: string | string[] | undefined): boolean {
	const rawValue = Array.isArray(value) ? value[0] : value;
	if (!rawValue) {
		return false;
	}

	return ["1", "true", "on", "yes"].includes(rawValue.trim().toLowerCase());
}

/** 按仓库 owner 是否等于当前用户筛掉“给自己仓库提的 PR”。 */
export function filterPullRequestsByOwnRepo(
	prs: PullRequest[],
	username: string,
	includeOwnRepos: boolean,
): PullRequest[] {
	if (includeOwnRepos) {
		return prs;
	}

	const normalizedUsername = username.trim().toLowerCase();
	if (!normalizedUsername) {
		return prs;
	}

	return prs.filter((pr) => {
		const repoOwner = pr.repo.split("/")[0]?.trim().toLowerCase();
		return repoOwner !== normalizedUsername;
	});
}
