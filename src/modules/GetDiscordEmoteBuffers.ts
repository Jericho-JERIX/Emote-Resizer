import axios from "axios";

export async function getDiscordEmoteBuffers(emoteId: string) {
    const emoteStaticUrl = `https://cdn.discordapp.com/emojis/${emoteId}.png?size=96&quality=lossless`
    const emoteAnimatedUrl = `https://cdn.discordapp.com/emojis/${emoteId}.gif?size=96&quality=lossless`

    const staticImageResponse = await axios.get(emoteStaticUrl, {
        responseType: 'arraybuffer',
    });

    let animatedImageResponse = null
    try {
        animatedImageResponse = await axios.get(emoteAnimatedUrl, {
            responseType: 'arraybuffer',
        });
    } catch (error) {}

    return {
        staticBuffer: staticImageResponse.data,
        animatedBuffer: animatedImageResponse?.data,
    }
}