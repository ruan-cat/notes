import { type Config } from "@ruan-cat/vercel-deploy-tool/src/config.ts";
import { getDomains } from "@ruan-cat/domains";

const config: Config = {
	vercelProjetName: "rpgmv-dev-notes-betd",
	vercelOrgId: "team_cUeGw4TtOCLp0bbuH8kA7BYH",
	vercelProjectId: "prj_uyMHnLoqFJAOpeBVlHZochteDZdB",
	vercelToken: "",

	deployTargets: [
		// 笔记项目
		{
			type: "static",
			targetCWD: "./docs/ruan-cat-notes/docs/.vitepress/dist",
			url: getDomains({
				projectName: "ruan-cat-notes",
				projectAlias: "notesGithubWorkflow",
			}),
		},

		// 01星球建议笔记
		{
			type: "static",
			targetCWD: "./docs/docs-01-star/docs/.vitepress/dist",
			url: getDomains("01s-doc"),
		},

		// rmmv笔记项目
		// 警告 此项目事实上长期不更新了 故暂时不需要开启部署流程
		// {
		// 	type: "userCommands",
		// 	outputDirectory: "docs/.vuepress/dist",
		// 	targetCWD: "./docs/rpgmv-dev-notes",
		// 	url: domains["rmmv-notes"] as unknown as string[],
		// 	userCommands: [
		// 		// "pnpm -C=./docs/rpgmv-dev-notes build:docs"
		// 	],
		// },
	],
};

export default config;
