let ham = document.querySelector(".ham");
let nav = document.querySelector(".nav-main");
let navitems = document.querySelector(".nav-items");
let image = document.querySelectorAll(".pictures");
let courseAll = document.querySelector(".coursesAll");
let courseAll2 = document.querySelector(".coursesAll2");
const leftArrow = document.querySelector("#leftArrow");
const rightArrow = document.querySelector("#rightArrow");
const leftArrow2 = document.querySelector("#leftArrow2");
const rightArrow2 = document.querySelector("#rightArrow2");
const navLinks = document.querySelectorAll(".nav-main .nav-link");
const closeBtn = document.querySelector("#closeBtn");
const searchInput = document.querySelector(".input");
const Heading = document.querySelector(".coursesHeading");
const Heading2 = document.querySelector(".coursesHeading2");

function activateCoursesLink() {
  navLinks.forEach((link) => link.classList.remove("border"));
  document.getElementById("coursesLink").classList.add("border");
}

document.addEventListener("DOMContentLoaded", () => {
  const currentURL = window.location.href;
  if (currentURL.includes("#courses")) {
    activateCoursesLink();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((link) => link.classList.remove("border"));
    link.classList.add("border");
  });
});

function toggleMenu() {
  document.querySelector(".nav-main").classList.toggle("active");
  ham.classList.toggle("active");
}

// courses
var courses = [
  {
    title: "HTML Basics",
    description:
      "Learn the foundations of HTML to structure your web pages effectively.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaR5SutY3uG9Xms7ulNpzIbuZBNqWLKusF0w&s",
    learners: "2,340",
    link: "/learning/htmlbasics.html",
  },
  {
    title: "CSS Styling",
    description: "Master CSS to design beautiful and responsive web pages.",
    image: "https://www.achieversit.com/management/uploads/blog/css2.png",
    learners: "1,890",
  },
  {
    title: "JavaScript Fundamentals",
    description:
      "Understand the basics of JavaScript to add interactivity to your websites.",
    image:
      "https://www.codepwr.com/wp/wp-content/uploads/2024/01/JavaScript-syntax-Beginners-guide.jpg",
    learners: "3,210",
  },
  {
    title: "Responsive Web Design",
    description:
      "Learn to create mobile-friendly, responsive websites using modern techniques.",
    image:
      "https://webandcrafts.com/_next/image?url=https%3A%2F%2Fadmin.wac.co%2Fuploads%2FResponsive_websites_a4b1bafc09.png&w=1200&q=90",
    learners: "1,450",
  },
  {
    title: "Frontend Frameworks",
    description:
      "Explore popular frontend frameworks like React and Vue.js to build dynamic UIs.",
    image:
      "https://media.licdn.com/dms/image/D5612AQE2336w1Aov5Q/article-cover_image-shrink_720_1280/0/1714623587213?e=2147483647&v=beta&t=6dzs5eLH_JrG4fqNcQ1Hfvt9oeC5t05nPpoLoHEAqUw",
    learners: "1,600",
  },
];

var coursedet = "";

courses.forEach(function (course) {
  coursedet += `<div class="courseDetails">
            <div class="courseImage">
              <img
                class="coursePic"
                src=${course.image}
                alt=""
              />
            </div>
            <div class="CourseTitle">
              <h4>${course.title}</h4>
              <p class="description">
               ${course.description}
              </p>
              <p class="learners">
              Enrolled:${course.learners}
              </p>
            </div>
            <div class="courseBtn">
              <button type="button" class="Btn"><a href="${course.link}">Enroll Now</a></button>
            </div>
          </div>`;
});

