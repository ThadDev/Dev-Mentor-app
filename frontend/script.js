const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const ideaDisplay = document.getElementById("ideaDisplay");
const loader = document.getElementById("loader");

generateBtn.addEventListener("click", async () => {
  ideaDisplay.textContent = "";
  loader.style.display = "block";
  copyBtn.style.display = "none";

  try {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    ideaDisplay.textContent = data.idea;
    copyBtn.style.display = "inline-block";
  } catch {
    ideaDisplay.textContent = "Something went wrong.";
  } finally {
    loader.style.display = "none";
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard
    .writeText(ideaDisplay.textContent)
    .then(() => (copyBtn.textContent = "✅ Copied!"))
    .then(() => setTimeout(() => (copyBtn.textContent = "📋 Copy Idea"), 1500));
  ideaDisplay.textContent = "";
});
