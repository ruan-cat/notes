import { defineConfig } from "vite";
import vercel from "vite-plugin-vercel";

export default defineConfig(({ mode }) => {
	return {
		plugins: [vercel()],
	};
});
