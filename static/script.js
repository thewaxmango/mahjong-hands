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

const han_types = ["1han", "2han", "3han", "4han", "5han", "6han", "7han", "8han", "9han", "10han", "11han", "12han", "13han"];
const table_types = ["dr", "dts", "ndr", "ndts"];
const score_types = ["1h20f", "1h25f", "1h30f", "1h40f", "1h50f", "1h60f", "1h70f", "1h80f", "1h90f", "1h100f", "1h110f", "2h20f", "2h25f", "2h30f", "2h40f", "2h50f", "2h60f", "2h70f", "2h80f", "2h90f", "2h100f", "2h110f", "3h20f", "3h25f", "3h30f", "3h40f", "3h50f", "3h60f", "3h70f", "3h80f", "3h90f", "3h100f", "3h110f", "4h20f", "4h25f", "4h30f", "4h40f", "4h50f", "4h60f", "4h70f", "4h80f", "4h90f", "4h100f", "4h110f", "mangan", "haneman", "baiman", "sanbaiman", "yakuman"];
const special_score_types = new Set(["mangan", "haneman", "baiman", "sanbaiman", "yakuman"]);

let han_buttons = {};
let score_buttons = {"dr": {}, "dts": {}, "ndr": {}, "ndts": {},};
let table_elements = {"dr": {}, "dts": {}, "ndr": {}, "ndts": {},};

function getHanButtons() {
    for (let i = 0; i < han_types.length; i++) {
        let han_type = han_types[i];
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
        let han_type = han_types[i];
        
        han_buttons[han_type].onclick = (ev) => {
            if (true == false) {
                removeClass(han_buttons[han_type], "han-blue");
                removeClass(han_buttons[han_type], "han-red");
                addClass(han_buttons[han_type], "han-green");
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
            
            if (special_score_types.has(score_type)) {
                score_buttons[table_type][score_type].onclick = (ev) => {
                    if (true == false) {
                        removeClass(score_buttons[table_type][score_type], "pts-blue");
                        removeClass(score_buttons[table_type][score_type], "pts-red");
                        addClass(score_buttons[table_type][score_type], "pts-green");
                    } else {
                        removeClass(score_buttons[table_type][score_type], "pts-blue");
                        removeClass(score_buttons[table_type][score_type], "pts-green");
                        addClass(score_buttons[table_type][score_type], "pts-red");
                    }
                };
            } else {
                score_buttons[table_type][score_type].onclick = (ev) => {
                    if (true == false) {
                        removeClass(score_buttons[table_type][score_type], "han-blue");
                        removeClass(score_buttons[table_type][score_type], "han-red");
                        addClass(score_buttons[table_type][score_type], "han-green");
                    } else {
                        removeClass(score_buttons[table_type][score_type], "han-blue");
                        removeClass(score_buttons[table_type][score_type], "han-green");
                        addClass(score_buttons[table_type][score_type], "han-red");
                    }
                };
            }
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
        let han_type = han_types[i];
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

const all_yaku = {};
const visible_yaku = new Set(["Riichi", "Double riichi", "Ippatsu", "Rinshan kaihou", "Chankan", "Haitei raoyue", "Houtei raoyui", "Chiihou", "Tenhou"]);

function setVisibleYaku(yaku_list) {
}
function setDora(dora_list) {
}
function toggleUradora(dora_list) {
}
function setHand(tile_list) {
}

getHanButtons();
getScoreButtons();
getScoreElements();
bindHanButtons();
bindScoreButtons();
bindScoreElements();