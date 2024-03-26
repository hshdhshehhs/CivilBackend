FROM denoland/deno:latest

WORKDIR /app

COPY ["deno.json", "./"]

COPY . .

CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-net", "main.mjs"]