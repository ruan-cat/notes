interface platform {
	cursor: string;
	kiro: string;
	github: string;
	openai: string;
}

interface EmailItem {
	email: string;
	order: number;
}

type RutingEmail = EmailItem & Partial<platform>;

export const routingEmails: RutingEmail[] = [
	{
		order: 1,
		email: "use-kiro-001@ruan-cat.com",
		openai: "已封号",
		github: "已封号",
		cursor: "试用期已过期。已删除账号。",
	},
	{
		order: 2,
		email: "use-kiro-002@ruan-cat.com",
		openai: "已封号",
		// Your payment method is not eligible for a free trial. You can still upgrade to a paid plan and continue using Cursor.
		cursor: "无法验证支付信息。已删除账号。",
	},
	{
		order: 3,
		email: "use-kiro-003@ruan-cat.com",
		// 无法注册，在美区ip且指纹浏览器内，卡在手机号验证环节，无法注册账号。
		// https://zhuanlan.zhihu.com/p/1944129840216273435
		// 谷歌浏览器 无痕模式 先美区进入，验证手机号时，在直接退出，以中国ip输入手机号并接受验证码。即可注册成功。
		cursor: "已注册。",
	},
	{
		order: 4,
		email: "use-kiro-004@ruan-cat.com",
		// 在无任何翻墙情况下正常注册
		cursor: "已注册。",
	},
	// use-cursor09-20260316@ruan-cat.com
	{
		order: 9,
		email: "use-cursor09-20260316@ruan-cat.com",
		openai: "",
	},
];
