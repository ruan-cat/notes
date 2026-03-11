import { createError } from "h3";

export default defineEventHandler(async (event) => {
	try {
		const octokit = useOctokit(event);
		const userResponse = await octokit.request("GET /user");
		const user: User = {
			name: userResponse.data.name ?? userResponse.data.login,
			username: userResponse.data.login,
			avatar: userResponse.data.avatar_url,
		};
		const { data } = await octokit.request("GET /search/issues", {
			q: `type:pr+author:"${user.username}"`,
			per_page: 50,
			page: 1,
			advanced_search: "true",
		});

		const filteredPrs = data.items.filter((pr) => !(pr.state === "closed" && !pr.pull_request?.merged_at));
		const prs: PullRequest[] = [];

		for (const pr of filteredPrs) {
			const [owner, name] = pr.repository_url.split("/").slice(-2);
			const repo = await fetchRepo(owner!, name!, event);

			prs.push({
				repo: `${owner}/${name}`,
				title: pr.title,
				url: pr.html_url,
				created_at: pr.created_at,
				state: pr.pull_request?.merged_at ? "merged" : pr.draft ? "draft" : (pr.state as "open" | "closed"),
				number: pr.number,
				type: repo.owner.type,
				stars: repo.stargazers_count,
			});
		}

		return {
			user,
			prs,
		} as Contributions;
	} catch (error: any) {
		if (error?.status === 401) {
			throw createError({
				statusCode: 500,
				statusMessage:
					"GitHub token was loaded but rejected by GitHub. Verify the Vercel Production environment variable NUXT_GITHUB_TOKEN, then redeploy.",
			});
		}

		throw error;
	}
});
