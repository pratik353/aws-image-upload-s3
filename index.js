import express from "express";
import aws from "aws-sdk";
import bodyParser from "body-parser";
import cors from "cors";

const s3 = new aws.S3({
  region: "",
  accessKeyId: "",
  secretAccessKey: "",
  signatureVersion: "v4",
});

//image-upload-with-presigned-url

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/image-url", async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(411).json({ error: "file name required" });
  }
  try {
    const params = {
      Bucket: "",
      Key: name,
      Expires: 60,
    };
    const signedURL = await s3.getSignedUrlPromise("putObject", params);
    return res.status(200).json({ url: signedURL });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "error ocurred" });
  }
});

app.get("/get-s3-file", async (req, res) => {
    const name = req.query.name;
  if (!name) {
    return res.status(411).json({ error: "file name required" });
  }
  const params = {
    Bucket:"",
    Key: name, // e.g., 'folder/subfolder/file.txt'
    Expires: 60, // URL expiration time in seconds
  };

  try {
      // Generate a presigned URL
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) {
          console.log("Error generating presigned URL", err);
          return;
        }
        console.log("Presigned URL:", url);
        return res.status(200).json({ url: url });
      });
  } catch (error) {
    console.log(error)
    return res.status(403).json({ error: "error ocurred" });
  }
});

app.listen(8000, () => console.log("server running"));
