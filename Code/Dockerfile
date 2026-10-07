# Usa uma imagem oficial, leve e segura do Alpine Linux com Nginx
FROM nginx:alpine-slim

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os ficheiros essenciais da aplicação para o servidor web
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js

# Copia a pasta de imagens/assets se necessário
COPY images/ /usr/share/nginx/html/images/

# Ajusta o Nginx para escutar na porta 10000 exigida pelo Render
RUN sed -i 's/listen       80;/listen       10000;/g' /etc/nginx/conf.d/default.conf

# Configura permissões seguras para o Nginx rodar sem privilégios de root
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Alterna para o utilizador não-privilegiado 'nginx'
USER nginx

# Expõe a porta para o Render
EXPOSE 10000

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]