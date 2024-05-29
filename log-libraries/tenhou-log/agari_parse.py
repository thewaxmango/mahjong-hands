from os import listdir
from os.path import isfile, join
from json import loads
from tenhou_wall_reproducer import reproduce

PATH = "../agari_logs"
FILES = [f for f in listdir(PATH) if isfile(join(PATH, f))]
TOTAL_FILES = len(FILES)

TILES = [
    "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m",
    "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p",
    "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s",
    "ew", "sw", "ww", "nw", "wd", "gd", "rd"
]
TILE_ID = {s:i for i, s in enumerate(TILES)}

YAKU = {
    0:'門前清自摸和',     # menzen tsumo
    1:'立直',           # riichi
    2:'一発',           # ippatsu
    3:'槍槓',           # chankan
    4:'嶺上開花',        # rinshan kaihou
    5:'海底摸月',        # haitei raoyue
    6:'河底撈魚',        # houtei raoyui
    7:'平和',           # pinfu
    8:'断幺九',         # tanyao
    9:'一盃口',         # iipeiko
    10:'自風 東',       # ton
    11:'自風 南',       # nan
    12:'自風 西',       # xia
    13:'自風 北',       # pei
    14:'場風 東',       # ton
    15:'場風 南',       # nan
    16:'場風 西',       # xia
    17:'場風 北',       # pei
    18:'役牌 白',       # haku
    19:'役牌 發',       # hatsu
    20:'役牌 中',       # chun
    21:'両立直',        # daburu riichi
    22:'七対子',        # chiitoitsu
    23:'混全帯幺九',     # chanta
    24:'一気通貫',       # ittsu
    25:'三色同順',       # sanshoku doujun
    26:'三色同刻',       # sanshoku doukou
    27:'三槓子',        # sankantsu
    28:'対々和',        # toitoi
    29:'三暗刻',        # sanankou
    30:'小三元',        # shousangen
    31:'混老頭',        # honroutou
    32:'二盃口',        # ryanpeikou
    33:'純全帯幺九',     # junchan
    34:'混一色',        # honitsu
    35:'清一色',        # chinitsu
    36:'人和',          # renhou
    37:'天和',          # tenhou
    38:'地和',          # chihou
    39:'大三元',        # daisangen
    40:'四暗刻',        # suuankou
    41:'四暗刻単騎',     # suuankou tanki
    42:'字一色',        # tsuuiisou
    43:'緑一色',        # ryuuiisou
    44:'清老頭',        # chinroutou
    45:'九蓮宝燈',       # chuuren pouto
    46:'純正九蓮宝燈',    # chuuren pouto 9-wait
    47:'国士無双',       # kokushi musou
    48:'国士無双１３面',   # kokushi musou 13-wait
    49:'大四喜',        # daisuushi
    50:'小四喜',        # shousuushi
    51:'四槓子',        # suukantsu
    52:'ドラ',          # dora
    53:'裏ドラ',         # uradora
    54:'赤ドラ',         # akadora
}
LIMITS = ["", "mangan", "haneman", "baiman", "sanbaiman", "yakuman"]
LIMIT_ID = {s:i for i, s in enumerate(LIMITS)}

WINS = ["TSUMO", "RON"]
WIN_ID = {s:i for i, s in enumerate(WINS)}

WINDS = {"東": 0, "南": 1, "西": 2, "北": 3}

def tile_to_id(s):
    i = int(s[2])
    return (TILE_ID[s[:2]] << 2) | i

