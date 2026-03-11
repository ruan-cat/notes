/**
 * `nuxi build --preset vercel` 会在 Nitro 收尾阶段为 ISR/payload 生成函数别名。
 * 当 payload extraction 开启时，`/_payload.json` 这类派生路由会在 Vercel preset 下
 * 触发错误的绝对路径符号链接解析，GitHub Actions 和 Windows 本地都可能失败。
 */
const isVercelPreset = process.argv.includes("--preset") && process.argv.includes("vercel");

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// https://nuxt.com/modules
	modules: ["@nuxt/eslint", "@nuxt/ui", "@vueuse/nuxt"],
	runtimeConfig: {
		githubToken: "",
	},
	icon: {
		serverBundle: {
			collections: ["lucide", "simple-icons"],
		},
	},
	experimental: {
		payloadExtraction: !isVercelPreset,
	},

	$production: {
		routeRules: {
			"/": { isr: 60 * 5 },
			"/api/contributions": { isr: 60 * 5 },
			"/feed.xml": { isr: 60 * 5 },
		},
	},

	// https://devtools.nuxt.com
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],

	// https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
	// compatibilityDate: "2025-01-01",
	compatibilityDate: {
		// https://v3.nitro.build/deploy/providers/cloudflare
		cloudflare: "2024-09-19",
		// https://nitro.build/deploy/providers/vercel#observability
		vercel: "2024-09-19",
	},

	// https://eslint.nuxt.com
	eslint: {
		config: {
			stylistic: {
				quotes: "single",
			},
		},
	},
});
