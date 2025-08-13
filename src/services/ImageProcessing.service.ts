import axios from "axios";
import { ImageFilePath } from "../constants/ImageFilePath.constant";
import sharp, { Sharp } from "sharp";

export interface ProcessOptions {
	respectRatio?: boolean;
}

export interface ImageBuffer {
	staticBuffer: Buffer;
	animatedBuffer: Buffer;
}

export interface ImageProfile {
	filename: string;
	filePath: string;
}

export default class ImageProcessingService {
	static generateImageProfile(
		name: string,
		type: "png" | "gif"
	): ImageProfile {
		return {
			filename: `${name}.${type}`,
			filePath: `${ImageFilePath}/${name}.${type}`,
		};
	}

	static async getDiscordEmoteBuffers(emoteId: string): Promise<ImageBuffer> {
		const emoteStaticUrl = `https://cdn.discordapp.com/emojis/${emoteId}.png?size=96&quality=lossless`;
		const emoteAnimatedUrl = `https://cdn.discordapp.com/emojis/${emoteId}.gif?size=96&quality=lossless`;

		const staticImageResponse = await axios.get(emoteStaticUrl, {
			responseType: "arraybuffer",
		});

		let animatedImageResponse = null;
		try {
			animatedImageResponse = await axios.get(emoteAnimatedUrl, {
				responseType: "arraybuffer",
			});
		} catch (error) {}

		return {
			staticBuffer: staticImageResponse.data,
			animatedBuffer: animatedImageResponse?.data,
		};
	}

    static async getImageUrlBuffer(url: string): Promise<Buffer> {
        const imageResponse = await axios.get(url, {
            responseType: "arraybuffer",
        });

        return imageResponse.data;
    }

	static async processImage(
		image: Sharp,
		options?: ProcessOptions
	): Promise<Sharp> {
		if (options?.respectRatio) {
			const { width, height } = await image.metadata();

			if (!width || !height) {
				return image;
			} else if (width > height) {
				image = image.resize({ width: 112 });
			} else {
				image = image.resize({ height: 112 });
			}
		} else {
			image = image.resize({ width: 112, height: 112 });
		}
		return image;
	}

	static async createTwitchEmote(
		imageBuffer: ImageBuffer,
		filename: string,
		options?: ProcessOptions
	): Promise<ImageProfile> {
		const images = imageBuffer;

		let imageProfile;
		let image;

		if (!images.animatedBuffer) {
			imageProfile = this.generateImageProfile(filename, "png");
			image = sharp(images.staticBuffer).toFormat("png");
		} else {
			imageProfile = this.generateImageProfile(filename, "gif");
			image = sharp(images.animatedBuffer, { animated: true }).gif();
		}

		const processedImage = await this.processImage(image, {
			respectRatio: options?.respectRatio || false,
		});
		await processedImage.toFile(imageProfile.filePath);

		return imageProfile;
	}
}
