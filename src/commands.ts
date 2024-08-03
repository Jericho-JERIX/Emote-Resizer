import { Ping } from "./commands/ping";
import { TwitchEmote } from "./commands/twitch-emote";
import { SlashCommand } from "./scripts/types/SlashCommand";

export const slashCommands: SlashCommand[] = [Ping, TwitchEmote];
