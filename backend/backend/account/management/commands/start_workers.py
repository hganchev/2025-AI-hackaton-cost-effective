from django.core.management.base import BaseCommand
import subprocess
import os
import signal
import sys


class Command(BaseCommand):
    help = 'Start Dramatiq workers with recommended settings'

    def add_arguments(self, parser):
        parser.add_argument('--processes', type=int, default=2,
                            help='Number of worker processes')
        parser.add_argument('--threads', type=int, default=8,
                            help='Number of worker threads per process')

    def handle(self, *args, **options):
        processes = options['processes']
        threads = options['threads']
        
        self.stdout.write(self.style.SUCCESS(
            f'Starting Dramatiq with {processes} processes and {threads} threads per process'
        ))
        
        try:
            # Use recommended settings for Dramatiq
            command = [
                'python', 'manage.py', 'rundramatiq',
                '--processes', str(processes),
                '--threads', str(threads),
                '--watch', './'
            ]
            
            # Start the process
            process = subprocess.Popen(command)
            
            # Handle graceful shutdown
            def signal_handler(sig, frame):
                self.stdout.write(self.style.WARNING('Shutting down workers...'))
                process.terminate()
                process.wait()
                sys.exit(0)
            
            signal.signal(signal.SIGINT, signal_handler)
            signal.signal(signal.SIGTERM, signal_handler)
            
            # Wait for the process to finish
            process.wait()
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error starting workers: {e}'))
            raise 