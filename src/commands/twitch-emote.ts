import {
	ApplicationCommandOptionType,
} from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import axios from "axios";
import sharp from "sharp";

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
			description: "Select this to True if you want to keep the aspect ratio of the image",
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
                content: "Invalid emote format. Please type only an emote.",
                files: [
                    {
                        attachment: 'src/assets/how-to-use.png',
                        name: `how-to-use.png`
                    }
                ],
                ephemeral: true,
            });
            return;
        }

        const emoteName = emote.split(":")[1];
        const emoteId = emote.split(":")[2].split(">")[0];

        const emoteBaseUrl = `https://cdn.discordapp.com/emojis/${emoteId}.png?size=96&quality=lossless`

        const imageResponse = await axios.get(emoteBaseUrl, {
            responseType: 'arraybuffer',
          });

        const image = sharp(imageResponse.data).toFormat('png') //.resize(112, 112).toBuffer();

        let imageBuffer = null

        if (respectRatio) {

            const { width, height } = await image.metadata();
            if (!width || !height) return;
            else if (width > height) {
                imageBuffer = await image.resize({ width: 112 }).toBuffer();
            }
            else {
                imageBuffer = await image.resize({ height: 112 }).toBuffer();
            }
        }
        else {
            imageBuffer = await image.resize({ width: 112, height: 112 }).toBuffer();
        }
            
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
