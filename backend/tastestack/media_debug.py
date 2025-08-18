from django.http import JsonResponse
from django.conf import settings
import os

def list_media_files(request):
    """Debug endpoint to list all media files"""
    media_files = []
    
    if os.path.exists(settings.MEDIA_ROOT):
        for root, dirs, files in os.walk(settings.MEDIA_ROOT):
            for file in files:
                if not file.startswith('.'):  # Skip hidden files
                    rel_path = os.path.relpath(os.path.join(root, file), settings.MEDIA_ROOT)
                    media_url = settings.MEDIA_URL + rel_path.replace('\\', '/')
                    media_files.append({
                        'filename': file,
                        'path': rel_path.replace('\\', '/'),
                        'url': media_url,
                        'full_url': f"http://localhost:8000{media_url}"
                    })
    
    return JsonResponse({
        'media_root': settings.MEDIA_ROOT,
        'media_url': settings.MEDIA_URL,
        'files': media_files
    })