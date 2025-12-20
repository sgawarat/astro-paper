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
      content.style.setProperty("--tooltip-offset-x", null);
      const rect = content.getBoundingClientRect();
      if (event.type === "touchstart") {
        content.style.display = "";
      }

      // ツールチップが画面からはみ出さないようにずらす
      if (rect.left < 0) {
        content.style.setProperty("--tooltip-offset-x", `${-rect.left}px`);
      } else if (rect.right > document.documentElement.clientWidth) {
        content.style.setProperty("--tooltip-offset-x", `${document.documentElement.clientWidth - rect.right}px`);
      }
    }
    tooltip.addEventListener("mouseenter", listener);
    tooltip.addEventListener("touchstart", listener);
  }
});