courseAll.innerHTML = coursedet;
var courses2 = [
  {
    title: "MERN Stack Development",
    description: "Learn basics of  MongoDB,Express.js,React,Node.js.",
    image:
      "https://media.licdn.com/dms/image/D5612AQESQJ-mxlr4HQ/article-cover_image-shrink_720_1280/0/1708448148640?e=2147483647&v=beta&t=t6Rgl9p2JjfsRZ_XkN1WvsRcAIlUtRuYoPoqZmkJYbo", // Replace with actual image if available
    learners: "875",
  },
  {
    title: "Node.js for Backend",
    description: "Understand backend development using Node.js and Express.js.",
    image:
      "https://e0.pxfuel.com/wallpapers/758/341/desktop-wallpaper-nodejs-node-js.jpg", // Replace with actual image if available
    learners: "650",
  },
  {
    title: "React.js Fundamentals",
    description:
      "Master the fundamentals of React.js and build dynamic, interactive UIs.",
    image:
      "https://media.licdn.com/dms/image/v2/C4E12AQFdVr18zUa17Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1624637761724?e=2147483647&v=beta&t=uOrqjZV7ZeSvE6euFcZVEuj-2yuec1FppjnE6IUYdzY", // React icon image
    learners: "1,200",
  },
  {
    title: "MongoDB for Developers",
    description:
      "Learn MongoDB basics and how to interact with the NoSQL database using Mongoose.",
    image:
      "https://miro.medium.com/v2/resize:fit:1200/1*QJnvahq_EBdUGjYQUYrhvA.png", // MongoDB logo
    learners: "950",
  },
  {
    title: "Express.js Essentials",
    description:
      "Dive deep into building RESTful APIs and web applications using Express.js.",
    image:
      "https://markovate.com/wp-content/uploads/2022/06/Is-Express.js-Framework-An-Ideal-Choice-For-Developing-Enterprise-Applications_@2x.png.webp", // Express logo
    learners: "800",
  },
];

var coursedet = "";

courses2.forEach(function (course2) {
  coursedet += `<div class="courseDetails">
            <div class="courseImage">
              <img
                class="coursePic"
                src=${course2.image}
                alt=""
              />
            </div>
            <div class="CourseTitle">
              <h4>${course2.title}</h4>
              <p class="description">
               ${course2.description}
              </p>
              <p class="learners">
              Enrolled:${course2.learners}
              </p>
            </div>
            <div class="courseBtn">
              <button type="button" class="Btn"><a href="${course2.link}">Enroll Now</a></button>
            </div>
          </div>`;
});

courseAll2.innerHTML = coursedet;

function scrollCoursesHandler(
  courseContainer,
  leftArrow,
  rightArrow,
  direction
) {
  const courseCard = courseContainer.querySelector(".courseDetails");
  if (!courseCard) return;

  const cardWidth = courseCard.offsetWidth; // Get card width
  const gap = parseInt(window.getComputedStyle(courseContainer).gap) || 0; // Get gap size
  const scrollDistance = cardWidth + gap; // Total scroll distance per card
  const scrollAmount = direction === "right" ? scrollDistance : -scrollDistance;

  courseContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });

  setTimeout(() => {
    // Update left arrow visibility
    if (courseContainer.scrollLeft <= 0) {
      leftArrow.style.display = "none";
    } else {
      leftArrow.style.display = "flex";
    }

    // Update right arrow visibility
    if (
      courseContainer.scrollLeft + courseContainer.clientWidth >=
      courseContainer.scrollWidth
    ) {
      rightArrow.style.display = "none";
    } else {
      rightArrow.style.display = "flex";
    }
  }, 300);
}

function updateArrowVisibility(courseContainer, leftArrow, rightArrow) {
  if (window.innerWidth <= 715) {
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
  } else {
    // Update left arrow visibility
    if (courseContainer.scrollLeft > 0) {
      leftArrow.style.display = "flex";
    } else {
      leftArrow.style.display = "none";
    }

    // Update right arrow visibility
    if (
      courseContainer.scrollLeft + courseContainer.clientWidth <
      courseContainer.scrollWidth
    ) {
      rightArrow.style.display = "flex";
    } else {
      rightArrow.style.display = "none";
    }
  }
}

