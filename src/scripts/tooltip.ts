// SPDX-License-Identifier: MIT
document.addEventListener("astro:page-load", () => {
  // ツールチップが画面外に出ないように位置を調整するイベントリスナーを追加する
  for (const tooltip of document.querySelectorAll<HTMLElement>(".tooltip")) {
    function listener(this: HTMLElement) {
      const content = this.querySelector<HTMLElement>(".tooltip-content");
      if (content === null) return;

      // 初期位置でのツールチップの矩形を調べる
      content.style.maxWidth = "80ch";
      content.style.left = "50%";
      content.style.right = "auto";
      content.style.transform = "translateX(-50%)";
      let rect = content.getBoundingClientRect();

      // ツールチップが画面に収まらないなら、小さくする
      if (rect.width > document.documentElement.clientWidth) {
        content.style.maxWidth = `${document.documentElement.clientWidth}px`;
        rect = content.getBoundingClientRect();
      }

      // ツールチップが画面からはみ出さないようにずらす
      if (rect.left < 0) {
        content.style.left = `${-tooltip.offsetLeft}px`;
        content.style.transform = "none";
      } else if (rect.right > document.documentElement.clientWidth) {
        content.style.left = `${document.documentElement.clientWidth - tooltip.offsetLeft - rect.width}px`;
        content.style.transform = "none";
      }
    }
    tooltip.addEventListener("mouseenter", listener);
    tooltip.addEventListener("touchstart", listener);
  }
});
