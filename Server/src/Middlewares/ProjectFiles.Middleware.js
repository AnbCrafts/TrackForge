import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // base upload folder
    const baseDir = "src/public/files";

    // file.originalname might include subfolders if uploaded with webkitdirectory
    const relativeDir = path.dirname(file.originalname); // e.g. "html" or "css"

    // full path: src/public/files/html
    const finalPath = path.join(baseDir, relativeDir);

    // ensure folders exist
    fs.mkdirSync(finalPath, { recursive: true });

    cb(null, finalPath);
  },
  filename: function (req, file, cb) {
    // keep original file name only (without directories)
    const filename = path.basename(file.originalname);

    // add unique suffix if you want
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, filename + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

export default upload;
