document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card-body");
  const buttons = document.querySelectorAll(".toc-tree button");

  function showCard(id) {
    cards.forEach(c => c.classList.add("hidden"));
    const target = document.querySelector(`.card-body[data-id='${id}']`) ||
                   document.querySelector(`.card-body[data-id='welcome']`);
    target.classList.remove("hidden");
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => showCard(btn.dataset.target));
  });

  showCard("welcome");
});
