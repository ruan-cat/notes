const isWindows = process.platform === "win32";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// https://nuxt.com/modules
	modules: ["@nuxt/eslint", "@nuxt/ui", "@vueuse/nuxt"],
	icon: {
		serverBundle: {
			collections: ["lucide", "simple-icons"],
		},
	},
	experimental: {
		payloadExtraction: !isWindows,
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
