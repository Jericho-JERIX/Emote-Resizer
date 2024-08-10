import {
	ApplicationCommandOptionType,
} from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import axios from "axios";
import sharp from "sharp";

export const TwitchEmote: SlashCommand = {
	name: "png",
	description: "Transform a Discord emote into a 112x112 PNG image",
	options: [
		{
			name: "image-url",
			description: "Put your Discord emote here",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: "image-file",
			description: "Select this to True if you want to keep the aspect ratio of the image",
			type: ApplicationCommandOptionType.Attachment,
			required: false,
		},
	],

	async onCommandExecuted(interaction) {
		const emoteOption = interaction.options.get("emote");
		const respectRatioOption = interaction.options.get("respect-ratio");

        const image = sharp(imageResponse.data).toFormat('png')
        const imageBuffer = await image.toBuffer();
            
        await sharp(imageBuffer).toFile('src/resources/test.png');

        await interaction.reply({
            files: [
                {
                    attachment: 'src/resources/test.png',
                    name: `${emoteName}_${emoteId}.png`
                }
            ]
        });

	},
};
