# my-scripts

このリポジトリは、作ったスクリプトを保管しています。

## 含まれるスクリプト

### JavaScript

#### 文字数カウンター (`count_characters.js`)

選択したテキストの文字数をカウントしてポップアップで表示します。

#### フォーマット済みリンクコピー (`copy_formatted_link.js`)

現在のページのタイトルとURLを`[タイトル URL]`の形式でクリップボードにコピーします。タイトルは編集可能です。タイトルに含まれる角括弧（`[`と`]`）をすべて削除します。Cosense（旧Scrapbox）でリンクの貼り付けに使うことができます。

#### ウェブサイトにおける選択の制限を解除するUserScript (`enable_selection.user.js`)

選択の制限のかかっているウェブサイトで制限を解除します。Tampermonkeyなどを使用してブラウザで拡張機能として使用できます。

#### MarkdownからScrapbox形式への変換スクリプト (`convertMarkdownToScrapbox.js`)

逐次的な正規表現置換によってMarkdown形式のテキストをScrapbox形式に変換します。以下の機能があります：
- コードブロックの変換
- 見出しの変換
- 箇条書きの変換
- リンクの変換
- 強調記法の削除
- 水平線の削除
- 適切なインデントの追加

## 今後の拡張について

新しいスクリプトを追加する際は、以下の構造に従う：

1. 適切なカテゴリのフォルダ内に新しいスクリプトファイルを作成する（例：`javascript/新しいスクリプト.js`）
2. READMEの「含まれるスクリプト」セクションに新しいスクリプトの説明を追加する
