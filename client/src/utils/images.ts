import Compressor from "compressorjs";

const compressImage = (file: File): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
      new Compressor(file, {
          quality: 0.5,
          success: (result) => {
              resolve(new File([result], file.name, { type: result.type }))
          },
          error: (error: Error) => reject(error)
      })
  });
}

export { compressImage }