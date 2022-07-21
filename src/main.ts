import { Telegraf } from 'telegraf';
import { config } from 'dotenv';

const TOKEN = (config().parsed as any)['TG_BOT_TOKEN'];

if (!TOKEN) {
	throw new Error('TG_BOT_TOKEN is not defined');
}

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
	ctx.reply('Hello!');
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
