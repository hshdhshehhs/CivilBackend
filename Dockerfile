FROM denoland/deno:latest

COPY . .

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "./main.mjs"]