#!/bin/sh

curl -fsSL https://deno.land/x/install/install.sh | sh

/vercel/.deno/bin/deno run --allow-read --allow-env --allow-net ./main.mjs build