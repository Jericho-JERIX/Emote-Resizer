import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import ImageProcessingService from "../services/ImageProcessing.service";

export const TwitchEmote: SlashCommand = {
	name: "twitch-emote",
	description: "Transform a Discord emote into a 112x112 PNG image",
	options: [
		{
			name: "emote",
			description: "Put your Discord emote here",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "respect-ratio",
			description:
				"Select this to True if you want to keep the aspect ratio of the image",
			type: ApplicationCommandOptionType.Boolean,
			required: false,
		},
	],

	async onCommandExecuted(interaction) {
		const emoteOption = interaction.options.get("emote");
		const respectRatioOption = interaction.options.get("respect-ratio");

		if (!emoteOption) return;

		const emote = emoteOption.value as string;
		const respectRatio = respectRatioOption?.value as boolean;

		if (emote.split(":").length < 3) {
			await interaction.reply({
				content: "Invalid emote format. Please try again by type only an emote.",
				files: [
					{
						attachment: "src/assets/how-to-use.png",
						name: `how-to-use.png`,
					},
				],
				ephemeral: true,
			});
			return;
		}

		const emoteName = emote.split(":")[1];
		const emoteId = emote.split(":")[2].split(">")[0];

        const buffers = await ImageProcessingService.getDiscordEmoteBuffers(emoteId);

		const twitchEmote =
			await ImageProcessingService.createTwitchEmote(
				buffers,
				emoteName,
				{ respectRatio }
			);

		await interaction.reply({
			files: [
				{
					attachment: twitchEmote.filePath,
					name: twitchEmote.filename,
				},
			],
		});
	},
};
