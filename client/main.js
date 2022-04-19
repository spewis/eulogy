import "dotenv/config";
console.log(process.env.API_KEY);

// GRAINED //
let options = {
  animate: true,
  patternWidth: 100,
  patternHeight: 100,
  grainOpacity: 0.07,
  grainDensity: 1.2,
  grainWidth: 0.8,
  grainHeight: 0.8,
};

grained("#main-container", options);

// UNSET AGE VARIABLE //
let age;
let gender;

// QUERY SELECTORS //
const loader = document.querySelector("#loading");
const displayName = document.querySelector(".name");
const btn = document.querySelector(".button");

// BUTTON TEXT //
btn.addEventListener("mouseover", function () {
  this.textContent = "LOAD ANOTHER FRIEND!";
});
btn.addEventListener("mouseout", function () {
  this.textContent = "FAKE EULOGIES FOR FAKE FRIENDS";
});

// SHOW LOADING //
function displayLoading() {
  loader.classList.add("display");
  setTimeout(() => {
    loader.classList.remove("display");
  }, 9000);
}

// HIDE LOADING //
function hideLoading() {
  loader.classList.remove("display");
}

// CALL LOADING FUNCTION //
displayLoading();

// EULOGY REQUEST //
let deepai = require("deepai");
deepai.setApiKey(process.env.API_KEY);

// EULOGY HANDLING //
const displayEulogy = document.querySelector(".eulogy");

function eulogyText(fullName) {
  if (gender === "male" && age > 16) {
    pronoun = "man";
  } else if (gender === "male" && age <= 16) {
    pronoun = "boy";
  } else if (gender === "female" && age > 16) {
    pronoun = "woman";
  } else if (gender === "female" && age <= 16) {
    pronoun = "girl";
  }
  (async function () {
    var resp = await deepai.callStandardApi("text-generator", {
      text: `<h4>Today we take a moment to celebrate the life of ${fullName} — a truly remarkable ${pronoun}, who died this week at the age of ${age}.`,
    });
    hideLoading();
    displayEulogy.innerHTML += resp.output += `.
      <p>
      ${fullName}, you will be missed.</h4>
      <h1>&#8734;</h1>
      `;
  })();
}

// NAME REQUEST //
function randomName(gender) {
  let nameUrl = "https://randomuser.me/api/";
  let genderQueryString = `?gender=${gender}`;
  let nameEndpoint = nameUrl + genderQueryString;
  console.log(nameEndpoint);
  fetch(nameEndpoint)
    .then((r) => r.json())
    .then(handleName);
}

// NAME HANDLING //
function handleName(data) {
  let first = data.results[0].name.first;
  let last = data.results[0].name.last;
  let fullName = first + " " + last;
  displayName.innerHTML += `<h1> ${first.toUpperCase()} ${last.toUpperCase()} </h1>`;
  eulogyText(fullName);
}

// // FACE REQUEST — SPECIFY GENDER //
// function randomGender() {
//   let maleUrl = `https://api.allorigins.win/raw/?url=https://fakeface.rest/face/json?gender=male&random=${Math.random()}`;
//   let femaleUrl = `https://api.allorigins.win/raw/?url=https://fakeface.rest/face/json?gender=female&random=${Math.random()}`;
//   let prob = Math.random(0.5);
//   if (prob < 0.5) {
//     result = maleUrl;
//   } else {
//     result = femaleUrl;
//   }
//   return result;
// }

// FACE HANDLING //
function handleFace(data) {
  console.log(data);
  gender = data.gender;
  age = data.age;
  let imageUrl = data.image_url;
  const photo = document.querySelector(".photo-container");
  photo.innerHTML += `<img class="photo" src="${imageUrl}">`;
  randomName(gender);
}

// FACE FETCH //
fetch(
  `https://api.allorigins.win/raw/?url=https://fakeface.rest/face/json?random=${Math.random()}`
)
  .then((r) => r.json())
  .then(handleFace);
