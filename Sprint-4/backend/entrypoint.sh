#!/bin/bash

echo "Aguardando o MariaDB iniciar..."
while ! nc -z mariadb 3306; do
  sleep 1
done

echo "MariaDB iniciado. Rodando migrações..."
python manage.py makemigrations
python manage.py migrate

echo "Iniciando servidor Django..."
exec "$@"
