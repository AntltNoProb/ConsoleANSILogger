class PropStateManager {
    constructor(initial, state) {
        this.prop = {
            color: 'inherit',
            background: 'inherit',
            'text-decoration': {
                hideDefault: true,
                prop: new Set(),
                toStr: (p)=>(Array.from(p).join(' ')),
            },
        };
        this.state = {

        }
        if (initial && initial.constructor == Object) {
            Object.assign(this.prop, initial);
        }
        if (state && state.constructor == Object) {
            Object.assign(this.state, state);
        }
        
    }
    getCssStr() {
        return Object.keys(this.prop)
            .map((k)=>PropStateManager.propConvert(k, this.prop[k]))
            .join('');
    }
    static getCssStrof(prop) {
        return Object.keys(prop)
            .map((k)=>PropStateManager.propConvert(k, prop[k]))
            .join('');
    }
    static propDeepClone(props) {
        // props should be Object
        let rt = Object.assign({}, props);
        for (const key in rt) {
            if (Object.hasOwn(rt, key)
                && typeof rt[key].onDeepClone == 'function') {
                rt[key] = rt[key].onDeepClone(rt[key]);
            }
        }
        return rt;
    }
    updateAllProp(props) {
        if (props && props.constructor == Object) {
            // this.prop = Object.assign({}, props);
            this.prop = PropStateManager.propDeepClone(props);
            return true;
        }
        return false;
    }
    updateAllState(states) {
        if (states && states.constructor == Object) {
            this.state = Object.assign({}, states);
            return true;
        }
        return false;
    }
    updateStrProp(key, value) {
        const rt = this.prop[key] === undefined;
        this.prop[key] = value;
        return rt;
    }
    deleteProp(key) {
        return delete this.prop[key];
    }
    
    arePropTypeSet(key) {
        return !(this.prop[key] === undefined 
            || this.prop[key].prop === undefined 
            || this.prop[key].prop.constructor != Set);
    }
    addSetProp(key, value) {
        if (!this.arePropTypeSet(key)) {
            return false;
        }
        this.prop[key].prop.add(value);
        return true;
    }
    deleteSetProp(key, value) {
        if (!this.arePropTypeSet(key)) {
            return [false, false];
        }
        let rt = this.prop[key].prop.delete(value);
        return [true, rt];
    }
    static propConvert(propKey, propValue) {
        if(propValue.constructor == Object) {
            let toStr = (propValue.toStr === undefined)?(p)=>(p):propValue.toStr;
            let rt = toStr(propValue.prop);
            if(rt.trim().length == 0) {
                if (propValue.hideDefault) {
                    return '';
                }
                rt = propValue.default;
            }
            return [propKey,':',rt,';'].join('');
        }
        if(typeof propValue == 'string') {
            return [propKey,':',propValue,';'].join('');
        }
        return [propKey,':',String(propValue),';'].join('');
    }
    static propValueConvert(propValue) {
        if(propValue.constructor == Object) {
            let toStr = (propValue.toStr === undefined)?(p)=>(p):propValue.toStr;
            let rt = toStr(propValue.prop);
            if(rt.trim().length == 0) {
                if (propValue.hideDefault) {
                    return '';
                }
                rt = propValue.default;
            }
            return rt;
        }
        if(typeof propValue == 'string') {
            return propValue;
        }
        return String(propValue);
    }
    updateState(key, value) {
        const rt = this.state[key] === undefined;
        this.state[key] = value;
        return rt;
    }
}


