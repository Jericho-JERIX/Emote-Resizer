import { Sharp } from "sharp";

export interface ProcessOptions {
    respectRatio?: boolean;
}

export async function processImage(image: Sharp, options?: ProcessOptions): Promise<Sharp> {
    
    if (options?.respectRatio) {
        const { width, height } = await image.metadata();
        
        if (!width || !height) {
            return image;
        }
        else if (width > height) {
            image = image.resize({ width: 112 })
        }
        else {
            image = image.resize({ height: 112 })
        }
        
    }
    else {
        image = image.resize({ width: 112, height: 112 })
    }
    return image;
} 