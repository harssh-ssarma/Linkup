#!/usr/bin/env python
"""
Django development server startup script
Run this to start the Linkup backend server
"""
import os
import sys
import subprocess

def main():
    """Start Django development server"""
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'linkup.settings')
    
    try:
        # Import Django and check if it's available
        import django
        print("✅ Django is available")
        
        # Setup Django
        django.setup()
        print("✅ Django setup complete")
        
        # Run migrations
        print("🔄 Running migrations...")
        subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
        print("✅ Migrations complete")
        
        # Start development server
        print("🚀 Starting Django development server...")
        print("📱 Linkup API will be available at: http://localhost:8000")
        print("🔧 Admin panel: http://localhost:8000/admin")
        print("📡 API endpoints: http://localhost:8000/api/")
        print("\n💡 For OTP testing (development mode):")
        print("   - OTP codes will be printed in console")
        print("   - Any 6-digit code will work for testing")
        print("\n🛑 Press Ctrl+C to stop the server\n")
        
        subprocess.run([sys.executable, 'manage.py', 'runserver', 'localhost:8000'])
        
    except ImportError:
        print("❌ Django is not installed. Please install requirements:")
        print("   pip install -r requirements.txt")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()