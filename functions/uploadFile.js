// firebase integration
const bucket = require("../utils/firebaseConfig");
const path = require("path");

const uploadFileToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    const filename =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);

    const fileUpload = bucket.file(filename);

    fileUpload
      .save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      })
      .then(() => {
        // Make the file public so that it can be accessed by anyone
        return fileUpload.makePublic();
      })
      .then(() => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        resolve(imageUrl);
      })
      .catch((error) => {
        reject("Something went wrong while uploading the image to Firebase.");
      });
  });
};

module.exports = { uploadFileToFirebase };

//aws

// const AWS = require("aws-sdk");

// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   region: process.env.S3_REGION,
// });

// async function uploadFiles(files) {
//   const locations = [];
//   const promises = files.map(async (file) => {
//     const params = {
//       Bucket: process.env.S3_BUCKET,
//       Key: `${file.originalname}`,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     const result = await s3.upload(params).promise();
//     //console.log(`File uploaded to ${result.Location}`);
//     locations.push(result.Location);
//   });

//   await Promise.all(promises);
//   //console.log('All files uploaded successfully');
//   return locations[0];
// }

// module.exports = uploadFiles;

// const { v4: uuidv4 } = require("uuid");
// uuidv4();
// const multer = require("multer");

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
// };

// const uploadFiles = multer({
//   // limits: 500000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "./uploads");
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, uuidv4() + "." + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const isValid = !!MIME_TYPE_MAP[file.mimetype];
//     let error = isValid ? null : new Error("Invalid mime type!");
//     cb(error, isValid);
//   },
// });

// module.exports = uploadFiles;

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   // destination: "./uploadsImages",
//   destination: (req, file, cb) => {
//     cb(null, "./uploadsImages");
//   },

//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const uploadFiles = multer({ storage });

// module.exports = uploadFiles;

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/userImages");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // Check file types
//   const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Invalid file type. Only JPEG, JPG, and PNG files are allowed.")
//     );
//   }
// };

// const fileSizeLimit = 1 * 1024 * 1024; // 1 MB

// const uploadFiles = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: fileSizeLimit },
// });

// module.exports = uploadFiles;

// firebase integration
// const bucket = require("../utils/firebaseConfig");
// const path = require("path");

// const uploadFileToFirebase = (file) => {
//   return new Promise((resolve, reject) => {
//     const filename =
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname);
//     const fileUpload = bucket.file(filename);

//     fileUpload
//       .save(file.buffer, {
//         metadata: {
//           contentType: file.mimetype,
//         },
//       })
//       .then(() => {
//         const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
//         resolve(imageUrl);
//       })
//       .catch((error) => {
//         reject("Something went wrong while uploading the image to Firebase.");
//       });
//   });
// };

// module.exports = { uploadFileToFirebase };
