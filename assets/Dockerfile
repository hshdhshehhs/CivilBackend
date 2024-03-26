FROM denoland/deno:latest

CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-net", "/usr/share/nginx/html/main.mjs"]

FROM nginx:latest

COPY assets /usr/share/nginx/html

COPY assets/nginx/conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]