import sharp from "sharp";

(async () => {
    const img = await sharp('src/resources/test.webp').toFormat('png').resize(112, 112).toBuffer();
    sharp(img).toFile('src/resources/test.png');
})()