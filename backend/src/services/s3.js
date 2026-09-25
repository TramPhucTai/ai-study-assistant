import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";



const s3 = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(file) {
  const originalName = Buffer
    .from(file.originalname, "latin1")
    .toString("utf8");

  const extension = originalName.split(".").pop();

  const fileKey = `uploads/${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return {
    file_key: fileKey,
    file_name: originalName,
  };
}

export async function getFileFromS3(fileKey) {

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey
  });

  const response = await s3.send(command);

  /*
   * AWS SDK v3 can convert the S3 stream
   * into a Uint8Array.
   */
  const bytes = await response.Body.transformToByteArray();

  return Buffer.from(bytes);
}