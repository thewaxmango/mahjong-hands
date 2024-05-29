const HAN_TYPES = [
    {"type": "1han", "n": 1},
    {"type": "2han", "n": 2},
    {"type": "3han", "n": 3},
    {"type": "4han", "n": 4},
    {"type": "5han", "n": 5},
    {"type": "6han", "n": 6},
    {"type": "7han", "n": 7},
    {"type": "8han", "n": 8},
    {"type": "9han", "n": 9},
    {"type": "10han", "n": 10},
    {"type": "11han", "n": 11},
    {"type": "12han", "n": 12},
    {"type": "13han", "n": 13},
];
const TABLE_TYPES = ["dr", "dts", "ndr", "ndts"];
const SCORE_TYPES = ["1h20f", "1h25f", "1h30f", "1h40f", "1h50f", "1h60f", "1h70f", "1h80f", "1h90f", "1h100f", "1h110f", "2h20f", "2h25f", "2h30f", "2h40f", "2h50f", "2h60f", "2h70f", "2h80f", "2h90f", "2h100f", "2h110f", "3h20f", "3h25f", "3h30f", "3h40f", "3h50f", "3h60f", "3h70f", "3h80f", "3h90f", "3h100f", "3h110f", "4h20f", "4h25f", "4h30f", "4h40f", "4h50f", "4h60f", "4h70f", "4h80f", "4h90f", "4h100f", "4h110f", "mangan", "haneman", "baiman", "sanbaiman", "yakuman"];
const SPECIAL_SCORE_TYPES = [
    {}, 
    {"jp": "満貫", "en": "mangan"},
    {"jp": "跳満", "en": "haneman"}, 
    {"jp": "倍満", "en": "baiman"}, 
    {"jp": "三倍満", "en": "sanbaiman"}, 
    {"jp": "役満", "en": "yakuman"}
];
const SPECIAL_SCORE_SET = new Set(["mangan", "haneman", "baiman", "sanbaiman", "yakuman"]);

let han_buttons = {};
let score_buttons = {"dr": {}, "dts": {}, "ndr": {}, "ndts": {},};
let table_elements = {"dr": {}, "dts": {}, "ndr": {}, "ndts": {},};

