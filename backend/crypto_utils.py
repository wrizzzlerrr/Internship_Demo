import base64
import os
from Crypto.Cipher import AES, DES, DES3
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

class CryptoUtils:
    @staticmethod
    def get_key_size(algorithm):
        """Get the required key size for each algorithm"""
        key_sizes = {
            'AES': 16,  # 128 bits
            'DES': 8,   # 64 bits
            '3DES': 24  # 192 bits
        }
        return key_sizes.get(algorithm, 16)
    
    @staticmethod
    def get_block_size(algorithm):
        """Get the block size for each algorithm"""
        block_sizes = {
            'AES': 16,
            'DES': 8,
            '3DES': 8
        }
        return block_sizes.get(algorithm, 16)
    
    @staticmethod
    def create_cipher(algorithm, key, mode, iv=None):
        """Create cipher object based on algorithm and mode"""
        cipher_map = {
            'AES': AES,
            'DES': DES,
            '3DES': DES3
        }
        
        cipher_class = cipher_map.get(algorithm)
        if not cipher_class:
            raise ValueError(f"Unsupported algorithm: {algorithm}")
        
        if mode == 'ECB':
            return cipher_class.new(key, cipher_class.MODE_ECB)
        elif mode == 'CBC':
            if iv is None:
                iv = get_random_bytes(CryptoUtils.get_block_size(algorithm))
            return cipher_class.new(key, cipher_class.MODE_CBC, iv), iv
        else:
            raise ValueError(f"Unsupported mode: {mode}")
    
    @staticmethod
    def encrypt_text(text, key_b64, algorithm, mode, iv_b64=None):
        """Encrypt text using specified algorithm and mode"""
        try:
            # Decode base64 key
            key = base64.b64decode(key_b64)
            
            # Validate key size
            expected_size = CryptoUtils.get_key_size(algorithm)
            if len(key) != expected_size:
                raise ValueError(f"{algorithm} requires a {expected_size}-byte key")
            
            # Convert text to bytes
            plaintext = text.encode('utf-8')
            
            # Create cipher
            iv = None
            if mode == 'CBC':
                if iv_b64:
                    iv = base64.b64decode(iv_b64)
                cipher, iv = CryptoUtils.create_cipher(algorithm, key, mode, iv)
            else:
                cipher = CryptoUtils.create_cipher(algorithm, key, mode)
            
            # Pad plaintext
            block_size = CryptoUtils.get_block_size(algorithm)
            padded_plaintext = pad(plaintext, block_size)
            
            # Encrypt
            ciphertext = cipher.encrypt(padded_plaintext)
            
            result = {
                'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
                'success': True
            }
            
            if iv:
                result['iv'] = base64.b64encode(iv).decode('utf-8')
            
            return result
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def decrypt_text(ciphertext_b64, key_b64, algorithm, mode, iv_b64=None):
        """Decrypt text using specified algorithm and mode"""
        try:
            # Decode base64 inputs
            key = base64.b64decode(key_b64)
            ciphertext = base64.b64decode(ciphertext_b64)
            
            # Validate key size
            expected_size = CryptoUtils.get_key_size(algorithm)
            if len(key) != expected_size:
                raise ValueError(f"{algorithm} requires a {expected_size}-byte key")
            
            # Create cipher
            if mode == 'CBC':
                if not iv_b64:
                    raise ValueError("IV is required for CBC mode")
                iv = base64.b64decode(iv_b64)
                cipher, _ = CryptoUtils.create_cipher(algorithm, key, mode, iv)
            else:
                cipher = CryptoUtils.create_cipher(algorithm, key, mode)
            
            # Decrypt
            padded_plaintext = cipher.decrypt(ciphertext)
            
            # Unpad
            block_size = CryptoUtils.get_block_size(algorithm)
            plaintext = unpad(padded_plaintext, block_size)
            
            return {
                'plaintext': plaintext.decode('utf-8'),
                'success': True
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def encrypt_file(file_data, key_b64, algorithm, mode, iv_b64=None):
        """Encrypt file data using specified algorithm and mode"""
        try:
            # Decode base64 key
            key = base64.b64decode(key_b64)
            
            # Validate key size
            expected_size = CryptoUtils.get_key_size(algorithm)
            if len(key) != expected_size:
                raise ValueError(f"{algorithm} requires a {expected_size}-byte key")
            
            # Create cipher
            iv = None
            if mode == 'CBC':
                if iv_b64:
                    iv = base64.b64decode(iv_b64)
                cipher, iv = CryptoUtils.create_cipher(algorithm, key, mode, iv)
            else:
                cipher = CryptoUtils.create_cipher(algorithm, key, mode)
            
            # Pad file data
            block_size = CryptoUtils.get_block_size(algorithm)
            padded_data = pad(file_data, block_size)
            
            # Encrypt
            encrypted_data = cipher.encrypt(padded_data)
            
            result = {
                'encrypted_data': encrypted_data,
                'success': True
            }
            
            if iv:
                result['iv'] = base64.b64encode(iv).decode('utf-8')
            
            return result
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def decrypt_file(encrypted_data, key_b64, algorithm, mode, iv_b64=None):
        """Decrypt file data using specified algorithm and mode"""
        try:
            # Decode base64 key
            key = base64.b64decode(key_b64)
            
            # Validate key size
            expected_size = CryptoUtils.get_key_size(algorithm)
            if len(key) != expected_size:
                raise ValueError(f"{algorithm} requires a {expected_size}-byte key")
            
            # Create cipher
            if mode == 'CBC':
                if not iv_b64:
                    raise ValueError("IV is required for CBC mode")
                iv = base64.b64decode(iv_b64)
                cipher, _ = CryptoUtils.create_cipher(algorithm, key, mode, iv)
            else:
                cipher = CryptoUtils.create_cipher(algorithm, key, mode)
            
            # Decrypt
            padded_data = cipher.decrypt(encrypted_data)
            
            # Unpad
            block_size = CryptoUtils.get_block_size(algorithm)
            original_data = unpad(padded_data, block_size)
            
            return {
                'decrypted_data': original_data,
                'success': True
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def generate_key(algorithm):
        """Generate a random key for the specified algorithm"""
        key_size = CryptoUtils.get_key_size(algorithm)
        key = get_random_bytes(key_size)
        return base64.b64encode(key).decode('utf-8')