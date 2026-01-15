"""
Word bank for Undercover game.
Each tuple contains (civilian_word, undercover_word).
Expanded with 100+ Indian English word pairs.
"""

import random

WORD_PAIRS = [
    # Food & Beverages (Indian context)
    ("chai", "coffee"),
    ("samosa", "pakora"),
    ("dosa", "uttapam"),
    ("idli", "vada"),
    ("biryani", "pulao"),
    ("roti", "paratha"),
    ("naan", "kulcha"),
    ("paneer", "tofu"),
    ("dal", "soup"),
    ("rice", "wheat"),
    ("chutney", "pickle"),
    ("lassi", "buttermilk"),
    ("gulab jamun", "rasgulla"),
    ("jalebi", "imarti"),
    ("ladoo", "barfi"),
    ("curry", "gravy"),
    ("masala", "spice"),
    ("papad", "chips"),
    ("bhel", "chaat"),
    ("vada pav", "sandwich"),
    
    # Transportation
    ("auto rickshaw", "taxi"),
    ("metro", "local train"),
    ("bus", "tempo"),
    ("bike", "scooter"),
    ("car", "suv"),
    ("cycle", "bicycle"),
    ("airplane", "helicopter"),
    ("rickshaw", "cart"),
    
    # Places & Locations
    ("temple", "mosque"),
    ("school", "college"),
    ("market", "mall"),
    ("railway station", "bus stand"),
    ("hospital", "clinic"),
    ("park", "garden"),
    ("flat", "bungalow"),
    ("village", "town"),
    ("city", "metro"),
    ("beach", "river"),
    
    # Occupations
    ("doctor", "nurse"),
    ("teacher", "professor"),
    ("engineer", "architect"),
    ("lawyer", "judge"),
    ("businessman", "shopkeeper"),
    ("farmer", "gardener"),
    ("driver", "conductor"),
    ("chef", "cook"),
    ("actor", "dancer"),
    ("cricketer", "footballer"),
    
    # Entertainment & Sports
    ("cricket", "football"),
    ("bollywood", "hollywood"),
    ("movie", "serial"),
    ("song", "music"),
    ("dance", "drama"),
    ("kabaddi", "kho kho"),
    ("carrom", "chess"),
    ("cards", "dice"),
    ("youtube", "instagram"),
    ("whatsapp", "telegram"),
    
    # Clothing & Fashion
    ("saree", "salwar kameez"),
    ("kurta", "shirt"),
    ("dhoti", "pajama"),
    ("dupatta", "scarf"),
    ("jeans", "trousers"),
    ("sandals", "slippers"),
    ("bindi", "sindoor"),
    ("bangles", "bracelet"),
    ("shawl", "stole"),
    
    # Education & Study
    ("school bag", "backpack"),
    ("notebook", "textbook"),
    ("exam", "test"),
    ("principal", "headmaster"),
    ("class", "lecture"),
    ("homework", "assignment"),
    ("pen", "pencil"),
    ("eraser", "sharpener"),
    ("blackboard", "whiteboard"),
    
    # Home & Family
    ("kitchen", "bedroom"),
    ("balcony", "terrace"),
    ("sofa", "chair"),
    ("table", "desk"),
    ("fan", "ac"),
    ("tv", "computer"),
    ("fridge", "freezer"),
    ("stove", "oven"),
    ("bucket", "mug"),
    ("towel", "napkin"),
    
    # Festival & Culture
    ("diwali", "holi"),
    ("rakhi", "bhai dooj"),
    ("eid", "ramadan"),
    ("christmas", "new year"),
    ("wedding", "engagement"),
    ("puja", "aarti"),
    ("rangoli", "mehendi"),
    ("crackers", "fireworks"),
    
    # Nature & Weather
    ("summer", "winter"),
    ("monsoon", "spring"),
    ("rain", "storm"),
    ("sun", "moon"),
    ("tree", "plant"),
    ("flower", "leaf"),
    ("mountain", "hill"),
    ("river", "lake"),
    ("ocean", "sea"),
    
    # Technology & Gadgets
    ("mobile", "phone"),
    ("laptop", "computer"),
    ("charger", "adapter"),
    ("earphones", "headphones"),
    ("wifi", "internet"),
    ("bluetooth", "hotspot"),
    ("camera", "video"),
    ("app", "website"),
    
    # Daily Life
    ("morning", "evening"),
    ("breakfast", "lunch"),
    ("water", "juice"),
    ("bed", "mattress"),
    ("pillow", "cushion"),
    ("blanket", "quilt"),
    ("soap", "shampoo"),
    ("toothbrush", "toothpaste"),
    ("comb", "brush"),
    
    # Common Objects
    ("bottle", "flask"),
    ("bag", "purse"),
    ("umbrella", "raincoat"),
    ("key", "lock"),
    ("wallet", "purse"),
    ("watch", "clock"),
    ("candle", "lamp"),
    ("mirror", "glass"),
]


def get_random_word_pair():
    """Returns a random (civilian_word, undercover_word) tuple."""
    return random.choice(WORD_PAIRS)
