# Usa uma imagem leve do Nginx baseada em Alpine
FROM nginx:alpine-slim

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todo o conteúdo do repositório para uma pasta temporária de build
COPY . /tmp/project/

# Procura e copia o index.html (independentemente de estar na raiz ou numa subpasta) para a raiz do Nginx
RUN find /tmp/project -name "index.html" -exec cp {} /usr/share/nginx/html/ \;

# Procura e copia todas as pastas de assets/imagens/vídeos para o Nginx
RUN find /tmp/project -type d -name "images" -exec cp -r {} /usr/share/nginx/html/ \;
RUN find /tmp/project -type d -name "assets" -exec cp -r {} /usr/share/nginx/html/ \;

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