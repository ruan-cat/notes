<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElInput, ElButton, ElMessage } from "element-plus";

const inputUrl = ref("");

// 解析 GitHub URL 提取 user 和 repo
const parseGitHubUrl = (url: string) => {
	if (!url) return null;

	// 支持多种 GitHub URL 格式
	// https://github.com/user/repo
	// https://github.com/user/repo.git
	// git@github.com:user/repo.git
	const patterns = [
		/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/,
		/github\.com\/([^/]+)\/([^/]+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return {
				user: match[1],
				repo: match[2],
			};
		}
	}

	return null;
};

// 生成 git clone 命令
const gitCloneCommand = computed(() => {
	const parsed = parseGitHubUrl(inputUrl.value);
	if (!parsed) return "";

	const { user, repo } = parsed;
	return `git clone --depth=1 https://github.com/${user}/${repo} ${repo}__${user}`;
});

// 复制到剪贴板
const copyToClipboard = () => {
	if (!gitCloneCommand.value) {
		ElMessage.warning("请输入有效的 GitHub URL");
		return;
	}

	navigator.clipboard
		.writeText(gitCloneCommand.value)
		.then(() => {
			ElMessage.success(`git浅克隆命令生成成功！命令为${gitCloneCommand.value}，已经默认复制到你的剪贴板内`);
		})
		.catch(() => {
			ElMessage.error("复制到剪贴板失败，请手动复制");
		});
};

// 清空输入
function clear() {
	inputUrl.value = "";
	ElMessage.warning("输入框已清空");
}
</script>

<template>
	<section class="make-git-clone-cmd-root">
		<div class="git-clone-input-container">
			<ElInput
				v-model="inputUrl"
				placeholder="请输入 GitHub URL，例如：https://github.com/1024-lab/smart-admin"
				clearable
				@keyup.enter="copyToClipboard"
				@keyup.esc="clear"
			>
				<template #append>
					<ElButton @click="copyToClipboard" type="primary"> 生成并复制 </ElButton>
				</template>
			</ElInput>

			<div v-if="gitCloneCommand" class="command-preview">
				<p>生成的浅克隆命令：</p>
				<code>{{ gitCloneCommand }}</code>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.make-git-clone-cmd-root {
	padding: 20px;

	.git-clone-input-container {
		max-width: 800px;
		margin: 0 auto;

		.command-preview {
			margin-top: 15px;
			padding: 10px;
			background-color: var(--vp-c-bg-soft);
			border-radius: 4px;

			p {
				margin-bottom: 5px;
				font-weight: bold;
			}

			code {
				display: block;
				padding: 10px;
				background-color: var(--vp-code-bg);
				border-radius: 4px;
				word-break: break-all;
				font-family: monospace;
			}
		}
	}
}
</style>
