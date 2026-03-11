<script setup lang="ts">
const colorMode = useColorMode();
const { data: contributions, error } = await useFetch<Contributions>("/api/contributions");

const user = computed(() => contributions.value?.user);
const safeUser = computed<User>(
	() =>
		user.value ?? {
			name: "GitHub User",
			username: "",
			avatar: "",
		},
);
const prs = computed(() => contributions.value?.prs ?? []);
const userUrl = computed(() => (user.value ? `https://github.com/${user.value.username}` : "https://github.com"));
const errorMessage = computed(
	() => error.value?.statusMessage || error.value?.message || "加载 GitHub 数据时出错，请稍后重试。",
);

useHead(() => ({
	link: [
		{ rel: "icon", href: "/favicon.png" },
		{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
		{
			rel: "alternate",
			type: "application/rss+xml",
			title: user.value ? `${user.value.name}'s recent pull requests` : "Recent pull requests",
			href: "/feed.xml",
		},
	],
}));
const url = useRequestURL();
useSeoMeta({
	title: () => (user.value ? `${user.value.name} is Contributing` : "Contributing"),
	description: () =>
		user.value
			? `Discover ${user.value.name} recent pull requests on GitHub.`
			: "Discover recent pull requests on GitHub.",
	ogTitle: () => (user.value ? `${user.value.name} is Contributing` : "Contributing"),
	ogDescription: () =>
		user.value
			? `Discover ${user.value.name} recent pull requests on GitHub.`
			: "Discover recent pull requests on GitHub.",
	twitterCard: "summary_large_image",
	ogImage: `${url.origin}/og.png`,
	twitterImage: `${url.origin}/og.png`,
});

const order = ref<"asc" | "desc">("desc");
const orderKey = ref<"date" | "star">("date");

const items = computed(() => [
	[
		{
			label: "Star",
			icon: "i-lucide-star",
			checked: orderKey.value === "star",
			type: "checkbox" as const,
			onUpdateChecked(checked: boolean) {
				orderKey.value = checked ? "star" : "date";
			},
			onSelect(e: Event) {
				e.preventDefault();
			},
		},
	],
	[
		{
			label: orderKey.value === "date" ? "Oldset" : "Ascending",
			icon: "i-lucide-arrow-up-narrow-wide",
			checked: order.value === "asc",
			type: "checkbox" as const,
			onUpdateChecked(checked: boolean) {
				if (!checked) return;
				order.value = "asc";
			},
			onSelect(e: Event) {
				e.preventDefault();
			},
		},
		{
			label: orderKey.value === "date" ? "Newest" : "Descending",
			icon: "i-lucide-arrow-down-narrow-wide",
			checked: order.value === "desc",
			type: "checkbox" as const,
			onUpdateChecked(checked: boolean) {
				if (!checked) return;
				order.value = "desc";
			},
			onSelect(e: Event) {
				e.preventDefault();
			},
		},
	],
]);

const orderedPrs = computed(() => {
	const sortedPrs = [...prs.value];
	sortedPrs.sort((a, b) => {
		if (orderKey.value === "star") {
			return order.value === "asc" ? a.stars - b.stars : b.stars - a.stars;
		} else {
			const dateA = new Date(a.created_at).getTime();
			const dateB = new Date(b.created_at).getTime();
			return order.value === "asc" ? dateA - dateB : dateB - dateA;
		}
	});
	return sortedPrs;
});

function reloadPage() {
	if (import.meta.client) {
		window.location.reload();
	}
}
</script>

<template>
	<UContainer class="p-4 sm:p-6 lg:p-8 lg:pt-10 max-w-3xl">
		<!-- 错误状态 -->
		<div v-if="error" class="flex flex-col items-center gap-4 py-20">
			<div class="text-6xl">⚠️</div>
			<h1 class="text-2xl font-bold text-center">无法加载用户活动</h1>
			<p class="text-center text-neutral-600 dark:text-neutral-400 max-w-md">
				{{ errorMessage }}
			</p>
			<UButton @click="reloadPage" color="neutral" variant="soft"> 重新加载 </UButton>
		</div>

		<!-- 加载状态 -->
		<div v-else-if="!user" class="flex flex-col items-center gap-4 py-20">
			<div class="text-6xl animate-pulse">⏳</div>
			<p class="text-center text-neutral-600 dark:text-neutral-400">加载中...</p>
		</div>

		<!-- 正常内容 -->
		<div v-else class="flex flex-col items-center gap-2">
			<a :href="userUrl" target="_blank"><UAvatar :src="safeUser.avatar" :alt="safeUser.name" size="xl" /> </a>
			<h1 class="text-2xl sm:text-3xl text-center">
				<a :href="userUrl" target="_blank">
					{{ safeUser.name }}
				</a>
				is <span class="animate-pulse">Contributing...</span>
			</h1>
			<p class="text-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300">
				<NuxtLink :to="userUrl" target="_blank"> @{{ safeUser.username }}'s recent pull requests on GitHub. </NuxtLink>
			</p>
			<div class="flex items-center justify-center gap-1 text-neutral-700 dark:text-neutral-300">
				<ClientOnly>
					<UButton
						:aria-label="`${safeUser.name}'s GitHub profile`"
						:icon="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
						color="neutral"
						variant="link"
						@click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
					/>
					<template #fallback>
						<div class="w-8 h-8" />
					</template>
				</ClientOnly>
				<UButton
					:to="userUrl"
					external
					target="_blank"
					:aria-label="`${safeUser.name}'s GitHub profile`"
					icon="i-lucide-github"
					color="neutral"
					variant="link"
				/>
				<UButton
					to="/feed.xml"
					external
					target="_blank"
					aria-label="RSS Feed"
					icon="i-lucide-rss"
					color="neutral"
					variant="link"
				/>
			</div>
			<USeparator class="mt-2 sm:mt-6 mb-6 sm:mb-10 w-1/2 mx-auto animate-pulse" />
		</div>

		<div class="relative">
			<div class="flex justify-end absolute -top-10 lg:-top-12 right-0">
				<UDropdownMenu
					:items="items"
					:content="{
						align: 'start',
						side: 'bottom',
						sideOffset: 8,
					}"
					:ui="{
						content: 'w-48',
					}"
					size="xs"
				>
					<UButton
						:label="orderKey === 'star' ? 'Stars' : order === 'asc' ? 'Oldset' : 'Newset'"
						:icon="order === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-narrow-wide'"
						color="neutral"
						variant="soft"
						size="xs"
					/>
				</UDropdownMenu>
			</div>
			<div class="flex flex-col gap-6 mt-5 sm:gap-10">
				<PullRequest v-for="pr of orderedPrs" :key="pr.url" :data="pr" />
			</div>
		</div>
	</UContainer>
</template>
