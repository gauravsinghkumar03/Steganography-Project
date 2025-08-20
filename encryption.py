from cryptography.fernet import Fernet
import base64
from hashlib import sha256

def encrypt_data(data, password):
    key = base64.urlsafe_b64encode(sha256(password.encode()).digest())
    cipher = Fernet(key)
    return cipher.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data, password):
    try:
        key = base64.urlsafe_b64encode(sha256(password.encode()).digest())
        cipher = Fernet(key)
        return cipher.decrypt(encrypted_data.encode()).decode()
    except:
        raise ValueError("Decryption failed - wrong password?")