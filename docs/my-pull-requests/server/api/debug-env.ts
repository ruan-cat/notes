export default defineEventHandler((event) => {
	const runtimeConfig = useRuntimeConfig(event);

	const hasRuntimeToken = Boolean(runtimeConfig.githubToken?.trim());
	const hasProcessEnvNuxt = Boolean(process.env.NUXT_GITHUB_TOKEN?.trim());
	const hasProcessEnvGithub = Boolean(process.env.GITHUB_TOKEN?.trim());
	const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
	const vercelEnv = process.env.VERCEL_ENV ?? "(not set)";

	/** 列出所有 NUXT_ 开头的环境变量名（不暴露值） */
	const nuxtEnvKeys = Object.keys(process.env).filter((k) => k.startsWith("NUXT_"));

	/** 列出所有 runtimeConfig 顶层 key */
	const runtimeConfigKeys = Object.keys(runtimeConfig).filter((k) => k !== "public" && k !== "app");

	return {
		isVercel,
		vercelEnv,
		hasRuntimeToken,
		hasProcessEnvNuxt,
		hasProcessEnvGithub,
		nuxtEnvKeys,
		runtimeConfigKeys,
		runtimeTokenLength: runtimeConfig.githubToken?.trim()?.length ?? 0,
		processEnvTokenLength: process.env.NUXT_GITHUB_TOKEN?.trim()?.length ?? 0,
	};
});
