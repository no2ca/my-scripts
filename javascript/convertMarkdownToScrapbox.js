function convertMarkdownToScrapbox(md) {
  // コードブロックを一時退避
  const codeBlocks = [];
  // 衝突しにくい文字列を改行のプレースホルダーにする
  const TEMP_CODE_SEPARATOR = "TEMPCODEBLOCKSEPARATORXYZ"; 
  // ``` の前後の空白を許容し、行全体でマッチする場合に置換
  md = md.replace(
    /^\s*```(?<lang>\w+)?\s*\n?(?<code>[\s\S]*?)\n?\s*```\s*$/gm, 
    (match, lang, code) => {
      const key = `TEMPCODEBLOCKXYZ${codeBlocks.length}`;
      // console.log(`[Debug] Found code block ${codeBlocks.length}, lang: ${lang || 'code'}`); // デバッグ用
      codeBlocks.push({
        lang: lang || 'code', // 言語指定がなければ 'code'
        code: code ? code.trim() : '' // 抽出コードの前後の空白を除去
      });
      return key; // プレースホルダーを返す
    }
  );

  // 見出し: 行頭の # とスペースを除去
  md = md.replace(/^\s*#{1,6}\s+(.+)$/gm, '$1');

  // 箇条書き: ネストレベルに応じてスペース (level + 1)
  md = md.replace(/^([ \t]*)[-*]\s+(.*)$/gm, (_, indent, content) => {
    const indentLength = indent.replace(/\t/g, '    ').length;
    // スペース2つで1レベルとする
    const level = Math.floor(indentLength / 2);
    const spaces = ' '.repeat(level + 1);
    return `${spaces}${content}`;
  });

  // リンク: [text](url) → [text url]
  md = md.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '[$1 $2]'); // Scrapbox形式にスペース追加

  // 強調記法削除
  md = md
    .replace(/\*\*(.+?)\*\*/g, '$1') // **bold**
    .replace(/__(.+?)__/g, '$1')     // __bold__
    .replace(/\*(.+?)\*/g, '$1')     // *italic*
    .replace(/_(.+?)_/g, '$1');      // _italic_

  // 水平線は空行に変換
  md = md.replace(/^\s*([-*_]){3,}\s*$/gm, '');

  // 本文行へのスペース追加ロジック
  md = md.split('\n').map(line => {
    // プレースホルダー行、空行、既にインデント/引用符がある行はそのまま
    if (/^TEMPCODEBLOCKXYZ\d+$/.test(line) ||
        /^\s*$/.test(line) || // 空行または空白のみの行
        /^\s+/.test(line) || // 既にインデントあり (リストなど)
        /^>/.test(line)) {   // 引用行
      return line;
    }
    // それ以外の行は行頭にスペースを追加
    return ' ' + line;
  }).join('\n');

  // コードブロックを復元
  md = md.replace(/TEMPCODEBLOCKXYZ(\d+)/g, (match, i) => {
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

    // code:lang\nindentedCode\n になるように結合
    return `code:${block.lang}\n${indentedCode}\n${TEMP_CODE_SEPARATOR}`;
  });
  
  md = md.replace(new RegExp(TEMP_CODE_SEPARATOR, 'g'), '\n'); // 変数名で置換

  // 不要な連続空行をまとめる
  md = md.replace(/\n{3,}/g, '\n\n');

  return md;
}