var profileButton = document.getElementById("profileButton");
var Gossip = document.getElementById("Gossip");
var Chat = document.getElementById("Chat");
profileButton.addEventListener("click", function () {
  window.location.href = "./profile.html";
});

Gossip.addEventListener("click", function () {
  window.location.href = "./gossip.html";
});

Chat.addEventListener("click", function () {
  window.location.href = "./livechat.html";
});
