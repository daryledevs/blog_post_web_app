import multer        from "multer";
import * as fs       from "fs";
import * as basePath from "path";

const uploadImage = (path:any) => {
  const root = basePath.resolve("./dist");
  path = basePath.join(root, path);

  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

  const storage = multer.diskStorage({
    destination: function (req, file, destinationCallBack) {
      destinationCallBack(null, path);
    },

    filename: function (req, file, fileNameCallback) {
      const whitespace = /\s/g;
      fileNameCallback(
        null,
        file.originalname.replace(whitespace, "_")
      );
    },
  });

  return multer({ storage: storage });
};

export default uploadImage;
