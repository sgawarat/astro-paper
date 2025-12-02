// SPDX-License-Identifier: MIT
document.addEventListener("astro:page-load", () => {
  // headingクラスのsectionが画面内にあると、対応するTOC項目をアクティブにする
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        const h = entry.target.querySelector("h1,h2,h3,h4,h5,h6");
        if (h === null) continue;

        const id = h.getAttribute("id");
        if (id === null) continue;

        const e = document.querySelector(`#sticky-toc a[href="#${id}"]`);
        if (e === null) continue;

        if (entry.isIntersecting) {
          e.classList.add("border-l-2");
        } else {
          e.classList.remove("border-l-2");
        }
      }
    },
    {
      rootMargin: "0% 0px 0% 0px",
    }
  );
  for (const h of document?.querySelectorAll("article section") ?? []) {
    observer.observe(h);
  }
});
