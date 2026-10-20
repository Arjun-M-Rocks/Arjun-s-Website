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
