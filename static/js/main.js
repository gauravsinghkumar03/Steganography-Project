let currentMode = 'hide';
let currentTab = 'image';

// Set operation mode
function setOperationMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.getElementById('hide-mode').classList.remove('active');
    document.getElementById('extract-mode').classList.remove('active');
    document.getElementById(mode + '-mode').classList.add('active');

    // Update body class for CSS targeting
    document.body.className = mode === 'extract' ? 'extract-mode' : '';
}

// Switch tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Handle file preview
function handleFilePreview(input, previewId) {
    const file = input.files[0];
    const preview = document.getElementById(previewId);
    
    if (!file) {
        preview.style.display = 'none';
        return;
    }

    preview.style.display = 'block';

    if (previewId === 'imagePreview' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imageImg').src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else if (previewId === 'videoPreview' && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('videoVid').src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else if (previewId === 'audioPreview') {
        document.getElementById('audioFileName').textContent = file.name;
    } else if (previewId === 'documentPreview') {
        document.getElementById('documentFileName').textContent = file.name;
    }
}

// Setup form submission
function setupFormHandler(type) {
    const form = document.getElementById(type + 'Form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const fileInput = document.getElementById(type + 'File');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a file');
            return;
        }

        formData.append('file', file);
        formData.append('fileType', type);
        formData.append('operation', currentMode);
        
        if (currentMode === 'hide') {
            const secretData = document.getElementById(type + 'SecretData').value;
            if (!secretData.trim()) {
                alert('Please enter secret data to hide');
                return;
            }
            formData.append('secretData', secretData);
        }
        
        const encryptCheckbox = document.getElementById(type + 'Encrypt');
        if (encryptCheckbox.checked) {
            const password = document.getElementById(type + 'Password').value;
            if (!password) {
                alert('Please enter a password');
                return;
            }
            formData.append('password', password);
        }
        
        processFormData(formData, type);
    });
}

// Process form data
function processFormData(formData, fileType) {
    const submitBtn = document.querySelector(`#${fileType}Form button[type="submit"]`);
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '🔄 Processing...';
    submitBtn.disabled = true;
    
    fetch('/process', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showModal(data, formData.get('operation'));
    })
    .catch(error => {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showModal({error: error.message}, formData.get('operation'));
    });
}

// Show modal with results
function showModal(data, operation) {
    const modal = document.getElementById('resultsModal');
    const modalBody = document.getElementById('resultsModalBody');
    const downloadBtn = document.getElementById('downloadBtn');
    const modalTitle = document.getElementById('resultsModalTitle');
    
    if (data.error) {
        modalTitle.textContent = 'Error';
        modalBody.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        downloadBtn.style.display = 'none';
    } else if (data.success) {
        if (operation === 'hide') {
            modalTitle.textContent = 'Success!';
            modalBody.innerHTML = `
                <div class="alert alert-success">Data hidden successfully!</div>
                <p>Your file is ready to download.</p>`;
            downloadBtn.style.display = 'inline-block';
            
            const downloadUrl = `/download/${encodeURIComponent(data.filename)}?original=${encodeURIComponent(data.original_name)}`;
            downloadBtn.href = downloadUrl;
            downloadBtn.setAttribute('download', data.original_name);
            
            // Auto-click download after a delay
            setTimeout(() => {
                downloadBtn.click();
            }, 1000);
        } else {
            modalTitle.textContent = 'Extracted Data';
            modalBody.innerHTML = `
                <div class="alert alert-success">Data extracted successfully!</div>
                <div style="margin-top: 15px;">
                    <h6>Extracted Data:</h6>
                    <div style="padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; margin-top: 10px; white-space: pre-wrap;">${data.data}</div>
                </div>`;
            downloadBtn.style.display = 'none';
            
            // Also populate the extracted data textarea
            const extractedTextarea = document.getElementById(currentTab + 'ExtractedData');
            if (extractedTextarea) {
                extractedTextarea.value = data.data;
            }
        }
    }
    
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('resultsModal').classList.remove('show');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle checkbox toggles for password fields
    ['image', 'audio', 'document', 'video'].forEach(type => {
        const checkbox = document.getElementById(type + 'Encrypt');
        const passwordField = document.getElementById(type + 'Password');
        
        checkbox.addEventListener('change', function() {
            passwordField.style.display = this.checked ? 'block' : 'none';
        });
    });

    // Setup form handlers
    ['image', 'audio', 'document', 'video'].forEach(type => {
        setupFormHandler(type);
    });

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('resultsModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Add floating animation to header
    const header = document.querySelector('.header h1');
    setInterval(() => {
        header.style.transform = 'translateY(' + (Math.sin(Date.now() / 1000) * 5) + 'px)';
    }, 16);

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
