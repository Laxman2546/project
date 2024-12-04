const wrapper = document.querySelector(".wrapper");
const userNames = document.querySelector(".userNames");
const personalDetails = document.querySelector(".personalDetails");
const enrolledCourses = document.querySelector(".enrolledCourses");
const enrolledCourses1 = document.querySelector(".enrolledCourses1");
const save = document.querySelector(".save");
const usernames = document.querySelector(".userNames");
const notification = document.querySelector(".notification");
const pencil = document.querySelector("#pencil");
const popup = document.querySelector(".popup");
const cancel = document.querySelector("#cancel");
const overlay = document.querySelector(".overlay");
const initialData = {};

function toggleMenu() {
  const ham = document.querySelector(".ham");
  const nav = document.querySelector(".nav-main");

  if (nav) {
    nav.classList.toggle("active");
  }
  if (ham) {
    ham.classList.toggle("active");
  }
}

fetch("/navbar/navbar2/navbar.html")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;
  })
  .catch((error) => {
    console.error("Failed to load navbar:", error);
  });
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/navbar/navbar2/navbar2.css";
document.head.appendChild(link);

personalDetails.addEventListener("click", () => {
  userNames.style.display = "block";
  enrolledCourses1.style.display = "none";
});
enrolledCourses.addEventListener("click", () => {
  userNames.style.display = "none";
  enrolledCourses1.style.display = "grid";
});

// Initialize initial data
Array.from(usernames.querySelectorAll("input, select")).forEach((input) => {
  initialData[input.name || input.id] = input.value.trim();
});

// Event listener for input changes
usernames.addEventListener("input", () => {
  const isModified = Array.from(
    usernames.querySelectorAll("input, select")
  ).some((input) => {
    const currentValue = input.value.trim();
    const originalValue = initialData[input.name || input.id];
    return currentValue !== originalValue;
  });

  save.style.display = isModified ? "block" : "none";
});

const tl = gsap.timeline({ paused: true });
tl.from(".notification", {
  y: 50,
  opacity: 0,
  duration: 1,
})
  .to(".notification", {
    y: 0,
    opacity: 1,
    delay: 1,
    duration: 1,
  })
  .to(".notification", {
    opacity: 0,
    y: 80,
    duration: 1,
    delay: 0.1,
    display: "none",
  });

// Event listener for the save button
save.addEventListener("click", () => {
  notification.style.display = "flex";
  save.style.display = "none";
  tl.restart();
});

pencil.addEventListener("click", () => {
  popupOpen();
});

function popupOpen() {
  overlay.style.display = "flex";
  popup.style.display = "flex";
}
function popupClose() {
  popup.style.display = "none";
  overlay.style.display = "none";
}

cancel.addEventListener("click", () => {
  popupClose();
});
const fileInput = document.getElementById("fileInput");

const preview = document.getElementById("imagePreview");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});
