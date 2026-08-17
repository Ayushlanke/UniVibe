import supabase from "../utils/initialize.js";
import { user } from "../utils/user.js";

const messageInput = document.getElementById("message");
const sendMessageButton = document.getElementById("send-button");
const chatbox = document.getElementById("chatbox");

// Function to handle sending messages
async function handleSendMessage() {
  const messageText = messageInput.value.trim();
  console.log("Attempting to send message:", messageText);

  if (messageText) {
    try {
      const { data, error } = await supabase.rpc("insert_message", {
        user_id: user.id,
        message_text: messageText,
      });

      if (error) {
        console.error("Error sending message:", error);
      } else {
        messageInput.value = ""; // Clear input field after successful message send
        console.log("Message sent successfully:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  } else {
    alert("Message cannot be empty.");
  }
}

// Initialize Supabase real-time subscription
supabase
  .channel("public:messages")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
    },
    (payload) => {
      console.log("New message received:", payload.new);
      // Display the message with the username
      displayMessage(payload.new);
    }
  )
  .subscribe();

// Function to display a new message in the chatbox
function displayMessage(data) {
  var messageDiv = document.createElement("div");
  messageDiv.innerHTML = `
    <div class="message-container">
        <span class="message-header">${data.username}</span>
        <span class="message-time">${formatTimeAgo(data.created_at)}</span>
        <div class="message-body">${data.message}</div>
    </div>
`;
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the latest message
}

async function fetch_live() {
  try {
    const { data, error } = await supabase.rpc("fetch_live", {});
    if (error) {
      console.error("Error sending message:", error);
    }
    document.getElementById("loader").remove();
    data.reverse();
    for (let j = 0; j < Object.keys(data).length; j++) {
      displayMessage(data[j]);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
fetch_live();

function formatTimeAgo(date) {
  const now = new Date();
  const timestampDate = new Date(date);
  const offset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(timestampDate.getTime() + offset);

  // Calculate time difference
  const diffMs = now - istDate;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMins / 60);

  let timeAgo;
  if (diffHrs > 0) {
    timeAgo = `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
  } else {
    timeAgo = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  }

  // Format IST time to "h:mm AM/PM"
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

  return `• ${formattedTime}`;
}

sendMessageButton.addEventListener("click", handleSendMessage);
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleSendMessage();
  }
});
