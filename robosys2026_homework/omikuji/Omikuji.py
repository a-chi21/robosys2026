#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Your Name
# SPDX-License-Identifier: BSD-3-Clause
"""omikuji: 標準入力の願い事から運勢を引く決定論的おみくじコマンド。"""

import hashlib
import sys

FORTUNES = [
    {
        "rank": "大吉",
        "lead": "願いは、声に出した瞬間から動く。",
        "wish": "思いがけない形で叶う",
        "wait": "待つより、こちらから",
        "trip": "遠くへ。道中つつがなし",
    },
    {
        "rank": "中吉",
        "lead": "急がずとも、流れはもう来ている。",
        "wish": "半歩手前まで来ている",
        "wait": "近いうちに便りあり",
        "trip": "近場なら、なお吉",
    },
    {
        "rank": "小吉",
        "lead": "小さな決断が、のちに効いてくる。",
        "wish": "ひとつに絞ると吉",
        "wait": "気を許せる相手と",
        "trip": "日帰りがちょうどいい",
    },
    {
        "rank": "吉",
        "lead": "平らかな日。整えることに運がある。",
        "wish": "続けていることが力になる",
        "wait": "礼を尽くせば実りあり",
        "trip": "支度を丁寧に",
    },
    {
        "rank": "末吉",
        "lead": "今は種をまく時。実りは少し先。",
        "wish": "焦らず育てば実る",
        "wait": "時間が味方になる",
        "trip": "延期もまた吉",
    },
    {
        "rank": "凶",
        "lead": "止まることも、運のうち。焦らない。",
        "wish": "いったん手を放すと見える",
        "wait": "無理に近づかず",
        "trip": "遠出は控えめに",
    },
]


def pick(text: str) -> dict:
    """入力テキストのSHA-256から決定論的に運勢を1つ選ぶ。"""
    normalized = text.strip()
    digest = hashlib.sha256(normalized.encode("utf-8")).digest()
    index = int.from_bytes(digest[:8], "big") % len(FORTUNES)
    return FORTUNES[index]


def format_fortune(f: dict) -> str:
    return (
        f"{f['rank']} ─ {f['lead']}\n"
        f"願望: {f['wish']}\n"
        f"待人: {f['wait']}\n"
        f"旅  : {f['trip']}"
    )


def main() -> int:
    text = sys.stdin.read()
    if not text.strip():
        print("omikuji: 標準入力が空です。願い事を入力してください。",
              file=sys.stderr)
        return 1
    print(format_fortune(pick(text)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
