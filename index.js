import express from "express";
import aws from "aws-sdk";
import bodyParser from "body-parser";
import cors from "cors";

const s3 = new aws.S3({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  signatureVersion: process.env.SIGNATURE_VERSIONING,
});

//image-upload-with-presigned-url

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/image-url", async (req, res) => {
  const name = req.query.name;
  const params = {
    Bucket: "image-upload-with-presigned-url",
    Key: name,
    Expires: 60,
  };
  const signedURL = await s3.getSignedUrlPromise("putObject", params);
  return res.status(200).json({ url: signedURL });
});

app.listen(8000, () => console.log("server running"));
