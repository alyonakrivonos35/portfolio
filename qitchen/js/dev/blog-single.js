import "./app.min.js";
/* empty css           */
fetch("./files/blog-single.json").then((res) => res.json()).then((data) => {
  const params = new URLSearchParams(window.location.search);
  let id = parseInt(params.get("id"), 10);
  const work = data.works.find((w) => w.id === id);
  if (work) {
    document.getElementById("title").textContent = work.title;
    document.getElementById("image").src = work.image;
  } else {
    id = 1;
  }
});
