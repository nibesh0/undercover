"""Utility functions for the Undercover game."""

import random
import string
import re


def generate_room_code(length=6):
    """Generate a unique room code with uppercase letters and numbers."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def sanitize_string(text, max_length=50):
    """Sanitize user input by removing special characters and limiting length."""
    if not isinstance(text, str):
        return ""
    
    # Remove leading/trailing whitespace
    text = text.strip()
    
    # Limit length
    text = text[:max_length]
    
    # Remove potentially harmful characters but keep basic punctuation
    text = re.sub(r'[<>{}[\]\\]', '', text)
    
    return text


def validate_room_code(code):
    """Validate room code format (6 alphanumeric characters)."""
    if not isinstance(code, str):
        return False
    return len(code) == 6 and code.isalnum()


def validate_player_name(name):
    """Validate player name (1-20 characters, non-empty)."""
    if not isinstance(name, str):
        return False
    name = name.strip()
    return 1 <= len(name) <= 20
