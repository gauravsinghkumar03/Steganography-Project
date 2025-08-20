from flask import Flask, render_template, request, send_from_directory, jsonify, abort, send_file
import os
from werkzeug.utils import secure_filename
from steganography import SteganographyProcessor
from encryption import encrypt_data, decrypt_data
import uuid
import mimetypes

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['PROCESSED_FOLDER'] = 'static/processed'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB limit
app.secret_key = 'your-secret-key-here'

# Add MIME type mappings
mimetypes.add_type('image/jpeg', '.jpg')
mimetypes.add_type('image/png', '.png')
mimetypes.add_type('audio/mpeg', '.mp3')
mimetypes.add_type('audio/wav', '.wav')
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('application/pdf', '.pdf')
mimetypes.add_type('application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx')
mimetypes.add_type('text/plain', '.txt')

def get_file_extension(filename):
    """Helper function to get file extension"""
    return os.path.splitext(filename)[1].lower()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_file():
    try:
        file_type = request.form['fileType']
        operation = request.form['operation']
        password = request.form.get('password', '')
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'})

        # Preserve original file extension
        original_ext = get_file_extension(file.filename)
        original_filename = secure_filename(file.filename)
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
        file.save(input_path)

        processor = SteganographyProcessor()
        
        # Generate output filename with original extension
        output_filename = f"processed_{uuid.uuid4().hex}{original_ext}"
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)

        if operation == 'hide':
            secret_data = request.form['secretData']
            if password:
                secret_data = encrypt_data(secret_data, password)
            
            getattr(processor, f'hide_in_{file_type}')(input_path, secret_data, output_path)
            
            # Verify file was created successfully
            if not os.path.exists(output_path):
                return jsonify({'error': 'Failed to create processed file'})
                
            return jsonify({
                'success': True,
                'filename': output_filename,
                'original_name': f"processed_{original_filename}"
            })
        
        elif operation == 'extract':
            extracted_data = getattr(processor, f'extract_from_{file_type}')(input_path)
            if password:
                extracted_data = decrypt_data(extracted_data, password)
            return jsonify({'success': True, 'data': extracted_data})

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/download/<filename>')
def download_file(filename):
    try:
        safe_filename = secure_filename(filename)
        filepath = os.path.join(app.config['PROCESSED_FOLDER'], safe_filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        # Get the original filename from query parameter or use safe one
        original_filename = request.args.get('original', safe_filename)
        
        # Determine MIME type
        mimetype, _ = mimetypes.guess_type(filepath)
        if mimetype is None:
            mimetype = 'application/octet-stream'
        
        # Use send_file with proper parameters
        response = send_file(
            filepath,
            mimetype=mimetype,
            as_attachment=True,
            download_name=original_filename
        )
        
        # Set additional headers to prevent caching
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)
    app.run(debug=True)