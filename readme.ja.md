terminal-table
==============
ターミナルにテーブルを表示するやつ

## 機能
- ターミナルの幅に合わせて表示可能
- 中央寄せ, 右寄せ
- 日本語に対応 [eastasianwidth](https://github.com/komagata/eastasianwidth)
- 色付けが可能 [colors.js](https://github.com/marak/colors.js)
- 枠線は三種類から選べる、またカスタマイズも可能

## インストール

## 使い方

## API

### Constructor options
- borderStyle
  - 1: ascii
  - 2: unicode
  - 3: unicode bold
- horizontalLine - Boolean
- width - Array
  ```js
    new Table({
      width: [10, "50%", "50%"]
    });
  ```
- leftPadding, rightPadding

### Methods
- push(["item","item2",,,])
- cell(row, column, text)
- attr(row, column, { attrs })
- attrRange({ range }, { attrs })
- removeCell(row, column)
- removeRow(row)
- removeColumn(column)
