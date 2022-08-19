import { BotCommand } from 'telegraf/typings/core/types/typegram';

export function hasCommandDifference(commands: BotCommand[], otherCommands: BotCommand[]): boolean {
	if (commands.length !== otherCommands.length) {
		return true;
	}

	for (const command of commands) {
		const foundCommand = otherCommands.find(
			(other) => other.command === command.command && other.description === command.description,
		);

		if (!foundCommand) {
			return false;
		}
	}

	return false;
}
