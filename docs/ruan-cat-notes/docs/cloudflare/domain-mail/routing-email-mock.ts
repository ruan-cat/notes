import type { RutingEmail } from "./routing-email";

/** 用于测试分页效果的模拟数据（30 条） */
export const mockRoutingEmails: RutingEmail[] = Array.from({ length: 30 }, (_, i) => ({
	order: i + 1,
	email: `test-user-${String(i + 1).padStart(3, "0")}@ruan-cat.com`,
	cursor: i % 3 === 0 ? "已注册。" : i % 3 === 1 ? "试用期已过期。已删除账号。" : "",
	kiro: i % 4 === 0 ? "已注册。" : "",
	github: i % 5 === 0 ? "已封号" : i % 5 === 1 ? "正常使用" : "",
	openai: i % 6 === 0 ? "已封号" : i % 6 === 1 ? "正常使用" : "",
}));
