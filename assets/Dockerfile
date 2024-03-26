FROM denoland/deno:latest

COPY assets .

CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-net", "/usr/share/nginx/html/main.mjs"]