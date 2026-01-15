"""Core game logic for Undercover game."""

import random
from word_bank import get_random_word_pair


def assign_roles(player_count, undercover_count=None):
    """
    Assign roles based on player count and optional undercover count.
    Returns a list of roles: 'civilian', 'undercover', 'mrwhite'
    
    Args:
        player_count: Total number of players
        undercover_count: Number of undercovers (if None, uses default distribution)
    
    Default distribution:
    - 4-5 players: 1 undercover, 1 mr white, rest civilians
    - 6+ players: 2 undercovers, 1 mr white, rest civilians
    """
    if player_count < 4:
        raise ValueError("Minimum 4 players required")
    
    # Determine undercover count if not specified
    if undercover_count is None:
        if player_count <= 5:
            undercover_count = 1
        else:
            undercover_count = 2
    
    # Validate undercover count
    max_undercovers = player_count - 2  # At least 1 civilian + 1 mr white
    if undercover_count < 1:
        undercover_count = 1
    if undercover_count > max_undercovers:
        undercover_count = max_undercovers
    
    # Build roles: undercovers + mr white + civilians
    roles = ['undercover'] * undercover_count + ['mrwhite'] + ['civilian'] * (player_count - undercover_count - 1)
    
    # Shuffle roles randomly
    random.shuffle(roles)
    return roles


def assign_words(roles):
    """
    Assign words based on roles.
    Returns a list of words matching the roles list.
    """
    civilian_word, undercover_word = get_random_word_pair()
    
    words = []
    for role in roles:
        if role == 'civilian':
            words.append(civilian_word)
        elif role == 'undercover':
            words.append(undercover_word)
        else:  # mrwhite
            words.append(None)
    
    return words, civilian_word, undercover_word


def check_win_condition(players):
    """
    Check if any team has won.
    Returns: ('civilians', 'undercovers', 'mrwhite', or None)
    
    Win conditions:
    - Civilians win: All undercovers and mr white eliminated
    - Undercovers/Mr White win: Undercovers+MrWhite > Civilians (strictly outnumber)
    """
    alive_players = [p for p in players if p['is_alive']]
    
    if not alive_players:
        return None
    
    civilians = sum(1 for p in alive_players if p['role'] == 'civilian')
    undercovers = sum(1 for p in alive_players if p['role'] == 'undercover')
    mr_white = sum(1 for p in alive_players if p['role'] == 'mrwhite')
    
    # Civilians win if all enemies eliminated
    if undercovers == 0 and mr_white == 0:
        return 'civilians'
    
    # Undercovers/Mr White win if they OUTNUMBER civilians (not just equal)
    if (undercovers + mr_white) >= civilians:
        return 'undercovers'
    
    return None


def tally_votes(votes, players):
    """
    Tally votes and determine who gets eliminated.
    votes: dict of {voter_id: voted_for_id}
    players: list of player dicts
    
    Returns: (eliminated_player_id, vote_counts)
    """
    vote_counts = {}
    
    # Count votes
    for voted_for in votes.values():
        vote_counts[voted_for] = vote_counts.get(voted_for, 0) + 1
    
    if not vote_counts:
        return None, {}
    
    # Find player with most votes
    max_votes = max(vote_counts.values())
    candidates = [pid for pid, count in vote_counts.items() if count == max_votes]
    
    # If tie, randomly select one
    eliminated_id = random.choice(candidates)
    
    return eliminated_id, vote_counts


def validate_mr_white_guess(guess, civilian_word):
    """
    Validate Mr. White's guess against the civilian word.
    Case-insensitive comparison.
    """
    if not guess or not civilian_word:
        return False
    
    return guess.strip().lower() == civilian_word.strip().lower()
