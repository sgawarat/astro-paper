// SPDX-License-Identifier: MIT
document.addEventListener("astro:page-load", () => {
  // ツールチップが画面外に出ないように位置を調整するイベントリスナーを追加する
  for (const tooltip of document.querySelectorAll<HTMLElement>(".tooltip")) {
    function listener(this: HTMLElement, event: MouseEvent | TouchEvent) {
      const content = this.querySelector<HTMLElement>(".tooltip-content");
      if (content === null) return;

      // 初期位置でのツールチップの矩形を調べる
      if (event.type === "touchstart") {
        content.style.display = "block";
      }
      content.style.left = "50%";
      content.style.transform = "translateX(-50%)";
      const left = content.offsetLeft;
      const width = content.offsetWidth;
      if (event.type === "touchstart") {
        content.style.display = "";
      }

      // ツールチップが画面からはみ出さないようにずらす
      if (left < 0) {
        content.style.left = `${-tooltip.offsetLeft}px`;
        content.style.transform = "none";
      } else if (left + width > document.documentElement.clientWidth) {
        content.style.left = `${document.documentElement.clientWidth - tooltip.offsetLeft - width}px`;
        content.style.transform = "none";
      }
    }
    tooltip.addEventListener("mouseenter", listener);
    tooltip.addEventListener("touchstart", listener);
  }
});
