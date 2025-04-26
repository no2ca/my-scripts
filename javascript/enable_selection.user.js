// ==UserScript==
// @name         enableSelection
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ウェブサイトにおける選択の制限を解除します
// @author       no2ca
// @match        *://*/*
// @grant        none
// ==/UserScript==

window.addEventListener('load', () => {
    // コンテキストメニューのブロックを解除
    window.oncontextmenu = null;
    document.oncontextmenu = null;
    document.body.oncontextmenu = null;
  
    // コピー・選択などのイベントを無効化しているリスナーを解除
    ['copy', 'cut', 'paste', 'selectstart', 'mousedown', 'mouseup', 'keydown', 'keypress', 'keyup'].forEach(event => {
      document.addEventListener(event, function(e) {
        e.stopPropagation();
      }, true);
    });
  
    // 文字選択を有効にするCSSを挿入
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        pointer-events: auto !important;
      }
      h1, h2, h3, h4, p, span, .text-content {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);
  
  })();  