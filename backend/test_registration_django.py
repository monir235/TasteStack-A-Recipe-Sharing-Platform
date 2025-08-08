import os
import sys
import django

# Add the project directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tastestack.settings')

# Setup Django
django.setup()

from accounts.serializers import UserRegistrationSerializer
from accounts.models import User

def test_registration():
    print("Testing user registration...")
    
    # Test data
    test_data = {
        'username': 'testuser123',
        'email': 'test@example.com',
        'password': 'testpassword123',
        'password_confirm': 'testpassword123'
    }
    
    print(f"Test data: {test_data}")
    
    # Check if user already exists
    if User.objects.filter(email=test_data['email']).exists():
        print("User with this email already exists. Deleting...")
        User.objects.filter(email=test_data['email']).delete()
    
    if User.objects.filter(username=test_data['username']).exists():
        print("User with this username already exists. Deleting...")
        User.objects.filter(username=test_data['username']).delete()
    
    # Create serializer
    serializer = UserRegistrationSerializer(data=test_data)
    
    print(f"Serializer initial data: {serializer.initial_data}")
    
    # Validate
    if serializer.is_valid():
        print("✅ Serializer is valid!")
        
        try:
            user = serializer.save()
            print(f"✅ User created successfully: {user.email}")
            print(f"User ID: {user.id}")
            print(f"Username: {user.username}")
        except Exception as e:
            print(f"❌ Error creating user: {e}")
    else:
        print("❌ Serializer is NOT valid!")
        print(f"Errors: {serializer.errors}")
        
        # Check each field individually
        for field_name, field in serializer.fields.items():
            if field_name in test_data:
                try:
                    field.validate(test_data[field_name])
                    print(f"  ✅ {field_name}: valid")
                except Exception as e:
                    print(f"  ❌ {field_name}: {e}")
        
        # Test the validate method manually
        try:
            serializer.validate(test_data)
            print("  ✅ Cross-field validation: valid")
        except Exception as e:
            print(f"  ❌ Cross-field validation: {e}")

if __name__ == "__main__":
    test_registration()
