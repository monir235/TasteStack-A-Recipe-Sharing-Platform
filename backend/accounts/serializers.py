from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    name = serializers.SerializerMethodField()
    location = serializers.CharField(max_length=200, required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'name', 'bio', 'profile_picture', 'location', 'website', 'date_joined')
        read_only_fields = ('id', 'date_joined', 'name')

    def get_name(self, obj):
        """Return full name from first_name and last_name"""
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username or 'Anonymous'

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        help_text="Password must be at least 8 characters long and contain letters"
    )
    password_confirm = serializers.CharField(
        write_only=True,
        help_text="Must match the password field"
    )
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'username': {
                'help_text': 'Required. 150 characters or fewer. Use letters, numbers, spaces, and common symbols.',
                'min_length': 3,
            },
            'email': {
                'help_text': 'Required. Enter a valid email address.',
            }
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
        
    def validate_password(self, value):
        # Enhanced password validation with better error messages
        errors = []
        
        if len(value) < 8:
            errors.append("Password must be at least 8 characters long.")
        
        if value.isdigit():
            errors.append("Password cannot be entirely numeric. Please include letters or symbols.")
        
        if not any(c.isalpha() for c in value):
            errors.append("Password must contain at least one letter.")
        
        if value.lower() in ['password', '12345678', 'qwerty', 'password123', 'admin', 'user']:
            errors.append("This password is too common. Please choose a more unique password.")
        
        # Check if username is part of password (will be available in validate() method)
        if hasattr(self, 'initial_data') and self.initial_data.get('username'):
            username = self.initial_data.get('username', '').lower()
            if username and username in value.lower():
                errors.append("Password cannot contain your username.")
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return value

    def validate(self, data):
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
