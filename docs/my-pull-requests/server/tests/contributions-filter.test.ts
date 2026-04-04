import { describe, expect, test } from "vitest";

import type { PullRequest } from "../../shared/types";
import { filterPullRequestsByOwnRepo, parseIncludeOwnReposQuery } from "../utils/contributions-filter";

const samplePrs: PullRequest[] = [
	{
		repo: "ruan-cat/rm-monorepo",
		title: "Own repo PR",
		url: "https://github.com/ruan-cat/rm-monorepo/pull/1",
		created_at: "2026-04-05T00:00:00.000Z",
		state: "merged",
		number: 1,
		type: "User",
		stars: 1,
	},
	{
		repo: "atinux/my-pull-requests",
		title: "External repo PR",
		url: "https://github.com/atinux/my-pull-requests/pull/2",
		created_at: "2026-04-04T00:00:00.000Z",
		state: "open",
		number: 2,
		type: "User",
		stars: 10,
	},
];

describe("filterPullRequestsByOwnRepo", () => {
	test("hides pull requests to repositories owned by the current user by default", () => {
		const filteredPrs = filterPullRequestsByOwnRepo(samplePrs, "ruan-cat", false);

		expect(filteredPrs).toEqual([samplePrs[1]]);
	});

	test("includes pull requests to repositories owned by the current user when enabled", () => {
		const filteredPrs = filterPullRequestsByOwnRepo(samplePrs, "ruan-cat", true);

		expect(filteredPrs).toEqual(samplePrs);
	});

	test("matches repository owner without case sensitivity", () => {
		const filteredPrs = filterPullRequestsByOwnRepo(samplePrs, "Ruan-Cat", false);

		expect(filteredPrs).toEqual([samplePrs[1]]);
	});
});

describe("parseIncludeOwnReposQuery", () => {
	test("defaults to false when query is missing", () => {
		expect(parseIncludeOwnReposQuery(undefined)).toBe(false);
	});

	test("returns true for string true values", () => {
		expect(parseIncludeOwnReposQuery("true")).toBe(true);
		expect(parseIncludeOwnReposQuery("1")).toBe(true);
		expect(parseIncludeOwnReposQuery("on")).toBe(true);
	});

	test("returns false for other query values", () => {
		expect(parseIncludeOwnReposQuery("false")).toBe(false);
		expect(parseIncludeOwnReposQuery("0")).toBe(false);
		expect(parseIncludeOwnReposQuery(["true", "false"])).toBe(true);
	});
});
