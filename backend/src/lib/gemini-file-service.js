import { ai } from "../config/gemini-config.js";
import { getFileFromS3 } from "./s3.js";



function sleep(ms) {
  return new Promise(
    (resolve) => setTimeout(resolve, ms)
  );
}

export async function uploadPdfToGemini(document) {
  /*
   * 1. Download PDF from permanent S3 storage
   */
  const pdfBuffer =
    await getFileFromS3(
      document.s3Key
    );

  /*
   * 2. Convert Node Buffer -> Blob
   */
  const pdfBlob = new Blob(
    [pdfBuffer],
    {
      type: "application/pdf"
    }
  );

  /*
   * 3. Upload PDF to Gemini Files API
   */
  const uploadedFile =
    await ai.files.upload({
      file: pdfBlob,

      config: {
        displayName: document.fileName,
        mimeType: "application/pdf"
      }
    });

  /*
   * 4. Wait until Gemini finishes
   * processing the PDF.
   */
  let geminiFile =
    await ai.files.get({
      name: uploadedFile.name
    });

  while (geminiFile.state === "PROCESSING") {
    await sleep(2000);

    geminiFile =
      await ai.files.get({
        name: uploadedFile.name
      });
  }

  if (geminiFile.state === "FAILED") {
    throw new Error(
      "Gemini failed to process the PDF"
    );
  }

  return geminiFile;
}



export async function attachPdfToGemini(document) {
  const geminiFile = await uploadPdfToGemini(document);

  document.geminiFileName = geminiFile.name;

  document.geminiFileUri = geminiFile.uri;

  document.geminiExpirationTime = geminiFile.expirationTime
    ? new Date(geminiFile.expirationTime)
    : null;

  await document.save();

  return document;
}



export async function ensureGeminiFile(document) {
  const now = new Date();

  /*
   * If we have a Gemini URI and it
   * hasn't expired, keep using it.
   */
  if (
    document.geminiFileUri &&
    document.geminiFileName &&
    document.geminiExpirationTime &&
    document.geminiExpirationTime > now
  ) {

    try {

      const file =
        await ai.files.get({
          name:
            document.geminiFileName
        });


      if (file.state === "ACTIVE") {

        return document;

      }

    } catch {

    }
  }

  /*
   * Gemini copy expired.
   *
   * Retrieve permanent PDF from S3
   * and upload again.
   */
  const geminiFile = await uploadPdfToGemini(document);

  document.geminiFileName = geminiFile.name;

  document.geminiFileUri = geminiFile.uri;

  document.geminiExpirationTime = geminiFile.expirationTime
    ? new Date(geminiFile.expirationTime)
    : null;

  await document.save();

  return document;
}