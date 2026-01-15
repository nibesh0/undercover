"""
Word bank for Undercover game.
Each tuple contains (civilian_word, undercover_word).
"""

import random

WORD_PAIRS = [
    ("coffee", "tea"),
    ("dog", "cat"),
    ("guitar", "piano"),
    ("ocean", "lake"),
    ("sun", "moon"),
    ("book", "magazine"),
    ("car", "motorcycle"),
    ("apple", "orange"),
    ("winter", "autumn"),
    ("basketball", "volleyball"),
    ("rice", "noodles"),
    ("chair", "sofa"),
    ("phone", "tablet"),
    ("train", "subway"),
    ("hotel", "motel"),
    ("doctor", "nurse"),
    ("teacher", "professor"),
    ("river", "stream"),
    ("mountain", "hill"),
    ("bread", "toast"),
    ("soup", "stew"),
    ("cake", "pie"),
    ("shirt", "blouse"),
    ("pants", "jeans"),
    ("sneakers", "sandals"),
    ("watch", "clock"),
    ("fork", "spoon"),
    ("knife", "sword"),
    ("pen", "pencil"),
    ("laptop", "desktop"),
    ("keyboard", "piano"),
    ("mouse", "rat"),
    ("butterfly", "moth"),
    ("spider", "ant"),
    ("rose", "tulip"),
    ("tree", "bush"),
    ("grass", "weed"),
    ("rain", "snow"),
    ("thunder", "lightning"),
    ("fire", "flame"),
    ("ice", "frost"),
    ("juice", "soda"),
    ("beer", "wine"),
    ("burger", "sandwich"),
    ("pizza", "pasta"),
    ("chicken", "turkey"),
    ("beef", "pork"),
    ("fish", "shrimp"),
    ("carrot", "potato"),
    ("tomato", "pepper"),
]


def get_random_word_pair():
    """Returns a random (civilian_word, undercover_word) tuple."""
    return random.choice(WORD_PAIRS)
