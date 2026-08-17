import supabase from "../utils/initialize.js";
import { user } from "../utils/user.js";

function createPost(data) {
  const postSections = document.getElementById("post-sections");
  const postId = `post-${data["id"]}`;
  if (data.img1 === null) {
    const postHTML = `
    <div id="${postId}" class="post-container"> <!-- Assign postId here -->
          <div class="post-header">
            <div class="subreddit-icon">❤</div>
            <div class="subreddit-info">
              <span class="subreddit-name">${data.username}</span>
              <span class="post-time">${data.time}</span>
            </div>
          </div>

          <div class="post-title">${data.title}</div>
          <div class="post-content">${data.content}</div>

          <div class="post-footer">
            <div class="votes">
              <button id="like${postId}">
                <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="20px" height="20px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
    <g>
      <path fill="#000000" d="M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56
        s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21
        C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677
        l0.009,0.009C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"/>
      <path id="likefill${data.id}" fill="#FFFFFF" d="M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56
        s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21
        C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677
        l0.009,0.009C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"/>
      <g>
        <path fill="#000000" d="M48,5c-4.418,0-8.418,1.791-11.313,4.687l-3.979,3.961c-0.391,0.391-1.023,0.391-1.414,0
          c0,0-3.971-3.97-3.979-3.961C24.418,6.791,20.418,5,16,5C7.163,5,0,12.163,0,21c0,3.338,1.024,6.436,2.773,9
          c0,0,0.734,1.164,1.602,2.031s24.797,24.797,24.797,24.797C29.953,57.609,30.977,58,32,58s2.047-0.391,2.828-1.172
          c0,0,23.93-23.93,24.797-24.797S61.227,30,61.227,30C62.976,27.436,64,24.338,64,21C64,12.163,56.837,5,48,5z M58.714,29.977
          c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56s-1.023-0.195-1.414-0.586
          c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21C2,13.268,8.268,7,16,7
          c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677l0.009,0.009
          C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"/>
        <path fill="#394240" d="M48,11c-0.553,0-1,0.447-1,1s0.447,1,1,1c4.418,0,8,3.582,8,8c0,0.553,0.447,1,1,1s1-0.447,1-1
          C58,15.478,53.522,11,48,11z"/>
      </g>
    </g>
    </svg>
              </button>
              <span id="like_counter${data.id}">${data.likes}</span>
            </div>
            <button onclick="share('${data.id}')">Share</button>
          </div>
        </div>`;

    postSections.insertAdjacentHTML("beforeend", postHTML);

    if (data.isLiked) {
      document
        .getElementById(`likefill${data.id}`)
        .setAttribute("fill", "#FF0000");
    } else if (!data) {
      document
        .getElementById(`likefill${data.id}`)
        .setAttribute("fill", "#FFFFFF");
    }
    document
      .getElementById(`like${postId}`)
      .addEventListener("click", async () => {
        await like(data.id);
      });
    return;
  }

  var img1Container = `<div class="mySlides${postId} fade">
        <img src="${data.img1}" style="width: 100%" onclick="showFullScreenImage('${data.img1}')" />
      </div>`;
  var img2Container = `<div class="mySlides${postId} fade">
        <img src="${data.img2}" style="width: 100%" onclick="showFullScreenImage('${data.img2}')" />
      </div>`;
  var controller = `<!-- Next and previous buttons -->
      <a id="prev${postId}" class="prev">&#10094;</a>
      <a id="next${postId}" class="next">&#10095;</a>
    </div>
    <br />

    <!-- The dots/circles -->
    <div style="text-align: center">
      <span id="dot1${postId}" class="dot ${postId}"></span>
      <span id="dot2${postId}" class="dot ${postId}"></span>
    </div>`;

  if (data.img2 === null) {
    img2Container = "";
    controller = "";
  }

  const imageContainer = `<div id="swipe${postId}" class="slideshow-container">
      <!-- Full-width images with number and caption text -->
      ${img1Container}
      ${img2Container}
      ${controller}
      `;

  const postHTML = `
    <div id="${postId}" class="post-container"> <!-- Assign postId here -->
      <div class="post-header">
        <div class="subreddit-icon">❤</div>
        <div class="subreddit-info">
          <span class="subreddit-name">${data.username}</span>
          <span class="post-time">${data.time}</span>
        </div>
      </div>

      <div class="post-title">${data.title}</div>
      <div class="post-content">${data.content}</div>

      ${imageContainer}

      <div class="post-footer">
        <div class="votes">
          <button id="like${postId}">
            <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="20px" height="20px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g>
	<path fill="#000000" d="M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56
		s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21
		C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677
		l0.009,0.009C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"/>
	<path id="likefill${data.id}" fill="#FFFFFF" d="M58.714,29.977c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56
		s-1.023-0.195-1.414-0.586c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21
		C2,13.268,8.268,7,16,7c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677
		l0.009,0.009C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"/>
	<g>
		<path fill="#000000" d="M48,5c-4.418,0-8.418,1.791-11.313,4.687l-3.979,3.961c-0.391,0.391-1.023,0.391-1.414,0
			c0,0-3.971-3.97-3.979-3.961C24.418,6.791,20.418,5,16,5C7.163,5,0,12.163,0,21c0,3.338,1.024,6.436,2.773,9
			c0,0,0.734,1.164,1.602,2.031s24.797,24.797,24.797,24.797C29.953,57.609,30.977,58,32,58s2.047-0.391,2.828-1.172
			c0,0,23.93-23.93,24.797-24.797S61.227,30,61.227,30C62.976,27.436,64,24.338,64,21C64,12.163,56.837,5,48,5z M58.714,29.977
			c0,0-0.612,0.75-1.823,1.961S33.414,55.414,33.414,55.414C33.023,55.805,32.512,56,32,56s-1.023-0.195-1.414-0.586
			c0,0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245,27.545,2,24.424,2,21C2,13.268,8.268,7,16,7
			c3.866,0,7.366,1.566,9.899,4.101l0.009-0.009l4.678,4.677c0.781,0.781,2.047,0.781,2.828,0l4.678-4.677l0.009,0.009
			C40.634,8.566,44.134,7,48,7c7.732,0,14,6.268,14,14C62,24.424,60.755,27.545,58.714,29.977z"/>
		<path fill="#394240" d="M48,11c-0.553,0-1,0.447-1,1s0.447,1,1,1c4.418,0,8,3.582,8,8c0,0.553,0.447,1,1,1s1-0.447,1-1
			C58,15.478,53.522,11,48,11z"/>
	</g>
</g>
</svg>
          </button>
          <span id="like_counter${data.id}">${data.likes}</span>
        </div>
        <button onclick="share('${data.id}')">Share</button>
      </div>
    </div>`;

  postSections.insertAdjacentHTML("beforeend", postHTML);
  if (data.isLiked) {
    document
      .getElementById(`likefill${data.id}`)
      .setAttribute("fill", "#FF0000");
  } else if (!data) {
    document
      .getElementById(`likefill${data.id}`)
      .setAttribute("fill", "#FFFFFF");
  }
  document
    .getElementById(`like${postId}`)
    .addEventListener("click", async () => {
      await like(data.id);
    });
  //Below code is not run unless image 2 is present
  if (data.img2 === null) {
    return;
  }
  let slideIndex = 1;
  showSlides(slideIndex);

  // Next/previous controls
  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  // Thumbnail image controls
  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  const swipeImage = document.getElementById(`swipe${postId}`);

  let startX;

  swipeImage.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  swipeImage.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(startX, endX);
  });

  document.getElementById(`prev${postId}`).addEventListener("click", () => {
    plusSlides(-1);
  });

  document.getElementById(`next${postId}`).addEventListener("click", () => {
    plusSlides(1);
  });

  document.getElementById(`dot1${postId}`).addEventListener("click", () => {
    currentSlide(1);
  });

  document.getElementById(`dot2${postId}`).addEventListener("click", () => {
    currentSlide(2);
  });

  function handleSwipe(startX, endX) {
    const diffX = startX - endX;

    if (diffX > 50) {
      swipeLeft();
    } else if (diffX < -50) {
      swipeRight();
    }
  }

  function swipeLeft() {
    plusSlides(1);
  }

  function swipeRight() {
    plusSlides(-1);
  }

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName(`mySlides${postId}`);
    let dots = document.getElementsByClassName(`dot ${postId}`);
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  }
}
var c_of = 0;
async function like(postId) {
  //Show like animation
  try {
    const { data, error } = await supabase.rpc("toggle_like", {
      p_userid: user.id,
      p_postid: postId,
    });

    if (error) {
      throw error;
    }
    var like_elm = document.getElementById(`like_counter${postId}`);
    var like_fill = document.getElementById(`likefill${postId}`);
    var currentLikes = parseInt(like_elm.innerText, 10);
    if (data) {
      like_elm.innerText = currentLikes + 1;
      like_fill.setAttribute("fill", "#FF0000");
    } else if (!data) {
      like_elm.innerText = currentLikes - 1;
      like_fill.setAttribute("fill", "#FFFFFF");
    }
    console.log("Insert successful:", data);
    return data;
  } catch (error) {
    console.error("Error inserting into gossipbar:", error);
    return null;
  }
}