const TILE_BACK_HTML = `<image x="2" y="2" width="60" height="80" href="static/svgs/Back.png"/>
<rect class="back-border" width="60" height="80" x="2" y="2" rx="6"/>`
const TILE_REGULAR_HTML = `<image x="2" y="2" width="60" height="80" href="static/svgs/Front.png"/>
<image x="9.5" y="12" width="45" height="60" href="static/svgs/Regular/!REPLACE.svg"/>
<rect class="tile-border" width="60" height="80" x="2" y="2" rx="6"/>`
const TILE_HORIZ_HTML = `<image transform="rotate(90 40 40)" x="2" y="-2" width="60" height="80" href="static/svgs/Front.png"></image>
<image transform="rotate(90 40 40)" x="9.5" y="8" width="45" height="60" href="static/svgs/Regular/!REPLACE.svg"></image>
<rect class="tile-border" width="80" height="60" x="2" y="2" rx="6" style=""/>`
const TILE_HORIZ2_HTML = `<image transform="rotate(90 10 70)" x="5" y="-2" width="60" height="80" href="static/svgs/Front.png"></image>
<image transform="rotate(90 10 70)" x="11.5" y="8" width="45" height="60" href="static/svgs/Regular/!REPLACE.svg"></image>
<rect class="tile-border" width="80" height="60" x="2" y="64" rx="6"/>
<image transform="rotate(90 40 40)" x="2" y="-2" width="60" height="80" href="static/svgs/Front.png"></image>
<image transform="rotate(90 40 40)" x="9.5" y="8" width="45" height="60" href="static/svgs/Regular/!REPLACE.svg"></image>
<rect class="tile-border" width="80" height="60" x="2" y="2" rx="6"/>`
const TILE_HORIZ3_HTML = `<image transform="rotate(90 10 70)" x="5" y="-2" width="60" height="80" href="static/svgs/Front.png"></image>
<image transform="rotate(90 10 70)" x="11.5" y="8" width="45" height="60" href="static/svgs/Regular/!REPLACEBOTTOM.svg"></image>
<rect class="tile-border" width="80" height="60" x="2" y="64" rx="6"/>
<image transform="rotate(90 40 40)" x="2" y="-2" width="60" height="80" href="static/svgs/Front.png"></image>
<image transform="rotate(90 40 40)" x="9.5" y="8" width="45" height="60" href="static/svgs/Regular/!REPLACETOP.svg"></image>
<rect class="tile-border" width="80" height="60" x="2" y="2" rx="6"/>`
const TILE_HTML = [TILE_BACK_HTML, TILE_REGULAR_HTML, TILE_HORIZ_HTML, TILE_HORIZ2_HTML, TILE_BACK_HTML, TILE_HORIZ3_HTML];
const TILE_LIST = [
    "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m",
    "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p",
    "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s",
    "ew", "sw", "ww", "nw", "wd", "gd", "rd"
]
const TILE_TO_FILE = createTileToFile();
function createTileToFile() {
    out = {};
    for (let i = 1; i < 10; i++) {
        out[`${i}m`] = `Man${i}`;
        out[`${i}p`] = `Pin${i}`;
        out[`${i}s`] = `Sou${i}`;
    }

    out[`ew`] = "Ton";
    out[`sw`] = "Nan";
    out[`ww`] = "Shaa";
    out[`nw`] = "Pei";

    out[`wd`] = "Haku";
    out[`gd`] = "Hatsu";
    out[`rd`] = "Chun";

    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 10; i++) {
            if (j == 0 && i == 5) {
                out[`${i}m${j}`] = `Man${i}-Dora`;
                out[`${i}p${j}`] = `Pin${i}-Dora`;
                out[`${i}s${j}`] = `Sou${i}-Dora`;
            } else {
                out[`${i}m${j}`] = `Man${i}`;
                out[`${i}p${j}`] = `Pin${i}`;
                out[`${i}s${j}`] = `Sou${i}`;
            }
        }

        out[`ew${j}`] = "Ton";
        out[`sw${j}`] = "Nan";
        out[`ww${j}`] = "Shaa";
        out[`nw${j}`] = "Pei";

        out[`wd${j}`] = "Haku";
        out[`gd${j}`] = "Hatsu";
        out[`rd${j}`] = "Chun";
    }

    for (let i = 0; i < 136; i++) {
        out[i] = out[`${TILE_LIST[i>>2]}${i&3}`]
    }

    return out;
}

