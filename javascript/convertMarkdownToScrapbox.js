export function convertMarkdownToScrapbox(md) {
    // コードブロックを一時退避
    const codeBlocks = [];
    md = md.replace(/```[\s\S]*?```/g, match => {
      const key = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(match);
      return key;
    });
  
    // インラインコードを一時退避（復元時にバッククオート付きで戻す）
    const inlineCodes = [];
    md = md.replace(/`([^`]+)`/g, (_, code) => {
      const key = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(`\`${code}\``);
      return key;
    });
  
    // 見出し: 常にトップレベル（インデントなし）
    // md = md.replace(/^\s*#{1,6}\s*\s*(.+)$/gm, (_, text) => text);
  
    // 箇条書き: ネストレベルに応じてスペース (level + 1)
    md = md.replace(/^([ \t]*)[-*]\s+(.*)$/gm, (_, indent, content) => {
      // タブはスペース4つ換算
      const level = indent.replace(/\t/g, '    ').length / 2;
      const spaces = ' '.repeat(level + 1);
      return `${spaces}${content}`;
    });
  
    // リンク: [text](url) → [text url]
    md = md.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, (_, text, url) => `[${text} ${url}]`);
  
    // 強調記法削除（Scrapbox は対応せず）
    md = md
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\s*---\s*/g, '');  
  
    // 引用文（>）・インラインコードプレースホルダ・コードブロックプレースホルダはそのまま
    // 通常の本文行は行頭に1スペース
    md = md.replace(/^(.+)$/gm, (line) => {
      if (/^__CODE_BLOCK_\d+__$/.test(line)) return line;
      if (/^__INLINE_CODE_\d+__$/.test(line)) return line;
      if (/^>/.test(line)) return line;
      if (/^ /.test(line)) return line;  // 既にスペースがあればそのまま
      return ' ' + line;
    });
    md = md.replace(/^\s*#{1,6}\s*\s*(.+)$/gm, (_, text) => text);
    // プレースホルダを復元
    md = md.replace(/__INLINE_CODE_(\d+)__/g, (_, i) => inlineCodes[i]);
    md = md.replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => codeBlocks[i]);
  
    return md;
  }