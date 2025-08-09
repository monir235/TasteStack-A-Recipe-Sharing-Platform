"""
Database configuration module for TasteStack.

This module provides automatic database configuration switching between SQLite and PostgreSQL
based on environment variables. It supports both individual environment variables and
DATABASE_URL for easy deployment.
"""

import os
import dj_database_url
from pathlib import Path


def get_database_config(base_dir):
    """
    Get database configuration based on environment variables.
    
    Args:
        base_dir (Path): Django project base directory
    
    Returns:
        dict: Database configuration for Django settings
    """
    # Get database engine from environment
    db_engine = os.getenv('DATABASE_ENGINE', 'sqlite').lower()
    
    # Check if DATABASE_URL is provided (for easy deployment)
    database_url = os.getenv('DATABASE_URL')
    
    if database_url:
        # Use DATABASE_URL if provided (overrides individual settings)
        return dj_database_url.parse(database_url)
    
    if db_engine == 'postgresql':
        return get_postgresql_config()
    else:
        # Default to SQLite
        return get_sqlite_config(base_dir)


def get_sqlite_config(base_dir):
    """
    Get SQLite database configuration.
    
    Args:
        base_dir (Path): Django project base directory
    
    Returns:
        dict: SQLite database configuration
    """
    return {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': base_dir / 'db.sqlite3',
    }


def get_postgresql_config():
    """
    Get PostgreSQL database configuration from environment variables.
    
    Returns:
        dict: PostgreSQL database configuration
    
    Raises:
        ValueError: If required PostgreSQL environment variables are missing
    """
    required_vars = ['POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        raise ValueError(
            f"PostgreSQL configuration incomplete. Missing environment variables: {', '.join(missing_vars)}\n"
            f"Please set these variables in your .env file or environment."
        )
    
    return {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
        'OPTIONS': {
            'connect_timeout': 30,
            # Add connection pooling for production
            'MAX_CONNS': 20,
            'MIN_CONNS': 1,
        }
    }


def get_database_info():
    """
    Get information about the currently configured database.
    
    Returns:
        dict: Database information including engine and connection details
    """
    db_engine = os.getenv('DATABASE_ENGINE', 'sqlite').lower()
    database_url = os.getenv('DATABASE_URL')
    
    if database_url:
        parsed = dj_database_url.parse(database_url)
        engine_name = parsed['ENGINE'].split('.')[-1]
        return {
            'engine': engine_name,
            'source': 'DATABASE_URL',
            'host': parsed.get('HOST', 'N/A'),
            'name': parsed.get('NAME', 'N/A'),
        }
    
    if db_engine == 'postgresql':
        return {
            'engine': 'postgresql',
            'source': 'Environment Variables',
            'host': os.getenv('POSTGRES_HOST', 'localhost'),
            'name': os.getenv('POSTGRES_DB', 'N/A'),
            'port': os.getenv('POSTGRES_PORT', '5432'),
        }
    
    return {
        'engine': 'sqlite3',
        'source': 'Default',
        'name': 'db.sqlite3',
        'location': 'Local file',
    }


# Utility function to check database connectivity
def check_database_connection():
    """
    Check if database connection can be established.
    This should be called after Django is configured.
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        from django.db import connection
        from django.core.management.color import no_style
        
        # Test connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
        if result:
            db_info = get_database_info()
            return True, f"✓ Successfully connected to {db_info['engine']} database"
        else:
            return False, "✗ Database connection test failed"
            
    except Exception as e:
        return False, f"✗ Database connection error: {str(e)}"


def print_database_info():
    """Print current database configuration information."""
    info = get_database_info()
    
    print("\n" + "="*50)
    print("DATABASE CONFIGURATION")
    print("="*50)
    print(f"Engine: {info['engine'].upper()}")
    print(f"Source: {info['source']}")
    
    if info['engine'] == 'postgresql':
        print(f"Host: {info['host']}")
        print(f"Port: {info.get('port', '5432')}")
        print(f"Database: {info['name']}")
    elif info['engine'] == 'sqlite3':
        print(f"File: {info['name']}")
        print(f"Location: {info['location']}")
    
    print("="*50)
    
    # Test connection if Django is available
    try:
        success, message = check_database_connection()
        print(message)
    except ImportError:
        print("Django not available for connection testing")
    
    print("="*50 + "\n")
