const express = require("express");
const { Ollama } = require("ollama");
const multer = require("multer");
const { createWorker } = require("tesseract.js");
const cors = require("cors");

const app = express();

app.use(cors());

// ===============================
// Configuration
// ===============================

const PORT = 5000;
const ollama = new Ollama();

// ===============================
// Middleware
// ===============================

app.use(express.json());

const upload = multer({
  dest: "uploads/"
});

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "CareHub backend is running!"
  });
});

// ===============================
// Analyze Medical Report
// ===============================

app.post(
  "/api/analyze-report",
  upload.single("report"),
  async (req, res) => {
    try {
      // --------------------------------
      // 1. Check uploaded file
      // --------------------------------

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a report image"
        });
      }

      console.log(
        "Report received:",
        req.file.originalname
      );

      // --------------------------------
      // 2. OCR
      // --------------------------------

      const worker = await createWorker("eng");

      const {
        data: { text }
      } = await worker.recognize(req.file.path);

      await worker.terminate();

      console.log("OCR completed");

      // --------------------------------
      // 3. Send OCR text to Ollama
      // --------------------------------

      const response = await ollama.chat({
        model: "qwen2.5:3b-instruct",

        messages: [
          {
            role: "system",

            content: `
You are CareHub's medical report summarization assistant.

The input text was extracted from a medical report using OCR.

OCR can make mistakes, especially with:
- numbers
- decimal points
- units
- names
- reference ranges

Follow these rules strictly:

1. Do not diagnose any disease.

2. Do not prescribe medicines or treatments.

3. Do not assume an OCR value is correct if it looks suspicious.

4. Do not silently correct OCR values.

5. Preserve the value exactly as extracted.

6. If a value looks suspicious, place it under
"Values Requiring Verification".

7. Use the reference range exactly as written
in the OCR text.

8. Do not say that all results are normal unless
the extracted values can clearly be compared with
their corresponding reference ranges.

9. If the report itself contains a comment about
normal or abnormal results, mention that it is
the report's comment rather than your own diagnosis.

10. Keep the explanation simple and easy to understand.

Return the response using exactly these sections:

### Summary

Give a short description of the report.

### Important Findings

List important test names, extracted results,
units, and reference ranges when available.

### Values Requiring Verification

List values that may contain OCR errors or appear unclear.

Explain why they should be checked against the original report.

### General Observations

Give neutral observations based only on the
extracted report text.

### Disclaimer

State that this is an AI-generated educational
summary and that the original report should be
checked with a qualified healthcare professional.
`
          },

          {
            role: "user",

            content: `
Here is the OCR-extracted medical report:

${text}
`
          }
        ]
      });

      // --------------------------------
      // 4. Send response to frontend
      // --------------------------------

      res.json({
        message: "Report analyzed successfully!",

        extractedText: text,

        aiAnalysis: response.message.content
      });

    } catch (error) {

      console.error(
        "Analysis error:",
        error
      );

      res.status(500).json({
        message: "AI analysis failed",

        error: error.message
      });
    }
  }
);

// ===============================
// AI CHAT ENDPOINT
// ===============================

app.post("/api/chat", async (req, res) => {
  try {

    const { message } = req.body;

    // --------------------------------
    // Check message
    // --------------------------------

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message"
      });
    }

    console.log(
      "Chat message received:",
      message
    );

    // --------------------------------
    // Send message to Ollama
    // --------------------------------

    const response = await ollama.chat({

      model: "qwen2.5:3b-instruct",

      messages: [

        {
          role: "system",

          content: `
You are CareHub's AI health assistant.

Your job is to provide simple, general health information
and educational guidance.

Rules:

1. Do not diagnose diseases.

2. Do not prescribe medicines.

3. Do not recommend specific medication doses.

4. Do not pretend to be a doctor.

5. If the user describes serious or emergency symptoms,
advise them to seek appropriate professional medical care.

6. Keep answers simple and easy to understand.

7. Do not make unsupported claims.

8. Be polite and helpful.
`
        },

        {
          role: "user",

          content: message
        }

      ]
    });

    // --------------------------------
    // Send AI response
    // --------------------------------

    res.json({

      message:
        "Chat response generated successfully!",

      reply:
        response.message.content

    });

  } catch (error) {

    console.error(
      "Chat error:",
      error
    );

    res.status(500).json({

      message:
        "AI chat failed",

      error:
        error.message

    });
  }
});

