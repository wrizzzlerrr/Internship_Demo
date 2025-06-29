#!/usr/bin/env python3

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)

def run_server():
    """Run the Flask server"""
    try:
        print("🚀 Starting Crypto Web Tool backend server...")
        print("📡 Server will be available at: http://localhost:5000")
        print("🔧 API endpoints:")
        print("   - POST /encrypt - Encrypt text")
        print("   - POST /decrypt - Decrypt text")
        print("   - POST /encrypt_file - Encrypt file")
        print("   - POST /decrypt_file - Decrypt file")
        print("   - POST /generate_key - Generate encryption key")
        print("   - GET /health - Health check")
        print("\n⚠️  Make sure the frontend is running on http://localhost:5173")
        print("📝 Press Ctrl+C to stop the server\n")
        
        # Create uploads directory if it doesn't exist
        os.makedirs('uploads', exist_ok=True)
        
        # Run the Flask app
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    print("🔐 Crypto Web Tool Backend")
    print("=" * 30)
    
    # Install dependencies
    install_requirements()
    
    # Run server
    run_server()