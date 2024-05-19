from os import listdir
from os.path import isfile, join
from json import loads
from tenhou_wall_reproducer import reproduce

PATH = "./agari_logs"
FILES = [f for f in listdir(PATH) if isfile(join(PATH, f))]
TOTAL_FILES = len(FILES)

TILES = [
    "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m",
    "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p",
    "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s",
    "ew", "sw", "ww", "nw", "wd", "gd", "rd"
]
TILE_ID = {s:i for i, s in enumerate(TILES)}

WINS = ["TSUMO", "RON"]
WIN_ID = {s:i for i, s in enumerate(WINS)}

def encode(agari, wall):
    agari = agari.replace("\'", "\"").replace("False", "\"False\"").replace("True", "\"True\"")
    data = loads(agari)
    
    win = WIN_ID[data["type"]]
    player = data["player"]
    
    hand = []
    for tile in data["hand"]:
        id = TILE_ID[tile[:2]]
        idx = int(tile[2])
        hand.append((id << 2) | idx)
    
    fu = data["fu"]
        
    print(win, player, hand, fu, sep="\n")
    

for i, f in enumerate(FILES[:1]):    
    print(f)
    
    lines = []
    with open(join(PATH, f), "r") as file:
        for line in file:
            lines.append(line.strip())
    print(lines)
    
    walls = reproduce(lines[0], len(lines) - 1)
    for i in range(len(lines) - 1):
        encode(lines[i+1], walls[i])
        
    if not (i+1)%250:
        print(f"{i+1}/{TOTAL_FILES} complete")
