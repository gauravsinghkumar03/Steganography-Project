document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tabs
    const tabTriggerList = [].slice.call(document.querySelectorAll('#fileTabs a'));
    const tabList = tabTriggerList.map(function (tabTriggerEl) {
        return new bootstrap.Tab(tabTriggerEl);
    });
    
    // Handle tab change events
    document.getElementById('fileTabs').addEventListener('shown.bs.tab', function (event) {
        resetAllForms();
        const activeTab = event.target.getAttribute('href');
        
        // Hide all previews
        document.querySelectorAll('.file-upload-preview').forEach(preview => {
            preview.classList.add('d-none');
        });
        
        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.value = '';
        });
    });
    
    // Setup file previews
    setupFilePreview('imageFile', 'imagePreview', 'image');
    setupFilePreview('audioFile', 'audioFilename', 'audio');
    setupFilePreview('documentFile', 'documentFilename', 'document');
    setupFilePreview('videoFile', 'videoPreview', 'video');
    
    // Setup form handlers
    setupFormHandler('imageForm', 'image');
    setupFormHandler('audioForm', 'audio');
    setupFormHandler('documentForm', 'document');
    setupFormHandler('videoForm', 'video');
    
    // Setup operation toggle handlers
    setupOperationToggle('imageOperation', 'imageSecretDataGroup');
    setupOperationToggle('audioOperation', 'audioSecretDataGroup');
    setupOperationToggle('documentOperation', 'documentSecretDataGroup');
    setupOperationToggle('videoOperation', 'videoSecretDataGroup');
    
    // Setup encryption toggle handlers
    setupEncryptionToggle('imageEncrypt', 'imagePassword');
    setupEncryptionToggle('audioEncrypt', 'audioPassword');
    setupEncryptionToggle('documentEncrypt', 'documentPassword');
    setupEncryptionToggle('videoEncrypt', 'videoPassword');
    
    // Helper function to reset all forms
    function resetAllForms() {
        document.querySelectorAll('form').forEach(form => {
            form.reset();
            // Reset custom toggles
            form.querySelectorAll('.d-none').forEach(el => {
                if (el.id.includes('Password')) {
                    el.classList.add('d-none');
                }
            });
        });
    }
    
    // Helper function for file previews
    function setupFilePreview(inputId, previewId, type) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const previewContainer = input.parentElement.querySelector('.file-upload-preview');
            
            if (!file) {
                previewContainer.classList.add('d-none');
                return;
            }
            
            previewContainer.classList.remove('d-none');
            
            if (type === 'image') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(previewId).src = e.target.result;
                };
                reader.readAsDataURL(file);
            } 
            else if (type === 'audio' || type === 'document') {
                document.getElementById(previewId).textContent = file.name;
            }
            else if (type === 'video') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const video = document.getElementById(previewId);
                    video.src = e.target.result;
                    video.load();
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Helper function for operation toggles
    function setupOperationToggle(operationName, secretDataGroupId) {
        document.querySelectorAll(`input[name="${operationName}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                const secretGroup = document.getElementById(secretDataGroupId);
                secretGroup.classList.toggle('d-none', this.value === 'extract');
            });
        });
    }
    
    // Helper function for encryption toggles
    function setupEncryptionToggle(encryptId, passwordId) {
        document.getElementById(encryptId).addEventListener('change', function() {
            document.getElementById(passwordId).classList.toggle('d-none', !this.checked);
        });
    }
    
    // Helper function for form submissions
    function setupFormHandler(formId, fileType) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('file', document.getElementById(`${fileType}File`).files[0]);
            formData.append('fileType', fileType);
            formData.append('operation', 
                document.querySelector(`input[name="${fileType}Operation"]:checked`).value);
            
            if (document.querySelector(`input[name="${fileType}Operation"]:checked`).value === 'hide') {
                formData.append('secretData', document.getElementById(`${fileType}SecretData`).value);
            }
            
            if (document.getElementById(`${fileType}Encrypt`).checked) {
                formData.append('password', document.getElementById(`${fileType}Password`).value);
            }
            
            processFormData(formData, fileType);
        });
    }
    
    // Process form data
    function processFormData(formData, fileType) {
        // Show loading state
        const submitBtn = document.querySelector(`#${fileType}Form button[type="submit"]`);
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
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
            
            const modal = new bootstrap.Modal(document.getElementById('resultsModal'));
            const modalBody = document.getElementById('resultsModalBody');
            const downloadBtn = document.getElementById('downloadBtn');
            const modalTitle = document.getElementById('resultsModalTitle');
            
            if (data.error) {
                modalTitle.textContent = 'Error';
                modalBody.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                downloadBtn.classList.add('d-none');
            } else if (data.success) {
                if (formData.get('operation') === 'hide') {
                    modalTitle.textContent = 'Success';
                    modalBody.innerHTML = `
                        <div class="alert alert-success">Data hidden successfully!</div>
                        <p>Your file is ready to download.</p>`;
                    downloadBtn.classList.remove('d-none');
                    
                    // Create a temporary link to force download with correct filename
                    const downloadUrl = `/download/${encodeURIComponent(data.filename)}?original=${encodeURIComponent(data.original_name)}`;
                    downloadBtn.href = downloadUrl;
                    downloadBtn.setAttribute('download', data.original_name);
                    
                    // Auto-click the download button after a short delay
                    setTimeout(() => {
                        downloadBtn.click();
                    }, 1000);
                } else {
                    modalTitle.textContent = 'Extracted Data';
                    modalBody.innerHTML = `
                        <div class="alert alert-success">Data extracted successfully!</div>
                        <div class="mt-3">
                            <h6>Extracted Data:</h6>
                            <div class="p-3 bg-light rounded">${data.data}</div>
                        </div>`;
                    downloadBtn.classList.add('d-none');
                }
            }
            modal.show();
        })
        .catch(error => {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            alert(`Error: ${error.message}`);
        });
    }
});