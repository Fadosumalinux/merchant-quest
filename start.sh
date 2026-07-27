#!/bin/bash
cd "$(dirname "$0")/server"
exec npx tsx src/index.ts