const ALL_YAKU = [
    {"jp": '門前清自摸和', "en": "TSUMO"},
    {"jp": '立直', "en": "RIICHI"},
    {"jp": '一発', "en": "IIPATSU"},
    {"jp": '槍槓', "en": "CHANKAN"},
    {"jp": '嶺上開花', "en": "RINSHAN"},
    {"jp": '海底撈月', "en": "HAITEI"},  
    {"jp": '河底撈魚', "en": "HOUTEI"},
    {"jp": '平和', "en": "PINFU"},
    {"jp": '断幺九', "en": "TANYAO"},
    {"jp": '一盃口', "en": "IIPEIKOU"},
    {"jp": '自風 東', "en": "SEAT EAST"},
    {"jp": '自風 南', "en": "SEAT SOUTH"},
    {"jp": '自風 西', "en": "SEAT WEST"},
    {"jp": '自風 北', "en": "SEAT NORTH"},
    {"jp": '場風 東', "en": "ROUND EAST"},
    {"jp": '場風 南', "en": "ROUND SOUTH"},
    {"jp": '場風 西', "en": "ROUND WEST"},
    {"jp": '場風 北', "en": "ROUND NORTH"},
    {"jp": '役牌 白', "en": "YAKUHAI WHITE"},
    {"jp": '役牌 發', "en": "YAKUHAI GREEN"},
    {"jp": '役牌 中', "en": "YAKUHAI RED"},
    {"jp": '両立直', "en": "DOUBLE RIICHI"},
    {"jp": '七対子', "en": "CHIITOI"},
    {"jp": '混全帯幺九', "en": "CHANTA"},
    {"jp": '一気通貫', "en": "ITTSUU"},
    {"jp": '三色同順', "en": "SANSHOKU DOUJUN"},
    {"jp": '三色同刻', "en": "SANSHOKU DOUKOU"},
    {"jp": '三槓子', "en": "SANKANTSU"},
    {"jp": '対々和', "en": "TOITOI"},
    {"jp": '三暗刻', "en": "SANANKOU"},
    {"jp": '小三元', "en": "SHOUSANGEN"},
    {"jp": '混老頭', "en": "HONROUTOU"},
    {"jp": '二盃口', "en": "RYANPEIKOU"},
    {"jp": '純全帯幺九', "en": "JUNCHAN"},
    {"jp": '混一色', "en": "HONITSU"},
    {"jp": '清一色', "en": "CHINITSU"},
    {"jp": '人和', "en": "RENHOU"},
    {"jp": '天和', "en": "TENHOU"},
    {"jp": '地和', "en": "CHIIHOU"},
    {"jp": '大三元', "en": "DAISANGEN"},
    {"jp": '四暗刻', "en": "SUUANKOU"},
    {"jp": '四暗刻単騎', "en": "SUUANKOU TANKI"},
    {"jp": '字一色', "en": "TSUUIISOU"},
    {"jp": '緑一色', "en": "RYUUIISOU"},
    {"jp": '清老頭', "en": "CHINROUTOU"},
    {"jp": '九蓮宝燈', "en": "CHUUREN POUTOU"},
    {"jp": '純正九蓮宝燈', "en": "JUNSEI CHUUREN POUTOU"},
    {"jp": '国士無双', "en": "KOKUSHI MUSOU"},
    {"jp": '国士無双１３面待ち', "en": "KOKUSHI MUSOU JUUSAN MENMACHI"},
    {"jp": '大四喜', "en": "DAISUUSHII"},
    {"jp": '小四喜', "en": "SHOUSUUSHII"},
    {"jp": '四槓子', "en": "SUUKANTSU"},
    {"jp": 'ドラ', "en": "DORA"},
    {"jp": '裏ドラ', "en": "URADORA"},
    {"jp": '赤ドラ', "en": "AKADORA"}
];
const VISIBLE_YAKU = [1, 2, 21, 4, 3, 5, 6, 38, 37];
const BACK = 0;
const REGULAR = 1;
const HORIZ = 2;
const HORIZ2 = 3;
const HIDE = 4;
const HORIZ3 = 5; // top of shouminkan is aka

const AGARI_HEADER_ID = ["win-by-tsumo", "win-by-ron"];
const AGARI_TITLE_ID = ["title-tsumo", "title-ron"];
const TSUMO = 0;
const RON = 1;

const WIND_TEXT = ["「東」East", "「南」South", "「西」West", "「北」North"];
const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;

let current_closed = []; //
let current_winds = [0, 0]; //
let current_open = []; //
let current_dora = []; //
let current_ura = []; //
let current_is_riichi = false;
let current_yaku = Array(55).fill(0); //
let current_win_type = TSUMO; //
let current_agari_tile = ""; //
let current_han = 0; //
let current_fu = 0; //
let current_limit = ""; //
let current_score = "0h0f"; //

