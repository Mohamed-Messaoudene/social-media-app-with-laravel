FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    unzip zip git curl libpng-dev libonig-dev libxml2-dev \
    default-mysql-client \
    && docker-php-ext-install pdo_mysql

# Install Redis extension (you already needed it earlier)
RUN pecl install redis && docker-php-ext-enable redis

RUN a2enmod rewrite

WORKDIR /var/www/html

# Fix Apache root
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' \
    /etc/apache2/sites-available/000-default.conf

RUN echo '<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

# 🔥 DO NOT USE chown here (will fail with volume)