// ======================================================
// COMPARE PREVIOUS AND NEW MEDICAL REPORTS
// ======================================================

app.post(
  "/api/compare-reports",

  upload.fields([
    {
      name: "previousReport",
      maxCount: 1
    },

    {
      name: "newReport",
      maxCount: 1
    }
  ]),

  async (req, res) => {

    try {

      // --------------------------------
      // 1. Check uploaded files
      // --------------------------------

      const previousFile =
        req.files?.previousReport?.[0];

      const newFile =
        req.files?.newReport?.[0];

      if (!previousFile || !newFile) {

        return res.status(400).json({

          message:
            "Please upload both previous and new reports"

        });

      }

      console.log(
        "Previous report:",
        previousFile.originalname
      );

      console.log(
        "New report:",
        newFile.originalname
      );

      // --------------------------------
      // 2. OCR Previous Report
      // --------------------------------

      console.log(
        "Starting OCR for previous report..."
      );

      const previousWorker =
        await createWorker("eng");

      const previousResult =
        await previousWorker.recognize(
          previousFile.path
        );

      const previousText =
        previousResult.data.text;

      await previousWorker.terminate();

      console.log(
        "Previous report OCR completed"
      );

      // --------------------------------
      // 3. OCR New Report
      // --------------------------------

      console.log(
        "Starting OCR for new report..."
      );

      const newWorker =
        await createWorker("eng");

      const newResult =
        await newWorker.recognize(
          newFile.path
        );

      const newText =
        newResult.data.text;

      await newWorker.terminate();

      console.log(
        "New report OCR completed"
      );

      // --------------------------------
      // 4. Send both reports to Ollama
      // --------------------------------

      console.log(
        "Sending reports to Ollama for comparison..."
      );

      const comparisonResponse =
        await ollama.chat({

          model:
            "qwen2.5:3b-instruct",

          messages: [

            {
              role: "system",

              content: `
You are CareHub's medical report comparison assistant.

You will receive two medical reports extracted
from images using OCR.

One is the PREVIOUS report and one is the NEW report.

Your task is ONLY to compare the information
that appears in the two OCR texts.

Important rules:

1. Do not diagnose any disease.

2. Do not prescribe medicines or treatments.

3. Do not assume OCR values are correct.

4. Do not silently correct OCR values.

5. Preserve values exactly as they appear
in the OCR text.

6. If a value appears suspicious or unclear,
mention it under "Values Requiring Verification".

7. Do not invent missing values.

8. If a test exists only in one report,
mention that clearly.

9. Compare matching test names when possible.

10. Clearly show previous value and new value.

11. Do not claim that a change is medically
good or bad unless the report itself states it.

12. Keep the explanation simple.

Return the response using exactly these sections:

### Comparison Summary

Give a short overview of the differences
between the previous and new reports.

### Changed Values

List test values that appear different.

For each value show:

- Test name
- Previous value
- New value
- Unit
- Reference range if available

### Similar or Unchanged Values

List important values that appear similar
or unchanged between the two reports.

### New or Missing Tests

Mention tests that appear in the new report
but not the previous report, or vice versa.

### Values Requiring Verification

List values that may contain OCR errors,
unclear numbers, units, names, or ranges.

### General Observations

Give neutral observations based only on
the two OCR-extracted reports.

### Disclaimer

State that this is an AI-generated educational
comparison and that the original reports should
be checked with a qualified healthcare professional.
`
            },

            {
              role: "user",

              content: `
==============================
PREVIOUS MEDICAL REPORT
==============================

${previousText}


==============================
NEW MEDICAL REPORT
==============================

${newText}


Compare these two reports according
to the instructions provided.
`
            }

          ]

        });

      // --------------------------------
      // 5. Send comparison to frontend
      // --------------------------------

      res.json({

        message:
          "Reports compared successfully!",

        previousReportText:
          previousText,

        newReportText:
          newText,

        comparison:
          comparisonResponse.message.content

      });

    } catch (error) {

      console.error(
        "Report comparison error:",
        error
      );

      res.status(500).json({

        message:
          "Report comparison failed",

        error:
          error.message

      });

    }

  }
);

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

  console.log(
    `CareHub backend running on port ${PORT}`
  );

});