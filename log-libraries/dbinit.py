import sqlite3
con = sqlite3.connect("agari.db")
cur = con.cursor()

general_create = """ CREATE TABLE IF NOT EXISTS general (
                code STRING PRIMARY KEY,
                win_type TINYINT,
                round_wind TINYINT,
                seat_wind TINYINT,
                han TINYINT,
                fu TINYINT,
                score_limit TINYINT,
                machi TINYINT
                );"""

dora_create = """ CREATE TABLE IF NOT EXISTS dora 
                (code STRING PRIMARY KEY,
                dora0 TINYINT, dora1 TINYINT, dora2 TINYINT, dora3 TINYINT, dora4 TINYINT,
                ura0 TINYINT, ura1 TINYINT, ura2 TINYINT, ura3 TINYINT, ura4 TINYINT);"""

hand_create = """ CREATE TABLE IF NOT EXISTS hand 
                (code STRING PRIMARY KEY,
                closed0 TINYINT, closed1 TINYINT, closed2 TINYINT, closed3 TINYINT, closed4 TINYINT, 
                closed5 TINYINT, closed6 TINYINT, closed7 TINYINT, closed8 TINYINT, closed9 TINYINT, 
                closed10 TINYINT, closed11 TINYINT, closed12 TINYINT, open0 TINYINT, open1 TINYINT, open2 TINYINT, open3 TINYINT, open4 TINYINT, 
                open5 TINYINT, open6 TINYINT, open7 TINYINT, open8 TINYINT, open9 TINYINT, 
                open10 TINYINT, open11 TINYINT, open12 TINYINT, open13 TINYINT, open14 TINYINT, 
                open15 TINYINT,
                open_type0 TINYINT, open_type1 TINYINT, open_type2 TINYINT, open_type3 TINYINT, open_type4 TINYINT, 
                open_type5 TINYINT, open_type6 TINYINT, open_type7 TINYINT, open_type8 TINYINT, open_type9 TINYINT, 
                open_type10 TINYINT, open_type11 TINYINT, open_type12 TINYINT, open_type13 TINYINT, open_type14 TINYINT, 
                open_type15 TINYINT);"""
                
yaku_create = """ CREATE TABLE IF NOT EXISTS yaku (
                code STRING PRIMARY KEY, 
                yaku0 TINYINT, yaku1 TINYINT, yaku2 TINYINT, yaku3 TINYINT, yaku4 TINYINT, 
                yaku5 TINYINT, yaku6 TINYINT, yaku7 TINYINT, yaku8 TINYINT, yaku9 TINYINT, 
                yaku10 TINYINT, yaku11 TINYINT, yaku12 TINYINT, yaku13 TINYINT, yaku14 TINYINT, 
                yaku15 TINYINT, yaku16 TINYINT, yaku17 TINYINT, yaku18 TINYINT, yaku19 TINYINT, 
                yaku20 TINYINT, yaku21 TINYINT, yaku22 TINYINT, yaku23 TINYINT, yaku24 TINYINT, 
                yaku25 TINYINT, yaku26 TINYINT, yaku27 TINYINT, yaku28 TINYINT, yaku29 TINYINT, 
                yaku30 TINYINT, yaku31 TINYINT, yaku32 TINYINT, yaku33 TINYINT, yaku34 TINYINT, 
                yaku35 TINYINT, yaku36 TINYINT, yaku37 TINYINT, yaku38 TINYINT, yaku39 TINYINT, 
                yaku40 TINYINT, yaku41 TINYINT, yaku42 TINYINT, yaku43 TINYINT, yaku44 TINYINT, 
                yaku45 TINYINT, yaku46 TINYINT, yaku47 TINYINT, yaku48 TINYINT, yaku49 TINYINT, 
                yaku50 TINYINT, yaku51 TINYINT, yaku52 TINYINT, yaku53 TINYINT, yaku54 TINYINT);"""


cur.execute(general_create)
cur.execute(dora_create)
cur.execute(hand_create)
cur.execute(yaku_create)
con.close()