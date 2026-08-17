import { user, logoutUser } from "../utils/user.js";
document.getElementById("email").innerHTML = user.email;
document.getElementById("username").innerHTML = user.username;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function logout() {
  await sleep(100);
  logoutUser();
}
document.getElementById("logout").addEventListener("click", logout);
