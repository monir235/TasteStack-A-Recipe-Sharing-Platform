FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x docker-entrypoint.sh

EXPOSE 8000

CMD ["bash", "-c", "echo '🚀 Starting TasteStack Backend...' && echo '🗃️ Using SQLite database' && echo '📊 Running database migrations...' && python manage.py migrate && echo '🌟 Starting Django server...' && python manage.py runserver 0.0.0.0:8000"]