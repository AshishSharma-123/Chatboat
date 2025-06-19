const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Append message to chat box
function appendMessage(sender, message) {
    const msgDiv = document.createElement("div");
    msgDiv.className = sender;
    msgDiv.textContent = `${sender === 'user' ? 'You' : 'Bot'}: ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

// Send message to Flask backend
async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    appendMessage("user", input);
    userInput.value = "";
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input })
        });

        const data = await response.json();
        appendMessage("bot", data.reply);
    } catch (error) {
        appendMessage("bot", "⚠️ Oops! Failed to get response.");
        console.error("Error:", error);
    }

    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
}

// Send on click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key press
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