function setTileParams(id, type) {
    let el = document.getElementById(id);
    switch(parseInt(type)) {
        case BACK:
            el.setAttribute("viewBox", "0 0 64 84");
            el.setAttribute("width", "64");
            el.setAttribute("height", "84");
            break;
        case REGULAR:
            el.setAttribute("viewBox", "0 0 64 84");
            el.setAttribute("width", "64");
            el.setAttribute("height", "84");
            break;
        case HORIZ:
            el.setAttribute("viewBox", "0 0 84 64");
            el.setAttribute("width", "84");
            el.setAttribute("height", "64");
            break;
        case HORIZ2:
            el.setAttribute("viewBox", "0 0 84 126");
            el.setAttribute("width", "84");
            el.setAttribute("height", "126");
            break;
        case HIDE:
            el.setAttribute("viewBox", "0 0 0 0");
            el.setAttribute("width", "0");
            el.setAttribute("height", "0");
            break;
        case HORIZ3:
            el.setAttribute("viewBox", "0 0 84 126");
            el.setAttribute("width", "84");
            el.setAttribute("height", "126");
            break;
    }
}

function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(el, className) {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
}
function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}

function getHanButtons() {
    for (let i = 0; i < HAN_TYPES.length; i++) {
        let han_type = HAN_TYPES[i]["type"];
        let han_button = document.getElementById(han_type);
        han_buttons[han_type] = han_button;
    }
}
function getScoreButtons() {
    for (let i = 0; i < TABLE_TYPES.length; i++) {
        let table_type = TABLE_TYPES[i];
        for (let j = 0; j < SCORE_TYPES.length; j++) {
            let score_type = SCORE_TYPES[j];
            if (document.getElementById(score_type + "-" + table_type) != null) {
                score_buttons[table_type][score_type] = document.getElementById(score_type + "-" + table_type);
            }
        }
    }
}
function getScoreElements() {
    for (let i = 0; i < TABLE_TYPES.length; i++) {
        let table_type = TABLE_TYPES[i];

        table_elements[table_type]['overlay'] = document.getElementById("overlay-" + table_type);
        table_elements[table_type]['chart'] = document.getElementById("chart-" + table_type);
        table_elements[table_type]['button'] = document.getElementById("table-" + table_type);
    }
}
function bindHanButtons() {
    for (let i = 0; i < HAN_TYPES.length; i++) {
        let han_type = HAN_TYPES[i]["type"];
        han_buttons[han_type].onclick = (ev) => {
            if (isNumberHan(HAN_TYPES[i]["n"])) {
                removeClass(han_buttons[han_type], "han-blue");
                removeClass(han_buttons[han_type], "han-red");
                addClass(han_buttons[han_type], "han-green");
                showYaku();
            } else {
                removeClass(han_buttons[han_type], "han-blue");
                removeClass(han_buttons[han_type], "han-green");
                addClass(han_buttons[han_type], "han-red");
            }
        };
    }
}
function bindScoreButtons() {
    for (let i = 0; i < TABLE_TYPES.length; i++) {
        let table_type = TABLE_TYPES[i];

        for (let j = 0; j < SCORE_TYPES.length; j++) {
            let score_type = SCORE_TYPES[j];
            //console.log(score_type);
            if (score_buttons[table_type][score_type] == null) {
                continue;
            }

            let k = +(SPECIAL_SCORE_SET.has(score_type));
            score_buttons[table_type][score_type].onclick = (ev) => {
                if (isScore(score_type)) {
                    removeClass(score_buttons[table_type][score_type], ["han-blue", "pts-blue"][k]);
                    removeClass(score_buttons[table_type][score_type],["han-red", "pts-red"][k]);
                    addClass(score_buttons[table_type][score_type], ["han-green", "pts-green"][k]);
                    showScore();
                } else {
                    removeClass(score_buttons[table_type][score_type], ["han-blue", "pts-blue"][k]);
                    removeClass(score_buttons[table_type][score_type], ["han-green", "pts-green"][k]);
                    addClass(score_buttons[table_type][score_type], ["han-red", "pts-red"][k]);
                }
            };
        }
    }
}
function bindScoreElements() {
    for (let i = 0; i < TABLE_TYPES.length; i++) {
        let table_type = TABLE_TYPES[i];
        if (table_elements[table_type]['overlay'] == null) {
            continue;
        }

        table_elements[table_type]['chart'].addEventListener("click", function(e) {
            e.stopPropagation();
        });
        table_elements[table_type]['overlay'].addEventListener("click", function(e) {
            removeClass(table_elements[table_type]['overlay'], "overlay");
            removeClass(table_elements[table_type]['overlay'], "overlay-show");
            addClass(table_elements[table_type]['overlay'], "overlay-hide");
        });
        table_elements[table_type]['button'].onclick = (ev) => {
            removeClass(table_elements[table_type]['overlay'], "overlay");
            removeClass(table_elements[table_type]['overlay'], "overlay-hide");
            addClass(table_elements[table_type]['overlay'], "overlay-show");
        };
    }
}
function resetHanButtons() {
    for (let i = 0; i < HAN_TYPES.length; i++) {
        let han_type = HAN_TYPES[i]["type"];
        let button_element = han_buttons[han_type];

        if (button_element != null) {
            removeClass(button_element, "han-green");
            removeClass(button_element, "han-red");
            addClass(button_element, "han-blue");
        }
    }
}
function resetScoreButtons() {
    for (let i = 0; i < TABLE_TYPES.length; i++) {
        let table_type = TABLE_TYPES[i];
        for (let j = 0; j < SCORE_TYPES.length; j++) {
            let score_type = SCORE_TYPES[j];
            let button_element = score_buttons[table_type][score_type];
            let k = +(SPECIAL_SCORE_SET.has(score_type));

            if (button_element != null) {
                removeClass(button_element, ["han-green", "pts-green"][k]);
                removeClass(button_element, ["han-red", "pts-red"][k]);
                addClass(button_element, ["han-blue", "pts-blue"][k]);
            }
        }
    }
}
function showButtons(win_type, is_oya) {
    let state = win_type;
    if (!is_oya) {
        state |= 2;
    }

    document.getElementById("dealer-tsumo").hidden = state != 0;
    document.getElementById("dealer-ron").hidden = state != 1;
    document.getElementById("nondealer-tsumo").hidden = state != 2;
    document.getElementById("nondealer-ron").hidden = state != 3;

    document.getElementById("overlay-dts").hidden = state != 0;
    document.getElementById("overlay-dr").hidden = state != 1;
    document.getElementById("overlay-ndts").hidden = state != 2;
    document.getElementById("overlay-ndr").hidden = state != 3;
}

