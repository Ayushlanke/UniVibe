import supabase from "../utils/initialize.js";
import { user } from "../utils/user.js";

// Function to send a message
async function sendMessage(message_text) {
  if (message_text) {
    const { error } = await supabase
      .from("messages")
      .insert([{ user_id: user.id, message: message_text }]);

    if (error) {
      console.error("Error sending message:", error);
    }
  }
}

// Function to display a message in the chat
function displayMessage({ user_id, message }) {
  console.log(user_id, message);
}

supabase
  .channel("public:messages") // Open a channel for the messages table
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
    },
    (payload) => {
      console.log("New message received:", payload.new); // Debugging output
      displayMessage(payload.new); // Call your function to display the new message
    }
  )
  .subscribe();
sendMessage("Broooooooooooooooooooo");
