# Crypto Web Tool

A beautiful, full-stack web application for secure text and file encryption/decryption using industry-standard algorithms.

## Features

### Core Functionality
- **Multiple Algorithms**: AES, DES, and 3DES encryption support
- **Encryption Modes**: ECB and CBC modes with proper IV handling
- **Text Encryption**: Secure text encryption and decryption
- **File Encryption**: Upload and encrypt/decrypt files of any type
- **Key Generation**: Random key generation based on algorithm requirements
- **Base64 Encoding**: All keys, IVs, and ciphertext use base64 encoding

### User Experience
- **Modern UI**: Beautiful glassmorphism design with dark theme
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-time Feedback**: Status alerts and loading indicators
- **Copy to Clipboard**: Easy copying of keys, IVs, and results
- **Tabbed Interface**: Separate workflows for text and file encryption

### Security Features
- **Input Validation**: Comprehensive validation for all inputs
- **Secure Key Management**: Proper key size validation per algorithm
- **Temporary File Handling**: Secure temporary file storage and cleanup
- **Error Handling**: Detailed error messages without exposing sensitive info

## Quick Start

### Backend Setup (Python + Flask)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   python run_server.py
   ```
   
   Or directly:
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup (React + Vite)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Text Encryption
- `POST /encrypt` - Encrypt text
- `POST /decrypt` - Decrypt text

### File Encryption
- `POST /encrypt_file` - Encrypt uploaded file
- `POST /decrypt_file` - Decrypt uploaded file
- `GET /download/<filename>` - Download processed file

### Utilities
- `POST /generate_key` - Generate random encryption key
- `GET /health` - Health check

## Algorithm Specifications

| Algorithm | Key Size | Block Size | Modes |
|-----------|----------|------------|-------|
| AES       | 16 bytes | 16 bytes   | ECB, CBC |
| DES       | 8 bytes  | 8 bytes    | ECB, CBC |
| 3DES      | 24 bytes | 8 bytes    | ECB, CBC |

## Usage Examples

### Text Encryption
1. Select **Text Encryption** tab
2. Enter your text in the input field
3. Choose algorithm (AES/DES/3DES) and mode (ECB/CBC)
4. Generate or enter a base64-encoded key
5. For CBC mode, provide an IV
6. Click **Encrypt** to get the ciphertext
7. Copy the result and IV (if generated) for decryption

### File Encryption
1. Select **File Encryption** tab
2. Upload any file using the drag-and-drop area
3. Configure encryption settings
4. Generate or enter a base64-encoded key
5. Click **Encrypt File** to process
6. Download the encrypted file
7. Save the generated IV for decryption

## Security Considerations

- **Key Management**: Never share your encryption keys
- **IV Storage**: Save IVs when using CBC mode for decryption
- **File Cleanup**: Temporary files are automatically cleaned up
- **Input Validation**: All inputs are validated before processing
- **Error Handling**: Errors don't expose sensitive information

## Technology Stack

### Backend
- **Python 3.x** - Core language
- **Flask** - Web framework
- **PyCryptodome** - Cryptographic library
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icons

## Project Structure

```
crypto-web-tool/
├── backend/
│   ├── app.py              # Flask application
│   ├── crypto_utils.py     # Encryption/decryption logic
│   ├── requirements.txt    # Python dependencies
│   ├── run_server.py       # Server startup script
│   └── uploads/            # Temporary file storage
├── src/
│   ├── components/
│   │   ├── TextCrypto.tsx  # Text encryption component
│   │   ├── FileCrypto.tsx  # File encryption component
│   │   └── StatusAlert.tsx # Status notification component
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── package.json            # Node.js dependencies
└── README.md              # This file
```


## License

This project is licensed under the MIT License.

## Acknowledgments

- **PyCryptodome** for robust cryptographic operations
- **React** and **Vite** for the amazing development experience
- **Tailwind CSS** for beautiful, responsive design
- **Lucide** for the comprehensive icon set

---

Built with ❤️ for secure communications and data protection.