import supabase from "../utils/initialize.js";
import { user } from "../utils/user.js";

const gossipTitle = document.getElementById("gossipTitle");
const gossipBody = document.getElementById("editor");
const post = document.getElementById("post");
const notification = document.getElementById("notification");

function format(command) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return; // Ensure there's a selection

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");

  switch (command) {
    case "bold":
      span.style.fontWeight = "bold";
      break;
    case "italic":
      span.style.fontStyle = "italic";
      break;
    case "underline":
      span.style.textDecoration = "underline";
      break;
    case "strikeThrough":
      span.style.textDecoration = "line-through";
      break;
    case "superscript":
      span.style.verticalAlign = "super";
      span.style.fontSize = "smaller";
      break;
    case "subscript":
      span.style.verticalAlign = "sub";
      span.style.fontSize = "smaller";
      break;
    // Add more cases as needed
    default:
      return; // If the command is not recognized, do nothing
  }

  // Wrap the selected text with the span
  range.surroundContents(span);
}

function addLink() {
  const url = prompt("Enter the link URL:", "https://");
  if (url) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank"; // Open link in a new tab
      anchor.textContent = selection.toString() || url;
      range.deleteContents();
      range.insertNode(anchor);
    }
  }
}

function triggerFileInput() {
  document.getElementById("fileInput").click();
}

let imageCount = 0;
const maxImages = 2;
const imagesFile = [];

function addImageFromFile() {
  const fileInput = document.getElementById("fileInput");
  const files = Array.from(fileInput.files);

  // Validate number of files
  if (imageCount + files.length > maxImages) {
    alert(`You can only upload up to ${maxImages} images.`);
    return;
  }

  files.forEach((file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Create a new thumbnail box
        const thumbnailContainer =
          document.getElementById("thumbnailContainer");
        const thumbnailBox = document.createElement("div");
        thumbnailBox.classList.add("thumbnail-box");

        const img = document.createElement("img");
        img.src = e.target.result; // Base64 encoded image
        img.alt = "Image";
        img.classList.add("image-thumbnail");

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.textContent = "X";
        removeButton.onclick = function () {
          // Remove the file from the array
          const index = imagesFile.indexOf(file);
          if (index > -1) {
            imagesFile.splice(index, 1);
          }
          // Remove the thumbnail box from the UI
          thumbnailBox.remove();
          imageCount--; // Decrement image count when an image is removed
        };

        thumbnailBox.appendChild(removeButton);
        thumbnailBox.appendChild(img);
        thumbnailContainer.appendChild(thumbnailBox);

        // Add the file to the array and increment the image count
        imagesFile.push(file);
        imageCount++;
      };
      reader.readAsDataURL(file); // Read file as data URL (Base64)
    }
  });

  // Clear the file input value to allow re-uploading the same file
  fileInput.value = "";
}

let imagesUrl = {};

async function uploadImage(file) {
  const bucket = "gossip";
  const uniqueFilename = `${Date.now()}_${file.name}`;
  const filePath = `images/${uniqueFilename}`;

  // Upload the image file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }
  console.log(data);
  return uniqueFilename;
}

async function insertIntoGossipbar(title, content, images) {
  try {
    const { data, error } = await supabase.rpc("insert_into_gossipbar", {
      p_uuid: user.id,
      p_title: title,
      p_content: content,
      p_images: images,
    });

    if (error) {
      throw error;
    }

    console.log("Insert successful:", data);
    return data;
  } catch (error) {
    console.error("Error inserting into gossipbar:", error);
    return null;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function postGossip() {
  // post.style.display = "none";
  post.innerHTML = '<div class="loader"></div>';
  imagesUrl = { 0: null, 1: null }; // Clear the array before uploading
  for (let i = 0; i < imagesFile.length; i++) {
    const publicURL = await uploadImage(imagesFile[i]);
    if (!publicURL) {
      console.error("Failed to upload an image.");
      return; // Stop execution if any image upload fails
    }
    imagesUrl[i] = publicURL;
  }
  if (
    await insertIntoGossipbar(
      gossipTitle.value,
      gossipBody.innerHTML,
      imagesUrl
    )
  ) {
    notification.classList.add("show");
    // Remove the show class after 3 seconds and add hide class for sliding out
    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hide");
      setTimeout(() => {
        notification.classList.remove("hide");
      }, 500);
    }, 3000);

    await sleep(500);
    window.location.href = "./gossip.html";
  }
}

post.addEventListener("click", postGossip);

window.format = format;
window.addImageFromFile = addImageFromFile;
window.addLink = addLink;
window.triggerFileInput = triggerFileInput;
