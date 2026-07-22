# Etap 1 — budowa statycznych plików Vite (index.html, assets/, kontakt.php, .htaccess trafiaja do dist/)
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etap 2 — runtime PHP + Apache dla formularza kontakt.php
FROM php:8.2-apache

# Narzedzia dla Composera
RUN apt-get update \
 && apt-get install -y --no-install-recommends git unzip \
 && rm -rf /var/lib/apt/lists/*

# PHPMailer (to nie sekret) instalowany poza katalogiem publicznym: /var/www/phpmailer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN mkdir -p /opt/pm \
 && composer require phpmailer/phpmailer:^6.9 --working-dir=/opt/pm --no-interaction \
 && mkdir -p /var/www/phpmailer \
 && cp /opt/pm/vendor/phpmailer/phpmailer/src/Exception.php \
       /opt/pm/vendor/phpmailer/phpmailer/src/PHPMailer.php \
       /opt/pm/vendor/phpmailer/phpmailer/src/SMTP.php \
       /var/www/phpmailer/ \
 && rm -rf /opt/pm

# .htaccess ustawia naglowki (CSP itd.) -> potrzebne mod_headers + AllowOverride All
RUN a2enmod headers rewrite \
 && sed -ri 's#AllowOverride None#AllowOverride All#' /etc/apache2/apache2.conf

# Pliki aplikacji do domyslnego docrootu Apache (/var/www/html)
# kontakt.php szuka configu poziom wyzej: /var/www/kontakt.config.php (montowany w EasyPanel)
COPY --from=build /app/dist/ /var/www/html/

EXPOSE 80
