import "./app.min.js";
import "./banner.min.js";
fetch("./files/work-single.json").then((res) => res.json()).then((data) => {
  const params = new URLSearchParams(window.location.search);
  let id = parseInt(params.get("id"), 10);
  const work = data.works.find((w) => w.id === id);
  if (work) {
    document.getElementById("statisticsLabel1").textContent = work.statisticsLabel1;
    document.getElementById("statisticsLabel2").textContent = work.statisticsLabel2;
    document.getElementById("statisticsLabel3").textContent = work.statisticsLabel3;
    document.getElementById("statisticsLabel4").textContent = work.statisticsLabel4;
    document.getElementById("statisticsInfo1").textContent = work.statisticsInfo1;
    document.getElementById("statisticsInfo2").textContent = work.statisticsInfo2;
    document.getElementById("statisticsInfo3").textContent = work.statisticsInfo3;
    document.getElementById("statisticsInfo4").textContent = work.statisticsInfo4;
    document.getElementById("workImage").src = work.workImage;
    document.getElementById("prevNavigationImg").src = work.prevNavigationImg;
    document.getElementById("nextNavigationImg").src = work.nextNavigationImg;
  } else {
    id = 1;
  }
});
const prev = document.querySelector(".navigation__item--prev");
const next = document.querySelector(".navigation__item--next");
const numWorks = document.querySelectorAll(".gallery__items .gallery__item").length;
if (prev) {
  prev.addEventListener("click", function(e) {
    e.preventDefault();
    gallaryNavigation(-1);
  });
}
if (next) {
  next.addEventListener("click", function(e) {
    e.preventDefault();
    gallaryNavigation(1);
  });
}
function gallaryNavigation(step) {
  const url = new URL(window.location.href);
  const id = parseInt(url.searchParams.get("id")) || 0;
  let newId = id + step;
  if (newId < 1) newId = numWorks;
  if (newId > numWorks) newId = 1;
  url.searchParams.set("id", newId);
  window.location.href = url.toString();
}
