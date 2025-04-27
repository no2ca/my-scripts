function convertMarkdownToScrapbox(md) {
  // コードブロックを一時退避
  const codeBlocks = [];
  // 衝突しにくい文字列を改行のプレースホルダーにする
  const TEMP_CODE_SEPARATOR = "TEMPCODEBLOCKSEPARATORXYZ"; 
  // ``` の前後の空白を許容し、行全体でマッチするように修正 (mフラグ使用)
  md = md.replace(
    /^\s*```(?<lang>\w+)?\s*\n?(?<code>[\s\S]*?)\n?\s*```\s*$/gm, // mフラグ追加、前後の空白許容、^ $ 追加
    (match, lang, code) => {
      const key = `__CODE_BLOCK_${codeBlocks.length}__`;
      // console.log(`[Debug] Found code block ${codeBlocks.length}, lang: ${lang || 'code'}`); // デバッグ用
      codeBlocks.push({
        lang: lang || 'code', // 言語指定がなければ 'code'
        code: code ? code.trim() : '' // 抽出コードの前後の空白を除去
      });
      return key; // プレースホルダーを返す
    }
  );
  
  md = md.replace(/__CODE_BLOCK_(\d+)__/g, (match, i) => { // match を受け取る (デバッグ用に役立つことも)
       const index = parseInt(i, 10); // 文字列のインデックスを数値に変換
       const block = codeBlocks[index];
       // console.log(`[Debug] Restoring block ${index}`); // デバッグ用
       if (!block) {
           console.error(`[Error] Code block with index ${index} not found! Placeholder: ${match}`); // エラーログ改善
           return match; // 見つからない場合はプレースホルダーをそのまま返す
       }
   
       // コード本体を改行で分割し、各行の先頭にスペースを追加
       const indentedCode = block.code
         .split('\n')
         .map(line => ' ' + line) // 各行の先頭にスペースを追加
         .join(TEMP_CODE_SEPARATOR);
   
       // 要求されたフォーマットで結合: code:lang\nindentedCode\n
       return `code:${block.lang}\n${indentedCode}\n${TEMP_CODE_SEPARATOR}`;
     });

  // 見出し: 行頭の # とスペースを除去
  md = md.replace(/^\s*#{1,6}\s+(.+)$/gm, '$1');

  // 箇条書き: ネストレベルに応じてスペース (level + 1)
  md = md.replace(/^([ \t]*)[-*]\s+(.*)$/gm, (_, indent, content) => {
    const indentLength = indent.replace(/\t/g, '    ').length;
    // スペース2つで1レベルと仮定
    const level = Math.floor(indentLength / 2);
    const spaces = ' '.repeat(level + 1);
    return `${spaces}${content}`;
  });

  // リンク: [text](url) → [text url]
  md = md.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '[$1 $2]'); // Scrapbox形式にスペース追加

  // 強調記法削除
  md = md
    .replace(/\*\*(.+?)\*\*/g, '$1') // **bold**
    .replace(/__(.+?)__/g, '$1')   // __bold__
    .replace(/\*(.+?)\*/g, '$1')   // *italic*
    .replace(/_(.+?)_/g, '$1');    // _italic_

  // 水平線は空行に変換（Scrapboxでは不要な場合が多い）
  md = md.replace(/^\s*([-*_]){3,}\s*$/gm, '');

  // 本文行へのスペース追加ロジック
  md = md.split('\n').map(line => {
    // プレースホルダー行、空行、既にインデント/引用符がある行はそのまま
    if (/^__CODE_BLOCK_\d+__$/.test(line) ||
        /^\s*$/.test(line) || // 空行または空白のみの行
        /^\s+/.test(line) || // 既にインデントあり (リストなど)
        /^>/.test(line)) {   // 引用行
      return line;
    }
    // それ以外の行は行頭にスペースを追加
    return ' ' + line;
  }).join('\n');

  // 最後に不要な連続空行をまとめる
  md = md.replace(/\n{3,}/g, '\n\n');
  // 先頭や末尾の不要な空白を削除
  md = md.replace(new RegExp(TEMP_CODE_SEPARATOR, 'g'), '\n'); // RegExp を使うと変数名で置換できる
  // md = md.trim();

  return md;
}