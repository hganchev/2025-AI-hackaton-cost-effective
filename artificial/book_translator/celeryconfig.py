from celery import Celery

# Celery worker settings
worker_prefetch_multiplier = 1
worker_max_tasks_per_child = 100

# CPU usage limit (80%)
worker_cpu_percent_limit = 80

# Task execution settings
task_time_limit = 1800  # 30 minutes
task_soft_time_limit = 1500  # 25 minutes

# Configure task routes
task_routes = {
    'translations.tasks.*': {'queue': 'translation'},
    'books.tasks.*': {'queue': 'books'},
}

# Task priority settings
task_acks_late = True
task_reject_on_worker_lost = True

# Performance optimization
task_compression = 'gzip'
result_compression = 'gzip'
worker_max_memory_per_child = 200000  # 200MB