import { ai } from "../config/gemini-config.js";
import { getFileFromS3 } from "./s3.js";



function sleep(ms) {
  return new Promise(
    (resolve) => setTimeout(resolve, ms)
  );
}

export async function uploadPdfToGemini(document) {
  // Tải tệp PDF từ Amazon S3 để chuẩn bị gửi sang Gemini
  const pdfBuffer =
    await getFileFromS3(
      document.s3Key
    );

  // Chuyển dữ liệu Buffer thành Blob với định dạng PDF
  const pdfBlob = new Blob(
    [pdfBuffer],
    {
      type: "application/pdf"
    }
  );

  // Tải tài liệu lên Gemini Files API để phục vụ quá trình xử lý bằng AI
  const uploadedFile =
    await ai.files.upload({
      file: pdfBlob,

      config: {
        displayName: document.fileName,
        mimeType: "application/pdf"
      }
    });

  // Kiểm tra trạng thái xử lý của tệp cho đến khi Gemini hoàn tất
  let geminiFile =
    await ai.files.get({
      name: uploadedFile.name
    });

  while (geminiFile.state === "PROCESSING") {
    // Chờ 2 giây trước khi kiểm tra lại trạng thái tệp
    await sleep(2000);

    geminiFile =
      await ai.files.get({
        name: uploadedFile.name
      });
  }

  // Dừng xử lý nếu Gemini không thể xử lý tài liệu
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

  // Kiểm tra thông tin và thời hạn sử dụng của tệp trước khi dùng lại
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

      // Chỉ sử dụng lại tệp khi Gemini xác nhận tệp đang hoạt động
      if (file.state === "ACTIVE") {

        return document;

      }

    } catch {
      // Nếu không thể truy xuất tệp, tiếp tục quy trình tải lại tài liệu
    }
  }

  // Tải lại PDF từ Amazon S3 nếu tệp Gemini hết hạn hoặc không còn sử dụng được
  const geminiFile = await uploadPdfToGemini(document);

  // Cập nhật thông tin tệp mới do Gemini trả về
  document.geminiFileName = geminiFile.name;
  document.geminiFileUri = geminiFile.uri;

  document.geminiExpirationTime = geminiFile.expirationTime
    ? new Date(geminiFile.expirationTime)
    : null;

  // Lưu thông tin tệp mới vào cơ sở dữ liệu
  await document.save();

  return document;
}

export async function deleteGeminiFile(fileName) {
  if (!fileName) return;

  try {

    await ai.files.delete({
      name: fileName
    });

  } catch (error) {

    console.error("Unable to delete Gemini file:", error);

  }
}