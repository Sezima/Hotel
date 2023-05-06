var hotelCities = JSON.parse(
  document.getElementById("hotel-cities").getAttribute("data-cities")
);
let input = document.getElementById("searchInput");

const mySelect = document.getElementById("userSelect");
mySelect.addEventListener("change", function () {
  sessionStorage.setItem("selectedOption", this.value);
});

const selectedOption = sessionStorage.getItem("selectedOption");
if (selectedOption) {
  mySelect.querySelector(`[value="${selectedOption}"]`).selected = true;
}

function handleClick() {
  // let list = document.createElement("ul")
  // list.classList.add("list")
  // document.querySelector(".inputDiv").appendChild(list)
  removeElements();
  for (let i of hotelCities) {
    let listItem = document.createElement("li");
    listItem.classList.add("list-items");
    listItem.style.cursor = "pointer";
    listItem.setAttribute("onclick", "displayNames('" + i + "')");

    let word = `${i} `;
    listItem.innerHTML = word;
    document.querySelector(".list").appendChild(listItem);
  }
}

input.addEventListener("click", handleClick);

// document.body.addEventListener("click", handleClick)

input.addEventListener("keyup", (e) => {
  removeElements();
  for (let i of hotelCities) {
    if (
      i.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ""
    ) {
      let listItem = document.createElement("li");
      listItem.classList.add("list-items");
      listItem.style.cursor = "pointer";
      listItem.setAttribute("onclick", "displayNames('" + i + "')");

      let word = "<b>" + i.substr(0, input.value.length) + "</b>";
      word += i.substr(input.value.length);

      listItem.innerHTML = word;
      document.querySelector(".list").appendChild(listItem);
    }
  }
});
function displayNames(value) {
  input.value = value;
  removeElements();
}
function removeElements() {
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  slidesPerGroup: 3,
  loop: false,
  speed: 900,
  loopFillGroupWithBlank: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
