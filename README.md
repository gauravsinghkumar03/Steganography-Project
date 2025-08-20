# **Steganography Web Application**

A comprehensive web-based steganography platform that enables users to securely hide and extract secret messages within multiple file formats using advanced digital watermarking techniques.



## 🌟 **Features**

### Multi-Format Steganography

* **Images** → PNG, JPG, JPEG, BMP (LSB encoding)
* **Audio** → MP3, WAV (audio LSB manipulation)
* **Documents** → PDF, DOCX, TXT (metadata & comments)
* **Videos** → MP4, AVI (frame-based encoding)

### Security & Privacy

* AES-256 encryption with optional password protection
* SHA-256 password hashing for secure handling
* Server-side processing with strict validation
* Automatic deletion of uploaded files after processing

### User Experience

* Modern and responsive design powered by Bootstrap 5
* Mobile-friendly UI with clean navigation
* Real-time previews of selected carrier files
* Fast and optimized encoding/decoding workflows
* One-click downloads of processed files

---

## 🛠️ **Technology Stack**

**Backend:** Flask, Python, OpenCV, Pillow, PyDub, Wave, MoviePy, PyPDF2, python-docx, Cryptography
**Frontend:** Bootstrap 5, Font Awesome, Custom CSS, Vanilla JavaScript
**Utilities:** FFmpeg for audio/video handling

---

## 📦 **Installation & Setup**

### Prerequisites

* Python 3.9 or higher
* pip (Python package manager)
* FFmpeg installed and available in PATH

### Steps

1. Clone the repository
2. Create and activate a virtual environment
3. Install dependencies with pip
4. Install FFmpeg (Windows, Mac, or Linux)
5. Run the Flask app and visit `http://localhost:5000`

---

## 🐳 **Docker Setup (Alternative Quick Start)**

For users who prefer containerized setup:

1. Build the image with Docker
2. Run the container mapping port 5000
3. Access the app in your browser at `http://localhost:5000`

---

## 🚀 **Usage Guide**

### Hiding Data

1. Choose the file type (Image, Audio, Document, Video)
2. Upload the carrier file
3. Enter the secret message
4. Optionally set a password for encryption
5. Process the file to embed the message
6. Download the modified file

### Extracting Data

1. Choose the file type
2. Upload the stego file
3. Provide the password (if required)
4. Extract the hidden message

---

## 🎥 **Demo**

![App Demo](docs/demo.gif)
*A short animation showing the process of hiding and extracting data.*

---

## 📁 **Project Structure**

stegapp/
├── app.py                 # Main Flask application
├── steganography.py       # Core steganography algorithms
├── encryption.py          # Encryption/decryption functions
├── requirements.txt       # Python dependencies
├── LICENSE               # MIT License
├── README.md             # This file
│
├── static/               # Static assets
│   ├── css/
│   │   └── style.css     # Custom styles
│   ├── js/
│   │   └── main.js       # Frontend functionality
│   ├── uploads/          # Temporary upload storage
│   └── processed/        # Processed files storage
│
└── templates/            # HTML templates
    └── index.html        # Main application interface


## 🔒 **Security Considerations**

* Maximum upload size: 50MB
* File type and MIME validation enforced
* Path sanitization against directory traversal
* Uploaded files deleted automatically after processing
* Comprehensive error handling for safe execution

---

## 📊 **Performance Metrics**

| Operation         | Average Time | Maximum File Size |
| ----------------- | ------------ | ----------------- |
| Image Processing  | 0.5 – 2s     | 10MP images       |
| Audio Processing  | 2 – 5s       | 10 min audio      |
| Document Handling | 1 – 3s       | 50-page PDF       |
| Video Processing  | 10 – 30s     | 2 min video       |

---

## 🤝 **Contributing**

We welcome contributions!

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Push to your branch
5. Open a Pull Request

## 📝 **License**
This project is licensed under the MIT License – see the LICENSE file for details.

## 🙏 **Acknowledgments**

* OpenCV for image manipulation
* FFmpeg for audio/video processing
* Bootstrap for UI components
* Flask community for excellent documentation
  
## 📞 **Support**

* Check the Issues page for known bugs
* Open a new issue with steps to reproduce if needed
* Include error logs or screenshots for faster help

## 🚀 **Future Enhancements**
* Batch file processing
* Cloud storage integration
* Stronger encryption algorithms
* Mobile app (Android & iOS)
* API endpoints for developers
* Plugin system for custom algorithms


⭐ If you found this project helpful, don’t forget to star the repo!

🔗 Connect with the developer: [GitHub Profile](https://github.com/your-username)
🐛 Report issues: [Issues Page](../../issues)



