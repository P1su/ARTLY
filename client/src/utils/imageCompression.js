import imageCompression from 'browser-image-compression';

export async function compressImage(file, maxSizeMB = 1) {
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  return await imageCompression(file, options);
}

export async function compressImages(files, maxSizeMB = 1) {
  return Promise.all(files.map(file => compressImage(file, maxSizeMB)));
}