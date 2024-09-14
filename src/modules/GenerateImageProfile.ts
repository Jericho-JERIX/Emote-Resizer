import { ImageFilePath } from "../constants/ImageFilePath.constant";

export function generateImageProfile(name: string, type: "png" | "gif") {
    return {
        filename: `${name}.${type}`,
        filePath: `${ImageFilePath}/${name}.${type}`
    }
}