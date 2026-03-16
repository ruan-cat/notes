interface platform {
	cursor: string;
	kiro: string;
	github: string;
	openai: string;
}

interface EmailItem {
	email: string;
}

type RutingEmail = EmailItem & Partial<platform>;

export const routingEmails: RutingEmail[] = [
	{
		email: "use-kiro-001@ruan-cat.com",
		openai: "已封号",
		cursor: "试用期已过期",
	},
	{
		email: "use-kiro-002@ruan-cat.com",
		openai: "已封号",
	},
];
