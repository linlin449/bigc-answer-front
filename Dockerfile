FROM node:lts-alpine AS builder-web
ADD ./ /build/web/
LABEL MAINTAINER=th1nk
WORKDIR /build/web
RUN echo "node" `node -v` \
    && echo "npm" `npm -v` \
    && npm config set registry https://registry.npmmirror.com \
    && npm install \
    && npm run build

FROM nginx:latest
COPY --from=builder-web /build/web/dist /user/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf