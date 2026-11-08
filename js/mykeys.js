// MyKeys: the shared login code. Every page on the website loads this file.
//
// localStorage is a little notebook the browser keeps for each website.
// It remembers things even after you close the tab.
// "try" means: if the browser won't let us use it, don't crash.

function saveName(name) {
  try { localStorage.setItem("mykeys-user", name); } catch (e) {}
}

function loadName() {
  try { return localStorage.getItem("mykeys-user"); } catch (e) { return null; }
}

function forgetName() {
  try { localStorage.removeItem("mykeys-user"); } catch (e) {}
}

// The accounts that are allowed to log in: "username": "password hash".
// We never write the real password here, only its hash (a scrambled
// version that can't be turned back into the password).
// To add someone, open any page, press F12, click "Console" and type:
//   await makeHash("their password")
// then paste the result in here.
var accounts = {
  "arjun": "162a77baa33f471275f5a10adf547a8b4cd4e1cafc54b923f09757ae65471c5b",
  "sanskriti": "4cb0b61a0a1cccd0801e7a34e68b5ec877b2ec66cabc7ab288c4be05c333bcc0"
};

// Scrambles text with SHA-256, a hashing recipe built into every browser.
// The same text always gives the same hash, but you can't go backwards.
// "async" means it takes a moment, so we have to "await" the answer.
async function makeHash(text) {
  var bytes = new TextEncoder().encode(text); // text -> numbers
  var hashBytes = await crypto.subtle.digest("SHA-256", bytes);
  // Turn each number into 2 hex characters (0-9, a-f) and join them up.
  return Array.from(new Uint8Array(hashBytes))
    .map(function (b) { return b.toString(16).padStart(2, "0"); })
    .join("");
}

// Hashes the password they typed and checks it matches the saved hash.
// toLowerCase() turns "Test" into "test", so capitals in the username
// don't matter. That means usernames in the list above must be all lowercase!
// (Passwords still care about capitals, which makes them harder to guess.)
async function checkPassword(name, password) {
  var hash = await makeHash(password);
  return accounts[name.toLowerCase()] === hash;
}

// The login page sets isLoginPage = true before loading this file.
// On every other page it doesn't exist, so we treat it as false.
var onLoginPage = (typeof isLoginPage !== "undefined" && isLoginPage);
var currentUser = loadName();

if (!currentUser && !onLoginPage) {
  // Nobody is logged in, so send them to the login page.
  // "replace" means the Back button won't bring them back here.
  window.location.replace("mykeys.html");
} else if (currentUser && onLoginPage) {
  // Already logged in, so skip the login page and go home.
  window.location.replace("index.html");
}

// Adds "Hi (name)!" and a Log Out button to the top bar.
// We wait for "DOMContentLoaded" because the header doesn't exist yet
// when this file first runs (it's loaded at the top of the page).
document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector("header");
  if (!currentUser || !header) {
    return;
  }

  var bar = document.createElement("div");
  bar.className = "mykeys-bar";

  var hello = document.createElement("span");
  // textContent (not innerHTML) so a sneaky name can't add code to the page.
  hello.textContent = "Hi " + currentUser + "!";

  var logout = document.createElement("button");
  logout.textContent = "Log Out";
  logout.addEventListener("click", function () {
    forgetName();
    window.location.href = "mykeys.html";
  });

  bar.appendChild(hello);
  bar.appendChild(logout);
  // Put the bar at the very top of the header, above the big title.
  header.prepend(bar);
});

// The look of the bar. It's here so every page gets it without extra CSS.
var barStyle = document.createElement("style");
barStyle.textContent =
  ".mykeys-bar {" +
  "  display: flex; justify-content: flex-end; align-items: center; gap: 12px;" +
  "  padding: 0 16px; margin: -25px 0 15px;" +
  "  font-size: 1.1rem; font-weight: bold; color: black;" +
  "}" +
  ".mykeys-bar button {" +
  "  padding: 8px 16px; font-size: 1rem; font-weight: bold;" +
  "  color: white; background-color: rgb(50, 90, 220);" +
  "  border: none; border-radius: 8px; cursor: pointer;" +
  "}" +
  ".mykeys-bar button:hover { background-color: rgb(30, 60, 180); }";
document.head.appendChild(barStyle);