function setVisibleYaku(yaku) {
    let stick = document.getElementById("riichi-stick");
    removeClass(stick, "riichi-gray");

    for (let i = 0; i < VISIBLE_YAKU.length; i++) {
        let el = document.getElementById(`yaku${VISIBLE_YAKU[i]}`);
        removeClass(el, "yaku-gray");
        removeClass(el, "yaku-green");

        if (yaku[VISIBLE_YAKU[i]] != 0) {
            addClass(el, "yaku-green");
            if (VISIBLE_YAKU[i] == 1) {
                addClass(stick, "riichi-stick")
            }
        } else {
            addClass(el, "yaku-gray");
            if (VISIBLE_YAKU[i] == 1) {
                addClass(stick, "riichi-gray")
            }
        }
    }
}
function resetVisibleYaku() {
    setVisibleYaku(Array(55).fill(0));
}

function hideYaku() {
    document.getElementById("yaku-row").hidden = true;
}
function showYaku() {
    document.getElementById("yaku-row").hidden = false;
}
function setYaku(yaku) {
    //console.log(yaku.reduce((sum, a) => sum + a, 0));
    if (yaku.reduce((sum, a) => sum + a, 0) <= 0) {
        resetYaku();
        return;
    }

    let s = "";
    for (let i = 0; i < Math.min(ALL_YAKU.length, yaku.length); i++) {
        let han = yaku[i];
        if (han > 0) {
            s += `「${ALL_YAKU[i].jp}」${ALL_YAKU[i].en.toLowerCase()} (${han}), `; 
        }
    }
    document.getElementById("yaku-text").innerText = s.replace(/,\s*$/, "");
}
function resetYaku() {
    document.getElementById("yaku-text").innerText = "no yaku!";
}
function hideScore() {
    document.getElementById("score-row").hidden = true;
}
function showScore() {
    document.getElementById("score-row").hidden = false;
}
function setScore(han, fu, limit) {
    if (limit > 0) {
        document.getElementById("score-text").innerText = `「${SPECIAL_SCORE_TYPES[limit].jp}」${SPECIAL_SCORE_TYPES[limit].en}`;
        document.getElementById("score-breakdown").hidden = true;
        document.getElementById("score-text").hidden = false;
    } else {
        if (han >= 13) {
            document.getElementById("han-text").innerText = "13+";
        } else {
            document.getElementById("han-text").innerText = han;
        }
        document.getElementById("fu-text").innerText = fu;
        document.getElementById("score-breakdown").hidden = false;
        document.getElementById("score-text").hidden = true;
    }
}
function resetScore() {
    document.getElementById("score-text").innerText = "no score!";
    document.getElementById("han-text").innerText = 0;
    document.getElementById("fu-text").innerText = 0;
    document.getElementById("score-breakdown").hidden = false;
    document.getElementById("score-text").hidden = true;
}