async function getImage(images, i) {
  const { data: fileData, error: fileError } = await supabase.storage
    .from("gossip")
    .getPublicUrl(`images/${images[i]}`);

  if (fileError) {
    console.error("Error getting public URL:", fileError.message);
  }
  return fileData.publicUrl;
}

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

  // Format the IST time to "h:mm a"
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedTime = `${hours % 12 || 12}:${minutes}${ampm}`;

  return `• ${timeAgo} at ${formattedTime}`;
}

async function fetchPost() {
  var dict = {};
  try {
    const { data, error } = await supabase.rpc("fetch_posts", {
      user_uuid: user.id,
      limit_count: 20,
      offset_count: c_of,
    });

    if (error) {
      throw error;
    }
    c_of = c_of + 20;
    for (let j = 0; j < Object.keys(data).length; j++) {
      if (data[j].images[0] === null) {
        dict["img1"] = null;
        dict["img2"] = null;
      } else if (data[j].images[1] === null) {
        dict["img1"] = await getImage(data[j].images, 0);
        dict["img2"] = null;
      } else {
        dict["img1"] = await getImage(data[j].images, 0);
        dict["img2"] = await getImage(data[j].images, 1);
      }
      dict["id"] = data[j].id;
      dict["username"] = data[j].username;
      dict["title"] = data[j].title;
      dict["content"] = data[j].content;
      dict["likes"] = data[j].likes;
      dict["isLiked"] = data[j]["isliked"];
      dict["time"] = formatTimeAgo(data[j].created_at);
      createPost(dict);
      dict = {};
    }
  } catch (error) {
    console.error("Error inserting into gossipbar:", error);
    return null;
  }
}

