# omikuji

![test](https://github.com/a-chi21/robosys2026/actions/workflows/test.yml/badge.svg)

標準入力に渡した願い事の文字列から、決定論的に運勢を1つ引くCLIコマンドです。
同じ入力には必ず同じ運勢が返るので、テストや再現がしやすくなっています。
`--html` オプションでテンプレートに結果を埋め込んだHTMLを標準出力に出せます。

## 必要なソフトウェア

- Python
  - テスト済みバージョン: 3.10 / 3.11 / 3.12 / 3.13 / 3.14

## テスト環境

- Ubuntu 24.04 LTS

## インストール

```bash
$ git clone git@github.com:a-chi21/robosys2026.git
$ cd robosys2026
$ chmod +x omikuji
```

必要に応じて PATH の通ったディレクトリにシンボリックリンクを張ってください。

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

同じ入力なら必ず同じ結果が返ります（決定論的）。入力を変えると運勢も変わります。

```bash
$ echo "散歩" | ./omikuji
```

パイプで他のコマンドにつなぐこともできます。

```bash
$ echo "明日の会議" | ./omikuji | grep "願望"
```

### HTML出力

`--html` を付けるとテンプレートHTMLに結果を埋め込んだ1枚のHTMLが標準出力に出ます。
ファイルに保存してブラウザで開いてください。

```bash
$ echo "明日の会議" | ./omikuji --html > result.html
$ xdg-open result.html        # Linux
$ explorer.exe result.html    # WSL から Windows のブラウザで開く
```

ブラウザ上の「おみくじを引く」ボタンを押すと、箱が揺れて御神籤が表示されます。

### エラー時の挙動

標準入力が空の場合は標準エラー出力にメッセージを出し、終了コード `1` で終了します。

```bash
$ echo "" | ./omikuji
omikuji: 標準入力が空です。願い事を入力してください。
$ echo $?
1
```

## テスト

```bash
$ bash test.bash
OK
```

GitHub Actions でも push / pull request のたびに自動で実行されます。
結果はページ上部のバッジで確認できます。

## ライセンス

- このソフトウェアパッケージは、3条項BSDライセンスの下、再頒布および使用が許可されます。
- © 2026 Kaifuchi Mao