function setWinds(round_wind, seat_wind) {
    document.getElementById("round-wind").innerText = WIND_TEXT[round_wind];
    document.getElementById("seat-wind").innerText = WIND_TEXT[seat_wind];
}
function resetWinds() {
    setWinds(EAST, EAST);
}
function setWinBy(win_type, win_tile) {
    // set header top left
    document.getElementById(AGARI_HEADER_ID[win_type]).hidden = false;
    document.getElementById(AGARI_HEADER_ID[win_type^1]).hidden = true;

    // set hand subtitle
    document.getElementById(AGARI_TITLE_ID[win_type]).hidden = false;
    document.getElementById(AGARI_TITLE_ID[win_type^1]).hidden = true;

    // set tile
    document.getElementById("agari-tile").innerHTML = TILE_REGULAR_HTML.replace("!REPLACE", TILE_TO_FILE[win_tile]);
    setTileParams("agari-tile", REGULAR);
}
function resetWinBy() {
    // set header top left
    document.getElementById(AGARI_HEADER_ID[TSUMO]).hidden = false;
    document.getElementById(AGARI_HEADER_ID[RON]).hidden = true;

    // set hand subtitle
    document.getElementById(AGARI_TITLE_ID[TSUMO]).hidden = false;
    document.getElementById(AGARI_TITLE_ID[RON]).hidden = true;

    // set tile
    document.getElementById("agari-tile").innerHTML = TILE_BACK_HTML;
    setTileParams("agari-tile", BACK);
}

