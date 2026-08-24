const { createWorker } = require("tesseract.js");

async function runOCR() {
  const worker = await createWorker("eng");

  const { data: { text } } = await worker.recognize(
    "./test-report.png"
  );

  console.log("\n===== OCR RESULT =====\n");
  console.log(text);

  await worker.terminate();
}

runOCR();