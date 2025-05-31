
const chatBox = document.getElementById("chat-box");

async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const question = userInput.value.trim();
  if (!question) return;

  // Display user message
  appendMessage("You", question);
  userInput.value = "";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question+"(answer in context of hotel booking keep answer under 70 words and don't use bold characters)" }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";
    appendMessage("HotelBot", reply);
  } catch (error) {
    appendMessage("HotelBot", "Error: " + error.message);
  }
}

function appendMessage(sender, message) {
  const messageElem = document.createElement("div");
  messageElem.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}
