import { db, collection, addDoc, query, orderBy, onSnapshot } from "./firebase-setup.js";

// ✅ Attach sendMessage to `window` so the button can access it
window.sendMessage = async function() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    try {
        await addDoc(collection(db, "messages"), { text: messageText, timestamp: new Date() });
        messageInput.value = ""; // Clear input field
    } catch (error) {
        console.error("Error adding message: ", error);
    }
};

// ✅ Function to load messages in real-time
function loadMessages() {
    const messagesList = document.getElementById("messagesList");
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
window.onload = loadMessages;
