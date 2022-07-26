export class TTNI {
    constructor() {
        this.colorWarning = {
            error: "R Y",
            1: "B Y",
            2: "G R",
            watch: "R G",
            4: "M W",
            5: "C Y",
            6: "W R",
        };
        this.colorLevel = {
            1: "B Y",
            2: this.colorWarning.watch,
            3: this.colorWarning.error,
            4: "M W",
            5: "C Y",
            6: "W R",
            7: "R G",
        };
        this.bCaller = false;
        this.bColorIgnore = false;
        this.bLogsIgnore = true;
        this.bTest = false;
        this.bHtml = true;
        this.bConsole = true;
        this.colorPlugin = 'R Y';
        this.colorReset = "";
        this.comma = ";";
        this.dsp2 = {};
        this.fileName = '*FILENAME*';
        this.maxColorsLevel = 7;
        this.nsp = 0;
        this.s = "";
        this.fg = {
            Red: 91,
            Green: 92,
            Yellow: 93,
            Blue: 94,
            Magenta: 95,
            Cyan: 96,
            White: 97,
        };
        this.bg = {
            Red: 101,
            Green: 102,
            Yellow: 103,
            Blue: 104,
            Magenta: 105,
            Cyan: 106,
            White: 107
        };
        this.atr = {
            bold: 1,
            underline: 4,
            blinked: 5,
            inverse: 7,
            hidden: 8
        };
        this.ESC = '\u001b[';
        this.m = 'm';
        this.reset = 0;
        this.close = this.ESC + this.reset + this.m;
        this.fillColors(this.fg);
        this.fillColors(this.bg);
        this.fillAttrs(this.atr);
    }
    fillColors(v) {
        for (let key in v) {
            let s = key[0].toUpperCase();
            v[s] = v[key];
            v[key.toUpperCase()] = v[key];
        }
    }
    fillAttrs(v) {
        for (let key in v) {
            let s0 = key[0].toUpperCase();
            let s1 = key[1].toUpperCase();
            v[s0 + s1] = v[key];
            v[key.toUpperCase()] = v[key];
        }
    }
    ifBright(b, color) {
        if (b)
            color -= 60;
        return color;
    }
    log(...args) {
        console.log(...args);
    }
    ;
    log_raw(...args) {
        console.log(args);
    }
    ;
    msg(fn, arr, colors) {
        let bgNotBright;
        let fgNotBright;
        let sbg;
        let fg;
        let bg;
        let s = "";
        let token_arr;
        let colors_arr;
        let attrs_arr;
        let pair_arr;
        let pairBright_arr;
        if (colors) {
            colors_arr = colors.split(" ");
        }
        if (fn)
            s = this.ESC + this.fg.R + this.m + fn;
        if (arr)
            arr.forEach((item, index, arr) => {
                let k = colors_arr[index];
                if (k) {
                    token_arr = k.split('/');
                    if (token_arr.length > 1)
                        attrs_arr = token_arr[1].split(";");
                    else
                        attrs_arr = [];
                    pair_arr = token_arr[0].split("_");
                    fg = pair_arr[pair_arr.length - 1].toUpperCase();
                    (pair_arr.length > 1) ? bg = pair_arr[0] : bg = undefined;
                    if (bg) {
                        bg = bg.toUpperCase();
                        pairBright_arr = bg.split("-");
                        bg = pairBright_arr[pairBright_arr.length - 1];
                        bgNotBright = (pairBright_arr.length > 1);
                    }
                    pairBright_arr = fg.split("-");
                    fg = pairBright_arr[pairBright_arr.length - 1];
                    fgNotBright = (pairBright_arr.length > 1);
                    (!bg) ? sbg = "" : sbg = ";" + this.ifBright(bgNotBright, this.bg[bg]);
                    s += this.ESC + this.ifBright(fgNotBright, this.fg[fg]) + sbg;
                    attrs_arr.forEach((atr, index, arr) => {
                        s += this.comma + this.atr[atr];
                    });
                    s += this.m;
                    s += item;
                    s += this.close;
                }
            });
        return s;
    }
    removeVowels(input) {
        let a0 = input[0];
        let ai = input.substr(1, input.length - 1);
        ai = ai.replace(/[aeiou]/gi, "");
        ai = a0 + ai;
        return ai;
    }
    getFunctionName(e, ...args) {
        let path;
        let path_arr;
        let file_arr;
        let items;
        let item;
        this.stack = e.stack;
        let regexp = /at (.*?)\(/g;
        let result;
        let fn_arr = [];
        while ((result = regexp.exec(this.stack)) !== null) {
            fn_arr.push(result[1]);
        }
        file_arr = (this.stack.split('at ')[3].split('js'));
        fn_arr = fn_arr.reverse();
        fn_arr.pop();
        file_arr = (this.stack.split('at ')[3].split('.js'));
        file_arr.pop();
        file_arr.push('js');
        path = file_arr.join('.');
        path_arr = path.split('/');
        this.fileName = path_arr[path_arr.length - 1];
        items = {
            fn: fn_arr.pop(),
            caller: fn_arr.pop(),
            path: path,
            file: this.fileName,
        };
        for (let key in items) {
            item = items[key];
            if (item)
                items[key] = items[key].trim();
        }
        return items;
    }
    dsp() {
        let sp;
        if (this.bHtml)
            sp = '&nbsp';
        else
            sp = ' ';
        sp = sp.repeat(2 * this.nsp);
        return sp;
    }
    nu(a, getError, p) {
        const isEmpty = (val) => val == null || !(Object.keys(val) || val).length;
        let level;
        let fn = "";
        let sfn = "";
        let arr_fn;
        if (getError) {
            arr_fn = (getError.fn.trim().split('.'));
            fn = arr_fn[arr_fn.length - 1];
            if (this.bCaller)
                sfn = (getError.caller).trim() + "::";
            else
                sfn = "";
            sfn += arr_fn.join('.');
        }
        let s = "(";
        let ak = "";
        let a6 = "->";
        let a4 = "<-";
        let dx;
        let sError;
        let s_fileName;
        if (this.fileName) {
            let name = this.fileName.split('_');
            if (name.length > 1)
                this.fileName = this.removeVowels(name[0]) + '_' + name[1];
        }
        if (a > 0)
            ak = a6;
        else if (a < 0)
            ak = a4;
        if (this.bShowTimer)
            this.te = new Date();
        if (!p) {
            p = [];
            p[0] = "";
        }
        ;
        for (let i = 0; i < p.length; i++) {
            s += p[i];
            if (i < p.length - 1)
                s += ',';
        }
        s += ')';
        if (a > 0)
            this.nsp++;
        sError = this.dsp() + ak + sfn;
        level = (this.nsp % this.maxColorsLevel) + 1;
        if (this.bTrace && (!this.logs || (isEmpty(this.logs) || this.logs.ALL || this.logs[fn] && !this.logs.ALL)))
            this.log(this.msg("", [sError, s], this.colorLevel[level]));
        if (!this.bLogsIgnore) {
            if (this.logs) {
                if (this.logs[this.fn]) {
                    if (this.logs[this.fn]) {
                        if (this.bTrace)
                            console.log(this.colorPlugin + this.fileName + " ::1:TTNI[" + this.fn + "]:: " + sError + s + this.colorReset);
                    }
                }
                else {
                    if (this.bTrace)
                        console.log(this.colorPlugin + this.fileName + "  TTNI:: " + sError + s + this.colorReset);
                }
            }
        }
        else {
            if (!this.bLogsIgnore) {
                if (!this.fileName) {
                    this.fileName = "";
                }
                if (this.bTrace)
                    console.log(this.colorPlugin, this.fileName, " ::3:TTNI:: this.bLogsIgnore[" + this.bLogsIgnore + "] " + sError + s + this.colorReset);
            }
            else { }
        }
        if (a < 0) {
            this.nsp--;
            if (this.nsp < 0)
                this.nsp = 0;
        }
    }
    ni(args) {
        if (this.bShowTimer)
            this.ts = new Date();
        if (args) {
            if (this)
                if (args[0] == this.fn) {
                }
        }
        this.getError = this.getFunctionName(new Error());
        this.nu(1, this.getError, args);
    }
    ;
    ne(args) {
        this.getError = this.getFunctionName(new Error());
        this.nu(-1, this.getError, args);
        if (this.bShowTimer)
            this.te = new Date();
    }
    ;
    shAt() {
        console.log('items at:', this.getError);
    }
    shStack() {
        console.log('stack=', this.stack);
    }
    shTimer() {
        if (this.bShowTimer) {
            console.log(":" + this.Timer() + " ms");
        }
    }
    Timer() {
        return (this.te.getTime() - this.ts.getTime());
    }
}
//# sourceMappingURL=index.js.map