const scrollableDiv = document.getElementById("post-sections");

scrollableDiv.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;
  if (scrollTop + clientHeight >= scrollHeight) {
    fetchPost();
    console.log("Loading new posts");
  }
});

function showFullScreenImage(src) {
  const container = document.getElementById("fullscreen-container");
  const image = document.getElementById("fullscreen-image");
  image.src = src;
  container.style.display = "flex"; // Show the full-screen container
}

function hideFullScreenImage() {
  const container = document.getElementById("fullscreen-container");
  container.style.display = "none"; // Hide the full-screen container
}

// Share
const popup = document.querySelector(".popup"),
  close = popup.querySelector(".close"),
  field = popup.querySelector(".field"),
  input = field.querySelector("input"),
  copy = field.querySelector("button");

var whatsapp = document.getElementById("whatsapp");
var instagram = document.getElementById("instagram");
var facebook = document.getElementById("facebook");
var x = document.getElementById("x");
var telegram = document.getElementById("telegram");
var copyLink = document.getElementById("copyLink");

function share(id) {
  console.log(id);
  var url = `https://noice75.github.io/Superbase_Webpage/src/views/post?id=${id}`;
  whatsapp.href = `https://api.whatsapp.com/send?text=I%20Found%20this%20Spicy 🌶️%20Gossip 🤭%20${encodeURI(
    url
  )}`;
  copyLink.value = encodeURI(url);
  popup.classList.toggle("show");
}

close.onclick = () => {
  popup.classList.toggle("show");
};

copy.onclick = () => {
  input.select(); //select input value
  if (document.execCommand("copy")) {
    //if the selected text is copied
    field.classList.add("active");
    copy.innerText = "Copied";
    setTimeout(() => {
      window.getSelection().removeAllRanges(); //remove selection from page
      field.classList.remove("active");
      copy.innerText = "Copy";
    }, 3000);
  }
};

//End Share

fetchPost();
window.fetchPost = fetchPost;
window.share = share;
window.showFullScreenImage = showFullScreenImage;
window.hideFullScreenImage = hideFullScreenImage;
