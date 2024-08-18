import multer from "multer";
import * as fs from "fs";
import * as basePath from "path";

/**
 * Configures and returns a Multer instance for handling image uploads.
 *
 * This function sets up a Multer middleware to handle file uploads, storing the files in a specified
 * directory. If the directory does not exist, it creates the directory recursively. The filenames of
 * the uploaded files will have any whitespace replaced with underscores.
 *
 * @param {string} path - The relative path where the uploaded files should be stored. This path is
 *                        relative to the root of the compiled project (typically the `dist` directory).
 * @returns {multer.Multer} A configured Multer instance for handling file uploads.
 *
 * @example
 * // Use the middleware in a route
 * app.post('/upload', uploadImage('uploads/images').single('image'), (req, res) => {
 *   res.send('Image uploaded successfully');
 * });
 *
 * @description
 * The function first resolves the provided path relative to the compiled project's root directory (`./dist`).
 * If the directory does not exist, it creates it using `fs.mkdirSync` with the `recursive` option.
 *
 * It then sets up Multer's `diskStorage` engine:
 * - The `destination` function specifies the directory where the uploaded files should be saved.
 * - The `filename` function replaces whitespace in the original filename with underscores to ensure
 *   that the files are stored with a consistent naming convention.
 *
 * The configured Multer instance is returned, which can then be used as middleware in your Express routes.
 */

const uploadImage = (path: any) => {
  const root = basePath.resolve("./dist");
  path = basePath.join(root, path);

  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

  const storage = multer.diskStorage({
    destination: function (req, file, destinationCallBack) {
      destinationCallBack(null, path);
    },

    filename: function (req, file, fileNameCallback) {
      const whitespace = /\s/g;
      fileNameCallback(null, file.originalname.replace(whitespace, "_"));
    },
  });

  return multer({ storage: storage });
};

export default uploadImage;
