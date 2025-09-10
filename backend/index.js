// // require("dotenv").config();
// // const express = require("express");
// // const axios = require("axios");
// // const cors = require("cors");

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // const TOGETHER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
// // const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

// // app.post("/generate", async (req, res) => {
// //   const prompt =
// //     "Give me a creative frontend project idea with tech stack, theme, constraint, and target user.";

// //   try {
// //     const response = await axios.post(
// //       TOGETHER_API_URL,
// //       {
// //         model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
// //         messages: [{ role: "user", content: prompt }],
// //         temperature: 0.7,
// //         max_tokens: 300,
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${TOGETHER_API_KEY}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );
// //     const choice = response.data.choices[0];
// //     const idea = choice.message?.content || choice.text;
// //     res.json({ idea });
// //   } catch (err) {
// //     console.error(err.response?.data || err.message);
// //     res.status(500).json({ error: "Failed to generate idea." });
// //   }
// // });

// // app.listen(3000, () => console.log("Server running on http://localhost:3000"));

// require("dotenv").config();
// console.log("Env keys:", process.env);

// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// app.post("/generate", async (req, res) => {
//   const prompt =
//     "Give me a creative frontend project idea with tech stack, theme, constraint, and target user.";

//   try {
//     const response = await axios.post(
//       OPENROUTER_API_URL,
//       {
//         model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.7,
//         max_tokens: 300,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:3000",
//           "X-Title": "Idea Generator App",
//         },
//       }
//     );

//     const idea = response.data.choices[0].message.content;
//     res.json({ idea });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to generate idea." });
//   }
// });
// console.log(
//   "Loaded key:",
//   process.env.OPENROUTER_API_KEY ? "✅ Found" : "❌ Missing"
// );

// // app.listen(3000, () => console.log("Server running on http://localhost:3000"));
require("dotenv").config();
console.log(
  "Loaded key:",
  process.env.OPENROUTER_API_KEY ? "✅ Found" : "❌ Missing"
);

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/generate", async (req, res) => {
  const prompt = `
list five interesting types of fish`;

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "openai/gpt-4o", // ✅ corrected model ID
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // required by OpenRouter
          "X-Title": "Idea Generator App", // optional
        },
      }
    );

    const idea = response.data.choices[0].message.content;
    res.json({ idea });
  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate idea." });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
