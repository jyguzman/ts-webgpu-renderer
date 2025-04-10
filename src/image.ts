

async function createImage() {
    const image = new Image();
    image.src = "./assets/Flag-Puerto-Rico.png";
    const t = await image.decode();
    return t;
}