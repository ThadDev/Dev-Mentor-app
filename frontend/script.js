const suggestions = document.querySelectorAll(".suggestion-btn");
const suggestionsBox = document.getElementById("suggestions");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatArea = document.getElementById("chat-area");

// Append message to chat
function appendMessage(sender, text = "") {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
  return msg;
}

// Send message handler using streaming
function sendMessage(text) {
  if (!text.trim()) return;

  if (suggestionsBox.style.display !== "none") {
    suggestionsBox.style.display = "none";
  }

  // Show user message
  appendMessage("user", text);

  // Create AI message placeholder
  const aiMsg = appendMessage("ai", "");

  sendBtn.disabled = true;

  // Create EventSource for SSE
  const evtSource = new EventSource(
    `https://dev-mentor-app.onrender.com/api/chat-stream?message=${encodeURIComponent(
      text
    )}`
  );

  evtSource.onmessage = (event) => {
    if (event.data === "[DONE]") {
      evtSource.close();
      sendBtn.disabled = false;
      chatArea.scrollTop = chatArea.scrollHeight;
      return;
    }
    aiMsg.textContent += event.data;
    chatArea.scrollTop = chatArea.scrollHeight;
  };

  evtSource.onerror = (err) => {
    console.error("SSE error:", err);
    aiMsg.textContent += " ❌ Error receiving response.";
    evtSource.close();
    sendBtn.disabled = false;
  };

  input.value = "";
}

suggestions.forEach((btn) => {
  btn.addEventListener("click", () => sendMessage(btn.textContent));
});

sendBtn.addEventListener("click", () => sendMessage(input.value));

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage(input.value);
});

// Theme toggle
const root = document.documentElement;
const lightIcon = document.getElementById("light-theme");
const darkIcon = document.getElementById("dark-theme");

function setTheme(primary, secondary) {
  root.style.setProperty("--background-color-dark", primary);
  root.style.setProperty("--background-color-light", secondary);
}

lightIcon.addEventListener("click", () => {
  setTheme("#2d2d2d", "#fdf5e8");
  lightIcon.style.display = "none";
  darkIcon.style.display = "inline";
});

darkIcon.addEventListener("click", () => {
  setTheme("#fdf5e8", "#2d2d2d");
  darkIcon.style.display = "none";
  lightIcon.style.display = "inline";
});

// Theme toggle
// const root = document.documentElement;
// const lightIcon = document.getElementById("light-theme");
// const darkIcon = document.getElementById("dark-theme");

// // helper: set theme
// function setTheme(primary, secondary) {
//   root.style.setProperty("--background-color-dark", primary);
//   root.style.setProperty("--background-color-light", secondary);
// }

// // light → dark
// lightIcon.addEventListener("click", () => {
//   setTheme("#2d2d2d", "#fdf5e8");
//   lightIcon.style.display = "none";
//   darkIcon.style.display = "inline";
// });

// // dark → light
// darkIcon.addEventListener("click", () => {
//   setTheme("#fdf5e8", "#2d2d2d");
//   darkIcon.style.display = "none";
//   lightIcon.style.display = "inline";
// });
