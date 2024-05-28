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

const han_types = [ 
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
const table_types = ["dr", "dts", "ndr", "ndts"];
const score_types = ["1h20f", "1h25f", "1h30f", "1h40f", "1h50f", "1h60f", "1h70f", "1h80f", "1h90f", "1h100f", "1h110f", "2h20f", "2h25f", "2h30f", "2h40f", "2h50f", "2h60f", "2h70f", "2h80f", "2h90f", "2h100f", "2h110f", "3h20f", "3h25f", "3h30f", "3h40f", "3h50f", "3h60f", "3h70f", "3h80f", "3h90f", "3h100f", "3h110f", "4h20f", "4h25f", "4h30f", "4h40f", "4h50f", "4h60f", "4h70f", "4h80f", "4h90f", "4h100f", "4h110f", "mangan", "haneman", "baiman", "sanbaiman", "yakuman"];
const special_score_types = new Set(["mangan", "haneman", "baiman", "sanbaiman", "yakuman"]);

let han_buttons = {};
let score_buttons = {"dr": {}, "dts": {}, "ndr": {}, "ndts": {},};
let table_elements = {"dr": {}, "dts": {}, "ndr": {}, "ndts": {},};

function getHanButtons() {
    for (let i = 0; i < han_types.length; i++) {
        let han_type = han_types[i]["type"];
        let han_button = document.getElementById(han_type);
        han_buttons[han_type] = han_button;
    }
}
function getScoreButtons() {
    for (let i = 0; i < table_types.length; i++) {
        let table_type = table_types[i];
        for (let j = 0; j < score_types.length; j++) {
            let score_type = score_types[j];
            if (document.getElementById(score_type + "-" + table_type) != null) {
                score_buttons[table_type][score_type] = document.getElementById(score_type + "-" + table_type);
            }
        }
    }
}
function getScoreElements() {
    for (let i = 0; i < table_types.length; i++) {
        let table_type = table_types[i];

        table_elements[table_type]['overlay'] = document.getElementById("overlay-" + table_type);
        table_elements[table_type]['chart'] = document.getElementById("chart-" + table_type);
        table_elements[table_type]['button'] = document.getElementById("table-" + table_type);
    }
}
function bindHanButtons() {
    for (let i = 0; i < han_types.length; i++) {    
        let han_type = han_types[i]["type"];   
        han_buttons[han_type].onclick = (ev) => {
            if (isNumberHan(han_types[i]["n"])) {
                removeClass(han_buttons[han_type], "han-blue");
                removeClass(han_buttons[han_type], "han-red");
                addClass(han_buttons[han_type], "han-green");
                revealYaku();
            } else {
                removeClass(han_buttons[han_type], "han-blue");
                removeClass(han_buttons[han_type], "han-green");
                addClass(han_buttons[han_type], "han-red");
            }
        };
    }
}
function bindScoreButtons() {
    for (let i = 0; i < table_types.length; i++) {
        let table_type = table_types[i];
        
        for (let j = 0; j < score_types.length; j++) {
            let score_type = score_types[j];
            if (score_buttons[table_type][score_type] == null) {
                continue;
            }
            
            let k = +special_score_types.has(score_type);
            score_buttons[table_type][score_type].onclick = (ev) => {
                if (isScore(score_type)) {
                    removeClass(score_buttons[table_type][score_type], ["han-blue", "pts-blue"][k]);
                    removeClass(score_buttons[table_type][score_type],["han-red", "pts-red"][k]);
                    addClass(score_buttons[table_type][score_type], ["han-green", "pts-green"][k]);
                    revealYaku();
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
    for (let i = 0; i < table_types.length; i++) {
        let table_type = table_types[i];
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
    for (let i = 0; i < han_types.length; i++) {
        let han_type = han_types[i]["type"];
        let button_element = han_buttons[han_type];

        if (button_element != null) {
            removeClass(button_element, "han-green");
            removeClass(button_element, "han-red");
            addClass(button_element, "han-blue");
        }
    }
}
function resetScoreButtons() {
    for (let i = 0; i < table_types.length; i++) {
        let table_type = table_types[i];
        for (let j = 0; j < score_types.length; j++) {
            let score_type = score_types[j];
            let button_element = score_buttons[table_type][score_type];

            if (button_element != null) {
                removeClass(button_element, "pts-green");
                removeClass(button_element, "pts-red");
                addClass(button_element, "pts-blue");
            }
        }
    }
}

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
const TILE_HTML = [TILE_BACK_HTML, TILE_REGULAR_HTML, TILE_HORIZ_HTML, TILE_HORIZ2_HTML, TILE_BACK_HTML];
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

    return out;
}

let current_hand = {};
let current_yaku = {};
let current_han = 5;
let current_fu = -1;
let current_score = "mangan";

const ALL_YAKU = {};
const VISIBLE_YAKU = ["riichi", "ippatsu", "double", "rinshan", "chankan", "haitei", "houtei", "chiihou", "tenhou"];

const BACK = 0;
const REGULAR = 1;
const HORIZ = 2;
const HORIZ2 = 3;
const HIDE = 4;
function setTileParams(id, type) {
    let el = document.getElementById(id);
    switch(type) {
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
    }
}

const AGARI_HEADER_ID = ["win-by-tsumo", "win-by-ron"]; 
const AGARI_TITLE_ID = ["title-tsumo", "title-ron"]; 
const TSUMO = 0;
const RON = 1;

const WIND_TEXT = ["「東」East", "「南」South", "「西」West", "「北」North"];
const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;

function setVisibleYaku() {
}
function hideYaku() {
}
function revealYaku() {
}

function setWinds(round_wind, seat_wind) {
    document.getElementById("round-wind").innerText = WIND_TEXT[round_wind];
    document.getElementById("seat-wind").innerText = WIND_TEXT[seat_wind];
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
function setHand(closed_tiles, open_tiles) {
    // reset 
    document.getElementById("hand").style.zoom = "1";
    for (let i = 0; i < 13; i++) {
        document.getElementById(`closed${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`closed${i}`, HIDE);
    }
    for (let i = 0; i < 16; i++) {
        document.getElementById(`open${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`open${i}`, HIDE);
    }

    // set
    for (let i = 0; i < Math.min(13, closed_tiles.length); i++) {
        document.getElementById(`closed${i}`).innerHTML = TILE_REGULAR_HTML.replace("!REPLACE", TILE_TO_FILE[closed_tiles[i]]);
        setTileParams(`closed${i}`, REGULAR);
    }
    for (let i = 0; i < Math.min(16, (13 - Math.min(13, closed_tiles.length))/3*4, open_tiles.length); i++) {
        document.getElementById(`open${i}`).innerHTML = TILE_HTML[open_tiles[i].type].replace("!REPLACE", TILE_TO_FILE[open_tiles[i].tile]);
        setTileParams(`open${i}`, open_tiles[i].type);
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

function setDora(num_visible, dora) {
    // reset
    for (let i = 0; i < 5; i++) {
        document.getElementById(`dora${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`dora${i}`, BACK);
    }

    // set
    for (let i = 0; i < Math.min(5, num_visible); i++) {
        document.getElementById(`dora${i}`).innerHTML = TILE_REGULAR_HTML.replace("!REPLACE", TILE_TO_FILE[dora[i]]);
        setTileParams(`dora${i}`, REGULAR);
    }
}
function setUradora(riichi, num_visible, uradora) {
    // reset
    for (let i = 0; i < 5; i++) {
        document.getElementById(`ura${i}`).innerHTML = TILE_BACK_HTML;
        setTileParams(`ura${i}`, BACK);
    }
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

getHanButtons();
getScoreButtons();
getScoreElements();
bindHanButtons();
bindScoreButtons();
bindScoreElements();