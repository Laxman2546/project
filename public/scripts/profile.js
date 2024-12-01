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

const userNames = document.querySelector(".userNames");
const personalDetails = document.querySelector(".personalDetails");
const enrolledCourses = document.querySelector(".enrolledCourses");
const enrolledCourses1 = document.querySelector(".enrolledCourses1");

personalDetails.addEventListener("click", () => {
  userNames.style.display = "block";
  enrolledCourses1.style.display = "none";
});
enrolledCourses.addEventListener("click", () => {
  userNames.style.display = "none";
  enrolledCourses1.style.display = "grid";
});
