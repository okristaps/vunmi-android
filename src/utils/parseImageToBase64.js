export async function convertImageToBase64(imagePath, targetWidth) {
  const img = new Image();
  img.src = imagePath;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Image failed to load"));
  });

  const aspectRatio = img.height / img.width;
  const targetHeight = Math.round(targetWidth * aspectRatio);
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const dataUrl = canvas.toDataURL("image/png");
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  return base64Data;
}
