#!/usr/bin/env bash
# Renders the video in chunks with retries (a hung browser tab only costs one chunk),
# then concatenates the silent chunks and muxes the music track.
set -u
cd "$(dirname "$0")/.."
BROWSER=${BROWSER:-}
CHUNK=${CHUNK:-600}
TOTAL=7200
mkdir -p out/chunks
npx remotion bundle --out-dir=out/bundle >/dev/null 2>&1
: > out/chunks/list.txt
for ((a=0; a<TOTAL; a+=CHUNK)); do
  b=$((a+CHUNK-1)); f=$(printf "out/chunks/c%05d.mp4" $a)
  echo "file '$(basename $f)'" >> out/chunks/list.txt
  [ -s "$f" ] && continue
  for try in 1 2 3 4; do
    echo "chunk $a-$b try $try"
    npx remotion render out/bundle Intilaqah "$f" --frames=$a-$b --muted --crf=22 \
      --timeout=60000 --concurrency=4 ${BROWSER:+--browser-executable=$BROWSER} > out/chunks/log.txt 2>&1 && break
    rm -f "$f"
  done
  [ -s "$f" ] || { echo "chunk $a failed"; exit 1; }
done
ffmpeg -y -loglevel error -f concat -safe 0 -i out/chunks/list.txt -i public/audio/music.mp3 \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/intilaqah.mp4
echo "done: out/intilaqah.mp4"