function resetHand() {
    document.getElementById("hand").style.zoom = "1";
    for (let i = 0; i < 13; i++) {
        document.getElementById(`closed${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`closed${i}`, HIDE);
    }
    for (let i = 0; i < 16; i++) {
        document.getElementById(`open${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`open${i}`, HIDE);
    }
}
function setHand(closed_tiles, open_tiles) {
    resetHand();
    // set
    for (let i = 0; i < Math.min(13, closed_tiles.length); i++) {
        document.getElementById(`closed${i}`).innerHTML = TILE_REGULAR_HTML.replace("!REPLACE", TILE_TO_FILE[closed_tiles[i]]);
        setTileParams(`closed${i}`, REGULAR);
    }
    for (let i = 0; i < Math.min(16, (13 - Math.min(13, closed_tiles.length))/3*4, open_tiles.length); i++) {
        setTileParams(`open${i}`, open_tiles[i].type);
        if (open_tiles[i].type == HORIZ3) {
            document.getElementById(`open${i}`).innerHTML = TILE_HTML[open_tiles[i].type].replace("!REPLACETOP", TILE_TO_FILE[open_tiles[i].tile.substring(0, 2) + "0"]);
            document.getElementById(`open${i}`).innerHTML = TILE_HTML[open_tiles[i].type].replace("!REPLACEBOTTOM", TILE_TO_FILE[open_tiles[i].tile]);
        } else {
            document.getElementById(`open${i}`).innerHTML = TILE_HTML[open_tiles[i].type].replaceAll("!REPLACE", TILE_TO_FILE[open_tiles[i].tile]);
        }       
    }

    let scale = 1008.0/(document.getElementById("hand-row-main").getBoundingClientRect().width - 39);
    if (scale < 1) {
        document.getElementById("hand").style.zoom = `${scale}`;
    }
}
function isNumberHan(n) {
    return (n == current_han);
}
function isScore(score_type) {
    return (score_type == current_score);
}

function resetDora() {
    // reset
    for (let i = 0; i < 5; i++) {
        document.getElementById(`dora${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`dora${i}`, BACK);
    }
}
function setDora(num_visible, dora) {
    resetDora();
    // set
    for (let i = 0; i < Math.min(5, num_visible); i++) {
        document.getElementById(`dora${i}`).innerHTML = TILE_REGULAR_HTML.replace("!REPLACE", TILE_TO_FILE[dora[i]]);
        setTileParams(`dora${i}`, REGULAR);
    }
}
function resetUradora() {
    resetUradora();
    // reset
    for (let i = 0; i < 5; i++) {
        document.getElementById(`ura${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`ura${i}`, BACK);
    }
}
function setUradora(riichi, num_visible, uradora) {
    // no ura if no riichi
    if (!riichi) {
        return
    }

    // set
    for (let i = 0; i < Math.min(5, num_visible); i++) {
        document.getElementById(`ura${i}`).innerHTML = TILE_REGULAR_HTML.replace("!REPLACE", TILE_TO_FILE[uradora[i]]);
        setTileParams(`ura${i}`, REGULAR);
    }
}

function resetAll() {
    hideScore();
    hideYaku();
    resetHanButtons();
    resetScoreButtons();
    resetVisibleYaku();
    resetWinds();
    resetWinBy();
    resetYaku();
    resetScore();
    resetHand();
}
async function fetchPuzData() {
    return new Promise((resolve, reject) => {
        const url = '/randompuzzle'
        fetch(url)
        .then(response => response.json())  
        .then(json => {
            resolve(json);
        })
    });
}
async function newPuzzle() {
    //resetAll();
    hideScore();
    hideYaku();
    resetHanButtons();
    resetScoreButtons();
    
    let data = await fetchPuzData();
    //console.log(data);

    current_closed = data["closed_hand"];
    current_open = data["open_hand"];
    current_dora = data["dora"];
    current_ura = data["uradora"];
    current_winds = [data["round_wind"], data["seat_wind"]];
    current_is_oya = data["seat_wind"] == 0;
    current_is_riichi = data["yaku"][1] > 0;
    current_yaku = data["yaku"];
    current_win_type = data["win_type"];
    current_agari_tile = data["machi"];
    current_han = data["han"];
    current_fu = data["fu"];
    current_limit = data["score_limit"];

    current_score = "0h0f"; //
    if (current_limit > 0) {
        current_score = SPECIAL_SCORE_TYPES[current_limit].en;
    } else {
        current_score = `${current_han}h${current_fu}f`;
    }

    setWinds(current_winds[0], current_winds[1]);
    setWinBy(current_win_type, current_agari_tile);
    setHand(current_closed, current_open);
    setVisibleYaku(current_yaku);
    setYaku(current_yaku);
    setDora(current_dora.length, current_dora);
    setUradora(current_is_riichi, current_dora.length, current_ura);
    setScore(current_han, current_fu, current_limit);
    showButtons(current_win_type, current_winds[1]);
}

getHanButtons();
getScoreButtons();
getScoreElements();
bindHanButtons();
bindScoreButtons();
bindScoreElements();

newPuzzle();