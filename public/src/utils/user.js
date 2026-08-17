import supabase from "../utils/initialize.js";

const {
  data: { session },
  error,
} = await supabase.auth.getSession();
const user = session.user;
user["username"] = localStorage.getItem("username");

async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
  } else {
    sessionStorage.clear();
    localStorage.clear();
    console.log("User logged out");
    window.location.href = "login.html"; // Redirect to login page
  }
}

export { user, logoutUser };
