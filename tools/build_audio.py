#!/usr/bin/env python3
"""Native en-US word, sentence, and letter-name MP3s via edge-tts. Trimmed and small."""
import asyncio
import json
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
VOICE = "en-US-AnaNeural"
RATE = "-12%"
CONCURRENCY = 4


def load_words():
    text = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
    payload = text.split("=", 1)[1].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)["words"]


def trim(src: Path, dst: Path):
    af = (
        "silenceremove=start_periods=1:start_threshold=-36dB:start_silence=0.03,"
        "areverse,"
        "silenceremove=start_periods=1:start_threshold=-36dB:start_silence=0.06,"
        "areverse"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(src), "-af", af, "-ac", "1", "-ar", "24000",
         "-codec:a", "libmp3lame", "-b:a", "40k", str(dst)],
        check=True, capture_output=True,
    )
    if dst.stat().st_size < 350:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-ac", "1", "-ar", "24000",
             "-codec:a", "libmp3lame", "-b:a", "40k", str(dst)],
            check=True, capture_output=True,
        )


async def synth(sem, rel, text, stats):
    dst = ROOT / rel
    if dst.exists() and dst.stat().st_size > 500:
        stats["skip"] += 1
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = dst.with_suffix(".raw.mp3")
    async with sem:
        last = None
        for attempt in range(4):
            try:
                comm = edge_tts.Communicate(text, VOICE, rate=RATE)
                await comm.save(str(tmp))
                if not tmp.exists() or tmp.stat().st_size < 400:
                    raise RuntimeError("empty audio")
                trim(tmp, dst)
                tmp.unlink(missing_ok=True)
                stats["ok"] += 1
                done = stats["ok"] + stats["skip"] + stats["fail"]
                if done % 25 == 0:
                    print(f"progress ok={stats['ok']} skip={stats['skip']} fail={stats['fail']} last={rel}", flush=True)
                return
            except Exception as exc:  # noqa: BLE001
                last = exc
                await asyncio.sleep(1.2 * (attempt + 1))
        stats["fail"] += 1
        print(f"FAIL {rel} {last}", flush=True)
        tmp.unlink(missing_ok=True)


def silence():
    dst = ROOT / "audio" / "silence.mp3"
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() and dst.stat().st_size > 200:
        return
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
         "-t", "0.25", "-codec:a", "libmp3lame", "-b:a", "32k", str(dst)],
        check=True, capture_output=True,
    )


async def main():
    silence()
    words = load_words()
    jobs = []
    for wid, word in words.items():
        jobs.append((f"audio/w/{wid}.mp3", word["en"]))
        jobs.append((f"audio/s/{wid}.mp3", word["sentence"]))
    # Letter names. Neural voices reject IPA <phoneme> SSML, so these are
    # native letter names (A, B, C), not isolated phonemes.
    for ch in "abcdefghijklmnopqrstuvwxyz":
        jobs.append((f"audio/ph/{ch}.mp3", ch.upper()))
    print(f"jobs {len(jobs)}", flush=True)
    sem = asyncio.Semaphore(CONCURRENCY)
    stats = {"ok": 0, "skip": 0, "fail": 0}
    await asyncio.gather(*(synth(sem, rel, text, stats) for rel, text in jobs))
    print(f"DONE {stats}", flush=True)
    if stats["fail"]:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
