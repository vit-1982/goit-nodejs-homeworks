const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const path = require("path");
const { promises: fsPromises } = require("fs");

module.exports.minifyImage = async (req, res, next) => {
  try {
    const MINIFIED_DIR = "public/images";
    const imagePath = req.file.path.replace("\\", "/");

    await imagemin([imagePath], {
      destination: MINIFIED_DIR,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    const { filename, path: draftPath } = req.file;

    await fsPromises.unlink(draftPath);

    const newPafh = path.join(MINIFIED_DIR, filename).replace(/\\/g, "/");

    req.file = {
      ...req.file,
      path: newPafh,
      destination: MINIFIED_DIR,
    };

    req.body = {
      ...req.body,
      avatarURL: newPafh,
    };

    next();
  } catch (err) {
    next(err);
  }
};
