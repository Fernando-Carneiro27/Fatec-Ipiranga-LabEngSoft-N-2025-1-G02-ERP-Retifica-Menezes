# Usar uma imagem oficial do Python
FROM python:3.13.2

# Definir diretório de trabalho dentro do container
WORKDIR /backend

# Copiar arquivos do backend para o container
COPY . .

# Instalar dependências do Django
RUN pip install --no-cache-dir -r requirements.txt

# Expor a porta do Django
EXPOSE 8000

# Comando para rodar o servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
