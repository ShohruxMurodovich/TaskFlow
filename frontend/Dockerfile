# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run generate

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/.output/public /usr/share/nginx/html

# Custom Nginx config template to handle SPA routing and dynamic PORT
RUN echo 'server { \
    listen ${PORT}; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf.template

CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
