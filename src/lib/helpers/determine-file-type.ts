export const determineFileType = (
  fileName: string,
): "video" | "image" | null => {
  if (!fileName || typeof fileName !== "string") {
    return null;
  }

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "mkv", "flv", "avi", "mov", "wmv"];

  const splitName = fileName.split(".");
  if (splitName.length < 2) {
    return null;
  }

  const extension = splitName.pop()?.toLowerCase();

  if (!extension) {
    return null;
  }

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return null;
  }
};
