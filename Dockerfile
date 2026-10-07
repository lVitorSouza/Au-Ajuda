# Utiliza uma imagem leve do Nginx baseada em Alpine Linux
FROM nginx:alpine-slim

# Remove a página padrão de boas-vindas do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia TODOS os ficheiros e pastas da raiz do projeto (HTML, CSS, JS, imagens, vídeos) para o servidor web
COPY . /usr/share/nginx/html/

# Ajusta o Nginx para escutar na porta 10000 exigida pelo Render
RUN sed -i 's/listen       80;/listen       10000;/g' /etc/nginx/conf.d/default.conf

# Configura permissões seguras para o Nginx executar sem privilégios de root
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Alterna para o utilizador restrito 'nginx' por questões de segurança
USER nginx

# Expõe a porta correta para o serviço web do Render
EXPOSE 10000

# Comando para iniciar o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]