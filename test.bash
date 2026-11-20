#!/bin/bash
# SPDX-FileCopyrightText: 2026 Mao Kaifuchi
# SPDX-License-Identifier: BSD-3-Clause

ng () {
    echo ${1}行目のテスト失敗
    res=1
}

res=0

# テスト1: 普通に実行して出力が空でない
out=$(echo "明日の会議" | ./omikuji)
[ -n "$out" ] || ng "$LINENO"

# テスト2: 同じ入力なら同じ結果（決定論性）
a=$(echo "明日の会議" | ./omikuji)
b=$(echo "明日の会議" | ./omikuji)
[ "$a" = "$b" ] || ng "$LINENO"

# テスト3: 空入力はエラー終了する
echo "" | ./omikuji 2>/dev/null
[ "$?" = 1 ] || ng "$LINENO"

# テスト4: 出力に「願望:」が含まれる
echo "テスト" | ./omikuji | grep -q "願望:" || ng "$LINENO"

[ $res = 0 ] && echo OK
exit $res
