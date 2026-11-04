#!/bin/sh
# Rebuild: npm i react@18 react-dom@18 esbuild ; then run from games-src/
for g in munjang space; do
  npx esbuild main_$g.tsx --bundle --minify --format=iife --jsx=automatic \
    --alias:grok/canvas=./shim.ts --define:process.env.NODE_ENV='"production"' \
    --outfile=../$g/app.js
done
