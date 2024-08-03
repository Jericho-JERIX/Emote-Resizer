import {
	ApplicationCommandOptionType,
} from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import axios from "axios";
import sharp from "sharp";

export const TwitchEmote: SlashCommand = {
	name: "twitch-emote",
	description: "Replies with pong!!!",
	options: [
		{
			name: "emote",
			description: "Put your discord emote here",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],

	async onCommandExecuted(interaction) {
		const emoteOption = interaction.options.get("emote");

        if (!emoteOption) return;

        const emote = emoteOption.value as string;
        const emoteName = emote.split(":")[1];
        const emoteId = emote.split(":")[2].split(">")[0];

        const emoteBaseUrl = `https://cdn.discordapp.com/emojis/${emoteId}.png?size=96&quality=lossless`

        const imageResponse = await axios.get(emoteBaseUrl, {
            responseType: 'arraybuffer',
          });

        const img = await sharp(imageResponse.data).toFormat('png').resize(112, 112).toBuffer();
        await sharp(img).toFile('src/resources/test.png');

        await interaction.reply({
            content: "Here is your emote!\n(PNG File with 112x112 Pixels Size)",
            files: [
                {
                    attachment: 'src/resources/test.png',
                    name: `${emoteName}_${emoteId}.png`
                }
            ]
        });

	},
};
