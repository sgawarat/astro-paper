// SPDX-License-Identifier: MIT
// headingクラスのsectionが画面内にあると、対応するTOC項目をアクティブにする
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const id = entry.target.getAttribute("aria-labelledby");
      if (id === null) continue;

      const e = document.querySelector(`#floating-toc a[href="#${id}"]`);
      if (e === null) continue;

      if (entry.isIntersecting) {
        e.classList.add("border-l");
      } else {
        e.classList.remove("border-l");
      }
    }
  },
  {
    rootMargin: "0% 0px 0% 0px",
  },
);
for (const h of document?.querySelectorAll("article section.heading") ?? []) {
  observer.observe(h);
}
