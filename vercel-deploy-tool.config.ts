import { getDomains } from "@ruan-cat/domains/dist/index.js";
import { defineConfig } from "@ruan-cat/vercel-deploy-tool";

export default defineConfig({
	vercelProjectName: "rpgmv-dev-notes-betd",
	vercelOrgId: process.env.VERCEL_ORG_ID || "team_cUeGw4TtOCLp0bbuH8kA7BYH",
	vercelProjectId: process.env.VERCEL_PROJECT_ID || "prj_uyMHnLoqFJAOpeBVlHZochteDZdB",
	vercelToken: process.env.VERCEL_TOKEN || "",

	deployTargets: [
		// 需要上传的文件太多了 故不考虑在github action内完成部署
		// {
		// 	type: "static",
		// 	targetCWD: "./docs/ruan-cat-notes/docs/.vitepress/dist",
		// 	url: getDomains({
		// 		projectName: "ruan-cat-notes",
		// 		projectAlias: "notesGithubWorkflow",
		// 	}),
		// },
		// 需要上传的文件太多了 故不考虑在github action内完成部署
		// {
		// 	type: "static",
		// 	targetCWD: "./docs/docs-01-star/docs/.vitepress/dist",
		// 	url: getDomains("01s-doc"),
		// },
		{
			type: "static",
			targetCWD: "./docs/my-pull-requests/.vercel/output",
			url: getDomains("gh"),
		},
	],
});