function initializeCarousel(courseContainer, leftArrow, rightArrow) {
  rightArrow.addEventListener("click", () =>
    scrollCoursesHandler(courseContainer, leftArrow, rightArrow, "right")
  );
  leftArrow.addEventListener("click", () =>
    scrollCoursesHandler(courseContainer, leftArrow, rightArrow, "left")
  );

  window.addEventListener("resize", () =>
    updateArrowVisibility(courseContainer, leftArrow, rightArrow)
  );

  updateArrowVisibility(courseContainer, leftArrow, rightArrow);
}

initializeCarousel(courseAll, leftArrow, rightArrow);
initializeCarousel(courseAll2, leftArrow2, rightArrow2);

//searchBtn

// Extract unique categories for future categorization (if needed)
const allCourses = [...courses.flat()]; // Flatten the courses arrays
const allCourses2 = [...courses2.flat()]; // Flatten the courses2 arrays

// Categories array combining courses from both categories
const categories = [...new Set([...courses.flat(), ...courses2.flat()])];

// Clear function to reset search input and display items
function clear() {
  closeBtn.classList.add("active");
  closeBtn.addEventListener("click", () => {
    searchInput.value = "";
    closeBtn.classList.remove("active");
    Heading.style.display = "block";
    Heading2.style.display = "block";
    rightArrow.style.display = "flex";
    rightArrow2.style.display = "flex";
    displayItem(allCourses);
    displayItem2(allCourses2);
  });
}

// Event listener for search input
searchInput.addEventListener("keyup", (e) => {
  Heading.style.display = "none";
  Heading2.style.display = "none";
  leftArrow.style.display = "none";
  rightArrow.style.display = "none";
  leftArrow2.style.display = "none";
  rightArrow2.style.display = "none";

  const searchData = e.target.value.toLowerCase();

  // Filter both courses arrays
  const filteredData = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchData)
  );
  const filteredData2 = allCourses2.filter((course2) =>
    course2.title.toLowerCase().includes(searchData)
  );

  // Display filtered items
  displayItem(filteredData);
  displayItem2(filteredData2);

  if (searchData === "") {
    closeBtn.classList.remove("active");
    Heading.style.display = "block";
    rightArrow.style.display = "flex";
    rightArrow2.style.display = "flex";
    displayItem(allCourses);
    displayItem2(allCourses2);
  } else {
    clear();
  }

  // Display "No data" message if no courses match search criteria
  if (filteredData.length === 0 && filteredData2.length === 0) {
    courseAll.innerHTML = `
      <div class="nodata">
        <img class="dataimage" src="./images/nodata/nodata.svg" " />
        <p>Give us a feedback to add new courses</p>
        <button class="feedback"><a href="#">Feedback</a></button>
      </div>`;
  }
});

// Display items for Web Development courses
const displayItem = (items) => {
  courseAll.innerHTML = items
    .map(({ title, description, image, learners }) => {
      return `
        <div class="courseDetails">
          <div class="courseImage">
            <img class="coursePic" src="${image}" alt="${title}" />
          </div>
          <div class="CourseTitle">
            <h4>${title}</h4>
            <p class="description">${description}</p>
            <p class="learners">Enrolled: ${learners}</p>
          </div>
          <div class="courseBtn">
            <button type="button" class="Btn">Enroll Now</button>
          </div>
        </div>`;
    })
    .join("");
};

// Display items for MERN Stack courses
const displayItem2 = (items) => {
  courseAll2.innerHTML = items
    .map(({ title, description, image, learners }) => {
      return `
        <div class="courseDetails">
          <div class="courseImage">
            <img class="coursePic" src="${image}" alt="${title}" />
          </div>
          <div class="CourseTitle">
            <h4>${title}</h4>
            <p class="description">${description}</p>
            <p class="learners">Enrolled: ${learners}</p>
          </div>
          <div class="courseBtn">
            <button type="button" class="Btn">Enroll Now</button>
          </div>
        </div>`;
    })
    .join("");
};
