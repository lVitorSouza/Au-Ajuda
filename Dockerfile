# Usa uma imagem leve do Nginx baseada em Alpine
FROM nginx:alpine-slim

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os ficheiros da raiz do projeto para o Nginx
COPY . /usr/share/nginx/html/

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