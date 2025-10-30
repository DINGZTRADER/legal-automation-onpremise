FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir watchdog==4.0.1 requests==2.32.3
COPY watcher.py .
ENV WATCHED_FOLDER=/data/watched
ENV API_URL=http://api:8000
CMD ["python","watcher.py"]