def encode(agari, wall, seed):
    agari = agari.replace("\'", "\"").replace("False", "\"False\"").replace("True", "\"True\"")
    data = loads(agari)
    
    win = WIN_ID[data["type"]]
    player = data["player"]
    
    round_wind = WINDS[data["round"][0]]
    round_num = int(data["round"][1])
    seat_wind = (player - int(data["oya"]) + 4) % 4
    
    machi = data['machi'][0]
    machi_tile = tile_to_id(machi)
    
    hand = []
    for tile in data["hand"]:
        v = tile_to_id(tile)
        if v != machi_tile:
            hand.append(v)
    
    limit = LIMIT_ID[data["limit"]]
    yakuman = len(data["yakuman"])
    
    closed = ["False", "True"].index(data["closed"])
    
    yaku = [0]*len(YAKU)
    for yaku_id, han in data["yaku"]:
        yaku[yaku_id] = han
    yakuman = data["yakuman"]
    for v in yakuman:
        yaku[v] = 13
    
    han = min(14, sum(x for x in yaku))
    fu = data["fu"]
    
    # BACK, REGULAR, HORIZ, HORIZ2, HIDE, HORIZ3
    melds = []
    for grp in data["melds"]:
        if grp["type"] == "pon":
            called_tile = tile_to_id(grp["tiles"].pop(grp["called"]))
            for i in range(3, 0, -1):
                if grp["fromPlayer"] == i:
                    melds.append((called_tile, 2))
                else:
                    tile = tile_to_id(grp["tiles"].pop(0))
                    melds.append((tile, 1))
        
        elif grp["type"] == "chakan":
            #daiminkan
            called_tile = tile_to_id(grp["tiles"].pop(grp["called"]))
            if grp["fromPlayer"] != 1:
                grp["fromPlayer"] += 1
            for i in range(4, 0, -1):
                if grp["fromPlayer"] == i:
                    melds.append((called_tile, 2))
                else:
                    tile = tile_to_id(grp["tiles"].pop(0))
                    melds.append((tile, 1))
        
        elif grp["type"] == "kan":
            if "fromPlayer" in grp:
                #shouminkan
                called_tile = tile_to_id(grp["tiles"].pop(grp["called"]))
                stacked_tile = tile_to_id(grp["tiles"].pop())
                style = 5 if (stacked_tile & 3) == 0 else 3
                for i in range(3, 0, -1):
                    if grp["fromPlayer"] == i:
                        melds.append((called_tile, style))
                    else:
                        tile = tile_to_id(grp["tiles"].pop(0))
                        melds.append((tile, 1))
            else:
                #ankan
                tile = tile_to_id(grp["tiles"].pop(0))
                melds.append((tile, 0))
                tile = tile_to_id(grp["tiles"].pop(0))
                melds.append((tile, 1))
                tile = tile_to_id(grp["tiles"].pop(0))
                melds.append((tile, 1))
                tile = tile_to_id(grp["tiles"].pop(0))
                melds.append((tile, 0))
        
        elif grp["type"] == "chi":
            called_tile = tile_to_id(grp["tiles"].pop(grp["called"]))
            for i in range(3, 0, -1):
                if grp["fromPlayer"] == i:
                    melds.append((called_tile, 2))
                else:
                    tile = tile_to_id(grp["tiles"].pop(0))
                    melds.append((tile, 1))
    
    doras = wall[6:16:2][:len(data["dora"])]
    uradoras = wall[5:15:2][:len(data["dora"])]

    targ_seed = ""
    if seed == targ_seed:
        print(win, round_wind, seat_wind, han, fu, limit, machi_tile, doras, uradoras, hand, melds, sep="  | ")
    # necessary data: roundwind, seatwind, win by, dora, uradora, yaku, score(hanfu/limit), handshape
    
# keys: *round, *oya, *type, *player, *hand, *fu, *points, *limit, *dora, *machi, melds, *closed, *uradora, -fromplayer, *yaku, *yakuman
# shouminkan, ankan under kan (ankan if not has fromPlayer); daiminkan under chakan

def main():
    print(len(FILES))
    for i, f in enumerate(FILES):    
        lines = []
        with open(join(PATH, f), "r") as file:
            for line in file:
                lines.append(line.strip())
                
        #print("WN | RO | SE | HN | FU | LM | MA | DO | UR | TILES")
        
        walls = reproduce(lines[0], len(lines) - 1)
        for i in range(len(lines) - 1):
            encode(lines[i+1], walls[i][0], lines[0])
            
        if not (i+1)%250:
            print(f"{i+1}/{TOTAL_FILES} complete")
        
if __name__ == "__main__":
    main()
