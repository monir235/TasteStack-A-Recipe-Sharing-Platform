"""
Django management command to check database configuration and connection.

Usage:
    python manage.py checkdb
    python manage.py checkdb --verbose
"""

from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from tastestack.db_config import get_database_info, check_database_connection, print_database_info
import os


class Command(BaseCommand):
    help = 'Check database configuration and connection status'

    def add_arguments(self, parser):
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Show detailed database configuration information'
        )
        parser.add_argument(
            '--test-connection',
            action='store_true',
            help='Test database connection'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n🔍 TasteStack Database Configuration Check\n'))
        
        # Get database information
        db_info = get_database_info()
        
        # Basic information
        self.stdout.write(f"Database Engine: {self.style.WARNING(db_info['engine'].upper())}")
        self.stdout.write(f"Configuration Source: {db_info['source']}")
        
        if db_info['engine'] == 'postgresql':
            self.stdout.write(f"Host: {db_info['host']}")
            self.stdout.write(f"Port: {db_info.get('port', '5432')}")
            self.stdout.write(f"Database: {db_info['name']}")
        elif db_info['engine'] == 'sqlite3':
            self.stdout.write(f"Database File: {db_info['name']}")
            self.stdout.write(f"Location: {db_info['location']}")
        
        # Environment variables check
        if options['verbose']:
            self.stdout.write(f"\n{self.style.HTTP_INFO('Environment Variables:')}")
            env_vars = [
                'DATABASE_ENGINE', 'DATABASE_URL',
                'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_HOST', 'POSTGRES_PORT'
            ]
            
            for var in env_vars:
                value = os.getenv(var)
                if value:
                    # Hide password for security
                    if 'PASSWORD' in var:
                        value = '*' * len(value) if value else 'Not set'
                    self.stdout.write(f"  {var}: {value}")
                else:
                    self.stdout.write(f"  {var}: {self.style.ERROR('Not set')}")
        
        # Connection test
        if options['test_connection'] or options['verbose']:
            self.stdout.write(f"\n{self.style.HTTP_INFO('Connection Test:')}")
            success, message = check_database_connection()
            
            if success:
                self.stdout.write(f"  {self.style.SUCCESS(message)}")
            else:
                self.stdout.write(f"  {self.style.ERROR(message)}")
        
        # Django settings verification
        if options['verbose']:
            self.stdout.write(f"\n{self.style.HTTP_INFO('Django Database Settings:')}")
            db_config = settings.DATABASES['default']
            for key, value in db_config.items():
                if key == 'PASSWORD':
                    value = '*' * len(str(value)) if value else 'Not set'
                self.stdout.write(f"  {key}: {value}")
        
        # Migration status (if connection works)
        success, _ = check_database_connection()
        if success:
            try:
                from django.core.management import execute_from_command_line
                from io import StringIO
                import sys
                
                # Capture showmigrations output
                old_stdout = sys.stdout
                sys.stdout = captured_output = StringIO()
                
                try:
                    execute_from_command_line(['manage.py', 'showmigrations', '--list'])
                    migration_output = captured_output.getvalue()
                    
                    # Count applied migrations
                    applied_count = migration_output.count('[X]')
                    unapplied_count = migration_output.count('[ ]')
                    
                    self.stdout.write(f"\n{self.style.HTTP_INFO('Migration Status:')}")
                    self.stdout.write(f"  Applied migrations: {self.style.SUCCESS(applied_count)}")
                    if unapplied_count > 0:
                        self.stdout.write(f"  Unapplied migrations: {self.style.WARNING(unapplied_count)}")
                        self.stdout.write(f"  {self.style.WARNING('Run: python manage.py migrate')}")
                    else:
                        self.stdout.write(f"  {self.style.SUCCESS('All migrations applied ✓')}")
                        
                except Exception as e:
                    self.stdout.write(f"  {self.style.ERROR(f'Could not check migrations: {e}')}")
                finally:
                    sys.stdout = old_stdout
                    
            except ImportError:
                pass
        
        # Recommendations
        self.stdout.write(f"\n{self.style.HTTP_INFO('Quick Actions:')}")
        
        if db_info['engine'] == 'sqlite3':
            self.stdout.write(f"  • To switch to PostgreSQL:")
            self.stdout.write(f"    1. Set DATABASE_ENGINE=postgresql in .env")
            self.stdout.write(f"    2. Configure POSTGRES_* variables")
            self.stdout.write(f"    3. Run: python manage.py migrate")
        else:
            self.stdout.write(f"  • To switch to SQLite:")
            self.stdout.write(f"    1. Set DATABASE_ENGINE=sqlite in .env")
            self.stdout.write(f"    2. Run: python manage.py migrate")
        
        self.stdout.write(f"\n  • Check configuration: python manage.py checkdb --verbose")
        self.stdout.write(f"  • Test connection: python manage.py checkdb --test-connection")
        self.stdout.write(f"  • Apply migrations: python manage.py migrate")
        
        self.stdout.write(f"\n{self.style.SUCCESS('Database check completed! ✓')}\n")
