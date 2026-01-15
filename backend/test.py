import random

CATEGORIES = {
    "food": [
        "coffee","tea","juice","soda","beer","wine","burger","sandwich","pizza","pasta",
        "rice","noodles","bread","toast","cake","pie","soup","stew","chicken","turkey",
        "beef","pork","fish","shrimp","carrot","potato","tomato","pepper","apple","orange",
        "banana","grape","mango","lemon","cheese","butter","milk","yogurt","egg","bacon"
    ],
    "animals": [
        "dog","cat","wolf","fox","lion","tiger","bear","panda","horse","donkey","zebra",
        "cow","goat","sheep","deer","rabbit","mouse","rat","elephant","giraffe","monkey",
        "eagle","hawk","owl","parrot","crow","duck","goose"
    ],
    "objects": [
        "chair","sofa","table","desk","bed","lamp","clock","watch","phone","tablet",
        "laptop","desktop","keyboard","mouse","monitor","camera","fan","fridge","oven",
        "bottle","cup","mug","glass","plate","bowl","fork","spoon","knife"
    ],
    "nature": [
        "sun","moon","star","cloud","rain","snow","storm","wind","thunder","lightning",
        "fire","flame","ice","frost","river","stream","lake","ocean","sea","pond",
        "mountain","hill","forest","desert","beach","tree","bush","grass","rose","tulip"
    ],
    "sports": [
        "football","cricket","tennis","basketball","volleyball","baseball","hockey",
        "golf","boxing","cycling","running","swimming","skiing"
    ],
    "music": [
        "guitar","piano","violin","drum","flute","trumpet","saxophone","tabla","sitar",
        "banjo","ukulele","cello","harp"
    ],
    "transport": [
        "car","bus","truck","van","bike","motorcycle","scooter","train","subway",
        "tram","ship","boat","plane","jet","helicopter"
    ],
    "clothes": [
        "shirt","blouse","pants","jeans","shorts","skirt","dress","jacket","coat",
        "sweater","hoodie","scarf","hat","shoes","boots","sandals","sneakers","socks"
    ]
}

def generate_pairs(categories, target=1000):
    pairs = set()
    cat_lists = list(categories.values())
    while len(pairs) < target:
        group = random.choice(cat_lists)
        if len(group) < 2:
            continue
        a, b = random.sample(group, 2)
        pair = tuple(sorted((a, b)))
        pairs.add(pair)
    return list(pairs)

WORD_PAIRS = generate_pairs(CATEGORIES, 1000)

with open("word_bank.py", "w", encoding="utf-8") as f:
    f.write("WORD_PAIRS = [\n")
    for a, b in WORD_PAIRS:
        f.write(f'    ("{a}", "{b}"),\n')
    f.write("]\n")

print("Saved", len(WORD_PAIRS), "pairs to word_bank.py")
