import os
import uuid
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from crypto_utils import CryptoUtils

app = Flask(__name__)
CORS(app)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/encrypt', methods=['POST'])
def encrypt_text():
    """Encrypt text using specified algorithm and mode"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        text = data.get('text', '').strip()
        key = data.get('key', '').strip()
        algorithm = data.get('algorithm', 'AES')
        mode = data.get('mode', 'ECB')
        iv = data.get('iv', '').strip() if data.get('iv') else None
        
        # Validation
        if not text:
            return jsonify({'success': False, 'error': 'Text is required'}), 400
        
        if not key:
            return jsonify({'success': False, 'error': 'Key is required'}), 400
        
        # Encrypt text
        result = CryptoUtils.encrypt_text(text, key, algorithm, mode, iv)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/decrypt', methods=['POST'])
def decrypt_text():
    """Decrypt text using specified algorithm and mode"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        ciphertext = data.get('ciphertext', '').strip()
        key = data.get('key', '').strip()
        algorithm = data.get('algorithm', 'AES')
        mode = data.get('mode', 'ECB')
        iv = data.get('iv', '').strip() if data.get('iv') else None
        
        # Validation
        if not ciphertext:
            return jsonify({'success': False, 'error': 'Ciphertext is required'}), 400
        
        if not key:
            return jsonify({'success': False, 'error': 'Key is required'}), 400
        
        if mode == 'CBC' and not iv:
            return jsonify({'success': False, 'error': 'IV is required for CBC mode'}), 400
        
        # Decrypt text
        result = CryptoUtils.decrypt_text(ciphertext, key, algorithm, mode, iv)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/encrypt_file', methods=['POST'])
def encrypt_file():
    """Encrypt uploaded file using specified algorithm and mode"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        key = request.form.get('key', '').strip()
        algorithm = request.form.get('algorithm', 'AES')
        mode = request.form.get('mode', 'ECB')
        iv = request.form.get('iv', '').strip() if request.form.get('iv') else None
        
        # Validation
        if not key:
            return jsonify({'success': False, 'error': 'Key is required'}), 400
        
        # Read file data
        file_data = file.read()
        
        # Encrypt file
        result = CryptoUtils.encrypt_file(file_data, key, algorithm, mode, iv)
        
        if not result['success']:
            return jsonify(result), 400
        
        # Save encrypted file
        encrypted_filename = f"encrypted_{uuid.uuid4().hex}_{file.filename}"
        encrypted_path = os.path.join(UPLOAD_FOLDER, encrypted_filename)
        
        with open(encrypted_path, 'wb') as f:
            f.write(result['encrypted_data'])
        
        response_data = {
            'success': True,
            'filename': encrypted_filename,
            'message': 'File encrypted successfully'
        }
        
        if 'iv' in result:
            response_data['iv'] = result['iv']
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/decrypt_file', methods=['POST'])
def decrypt_file():
    """Decrypt uploaded file using specified algorithm and mode"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        key = request.form.get('key', '').strip()
        algorithm = request.form.get('algorithm', 'AES')
        mode = request.form.get('mode', 'ECB')
        iv = request.form.get('iv', '').strip() if request.form.get('iv') else None
        
        # Validation
        if not key:
            return jsonify({'success': False, 'error': 'Key is required'}), 400
        
        if mode == 'CBC' and not iv:
            return jsonify({'success': False, 'error': 'IV is required for CBC mode'}), 400
        
        # Read encrypted file data
        encrypted_data = file.read()
        
        # Decrypt file
        result = CryptoUtils.decrypt_file(encrypted_data, key, algorithm, mode, iv)
        
        if not result['success']:
            return jsonify(result), 400
        
        # Save decrypted file
        decrypted_filename = f"decrypted_{uuid.uuid4().hex}_{file.filename}"
        decrypted_path = os.path.join(UPLOAD_FOLDER, decrypted_filename)
        
        with open(decrypted_path, 'wb') as f:
            f.write(result['decrypted_data'])
        
        return jsonify({
            'success': True,
            'filename': decrypted_filename,
            'message': 'File decrypted successfully'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    """Download processed file"""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(file_path):
            return jsonify({'success': False, 'error': 'File not found'}), 404
        
        return send_file(file_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/generate_key', methods=['POST'])
def generate_key():
    """Generate a random key for specified algorithm"""
    try:
        data = request.get_json()
        algorithm = data.get('algorithm', 'AES') if data else 'AES'
        
        key = CryptoUtils.generate_key(algorithm)
        
        return jsonify({
            'success': True,
            'key': key,
            'algorithm': algorithm
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'OK', 'message': 'Crypto Web Tool API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)