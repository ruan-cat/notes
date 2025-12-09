import { defineConfig } from "vite";
export default defineConfig(({ mode }) => {
	return {
		/** @see https://github.com/magne4000/vite-plugin-vercel/tree/v9 */
		vercel: {
			rewrites: [
				// https://segmentfault.com/a/1190000042276351
				{ source: "/backend/(.*)", destination: "/api/proxy" },
			],
		},
	};
});
