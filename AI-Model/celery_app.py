import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'learnmate-backend', '.env'))

REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

app = Celery('learnmate_ai',
             broker=REDIS_URL,
             backend=REDIS_URL,
             include=['tasks'])

app.conf.update(
    result_expires=3600,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

if __name__ == '__main__':
    app.start()