class ANSIConverter extends PropStateManager{
    static {
        this.C_IGNORE_STATE = 0;
        this.C_SETTER_STATE = 255;
        this.DEFAULT_PROP = {
            'text-decoration': {
                hideDefault: true,
                prop: new Set(),
                toStr: (p)=>(Array.from(p).join(' ')),
                onDeepClone: (ob)=>{
                    let rt = Object.assign({}, ob);
                    rt.prop = new Set(rt.prop);
                    return rt;
                }
            },
        };
        this.DEFAULT_STATE = {
            'color': this.C_IGNORE_STATE,
            'background': this.C_IGNORE_STATE,
            'bold':false,
        }
    }
    constructor(initial, initState, config) {
        super();
        this.initProp = ANSIConverter.DEFAULT_PROP;
        if (initial && initial.constructor == Object) {
            this.initProp = Object.assign({}, this.initProp, initial);
        }
        this.initState = ANSIConverter.DEFAULT_STATE;
        if (initState && initState.constructor == Object) {
            this.initState = Object.assign({}, this.initState, initState);
        }
        this.ansiStr = '';
        this.logStr = '';
        this.mode = 'LM';
        this.useBrightBold = false;
        this.cssList = [];
        
        this.curToken = '';
        this.curList = [];
        this.curPt = 0;
        this.done = false;

        this.applyConfig(config);
        this.updateAllProp(this.initProp);
        this.updateAllState(this.initState);
        this.initLookup();
        
        this.applyState();
    }
    applyConfig(config) {
        if (config !== undefined) {
            if (config.mode !== undefined) {
                this.setMode(config.mode);
            }
            if (config.useBrightBold !== undefined) {
                this.setBrightBold(config.useBrightBold);
            }
        }
    }
    getBold() {
        if (this.initProp.hasOwnProperty('font-weight')){
            let w = PropStateManager.propValueConvert(this.initProp['font-weight']);
            return w == 'bold' || w == 'bolder';
        }
        return false;
    }
    initLookup() {
        this.SGR_STYLE_LOOKUP = {
            0:()=>{this.updateAllProp(this.initProp);this.updateAllState(this.initState);},
            1:()=>{this.updateStrProp('font-weight', 'bold');this.updateState('bold', true);},
            2:()=>{this.updateStrProp('font-weight', 'lighter');this.updateState('bold', false);},
            3:()=>{this.updateStrProp('font-style', 'italic')},
            4:()=>{this.addSetProp('text-decoration', 'underline')},
            9:()=>{this.addSetProp('text-decoration', 'line-through')},
            22:()=>{this.defaultOrDeleteStrProp('font-weight');this.defaultState('bold')},
            23:()=>{this.defaultOrDeleteStrProp('font-style')},
            24:()=>{this.deleteSetProp('text-decoration', 'underline')},
            29:()=>{this.deleteSetProp('text-decoration', 'line-through')},
            38:()=>{this.handleColor('color')},
            39:()=>{this.defaultOrDeleteStrProp('color');this.defaultState('color');},
            48:()=>{this.handleColor('background')},
            49:()=>{this.defaultOrDeleteStrProp('background');this.defaultState('background');},
            53:()=>{this.addSetProp('text-decoration', 'overline')},
            55:()=>{this.deleteSetProp('text-decoration', 'overline')},
        };
        this.SGR_FRONT_COLOR_LOOKUP_LM = {
            30: '#000000',  90: '#555555', 
            31: '#AA0000',  91: '#FF5555', 
            32: '#00AA00',  92: '#55FF55', 
            33: '#AA5500',  93: '#FFFF55', 
            34: '#0000AA',  94: '#5555FF', 
            35: '#AA00AA',  95: '#FF55FF', 
            36: '#00AAAA',  96: '#55FFFF', 
            37: '#AAAAAA',  97: '#FFFFFF', 
        };
        this.SGR_BACK_COLOR_LOOKUP_LM = {
            40: '#000000', 100: '#555555', 
            41: '#AA0000', 101: '#FF5555', 
            42: '#00AA00', 102: '#55FF55', 
            43: '#AA5500', 103: '#FFFF55', 
            44: '#0000AA', 104: '#5555FF', 
            45: '#AA00AA', 105: '#FF55FF', 
            46: '#00AAAA', 106: '#55FFFF', 
            47: '#AAAAAA', 107: '#FFFFFF', 
        };
        this.SGR_FRONT_COLOR_LOOKUP_DM_DOC = {
            30: '#000000',  90: '#898989', 
            31: '#ed4e4c',  91: '#f28b82', 
            32: '#01c800',  92: '#01c801', 
            33: '#d2c057',  93: '#ddfb55', 
            34: '#2774f0',  94: '#669df6', 
            35: '#a142f4',  95: '#d670d6', 
            36: '#12b5cb',  96: '#84f0ff', 
            37: '#cfd0d0',  97: '#FFFFFF', 
        };
        this.SGR_BACK_COLOR_LOOKUP_DM_DOC = {
            40: '#000000', 100: '#898989', 
            41: '#ed4e4c', 101: '#f28b82', 
            42: '#01c800', 102: '#01c801', 
            43: '#d2c057', 103: '#ddfb55', 
            44: '#2774f0', 104: '#669df6', 
            45: '#a142f4', 105: '#d670d6', 
            46: '#12b5cb', 106: '#84f0ff', 
            47: '#cfd0d0', 107: '#FFFFFF', 
        };
        this.SGR_FRONT_COLOR_LOOKUP_DM = {
            30: '#000000',  90: '#898989', 
            31: '#ed4e4c',  91: '#f28b82', 
            32: '#01c801',  92: '#a1f7b5', 
            33: '#d2c057',  93: '#ddfb55', 
            34: '#2774f0',  94: '#669df6', 
            35: '#a142f4',  95: '#d670d6', 
            36: '#12b5cb',  96: '#84f0ff', 
            37: '#cfd0d0',  97: '#FFFFFF', 
        };
        this.SGR_BACK_COLOR_LOOKUP_DM = {
            40: '#000000', 100: '#898989', 
            41: '#ed4e4c', 101: '#f28b82', 
            42: '#01c801', 102: '#a1f7b5', 
            43: '#d2c057', 103: '#ddfb55', 
            44: '#2774f0', 104: '#669df6', 
            45: '#a142f4', 105: '#d670d6', 
            46: '#12b5cb', 106: '#84f0ff', 
            47: '#cfd0d0', 107: '#FFFFFF', 
        };
        this.SGR_BACK_COLOR_LOOKUP = {
            LM:this.SGR_BACK_COLOR_LOOKUP_LM,
            DM:this.SGR_BACK_COLOR_LOOKUP_DM,
            DC:this.SGR_BACK_COLOR_LOOKUP_DM_DOC,
        };
        this.SGR_FRONT_COLOR_LOOKUP = {
            LM:this.SGR_FRONT_COLOR_LOOKUP_LM,
            DM:this.SGR_FRONT_COLOR_LOOKUP_DM,
            DC:this.SGR_FRONT_COLOR_LOOKUP_DM_DOC,
        };
        this.processLookup = (k)=>{
            if (this.SGR_STYLE_LOOKUP.hasOwnProperty(k)) {
                this.SGR_STYLE_LOOKUP[k]();
            } else if ((k<=47 && k>=40) || (k<=107 && k>=100)) {
                this.updateState('background', k);
                // this.updateStrProp('background', 
                // this.SGR_BACK_COLOR_LOOKUP[mode][k]);
            } else if ((k<=37 && k>=30) || (k<=97 && k>=90)) {
                this.updateState('color', k);
                // this.updateStrProp('color', 
                //     this.SGR_FRONT_COLOR_LOOKUP[mode][k]);
            }
            this.applyState();
        };
        this.processBoldColor = (bold, color) => {
            if (bold && color<=37 && color>=30) {
                return color + 60;
            }
            return color;
        };
        this.applyState = ()=>{
            let mode = this.mode;
            let useBrightBold = this.useBrightBold;
            let {color:kc, background:kb, bold:kw} = this.state;
            let ignColor = (kc == ANSIConverter.C_IGNORE_STATE || kc == ANSIConverter.C_SETTER_STATE);
            let ignBack = (kb == ANSIConverter.C_IGNORE_STATE || kb == ANSIConverter.C_SETTER_STATE);
            let proColor = (kc<=37 && kc>=30) || (kc<=97 && kc>=90);
            let proBack = (kb<=47 && kb>=40) || (kb<=107 && kb>=100);
            if (proColor) {
                if (useBrightBold) {
                    this.updateStrProp('color', 
                        this.SGR_FRONT_COLOR_LOOKUP[mode][this.processBoldColor(kw, kc)]);
                } else {
                    this.updateStrProp('color', 
                        this.SGR_FRONT_COLOR_LOOKUP[mode][kc]);
                }
            }

            if (proBack) {
                this.updateStrProp('background', 
                    this.SGR_BACK_COLOR_LOOKUP[mode][kb]);
            }
        }
    }
    fetchToken(i) {
        if (i <= 0) {
            i = 1;
        }
        let start = this.curPt+1;
        this.curPt += i;
        return this.curList.slice(start, start+i);
    }
    jmpToken(i) {
        if (i === undefined) {
            i = 1;
        }
        this.curPt += i;
    }
    handleColor(k) {
        this.jmpToken(1);
        this.updateRGBColor(k, ...this.fetchToken(3));
    }
    updateRGBColor(k, r,g,b) {
        this.updateState(k, ANSIConverter.C_SETTER_STATE);
        return this.updateStrProp(k, `rgb(${r},${g},${b})`);
    }
    setString(str) {
        this.ansiStr = str;
    }
    setCurList(tokenStr) {
        this.curList = tokenStr.split(';');
    }
    setMode(mode) {
        this.mode = mode;
    }
    setBrightBold(useBrightBold) {
        this.useBrightBold = useBrightBold;
    }
    defaultOrDeleteStrProp(key) {
        if (this.initProp.hasOwnProperty(key)) {
            return this.updateStrProp(key, this.initProp[key]);
        }
        return this.deleteProp(key);
    }
    defaultState(key) {
        if (this.initProp.hasOwnProperty(key)) {
            return this.updateState(key, this.initState[key]);
        }
        return false;
    }
    applyTransition() {
        this.curPt = 0;
        let k = -1;
        while (this.curPt < this.curList.length) {
            k = +this.curList[this.curPt];
            this.processLookup(k);
            this.jmpToken(1);
        }
    }
    handleToken(m, p1, p2) {
        if (p2 == 'm') {
            this.setCurList(p1);
            this.applyTransition();
            this.cssList.push(this.getCssStr());
            return '%c';
        } else if (p2 == 'D') {
            return '';
        } else if (p2 == 'C') {
            // console.warn('cc token:', p1);
            // return m;
            this.cssList.push(this.getInitCssStr());
            this.cssList.push(this.getCssStr());
            let n = Number.parseInt(p1);
            return ['%c','%c'].join(' '.repeat(n));
        }
        console.warn('unsupported token:', m);
        return m;
    }
    generateCssList() {
        this.logStr = this.ansiStr.replace(/\x1b\[((?:\d*;)*\d*)(m|C|D)/g, 
        this.handleToken.bind(this));
        this.done = true;
    }
    getInitCssStr() {
        return PropStateManager.getCssStrof(this.initProp);
    }
    toConsoleLogList(useInitialStyle) {
        if (!this.done) {
            this.generateCssList();
        }
        if (useInitialStyle) {
            return ['%c'+this.logStr, 
                this.getInitCssStr(), 
                ...this.cssList];
        }
        return [this.logStr, ...this.cssList];
    }

}

class ANSILogger extends ANSIConverter {
    constructor(str, initial, initState, config) {
        super(initial, initState, config);
        this.setString(str);
        
        this.generateCssList();
    }
    log(useInit, debug, modifunc) {
        let v = this.toConsoleLogList(useInit);
        if (modifunc && modifunc.constructor == Function) {
            v = modifunc(v);
        }
        if (debug) {
            console.debug(v);
        }
        console.log(...v);
    }

}

var tcss = {
    'white-space':'pre',
    'font-family':'"Cascadia Mono", "Segoe UI Mono", "Liberation Mono", \
Menlo, Monaco, Consolas, monospace',
    'line-height':'1.21',
}
var tcssb = {...tcss, 'background':'black',}
// var tcss={};
var tstr = 'abc\x1b[41;92m123\x1b[3;42mdef'
var temp = new ANSILogger(tstr, tcss);
var tsta = {
    color: 37,
    background: 40,
}
var tconf = {
    mode: 'DM',
    useBrightBold: false,
}
var tconfd = {
    mode: 'DM',
    useBrightBold: true,
}
var tconfl = {
    mode: 'LM',
    useBrightBold: true,
}
// temp.log();
function ll(str, css, useInit, state, config) {
    new ANSILogger(str, css, state, config).log(useInit);
}
function dl(str, css, useInit, state, config, modi) {
    new ANSILogger(str, css, state, config).log(useInit, true, modi);
}
// ll(tstr, tcssb, true, tsta, tconfd);

