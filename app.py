from flask import Flask, render_template, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/', methods=["GET"])
def score():
    return render_template("score.html")

@app.route('/randompuzzle', methods=["GET"])
def randompuzzle():
    con = sqlite3.connect("./log-libraries/agari.db")
    cur = con.cursor()
    
    code = cur.execute("SELECT code FROM general ORDER BY RANDOM() LIMIT 1").fetchall()[0]
    
    com = f"SELECT * FROM general WHERE code=?"
    gen = cur.execute(com, (code)).fetchall()[0]
    
    com = f"SELECT * FROM dora WHERE code=?"
    do = cur.execute(com, (code)).fetchall()[0]

    com = f"SELECT * FROM hand WHERE code=?"
    hand = cur.execute(com, (code)).fetchall()[0]
    
    com = f"SELECT * FROM yaku WHERE code=?"
    ya = cur.execute(com, (code)).fetchall()[0]
    
    con.close()
    
    win_type, round_wind, seat_wind, han, fu, score_limit, machi = gen[1], gen[2], gen[3], gen[4], gen[5], gen[6], gen[7]
    dora, uradora = do[1:6], do[6:11]
    closed_hand, open_hand = hand[1:14], [{"tile": hand[i], "type": hand[i+16]} for i in range(14, 30)]
    yaku = ya[1:]
    
    dora = [v for v in dora if v != -1]
    uradora = [v for v in uradora if v != -1]
    closed_hand = [v for v in closed_hand if v != -1]
    open_hand = [p for p in open_hand if p["tile"] != -1]
    
    data = {"code": code, 
            "win_type": win_type, 
            "round_wind": round_wind, 
            "seat_wind": seat_wind, 
            "han": han, 
            "fu": fu, 
            "score_limit": score_limit, 
            "machi": machi,
            "dora": dora,
            "uradora": uradora,
            "closed_hand": closed_hand,
            "open_hand": open_hand,
            "yaku": yaku}
    return jsonify(data)

app.debug = True
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
