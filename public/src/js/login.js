import supabase from "../utils/initialize.js";

const { data: { session } = {} } = await supabase.auth.getSession(); //Gets Saved User Session
if (session) window.location.href = "homepage.html"; // If already loggedin Redirect to home page

async function showLoader(data) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("loader").style.display = "block";
  const { data: username, error } = await supabase.rpc("get_username", {
    p_user_id: data.session.user.id,
  });
  if (error) {
    throw error;
  }
  localStorage.setItem("username", username);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    window.location.href = "./post.html?id=" + id;
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));
  window.location.href = "./homepage.html";
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("Login failed: " + error.message);
  } else {
    await showLoader(data);
  }
}

async function uploadUsername(id, username) {
  try {
    const { data, error } = await supabase.rpc("insertUsername", {
      p_id: id,
      p_username: username,
    });

    if (error) {
      alert("Error checking username:", error.message);
      return false;
    }

    return data; // Returns true or false
  } catch (error) {
    alert("Unexpected error:", error);
    return false;
  }
}

async function checkUsername(username) {
  try {
    const { data, error } = await supabase.rpc("checkUsername", {
      p_username: username,
    });

    if (error) {
      alert("Error checking username:", error.message);
      return false;
    }
    return data; // Returns true or false
  } catch (error) {
    alert("Unexpected error:", error);
    return false;
  }
}

function validateInputs(email, username, password, confirmpassword) {
  email = email.trim();
  username = username.trim();
  password = password.trim();
  confirmpassword = confirmpassword.trim();

  // Check if any field is empty after trimming or passwords do not match
  if (!email || !username || !password || !confirmpassword) {
    alert("All fields are required and should not be empty or spaces.");
    return false;
  }

  if (password !== confirmpassword) {
    alert("Passwords do not match!");
    return false;
  }

  if (username.length > 20) {
    alert("Username cannot be more than 20 char long!");
    return false;
  }

  return true;
}

// Function to sign up
async function signUp() {
  const email = document.getElementById("signup-email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("signup-password").value;
  const confirmpassword = document.getElementById(
    "signup-confirm-password"
  ).value;

  if (!validateInputs(email, username, password, confirmpassword)) return;
  if (await checkUsername(username)) {
    alert("Username Taken!");
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert("Sign up failed: " + error.message);
    return;
  }

  await uploadUsername(data.user.id, username);
  await showLoader(data);
}

// Function to reset password
async function forgotPassword() {
  const email = document.getElementById("forgot-password-email").value;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    alert("Password reset failed: " + error.message);
  } else {
    alert("Password reset email sent!");
    showLogin();
  }
}

// Functions to toggle forms
function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("forgot-password-form").style.display = "none";
}

function showSignup() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
  document.getElementById("forgot-password-form").style.display = "none";
}

function showForgotPassword() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("forgot-password-form").style.display = "block";
}

// Expose functions to global scope so they can be used in HTML
window.login = login;
document.getElementById("signup").addEventListener("click", signUp);
window.forgotPassword = forgotPassword;
window.showLogin = showLogin;
window.showSignup = showSignup;
window.showForgotPassword = showForgotPassword;
