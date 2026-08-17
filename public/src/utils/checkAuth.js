import supabase from "./initialize.js";
const { data: { session } = {} } = await supabase.auth.getSession(); //Gets Saved User Session

if (!session) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    window.location.href = "login.html?id=" + id;
  } else {
    if (!session) window.location.href = "login.html";
  }
}
