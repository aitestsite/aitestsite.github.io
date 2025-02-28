import { db, collection, addDoc, query, orderBy, onSnapshot } from "./firebase-setup.js";

// ✅ Attach `sendMessage` to `window` so the button can access it
window.sendMessage = async function () {
    console.log("sendMessage function is being called!"); // Debugging log

    const messageInput = document.getElementById("messageInput");
    if (!messageInput) {
        console.error("Message input not found!");
        return;
    }

    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    try {
        await addDoc(collection(db, "messages"), { text: messageText, timestamp: new Date() });
        console.log("Message sent successfully!"); // Debugging log
        messageInput.value = ""; // Clear input field
    } catch (error) {
        console.error("Error adding message: ", error);
    }
};

// ✅ Function to load messages in real-time
function loadMessages() {
    console.log("Loading messages..."); // Debugging log

    const messagesList = document.getElementById("messagesList");
    if (!messagesList) {
        console.error("Message list not found!");
        return;
    }

    const q = query(collection(db, "messages"), orderBy("timestamp"));

    onSnapshot(q, (snapshot) => {
        messagesList.innerHTML = ""; // Clear existing messages
        snapshot.forEach((doc) => {
            const message = doc.data().text;
            const messageItem = document.createElement("li");
            messageItem.classList.add("message");
            messageItem.textContent = message;
            messagesList.appendChild(messageItem);
        });
    });
}

// ✅ Ensure messages load when page is ready
window.onload = function () {
    console.log("Page loaded! Initializing messages...");
    loadMessages();
};
