const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const fsExtra = require('fs-extra');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Gemini AI

const apiKey = "AIzaSyA5KNa0Ru9PEUizO-Rpu65zCYX1QK8RthI";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Helper functions
const getStepsFromGemini = async (prompt) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "give me steps to write a manim animation for the following prompt give perfect steps in 6-7 points dont give use less data",
            },
          ],
        },
      ],
    });
    const response = await chatSession.sendMessage(prompt);
    console.log(response.response.text());
    return response.response.text();
  } catch (err) {
    throw new Error(`Error getting steps from Gemini: ${err.message}`);
  }
};

const getManimCodeFromGemini = async (steps) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "give me only Manim code to write a manim animation for the following steps. Include a Scene class that inherits from Scene and add the construct method. This is important. Do not include any text, give only Manim code in a single scene. Check correctly the code, and give only correct code without errors. If any packages like numpy are required, import them in code.Donot add any main function the code should be only a single manim scene.",
            },
          ],
        },
      ],
    });
    const response = await chatSession.sendMessage(steps);
    console.log(cleanCode(response.response.text()));
    return cleanCode(response.response.text());
  } catch (err) {
    throw new Error(`Error getting Manim code from Gemini: ${err.message}`);
  }
};

const cleanCode = (inputCode) => {
  // Remove backticks and unnecessary keywords
  let cleanedCode = inputCode.replace(/^```python\s*|```$/gm, "");

  // Add imports if they're missing
  if (!cleanedCode.includes("from manim import *")) {
    cleanedCode = `from manim import *\n\n${cleanedCode}`;
  }

  return cleanedCode.trim();
};

const saveManimCodeToFile = (code, filePath) => {
  fs.writeFileSync(filePath, code, "utf8");
};
async function runPythonScript(scriptPath, outputPath) {
  return new Promise((resolve, reject) => {
    const mediaDir = path.resolve(__dirname, "media");

    // Ensure the media directory exists
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir);
    }

    const command = "manim";
    const args = ["--format=mp4", scriptPath, "Scene", "-o", outputPath];

    const pythonProcess = spawn(command, args);

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (chunk) => {
      outputData += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      errorData += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Manim process exited with code ${code}`);
        console.error(`Error: ${errorData}`);
        reject(new Error(`Manim process failed: ${errorData}`));
      } else {
        console.log("Manim process executed successfully");
        console.log(`Output: ${outputData}`);
        resolve();
      }
    });

    pythonProcess.on("error", (err) => {
      console.error(`Failed to start Manim process: ${err.message}`);
      reject(err);
    });
  });
}
// const renderManimVideo = async (scriptPath, outputPath) => {
//     try {
//       // Ensure the media directory exists
//       const mediaDir = path.resolve( 'media');
//       if (!fs.existsSync(mediaDir)) {
//         fs.mkdirSync(mediaDir);
//       }

//       return new Promise((resolve, reject) => {
//         const command = `manim -pql --format=mp4 ${scriptPath} Scene -o ${outputPath}`;
//         exec(command, { cwd: path.dirname(scriptPath) }, (error, stdout, stderr) => {
//           if (error) {
//             console.error('Manim error:', stderr);
//             return reject(new Error(`Error rendering video: ${stderr || error.message}`));
//           }
//           console.log('Manim output:', stdout);
//           resolve();
//         });
//       });
//     } catch (err) {
//       throw new Error(`Error during rendering: ${err.message}`);
//     }
//   };

// Routes

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

function deleteFile(filePath) {
  fsExtra.emptyDirSync(filePath);
}
app.post("/generate-animation", async (req, res) => {
  deleteFile("media")
  const { prompt } = req.body;
  console.log(prompt);

  try {
    // Step 1: Get steps from Gemini
    const steps = await getStepsFromGemini(prompt);

    // Step 2: Get Manim code from Gemini
    const manimCode = await getManimCodeFromGemini(steps);

    // Step 3: Save Manim code to a Python file
    // const scriptPath = path.resolve("generated_manim_code.py");
    // saveManimCodeToFile(manimCode, scriptPath);

    // // Step 4: Render Manim video

    // const outputVideoPath = path.resolve("output.mp4");
    // await runPythonScript(scriptPath, outputVideoPath);
    res.json({
      code: manimCode,
      steps: steps,
      
    });
   
  } catch (err) {
    
    res.status(500).json({ error: err.message });
   
  }
});


const getStepsFromGeminiRegen = async (prompt,code) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "give me steps to write a manim animation for the following prompt or error and code given. perfect steps in 6-7 points dont give useless data ",
            },
          ],
        },
      ],
    });
    const response = await chatSession.sendMessage(prompt+"\n"+code);
    console.log(response.response.text());
    return response.response.text();
  } catch (err) {
    throw new Error(`Error getting steps from Gemini: ${err.message}`);
  }
};
app.post("/regenerate", async (req, res) => {
  deleteFile("media")
  const { input, code } = req.body;
  

  try {
    // Step 1: Get steps from Gemini
    const steps = await getStepsFromGeminiRegen(input, code);

    // Step 2: Get Manim code from Gemini
    const manimCode = await getManimCodeFromGemini(steps);

    // Step 3: Save Manim code to a Python file
    // const scriptPath = path.resolve("generated_manim_code.py");
    // saveManimCodeToFile(manimCode, scriptPath);

    // // Step 4: Render Manim video

    // const outputVideoPath = path.resolve("output.mp4");
    // await runPythonScript(scriptPath, outputVideoPath);
    res.json({
      code: manimCode,
      steps: steps,
      
    });
   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/resolve", async (req, res) => {
  const { error, code } = req.body;
  

  try {
    // Step 1: Get steps from Gemini
    const steps = await getStepsFromGeminiRegen(error, code);

    // Step 2: Get Manim code from Gemini
    const manimCode = await getManimCodeFromGemini(steps);

    // Step 3: Save Manim code to a Python file
    // const scriptPath = path.resolve("generated_manim_code.py");
    // saveManimCodeToFile(manimCode, scriptPath);

    // // Step 4: Render Manim video

    // const outputVideoPath = path.resolve("output.mp4");
    // await runPythonScript(scriptPath, outputVideoPath);
    res.json({
      code: manimCode,
      steps: steps,
      
    });
   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/render", async (req, res) => {
  const { code } = req.body;
  console.log(code);

  try {
   

    // Step 3: Save Manim code to a Python file
    const scriptPath = path.resolve("generated_manim_code.py");
    saveManimCodeToFile(code, scriptPath);

    // Step 4: Render Manim video

    const outputVideoPath = path.resolve("output.mp4");
    await runPythonScript(scriptPath, outputVideoPath);
    res.json({
      code: code,
     
      
    });
   
  } catch (err) {
    console.error("here----------------------------------------------------"+err.message+"43443");
    res.status(500).json({ error: err.message });
  }
});
app.get("/sendvid", (req, res) => {
  const filePath = "output.mp4";
  if (!filePath) {
    return res.status(404).send("File not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const head = {
    "Content-Length": fileSize,
    "Content-Type": "video/mp4",
  };
  res.writeHead(200, head);
  fs.createReadStream(filePath).pipe(res);
});
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
