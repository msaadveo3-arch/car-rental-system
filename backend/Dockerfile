
FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev \
    && docker-php-ext-install intl pdo_mysql opcache \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

RUN mkdir -p var/cache var/log \
    && chmod -R 777 var

EXPOSE 10000

CMD ["sh", "-c", "php -S 0.0.0.0:10000 -t public"]

