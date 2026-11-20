# robosys2026
# omikujiコマンド

![test](https://github.com/a-chi21/robosys2026/actions/workflows/test.yml/badge.svg)

標準入力から受け取った願い事のテキストをもとに、おみくじを引いて結果を標準出力に表示する CLI コマンドです。入力テキストのハッシュから運勢を決めるため、**同じ入力なら必ず同じ結果**が返ります（決定論的）。

`--html` オプションを付けると、結果を埋め込んだ和風ビジュアルの HTML を標準出力に出力します。

## 必要なソフトウェア

- Python 3.10〜3.14（テスト済み）

## テスト環境

- Ubuntu 24.04 LTS

## インストール

```bash
$ git clone git@github.com:a-chi21/robosys2026.git
$ cd robosys2026
$ chmod +x omikuji
```

```bash
$ ln -s "$(pwd)/omikuji" $HOME/bin/omikuji
```

## 使い方

### 基本（テキスト出力）

標準入力に願い事を渡すと、運勢が標準出力に表示されます。

```bash
$ echo "明日の会議" | ./omikuji
大吉 ─ 願いは、声に出した瞬間から動く。
願望: 思いがけない形で叶う
待人: 待つより、こちらから
旅  : 遠くへ。道中つつがなし
```

同じ入力なら必ず同じ結果が返ります（決定論的）。

### HTML出力

`--html` オプションでテンプレートに結果を埋め込んだHTMLを出力します。

```bash
$ echo "明日の会議" | ./omikuji --html > result.html
$ xdg-open result.html   # または explorer.exe result.html (WSL)
```
