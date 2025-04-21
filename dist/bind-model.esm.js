/*! Logic Core v1.0.30 Copyright (c) 2025 logicfeel and contributors */
/**** load-json.cjs loadJSON() ESM module ****/
//==============================================================
const isNode$2 = typeof globalThis.isDOM === 'boolean' ? !globalThis.isDOM :  typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;

async function loadJSON(filePath) {
    try {
        if (isNode$2) {    
            const { readFile } = await import('fs/promises');
            const absolutePath = await getLocalePath(filePath);
            const jsonText = await readFile(absolutePath, 'utf8');
            return JSON.parse(jsonText);
        } else {
            const absolutePath = await getLocalePath(filePath);
            const response = await fetch(absolutePath);
            return await response.json();
        }
    } catch (error) {
        return undefined;
    }
}

async function getLocalePath(filename) {
    if (isNode$2) {
        const { fileURLToPath } = await import('url');
        const path = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return path.resolve(__dirname, filename);
    }
    if (typeof window !== 'undefined') {
        let baseURL = '';

        if (typeof document !== 'undefined' && document.currentScript) {
            baseURL = document.currentScript.src;
        } else if (typeof import.meta !== 'undefined' && import.meta.url) {
            baseURL = import.meta.url;
        } else {
            throw new Error('Unable to determine base URL in browser.');
        }
        return new URL(filename, baseURL).href;
    }
    throw new Error('Unsupported environment');
}

/**** message.js | Message ****/
//==============================================================

// inner function
function _isObject$2(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function _isString$1(obj) {    // 공백아닌 문자 여부
    if (typeof obj === 'string' && obj.length > 0) return true;
    return false;
}
function _deepMerge(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var targetValue = target[key];
            var sourceValue = source[key];
            if (_isObject$2(sourceValue)) {
                if (!_isObject$2(targetValue)) {
                    target[key] = {};
                }
                target[key] = _deepMerge(target[key], sourceValue);
            } else {
                target[key] = sourceValue;
            }
        }
    }
    return target;
}

function _getLocale() {
    let locale = '';

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        // 브라우저 환경
        const lang = navigator.languages?.[0] || navigator.language || Intl.DateTimeFormat().resolvedOptions().locale;
        locale = lang.split(/[_-]/)[0]; // "ko-KR" -> "ko"
    } else if (typeof process !== 'undefined') {
        // Node.js 환경
        const rawLocale = process.env.LANG || process.env.LC_ALL || process.env.LANGUAGE;
        if (rawLocale) {
            locale = rawLocale.split(/[:_.]/)[0].replace('_', '-'); // "ko_KR.UTF-8" -> "ko"
        }
    }
    return locale || 'en';
}

function _replacePlaceholders (p_template, p_values) {
    let namedValues = {}, indexedValues = [];
    
    if (Array.isArray(p_values)) indexedValues = p_values;
    else if (typeof p_values === 'object') namedValues = p_values;

    // `${변수명}` 치환
    p_template = p_template.replace(/\$\{(\w+)\}/g, function(match, key) {
        return namedValues.hasOwnProperty(key) ? namedValues[key] : match;
    });
    // `$1, $2` 치환
    p_template = p_template.replace(/\$(\d+)/g, function(match, index) {
        var i = parseInt(index, 10) - 1;
        return indexedValues[i] !== undefined ? indexedValues[i] : match;
    });

    return p_template;
}
/**
 * 'Message' is a class that manages messages and codes.  
 */
class Message {

    /**
     * Namespace path. ('Common')
     */
    static _NS = 'Common';
    
    /**
     * Internal repository that stores message code.  
     */
    static $storage = {
        lang: { default: {} },
        path: [],
        _history: {}
    };
    
    /**
     * Sets whether automatic language detection is enabled. Default is true.  
     */
    // static autoDetect = true;
    
    /**
     * Set the default language. Default is 'default'.  
     */
    static defaultLang = 'default';
    
    /**
     * Sets the current language. Default is 'default'.  
     */
    static currentLang = this.defaultLang;
    
    /**
     * Returns a message that corresponds to the message code.  
     * 
     * @param {string} p_code Message code
     * @returns {string} Message String
     */
    static getMessageByCode (p_code) {
        var value = this.$storage.lang[this.currentLang]?.[p_code] || this.$storage.lang[this.defaultLang]?.[p_code];
        return typeof value === 'number' ? String(value) : value;
    };

    /**
     * Add the message code to the storage.  
     * 
     * @param {object} p_msg Message Object
     * @param {string} p_path Message file path
     */
    static importMessage (p_msg, p_path) {
        if (_isObject$2(p_msg)) {
            _deepMerge(this.$storage.lang.default, p_msg);
            if (_isString$1(p_path)) {
                // if (isNode && isESM) {  // REVIEW: esm module & node
                //     const { fileURLToPath } = await import('url');
                //     const { dirname, resolve } = await import('path');

                //     const __filename = fileURLToPath(import.meta.url);
                //     const __dirname = dirname(__filename);
                //     p_path = resolve(__dirname, p_path);
                // }
                if (this.$storage.path.indexOf(p_path) < 0) this.$storage.path.push(p_path);
            }
        }
        // locale = _getLocale();
        // if (locale === 'en') locale = 'default';
        // else await Message.changeLanguage(locale);
    };

    /**
     * Change the language.  
     * 
     * @param {string} p_lang language code
     */
    static async changeLanguage (p_lang) {
        var msg;
        this.currentLang = p_lang;
        if (p_lang === 'default') return;
        for (var i = 0; i < this.$storage.path.length; i++) {
            const localPath = this.$storage.path[i];
            // var msg = await loadJSON(`${localPath}/${p_lang}.json`);
            // initialize the language
            this.$storage.lang[p_lang] = this.$storage.lang[p_lang] || {};
            this.$storage._history[p_lang] = this.$storage._history[p_lang] || [];
            
            const _history = this.$storage._history[p_lang];
            if (_history.indexOf(localPath) >= 0) continue;
            msg = await loadJSON(`${localPath}/${p_lang}.json`);

            if (typeof msg === 'object') {
                _deepMerge(this.$storage.lang[p_lang], msg);
                _history.push(localPath);
            } else console.warn(`Path '${localPath}/${p_lang}.json' does not have a file.`);
        }
    }

    /**
     * Returns a string corresponding to the given message code.  
     * 
     * @param {string} p_code Message code
     * @param {object | string[]} p_values Value to replace in message
     * @returns {string} 메시지
     */
    static get (p_code, p_values) {
        var msg = Message.getMessageByCode(p_code);
        var result;

        if (typeof msg === 'undefined') {
            return `There is no message for code. '${p_code}'`;
        }
        result = _replacePlaceholders(msg, p_values);
        return $intro(p_code) + result;

        // inner funciton
        function $intro(code) {
            var intro = '';
            var firstChar = code.substring(0, 1);
            
            if (firstChar === 'E') intro = 'Error';
            else if (firstChar === 'W') intro = 'Warn';
            return intro + ' ['+ code +'] ';
        }
    };

    /**
     * Initialize the language.  
     */
    static resetLang () {
        this.currentLang = this.defaultLang;
    }

    /**
     * Set the current language by automatically detecting the language.  
     */
    static async autoDetect () {
        let locale = _getLocale();  // internal function

        if (locale === 'en') locale = 'default';
        await Message.changeLanguage(locale);
    }
}

/* eslint-disable */
var defaultCode$2 = {
    "ES010": "Other errors",
    "ES011": "Failed to get module ['$1']",
    "ES012": "Failed to get function ['$1'()",
    "ES013": "[$1] failed to process [$2]",
    "ES021": "[$1] can only be of type [$2]",
    "ES022": "[$1] is an unprocessable typo", 
    "ES023": "[$1] is not type [$2]",
    "ES031": "[$1] is not an object",
    "ES032": "[$1] is not an instance of [$2]",
    "ES033": "The object in [$1] is different from [$2]",
    "ES041": "[$1] is duplicated with [$2]",
    "ES042": "[$2] exists in [$1] and cannot measure [$3]",
    "ES043": "[$1] cannot be added because [$1] exists in [$1] ",
    "ES044": "[$1] is a reserved word ",
    "ES051": "Required value [$1] not found",
    "ES052": "[$1] requires [$2]",
    "ES053": "[$2] does not exist in [$1]",
    "ES054": "[$1] cannot be blanked",
    "ES061": "Exceeded the range [$2] of [$1]",
    "ES062": "[$1] cannot be less than [$2]",
    "ES063": "[$1] and [$2] have different lengths",
    "ES064": "and(&) condition check failed. $1",
    "ES065": "Or(|) condition check failed. $1",
    "ES066": "[$1] ranges from [$2] to [$3]",
    "EL01100": "----- util-type.js match -----",
    "EL01101": "Type match: You must specify a detailed type of $1.$1: $2",
    "EL01102": "Type match : target is not type '$1'. tarType : $2",
    "EL01103": "Type match: cannot handle type",
    "EL01110": "----- match array -----",
    "EL01111": "Array match: target is not array type. tarType: $1",
    "EL01112": "Array match : array(_ANY_) type must have at least one element of target array. target.length = $1",
    "EL01113": "Array match: target array is less than array(_SEQ_) type length. extType.length = $1, target.length = $2",
    "EL01114": "Array match: array(_SEQ_) [$1]th literal type is different from target value. extType[$1] = $2, target[$1] = $3",
    "EL01115": "Array match: array(_SEQ_) [$1]th type check failed. extType[$1] = $2",
    "EL01116": "Array match : array(_REQ_) type must have at least one element of target array. target.length = $1",
    "EL01117": "Array match : array($1) is the type of array that cannot be handled",
    "EL01118": "Array match: array element check failed. extType: $1, tarType: $2",
    "EL01120": "----- match choice -----",
    "EL01121": "Choice match: 'undefined' is not available for choice(_ANY_) type",
    "EL01122": "Choice match: 'undefined' only for choice(_NON_) type",
    "EL01123": "Choice match: Error instance only for choice(_ERR_) type",
    "EL01124": "Choice match: choice(_EUM_) type details can only be literal. extType[$1]: $2",
    "EL01125": "Choice match: the first subtype of choice(_DEF_) type is literal only. extType[0]: $1",
    "EL01126": "Choice match : choice($1) is a type of choice that cannot be handled",
    "EL01127": "Choice match: choice detailed type check failed. extType: $1, tarType: $2",
    "EL01130": "----- match class -----",
    "EL01131": "Class match: Inspection failed after creating class type as union type (opt = 1)",
    "EL01132": "Class match: target is not an instance of [$1]",
    "EL01133": "Class match: target is not class, object, or union type. tarType: $1",
    "EL01140": "----- match union -----",
    "EL01141": "Union match: target is not union type. tarType: $1",
    "EL01142": "Union match: target['$1'] key does not exist. extType['$1'] = $2",
    "EL01143": "Union match: '$1' type check failed",
    "EL01150": "----- match function -----",
    "EL01151": "Function match: target is not function type. tarType: $1",
    "EL01152": "Function match: declared extType.name = '$1' and target name do not match: function.name = '$2'",
    "EL01153": "Function match : declared extType.func, target.func is not function type",
    "EL01154": "Function match: extType.func and target.func are different (proto check)",
    "EL01155": "Function match: You must set the params or return object of the target. extType.param = $1, extType.return = $2",
    "EL01156": "Function match: params acceptance test denied. <array(_SEQ_) conversion>",
    "EL01157": "Function Match: Return Acceptance Test Denied",
    "EL01200": "----- allow -----",
    "EL01201": "Type allowed: You must specify a subtype of $1.$1: $2",
    "EL01202": "Type allowed: different from type 1 literal value. extType = $2, tarType = $3",
    "EL01203": "Type allowed: not type $1. tarType = $2",
    "EL01204": "Type allowed: type not processable",
    "EL01210": "----- allow array -----",
    "EL01211": "Array permit: Not array type. tarType: $1",
    "EL01212": "Type allowed: array(_ALL_, _OPT_) type is not allowed for array(_ANY_) type. tarType: $1",
    "EL01213": "Allow array: Only array(_SEQ_) type is allowed for array(_SEQ_) type. tarType: $1",
    "EL01214": "Array permit: tarType must be equal to or greater than the length of array(_SEQ_) type of extType.length = $1, target.length = $2",
    "EL01215": "Array Allowance: array(_SEQ_) [$1]th type check failed",
    "EL01216": "Allow array : Do not allow array(_ALL_, _ANY_, _OPT_) type for array(_REQ_). tarType: $2",
    "EL01217": "Allow array: Do not allow array(_ALL_, _ANY_) type for array(_OPT_). tarType: $2",
    "EL01218": "Allow array : array($1) is the type of array that cannot be handled",
    "EL01219": "Array element check failed. extType: $1, tarType: $2",
    "EL01220": "----- allow choice -----",
    "EL01221": "Choice allowed: do not allow choice(_ERR_) type for choice(_ALL_). tarType: $1",
    "EL01222": "Choice allowed: 'undefined' type is not allowed for choice(_ANY_) type",
    "EL01223": "Choice allowed: choice(_NON_, _ERR_) type is not allowed for choice(_ANY_) type. tarType: $1",
    "EL01224": "Choice allowed: only choice(_NON_) type and choice(_NON_) type. tarType: $1",
    "EL01225": "Choice allowed: choice(_ERR_) type and choice(_ERR_) type only. tarType: $1",
    "EL01226": "Choice allowed: do not allow choice(_ALL_, _ANY_, _OPT_, _NON_, _ERR_) type for choice(_REQ_). tarType: $1",
    "EL01227": "Choice allowed: do not allow choice(_ALL_, _ANY_, _NON_, _ERR_) type for choice(_OPT_). tarType: $1",
    "EL01228": "Choice allowed: choice(_EUM_) type and choice(_EUM_) type only",
    "EL01229": "Choice allowed: choice(_EUM_) subtype can only be literal. extType[$1]: $2",
    "EL0122A": "Choice allowed: the subtype of tarType choice(_EUM_) can only be literal. tarType[$1]: $2",
    "EL0122B": "Choice allowed: choice(_DEF_) type and choice(_DEF_) type only",
    "EL0122C": "Choice allowed: the first subtype of extType choice(_DEF_) is literal only. extType[0]: $1",
    "EL0122D": "Choice allowed: the first subtype of tarType choice(_DEF_) is literal only. tarType[0]: $1",
    "EL0122E": "Choice allowed: choice($1) is a type of choice that cannot be handled",
    "EL0122F": "Choice allowed: tarType[$1] = $3, no extType allowed. extType = $2",
    "EL01230": "----- allow class -----",
    "EL01231": "Class allowed: ExtType, tarType class failed after creating a union type. (opt = 1)",
    "EL01232": "Class allowed: class to class denied. (opt = $1)",
    "EL01233": "Class allowed: Inspection failed after creating tarType class type as union type (opt = 1)",
    "EL01234": "Class allowed: class to union denied. (opt = $1)",
    "EL01235": "Class allowed: tarType is not class, union type. tarType: $1",
    "EL01240": "----- allow union -----",
    "EL01241": "Union allowed: tarType is not a union type. tarType: $1",
    "EL01242": "Union allowed: tarType['$1'] key does not exist. extType['$1'] = $2",
    "EL01243": "Union allowed: Type '$1' check failed",
    "EL01250": "----- allow function -----",
    "EL01251": "Allow function : tarType is not function type. tarType : $1",
    "EL01252": "Function allowed: declared extType.name = '$1' and target name do not match: function.name = '$2'",
    "EL01253": "Function allowed: declared extType.func, target.func is not of function type",
    "EL01254": "Function allowed: extType.func and target.func are different (proto check)",
    "EL01255": "Function permit: params or return object of tarType must be set. extType.param = $1, extType.return = $2",
    "EL01256": "Function permit: params permit test denied. <array(_SEQ_) conversion>",
    "EL01257": "Function Permitted: Return Permitted Test Denied",
    "EL01300": "----- util-type.js -----",
    "EL01301": "Parcing check: function is not a rule: '$1'",
    "EL01302": "Parcing inspection: function has no argument, body content. '$1'",
    "EL01303": "Parcing inspection: function parsing failed $1",
    "EL01304": "Type check: [$1] is a special type to handle",
    "EL01305": "Type check: array($1) type is a specular type that cannot be handled",
    "EL01306": "Type check: choice($1) type is a special type that cannot be handled",
    "EL01307": "Type check: array($1) type is a type that cannot be handled",
    "EL01308": "Type check: choice($1) type is a type that cannot be handled",
    "EL01309": "REVIEW:",
    "EL0130A": "Type allowed: allowType (extType, tarType) scan failed",
    "EL0130B": "Type match: matchtype (extType, target) check failed",
    "EL0130C": "ctor is not function type. type aperture = $1",
    "EL01400": "----- util.js -----",
    "EL01401": "implements(ctor, obj, args..); ctor is not of type <function> == '$1'",
    "EL01402": "implements(ctor, obj, args..); obj is not of type <object> type of obj == '$1'",
    "EL01403": "implements(ctor, obj, args..); args[$1] is not type <function>. type of args[$1] == '$2'",
    "EL01404": "[$1] must implement type [$2]. $1._KIND = '$3'",
    "EL01405": "isImplementOf(target); target is of type <function, string> only. type of target = '$1'",
    "EL01500": "----- etc -----",
    "EL01501": "$1.$events is obejct type. type of $events $2",
    "EL01502": "$1.isLog is boolean type. type isLog $2",
    "EL01503": "on(event, listener); event is not of type <string> type of event == '$1'",
    "EL01504": "on(event, listener); listener is not of type <function> type of listener == '$1'",
    "EL01505": "once(event, listener); event is not of string type. typeof event == '$1'",
    "EL01506": "once(event, listener); listener 는 <function> 타입이 아닙니다. typeof listener == '$1'",
    "EL01507": "off(event, listener); event is not of type <string> type of event == '$1'",
    "EL01508": "off(event, listener); listener 는 <function> 타입이 아닙니다. typeof listener == '$1'",
    "EL01509": "emit(event); event is not of type <string> type of event == '$1'",
    "EL01510": "",
    "EL02100": "----- Interface.* -----",
    "EL02110": "----- i-object.js -----",
    "EL02111": "getType(): array<function> is an abstract method. [$1] must be implemented",
    "EL02112": "instanceOf(any): boolean is an abstract method. [$1] must be implemented",
    "EL02113": "equal(any): boolena is an abstract method. [$1] must be implemented",
    "EL02120": "----- i-marshal.js -----",
    "EL02121": "getObject(opt?, origin?) : object is abstract method. [$1] must be implemented",
    "EL02122": "setObject(mObj) is an abstract method. [$1] must be implemented",
    "EL02130": "----- i-element.js -----",
    "EL02131": "clone(): object is an abstract method. [$1] must be implemented",
    "EL02140": "----- i-list.js -----",
    "EL02150": "----- i-control-list.js -----",
    "EL02151": "add(key) is an abstract method. [$1] must be implemented",
    "EL02152": "del(key) is an abstract method. [$1] must be implemented",
    "EL02153": "has(key): boolean is an abstract method. [$1] must be implemented",
    "EL02154": "find(any): any is an abstract method. [$1] must be implemented",
    "EL02160": "----- i-collection.js -----",
    "EL02161": "add(any): boolean is an abstract method. [$1] must be implemented",
    "EL02162": "remove(elem): boolean is an abstract method. [$1] must be implemented",
    "EL02163": "cantains(any): boolean is an abstract method. [$1] must be implemented",
    "EL02164": "indexOf(any): number is an abstract method. [$1] must be implemented",
    "EL02170": "----- i-collection-array.js -----",
    "EL02171": "insertAt(pos, val, ..): boolean is an abstract method. [$1] must be implemented",
    "EL02180": "----- i-collection-property.js -----",
    "EL02181": "indexToKey(idx): string is an abstract method. [$1] must be implemented",
    "EL02190": "----- i-serialize.js -----",
    "EL02191": "output(opt, ...): string is an abstract method. [$1] must be implemented",
    "EL02192": "load(any, ...) is an abstract method. [$1] must be implemented",
    "EL02300": "----- Meta.Entity.* -----",
    "EL03100": "----- Meta.* -----",
    "EL03110": "----- meta-object.js -----",
    "EL03111": "You cannot create abstract, interface, enum type. $1['_KIND'] = '$2'",
    "EL03112": "setObject(oGuid, origin); oGuid 는 'object' 타입입니다. typeof oGuid = '$1'",
    "EL03113": "setObject(oGuid, origin); different namespaces. this._type = $1, oGuid._type = $2",
    "EL03114": "setObject(oGuid, origin); origin 은 Guid 객체가 아닙니다. origin._type = '$1', origin._guid = '$2'",
    "EL03120": "----- meta-element.js -----",
    "EL03121": "$name;val is of type 'string'. type of valve = '$1'",
    "EL03122": "$name; val.length must be greater than 0",
    "EL03200": "----- meta-registry.js -----",
    "EL03211": "register(meta); the meta to register is not a Guide object. meta._type = '$1', meta._guid = '$2'",
    "EL03212": "register(meta); meta._guid to register is already registered. meta._guid = '$1'",
    "EL03213": "release(meta); the meta to release is string(guid) | object(guid) type only. type of meta = '$1'",
    "EL03220": "----- create -----",
    "EL03221": "createMetaObject(oGuid, origin); oGuid can only be of type 'object'. typeof oGuid = '$1'",
    "EL03222": "createMetaObject(oGuid, origin); oGuid._type 은 'string' 타입만 가능합니다.(length > 0) typeof oGuid._type = '$1'",
    "EL03223": "createMetaObject(oGuid, origin); origin can only be of type 'object'. typeof origin = '$1'",
    "EL03224": "createMetaObject(oGuid, origin);[$1] Namespace is not of type 'function'. type of coClass = '$2'",
    "EL03225": "createReferObject(meta); meta can only be of type 'object'. type of meta = '$1'",
    "EL03226": "createReferObject(meta); meta._guid 은 'string' 타입만 가능합니다.(length > 0) typeof meta._guid = '$1'",
    "EL03227": "createNsReferObject(fun); fun is not type 'function'. type of fun = '$1'",
    "EL03230": "----- ns Class -----",
    "EL03231": "register Class(fun, ns, key); fun is not of type 'function'. type of fun = '$1'",
    "EL03232": "registerClass(fun, ns, key); ns is not of type 'string'. typeofns = '$1'",
    "EL03233": "register Class(fun, ns, key); key is not of type 'string'. type of key = '$1'",
    "EL03234": "releaseClass(fullName); fullName 은 'string' 타입만 가능합니다.(length > 0) typeof fullName = '$1'",
    "EL03235": "findClass(fun); fun is not type 'function'. type of fun = '$1'",
    "EL03236": "getClass(fullName); fullName can only be of type 'string' (length > 0) type of fullName = '$1'",
    "EL03240": "----- set, transform, load -----",
    "EL03241": "setMetaObject(oGuid, meta); oGuid can only be of type 'object'. typeof oGuid = '$1'",
    "EL0324": "setMetaObject(oGuid, meta); meta can only be of type 'object'. type of meta = '$1'",
    "EL03243": "setMetaObject(meta); meta._guid can only be of type 'string' (length > 0) type of meta._guid = '$1'",
    "EL03244": "transformRefer(oGuid); oGuid can only be of type 'object'. type oGuid = '$1'",
    "EL03245": "transformRefer(oGuid); $1['$2']['$ns'] is not of type 'function'",
    "EL03246": "loadMetaObject(str, path?); str is only of type 'string'. typeof str = '$1'",
    "EL03247": "loadMetaObject(str, path?); The object parsed str is not a Guide object. obj._type = '$1', obj._guid = '$2'",
    "EL03250": "----- has, valid, find -----",
    "EL03251": "validObject(oGuid); oGuid is only of type 'object'. typeof oGuid = '$1'",
    "EL03252": "hasGuidObject(oGuid, origin); guid can only be of type 'string' (length > 0) type of guid = '$1'",
    "EL03253": "hasGuidObject(oGuid, origin); origin[$1]는 'object' 타입이 아닙니다. typeof origin[$1] = '$2'",
    "EL03254": "hasRefer(oGuid); oGuid can only be of type 'object'. typeof oGuid = '$1'",
    "EL03255": "hasRefer(oGuid); oGuid is not a Guide object. oGuid._type = '$1', oGuid._guid = '$2'",
    "EL03256": "findSetObject(oGuid, origin); [ oGuid._guid | oGuid ]는 'string' 타입만 가능합니다.(length > 0) guid = '$1'",
    "EL03257": "findSetObject(oGuid, origin); origin can only be of type 'object'. typeof origin = '$1'",
    "EL03300": "----- namespace-manager.js -----",
    "EL03310": "----- private function, proterty -----",
    "EL03311": "NamespaceManager.allowOverlap 은  'boolean' 타입만 가능합니다. typeof allowOverlap = $1",
    "EL03312": "_getArray(ns); ns is not a valid namespace name rule. ns = $1",
    "EL03313": "_getArray(ns); ns type is 'string', 'array<string>' only typeofns = $1",
    "EL03314": "_getArray(ns); ns[$1] is not type 'string'. typeofns[$1] = $2",
    "EL03315": "_getArray(ns); ns[$1] is not a valid name rule. ns[$1] = $1",
    "EL03320": "----- addNamespace, delNamespace, path -----",
    "EL0321": "addNamespace(ns); addition of namespace failed",
    "EL03322": "delNamespace(ns); Namespace deletion failed",
    "EL0323": "path(ns); failed to get the namespace path",
    "EL03330": "----- add, del -----",
    "EL03331": "add(fullName,lem); [$1] is not a valid name rule",
    "EL03332": "add(fullName,lem);lem is already registered. Allow duplicate [this.allowOverlap = 'true']",
    "EL03333": "add(fullName,lem); failed to register elements in the namespace",
    "EL03334": "del(fullName); Failed to delete element in Namespace",
    "EL03340": "----- getPath, output, load -----",
    "EL03341": "getPath(elem); no element value. typeoflem = $1",
    "EL03342": "output (stringify, space); Namespace export failed. $1",
    "EL03343": "load(str, path); str is not type 'string'. typeofstr = $1",
    "EL03344": "load(str, path); Namespace loading failed. $1",
    "EL04100": "----- Collection.* -----",
    "EL04110": "----- base-collection.js -----",
    "EL04111": "_remove(idx): boolean is an abstract method. Must be implemented",
    "EL04112": "setObject(oGuid, origin); _owner connection of oGuid failed. guid = $1",
    "EL04113": "removeAt(idx); idx is not type 'number'. typeof idx = $1",
    "EL04114": "add(any): number is an abstract method. must be implemented",
    "EL04115": "clear() is an abstract method. must be implemented",
    "EL04116": "map(callback); callback is not function type. type of callback = $1",
    "EL04117": "filter(callback); callback is not function type. type of callback = $1",
    "EL04118": "reduce(callback); callback is not function type. type of callback = $1",
    "EL04119": "find(callback); callback is not function type. type of callback = $1",
    "EL041110": "forEach(callback); callback is not function type. type of callback = $1",
    "EL041111": "Some(callback); callback is not function type. type of callback = $1",
    "EL041112": "Every(callback); callback is not function type. type of callback = $1",
    "EL041113": "findIndex(callback); callback 이 function 타입이 아닙니다. typeof callback = $1",
    "EL04200": "",
    "EL04210": "----- collection-array.js -----",
    "EL04211": "_elements connection failed for setObject(oGuid, origin); oGuid['_elem'][$1]: guid = $2",
    "EL04212": "insertAt(pos, value, desc); pos is not type 'number'. typeof pos = $1",
    "EL04213": "insertAt(pos, value, desc); pos cannot be greater than this.count.pos = $1, count = $2",
    "EL04214": "insertAt(pos, value, desc); pos cannot be less than 0. pos = $1",
    "EL04215": "insertAt(pos, value, desc); registration failed. pos = $1, value = $2",
    "EL04220": "----- collection-property.js -----",
    "EL04221": "setObject(oGuid, origin); oGuid['_lem'].length = $1 length and oGuid['_key'].length = $2 length are different",
    "EL04222": "setObject(oGuid, origin); oGuid['_elem'].length = $1 length and oGuid['_desc'].length = $2 length are different",
    "EL04223": "setObject(oGuid, origin); oGuid._elem[$1] guid not found. guid = $2",
    "EL04224": "indexOf(obj, isKey); if the index value is found by key, obj must be of type 'string'. typeof obj = $1",
    "EL04225": "add(name, value, desc); name is not of type 'string'. type of name = $1",
    "EL04226": "add(name, value, desc); name = '$1' is not valid for name rule. Rule = '$2'",
    "EL04227": "add(name, value, desc); name = '$1' is the reserved word",
    "EL04228": "add(name, value, desc); name = '$1' is duplicated with existing name",
    "EL04229": "add(name, value, desc); addition failed. name = '$1', value = '$2'",
    "EL0422A": "indexToKey(idx); idx is not of type 'number'. typeof idx = $1",
    "EL0422B": "exists(key); key is not of type 'string' (length > 0) type of key = $1",
    "EL04300": "",
    "EL04310": "----- collection-transaction.js -----",
    "EL04311": "$1.autoChanges 는 'boolean' 타입입니다. typeof aucoChanges = '$2'",
    "EL04320": "----- trans-queue.js -----",
    "EL04321": "collection value is not an instance that inherited [MetaObject]",
    "EL04322": "collection is not an instance of [ArrayCollection]",
    "EL04323": "rollback(); '$1' is an unprocessable cmd",
    "WS011": "[$1] Destination [$2] cannot be deleted",
    "EN": "OK"
};

/**** message-wrap.js | Message ****/
//==============================================================

const localesPath$2 = './locales';    // 상대 경로

Message.importMessage(defaultCode$2, localesPath$2);

await Message.autoDetect();

/**** extend-error.js | ExtendError ****/
//==============================================================

// inner function 
function _buildMessageProp(obj) {
    var msg = '';
    for (var prop in obj) {
        if (typeof obj[prop] === 'string') msg += prop + ' : '+ obj[prop] + '\n';
        else continue;
    }
    return msg;
}
function _buildMsgQueue(queue) {
    var msg = '';
    var queue_cnt = queue.length;
    for (var i = queue_cnt; i > 0; i--) {
        var mark = '';
        for (var j = i; j <= queue_cnt; j++) { mark += '#'; }
        msg += '' + mark + ' '+ queue[i - 1] + '\n';
    }
    return msg;
}

class ExtendError extends Error {

    static _NS = 'Common';      // namespace

    /**
     * Save previously generated messages.  
     * 
     * @member {string[]} ExtendError#queue
     */
    queue = [];

    /**
     * Error message related to property type.  
     * 
     * @member {object} ExtendError#prop
     */
    prop = {};

    /**
     * Use user messages to create an ExtendError instance.  
     *
     * @param {string} msg Error message string
     * @param {ExtendError | object | null} causeOrProp Error message by existing ExtendError, Error object or property
     *
     * @example
     * throw new ExtendError("Custom error message");
     * throw new ExtendError("Custom error message", error);
     * throw new ExtendError("Custom error message", { style: "required" });
     */

    /**
     * Create an instance of 'ExtendError' using the message code and substitution value.  
     *
     * @param {RegExp} msgPattern Code value of regular expression type
     * @param {ExtendError | object | null} causeOrProp Error message by existing ExtendError, Error object or property
     * @param {string[]} placeholders Array of strings containing substitution values such as '$1' and '$2' in the
     *
     * @example
     * // For messages that do not have a substitution value
     * throw new ExtendError(/EL01504/);
     * throw new ExtendError(/EL01504/, error);
     * throw new ExtendError(/EL01504/, { style: "required" });
     * // For messages with substitution values
     * throw new ExtendError(/EL01504/, undefined, ['value1', 'value2']);
     * throw new ExtendError(/EL01504/, error, ['value1', 'value2']););
     * throw new ExtendError(/EL01504/, { style: "required" }, ['value1', 'value2']);
     */
    constructor(p_msg, p_prop, p_codeVal) {
        super();
        
        var _build = '';
        var _prop;
        var _queue = [];    
        var _msg;

        if (p_prop instanceof ExtendError) {
            _queue = p_prop.queue;
            _prop = p_prop.prop;
        } else if (p_prop instanceof Error) {
            _queue.push(p_prop.message);
        } else if (typeof p_prop  === 'object' && p_prop !== null) {
            _prop = p_prop;
        }
        
        if (typeof p_msg === 'string') {
            _msg = p_msg;
        } else if (p_msg instanceof RegExp) {
            _msg = Message.get(p_msg.source, p_codeVal);
        } else _msg = '';
        
        _build = _msg + '\n';
        
        if (_prop) _build += _buildMessageProp(_prop);
        if (_queue.length > 0) _build += _buildMsgQueue(_queue);

        this.message = _build;
        this.queue = _queue;
        this.queue.push(_msg);
    }

    /**
     * Converts error messages into strings.  
     * 
     * @return error message string
     */
    toString() {
        return 'ExtendError : ' + this.message;
    }
}

/**** util-type.js Type ****/
//==============================================================
 
var _global$2 = globalThis;
var OLD_ENV$1 = _global$2.OLD_ENV ? _global$2.OLD_ENV : false;    // 커버리지 테스트 역활

/**
 * This is a type module.
 */
var Type = {};

/**
 * object 와 new 생성한 사용자 함수를 제외한 객쳐 여부  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isPrimitiveObj(obj) { // REVIEW: 정리 필요, 의미적으로 명료하게..
    if(typeof obj === 'object' && obj !== null 
        && (obj instanceof RegExp || obj instanceof Date )) {
        return true;
    }
    return false;
}

/**
 * 최상위 object 이거나 사용자 함수에서 생성한 객체 여부  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isObject$1(obj)  {  // REVIEW: 정리 필요, 의미적으로 명료하게
    if(typeof obj === 'object' && obj !== null && !_isPrimitiveObj(obj)) {
        return true;
    }
    return false;
}

/**
 * 공백객체 인지 확인  
 * 
 * @param {*} obj 검사대상
 * @returns {boolean}
 */
function _isEmptyObj(obj)  {
    if(_isObject$1(obj) && Object.keys(obj).length === 0 && getAllProperties(obj).length === 0) return true;
    return false;
}

/**
 * 공백이 아닌 객체 (prototype 및 속성 있는것)  
 * 
 * @param {*} obj 대상 
 * @returns {boolean}
 */
function _isFillObj(obj)  {
    if(_isObject$1(obj) && getAllProperties(obj).length > 0) return true;
    return false;
}

/**
 * 내장함수 유무  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isBuiltFunction(obj) {
    if (typeof obj === 'function' && (obj === Number || obj === String || obj === Boolean
        || obj === Object || obj === Array || obj === Function
        || obj === RegExp || obj === Date 
        || obj === Symbol || obj === BigInt
    )) return true;
    return false;
}

/**
 * 첫문자 대문자 여부  
 * 
 * @param {string} strValue 
 * @returns {boolean}
 */
function _isUpper(strValue) {
    var firstStr = strValue.charAt(0);
    if (firstStr === '') return false;
    if(firstStr === firstStr.toUpperCase()) return true;
    return false;
}

/**
 * 리터럴 여부  
 * number, string, boolean, bigint, RexExp instance  
 * 
 * @param {*} obj 
 * @returns {boolean}
 */
function _isLiteral(obj) {
    if (typeof obj  === 'number') return true;
    if (typeof obj  === 'string') return true;
    if (typeof obj  === 'boolean') return true;
    if (typeof obj  === 'bigint') return true;
    if (obj instanceof RegExp) return true;
    return false;
}

/**
 * 리터럴값 비교  
 * number, string, boolean, bigint, RexExp instance  
 * 
 * @param {*} obj1 
 * @param {*} obj2 
 * @returns {boolean}
 */
function _equalLiternal(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (obj1 instanceof RegExp && obj2 instanceof RegExp && obj1.source === obj2.source) return true;
    return false;
}

/**
 * function 생성하는 생성자
 * @param {*} type 
 * @returns {object}
 */
var _creator = function(type) {
    return new type;
};

/**
 * 타임명 얻기  
 * 
 * @param {*} obj 
 * @returns {string}
 */
function _typeName(obj) {
    return obj['name'];
}

/**
 * kind 코드, 대문자로 얻기 '_any_'...  
 * 
 * @param {*} val 
 * @returns {string}
 */
function _getKeyCode(val) {
    var reg = /^_[a-zA-Z]+_/;
    var result;

    if (typeof val !== 'string') return '';
    result = reg.exec(val);
    if (result !== null) return result[0].toUpperCase();
    return '';
}

// 배열 구조 분해 할당을 해제 
function restoreArrowFunction(transformedCode) {
    // 1. 화살표 함수의 매개변수와 본문 전체를 추출
    const regex = /\((.*?)\)\s*=>\s*\{([\s\S]*)\}/;
    const match = transformedCode.match(regex);
  
    // 특별히 `_ref => { ... }` 형태도 대응할 수 있도록 추가 처리
    //  -> _ref => { let [String] = _ref; return Number; }
    //  -> 실제로는 ( _ref ) => { ... } 형태로 통일
    if (!match) {
        // 혹시 _ref => { ... } 형태라면, 강제로 괄호를 넣어 재시도
        const altRegex = /^(.*?)\s*=>\s*\{([\s\S]*)\}/;
        const altMatch = transformedCode.match(altRegex);
        if (!altMatch) {
            throw new Error('Invalid arrow function format.');
        }
        // altMatch[1] = "_ref"
        // altMatch[2] = "let [String] = _ref; return Number;"
        let altParams = altMatch[1].trim();
        let altBody = altMatch[2].trim();
    
        // 화살표 함수 형태 통일:  ( _ref ) => { ... }
        return restoreArrowFunction(`(${altParams}) => {${altBody}}`);
    }
  
    // 2. 매개변수와 함수 본문 부분 분리
    let params = match[1].trim();  // 함수의 매개변수 부분
    let body = match[2].trim();    // 함수 본문
  
    // 3. 구조 분해 할당 패턴 (객체/배열 모두 대응) - 여러 줄(줄바꿈)도 허용
    //    예: let { aa: String } = _ref5;  또는 let [[{ bb: Number }]] = _ref6;
    const paramAssignments = body.match(/let\s+(\{[\s\S]*?\}|\[[\s\S]*?\])\s*=\s*(\w+);/g) || [];
  
    // 4. 찾아낸 구조 분해 할당들을 순회하며 매개변수( _ref5, _ref6 등 )를 원래 형태로 치환
    paramAssignments.forEach(assign => {
        // - parts[1]: { aa: String } 또는 [String] 등 (줄바꿈 포함 가능)
        // - parts[2]: _ref5, _ref6 등
        const parts = assign.match(/let\s+(\{[\s\S]*?\}|\[[\s\S]*?\])\s*=\s*(\w+);/);
        if (parts) {
            const extractedParam = parts[1].trim(); // 원래 구조
            const originalParam = parts[2].trim();  // 변환된 변수명 (_ref5 등)
    
            // 매개변수 목록에 있던 _ref5 등을 { aa: String } 등으로 치환
            const re = new RegExp(`\\b${originalParam}\\b`, 'g');
            params = params.replace(re, extractedParam);
        }
    });
  
    // 5. return 문이 있다면 반환값을 추출
    //    예: return Number; -> "Number"
    const returnStatementMatch = body.match(/return\s+(.*?);/);
    let returnType = returnStatementMatch ? returnStatementMatch[1].trim() : '';
  
    // 6. 최종 복원 – return 문이 있다면 { return ... } 형태로, 없으면 { } 로
    if (returnType) {
        // 불필요한 공백 없애기 위해 파라메터 부분도 스페이스 정리
        params = params.replace(/\s+/g, '');
        return `(${params})=>{return ${returnType}}`;
    } else {
        params = params.replace(/\s+/g, '');
        return `(${params})=>{}`;
    }
}

/**
 * 함수 규칙   
 * - (params 내부에는 '()' 입력 금지)  
 * - 참조형 타입 금지 : new Function() 시점에 자동 해석됨  
 * 
 * @param {*} funBody 
 * @returns {object}
 */
function _parseFunc(funBody) {
    var syntax1 = /\([,_\[\]{:}\w\s]*\)\s*(?:=>)?\s*{\s*.*\s*.*\s*}/;    // 제한 규칙
    var syntax2 = /(\(.*\)|\w+)\s*(?:=>).*/;
    var regFunc1 = /(?:function\s)?\(([\[\]{:}\s\w,]*)\)\s*(?:=>)?\s*{(?:\s*return\s+|\s*)?([\[\]{:}\s\w,]*);?\s*}/;
    var regFunc2 = /\(?([\[\]{:}\s\w,]*)\)?\s*(?:=>)\s*{?(?:\s*return\s+|\s*)?([\[\]\s\w,]*);?\s*}?/;
    
    var arrFunc;
    var result = { params: [], return: undefined };
    var arrParam = [];
    var arrRetrun;
    
    // 배열 구조 분해 할당을 해제 
    if (/\blet\b/.test(funBody)) funBody = restoreArrowFunction(funBody);
    
    funBody = $skipComment(funBody);

    try {
        if (syntax1.test(funBody)) arrFunc = regFunc1.exec(funBody);
        else if (syntax2.test(funBody)) arrFunc = regFunc2.exec(funBody);
        else throw new ExtendError(/EL01301/, null, [funBody]);
        
        if (arrFunc === null) throw new ExtendError(/EL01302/, null, [funBody]);

        arrParam = (new Function('return ['+ arrFunc[1] +']'))();
        result['params'] = arrParam;
        
        if (arrFunc[2] !== '') arrRetrun = (new Function('return '+ arrFunc[2]))();
        result['return'] = arrRetrun;

    } catch (error) {
        throw new ExtendError(/EL01303/, error, ['']);
    }

    return result;

    // inner function
    function $skipComment(body) {    // 주석 제거 comment
        var rBody = body;
        var bloackComment = /\/\*[^](.*?)\*\//g;
        var lineComment = /\/\/[^](.*?)(\n|$)/g;

        rBody = rBody.replace(bloackComment, '');
        rBody = rBody.replace(lineComment, '');
        return rBody;
    }
}

/**
 * 타입 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _hasType(name) {
    var arr = [];
    
    if (typeof name !== 'string') return false;

    arr = arr.concat(['null', 'undefined', 'number', 'string', 'boolean']);
    arr = arr.concat(['array', 'function', 'object']);
    arr = arr.concat(['choice', 'union', 'class']);
    arr = arr.concat(['symbol', 'bigint', 'regexp']);
    arr = arr.concat(['etc']);  // 예외 오류 코드 검출 

    return arr.indexOf(name) > -1;
}

/**
 * 타입 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _isLeafType(name) {
    var arr = [];
    
    arr = arr.concat(['null', 'undefined', 'number', 'string', 'boolean']);
    arr = arr.concat(['symbol', 'bigint', 'regexp', 'object']);

    return arr.indexOf(name) > -1;
}

/**
 * choice type kind 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _hasKindChoice(name) {
    var arr = [];
    
    if (typeof name !== 'string') return false;
    
    arr = arr.concat(['_ALL_', '_ANY_', '_NON_', '_ERR_']);
    arr = arr.concat(['_REQ_', '_OPT_', '_DEF_', '_EUM_']);
    arr = arr.concat(['_ETC_']);  // 예외 오류 코드 검출 

    return arr.indexOf(name) > -1;
}

/**
 * choice type kind 여부  
 * 
 * @param {string} name 
 * @returns {boolean}
 */
function _hasKindArray(name) {
    var arr = [];
    
    if (typeof name !== 'string') return false;

    arr = arr.concat(['_ALL_', '_ANY_']);
    arr = arr.concat(['_REQ_', '_OPT_', '_SEQ_']);
    arr = arr.concat(['_ETC_']);  // 예외 오류 코드 검출 

    return arr.indexOf(name) > -1;
}

/**
 * Query all properties of the object.
 * 
 * @param {object} obj  Object to look up properties (except Object)
 * @param {boolean?} hasObj Whether to include properties of 'Object'
 * @returns {array<string>} Property Name Arrangement
 */
function getAllProperties(obj, hasObj) {
    var allProps = [], cur = obj;
    var is = hasObj || false;
    do {
        var props = Object.getOwnPropertyNames(cur);
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (allProps.indexOf(prop) === -1 && (is || !Object.prototype.hasOwnProperty(prop))) allProps.push(prop);
        }
    } while (cur = Object.getPrototypeOf(cur));
    return allProps;
}
Type.getAllProperties = getAllProperties;

/**
 * Compare the two objects to see if they are the same (except Prototype)  
 * 
 * @param {any} obj1 Source object
 * @param {any} obj2 Object to compare
 * @returns {boolean} Whether the two objects are the same ('true' or 'false')
 */
function deepEqual(obj1, obj2) {
    // 두 객체가 동일한 참조를 가지면 true를 반환
    if (obj1 === obj2) return true;

    // 두 객체 중 하나가 null이거나 타입이 다르면 false를 반환
    if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2) return false;

    // 함수 비교
    if (typeof obj1 === 'function' && typeof obj2 === 'function') {
        return obj1.toString() === obj2.toString();
    }

    // 원시 값 비교
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

    // 배열 비교
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        for (var i = 0; i < obj1.length; i++) {
            if (!deepEqual(obj1[i], obj2[i])) return false;
        }
        return true;
    }

    // 객체 비교
    // var keys1 = Object.keys(obj1);
    // var keys2 = Object.keys(obj2);
    var keys1 = Object.getOwnPropertyNames(obj1);
    var keys2 = Object.getOwnPropertyNames(obj2);

    if (keys1.length !== keys2.length) return false;

    for (var j = 0; j < keys1.length; j++) {
        var key = keys1[j];
        if (keys2.indexOf(key) === -1 || !deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}
Type.deepEqual = deepEqual;

/**
 * Gets the type of the given function (generator). (Can include '_UNION')  
 * The returned arrays are included in order from the specified function.  
 * 
 * @param {function} ctor Generator function or class
 * @param {boolean} [hasUnion= true] whether '_UNION' is included (default: 'true')
 * @returns {array<function>} Array function type
 */
function getTypes(ctor, hasUnion) {
    var arr = [];
    var tempArr = [];
    var union;
    var proto;

    hasUnion = hasUnion === false ? false : true;
    
    if (typeof ctor !== 'function') throw new ExtendError(/EL0130C/, null, [typeof ctor]);

    arr.push(ctor);
    proto = $getPrototype(ctor);        
    
    if (proto !== Function.prototype) {
        arr = arr.concat(getTypes(proto, hasUnion));
    }
    if (hasUnion) {
        union = ctor['_UNION'] || [];
        for (var i = 0; i < union.length; i++) {
            arr = arr.concat(getTypes(union[i], hasUnion));
        }
    }

    for (var j = 0; j < arr.length; j++) {
        var idx = tempArr.indexOf(arr[j]);
        if (idx < 0) tempArr.push(arr[j]);
    }
    return tempArr;

    // innner function
    function $getPrototype(ctor) {
        // if (ctor.hasOwnProperty('super')) return ctor.super;
        if (Object.prototype.hasOwnProperty.call(ctor, 'super')) return ctor.super;
        return !OLD_ENV$1 && typeof Object.getPrototypeOf === 'function' ? Object.getPrototypeOf(ctor) : ctor.__proto__;
    }
}
Type.getTypes = getTypes;

/**
 * Verify that the prototype (inheritance) chain of the function type contains the specified target.  
 * 
 * @param {function} ctor Generator function or class
 * @param {function | string} target To be examined (generator function or class name)
 * @returns {boolean} whether to be included in the prototype chain ('true' or 'false')
 */
function isProtoChain(ctor, target) {
    var arr;
    if (typeof ctor !== 'function') return false;
    if (!(typeof target === 'function' || typeof target === 'string')) return false;

    arr = getTypes(ctor, false);
    for (var i = 0; i < arr.length; i++) {
        if (typeof target === 'string') {
            if (target === arr[i].name) return true;
        } else {
            if (target === arr[i]) return true;
        }
    }
    return false;
}
Type.isProtoChain = isProtoChain;

/**
 * Verify that the given function type is included in the prototype (inheritance) chain or is of type '_UNION'.  
 * 
 * @param {function} ctor Generator function or class
 * @param {function | string} target To be examined (generator function or class name)
 * @returns {boolean} Prototype chain or type '_UNION' ('true' or 'false')
 */
function hasType(ctor, target) {
    var arr;
    if (typeof ctor !== 'function') return false;
    if (!(typeof target === 'function' || typeof target === 'string')) return false;

    arr = getTypes(ctor);
    for (var i = 0; i < arr.length; i++) {
        if (typeof target === 'string') {
            if (target === arr[i].name) return true;
        } else {
            if (target === arr[i]) return true;
        }
    }
    return false;
}
Type.hasType = hasType;

/**
 * Returns extension information of the target type in JSON format.  
 * Analyze the internal properties of the object to transform all properties into the format 'typeObject()'.  
 * 
 * @param {*} target Target type
 * @returns {object} converted extension type object
 * @example
 * var obj = {
 *      $ype: '',
 *      default: null,                  // string, number, boolean, regexp
 *      kind: '',                       // array, choice
 *      creator: null, _instance: {},   // class
 *      _prop: {},                      // union
 *      params: [], return: null,       // function
 *      name: name, func: null,
 * }
 */
function typeObject(target) {
    var obj = {};
    var typeObj = _isObject$1(target) && target['$type'] ? target : extendType(target);
    var leafType = ['null', 'undefined', 'number', 'string', 'boolean', 'symbol', 'bigi¡nt', 'object', 'regexp'];

    obj['$type'] = typeObj['$type'];
    
    if (typeObj['default'] !== null && typeof typeObj['default'] !== 'undefined') obj['default'] = typeObj['default'];
    if (typeObj['kind'] !== null && typeof typeObj['kind'] !== 'undefined') obj['kind'] = typeObj['kind'];
    if (typeObj['params']) obj['params'] = typeObj['params'];
    if (typeObj['return']) obj['return'] = typeObj['return'];
    if (typeObj['creator']) obj['creator'] = typeObj['creator'];
    if (typeObj['_instance']) obj['_instance'] = typeObj['_instance'];

    if (leafType.indexOf(obj['$type']) > -1) {
        if (typeObj['default']) obj['default'] = typeObj['default'];
        return obj;
    }
    if (obj['$type'] === 'array' ||  obj['$type'] === 'choice') {
        obj['list'] = [];
        for(var i = 0; i < typeObj['list'].length; i++) {
            obj['list'][i] = typeObject(typeObj['list'][i]);
        }
    }
    if (obj['$type'] === 'function') {
        for(var j = 0; j < obj['params'].length; j++) {
            obj['params'][j] = typeObject(typeObj['params'][j]);
        }
        if (typeObj['return']) obj['return'] = typeObject(typeObj['return']);
    }
    if (obj['$type'] === 'class') {
        if (typeof typeObj['ref'] === 'function') {
            obj['creator'] = typeObj['ref'].name; 
            var temp = _creator(typeObj['ref']);
            obj['_instance'] = typeObject(temp);
        }
    }
    if (obj['$type'] === 'union') {
        obj['_prop'] = {};
        var temp2 = typeObj['ref'] || typeObj['_prop'];
        var list = getAllProperties(temp2);
        for (var k = 0; k < list.length; k++) {
            var key = list[k];
            if (key === '_interface' || key === 'isImplementOf' ) continue;             // 예약어
            obj['_prop'][key] = typeObject(temp2[key]);
        }
    }
    return obj;
}
Type.typeObject = typeObject;

/**
 * Returns the extension type name of the target object.  
 * 
 * @param {*} target Target object
 * @returns {string} extended type name
 */
function typeOf(target) {
    return extendType(target)['$type'];
}
Type.typeOf = typeOf;

/**
 * Returns the extension type of the target object.  
 * 
 * @param {any} target Target object
 * @returns {object} extended type object
 * @example
 * var singleType = ['undefined', 'null', 'number', 'string', 'boolean', 'regexp', 'object', 'symbol'];
 * var unionType = ['array', 'choice', 'function', 'class', 'union'];
 */
function extendType(target) {
    var obj =  { $type: '', ref: undefined };

    obj.toString = function(){
        var temp = '';
        var arr = [];
        if (this['$type'] === 'array' || this['$type'] === 'choice') {
            for (var i = 0; i < this['list'].length; i++) {
                var _type = extendType(this['list'][i]);
                if (_type['default'] && _type['default'] !== null) {
                    var def;
                    if (_type['$type'] === 'string') def = '\''+ _type['default'] +'\'';
                    else def = _type['default'];
                    arr.push(_type['$type'] + '('+ def +')');
                } else arr.push(_type['$type']);
            }
            if (this['kind'] === '_OPT_' || this['kind'] === '_REQ_' || this['kind'] === '_SEQ_' || this['kind'] === '_EUM_' || this['kind'] === '_DEF_') {
                temp = this['$type'] +'('+ this['kind'] +')['+ arr.join(', ')+ ']';
            } else temp = this['$type'] +'('+ this['kind'] +')';
            
        } else {
            temp = this['$type'];
            if (this['default'] && this['default'] !== null) {
                if (this['$type'] === 'string') temp += '(\''+ this['default'] +'\')';
                else temp += '('+this['default']+')';
            }
        }
        return temp;
    };
    // special type
    if (typeof target === 'object'  && target !== null && target['$type']) {
        obj['$type'] = target['$type'];
        if (target['default']) obj['default'] = target['default'];
        if (target['kind']) obj['kind'] = target['kind'];
        if (target['ref']) obj['ref'] = target['ref'];
        if (target['list']) obj['list'] = target['list'];
        if (target['name']) obj['name'] = target['name'];
        if (target['func']) obj['func'] = target['func'];
        if (target['params']) obj['params'] = target['params'];
        if (target['return']) obj['return'] = target['return'];
        if (!_hasType(obj['$type'])) throw new ExtendError(/EL01304/, null, [obj['$type']]);
        if (obj['$type'] === 'array') {
            obj['kind'] = obj['kind'] || '_ALL_';
            if (!_hasKindArray(obj['kind'])) throw new ExtendError(/EL01305/, null, [obj['kind']]);
        }
        if (obj['$type'] === 'choice') {
            if (!_hasKindChoice(obj['kind'])) throw new ExtendError(/EL01306/, null, [obj['kind']]);
        }
        return obj;
    } else {
        obj['ref'] = target;
    }

    // step : operation
    if (target === null) {
        obj['$type'] = 'null';
    } else if (target === Number) {
        obj['$type'] = 'number';
        obj['default'] = null;            
    } else if (target === String) {
        obj['$type'] = 'string';
        obj['default'] = null;
    } else if (target === Boolean) {
        obj['$type'] = 'boolean';
        obj['default'] = null;
    } else if (target === Array) {
        obj['$type'] = 'array';
        obj['kind'] = '_ALL_';
        obj['list'] = [];
    } else if (target === Function) {
        obj['$type'] = 'function';
        obj['params'] = [];
    } else if (target === Object) {
        obj['$type'] = 'object';
    } else if (target === RegExp) {
        obj['$type'] = 'regexp';
        obj['default'] = null;
    } else if (target === Symbol) {      // ES6+
        obj['$type'] = 'symbol';
    } else if (target === BigInt) {      // ES6+
        obj['$type'] = 'bigint';
        obj['default'] = null;
    } else if (target instanceof RegExp) {
        obj['$type'] = 'regexp';
        obj['default'] = target;
    // step : typeof
    } else if (typeof target === 'undefined') {
        obj['$type'] = 'undefined';
    } else if (typeof target === 'number') {
        obj['$type'] = 'number';
        obj['default'] = target;
    } else if (typeof target === 'string') {
        obj['$type'] = 'string';
        obj['default'] = target;
    } else if (typeof target === 'boolean') {
        obj['$type'] = 'boolean';
        obj['default'] = target;
    } else if (typeof target === 'bigint') { // ES6+
        obj['$type'] = 'bigint';
        obj['default'] = target;
    } else if (typeof target === 'symbol') { // ES6+
        obj['$type'] = 'symbol';
    // step : function
    } else if (typeof target === 'function') {
        var kind = target['_KIND'];
        if (kind) {
            kind = kind.toLowerCase();
            if (kind === 'function') obj['$type'] = 'function';
            else obj['$type'] = 'class';    // class, interface, abstract
        } else obj['$type'] = _isUpper(target.name) ? 'class' : 'function';
            
        if (obj['$type'] === 'function') {
            try {
                var funcType  = target['_TYPE'] ? target['_TYPE'] : _parseFunc(target.toString());
                obj['params'] = funcType['params'];
                obj['return'] = funcType['return'];
            } catch (_err) {
                obj['params'] = [];
            }
        }
    // step : array
    } else if (Array.isArray(target)) {
        if (target.length ===  1 && Array.isArray(target[0])) {
            obj['$type'] = 'choice';
            if (target[0].length === 0) obj['kind'] = '_ANY_';
            else obj['kind'] = _getKeyCode(target[0][0]);
            obj['list'] = obj['kind'] ? target[0].slice(1) : target[0];
        } else {
            obj['$type'] = 'array';
            if (target.length === 0) obj['kind'] = '_ANY_';
            else obj['kind'] = _getKeyCode(target[0]);
            obj['list'] = obj['kind'] ? target.slice(1) : target;
        }
        if (!obj['kind']) obj['kind'] = '_OPT_';
        // kind 검사
        if (obj['$type'] === 'array' && !_hasKindArray(obj['kind'])) throw new ExtendError(/EL01307/, null, [obj['kind']]);
        if (obj['$type'] === 'choice' && !_hasKindChoice(obj['kind'])) throw new ExtendError(/EL01308/, null, [obj['kind']]);

    // step : object
    } else if (_isFillObj(target) || _isEmptyObj(target)) {
        obj['$type'] = 'union';
    
    // REVIEW:  기타 모든 함수는 object 로 처리한다. 더 좋은 방법이 있으면 대체 한다.
    } else {
    // } else if(_isPrimitiveObj(type)) {
        obj['$type'] = 'object';
    }
    // } else throw new ExtendError(/EL01309/, null, []);    // REVIEW: 커버리지 확인시 주석 처리
    return obj;
}
Type.extendType = extendType;

/**
 * 원본타입에 대상타입이 덮어쓰기가 허용 가능한지 검사합니다.  
 * 원본타입에 대상타입으로 캐스팅이 가능하지 확인합니다.
 * @param {any} extType 원본 타입
 * @param {any} tarType 대상 타입
 * @param {number} opt 허용옵션 : 0 = 기본, 1 = 타입생성 비교 
 * @param {string?} pathName '' 공백시 성공
 * @returns {throw?}
 */
function _execAllow(extType, tarType, opt, pathName) {
    var eType = extendType(extType);
    var tType = extendType(tarType);
    var prop = {};
    var sExt = eType.toString(), sTar = tType.toString();
    
    pathName = pathName ? pathName : 'extType';
    if (pathName !== 'extType' || !pathName) prop['error path'] = pathName;
    opt = opt || 0;

    // if (_isObject(eType['ref']) && _isObject(tType['ref']) && deepEqual(eType, tType)) return; // REVIEW: 필요없어  보이지만 잠시 남겨둠
    // origin seq, opt 필수 검사
    if (eType['kind']) {
        if ((eType['kind'] === '_SEQ_' || eType['kind'] === '_OPT_' || eType['kind'] === '_REQ_' || eType['kind'] === '_EUM_'|| eType['kind'] === '_DEF_') 
        && eType['list'].length === 0) {
            throw new ExtendError(/EL01201/, prop, ['extType', sExt]);
        }
    }
    // tarType seq, opt 필수 검사
    if (tType['kind']) {
        if ((tType['kind'] === '_SEQ_' || tType['kind'] === '_OPT_' || tType['kind'] === '_REQ_'  || tType['kind'] === '_EUM_'|| tType['kind'] === '_DEF_') 
        && tType['list'].length === 0) {
            throw new ExtendError(/EL01201/, prop, ['tarType', sTar]);
        }
    }
    //  원본은 초이스가 아니고, tarType choice 의 인 경우
    if (eType['$type'] !== 'choice' && tType['$type'] === 'choice' ) {
        var choType = { $type: 'choice', kind: '_REQ_', list: [extType] };
        _execAllow(choType, tarType, opt, pathName);
        return;
    }
    // check allow type
    if (_isLeafType(eType['$type'])) {
        if(typeof eType['default'] !== 'undefined' && eType['default'] !== null && !_equalLiternal(eType['default'], tType['default'])) {
            throw new ExtendError(/EL01202/, prop, [eType['$type'], eType, tType]);
        }
        if (eType['$type'] !== tType['$type']) throw new ExtendError(/EL01203/, prop, [eType['$type'], tType['$type']]);
    
    } else if (eType['$type'] === 'array')  $arrayAllow();
    else if (eType['$type'] === 'choice') $choiceAllow();
    else if (eType['$type'] === 'class') $classAllow();
    else if (eType['$type'] === 'union') $unionAllow();
    else if (eType['$type'] === 'function') $functionAllow();
    else throw new ExtendError(/EL01204/, prop, []);

    // inner function
    function $arrayAllow() {
        if (tType['$type'] !== 'array' || !Array.isArray(tType['list'])) throw new ExtendError(/EL01211/, prop, [tType['$type']]);
        
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {
            return;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (tType['kind'] === '_ANY_') return;
            if (tType['kind'] === '_ALL_' || tType['kind'] === '_OPT_') {
                throw new ExtendError(/EL01212/, prop, [sTar]);
            }
            return;

        // _SEQ_ (sequence)
        } else if (eType['kind'] === '_SEQ_') {
            if (eType['kind'] !== tType['kind'])  throw new ExtendError(/EL01213/, prop, [tType]);
            if (eType['list'].length > tType['list'].length) {
                throw new ExtendError(/EL01214/, prop, [eType.list.length, tType.list.length]);
            }

            // element check
            for (var i = 0; i < eType['list'].length; i++) {
                try {
                    _execAllow(eType['list'][i], tType['list'][i], opt, pathName);
                } catch (error) {
                    throw new ExtendError(/EL01215/, error, [i]);
                }
            }
            return;
        
        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') {
            if (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' || tType['kind'] === '_OPT_') {
                throw new ExtendError(/EL01216/, prop, [eType['$type'], sTar]);
            }

        // _OPT_ (option)
        } else if (eType['kind'] === '_OPT_') {
            if (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' ) {
                throw new ExtendError(/EL01217/, prop, [eType['$type'], sTar]);
            }
        
        // _ETC_
        } else {
            throw new ExtendError(/EL01218/, prop, [eType['kind']]);
        }

        // element check
        for (var k = 0; k < tType['list'].length; k++) {
            var success = false;
            for (var j = 0; j < eType['list'].length; j++) {
                try {
                    if (success) break;
                    if (extendType(tType['list'][k])['$type'] === 'choice' && extendType(eType['list'][j])['$type'] !== 'choice' ) {
                        var oriChoice = { $type: 'choice', kind: '_OPT_', list: eType['list'] };
                        _execAllow(oriChoice, tType['list'][k], opt, pathName);
                    } else {
                        _execAllow(eType['list'][j], tType['list'][k], opt, pathName);
                    }
                    success = true;
                } catch (error) {
                    continue;
                }
            }
            if (!success) throw new ExtendError(/EL01219/, prop, [eType, tType]);
        }
    }

    function $choiceAllow() {
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {
            if (tType['$type'] === tType['$type'] && tType['kind'] === '_ERR_') {
                throw new ExtendError(/EL01221/, prop, [eType['$type'], sTar]);
            }
            return;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (tType['$type'] === 'undefined') throw new ExtendError(/EL01222/, prop, ['_ANY_', 'undefined']);
            if (eType['$type'] === tType['$type'] && (tType['kind'] === '_ALL_' || tType['kind'] === '_OPT_' || tType['kind'] === '_ERR_' || tType['kind'] === '_NON_')) {
                throw new ExtendError(/EL01223/, prop, [sTar]);
            }
            return;
        
        // _NON_ 
        } else if  (eType['kind'] === '_NON_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                // 4
                throw new ExtendError(/EL01224/, prop, [sTar]);
            }
            return;

        // _ERR_ (error)
        } else if (eType['kind'] === '_ERR_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                // 5
                throw new ExtendError(/EL01225/, prop, [sTar]);
            }
            return;

        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') {
            if (eType['$type'] === tType['$type'] && (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' 
            || tType['kind'] === '_OPT_' || tType['kind'] === '_NON_' || tType['kind'] === '_ERR_')) {
                // 6
                throw new ExtendError(/EL01226/, prop, [sTar]);
            }

        // _OPT_ (option)
        } else if (eType['kind'] === '_OPT_') {
            if (tType['$type'] === 'undefined') return;
            if (eType['$type'] === tType['$type'] && (tType['kind'] === '_ALL_' || tType['kind'] === '_ANY_' 
            || tType['kind'] === '_NON_' || tType['kind'] === '_ERR_')) {
                // 7
                throw new ExtendError(/EL01227/, prop, [sTar]);
            }
        
            // _EUN_ (enumeration)
        } else if (eType['kind'] === '_EUM_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                throw new ExtendError(/EL01228/, prop, []);
            }
            for (var i = 0; i < eType['list'].length; i++) {
                if (!_isLiteral(eType['list'][i])) throw new ExtendError(/EL01229/, prop, [i, extendType(eType['list'][i])]);
            }
            for (var j = 0; j < tType['list'].length; j++) {
                if (!_isLiteral(tType['list'][j])) throw new ExtendError(/EL0122A/, prop, [j, extendType(tType['list'][j])]);
            }

        // _DEF_ (default)
        } else if (eType['kind'] === '_DEF_') {
            if (eType['$type'] !== tType['$type'] || eType['kind'] !== tType['kind']) {
                throw new ExtendError(/EL0122B/, prop, []);
            }
            if (!_isLiteral(eType['list'][0])) throw new ExtendError(/EL0122C/, prop, [extendType(eType['list'][0])]);
            if (!_isLiteral(tType['list'][0])) throw new ExtendError(/EL0122D/, prop,  [extendType(tType['list'][0])]);

        // _ETC_
        } else {
            throw new ExtendError(/EL0122E/, prop, [eType['kind']]);
        }

        // element check
        var arrTarget = (tType['kind']) ? tType['list'] : [tarType];
        for (var m = 0; m < arrTarget.length; m++) {
            var success = false;
            for (var n = 0; n < eType['list'].length; n++) {
                try {
                    if (success) continue;
                    _execAllow(eType['list'][n], arrTarget[m], opt, pathName);
                    success = true;
                } catch (error) {
                    continue;
                }
            }
            if (!success) throw new ExtendError(/EL0122F/, prop, [m, eType, extendType(arrTarget[m])['$type']]);
        }
    }
    
    function $classAllow() {
        var oriObj;
        var tarObj;
        if (tType['$type'] === 'class') {         // # class to class
            if (isProtoChain(tType['ref'], eType['ref'])) return undefined;   // 1.proto check
            if (opt === 1) {
                try {
                    // 생성비교
                    oriObj = new eType['ref']();
                    tarObj = new tType['ref']();
                    return _execAllow(oriObj, tarObj, opt, pathName);
                } catch (error) {
                    throw new ExtendError(/EL01231/, error, []);
                }                    
            }
            throw new ExtendError(/EL01232/, prop, [opt]);

        } else if (tType['$type'] === 'union') {  // # class to union
            if (opt === 1) {
                try {
                    // 생성비교
                    oriObj = new eType['ref']();
                    return _execAllow(oriObj, tType['ref'], opt, pathName);
                } catch (error) {
                    throw new ExtendError(/EL01233/, error, []);
                }                    
            }
            throw new ExtendError(/EL01234/, prop, [opt]);

        }
        throw new ExtendError(/EL01235/, prop, [tType]);
    }

    function $unionAllow() {
        var list;

        if (tType['$type'] !== 'union') throw new ExtendError(/EL01241/, prop, [tType]);
        list = getAllProperties(eType['ref']);

        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            if (!(key in tType['ref'])) throw new ExtendError(/EL01242/, prop, [key, typeOf(extType[key])]);      
            try {
                _execAllow(eType['ref'][key], tType['ref'][key], opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01243/, error, [key]);
            }
        }
    }

    function $functionAllow() {
        if (tType['$type'] !== 'function')  throw new ExtendError(/EL01251/, prop, [tType]);
        if (eType['ref'] === Function) return;
        // special type check
        if (eType['name']) {
            if (eType['name'] === tarType.name  
            || eType['name'] === tType['name'] 
            || (tType['func'] && eType['name'] === tType['func'].name)) return;
            throw new ExtendError(/EL01252/, prop, [eType['name'], tType.name]);
        }
        if (eType['func']) {
            if (typeof tType['func'] !== 'function') throw new ExtendError(/EL01253/, prop, []);
            if (isProtoChain(tType['func'], eType['func'])) return;
            throw new ExtendError(/EL01254/, prop, []);
        }

        if (!eType['return'] && (!eType['params'] || eType['params'].length === 0)) return;
        if (typeof tType['params'] === 'undefined' && typeof tType['return'] === 'undefined') { 
            throw new ExtendError(/EL01255/, prop, [extendType(eType.params), typeOf(eType.return)]);
        }
        if (Array.isArray(eType['params']) && eType['params'].length > 0) {  
            try {   // params check
                _execAllow(['_SEQ_'].concat(eType['params']), ['_SEQ_'].concat(tType['params']), opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01256/, error, []);
            }
        }
        if (eType['return']) {            
            try {   // return check
                _execAllow(eType['return'], tType['return'], opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01257/, error, []);
            }
        }
    }
}

/**
 * 타입을 검사하여 메세지를 리턴
 * @param {any} extType 검사할 타입 , extType 
 * @param {any} target 검사대상
 * @param {number} [opt] 허용옵션 : 0 = 기본, 1 = 타입생성 비교 
 * @param {string} [pathName] '' 공백시 성공
 * @throws {ExtendError}
 */
function _execMatch(extType, target, opt, pathName) {
    var eType = extendType(extType);
    var tType = extendType(target);
    var prop = {};
    var sExt = eType.toString(), sTar = tType.toString();
    
    pathName = pathName ? pathName : 'extType';
    if (pathName !== 'extType') prop['error path'] = pathName;    // TODO: 'target' 명칭의 중복 수정필요
    opt = opt || 0;

    // seq, opt 필수 검사
    if (eType['kind']) {
        if ((eType['kind'] === '_SEQ_' || eType['kind'] === '_OPT_' || eType['kind'] === '_REQ_' || eType['kind'] === '_EUM_'|| eType['kind'] === '_DEF_') 
        && (typeof eType['ref'] === 'undefined' || eType['list'].length === 0)) {
            throw new ExtendError(/EL01101/, prop, ['extType', sExt]);
        }
    }

    // check match type
    if (eType['$type'] === 'null') {
        if (target !== null) throw new ExtendError(/EL01102/, prop, ['null', sTar]);
    
    } else if (eType['$type'] === 'undefined') {
        if (typeof target !== 'undefined') throw new ExtendError(/EL01102/, prop, ['undefined', sTar]);
    
    } else if (eType['$type'] === 'string') {
        if (typeof eType['default'] === 'string' && typeof target === 'undefined') target = eType['default'];
        if (typeof target !== 'string') throw new ExtendError(/EL01102/, prop, ['string', sTar]);
    
    } else if (eType['$type'] === 'number') {
        if (typeof eType['default'] === 'number' && typeof target === 'undefined') target = eType['default']; 
        if (typeof target !== 'number') throw new ExtendError(/EL01102/, prop, ['number', sTar]);
    
    } else if (eType['$type'] === 'boolean') {
        if (typeof eType['default'] === 'boolean' && typeof target === 'undefined') target = eType['default'];
        if (typeof target !== 'boolean') throw new ExtendError(/EL01102/, prop, ['boolean', sTar]);
    
    } else if (eType['$type'] === 'bigint') {    // ES6+
        if (typeof eType['default'] === 'bigint' && typeof target === 'undefined') target = eType['default'];
        if (typeof target !== 'bigint') throw new ExtendError(/EL01102/, prop, ['bigint', sTar]);
    
    } else if(eType['$type'] === 'symbol') {    // ES6+
        if (typeof target !== 'symbol') throw new ExtendError(/EL01102/, prop, ['symbol', sTar]);
    
    } else if (eType['$type'] === 'regexp') {
        if (eType['default'] && eType['default'] !== null && typeof target === 'undefined') target = eType['default'];
        if (!(target instanceof RegExp)) throw new ExtendError(/EL01102/, prop, ['regexp', sTar]);
    
    } else if (eType['$type'] === 'object') {
        if (tType['$type'] !== 'object') throw new ExtendError(/EL01102/, prop, ['object', sTar]);

    } else if (eType['$type'] === 'array') $arrayMatch();
    else if (eType['$type'] === 'choice') $choiceMatch();
    else if (eType['$type'] === 'class') $classMatch();
    else if (eType['$type'] === 'union') $unionMatch();
    else if (eType['$type'] === 'function') $functionMatch();        
    else throw new ExtendError(/EL01103/, prop, []);

    // inner function
    function $arrayMatch() {
        if (!Array.isArray(target)) throw new ExtendError(/EL01111/, prop, [sTar]);
        
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {      
            return;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (target.length === 0) throw new ExtendError(/EL01112/, prop, [target.length]);
            return;

        // _SEQ_ (sequence)
        } else if (eType['kind'] === '_SEQ_') {
            if (eType['list'].length > target.length) throw new ExtendError(/EL01113/, prop, [eType['list'].length, tType['list'].length]);    // REVIEW: 세부정보 표현
            for(var i = 0; i < eType['list'].length; i++) {
                var _elem   = eType['list'][i];
                var _tar    = tType['list'][i];
                if (_isLiteral(_elem)) {
                    if (!_equalLiternal(_elem, _tar)) throw new ExtendError(/EL01114/, prop, [i, _elem, _tar]);
                } else {
                    try {
                        _execMatch(_elem, _tar, opt, pathName);
                    } catch (error) {
                        throw new ExtendError(/EL01115/, error, [i, typeOf(_elem)]);
                    }
                }
            }
            return;

        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') {
            if (target.length === 0) throw new ExtendError(/EL01116/,  prop, [target.length]);

        // _OPT_ (option)
        } else if (eType['kind'] === '_OPT_') {
            if (Array.isArray(target) && target.length === 0) return;

        // _ETC_
        } else {
            throw new ExtendError(/EL01117/,  prop, [eType['kind']]);
        }
        

        // element check
        for (var k = 0; k < target.length; k++) {
            var tar = target[k];
            var success = false;
            for (var j = 0; j < eType['list'].length; j++) {
                try {
                    var elem = eType['list'][j];
                    if (_isLiteral(elem)) {
                        if (_equalLiternal(elem, tar)) {
                            success = true;
                            break;
                        }
                    } else {
                        _execMatch(elem, tar, opt, pathName);    // REVIEW: pathName + '['+i+']'  이렇게 들어가야 함
                        success = true;
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
            if (!success) {
                throw new ExtendError(/EL01118/, prop, [eType.toString(), tType.toString()]);
            }
        }
    }

    function $choiceMatch() {
        // _ALL_ (all)
        if (eType['kind'] === '_ALL_') {
            return undefined;

        // _ANY_ (any)
        } else if (eType['kind'] === '_ANY_') {
            if (typeof target !== 'undefined') return undefined;
            throw new ExtendError(/EL01121/, prop, []);

        // _NON_ (none)
        } else if (eType['kind'] === '_NON_') {
            if (typeof target === 'undefined') return undefined;
            throw new ExtendError(/EL01122/, []);
            
        // _ERR_ (error)
        } else if (eType['kind'] === '_ERR_') {
            if (target instanceof Error) return undefined;
            throw new ExtendError(/EL01123/, []);

        // _REQ_ (require)
        } else if (eType['kind'] === '_REQ_') ; else if (eType['kind'] === '_OPT_') {
            if (typeof target === 'undefined') return undefined;

        // _EUN_ (enumeration)
        } else if (eType['kind'] === '_EUM_') {
            for (var i = 0; i < eType['list'].length; i++) {
                if (!_isLiteral(eType['list'][i])) throw new ExtendError(/EL01124/, prop, [i, typeOf(eType['list'][i])]);
            }

        // _DEF_ (default)
        } else if (eType['kind'] === '_DEF_') {
            if (!_isLiteral(eType['list'][0])) throw new ExtendError(/EL01125/, prop, [typeOf(eType['list'][0])]);
            if (typeof target === 'undefined') {
                target = eType['list'][0];
                return undefined;
            }
            // _IDX_ (index)
            // } else if (eType['kind'] === '_IDX_') {
            /**
             * POINT:
             * - 검사
             *  + target object 검사
             *  -\+ 파라메터 2개 검사
             * 
             * - 인덱스 타입 목록 추출
             * 
             * - 초이스로 변환
             *  + 허용타입들 + 
             * 
             * this.command = [['_AND_',  { aa: 1 }, ClassA ]]
             * [['_IDX_', String]]
             * [['_KEY_', Number, String, '리터럴']]
             * 
             * this.command = [['_AND_', [['_IDX_', String]], [['_KEY_', Number, String, '리터럴']] ]]
             * 
             * 마지막에 리턴 및 실패 처리
             */

            /**
             * - 검사
             *  + 타겟의 object 여부 검사
             *  + 파라메터 1개 이상 검사
             * - 조건문 처리
             *  + 둘다 성공해야 성공
             */
            // POINT: 개발 해야함
            // if (eType['list'].length === 0) throw new ExtendError('TODO: IDX 는 검사 타입이 없습니다. 하나이상 있어야 합니다.', prop, []);
            // if (tType['$type'] !== 'union') throw new ExtendError('TODO: IDX 는 검사 대상이 object(union) 타입만 가능합니다.', prop, ['object', sTar]);

            // for(var i = 0; i < eType['list'].length; i++) {
            //     var _elem   = eType['list'][i];
                
            //     // var _tar    = tType['list'][i];
            //     try {
            //         _execMatch(_elem, target);
            //     } catch (error) {
            //         throw new ExtendError('TODO: ', error, []);
            //     }
                
            // }
        
        // _ETC_
        } else {
            throw new ExtendError(/EL01126/,  prop, [eType['kind']]);
        }

        // element check
        for (var j = 0; j < eType['list'].length; j++) {
            try {
                var elem = eType['list'][j];
                if (_isLiteral(elem)) {
                    if (_equalLiternal(elem, target)) return undefined;
                } else {
                    return _execMatch(elem, target, opt, pathName);
                }
            } catch (error) {
                continue;
            }
        }
        throw new ExtendError(/EL01127/, prop,[eType, tType]);
    }

    function $classMatch() {
        if (tType['$type'] === 'class') {         // # class to class
            if (typeof eType['ref'] === 'undefined') return undefined;  // 전역 클래스 타입
            if (isProtoChain(tType['ref'], eType['ref'])) return undefined;
        } else if (typeof target === 'object') {    // # class to typeof 'object'
            if (target instanceof extType) return undefined;     
            if (!_isBuiltFunction(extType) && target !== null && opt === 1) {
                try {
                    var subPath = pathName === 'extType' ? '<instance>' : pathName + '<instance>';
                    return _execMatch(_creator(extType), target, opt, subPath);
                } catch (error) {
                    throw new ExtendError(/EL01131/, error);
                }
            }
            throw new ExtendError(/EL01132/, prop, [_typeName(extType)]);
        }
        throw new ExtendError(/EL01133/, prop, [tType]);                
    }

    function $unionMatch() {
        var list;
        
        if (tType['$type'] !== 'union') throw new ExtendError(/EL01141/, prop, [tType]);
        list = getAllProperties(eType.ref);

        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            var listDefType = extendType(extType[key]);
            // REVIEW: for 위쪽으로 이동 검토!
            if (key === '_interface' || key === 'isImplementOf') continue;             // 예약어
            // REVIEW: 재귀로 구현 체크
            // default 설정
            if (typeof listDefType['default'] !== 'undefined' && listDefType['default'] !== null && typeof target[key] === 'undefined') target[key] = listDefType['default'];
            // POINT:
            // if (target !== null && !(key in target)) throw new ExtendError(/EL01142/, prop, [key, typeOf(extType[key])]);    
            try {
                var subPath = pathName +'[\''+ key+'\']';
                _execMatch(extType[key], target[key], opt, subPath);
            } catch (error) {
                throw new ExtendError(/EL01143/, error, [key]);
            }
        }
    }

    function $functionMatch() {
        if (tType['$type'] !== 'function') throw new ExtendError(/EL01151/, prop, [tType]);
        if (eType['ref'] === Function) return;
        // special type check
        if (eType['name']) {
            if (eType['name'] === target.name 
            || eType['name'] === tType['name'] 
            || (tType['func'] && eType['name'] === tType['func'].name)) return;
            throw new ExtendError(/EL01152/, prop, [eType['name'], target.name]);
        }
        if (eType['func']) {
            if (typeof tType['func'] !== 'function') throw new ExtendError(/EL01153/, prop, []);
            if (isProtoChain(tType['func'], eType['func'])) return;
            throw new ExtendError(/EL01154/, prop, []);
        }

        if (!eType['return'] && (!eType['params'] || eType['params'].length === 0)) return;
        if (typeof tType['params'] === 'undefined' && typeof tType['return'] === 'undefined') { 
            throw new ExtendError(/EL01155/, prop, [extendType(eType.params), typeOf(eType.return)]);
        }
        // params check
        if (Array.isArray(eType['params']) && eType['params'].length > 0) {  
            try {
                _execAllow(['_SEQ_'].concat(eType['params']), ['_SEQ_'].concat(tType['params']), opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01156/, error, []);
            }
        }
        // return check
        if (eType['return']) {            
            try {
                _execAllow(eType['return'], tType['return'], opt, pathName);
            } catch (error) {
                throw new ExtendError(/EL01157/, prop, []);
            }
        }
    }
}

/**
 * Verify that the extension type allows the target type.  
 * 
 * @param {any} extType Extension Type
 * @param {any} tarType What type to check
 * @param {number} [opt=0] Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {throw?} Exception occurs if extension type does not allow target type
 */
function allowType(extType, tarType, opt) {
    try {
        _execAllow(extType, tarType, opt);
    } catch (error) {
        throw new ExtendError(/EL0130A/, error);
    }
}
Type.allowType = allowType;

/**
 * Verify that the extension type matches the target.  
 * 
 * @param {any} extType Extension Type
 * @param {any} target For inspection
 * @param {number} [opt=0] Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {throw?} Exception occurs when failing
 */
function matchType(extType, target, opt) {
    try {
        _execMatch(extType, target, opt);
    } catch (error) {
        throw new ExtendError(/EL0130B/, error);
    }
}
Type.matchType = matchType;

/**
 * Determine whether the extension type allows the target type.  
 * 
 * @param {any} extType Extension Type
 * @param {any} target Type to be examined
 * @param {number} opt Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {boolean} whether to allow ('true' or 'false')
 */
function isAllowType(extType, target, opt) {
    try {
        _execAllow(extType, target, opt);
    } catch (error) {
        return false;
    }
    return true;
}
Type.isAllowType = isAllowType;

/**
 * Verify that the extension type matches the target.  
 * 
 * @param {any} extType Extension Type
 * @param {any} target Type to be examined
 * @param {number} [opt] Allow option (0 = Keep existing, 1 = Create class type)
 * @returns {boolean} Match or not ('true' or 'false')
 */
function isMatchType(extType, target, opt) {
    try {
        _execMatch(extType, target, opt);
        return true;
    } catch (error) {
        return false;
    }
}
Type.isMatchType = isMatchType;

/**** util.js | Util ****/
//==============================================================
   
var _global$1 = globalThis;

var OLD_ENV = _global$1.OLD_ENV ? _global$1.OLD_ENV : false;    // 커버리지 테스트 역활

/**
 * This is a utility module.
 */
var Util = {};

// local function
function _isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

/**
 * Returns the nested depth of the array.  
 * REVIEW: 필요성 검토 필요!
 * 
 * @param {array} p_elem Array elements
 * @param {number} p_depts Current depth (default: 0)
 * @returns {number} Maximum nested depth of array
 */
function getArrayDepth(p_elem, p_depts) {
    var MAX     = 10;
    var level   = 0;
    
    p_depts = p_depts || 0;
    if (p_elem instanceof Array && MAX > p_depts) {
        level++;
        p_depts++;
        level = level + getArrayDepth(p_elem[0], p_depts);
    }
    return level;
}Util.getArrayDepth = getArrayDepth;

/**
 * Creates a 36-digit GUID.  
 * 
 * @returns {string} GUID string generated
 */
function createGuid() {
    function _p8(s) {  
        var p = (Math.random().toString(16)+'000000000').substring(2,10);  
        return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 8) : p ;  
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}Util.createGuid = createGuid;

/**
 * Deep copy of the object (except prototype)  
 * 
 * @param {object} p_target Destination object to copy
 * @returns {object} copied object
 */
function deepCopy(p_target) {
    var nobj;

    if (!_isObject(p_target)) {
        return p_target;
    }
    if (p_target instanceof RegExp) return p_target;

    // 객체인지 배열인지 판단
    nobj = Array.isArray(p_target) ? [] : {};
    
    if (Array.isArray(p_target)) {
        for (var i = 0; i < p_target.length; i++) {
            nobj[i] = deepCopy(p_target[i]);
        }
    } else {
        for (var key in p_target) {
            if (Object.prototype.hasOwnProperty.call(p_target, key)) {
                nobj[key] = deepCopy(p_target[key]);
            }
        }
    }
    return nobj;
}Util.deepCopy = deepCopy;

/**
 * Sets the specified creator to inherit the parent creator.   
 * 
 * @function
 * @param {function | object} ctor generator function or object
 * @param {function | object} superCtor Parent generator function or object
 */
Util.inherits = (function () {
    if (typeof Object.create === 'function' && !OLD_ENV) {
        // implementation from standard node.js 'Util' module
        return function(ctor, superCtor) {
            if (superCtor) {
                ctor.super = superCtor;
                ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        writable: true,
                        configurable: true,
                        enumerable: false,
                    }
                });
            }
        };
    } else {
        // old school shim for old browsers
        return function (ctor, superCtor) {
            if (superCtor) {
                ctor.super = superCtor;
                var TempCtor = function () {};
                TempCtor.prototype = superCtor.prototype;
                ctor.prototype = new TempCtor();
                ctor.prototype.constructor = ctor;
            }
        };
    }
}());

/**
 * Verify that the object implements the specified interface.  
 * Verify that the 'obj' object created with 'ctor' implements the interface provided by 'interfaces'.  
 * If 'ctor._KIND' is 'Interface', use 'allowType()' to confirm.  
 * Otherwise, use 'matchType()' to confirm.  
 * 
 * @name implements
 * @function
 * @param {function} p_ctor Generator to be examined
 * @param {object} p_obj object to be examined
 * @param {function?} args List of interfaces to check
 */

function _implements(p_ctor, p_obj) {
    var _interface = [];
    var addCnt = 0;

    if (typeof p_ctor !== 'function') throw new ExtendError(/EL01401/, null, [typeof p_ctor]);
    if (!_isObject(p_obj)) throw new ExtendError(/EL01402/, null, [typeof p_obj]);

    if (typeof p_obj._interface === 'undefined') {
        Object.defineProperty(p_obj, '_interface', {
            get: function() { 
                return _interface;
            },
            configurable: false,
            enumerable: false,
        });
    }    

    if (!p_ctor['_UNION']) p_ctor['_UNION'] = [];
    
    for(var i = 2; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
            if (p_obj._interface.indexOf(arguments[i]) < 0) { // 중복 검사 
                p_obj._interface.push(arguments[i]);
                addCnt++;
            }
        } else throw new ExtendError(/EL01403/, null, [i - 2, typeof arguments[i]]);
    } 

    for (var j = 0; j < p_ctor['_UNION'].length; j++) {
        if (p_obj._interface.indexOf(p_ctor['_UNION'][j]) < 0) {    // 인터페이스 중복 검사 후 등록
            p_obj._interface.push(p_ctor['_UNION'][j]);
            addCnt++;
        }
    }

    try {
        var beginIdx = p_obj._interface.length - addCnt;
        for (var k = beginIdx; k < p_obj._interface.length; k++) {
            if (p_ctor['_KIND'] === 'interface') {  // 인터페이스 타입과 분리
                Type.allowType(p_obj._interface[k], p_obj, 1);
            } else Type.matchType(p_obj._interface[k], p_obj, 1);
        }
    } catch (error) { 
        throw new ExtendError(/EL01404/, error, [$typeName(p_obj), $typeName(p_obj._interface[i]), p_ctor['_KIND'] || 'class']);
    }

    if (typeof p_obj.isImplementOf === 'undefined') {   // 내부 메소드 설정
        Object.defineProperty(p_obj, 'isImplementOf', {
            value: $isImplementOf,
            configurable: false,
            enumerable: false
        });
    }

    // inner function
    function $isImplementOf(target) {
        if (typeof target === 'function') {
            for (var i = 0; i < this._interface.length; i++) {
                if (this._interface[i] === target) return true;  
            }
        } else if (typeof target === 'string') {
            for (var j = 0; j < this._interface.length; j++) {
                if (this._interface[j].name === target) return true;  
            }
        } else throw new ExtendError(/EL01405/, null, [typeof target]);
        return false;
    }
    function $typeName(obj) {
        var proto;
        var constructor;
        if (typeof obj === 'function') {
            return obj.name;
        } else if (typeof obj === 'object') {
            proto = !OLD_ENV && Object.getPrototypeOf ? Object.getPrototypeOf(obj) : obj.__proto__ ;
            constructor = proto.constructor;
            return  constructor.name;
        } else return 'unknown name';
    }
}Util.implements = _implements;

/**** trans-queue.js | EventEmitter ****/
//==============================================================
  
var EventEmitter = (function () {
    /**
     * Creates an instance of the class 'EventEmitter'.
     * @constructs EventEmitter
     */
    function EventEmitter() {
        
        var $storage = {};
        var isLog = false;

        /**
         * Internal object that stores registered events.  
         * 
         * @private
         * @member {object}  EventEmitter#$subscribers  
         */
        Object.defineProperty(this, '$storage', {
            get: function() { return $storage; },
            set: function(nVal) { 
                if (!_isObject(nVal)) throw new ExtendError(/EL01501/, null, [this.constructor.name, nVal]);
                $storage = nVal;
            },
            configurable: false,
            enumerable: false
        });

        /**
         * Array that stores registered event names.  
         * 
         * @protected
         * @member {object}  EventEmitter#_list  
         */
        Object.defineProperty(this, '_list', {
            get: function() { 
                return Object.keys(this.$storage);
            },
            configurable: false,
            enumerable: false
        });

        /**
         * Array that stores registered event names.
         * 
         * @member {boolean}  EventEmitter#isLog  
         */
        Object.defineProperty(this, 'isLog', {
            get: function() { return isLog; },
            set: function(nVal) {
                if (typeof nVal !== 'boolean') throw new ExtendError(/EL01502/, null, [this.constructor.name, nVal]);
                isLog = nVal;
            }
        });
    }
    EventEmitter._NS = 'Common';    // namespace

    // local function
    function _isString(obj) {    // 공백 아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }
    function _isObject(obj) {    // 객체 여부
        if (typeof obj === 'object' && obj !== null) return true;
        return false;
    }

    /**
     * Adds a listener (function) for the event.  
     * 
     * @param {string} p_event Event Name
     * @param {function} p_listener Listener function
     */
    EventEmitter.prototype.on = function(p_event, p_listener) {
        if (!_isString(p_event)) throw new ExtendError(/EL01503/, null, [typeof p_event]);
        if (typeof p_listener !== 'function') throw new ExtendError(/EL01504/, null, [typeof p_listener]);
        
        if (typeof this.$storage[p_event] !== 'object') {
            this.$storage[p_event] = [];
        }
        if (this.$storage[p_event].indexOf(p_listener) === -1) {
            this.$storage[p_event].push(p_listener);
        }
        // this.$storage[p_event].push(p_listener);

    };
    /** Alias for method 'on(). */
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    
    /**
     * Adds a one-time function for the event.  
     * 
     * @param {string} p_event Event Name
     * @param {function} p_listener Listener function
     */
    EventEmitter.prototype.once = function(p_event, p_listener) {
        var self = this;

        if (!_isString(p_event)) throw new ExtendError(/EL01505/, null, [typeof p_event]);
        if (typeof p_listener !== 'function') throw new ExtendError(/EL01506/, null, [typeof p_listener]);

        function onceListener() {
            self.off(p_event, onceListener);
            p_listener.apply(self, arguments);
        }
        this.on(p_event, onceListener);
    };

    /**
     * Removes the listener (function) of the specified event.  
     * 
     * @param {string} p_event Event Name
     * @param {function} p_listener Listener function
     */
    EventEmitter.prototype.off = function(p_event, p_listener) {
        if (!_isString(p_event)) throw new ExtendError(/EL01507/, null, [typeof p_event]);
        if (typeof p_listener !== 'function') throw new ExtendError(/EL01508/, null, [typeof p_listener]);
        
        if (typeof this.$storage[p_event] === 'object') {
            var idx = this.$storage[p_event].indexOf(p_listener);
            if (idx > -1) {
                this.$storage[p_event].splice(idx, 1);
            }
        }
    };
    /** Alias of method 'off()'. */
    EventEmitter.prototype.removeListener = EventEmitter.prototype.off; // 별칭

    /**
     * Remove all events or all listeners registered for a particular event.  
     * @param {string} [p_event] Name of the event to be removed (Remove all events if omitted)
     */
    EventEmitter.prototype.removeAllListeners = function(p_event) {
        if (!p_event) {
            this.$storage = {};  // 초기화
        }
        if (typeof this.$storage[p_event] === 'object') {
            delete this.$storage[p_event];
        }
    };

    /**
     * Runs the listener (function) of the registered event.  
     * 
     * @param {string} p_event Event Name
     * @returns {boolean | undefined}  'true' listener execution successful, 'false' execution failed, 'undefined' listener no
     */
    EventEmitter.prototype.emit = function(p_event) {
        var args = [].slice.call(arguments, 1);
        var listeners = [];
        // var isListener = false;
        var isReturn;

        if (!_isString(p_event)) throw new ExtendError(/EL01509/, null, [typeof p_event]);

        if (typeof this.$storage[p_event] === 'object') {
            listeners = this.$storage[p_event].slice();
            for (var i = 0; i < listeners.length; i++) {
                isReturn = listeners[i].apply(this, args);
                if (isReturn === false) return false;
            }
        }
        if (this.isLog) console.log('['+p_event+'] 이벤트가 밸생하였습니다.');

        return listeners.length > 0 ? true : undefined;
    };

    return EventEmitter;
    
}());

/**** i-object.js | IObject ****/
//==============================================================    

/**
 * Object interface.
 * 
 * @interface
 */
class IObject {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    /**
     * @constructs IObject
     */
    constructor() {
    }

    /**
     * Returns a list of types of objects.
     * 
     * @returns {Function[]} Arrangement of types of objects
     * @abstract
     */
    getTypes() {
        throw new ExtendError(/EL02111/, null, ['IObject']);
    }

    /**
     * Verify that the object is an instance of a particular class or interface.
     * 
     * @returns {boolean} Instance or 'true' if it's an instance or 'false' if it's not
     * @abstract
     */
    instanceOf() {
        throw new ExtendError(/EL02112/, null, ['IObject']);
    }

    /**
     * Compare that the object is the same as the given object.
     * 
     * @returns {boolean} If two objects are the same, 'true', or 'false'
     * @abstract
     */
    equal() {
        throw new ExtendError(/EL02113/, null, ['IObject']);
    }
}

/**** i-marshal.js | IMarshal ****/
//==============================================================
   
/**
 * Object control interface.
 * 
 * @interface
 */
class IMarshal {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    /**
     * @constructs IMarshal
     */
    constructor() {
    }

    /**
     * Internal property that stores the unique identifier of the object.
     * 
     * @member {string}
     */
    _guid = String;

    /**
     * Internal property that stores the creator type of the object.
     * 
     * @member {string} REVIEW:
     */
    _type = [['_req_', Function, { $type: 'class' }]];

    /**
     * Returns the object literal.
     * 
     * @abstract
     */
    getObject() {
        throw new ExtendError(/EL02121/, null, ['IMarshal']);
    }

    /**
     * Set the object literal by converting it to an instance.
     * 
     * @abstract
     */
    setObject() {
        throw new ExtendError(/EL02122/, null, ['IMarshal']);
    }
}

/**** i-collection.js | ICollection ****/
//==============================================================

/**
 * This is the collection interface.
 * 
 * @interface
 */
class ICollection {

    static _KIND = 'interface';
    static _NS = 'Interface';  // namespace

    constructor() {
    }

    /**
     * Add an element to the collection.
     * 
     * @abstract
     */
    add() {
        throw new ExtendError(/EL02161/, null, ['ICollection']);
    }

    /**
     * Remove an element from the collection.
     * 
     * @abstract
     */
    remove() {
        throw new ExtendError(/EL02162/, null, ['ICollection']);
    }

    /**
     * Verify that an element exists in the collection.
     * 
     * @returns {boolean} If the element exists, it is 'true', otherwise it is 'false'
     * @abstract
     */
    contains() {
        throw new ExtendError(/EL02163/, null, ['ICollection']);
    }

    /**
     * Returns the index of an element in the collection.
     * 
     * @returns {number} index of element, '-1' without element
     * @abstract
     */
    indexOf() {
        throw new ExtendError(/EL02164/, null, ['ICollection']);
    }
}

/**** i-collection-property.js | IPropertyCollection ****/
//==============================================================

/**
 * This is the property collection interface.
 * 
 * @interface
 * @extends ICollection
 */
class IPropertyCollection extends ICollection {

    static _KIND = 'interface';
    static _NS = 'Interface';  // namespace

    constructor() {
        super();
    }

    /**
     * Returns the property key for the specified index.
     * 
     * @returns {boolean} Property key for that index
     * @abstract
     */
    indexToKey() {
        throw new ExtendError(/EL02181/, null, ['IPropertyCollection']);
    }
}

/**** i-element.js | IElement ****/
//==============================================================

/**
 * Element (independent) interface.
 * 
 * @interface
 */
class IElement {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    /**
     * @constructs IElement
     */
    constructor() {
    }

    /**
     * Internal property that stores the name of the element.
     * 
     * @member {string}
     */
    _name = String;

    /**
     * Creates a copy of the current element.
     * 
     * @returns {object} Replicated Elements
     * @abstract
     */
    clone() {
        throw new ExtendError(/EL02131/, null, ['IElement']);
    }
}

/**** i-list.js | IList ****/
//==============================================================

/**
 * List interface.
 * 
 * @interface
 */
class IList {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    /**
     * @constructs IList
     */
    constructor() {
    }
    
    /**
     * An internal array that stores the data in the list.
     * 
     * @member {array}
     */
    _list = Array;
    
    /**
     * Returns the number of lists.
     * 
     * @member {number}
     */
    count = Number;
}

/**** i-control-list.js | IListControl ****/
//==============================================================
   
/**
 * List control interface.
 * 
 * @interface
 */
class IListControl {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * Add an element to the list.
     * 
     * @abstract
     */
    add() {
        throw new ExtendError(/EL02151/, null, ['IListControl']);
    }

    /**
     * Remove an element from the list.
     * 
     * @abstract
     */
    del() {
        throw new ExtendError(/EL02152/, null, ['IListControl']);
    }

    /**
     * Verify that an element exists in the list.
     * 
     * @returns {boolean} If the element exists, it is 'true', otherwise it is 'false'
     * @abstract
     */
    has() {
        throw new ExtendError(/EL02153/, null, ['IListControl']);
    }

    /**
     * Search for elements in the list.
     * 
     * @abstract
     */
    find() {
        throw new ExtendError(/EL02154/, null, ['IListControl']);
    }
}

/**** i-serialize.js | ISerialize ****/
//==============================================================

/**
 * Interface for serialization and deserialization.
 * 
 * @interface
 */
class ISerialize {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    /**
     * @constructs ISerialize
     */
    constructor() {
    }

    /**
     * Serialize objects, convert them into strings (such as JSON), and export them.
     * 
     * @returns {string} Serialized String
     * @abstract
     */
    output() {
        throw new ExtendError(/EL02191/, null, ['ISerialize']);
    }

    /**
     * Restore objects by loading serialized data.
     * 
     * @abstract
     */
    load() {
        throw new ExtendError(/EL02192/, null, ['ISerialize']);
    }
}

/**** i-collection-array.js | IArrayCollection ****/
//==============================================================

/**
 * Array collection interface.
 * 
 * @extends ICollection
 */
class IArrayCollection extends ICollection {

    static _KIND = 'interface';
    static _NS = 'Interface';  // namespace

    constructor() {
        super();
    }

    /**
     * Adds an element to the specified location.
     * 
     * @abstract
     */
    insertAt() {
        throw new ExtendError(/EL02171/, null, ['IArrayCollection']);
    }
}

/**** namespace-manager.js | NamespaceManager ****/
//==============================================================
   
var NamespaceManager = (function () {
    /**
     * Create a Namespace Manager.  
     * 
     * @constructs NamespaceManager
     */
    function NamespaceManager() {

        var $storage = this.$createNsRefer();
        var _elemTypes  = []; 
        var allowOverlap = false;
        
        
        /**
         * Namespace repository  
         * 
         * @member {string} NamespaceManager#$storage
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$storage', {
            get: function() { return $storage; },
            set: function(nVal) { $storage = nVal; },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Namespace element type list.  
         * Allow all types if empty.  
         * 
         * @member {array<any>}  NamespaceManager#_elemTypes  
         * @protected
         */
        Object.defineProperty(this, '_elemTypes', {
            get: function() {
                return _elemTypes;
            },
            set: function(val) {
                var arrType = Array.isArray(val) ? val : Array.prototype.slice.call(arguments, 0);
                _elemTypes = arrType;
            },
            configurable: false,
            enumerable: true,
        });

        /**
         * Namespace element list.  
         * 
         * @member {array<string>}  NamespaceManager#_list
         * @readonly
         */
        Object.defineProperty(this, '_list', {
            get: function() {
                var storage = this.$storage;
                var arr = [];
                var stack = [];
                findElement(storage);
                return arr;

                // inner function
                function findElement(target) { 
                    for (var prop in target) {
                        if (prop === '_type') continue;
                        var ns = target[prop];
                        stack.push(prop);
                        if (!ns['_type']) {
                            arr.push(stack.join('.'));
                        } else findElement(ns);
                        stack.pop();
                    }
                }
            },
            configurable: false,
            enumerable: true,
        });

        /**
         * Total number of Namespace elements.  
         * 
         * @member {number} NamespaceManager#count 
         * @readonly
         */
        Object.defineProperty(this, 'count', {
            get: function() {
                return this._list.length;
            },
            configurable: false,
            enumerable: true,
        });

        /**
         * Set whether to allow duplicate element registration.  
         * Default is 'false' and does not allow duplication.  
         * 
         * @member {boolean} NamespaceManager#allowOverlap
         */
        Object.defineProperty(this, 'allowOverlap', {
            get: function() { return allowOverlap; },
            set: function(val) { 
                if (typeof val !== 'boolean') throw new ExtendError(/EL03311/, null, [typeof val]);
                allowOverlap = val;
            },
            configurable: false,
            enumerable: true
        });

        // inner variable access
        // this.__SET$storage = function(val, call) {
        //     if (call instanceof NamespaceManager) $storage = val;
        // }

        this._$KEYWORD = ['namespace', 'ns', 'NS', '_type'];    // 금지단어

        Util.implements(NamespaceManager, this);        // strip:
    }
    NamespaceManager._UNION = [IList, IListControl];
    NamespaceManager._NS = 'Meta';
    
    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    function _validNamespace(nsName) {  // 네임스페이스 이름 검사
        var regex = /^[_a-zA-Z]([.]?[_0-9a-zA-Z])*$/;
        return regex.test(nsName);
    }

    function _validName(sName) {   // 이름 검사
        var regex = /^[_a-zA-Z]([_0-9a-zA-Z])*$/;
        return regex.test(sName);
    }

    function _getArray(ns) {  // 네임스페이스 문자열 배열로 얻기
        var sections = [];
        if (ns === '') return sections;
        if (typeof ns === 'string') {
            if (!_validNamespace(ns)) throw new ExtendError(/EL03312/, null, [ns]);
            sections = ns.split('.');
        } else if (Array.isArray(ns)) {
            sections = ns;
        } else throw new ExtendError(/EL03313/, null, [typeof ns]);

        for (var i = 0; i < sections.length; i++) {
            var sName =sections[i];
            if (!_isString(sName)) throw new ExtendError(/EL03314/, null, [i, typeof sName]);
            if (!_validName(sName)) throw new ExtendError(/EL03315/, null, [i, sName]);
        }
        return sections;
    }
    
    /**
     * Creates a storage initialization object.  
     * 
     * @returns {object} initialized namespace type object { _type: 'ns'}
     * @private
     */
    NamespaceManager.prototype.$createNsRefer = function() {
        return { _type: 'ns' };
    };

    /**
     * Returns the Namespace path object.  
     * 
     * @param {string | object} p_elem Factors to obtain the path
     * @returns {object} Namespace path object {ns: '...', key: '...'}
     * @protected
     */
    NamespaceManager.prototype._getPathObject = function(p_elem) {
        var fullName;
        var arr;
        var key;
        var nsPath;
        var obj = {};

        if (_isString(p_elem)) fullName = p_elem;
        else fullName = this.getPath(p_elem);
        
        if (typeof fullName !== 'string') return undefined;

        arr = fullName.split('.');
        key = arr.pop();
        nsPath = arr.join('.');
        obj['ns'] = nsPath;
        obj['key'] = key;
        return obj;
    };
    
    /**
     * Initialize the namespace.  
     */
    NamespaceManager.prototype.init = function() {
        this.$storage = this.$createNsRefer();
    };

    /**
     * Add a path to the Namespace.  
     * 
     * @param {string | array<string>} p_ns Namespace name, path in the form of a string or array separated by a dot ('.')
     */
    NamespaceManager.prototype.addNamespace = function(p_ns) {
        var parent = this.$storage;
        var sections;
    
        try {
            sections = _getArray(p_ns);

            if (this._$KEYWORD.indexOf(sections[0]) > -1) sections = sections.slice(1); // 최상위 에약어 제거
        
            for (var i = 0; i < sections.length; i+=1) {
                // var sName = sections[i];
                if (typeof parent[sections[i]] === 'undefined') {
                    parent[sections[i]] = this.$createNsRefer();
                }
                parent = parent[sections[i]];
            }

        } catch (error) {
            throw new ExtendError(/EL03321/, error, []);
        }
    };

    /**
     * Delete the path in the Namespace.  
     * 
     * @param {string | array<string>} p_ns Namespace name, path in the form of a string or array separated by a dot ('.')
     */
    NamespaceManager.prototype.delNamespace = function(p_ns) {
        var parent = this.$storage;
        var sections;
    
        try {
            sections = _getArray(p_ns);

            for (var i = 0; i < sections.length; i+=1) {
                var sName = sections[i];
                if (parent[sName] && parent[sName]['_type'] === 'ns') {
                    if (i === sections.length - 1) delete parent[sName];
                    else parent = parent[sName];
                } else return;
            }
        } catch (error) {
            throw new ExtendError(/EL03322/, error, []);
        }
    };

    /**
     * Returns the path object of the namespace.  
     * 
     * @param {string | sting[]} p_ns Namespace name, path in the form of a string or array separated by a dot ('.')
     * @returns {object} path object
     */
    NamespaceManager.prototype.path = function(p_ns) {
        var parent = this.$storage;
        var sections;

        if (!p_ns) return parent;
        
        try {
            sections = _getArray(p_ns);

            for (var i = 0; i < sections.length; i+=1) {
                var sName = sections[i];
                if (parent[sName] && parent[sName]['_type'] === 'ns') {
                    if (i === sections.length - 1) return parent[sName];    
                    parent = parent[sName];
                } else return undefined;
            }
            return undefined;
            
        } catch (error) {
            throw new ExtendError(/EL03323/, error, []);
        }
    };

    /**
     * Adds an element to the specified namespace path.  
     * 
     * @param {string} p_fullName Full path to the Namespace
     * @param {any} p_elem Functions, classes, or objects to be added
     */
    NamespaceManager.prototype.add = function(p_fullName, p_elem) {
        var parent = this.$storage;
        var sections;
        var oPath;
        var key;
        var ns;

        try {
            oPath = this._getPathObject(p_fullName);
            key = oPath['key'];
            ns = oPath['ns'];
            sections = _getArray(ns);

            if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], p_elem);  // []로 감싸서 choice 타입으로 변환됨
            if (!_validName(key)) throw new ExtendError(/EL03331/, null, [key]);
            if (!this.allowOverlap && this.getPath(p_elem)) {
                throw new ExtendError(/EL03332/, null, []);
            }
            
            if (sections.length === 0) {    // 최상위 등록
                parent[key] = p_elem;
                return;
            } else this.addNamespace(ns);

            for (var i = 0; i < sections.length; i+=1) {
                var sName = sections[i];
                if (i === sections.length - 1) { 
                    parent[sName][key] = p_elem;
                } else parent = parent[sName];
            }
            
        } catch (error) {
            throw new ExtendError(/EL03333/, error, []);
        }
    };

    /**
     * Deletes an element from the specified namespace path.  
     * 
     * @param {string} p_fullname Full path to the Namespace
     * @returns {boolean} Successful deletion ('true' or 'false')
     */
    NamespaceManager.prototype.del = function(p_fullName) {
        var parent = this.$storage;
        var sections;

        try {
            sections = _getArray(p_fullName);

            for (var i = 0; i < sections.length; i+=1) {
                var sName = sections[i];
                if (parent[sName]) {
                    if (i === sections.length - 1) {
                        delete parent[sName];
                        return true;
                    } else parent = parent[sName];
                } else return false;
            }
            return false;
            
        } catch (error) {
            throw new ExtendError(/EL03334/, error, []);
        }

    };

    /**
     * Verify that the specified element exists in the Namespace.  
     * 
     * @param {string | any} p_elem Function, class, or object to check
     * @returns {boolean} Existence ('true' or 'false')
     */
    NamespaceManager.prototype.has = function(p_elem) {
        if (_isString(p_elem) && this.find(p_elem)) return true;
        else if (typeof this.getPath(p_elem) === 'string') return true;
        return false;
    };

    /**
     * Retrieves elements from the specified namespace path.  
     * 
     * @param {string | array<string>} p_fullName Full path to the Namespace
     * @returns {(object | function)?} Found elements
     */
    NamespaceManager.prototype.find = function(p_fullName) {
        var parent = this.$storage;
        var sections;

        try {
            sections = _getArray(p_fullName);   // try undefined
            for (var i = 0; i < sections.length; i+=1) {
                var sName = sections[i];
                if (parent[sName]) {
                    if (i === sections.length - 1) return parent[sName];
                    else parent = parent[sName];
                } else return undefined;
            }
            return undefined;
            
        } catch (error) {
            return undefined;              
        }
    };
    
    /**
     * Returns the path of the specified element in the Namespace.  
     * (Route of the first element in case of redundancy)  
     * @param {any} p_elem Elements to find (function or object)
     * @returns {string?} The path of the element, 'undefined' if not found
     */
    NamespaceManager.prototype.getPath = function(p_elem) {
        var namespace = this.$storage;
        var stack = [];

        if (!p_elem) throw new ExtendError(/EL03341/, null, [typeof p_elem]);

        if ($findElement(namespace)) {
            return stack.join('.');
        } else return undefined;

        // inner function
        function $findElement(target) { 
            for(var prop in target) {
                var obj = target[prop];
                if (obj === 'ns') continue;
                if (obj && obj['_type'] === 'ns') {
                    stack.push(prop);
                    if($findElement(obj)) return true;
                } else {
                    if (obj === p_elem) {
                        stack.push(prop);
                        return true;
                    }
                }
            }
            stack.pop();
            return false;
        }
    };

    /**
     * Serialize the namespace repository and convert it into a string.  
     * To convert the function to JSON, you must specify a separate 'stringify' function.  
     * 
     * @param {function?} p_stringify JSON Stringify function (optional)
     * @param {string?} p_space Setting the blank to apply at the output
     * @returns {string} serialized string
     */
    NamespaceManager.prototype.output = function(p_stringify, p_space) {
        var arr = [];
        var obj;
        var str;
        var temp = { list: arr };

        try {
            for (var i = 0; i < this._list.length; i++) {
                var fullName    = this._list[i];
                var fun         = this.find(fullName);
                var nObj        = this._getPathObject(fullName);
                obj = { 
                    ns: nObj.ns, 
                    key: nObj.key, 
                    full: fullName, 
                    elem: fun
                };
                arr.push(obj);
            }

            if (typeof p_stringify === 'function') str = p_stringify(temp, { space: p_space } );
            else str = JSON.stringify(temp, null, p_space);
            return str;
            
        } catch (error) {
            throw new ExtendError(/EL03342/, error, [error]);
        }
        
    };

    /**
     * Parsing serialized strings and fetching them to the Namespace repository.  
     * @param {string} p_str serialized string
     * @param {function?} p_parse  JSON parser function
     */
    NamespaceManager.prototype.load = function(p_str, p_parse) {
        var arr = [];
        
        if (!_isString(p_str)) throw new ExtendError(/EL03343/, null, [typeof p_str]);
        
        try {
            if (typeof p_parse === 'function') arr = p_parse(p_str);
            else arr = JSON.parse(p_str, null);
            
            this.init();
            for (var i = 0; i < arr['list'].length; i++) {
                var o = arr['list'][i];
                var fun = o['elem'];
                this.add(o['full'], fun);
            }

        } catch (error) {
            throw new ExtendError(/EL03344/, error, [error.message]);
        }
    };

    return NamespaceManager;
}());

/**** meta-registry.js | MetaRegistry ****/
//==============================================================
// import Message from './message.js';    
       
var MetaRegistry = (function () {
    /**
     * 'MetaRegistry' is a class responsible for registering and managing meta objects.  
     * 
     * @constructs MetaRegistry
     * @static
     */
    function MetaRegistry() { 
    }

    MetaRegistry._NS = 'Meta';    // namespace

    // var define
    var _list = [];
    var namespace = new NamespaceManager();

    /**
     * List of meta objects.  
     * 
     * @member {any[]} MetaRegistry#_list
     * @readonly
     */
    Object.defineProperty(MetaRegistry, '_list', {
        get: function() { 
            var arr = [];
            for (var i = 0; i < _list.length; i++) arr.push(_list[i]);
            return arr;
        },
        configurable: false,
        enumerable: true,
    });

    /**
     * Total number of currently registered meta objects.  
     * 
     * @member {number} MetaRegistry#count
     * @readonly
     */
    Object.defineProperty(MetaRegistry, 'count', {
        get: function() { return _list.length; },
        configurable: false,
        enumerable: true,
    });        

    /**
     * Namespace manager for meta objects.  
     * 
     * @member {NamespaceManager} MetaRegistry#namespace
     * @readonly
     */
    Object.defineProperty(MetaRegistry, 'namespace', {
        get: function() { return namespace; },
        configurable: false,
        enumerable: true,
    });

    // local function
    function _isBuiltFunction(obj) {    // 내장함수 여부
        if (typeof obj === 'function' && (obj === Number || obj === String 
            || obj === Boolean || obj === Function
            || obj === Object || obj === Array
            || obj === RegExp || obj === Date 
            || obj === Symbol || obj === BigInt
        )) return true;
        return false;
    }

    function _isObject(obj) {    // 객체 여부
        if (typeof obj === 'object' && obj !== null) return true;
        return false;
    }

    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }
    
    function _getGuidList(oGuid, arr) {  //객체 배열 리턴
        arr = arr || [];
        if (MetaRegistry.isGuidObject(oGuid)) arr.push(oGuid);
        if (Array.isArray(oGuid)){
            for(var i = 0; i < oGuid.length; i++) {
                if (_isObject(oGuid[i])) _getGuidList(oGuid[i], arr);
            }
        } else if (_isObject(oGuid)) {
            for(var prop in oGuid) {
                if (_isObject(oGuid[prop])) _getGuidList(oGuid[prop], arr);
            }
        }
        return arr;
    }
    /**
     * Initializes registered meta objects and namespaces.  
     */
    MetaRegistry.init = function() {
        _list.length = 0;
        this.namespace.init();
    };

    /**
     * Register the meta object and register the creator in the namespace.  
     * An exception occurs if an object is already registered.   
     * Register if there is no creator in the Namespace.  
     * 
     * @param {MetaObject} p_meta Meta object to register
     */
    MetaRegistry.register = function(p_meta) {
        var _ns;
        var key;
        var type;
        // var fullName;

        if (!this.isMetaObject(p_meta)) throw new ExtendError(/EL03211/, null, [p_meta._type, p_meta._guid]);
        if (this.has(p_meta)) throw new ExtendError(/EL03212/, null, [p_meta._guid]);

        _ns         = p_meta['_ns'] || '';
        type        = p_meta['_type'];
        key         = type.name;
        // fullName    = p_meta['_ns'] && p_meta['_ns'].length > 0 ?  _ns +'.'+key : key;

        _list.push(p_meta);  // 객체 등록
        this.registerClass(type, _ns, key); // 클래스 등록
    };

    /**
     * Undoes the meta object in the registry.  
     * 
     * @param {MetaObject | string} p_meta Meta object or GUID string
     * @returns {boolean} successful removal ('true' or 'false')
     */
    MetaRegistry.release = function(p_meta) {
        var guid;

        if (typeof p_meta !== 'object' && typeof p_meta !== 'string') {
            throw new ExtendError(/EL03213/, null, [typeof p_meta]);
        }

        guid = typeof p_meta === 'string' ? p_meta : p_meta['_guid'];
        if (!_isString(guid)) return false;

        for(var i = 0; i < _list.length; i++) {
            if (_list[i]['_guid'] === guid) {
                _list.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * Check if the registry has a meta object.  
     * 
     * @param {object | string} p_oGuid  Object of type GUID or GUID string
     * @returns {boolean} Existence ('true' or 'false')
     */
    MetaRegistry.has = function(p_oGuid) {
        var guid = _isObject(p_oGuid) ? p_oGuid['_guid'] : p_oGuid;

        if (!_isString(guid)) return false;

        for(var i = 0; i < _list.length; i++) {
            if (_list[i]['_guid'] === guid) return true;
        }
        return false;
    };
    
    /**
     * Locate the meta object in the registry.  
     * 
     * @param {object | string} p_oGuid Object of type GUID or GUID string
     * @returns {MetaObject?} meta object found, 'undefined' if not found
     */
    MetaRegistry.find = function(p_oGuid) {
        var guid = _isObject(p_oGuid) ? p_oGuid['_guid'] : p_oGuid;
        
        if (!_isString(guid)) return undefined;
        
        for(var i = 0; i < _list.length; i++) {
            if (_list[i]['_guid'] === guid) return _list[i];
        }
        return undefined;
    };

    /**
     * Checks for meta objects.  
     * 
     * @param {object} p_target Target object
     * @returns {boolean} Whether it is a meta object ('true' or 'false')
     */
    MetaRegistry.isMetaObject = function(p_target) {
        if (!_isObject(p_target)) return false;
        if (_isString(p_target['_guid']) && typeof p_target['_type'] === 'function') return true;
        return false;
    };
    
    /**
     * Creates a meta object of a GUID object.  
     * 
     * @param {object} p_oGuid GUID type object
     * @param {object} [p_origin=p_oGuid] Initial GUID literal object
     * @returns {MetaObject} created meta object
     */
    MetaRegistry.createMetaObject = function(p_oGuid, p_origin) {
        var origin = p_origin ? p_origin : p_oGuid;
        var args = [null];
        var type;
        var ns;
        var fullName;
        var coClass;
        var params;
        
        if (!_isObject(p_oGuid)) throw new ExtendError(/EL03221/, null, [typeof p_oGuid]);
        if (!_isString(p_oGuid['_type'])) throw new ExtendError(/EL03222/, null, [typeof p_oGuid['_type']]);
        if (!_isObject(origin)) throw new ExtendError(/EL03223/, null, [typeof origin]);
        
        type        = p_oGuid['_type'];
        ns          = p_oGuid['_ns'] || '';
        fullName    =  ns !== '' ? [ns, type].join('.') : type;
        coClass     = this.getClass(fullName);
        
        if (typeof coClass !== 'function') throw new ExtendError(/EL03224/, null, [fullName, typeof coClass]);
        
        // params = coClass.hasOwnProperty('_PARAMS') ? coClass['_PARAMS'] : []; // arr
        params = Object.prototype.hasOwnProperty.call(coClass, '_PARAMS') ? coClass['_PARAMS'] : []; // arr
        for (var i = 0; i < params.length; i++) {
            var argName = params[i];
            var prop = p_oGuid[argName];
            var obj;
            obj = _isObject(prop) && prop['$ref'] ? this.findSetObject(prop['$ref'], origin) : prop;
            if (p_oGuid[argName]) args.push(obj);
        }
        return new (Function.prototype.bind.apply(coClass, args));
    };
    
    /**
     * Creates a reference object for a GUID object.  
     * 
     * @param {MetaObject} p_meta Meta object
     * @returns {object} created reference object ('{$ref: 'guid value'}')
     * @example
     * var meta = new MetaElement('m1');
     * obj.onwer = MetaRegistry.createReferObject(meta);
     * console.log(obj.onwer);          // { $ref : '5337877c-49d6-9add-f35a-7bd31d510d4f' }
     */
    MetaRegistry.createReferObject = function(p_meta) {
        if (!_isObject(p_meta)) throw new ExtendError(/EL03225/, null, [typeof p_meta]);
        if (!_isString(p_meta['_guid'])) throw new ExtendError(/EL03226/, null, [typeof p_meta['_guid']]);
        return { $ref: p_meta['_guid'] };
    };

    /**
     * Register the function in the Namespace and create a reference object.  
     * 
     * @param {function} p_target Function or constructor
     * @returns {object} created namespace reference object ('{$ns: 'Meta.MetaElement'}')
     * @example
     * var meta = new MetaElement('m1');
     * obj.onwer = MetaRegistry.createReferObject(meta);
     * console.log(obj);                // {onwer: {$ns: 'Meta.MetaElement'}}
     */
    MetaRegistry.createNsReferObject = function(p_target) {
        var fullName;
        var ns, key;

        if (typeof p_target !== 'function') throw new ExtendError(/EL03227/, null, [typeof p_target]);
        
        if (!this.findClass(p_target)) {
            ns  = p_target['_NS'] || '';
            key = p_target.name;
            this.registerClass(p_target, ns, key);
        }
        fullName = this.findClass(p_target);
        return { $ns: fullName };
    };

    /**
     * Set the GUID of the meta object in the GUID object.  
     * - oGuid.$set = meta._guid  
     * 
     * @param {object} p_oGuid GUID type object
     * @param {MetaObject} p_meta Meta object
     * @returns {object} set object
     * @example
     * var meta = new MetaElement('m1');    // meta.guid = '5337877c-49d6-9add-f35a-7bd31d510d4f'
     * var obj = { name: 'm2' };
     * MetaRegistry.setMetaObject(obj, meta);
     * console.log(obj);                    // {name: 'm2, $set: '5337877c-49d6-9add-f35a-7bd31d510d4f'}
     */
    MetaRegistry.setMetaObject = function(p_oGuid, p_meta) {
        if (!_isObject(p_oGuid)) throw new ExtendError(/EL03241/, null, [typeof p_oGuid]);
        if (!_isObject(p_meta)) throw new ExtendError(/EL03242/, null, [typeof p_meta]);
        if (!_isString(p_meta['_guid'])) throw new ExtendError(/EL03243/, null,[typeof p_meta['_guid']]);
        
        p_oGuid['$set'] = p_meta['_guid'];
        return p_oGuid;
    };
        
    /**
     * Validates the GUID object.  
     * 1. Check if the object has duplicate GUID values  
     * 2. Determine if an object has a '$ref' value  
     * 3. Determine if an object has a '$ns' value  
     * 4. Check the number of '_key' and '_elem' of objects   
     * 
     * @param {object} p_oGuid GUID object to be inspected
     * @returns {boolean} Inspection result ('true' or 'false')
     */
    MetaRegistry.validObject = function(p_oGuid) {
        var _this = this;
        var arrObj;

        if (!_isObject(p_oGuid)) throw new ExtendError(/EL03251/, null, [typeof p_oGuid]);
        
        arrObj = _getGuidList(p_oGuid);
        if (!$validUniqueGuid() || !$validReference(p_oGuid) || !$validCollection(p_oGuid)) return false;
        return true;

        // inner function
        function $findGuid(guid, arr) { // guid 조회
            for(var i = 0; i < arr.length; i++) {
                if (arr[i]['_guid'] === guid) return arr[i];
            }
            return undefined;
        }
        function $validReference(oGuid) { // 참조 검사
            if (oGuid['$ref'] && !$findGuid(oGuid['$ref'], arrObj)) return false;
            if (oGuid['$set'] && !$findGuid(oGuid['$set'], arrObj)) return false;
            if (oGuid['$ns'] && !_this.getClass(oGuid['$ns'])) return false;
    
            if (Array.isArray(oGuid)){
                for(var i = 0; i < oGuid.length; i++) {
                    if (_isObject(oGuid[i]) && !$validReference(oGuid[i])) return false;
                }
            } else {
                for(var prop in oGuid) {
                    if (_isObject(oGuid[prop]) && !$validReference(oGuid[prop])) return false;
                }
            }
            return true;
        }
        function $validCollection(oGuid) { // 컬렉션 검사
            if (Array.isArray(oGuid['_elem']) && Array.isArray(oGuid['_key'])) {
                if (oGuid['_elem'].length !== oGuid['_key'].length) return false;
            }
            if (Array.isArray(oGuid)){
                for(var i = 0; i < oGuid.length; i++) {
                    if (_isObject(oGuid[i]) && !$validCollection(oGuid[i])) return false;
                }
            } else {
                for(var prop in p_oGuid) {
                    if (_isObject(oGuid[prop]) && !$validCollection(oGuid[prop])) return false;
                }
            }
            return true;
        }
        function $validUniqueGuid() {    // guid 유일한 값인지 검사
            for (var i = 0; i < arrObj.length; i++) {
                for (var j = 0; j < arrObj.length; j++) {
                    if (arrObj[i]['_guid'] === arrObj[j]['_guid'] && i !== j) return false; // 중복
                }
            }
            return true;
        }
    };

    /**
     * Verify that the target object is a GUID object.  
     * @param {object} p_target Object to be checked
     * @returns {boolean} Guid object(`true` or `false`)
     */
    MetaRegistry.isGuidObject = function(p_target) {
        if (!_isObject(p_target)) return false;
        if (_isString(p_target['_guid']) && _isString(p_target['_type'])) return true;
        return false;
    };

    /**
     * Verify that the source object contains a GUID object.  
     * 
     * @param {string| object} p_oGuid GUID object or GUID string to check
     * @param {object | array<object>} p_origin  GUID literal object of query
     * @returns {boolean} whether to include ('true' or 'false')
     */
    MetaRegistry.hasGuidObject = function(p_oGuid, p_origin) {
        var guid = _isObject(p_oGuid) ? p_oGuid['_guid'] : p_oGuid;
        var arrOrigin = [];

        if (!_isString(guid)) throw new ExtendError(/EL03252/, null, [typeof guid]);

        if (Array.isArray(p_origin)) arrOrigin = p_origin;
        else arrOrigin.push(p_origin);

        for (var i = 0; i < arrOrigin.length; i++) {
            var origin = arrOrigin[i];
            var arrObj = _getGuidList(origin);
            if (!_isObject(origin)) throw new ExtendError(/EL03253/, null, [i, typeof guid]);
            for (var j = 0; j < arrObj.length; j++) {
                if (arrObj[j]._guid === guid) return true;
            }
        }
        return false;
    };

    /**
     * Verify that the GUID object contains a reference type element.  
     * Reference types are '$ref' and '$ns'.  
     * 
     * @param {object} p_oGuid GUID object to check
     * @returns {boolean} whether to include ('true' or 'false')
     */
    MetaRegistry.hasRefer = function(p_oGuid) {
        if (!_isObject(p_oGuid)) throw new ExtendError(/EL03254/, null, [typeof p_oGuid]);
        if (!this.isGuidObject(p_oGuid)) throw new ExtendError(/EL03255/, null, [p_oGuid['_type'], p_oGuid['_guid']]);

        return $hasRefer(p_oGuid);

        // inner function
        function $hasRefer(oGuid) {  // 참조 포함 여부
            if (Array.isArray(oGuid)){
                for(var i = 0; i < oGuid.length; i++) {
                    if (typeof oGuid[i] === 'object' && $hasRefer(oGuid[i])) return true;
                }
            } else {
                if (oGuid['$ref'] && _isString(oGuid['$ref'])) return true;
                if (oGuid['$ns'] && _isString(oGuid['$ns'])) return true;
                for(var prop in oGuid) {
                    if (_isObject(oGuid[prop]) && $hasRefer(oGuid[prop])) return true;
                }
            }
            return false;
        }
    };     

    /**
     * Retrieves the set GUID object from the repository.  
     * 
     * @param {string | object} p_oGuid GUID object or GUID string to look up
     * @param {object} p_origin GUID literal object with query target
     * @returns {MetaObject} meta-objects viewed
     */
    MetaRegistry.findSetObject = function(p_oGuid, p_origin) {
        var guid = _isObject(p_oGuid) ? p_oGuid['_guid'] : p_oGuid;
        var origin = p_origin;

        if (!_isString(guid)) throw new ExtendError(/EL03256/, null, [guid]);
        if (!_isObject(origin)) throw new ExtendError(/EL03257/, null, [typeof origin]);

        return $findObject(origin);
        
        // inner finction
        function $findObject(oGuid) { // 객체 조회
            var result;
            if (Array.isArray(oGuid)){
                for(var i = 0; i < oGuid.length; i++) {
                    if (typeof oGuid[i] === 'object') {
                        result = $findObject(oGuid[i]);
                        if(result) return result;
                    }
                }
            } else {
                if (oGuid['_guid'] && oGuid['_guid'] === guid) {
                    result = oGuid['$set'] ? MetaRegistry.find(oGuid['$set']) : undefined;
                    return result;
                }
                for(var prop in oGuid) {
                    if (typeof oGuid[prop] === 'object') {
                        result = $findObject(oGuid[prop]);
                        if(result) return result;
                    } 
                }
            }
            return result;
        }
    };

        

    /**
     * Converts the reference element value of a GUID object to a real object reference.  
     * To be converted: '$ns' is converted to '[Object Object]'.  
     * @param {object} p_oGuid GUID object to convert
     * @returns {object} converted meta object
     */
    MetaRegistry.transformRefer = function(p_oGuid) {
        var _this = this;
        var arrObj;
        var clone;

        if (!_isObject(p_oGuid)) throw new ExtendError(/EL03244/, null, [typeof p_oGuid]);
        
        arrObj = _getGuidList(p_oGuid);
        clone = Util.deepCopy(p_oGuid);
        $linkReference(clone, arrObj);
        return clone;

        // inner function
        function $linkReference(oGuid, arr, parentName) {    // 참조 연결
            parentName = parentName || '';
            if (Array.isArray(oGuid)){
                for(var i = 0; i < oGuid.length; i++) {
                    if (typeof oGuid[i] === 'object') $linkReference(oGuid[i], arr);
                }
            } else {
                for(var prop in oGuid) {
                    if (_isObject(oGuid[prop])) {
                        if (oGuid[prop]['$ns']) {
                            var ns = _this.getClass(oGuid[prop]['$ns']);
                            if (typeof ns !== 'function') throw new ExtendError(/EL03245/, null, [parentName, prop]);
                            oGuid[prop] = ns; // function 타입 연결
                        } else $linkReference(oGuid[prop], arr, parentName ? parentName +'.'+ prop : prop);
                    }
                }
            }
        }
    };
    
    /**
     * Register the creator or object in the specified namespace.  
     * It registers after performing duplicate checks, and does not store built-in functions (Array, String, Number, etc.).  
     * 
     * @param {function | object} p_target To be registered (class creator or object)
     * @param {string} p_ns Namespace name (separated by a dot '.')
     * @param {string} p_key Destination name (class name or function name), otherwise the last name of the namespace applies.
     */
    MetaRegistry.registerClass = function(p_target, p_ns, p_key) {
        var fullName;
        
        if (!(_isObject(p_target) || typeof p_target === 'function')) throw new ExtendError(/EL03231/, null, [typeof p_target]);
        if (p_ns && typeof p_ns !== 'string') throw new ExtendError(/EL03232/, null, [typeof p_ns]);
        if (p_key && !_isString(p_key)) throw new ExtendError(/EL03233/, null, [typeof p_key]);

        if (p_key) fullName = p_ns.length > 0 ? p_ns +'.'+ p_key : p_key;
        else fullName = p_ns;
        
        if (_isBuiltFunction(p_target)) return;    // 내장함수 제외
        if (typeof globalThis[fullName] === 'function') return;
        
        if (!this.namespace.find(fullName)) this.namespace.add(fullName, p_target);  // 중복 검사 후 등록
    };
    
    /**
     * Undoes the registered item in the Namespace.  
     * 
     * @param {string} p_fullName full path to the namespace ('string')
     * @returns {boolean} Successful deletion ('true' or 'false')
     */
    MetaRegistry.releaseClass = function(p_fullName) {
        if (!_isString(p_fullName)) throw new ExtendError(/EL03234/, null, [typeof p_fullName]);
        
        if (typeof globalThis[p_fullName] === 'function') return true; // 내장함수 & 전역 함수
        return this.namespace.del(p_fullName);
    };
    
    /**
     * Finds the specified constructor or object in the Namespace and returns the entire path.  
     * 
     * @param {function} p_target Creator or object
     * @returns {string?} Namespace Full path, 'undefined' if not found
     */
    MetaRegistry.findClass = function(p_target) {
        var fullName;

        if (typeof p_target !== 'function') throw new ExtendError(/EL03235/, null, [typeof p_target]);
        
        fullName = p_target.name;
        if (typeof globalThis[fullName] === 'function') return fullName;   // 내장함수 & 전역 함수
        return this.namespace.getPath(p_target);
    };
    
    /**
     * Returns a generator or object corresponding to the entire path specified in the Namespace.  
     * 
     * @param {string} p_fullName Full path to the Namespace
     * @returns {(object | function)?} corresponding object or creator, 'undefined' if not found
     */
    MetaRegistry.getClass = function(p_fullName) {
        if (!_isString(p_fullName)) throw new ExtendError(/EL03236/, null, [typeof p_fullName]);
        
        if (typeof globalThis[p_fullName] === 'function') return globalThis[p_fullName];  // 내장함수 & 전역 함수
        return this.namespace.find(p_fullName);
    };

    /**
     * Pars the serialized JSON string to convert it to 'MetaObject'.  
     * REVIEW: 필요성 재검토 필요  
     * @param {string} p_str serialized JSON string
     * @param {function?} p_parse JSON parser function (default is 'JSON.parse')
     * @returns {MetaObject} converted meta object
     */
    MetaRegistry.loadMetaObject = function(p_str, p_parse) {
        var obj = p_str;
        var oGuid;
        var meta;

        if (typeof p_str !== 'string') throw new ExtendError(/EL03246/, null, [typeof str]);

        obj = (typeof p_parse === 'function') ? p_parse(obj) : JSON.parse(obj, null);
        if (this.has(obj)) return this.find(obj['_guid']);  // 객체가 존재할 경우
        if (!this.isGuidObject(obj)) throw new ExtendError(/EL03247/, null, [obj['_type'], obj['_guid']]);

        oGuid = this.transformRefer(obj);
        meta = this.createMetaObject(oGuid);
        meta.setObject(oGuid);
        return meta;
    };
    return MetaRegistry;
}());

/**** meta-object.js | MetaObject ****/
//==============================================================
   
var MetaObject  = (function () {
    /**
     * Creates an instance of the MetaObject class.  
     * 
     * @constructs MetaObject
     * @implements {IObject}
     * @implements {IMarshal}
     */
    function MetaObject() {

        var _guid;
        var _ns;
        
        /**
         * Internal property that stores the unique identifier of the object.  
         * 
         * @readonly
         * @member {string} MetaObject#_guid 
         * @example
         * var obj = MetaObject();
         * console.log(obj._guid);      // '5337877c-49d6-9add-f35a-7bd31d510d4f' unique key code
         */
        Object.defineProperty(this, '_guid', {
            get: function() { 
                if (!_guid) _guid = Util.createGuid();
                return _guid;
            },
            set: function(nVal) { _guid = nVal; },
            configurable: false,
            enumerable: false
        });

        /**
         * Internal property that refers to the generator function of the object.  
         * 
         * @readonly
         * @member {function} MetaObject#_type 
         * @example
         * var obj = new MetaObject();
         * obj._type === MetaObject;        // true
         * console.log(typeof obj._type);   // 'function'
         */
        Object.defineProperty(this, '_type', {
            get: function() { 
                var proto = this.__proto__ || Object.getPrototypeOf(this);
                return proto.constructor;
            },
            configurable: false,
            enumerable: false
        });

        /**
         * Indicates the object name space.  
         * If '_type.NS' is not statically defined, use the parent's namespace as the default.  
         */
        Object.defineProperty(this, '_ns', {
            get: function() { 
                return _ns;
            },
            set: function(nVal) { 
                _ns = nVal;
            },
            configurable: false,
            enumerable: false
        });
        
        // 추상클래스 검사
        if (Object.prototype.hasOwnProperty.call(this._type, '_KIND')) {
        // if (this._type.hasOwnProperty('_KIND')) {
            var kind = this._type['_KIND'].toLowerCase();
            if (['abstract', 'interface', 'enum', 'function'].indexOf(kind) > -1) {
                throw new ExtendError(/EL03111/, null, [this._type.name, kind]);
            }
        }

        // _NS 선언이 없으면 부모의 것을 기본으로 사용!
        if (this._type && this._type._NS) this._ns = this._type._NS;
        MetaRegistry.register(this);

        Util.implements(MetaObject, this);          // strip:
    }
    MetaObject._UNION = [IObject, IMarshal];
    MetaObject._NS = 'Meta';
    MetaObject._PARAMS = [];

    // local function
    function _isObject(obj) {    // 객체 여부
        if (typeof obj === 'object' && obj !== null) return true;
        return false;
    }

    function _compare(p_obj1, p_obj2) { // 객체 비교
        if (p_obj1 === p_obj2) return true;
        else if (p_obj1 instanceof MetaObject && p_obj2 instanceof MetaObject) {
            var obj1 = p_obj1.getObject(2);    // _guid, $ref 제외 객체
            var obj2 = p_obj2.getObject(2);
            return Type.deepEqual(obj1, obj2);
        } else if (_isObject(p_obj1) && _isObject(p_obj2)) {
            return Type.deepEqual(p_obj1, p_obj2);
        } else return false;
    }

    /**
     * Compare the current object with the specified object.  
     * However, the '_guid' property is excluded from the comparison.  
     * 
     * @param {object} p_target To compare
     * @returns {boolean} If two objects are the same, 'true', or 'false'
     * @example
     * var meta1 = new MetaObject();
     * var meta2 = new MetaObject();
     * meta1.equal(meta2);      // true
     * meta2.equal(meat1);      // true
     * meta1 === meta2;         // false
     * 
     * var obj1 = {a: 1};
     * var obj2 = {a: 1};
     * this.equal(obj1, obj2);  // true
     */
    MetaObject.prototype.equal = function(p_target) {
        return _compare(this, p_target);
    };
    Object.defineProperty(MetaObject.prototype, 'equal', {
        enumerable: false
    });

    /**
     * Returns the creators of the current object and all the creators of the prototype chain to the array.  
     * 
     * @returns {array<function>} Array of generator functions (includes first defined constructors sequentially)
     * @example
     * var obj = new MetaObject();
     * var arr = obj.getTypes();
     * arr[0] === MetaObject;   // true
     * arr[1] === Object;       // true
     * console.log(arr.length); // 2
     * 
     * var elem = new MetaElement('e1');   // Inherited MetaObject 
     * var arr = elem.getTypes();
     * arr[0] === MetaElement;  // true
     * arr[1] === MetaObject;   // true
     * arr[2] === Object;       // true
     * console.log(arr.length); // 3
     */
    MetaObject.prototype.getTypes = function() {
        return parentFunction(this);

        // inner function
        function parentFunction(obj) {
            var list = [];
            var proto = obj.__proto__ || Object.getPrototypeOf(obj);
            if (proto) {
                list.push(proto.constructor);
                list = list.concat(parentFunction(proto));
            }
            return list;
        }
    };
    Object.defineProperty(MetaObject.prototype, 'getTypes', {
        enumerable: false
    });

    /**
     * Verify that the object is an instance of a particular class.  
     * You can also examine the defined interface type (including '_UNION').  
     * 
     * @param {Function | string} p_target Class constructor function or class name (string)
     * @returns {boolean} Whether there is an instance of the specified class ('true' or 'false')
     * @example
     * var obj = new MetaObject();
     * obj.instanceOf('MetaObject');    // true
     * obj.instanceOf('Object');        // true
     * obj.instanceOf(MetaObject);      // true
     * obj.instanceOf(Object);          // true
     * obj.instanceOf(String);          // false
     * 
     * var elem = new MetaElement('e1');// Inherited MetaObject 
     * obj.instanceOf('MetaElement');   // true
     * obj.instanceOf('MetaObject');    // true
     * obj.instanceOf('Object');        // true
     * obj.instanceOf(MetaElement);     // true
     * obj.instanceOf(MetaObject);      // true
     * obj.instanceOf(Object);          // true
     * obj.instanceOf(String);          // false
     */
    MetaObject.prototype.instanceOf = function(p_target) {
        var _this = this;
        var unionTypes = this._interface || this._type._UNION;
        // var unionTypes = this._type['_UNION'] || [];
        // var unionTypes = this._interface || [];
        // var thisTypes = this.getTypes();

        if (typeof p_target === 'string') return $$findFunctionName(p_target);
        if (typeof p_target === 'function') return $findFunction(p_target);
        return false;

        // inner function
        function $findFunction(fun) {
            var types = _this.getTypes();
            for (var i = 0; i < types.length; i++) {
                if (fun === types[i]) return true;
            }
            
            for (var k = 0; k < unionTypes.length; k++) {
                if (fun ===  unionTypes[k]) return true;
            }
            return false;
        }
        function $$findFunctionName(funName) {
            var types = _this.getTypes();
            for (var i = 0; i < types.length; i++) {
                if (funName === types[i].name) return true;
            }
            for (var k = 0; k < unionTypes.length; k++) {
                if (funName === unionTypes[k].name) return true;
            }
            return false;
        }
    };
    Object.defineProperty(MetaObject.prototype, 'instanceOf', {
        enumerable: false
    });

    /**
     * Returns the object as an object literal of type GUID.  
     * 
     * @param {number} [p_vOpt=0] Import mode  
     * mode=0 : reference structure (_guid:Yes, $ref:Yes)  
     * mode=1: Redundant structure (_guid:Yes, $ref:Yes)  
     * mode=2 : non-coordinated structure (_guid: No, $ref: No)  
     * @param {object | array<object>} [p_owned={}] Parent object that contains (owns) the current object
     * @returns {object} Guid type object literal
     * @example
     * a.getObject(2) == b.getObject(2)   
     */
    MetaObject.prototype.getObject = function(p_vOpt) {
        var vOpt = p_vOpt || 0;
        var obj = {};
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (vOpt < 2 && vOpt > -1) obj['_guid'] = this._guid;
        obj['_type'] = this._type._NS ? this._type._NS +'.'+ this._type.name : this._type.name;
        return obj;                        
    };
    Object.defineProperty(MetaObject.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * Set up a GUID type object literal by converting it to an instance object.  
     * 
     * @param {object} p_oGuid object literal of type of GUID to set
     * @param {object} [p_origin=p_oGuid] Initial GUID literal object referenced during conversion
     */
    MetaObject.prototype.setObject  = function(p_oGuid, p_origin) {
        var origin = p_origin ? p_origin : p_oGuid;
        var fullName = this._type._NS ? this._type._NS +'.'+ this._type.name : this._type.name;

        if (!_isObject(p_oGuid)) throw new ExtendError(/EL03112/, null, [typeof p_oGuid]);
        if (p_oGuid['_type'] !== fullName) throw new ExtendError(/EL03113/, null, [p_oGuid['_type'], fullName]);
        
        if (MetaRegistry.isGuidObject(origin)) {
            if (!origin['__TRANSFORM_REFER']) {
                origin = MetaRegistry.transformRefer(origin);
                origin['__TRANSFORM_REFER'] = true;
            }
        } else throw new ExtendError(/EL03114/, null, [p_origin._type, p_origin._guid]);
        
        MetaRegistry.setMetaObject(p_oGuid, this); // $set attach
    };
    Object.defineProperty(MetaObject.prototype, 'setObject', {
        enumerable: false
    });

    return MetaObject;

}());

/**** meta-element.js | MetaElement ****/
//==============================================================
   
var MetaElement  = (function (_super) {

    /**
     * Creates an instance of the MetaElement class.  
     * 
     * @constructs MetaElement
     * @extends MetaObject
     * @implements {IElement}
     * @param {string} p_name Name of the element
     */
    function MetaElement(p_name) {
        _super.call(this);
        
        var _name;

        /**
         * Internal property that stores the name of the element.  
         * 
         * @readonly
         * @member {string} MetaElement#_name
         */
        Object.defineProperty(this, '_name', {
            get: function() { return _name; },
            set: function(nVal) {
                if (typeof nVal !== 'string') throw new ExtendError(/EL03121/, null, [typeof val]);
                if (nVal.length === 0) throw new ExtendError(/EL03122/, null, []);
                _name = nVal;
            },
            configurable: false,
            enumerable: false
        });

        this._name = p_name;

        Util.implements(MetaElement, this);     // strip:
    }
    Util.inherits(MetaElement, _super);
    
    MetaElement._UNION = [IElement];
    MetaElement._NS = 'Meta';           // namespace
    MetaElement._PARAMS = ['name'];     // creator parameter
    
    /**
     * Returns the object as an object literal of type GUID.  
     * 
     * @param {number} [p_vOpt=0] Import mode  
     * mode=0 : reference structure (_guid:Yes, $ref:Yes)  
     * mode=1: Redundant structure (_guid:Yes, $ref:Yes)  
     * mode=2 : non-coordinated structure (_guid: No, $ref: No)  
     * @param {object | array<object>} [p_owned={}] Parent object that contains (owns) the current object  
     * @returns {object}  Guid type object literal
     * @example
     * a.getObject(2) == b.getObject(2)   
     */
    MetaElement.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        obj['name'] = this._name;
        return obj;
    };
    Object.defineProperty(MetaElement.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * Set up a GUID type object literal by converting it to an instance object.  
     * 
     * @param {object} p_oGuid object literal of the type of GUID to be set
     * @param {object} [p_origin=p_oGuid] Initial GUID literal object referenced during conversion
     */
    MetaElement.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        // var origin = p_origin ? p_origin : p_oGuid;
        this._name = p_oGuid['name'];
        // this.__SET$_name(p_oGuid['name'], this);
    };
    Object.defineProperty(MetaElement.prototype, 'setObject', {
        enumerable: false
    });

    /**
     * Creates a replica of the current object.  
     * 
     * @returns {MetaElement} Replicated Objects
     */
    MetaElement.prototype.clone  = function() {
        var clone = new MetaElement(this._name);
        return clone;
    };
    Object.defineProperty(MetaElement.prototype, 'clone', {
        enumerable: false
    });

    return MetaElement;

}(MetaObject));

/**** base-collection.js | BaseCollection ****/
//==============================================================

var BaseCollection  = (function (_super) {
    /**
    * The creator that creates the collection.  
    * This is an abstract class, and you must create an instance through inheritance.  
    * 
    * @abstract
    * @extends MetaObject
    * @constructs BaseCollection
    * @implements {ICollection}
    * @implements {IList}
    * @param {object} [p_owner] Objects that own this collection
    */
    function BaseCollection(p_owner) { 
        _super.call(this);
        
        // private variable
        var $KEYWORD = [];
        var $event = new EventEmitter();
        var $elements = [];
        var $descriptors = [];
        
        // protected variable
        var _owner ;
        var _elemTypes  = [];

        /** 
         * List of strings used as reserved words in the collection.  
         * 
         * @private
         * @member {array<string>}  BaseCollection#$KEYWORD
         */
        Object.defineProperty(this, '$KEYWORD', {
            get: function() { return $KEYWORD; },
            set: function(newVal) { $KEYWORD = $KEYWORD.concat(newVal); },  // REVIEW: 예약어 중복
            configurable: false,
            enumerable: false,
        });

        /** 
         * Object that handles events. Used to register and generate various events in the collection.
         * 
         * @private
         * @member {EventEmitter} BaseCollection#$event  
         */
        Object.defineProperty(this, '$event', {
            get: function() { return $event; },
            configurable: false,
            enumerable: false,
        });

        /**
         * An arrangement that stores elements of a collection.
         * 
         * @private
         * @member {string} BaseCollection#$elements
         */
        Object.defineProperty(this, '$elements', {
            get: function() { return $elements; },
            set: function(nVal) { $elements = nVal; },
            configurable: false,
            enumerable: false,
        });

        /**
         * A descriptor array that defines the getter and setter methods for each collection element.  
         * 
         * @private
         * @member {string} BaseCollection#$descriptors
         */
        Object.defineProperty(this, '$descriptors', {
            get: function() { return $descriptors; },
            set: function(nVal) { $descriptors = nVal; },
            configurable: false,
            enumerable: false,
        });



        /** 
         * Owned object of the collection.  
         * 
         * @protected 
         * @member {object} BaseCollection#_owner  
         */
        Object.defineProperty(this, '_owner', {   
            get: function() { return _owner; },
            set: function(val) { _owner = val; },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Defines the type constraints for the collection element.  
         * 
         * @protected 
         * @member {array<any>}  BaseCollection#_elemTypes  
         */
        Object.defineProperty(this, '_elemTypes', {
            get: function() { return _elemTypes; },
            set: function(val) {
                var arrType = Array.isArray(val) ? val : Array.prototype.slice.call(arguments, 0);
                var reg = /^_[a-zA-Z]+_/;
                var arr1 = arrType.length > 0 && typeof arrType[0] === 'string' ? arrType[0] : '';
                
                // var result;
                if (arrType.length > 0  && reg.exec(arr1) === null) {
                    arrType = ['_req_'].concat(arrType);
                }
                   
                // result = reg.exec(val);
                // if (result !== null) return result[0].toUpperCase();
                _elemTypes = arrType;
            },
            configurable: false,
            enumerable: false,
        });

        /**
         * An array that stores a list of elements in a collection.  
         * 
         * @protected 
         * @readonly
         * @member {Array}  BaseCollection#_list  
         */
        Object.defineProperty(this, '_list', {
            get: function() {
                var arr = [];
                for (var i = 0; i < $elements.length; i++) arr.push(this.$elements[i]);
                return arr;
            },
            configurable: false,
            enumerable: false,
        });

        /**
         * Returns the number of elements in the collection.  
         * 
         * @readonly
         * @member {number} BaseCollection#count 
         */
        Object.defineProperty(this, 'count', {
            get: function() { return this.$elements.length; },
            enumerable: false,
            configurable: false
        });

        /**
         * Returns the number of elements in the collection.  
         * @readonly
         * @member {number} BaseCollection#length 
         */
        Object.defineProperty(this, 'length', {
            get: function() { return this.$elements.length; },
            enumerable: false,
            configurable: false
        });


        /**
         * Event handler called before adding an element to a collection.  
         * 
         * @event BaseCollection#onAdd
         * @param {function}    p_callback
         * @param {any}         p_callback.p_elem Elements to add
         * @param {number}      p_callback.p_idx Index of the element to be added
         * @param {this}        p_callback.p_this Current collection objects
         */
        Object.defineProperty(this, 'onAdd', {
            set: function(fun) { this.$event.on('add', fun); },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Event handler that is called after an element is added.  
         * 
         * @event BaseCollection#onAdded
         * @param {function}    p_callback
         * @param {any}         p_callback.p_elem Added elements
         * @param {number}      p_callback.p_idx Index of added element
         * @param {this}        p_callback.p_this Current collection objects
         */
        Object.defineProperty(this, 'onAdded', {
            set: function(fun) { this.$event.on('added', fun); },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Event handler called before removing an element.  
         * 
         * @event BaseCollection#onRemove
         * @param {function}    p_callback
         * @param {any}         p_callback.p_elem Elements to be removed
         * @param {number}      p_callback.p_idx Index of the element to be removed
         * @param {this}        p_callback.p_this Current collection objects
         */
        Object.defineProperty(this, 'onRemove', {
            set: function(fun) { this.$event.on('remove', fun); },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Event handler that is called after the element is removed.  
         * 
         * @event BaseCollection#onRemoved
         * @param {function}    p_callback
         * @param {any}         p_callback.p_elem Removed elements
         * @param {number}      p_callback.p_idx Index of removed element
         * @param {this}        p_callback.p_this Current collection objects
         */
        Object.defineProperty(this, 'onRemoved', {
            set: function(fun) { this.$event.on('removed', fun); },
            configurable: false,
            enumerable: false,
        });

        /** 
        * Event handler called before deleting all elements.  
        * 
        * @event BaseCollection#onClear
        * @param {function}    p_callback
        * @param {this}        p_callback.p_this Current collection objects
        */
        Object.defineProperty(this, 'onClear', {
            set: function(fun) { this.$event.on('clear', fun); },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Event handler that is called after all elements are deleted.  
         * 
         * @event BaseCollection#onCleared
         * @param {function}    p_callback
         * @param {this}        p_callback.p_this Current collection objects
         */
        Object.defineProperty(this, 'onCleared', {
            set: function(fun) { this.$event.on('cleared', fun); },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Event handler called before the element changes.  
         * 
         * @event BaseCollection#onChanging 
         * @param {function}    p_callback
         * @param {number}      p_callback.p_nextValue New value to be changed
         * @param {any}         p_callback.prevValue Existing value
         * @param {any}         p_callback.index Index of the element to be changed
         * @param {this}        p_callback.p_this Current collection objects
         */
        Object.defineProperty(this, 'onChanging', {
            set: function(fun) { this.$event.on('changing', fun); },
            configurable: false,
            enumerable: false,
        });

        /** 
         * Event handler that is called after an element changes.  
         * 
         * @event BaseCollection#onChanged 
         * @param {function}    p_callback
         * @param {any}         p_callback.p_nextValue New value changed
         * @param {any}         p_callback.p_prevValue Existing value
         * @param {number}      p_callback.p_index Index of changed element
         * @param {this}        p_callback.p_this Current collection objects
         */
        Object.defineProperty(this, 'onChanged', {
            set: function(fun) { this.$event.on('changed', fun); },
            configurable: false,
            enumerable: false,
        });

        // object settging
        this._owner = p_owner || null;

        // 예약어 등록
        this.$KEYWORD = ['$event', '_owner', '$elements', '$descriptors', '_elemTypes', '_list', 'count', 'length', '$KEYWORD'];
        this.$KEYWORD = ['onAdd', 'onAdded', 'onRemove', 'onRemoved', 'onClear', 'onCleared', 'onChanging', 'onChanged'];
        this.$KEYWORD = ['_onAdd', '_onAdded', '_onRemove', '_onRemoved', '_onClear', '_onCleared', '_onChanging', '_onChanged'];
        this.$KEYWORD = ['_getPropDescriptor', 'getObject', 'setObject', '_guid', '_type'];
        this.$KEYWORD = ['_remove', 'remove', 'removeAt', 'contains', 'indexOf', 'add', 'clear'];

        Util.implements(BaseCollection, this);          // strip:
    }
    Util.inherits(BaseCollection, _super);
    
    BaseCollection._UNION = [ICollection, IList];
    BaseCollection._NS = 'Collection';
    BaseCollection._PARAMS = ['_owner'];
    BaseCollection._KIND = 'abstract';
    
    /**
     * Internal method that runs before adding an element.  
     * 
     * @param {any} p_elem .Elements to be added
     * @param {number} p_idx Where the element will be added
     * @listens BaseCollection#onAdd
     */
    BaseCollection.prototype._onAdd = function(p_elem, p_idx) {
        return this.$event.emit('add', p_elem, p_idx, this); 
    };
    Object.defineProperty(BaseCollection.prototype, '_onAdd', {
        enumerable: false
    });

    /**
     * Internal method that runs after an element is added.  
     * @param {any} p_elem Added elements
     * @param {number} p_idx Location where the element was added
     * @listens BaseCollection#onAdded
     */
    BaseCollection.prototype._onAdded = function(p_elem, p_idx) {
        return this.$event.emit('added', p_elem, p_idx, this); 
    };
    Object.defineProperty(BaseCollection.prototype, '_onAdded', {
        enumerable: false
    });

    /**
     * Internal method that runs before removing an element.  
     * 
     * @param {any} p_elem Elements to be removed
     * @param {number} p_idx Where the element will be removed
     * @listens BaseCollection#onRemove
     */
    BaseCollection.prototype._onRemove = function(p_elem, p_idx) {
        return this.$event.emit('remove', p_elem, p_idx, this);
    };
    Object.defineProperty(BaseCollection.prototype, '_onRemove', {
        enumerable: false
    });

    /**
     * Internal method that runs after the element is removed.  
     * 
     * @param {any} p_elem Removed elements
     * @param {number} p_idx Where the element was removed
     * @listens BaseCollection#onRemoved
     */
    BaseCollection.prototype._onRemoved = function(p_elem, p_idx) {
        return this.$event.emit('removed', p_elem, p_idx, this);
    };
    Object.defineProperty(BaseCollection.prototype, '_onRemoved', {
        enumerable: false
    });

    /** 
     * Internal method that runs before deleting all elements.
     * 
     * @listens BaseCollection#onClear
     */
    BaseCollection.prototype._onClear = function() {
        return this.$event.emit('clear', this); 
    };
    Object.defineProperty(BaseCollection.prototype, '_onClear', {
        enumerable: false
    });

    /** 
     * Internal method that runs after all elements are deleted.  
     * 
     * @listens BaseCollection#onCleared
     */
    BaseCollection.prototype._onCleared = function() {
        return this.$event.emit('cleared', this); 
    };
    Object.defineProperty(BaseCollection.prototype, '_onCleared', {
        enumerable: false
    });

    /** 
     * Internal method that runs before the element changes.
     * 
     * @param {any} p_nVal New value to be changed
     * @param {any} p_oVal Existing value
     * @param {number} p_idx Location of the element to be changed
     * @listens BaseCollection#onChanging
     */
    BaseCollection.prototype._onChanging = function(p_nVal, p_oVal, p_idx) {
        return this.$event.emit('changing', p_nVal, p_oVal, p_idx, this);
    };
    Object.defineProperty(BaseCollection.prototype, '_onChanging', {
        enumerable: false
    });

    /** 
     * Internal method that runs after the element changes.  
     * 
     * @param {any} p_nVal New value changed
     * @param {any} p_oVal Existing value
     * @param {number} p_idx Location of changed element
     * @listens BaseCollection#onChanged
     */        
    BaseCollection.prototype._onChanged = function(p_nVal, p_oVal, p_idx) {
        return this.$event.emit('changed', p_nVal, p_oVal, p_idx, this);
    };
    Object.defineProperty(BaseCollection.prototype, '_onChanged', {
        enumerable: false
    });

    /**
     * Internal method to set the attribute descriptor for a particular index.  
     * 
     * @protected
     * @param {number} p_idx Where to specify properties
     * @param {boolean} p_enum whether the property is enumerable
     */
    BaseCollection.prototype._getPropDescriptor = function(p_idx, p_enum) {
        if (typeof p_enum !== 'boolean') p_enum = true;
        return {
            get: function() { return this.$elements[p_idx]; },
            set: function(nVal) {
                var oVal = this.$elements[p_idx];
                if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], nVal);
                this._onChanging(nVal, oVal, p_idx);  // before event
                this.$elements[p_idx] = nVal;
                this._onChanged(nVal, oVal, p_idx);   // after event
            },
            configurable: true,
            enumerable: p_enum,
        };
    };
    Object.defineProperty(BaseCollection.prototype, '_getPropDescriptor', {
        enumerable: false
    });

    /** 
     * Internal method to remove elements from the collection.  
     * 
     * @abstract 
     */
    BaseCollection.prototype._remove  = function() {
        throw new ExtendError(/EL04111/, null, []);
    };
    Object.defineProperty(BaseCollection.prototype, '_remove', {
        enumerable: false
    });

    /**
     * Returns the object as an object literal of type GUID.  
     * 
     * @param {number} [p_vOpt=0] Import mode  
     * mode=0 : reference structure(_guid:Yes, $ref:Yes)  
     * mode=1 : Redundant structure(_guid:Yes, $ref:Yes)  
     * mode=2 : non-coordinated structure(_guid:No,  $ref:No)   
     * @param {object | array<object>} [p_owned={}] Parent object that contains (owns) the current object
     * @returns {object}  Guid type object literal
     * @example
     * a.getObject(2) == b.getObject(2)   
     */
    BaseCollection.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
        var _elems = [];
        
        if (!Type.deepEqual(this.$event['$storage'], {})) {
            obj['$storage'] = this.$event.$storage;
        }
        if (vOpt < 2 && vOpt > -1 && this._owner) {
            obj['_owner'] = MetaRegistry.createReferObject(this._owner);
        }
        for (var i = 0; i < this._elemTypes.length; i++) {
            var elem = this._elemTypes[i];
            if (typeof elem === 'function') _elems.push(MetaRegistry.createNsReferObject(elem));
            else _elems.push(elem);
        }
        obj['_elemTypes'] = _elems;
        return obj;                        
    };
    Object.defineProperty(BaseCollection.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * Set up a GUID type object literal by converting it to an instance object.
     * 
     * @param {object} p_oGuid Object literal of type of GUID to set
     * @param {object} [p_origin=p_oGuid] Initial GUID literal object referenced during conversion
     */
    BaseCollection.prototype.setObject = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var owner;
        var origin = p_origin ? p_origin : p_oGuid;
        
        this.clear();
        if (p_oGuid['$storage']) {
            this.$event.$storage = p_oGuid['$storage'];
        }
        if (p_oGuid['_owner']) {
            owner = MetaRegistry.findSetObject(p_oGuid['_owner']['$ref'], origin);
            if (!owner) throw new ExtendError(/EL04112/, null, [p_oGuid['_owner']['$ref']]);    // Branch:
            this._owner = owner;            
        }
        if (Array.isArray(p_oGuid['_elemTypes']) && p_oGuid['_elemTypes'].length > 0){
            this._elemTypes = p_oGuid['_elemTypes'];
        }
    };
    Object.defineProperty(BaseCollection.prototype, 'setObject', {
        enumerable: false
    });

    /**
     * Remove the element from the collection.  
     * 
     * @param {any} p_elem Elements to be removed
     * @returns {number} Index of removed element. If element does not exist, return -1
     */
    BaseCollection.prototype.remove = function(p_elem) {
        var idx = this.$elements.indexOf(p_elem);

        if (idx >= 0 && this.removeAt(idx)) return idx;
        return -1;
    };
    Object.defineProperty(BaseCollection.prototype, 'remove', {
        enumerable: false
    });
    
    /**
     * Remove the element in the specified location.
     * 
     * @param {number} p_pos Where to remove
     * @returns {boolean} Element Removal Successful
     */
    BaseCollection.prototype.removeAt = function(p_pos) {
        var elem;
        
        if (typeof p_pos !== 'number') throw new ExtendError(/EL04113/, null, [typeof p_pos]);
        if (p_pos < 0 ) return false;
        
        elem = this.$elements[p_pos];
        if (this.$elements.length > p_pos) {
            // this._onRemove(p_pos, elem);
            if (this._onRemove(elem, p_pos) === false) return false;

            if (!this._remove(p_pos)) return false;
            this._onRemoved(elem, p_pos);
            return true;
        }
        return false;
    };
    Object.defineProperty(BaseCollection.prototype, 'removeAt', {
        enumerable: false
    });

    /**
     * Verify that a particular element exists in the collection.  
     * 
     * @param {any} p_elem Factors to check
     * @returns {boolean} Element Existence
     */
    BaseCollection.prototype.contains = function(p_elem) {
        return this.$elements.indexOf(p_elem) > -1;
    };
    Object.defineProperty(BaseCollection.prototype, 'contains', {
        enumerable: false
    });

    /**
     * Returns the index of an element.  
     * 
     * @param {any} p_elem Elements to search for
     * @returns {number} Index of element, return -1 if element is missing
     */
    BaseCollection.prototype.indexOf = function(p_elem) {
        return this.$elements.indexOf(p_elem);
    };
    Object.defineProperty(BaseCollection.prototype, 'indexOf', {
        enumerable: false
    });

    /** 
     * Adds an element to the collection.
     * 
     * @abstract 
     */
    BaseCollection.prototype.add  = function() {
        throw new ExtendError(/EL04114/, null, []);
    };
    Object.defineProperty(BaseCollection.prototype, 'add', {
        enumerable: false
    });
    
    /**
     * Initialize the collection.  
     * 
     * @abstract 
     */
    BaseCollection.prototype.clear  = function() {
        throw new ExtendError(/EL04115/, null, []);
    };
    Object.defineProperty(BaseCollection.prototype, 'clear', {
        enumerable: false
    });

    return BaseCollection;
    
}(MetaObject));

/**** collection-array.js | ArrayCollection ****/
//==============================================================

var ArrayCollection  = (function (_super) {
    /**
     * Creates an instance of an ArrayCollection class.  
     * 
     * @constructs ArrayCollection
     * @implements {IArrayCollection}
     * @extends BaseCollection
     * @param {object} [p_owner] Objects that own this collection
     */
    function ArrayCollection(p_owner) {
        _super.call(this, p_owner);

        this.$KEYWORD = ['insertAt'];

        Util.implements(ArrayCollection, this);     // strip:
    }
    Util.inherits(ArrayCollection, _super);
    
    ArrayCollection._UNION = [IArrayCollection];
    ArrayCollection._NS = 'Collection';     // namespace
    ArrayCollection._PARAMS = ['_owner'];   // creator parameter

    // local function
    function _isObject(obj) {    // 객체 여부
        if (typeof obj === 'object' && obj !== null) return true;
        return false;
    }
    
    /**
     * Internal method to remove the specified element from the collection.  
     * 
     * @protected
     * @param {number} p_pos Index of the element to be removed
     * @returns {boolean} Success or failure
     */
    ArrayCollection.prototype._remove = function(p_pos) {
        var count = this.count - 1;   // [idx] 포인트 이동
        
        this.$elements.splice(p_pos, 1);
        this.$descriptors.splice(p_pos, 1);
        
        if (p_pos < count) {
            for (var i = p_pos; i < count; i++) {   // 참조 변경(이동)
                var desc = this.$descriptors[i] ? this.$descriptors[i] : this._getPropDescriptor(i);
                Object.defineProperty(this, [i], desc);
            }
            delete this[count];     // 마지막 idx 삭제
        } else {
            delete this[p_pos];     // idx 삭제 (끝일 경우)
        }
        return true;
    };
    Object.defineProperty(ArrayCollection.prototype, '_remove', {
        enumerable: false
    });

    /**
     * Returns the object as an object literal of type GUID.  
     * 
     * @param {number} [p_vOpt=0] Import mode  
     * mode=0 : reference structure (_guid:Yes, $ref:Yes)  
     * mode=1: Redundant structure (_guid:Yes, $ref:Yes)  
     * mode=2 : non-coordinated structure (_guid: No, $ref: No)  
     * @param {object | array<object>} [p_owned={}] Parent object that contains (owns) the current object
     * @returns {object}  Guid type object literal 
     * @example
     * a.getObject(2) == b.getObject(2)   
     */
    ArrayCollection.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (this.$descriptors.length > 0) {
            obj['_desc'] = [];
            for (var i = 0; i < this.$descriptors.length; i++) {
                obj['_desc'].push(this.$descriptors[i]);
            }
        }
        obj['_elem'] = [];
        for (var j = 0; j < this.$elements.length; j++) {
            var elem = this.$elements[j];
            if (elem instanceof MetaObject) {
                if (MetaRegistry.hasGuidObject(elem, owned)) {
                    obj['_elem'].push(MetaRegistry.createReferObject(elem));
                } else obj['_elem'].push(elem.getObject(vOpt, owned));
            } else obj['_elem'].push(elem);
        }
        return obj;                        
    };
    Object.defineProperty(ArrayCollection.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * Set up a GUID type object literal by converting it to an instance object.   
     * 
     * @param {object} p_oGuid object literal of the type of GUID to be set
     * @param {object} [p_origin=p_oGuid] Initial GUID literal object referenced during conversion
     */
    ArrayCollection.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        var origin = p_origin ? p_origin : p_oGuid;

        if (Array.isArray(p_oGuid['_desc']) && p_oGuid['_desc'].length > 0) {
            for (var i = 0; i < p_oGuid['_desc'].length; i++) {
                this.$descriptors.push(p_oGuid['_desc'][i]);
            }
        }
        for(var j = 0; j < p_oGuid['_elem'].length; j++) {
            Object.defineProperty(this, [j], this._getPropDescriptor(j));
        }

        for(var k = 0; k < p_oGuid['_elem'].length; k++) {
            var elem = p_oGuid['_elem'][k];
            if (MetaRegistry.isGuidObject(elem)) {
                var obj = MetaRegistry.createMetaObject(elem, origin);
                obj.setObject(elem, origin);
                this.$elements.push(obj);
                
            } else if (elem['$ref']) {
                var meta = MetaRegistry.findSetObject(elem['$ref'], origin);
                if (!meta) throw new ExtendError(/EL04211/, null, [k, elem['$ref']]);
                this.$elements.push(meta);  
            
            } else this.$elements.push(elem);
        }
    };        
    Object.defineProperty(ArrayCollection.prototype, 'setObject', {
        enumerable: false
    });

    /**
     * Adds an element to the collection.  
     * 
     * @param {any} p_elem Elements to add
     * @param {object} [p_desc] Property descriptor object for element
     * @returns {number} Location of the added element
     */
    ArrayCollection.prototype.add = function(p_elem, p_desc) {
        var pos = this.count;
        this.insertAt(pos, p_elem, p_desc);
        return pos;
    };
    Object.defineProperty(ArrayCollection.prototype, 'add', {
        enumerable: false
    });

    /**
     * Initialize the collection.  
     * Empty the $elements and $descriptors arrays upon initialization.  
     * 
     * @returns {boolean} Additional success
     */
    ArrayCollection.prototype.clear = function() {
        try {
            if (this._onClear() === false) return false;

            for (var i = 0; i < this.count; i++) delete this[i];
            this.$elements = [];
            this.$descriptors = [];
            
            this._onCleared();    // event
            return true;

        } catch (error) {
            console.error(error);
            return false;
        }
    };
    Object.defineProperty(ArrayCollection.prototype, 'clear', {
        enumerable: false
    });

    /**
     * Adds an element to the specified location.  
     * 
     * @param {number} p_pos Where to add
     * @param {any} p_elem Elements to add
     * @param {object} [p_desc] Property descriptor object for element
     * @returns {boolean} Additional success
     */
    ArrayCollection.prototype.insertAt = function(p_pos, p_elem, p_desc) {
        try {
            var index   = this.count;

            if (typeof p_pos !== 'number') throw new ExtendError(/EL04212/, null, [typeof p_pos]);
            if (index < p_pos) throw new ExtendError(/EL04213/, null, [p_pos, index]);
            if (p_pos < 0) throw new ExtendError(/EL04214/, null, [p_pos]);
            if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], p_elem);
            if (_isObject(p_desc) && p_desc.configurable === false) {
                console.warn(Message.get('WS011', ['configurable = false', 'element']));
                // Message.warn('WS011', ['configurable = false', 'element']); 
            }
            if (_isObject(p_desc) && p_desc.writable === false ) {
                console.warn(Message.get('WS011', ['writable = false', 'element']));
                // Message.warn('WS011', ['writable = false', 'element']);
            }

            if (this._onAdd(p_elem, p_pos) === false) return false;

            // data process
            this.$elements.splice(p_pos, 0, p_elem);            
            this.$descriptors.splice(p_pos, 0, p_desc);
            // property define
            if (_isObject(p_desc)) {
                Object.defineProperty(this, [p_pos], p_desc);
            } else {
                Object.defineProperty(this, [p_pos], this._getPropDescriptor(p_pos));
            }
            // reindexing
            for (var i = p_pos + 1; i < this.count; i++) {
                var desc = this.$descriptors[i] ? this.$descriptors[i] : this._getPropDescriptor(i);
                Object.defineProperty(this, [i], desc);
            }
            this._onAdded(p_elem, p_pos);
            
            return true;

        } catch (error) {
            throw new ExtendError(/EL04215/, error, [p_pos, p_elem]);
        }
    };
    Object.defineProperty(ArrayCollection.prototype, 'insertAt', {
        enumerable: false
    });

    /**
     * Returns the result of executing the function provided to all elements to the new array.  
     * 
     * @param {Function} callback callback function to convert, (elem: T, index: number, list: T[]) => U
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {Array} Array of converted elements
     */
    ArrayCollection.prototype.map  = function(callback, thisArg) {
        var newArr = [];

        if (typeof callback !== 'function') throw new ExtendError(/EL04116/, null, [typeof callback]);
    
        for (var i = 0; i < this.length; i++) {
            newArr[i] = callback.call(thisArg || this, this[i], i, this._list);
        }
        return newArr;
    };
    Object.defineProperty(ArrayCollection.prototype, 'map', {
        enumerable: false
    });

    /**
     * Returns a new array containing only elements that satisfy the conditions of the provided function.  
     * 
     * @param {Function} callback callback function to filter, (elem: T, index: number, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {Array} Array of filtered elements
     */
    ArrayCollection.prototype.filter = function (callback, thisArg) {
        let newArr = [];

        if (typeof callback !== 'function') throw new ExtendError(/EL04117/, null, [typeof callback]);

        for (let i = 0; i < this.length; i++) {
            if (callback.call(thisArg || this, this[i], i, this._list)) {
                newArr.push(this[i]);
            }
        }
        return newArr;
    };
    Object.defineProperty(ArrayCollection.prototype, 'filter', {
        enumerable: false
    });

    /**
     * Returns the accumulated results by executing the reducer function provided to all elements.  
     * 
     * @param {Function} callback callback function to be reduced, (acc: U, element: T, index: number, list: T[]) => U
     * @param {any} initialValue Initial value
     * @returns  {any} Accumulated final result value
     */
    ArrayCollection.prototype.reduce = function(callback, initialValue) {
        var acc = initialValue;

        if (typeof callback !== 'function') throw new ExtendError(/EL04118/, null, [typeof callback]);

        for(let i=0; i < this.length; i++) {
            acc = acc ? callback(acc, this[i], i, this._list) : this[i];
        }
        return acc;
    };
    Object.defineProperty(ArrayCollection.prototype, 'reduce', {
        enumerable: false
    });

    /**
     * Returns the first element that matches the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to be searched, (elem: T, index: number, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {any} The first element that satisfies the condition, 'undefined' if not found
     */
    ArrayCollection.prototype.find = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL04119/, null, [typeof callback]);
        
        for (var i = 0; i < this.length; i++) {
            if ( callback.call(thisArg || this, this[i], i, this._list) ) {
                return this[i];
            }
        }
        return undefined;
    };
    Object.defineProperty(ArrayCollection.prototype, 'find', {
        enumerable: false
    });

    /**
     * Run the function provided for all elements.  
     * 
     * @param {Function} callback Callback function to run, (elem: T, index: number, list: T[]) => void
     * @param {any} thisArg Object to use as this inside the callback function
     */
    ArrayCollection.prototype.forEach = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041110/, null, [typeof callback]);
        
        for (var i = 0; i <this.length; i++) {
            callback.call(thisArg || this, this[i], i, this._list);
        }
    };
    Object.defineProperty(ArrayCollection.prototype, 'forEach', {
        enumerable: false
    });

    /**
     * Verify that at least one element matches the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to be examined, (elem: T, index: number, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {boolean} 'true' if more than one element satisfies the condition, or 'false' if not
     */
    ArrayCollection.prototype.some = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041111/, null, [typeof callback]);
        
        for(var i=0; i < this.length; i++){
            if (callback.call(thisArg || this, this[i], i, this._list)) return true;
        }
        return false;
    };
    Object.defineProperty(ArrayCollection.prototype, 'some', {
        enumerable: false
    });

    /**
     * Verify that all elements satisfy the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to be examined, (elem: T, index: number, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {boolean}  'true' if all elements meet the conditions, 'false' otherwise
     */
    ArrayCollection.prototype.every = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041112/, null, [typeof callback]);
        
        for(var i=0; i < this.length; i++) {
            if (!callback.call(thisArg || this, this[i], i, this._list)) return false;
        }
        return true;
    };
    Object.defineProperty(ArrayCollection.prototype, 'every', {
        enumerable: false
    });

    /**
     * Returns the index of the first element that matches the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to be examined, (elem: T, index: number, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {any} Index of the first element that satisfies the condition, if not found '-1'
     */
    ArrayCollection.prototype.findIndex = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041113/, null, [typeof callback]);
        
        for (var i = 0; i < this.length; i++) {
            if ( callback.call(thisArg || this, this[i], i, this._list) ) {
                return i;
            }
        }
        return -1;
    };
    Object.defineProperty(ArrayCollection.prototype, 'findIndex', {
        enumerable: false
    });


    return ArrayCollection;

}(BaseCollection));

/**** collection-property.js | PropertyCollection ****/
//==============================================================

var PropertyCollection  = (function (_super) {
    /**
     * Creates an instance of the class 'PropertyCollection'.  
     * 
     * @constructs PropertyCollection
     * @implements {IPropertyCollection}
     * @extends BaseCollection
     * @param {object} p_owner Objects that own this collection
     */
    function PropertyCollection(p_owner) {
        _super.call(this, p_owner); 

        var $keys = [];

        /**
         * Returns all key values in the collection to an array.
         * 
         * @member {string} PropertyCollection#$keys
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$keys', {
            get: function() { return $keys; },
            set: function(nVal) { $keys = nVal; },
            configurable: false,
            enumerable: false,
        });

        // 예약어 등록 
        this.$KEYWORD = ['$keys', 'indexOf', 'exists', 'indexToKey'];

        Util.implements(PropertyCollection, this);      // strip:
    }
    Util.inherits(PropertyCollection, _super);
    
    PropertyCollection._UNION = [IPropertyCollection];
    PropertyCollection._NS = 'Collection';      // namespace
    PropertyCollection._PARAMS = ['_owner'];    // creator parameter

    // local function
    function _isObject(obj) {    // 객체 여부
        if (typeof obj === 'object' && obj !== null) return true;
        return false;
    }

    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    /**
     * Internal method to remove the specified element from the collection.  
     * 
     * @protected
     * @param {number} p_pos Location of the element to be removed
     * @returns {boolean} Removal successful
     */
    PropertyCollection.prototype._remove = function(p_pos) {
        var count = this.count - 1;
        var propName = this.indexToKey(p_pos);   // number 검사함
        
        delete this[propName];      // 프로퍼티 삭제

        this.$elements.splice(p_pos, 1);
        this.$keys.splice(p_pos, 1);
        this.$descriptors.splice(p_pos, 1);
        
        if (p_pos < count) {        // 참조 자료 변경
            for (var i = p_pos; i < count; i++) {
                // var desc = this.$descriptors[i] ? this.$descriptors[i] : this._getPropDescriptor(i);
                propName = this.indexToKey(i);
                Object.defineProperty(this, [i], this.$descriptors[i] ? this.$descriptors[i] : this._getPropDescriptor(i, false));
                Object.defineProperty(this, propName, this.$descriptors[i] ? this.$descriptors[i] : this._getPropDescriptor(i));
            }
            delete this[count];     // 마지막 idx 삭제
        } else {
            delete this[p_pos];     // idx 삭제 (끝일 경우)
        }
        return true;
    };
    Object.defineProperty(PropertyCollection.prototype, '_remove', {
        enumerable: false
    });

    /**
     * Returns the object as an object literal of type GUID.  
     * 
     * @param {number} [p_vOpt=0] Import mode
     * mode=0 : reference structure (_guid:Yes, $ref:Yes)  
     * mode=1: Redundant structure (_guid:Yes, $ref:Yes)  
     * mode=2 : non-coordinated structure (_guid: No, $ref: No)  
     * @param {object | array<object>} [p_owned={}] Parent object that contains (owns) the current object
     * @returns {object}  Guid type object literal
     * @example
     * a.getObject(2) == b.getObject(2)   
     */
    PropertyCollection.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (this.$descriptors.length > 0) {
            obj['_desc'] = [];
            for (var i = 0; i < this.$descriptors.length; i++) {
                obj['_desc'].push(this.$descriptors[i]);
            }
        }
        obj['_elem'] = [];
        for (var j = 0; j < this.count; j++) {
            var elem = this.$elements[j];
            if (elem instanceof MetaObject) {
                if (MetaRegistry.hasGuidObject(elem, owned)) {
                    obj['_elem'].push(MetaRegistry.createReferObject(elem));
                } else obj['_elem'].push(elem.getObject(vOpt, owned));
            } else obj['_elem'].push(elem);
        }
        obj['_key'] = [];
        for (var k = 0; k < this.$keys.length; k++) {
            var key = this.$keys[k];
            obj['_key'].push(key);
        }
        return obj;                        
    };
    Object.defineProperty(PropertyCollection.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * Set up a GUID type object literal by converting it to an instance object.  
     * 
     * @param {object} p_oGuid Object literal of the type of GUID to be set
     * @param {object} [p_origin=p_oGuid] Initial GUID literal object referenced during conversion
     */
    PropertyCollection.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        var origin = p_origin ? p_origin : p_oGuid;

        if (p_oGuid['_elem'].length !== p_oGuid['_key'].length) throw new ExtendError(/EL04221/, null, [p_oGuid['_elem'].length, p_oGuid['_key'].length]);
        
        if (Array.isArray(p_oGuid['_desc']) && p_oGuid['_desc'].length > 0) {
            if (p_oGuid['_elem'].length !== p_oGuid['_desc'].length) throw new ExtendError(/EL04222/, null, [p_oGuid['_elem'].length, p_oGuid['_desc'].length]);
            for (var i = 0; i < p_oGuid['_desc'].length; i++) {
                this.$descriptors.push(p_oGuid['_desc'][i]);
            }
        }

        this.$keys = [];
        for(var j = 0; j < p_oGuid['_key'].length; j++) {
            var key = p_oGuid['_key'][j];
            this.$keys.push(key);
            Object.defineProperty(this, [j], this._getPropDescriptor(j, false));
            Object.defineProperty(this, key, this._getPropDescriptor(j));
        }

        for(var k = 0; k < p_oGuid['_elem'].length; k++) {
            var elem = p_oGuid['_elem'][k];
            if (MetaRegistry.isGuidObject(elem)) {
                var obj = MetaRegistry.createMetaObject(elem, origin);
                obj.setObject(elem, origin);
                this.$elements.push(obj);
            
            } else if (elem['$ref']) {
                var meta = MetaRegistry.findSetObject(elem['$ref'], origin);
                if (!meta) throw new ExtendError(/EL04223/, null, [k, elem['$ref']]);
                this.$elements.push(meta);
                
            } else this.$elements.push(elem);
        }
    };
    Object.defineProperty(PropertyCollection.prototype, 'setObject', {
        enumerable: false
    });

    /**
     * Adds an element to the collection.  
     * 
     * @param {string} p_key Key of the element
     * @param {any} [p_elem] Elements to add
     * @param {object} [p_desc] Property descriptor object for element
     * @returns {number} Location of the added element
     */
    PropertyCollection.prototype.add = function(p_key, p_elem, p_desc) {
        try {
            var index   = this.count;
            var regex = /^[a-zA-Z_][a-zA-Z0-9_]*/;
            // var types = ['_req_'];

            // types = [types.concat(this._elemTypes)];
            
            if (!_isString(p_key)) throw new ExtendError(/EL04225/, null, [p_key]);
            if(!regex.test(p_key)) throw new ExtendError(/EL04226/, null, [p_key, regex.source]);
            if (this.$KEYWORD.indexOf(p_key) > -1) throw new ExtendError(/EL04227/, null, [p_key]);
            if (this.exists(p_key)) throw new ExtendError(/EL04228/, null, [p_key]);
            if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], p_elem);
            // if (this._elemTypes.length > 0) Util.matchType(types, p_elem);
            if (_isObject(p_desc) && p_desc.configurable === false) {
                console.warn(Message.get('WS011', ['configurable = true', 'element']));
                // Message.warn('WS011', ['configurable = true', 'element']);
            }
            if (_isObject(p_desc) && p_desc.writable === false ) {
                console.warn(Message.get('WS011', ['writable = true', 'element']));
                // Message.warn('WS011', ['writable = true', 'element']);
            }

            // this._onAdd(index, p_elem);
            if (this._onAdd(p_elem, index) === false) return -1;

            // data process
            this.$elements.push(p_elem);
            this.$keys.push(p_key);
            this.$descriptors.push(p_desc);
            // property define
            if (_isObject(p_desc)) {
                Object.defineProperty(this, [index], p_desc);
                Object.defineProperty(this, p_key, p_desc);
            } else {
                Object.defineProperty(this, [index], this._getPropDescriptor(index, false));
                Object.defineProperty(this, p_key, this._getPropDescriptor(index));
            }
            this._onAdded(p_elem, index);

            return index;

        } catch (error) {
            throw new ExtendError(/EL04229/, error, [p_key, p_elem]);
        }
    };
    Object.defineProperty(PropertyCollection.prototype, 'add', {
        enumerable: false
    });

    /**
     * Initialize the collection.  
     * Empty $elements, $descripts, and $keys at initialization.  
     * 
     * @returns {boolean} Additional success
     */
    PropertyCollection.prototype.clear = function() {
        try {
            
            if (this._onClear() === false) return false;
            
            for (var i = 0; i < this.count; i++) {
                var propName = this.indexToKey(i);
                delete this[i];
                delete this[propName];
            }
            this.$elements = [];
            this.$descriptors = [];
            this.$keys = [];
            
            this._onCleared();
            return true;

        } catch (error) {
            console.error(error);
            return false;
        }
    };
    Object.defineProperty(PropertyCollection.prototype, 'clear', {
        enumerable: false
    });

    /**
     * Query the index based on the key.  
     * 
     * @param {string} p_key Key to view
     * @returns {number} Index corresponding to key, return '-1' if not present
     */
    PropertyCollection.prototype.keyToIndex = function(p_key) {
        if (!_isString(p_key))  throw new ExtendError(/EL04224/, null, [typeof p_key]);
        return this.$keys.indexOf(p_key);
    };
    Object.defineProperty(PropertyCollection.prototype, 'keyToIndex', {
        enumerable: false
    });

    /**
     * Query the key based on the index value.  
     * 
     * @param {number} p_idx Index to view
     * @returns {string} Key values for that index
     */
    PropertyCollection.prototype.indexToKey = function(p_idx) {
        if (typeof p_idx !== 'number') throw new ExtendError(/EL0422A/, null, [typeof p_idx]);
        return this.$keys[p_idx];
    };
    Object.defineProperty(PropertyCollection.prototype, 'indexToKey', {
        enumerable: false
    });

    /**
     * Verify that the specified key exists in the collection.  
     * 
     * @param {string} p_key Key value to check
     * @returns {boolean} If the key exists, it is 'true', otherwise it is 'false'
     */
    PropertyCollection.prototype.exists = function(p_key) {
        if (!_isString(p_key)) throw new ExtendError(/EL0422B/, null, [typeof p_key]);
        return Object.prototype.hasOwnProperty.call(this, p_key);
    };
    Object.defineProperty(PropertyCollection.prototype, 'exists', {
        enumerable: false
    });

    /**
     * Returns the result of executing the function provided to all elements to the new array.  
     * 
     * @param {Function} callback Callback function to convert, (elem: T, index: number, key: string, list: T[]) => U
     * @param {any} thisArg Objects to use as this inside the callback function
     * @returns  {Array} New arrangement of transformed elements
     */
    PropertyCollection.prototype.map  = function(callback, thisArg) {
        var newArr = [];

        if (typeof callback !== 'function') throw new ExtendError(/EL04116/, null, [typeof callback]);
    
        for (var i = 0; i < this.length; i++) {
            var key = this.indexToKey(i);
            newArr[i] = callback.call(thisArg || this, this[i], i, key, this._list);
        }
        return newArr;
    };
    Object.defineProperty(PropertyCollection.prototype, 'map', {
        enumerable: false
    });

    /**
     * Returns a new array containing only elements that satisfy the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to filter, (elem: T, index: number, key: string, list: T[]) => boolean
     * @param {any} thisArg Objects to use as this inside the callback function
     * @returns  {Array} Array of filtered elements
     */
    PropertyCollection.prototype.filter = function (callback, thisArg) {
        let newArr = [];

        if (typeof callback !== 'function') throw new ExtendError(/EL04117/, null, [typeof callback]);

        for (let i = 0; i < this.length; i++) {
            var key = this.indexToKey(i);
            if (callback.call(thisArg || this, this[i], i, key, this._list)) {
                newArr.push(this[i]);
            }
        }
        return newArr;
    };
    Object.defineProperty(PropertyCollection.prototype, 'filter', {
        enumerable: false
    });

    /**
     * Returns the accumulated results by executing the reducer function provided to all elements.  
     * 
     * @param {Function} callback callback function to be reduced, (acc: U, element: T, index: number, key: string, list: T[]) => U
     * @param {any} initialValue Initial value
     * @returns  {any} Array of filtered elements
     */
    PropertyCollection.prototype.reduce = function(callback, initialValue) {
        var acc = initialValue;

        if (typeof callback !== 'function') throw new ExtendError(/EL04118/, null, [typeof callback]);

        for(let i=0; i < this.length; i++) {
            var key = this.indexToKey(i);
            acc = acc ? callback(acc, this[i], i, key, this._list) : this[i];
        }
        return acc;
    };
    Object.defineProperty(PropertyCollection.prototype, 'reduce', {
        enumerable: false
    });

    /**
     * Returns the first element that matches the conditions of the provided function.
     * 
     * @param {Function} callback Callback function to be searched, (elem: T, index: number, key: string, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {any} The first element that satisfies the condition, 'undefined' if not found
     */
    PropertyCollection.prototype.find = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL04119/, null, [typeof callback]);
        
        for (var i = 0; i < this.length; i++) {
            var key = this.indexToKey(i);
            if ( callback.call(thisArg || this, this[i], i, key, this._list) ) {
                return this[i];
            }
        }
        return undefined;
    };
    Object.defineProperty(PropertyCollection.prototype, 'find', {
        enumerable: false
    });

    /**
     * Run the function provided for all elements.  
     * 
     * @param {Function} callback callback function to be executed, (elem: T, index: number, key: string, list: T[]) => void
     * @param {any} thisArg Object to use as this inside the callback function
     */
    PropertyCollection.prototype.forEach = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041110/, null, [typeof callback]);
        
        for (var i = 0; i <this.length; i++) {
            var key = this.indexToKey(i);
            callback.call(thisArg || this, this[i], i, key, this._list);
        }
    };
    Object.defineProperty(PropertyCollection.prototype, 'forEach', {
        enumerable: false
    });

    /**
     * Verify that at least one element matches the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to be examined, (elem: T, index: number, key: string, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {boolean}  'true' if more than one element satisfies the condition, or 'false' if not
     */
    PropertyCollection.prototype.some = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041111/, null, [typeof callback]);
        
        for(var i=0; i < this.length; i++){
            var key = this.indexToKey(i);
            if (callback.call(thisArg || this, this[i], i, key, this._list)) return true;
        }
        return false;
    };
    Object.defineProperty(PropertyCollection.prototype, 'some', {
        enumerable: false
    });

    /**
     * Verify that all elements satisfy the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to be examined, (elem: T, index: number, key: string, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {boolean} 'true' if all elements meet the conditions, 'false' otherwise
     */
    PropertyCollection.prototype.every = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041112/, null, [typeof callback]);
        
        for(var i=0; i < this.length; i++){
            var key = this.indexToKey(i);
            if (!callback.call(thisArg || this, this[i], i, key, this._list)) return false;
        }
        return true;
    };
    Object.defineProperty(PropertyCollection.prototype, 'every', {
        enumerable: false
    });

    /**
     * Returns the index of the first element that matches the conditions of the provided function.  
     * 
     * @param {Function} callback Callback function to be examined, (elem: T, index: number, key: string, list: T[]) => boolean
     * @param {any} thisArg Object to use as this inside the callback function
     * @returns  {any} Index of the first element that satisfies the condition, if not found '-1'
     */
    PropertyCollection.prototype.findIndex = function(callback, thisArg) {
        if (typeof callback !== 'function') throw new ExtendError(/EL041113/, null, [typeof callback]);
        
        for (var i = 0; i < this.length; i++) {
            var key = this.indexToKey(i);
            if ( callback.call(thisArg || this, this[i], i, key, this._list) ) {
                return i;
            }
        }
        return -1;
    };
    Object.defineProperty(PropertyCollection.prototype, 'findIndex', {
        enumerable: false
    });        

    return PropertyCollection;

}(BaseCollection));

/* eslint-disable */
var defaultCode$1 = {
  "EL02200": "---- Interface.* ----",
  "EL02210": "---- i-control-export.js ----",
  "EL02211": "write(opt): object is an abstract method. '$1' must be implemented",
  "EL02220": "---- i-control-import.js ----",
  "EL02221": "read(object) is an abstract method. '$1' must be implemented",
  "EL02230": "---- i-control-group.js ----",
  "EL02231": "merge(any, opt) is an abstract method. '$1' must be implemented,",
  "EL02232": "Copy(filter) is an abstract method. '$1' must be implemented,",
  "EL02240": "---- i-control-schema.js ----",
  "EL02241": "readSchema(json) is an abstract method. '$1' must be implemented",
  "EL02242": "writeSchema(opt): object is an abstract method. '$1' must be implemented",
  "EL02250": "---- i-transaction.js ----",
  "EL02251": "AcceptChanges() is an abstract method. '$1' must be implemented",
  "EL02252": "rejectChanges() is an abstract method. '$1' must be implemented",
  "EL05100": "---- Meta.Entity.* ----",
  "EL05110": "---- BaseColumn ----",
  "EL05111": "$1._entity value is not an instance of [MetaElement]",
  "EL05112": "$1.columnName is of type 'string'. typeof columnName = '$2'",
  "EL05113": "Existing $1.columnName'$2'",
  "EL05114": "Could not set columnName because $1.alias '$2' already exists",
  "EL05115": "$1.alias is of type 'string'. typeofalias = '$2'",
  "EL05116": "Existing $1.alias '$2'",
  "EL05117": "$1.caption is of type 'string'. typeofcaption = '$2'",
  "EL05118": "setObject(oGuid, origin); oGuid.['_entity'] guid not found. name = '$1', guid = '$2'",
  "EL05119": "clone() is an abstract method. It must be inherited and implemented.",
  "EL05120": "---- ObjectColumn ----",
  "EL05121": "_load(prop); prop is of type 'object', type of prop = '$2'",
  "EL05122": "setObject(oGuid, origin); oGuid.['default'] guid not found: guid = '$1'",
  "EL05123": "setObject(oGuid, origin); oGuid.['value'] guid not found: guid = '$1'",
  "EL05130": "---- MetaColumn ----",
  "EL05131": "$1.required is of type 'boolean', type of = '$2'",
  "EL05132": "$1.isNullPass is of type 'boolean'. typeofisNullPass = '$2' TODO: removed",
  "EL05133": "The array element of $1.constraits is of type 'function' | {regex: RegExp, msg: string}. typeof [$2].regex = '$3', [$2].msg = '$4'",
  "EL05134": "$1.getter is of type 'function', type of getter = '$2'",
  "EL05135": "$1.setter is of type 'function', type of setter = '$2'",
  "EL05136": "addConstraint (regex, msg, code, condition); regex is not a RegExp instance",
  "EL05137": "addConstraint(regex, msg, code, condition); msg 는 'string' 타입입니다. typeof msg = '$1'",
  "EL05138": "valid(value); value is a required value. columnName = '$1' ",
  "EL05139": "valid(value); function constraint failed. columnName = '$1' ",
  "EL0513A": "valid(value); regular expression constraint failed. Column name = '$1', msg = '$2'",
  "EL05140": "---- BaseColumnCollection ----",
  "EL05141": "$1._baseType is of type 'function', type of getter = '$2'",
  "EL05142": "The prototype of $1._baseType [BaseColumn] must be connected (inheritance), ",
  "EL05143": "add(name, vlaue); cannot add columnColleciton because _onwer rows exist. _onwer.rows.count = '$1'",
  "EL05144": "add(name, vlaue); cannot be added because '$2' exists in '$1'",
  "EL05145": "add(name, vlaue); cannot be added because alias '$2' exists in '$1'",
  "EL05146": "removeAt(idx); cannot remove columnColleciton because _onwer rows exist. _onwer.rows.count = '$1'",
  "EL05147": "addValue(name, value) is an abstract method. Must be implemented",
  "EL05148": "Column collection cannot use setter property. Add(), remove() method must be used",
  "EL05150": "---- MetaTableColumnCollection ----",
  "EL05151": "add(any); any 는 'string' | [BaseColumn] 타입입니다. typeof any = '$1'",
  "EL05152": "addValue(name, value); name 은 'string' 타입입니다. typeof name = '$1'",
  "EL05160": "---- MetaViewColumnCollection ----",
  "EL05161": "add(any, refCol); refCol value is not of type [BaseColumnCollection",
  "EL05162": "add(any, refCol); any 는 'string' | [BaseColumn] 타입입니다. typeof any = '$1'",
  "EL05163": "addValue(name, value, refCol); name 은 'string' 타입입니다. typeof name = '$1'",
  "EL05164": "addEntity(entity); entity value is not of type [BaseEntity",
  "EL05200": "",
  "EL05210": "---- MetaRow ----",
  "EL05211": "$1.constructor(entity) value is not of type [BaseEntity",
  "EL05212": "setObject(oGuid, origin); oGuid['_elem'].length = '$1' length and oGuid['_key'].length = '$2' length are different.",
  "EL05213": "setObject(oGuid, origin); oGuid['_elem']['$1'] guid not found. guid = '$2'",
  "EL05214": "changeKey(oldKey, newKey); parameter '$1' is not of type 'string'",
  "EL05215": "changeKey(oldKey, newKey); existing key does not exist. '$1'",
  "EL05216": "changeKey(oldKey, newKey); the key to be replaced overlaps with the existing key.'$1'",
  "EL05220": "---- MetaRowCollection ----",
  "EL05221": "The target's _entity object and $1._onwer object must be the same",
  "EL05222": "insertAt(pos, row, isCheck); row is not type [MetaRow]",
  "EL05223": "insertAt(pos, row, isCheck); row's _entity object and $1._onwer object must be the same",
  "EL05224": "Validation of insertAt(pos, row, isCheck);row['$1'] failed msg = '$2'",
  "EL05300": "---- base-entity.js ----",
  "EL05310": "---- property ----",
  "EL05311": "$1._mestaset value is not of type [MetaSet]",
  "EL05312": "The $1.column property must be redefined,",
  "EL05320": "---- private method :: _buildEntity, _readEntity, _readSchema - 14 ----",
  "EL05321": "_buildEntity(entity, cb, items); items['$1'] 가 'string' It's not type. typeof items['$1'] = '$2'",
  "EL05322": "_buildEntity(entity, cb, items); column name '$1' exists in this.column and cannot be added.",
  "EL05323": "_buildEntity (entity, cb, items); row creation for entity failed",
  "EL05324": "_readEntity(entity, opt); entity is not of type [BaseEntity",
  "EL05325": "_readEntity(entity, opt); opt is not of type 'number'. type of opt = '$1'",
  "EL05326": "_readEntity(entity, opt); entity read failed. opt = '$1'",
  "EL05327": "_readEntity(entity, opt); this.rows exists and cannot load column.opt = '$1'",
  "EL05328": "_readEntity(entity, opt); column name '$1' exists in this.column and cannot be added",
  "EL05329": "_readSchema(obj, isRow, origin); obj._baseEntity guid not found. guid = '$1'",
  "EL0532A": "_readSchema (obj, isRow, origin); Schema read failed",
  "EL0532B": "_readSchema(obj, isRow, origin); this.rows exists and cannot be added to column",
  "EL0532C": "_readSchema(obj, isRow, origin); this.columns['$1'] guid not found.guid = '$2'",
  "EL0532D": "_readSchema(obj, isRow, origin); this.columns['$1']._entity guid를 not found. guid = '$2'",
  "EL0532E": "_readSchema(obj, isRow, origin); column name '$1' exists in this.column and cannot be added",
  "EL05330": "---- method :: transformSchema(static), setValue, clone, select - 7, : getValue, clear, reset, newRow, getObject, setObject ----",
  "EL05331": "BaseEntity.transformSchema(oGuid); oGuid is not a schema object. oGuid = {column: $1,rows: $2}",
  "EL05332": "BaseEntity.transformSchema(oGuid); schema conversion failed",
  "EL05333": "setValue(row);row is not of type [MetaRow",
  "EL05334": "Row setting failed for setValue(row); columns",
  "EL05335": "select (filter, ...); recited from MetaRegistry.namespace to fetch '$1'",
  "EL05336": "select(filter, ...); lookup failed",
  "EL05337": "clone() is an abstract method. Must be implemented",
  "EL05338": "validate(); validation can be performed if all columns are MetaColumn type.",
  "EL05340": "---- merge, copy - 8 ----",
  "EL05341": "merge(target, opt, isMath); target is not of type [BaseEntity]",
  "EL05342": "merge(target, opt, isMath); opt is not of type 'number'. type of opt = '$1'",
  "EL05343": "merge(target, opt, isMath); opt = 1, target.columns['$1'].name = '$2' 이 column name 에 존재합니다.",
  "EL05344": "merge(target, opt, isMath); opt = 1, target.columns['$1'].name = '$2' 이 column alias 에 존재합니다.",
  "EL05345": "merge(target, opt, isMath); opt = 3, target.columns['$1'].name = '$2' 이 columns name 에 존재합니다.",
  "EL05346": "merge(target, opt, isMath); opt = 3, target.columns['$1'].name = '$2' 이 columns alias 에 존재합니다.",
  "EL05347": "merge(target, opt, isMath); merge failed. opt = '$1'",
  "EL05348": "copy() is an abstract method. must be implemented",
  "EL05350": "---- load, read, readSchema, readDate - 12 ----",
  "EL05351": "load(obj, pas); type [BaseEntity] obj cannot be loaded",
  "EL05352": "load(obj, pas); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL05353": "load(obj, pas); load failed",
  "EL05354": "read(obj, opt); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL05355": "read(obj, opt); opt is not of type 'number'. type of opt = '$1'",
  "EL05356": "read(obj, opt); opt values are not in the range (1-3). obj = '$1'",
  "EL05357": "read(obj, opt); read failed",
  "EL05358": "readSchema(obj, isCreate, origin); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL05359": "readSchema(obj, isCreate, origin); obj is not a schema object. obj = {column: $1,rows: $2}",
  "EL0535A": "readSchema (obj, isCreate, origin); skami read failed",
  "EL0535B": "readData(obj); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL0535C": "readData(obj); obj is not a schema object. obj = {columns: $1,rows: $2}",
  "EL0535D": "readData(obj); data read failed",
  "EL05360": "---- output, write, writeSchema, writeData - 4 ----",
  "EL05361": "",
  "EL05400": "",
  "EL05410": "---- MetaTable ----",
  "EL05411": "$1.tableName value is not of type 'string'. typeoftableName = '$2'",
  "EL05412": "$1.column value is not of type [MetaTableCollection]",
  "EL05413": "$1.rows exists and cannot set columns.rows.count = '$2'",
  "EL05414": "setObject(oGuid, origin); oGuid.['_metaSet'] guid not found: guid = '$1'",
  "EL05420": "---- MetaTableColleciton ----",
  "EL05421": "$1._baseType value is not function type. typeof_baseType = '$2'",
  "EL05422": "The prototype of $1._baseType [MetaTable] must be connected. (Inheritance)",
  "EL05423": "add(any); any is 'string' | [MetaTable] type. typeofany = '$1'",
  "EL05424": "add(any); tableName = '$1' existing",
  "EL05430": "---- MetaView ----",
  "EL05431": "$1.viewName value is not of type 'string'. typeofviewName = '$2'",
  "EL05432": "$1.column value is not of type [MetaViewCollection]",
  "EL05433": "$1.rows exists and cannot set columns.rows.count = '$2'",
  "EL05434": "$1._baseEntity value is not of type [BaseEntity]",
  "EL05435": "setObject(oGuid, origin); oGuid.['_metaSet'] guid not found: guid = '$1'",
  "EL05436": "setObject(oGuid, origin); oGuid.['_baseEntivity'] guid not found: guid = '$1'",
  "EL05440": "---- MetaViewColleciton ----",
  "EL05441": "$1._baseType value is not of type 'function'. typeof_baseType = '$2'",
  "EL05442": "The prototype of $1._baseType [MetaView] must be connected (inheritance), ",
  "EL05443": "You cannot enter obj and baseEntity of type [MetaView] at the same time",
  "EL05444": "add(obj, baseEntity); baseEntity is not type [BaseEntity]",
  "EL05445": "add(obj, baseEntity); obj is 'string' | [MetaView] type. typeof obj = '$1'",
  "EL05446": "add(obj, baseEntity); viewName = '$1' existing",
  "EL05450": "---- MetaSet ----",
  "EL05451": "$1.setName value is not of type 'string'. typeofsetName = '$2'",
  "EL05452": "$1.autoChanges value is not of type 'boolean'. typeofsetName = '$2'",
  "EL05453": "MetaSet.transformSchema(oGuid); oGuid is not a schema object: oGuid = {tables:..., views:...}",
  "EL05454": "load(obj, pas); type [MetaSet] obj cannot be loaded",
  "EL05455": "load(obj, pas); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL05456": "read(obj, opt); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL05457": "read(obj, opt); opt is not of type 'number'. type of opt = '$1'",
  "EL05458": "readSchema(obj, isCreate); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL05459": "readSchema(obj, isCreate); obj is not a schema object. obj = {tables: $1, views: $2}",
  "EL0545A": "readData(obj); obj is not of type 'object' (except null) type of obj = '$1'",
  "EL0545B": "readData(obj); obj is not a schema object."
};

/**** message-wrap.js | Message esm ****/
//==============================================================

const isNode$1 = typeof globalThis.isDOM === 'boolean' ? !globalThis.isDOM :  typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;
let localesPath$1 = './locales';

async function absolutePath$1(localPath) {
    try {
        const { fileURLToPath } = await import('url');
        const path = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return path.resolve(__dirname, localesPath$1);
    } catch (error) {
        return localPath;  // Fallback to the original path
    }
}

if (isNode$1) {
    localesPath$1 = await absolutePath$1(localesPath$1);
}

Message.importMessage(defaultCode$1, localesPath$1);

await Message.autoDetect();

/**** i-control-export.js | IExportControl ****/
//==============================================================


/**
 * 내보내기 제어 인터페이스 입니다.
 * 
 * @interface
 * @constructs IExportControl
 */
class IExportControl {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';
    
    constructor() {
    }

    /**
     * 대상을 내보냅니다. (쓰기)
     * 
     * @returns {any}
     * @abstract
     */
    write() {
        throw new ExtendError(/EL02211/, null, ['IExportControl']);
    }
}

/**** i-control-group.js | IGroupControl ****/
//==============================================================

/**
 * 그룹 제어 인터페이스 입니다.
 * 
 * @interface
 * @constructs IGroupControl
 */
class IGroupControl {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';
    
    constructor() {
    }

    /**
     * 병합합니다.
     * 
     * @abstract
     */
    merge() {
        throw new ExtendError(/EL02231/, null, ['IGroupControl']);
    }

    /**
     * 복사합니다.
     * 
     * @returns {any}
     * @abstract
     */
    copy() {
        throw new ExtendError(/EL02232/, null, ['IGroupControl']);
    }
}

/**** i-control-import.js | IImportControl ****/
//==============================================================

/**
 * 가져오기 제어 인터페이스 입니다.
 * 
 * @interface
 * @constructs IImportControl
 */
class IImportControl {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';
    
    constructor() {
    }

    /**
     * 대상을 가져옵니다. (읽기)
     * 
     * @abstract
     */
    read() {
        throw new ExtendError(/EL02221/, null, ['IImportControl']);
    }
}

/**** i-control-schema.js | ISchemaControl ****/
//==============================================================

/**
 * 스키마 제어 인터페이스 입니다.
 * 
 * @interface
 * @constructs ISchemaControl
 */
class ISchemaControl {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';
    
    constructor() {
    }

    /**
     * 스키마를 가져옵니다.
     * 
     * @abstract
     */
    readSchema() {
        throw new ExtendError(/EL02241/, null, ['ISchemaControl']);
    }

    /**
     * 스키마를 내보냅니다.
     * 
     * @returns {any}
     * @abstract
     */
    writeSchema() {
        throw new ExtendError(/EL02242/, null, ['ISchemaControl']);
    }
}

/**** i-transaction.js | ITransaction ****/
//==============================================================

/**
 * 트렌젝션 인터페이스 입니다.
 * 
 * @interface
 * @constructs ITransaction
 */
class ITransaction {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';
    
    constructor() {
    }

    /**
     * 변경을 수락합니다. (commit)
     * 
     * @abstract
     */
    acceptChanges() {
        throw new ExtendError(/EL02251/, null, ['ITransaction']);
    }

    /**
     * 변경을 거부합니다. (rollback)
     * 
     * @abstract
     */
    rejectChanges() {
        throw new ExtendError(/EL02252/, null, ['ITransaction']);
    }
}

/**** trans-queue.js | TransactionQueue ****/
//==============================================================

var TransactionQueue  = (function () {
    /**
     * 트랜젝션 큐
     * 
     * @constructs TransactionQueue
     * @param {ArrayCollection} p_collection 배열컬렉션
     */
    function TransactionQueue(p_collection) {
        
        var queue = [];
        var collection;

        /**
         * 큐 목록
         * 
         * @readonly
         * @member {array<object>} TransactionQueue#queue
         */
        Object.defineProperty(this, 'queue', {
            get: function() { return queue; },
            configurable: false,
            enumerable: true
        });
        
        /**
         * 대상 컬랙션
         * 
         * @member {Number} TransactionQueue#count 
         */
        Object.defineProperty(this, 'collection', {
            get: function() { return collection; },
            set: function(nVal) { 
                if (!(nVal instanceof MetaObject)) {
                    throw new ExtendError(/EL04321/, null, []);
                }
                if (!(nVal.instanceOf(ArrayCollection))) {
                    throw new ExtendError(/EL04322/, null, []);
                }
                collection = nVal;
            },
            configurable: false,
            enumerable: true
        });

        this.collection = p_collection;
    }

    TransactionQueue._NS = 'Collection';    // namespace
    TransactionQueue._PARAMS = ['_owner'];  // creator parameter

    /**
     * 초기화
     */
    TransactionQueue.prototype.init  = function() {
        this.queue.length = 0;
    };

    /**
     * 커밋
     */
    TransactionQueue.prototype.commit  = function() {
        this.init();
    };

    /**
     * 롤백
     */
    TransactionQueue.prototype.rollback  = function() {
        var pos, obj;
        
        for (var i = this.queue.length - 1; i >= 0; i--) {
            obj = this.queue[i];
            if(obj.cmd === 'I') {
                // pos = this.collection.indexOf(obj.ref);
                pos = obj.pos;
                this.collection.removeAt(pos);
            } else if(obj.cmd === 'D') {
                pos = obj.pos;
                this.collection.insertAt(pos, obj.clone);
            } else if(obj.cmd === 'U') {
                // pos = this.collection.indexOf(obj.ref);
                pos = obj.pos;
                this.collection.removeAt(pos);
                this.collection.insertAt(pos, obj.clone);
            } else throw new ExtendError(/EL04323/, null, [obj.cmd]);
        }
        this.init();
    };

    /**
     * 추가
     * 
     * @param {number} p_pos 위치
     * @param {object} p_target 대상
     * @param {string} p_etc 기타
     */
    TransactionQueue.prototype.insert  = function(p_pos, p_target, p_etc) {
        this.queue.push({
            cmd: 'I',
            pos: p_pos,
            ref: p_target,
            clone: null,
            etc: p_etc || ''
        });
    };
    
    /**
     * 삭제
     * 
     * @param {number} p_pos 위치
     * @param {object} p_clone 복제한 객체
     * @param {string} p_etc 기타
     */
    TransactionQueue.prototype.delete  = function(p_pos, p_clone, p_etc) {
        this.queue.push({
            cmd: 'D',
            pos: p_pos,
            ref: null,
            clone: p_clone,
            etc: p_etc || ''
        });
    };

    /**
     * 수정
     * 
     * @param {number} p_pos 위치
     * @param {object} p_target 대상
     * @param {object} p_clone 복제한 객체
     * @param {string} p_etc 기타
     */
    TransactionQueue.prototype.update  = function(p_pos, p_target, p_clone, p_etc) {
        this.queue.push({
            cmd: 'U',
            pos: p_pos,
            ref: p_target,
            clone: p_clone,
            etc: p_etc || ''
        });
    };
    
    /**
     * 변경 내역 조회
     * 
     * @returns {array<object>}
     */
    TransactionQueue.prototype.select  = function() {
        return this.queue;
    };

    return TransactionQueue;

}());

/**** collection-transaction.js | TransactionCollection ****/
//==============================================================

var TransactionCollection  = (function (_super) {
    /**
     * 트랜젝션 컬렉션 클래스
     * 
     * @constructs TransactionCollection
     * @extends ArrayCollection
     * @param {object} p_owner 소유객체
     */
    function TransactionCollection(p_owner) {
        _super.call(this, p_owner);

        var _transQueue = new TransactionQueue(this);
        var autoChanges = false;

        /**
         * 트렌젝션 큐
         * 
         * @readonly
         * @member {TransactionQueue} TransactionCollection#_transQueue
         */
        Object.defineProperty(this, '_transQueue', {
            get: function() { return _transQueue; },
            configurable: false,
            enumerable: false
        });

        /**
         * 자동 변경 유무 (기본값: 사용 false)
         * 
         * @member {boolean} TransactionCollection#autoChanges
         */
        Object.defineProperty(this, 'autoChanges', {
            get: function() { return autoChanges; },
            set: function(nVal) { 
                if (typeof nVal !== 'boolean') {
                    throw new ExtendError(/EL04311/, null, [this.constructor.name ,typeof nVal]);
                }
                autoChanges = nVal;
            },
            configurable: false,
            enumerable: false
        });

        /**
         * 변경 유무
         * 
         * @readonly
         * @member {TransactionCollection} TransactionCollection#hasChanges
         */
        Object.defineProperty(this, 'hasChanges', {
            get: function() { return _transQueue.queue.length > 0; },
            configurable: false,
            enumerable: false
        });

        // 예약어 등록 
        this.$KEYWORD = ['_transQueue', 'autoChanges', 'hasChanges'];
        this.$KEYWORD = ['commit', 'rollback'];

    }
    Util.inherits(TransactionCollection, _super);

    TransactionCollection._NS = 'Collection';      // namespace
    TransactionCollection._PARAMS = ['_owner'];    // creator parameter

    /**
     * 트랜젝션 컬렉션 프로퍼티 기술자 
     * 
     * @protected
     * @param {number} p_idx 인덱스
     */
    TransactionCollection.prototype._getPropDescriptor = function(p_idx) {
        return {
            get: function() { return this.$elements[p_idx]; },
            set: function(nVal) {
                if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], nVal);
                this._transQueue.update(p_idx, nVal, this.$elements[p_idx]); 
                this.$elements[p_idx] = nVal;
            },
            configurable: true,
            enumerable: true,
        };
    };
    Object.defineProperty(TransactionCollection.prototype, '_getPropDescriptor', {
        enumerable: false
    });

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    TransactionCollection.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var origin = p_origin ? p_origin : obj;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (this.autoChanges !== false) obj['autoChanges'] = this.autoChanges;
        return obj;                        
    };
    Object.defineProperty(TransactionCollection.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.  
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    TransactionCollection.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        this._transQueue.init();
        if (p_oGuid['autoChanges']) this.autoChanges = p_oGuid['autoChanges'];
    };
    Object.defineProperty(TransactionCollection.prototype, 'setObject', {
        enumerable: false
    });

    /**
     * 지정 위치에 요소 삭제
     * 
     * @param {number} p_pos 인덱스 위치
     * @returns {boolean}
     */
    TransactionCollection.prototype.removeAt = function(p_pos) {
        if (!this.autoChanges) this._transQueue.delete(p_pos, this[p_pos]);
        return _super.prototype.removeAt.call(this, p_pos);
    };
    Object.defineProperty(TransactionCollection.prototype, 'removeAt', {
        enumerable: false
    });

    /**
     * 전체 초기화
     */
    TransactionCollection.prototype.clear = function() {
        _super.prototype.clear.call(this);
        this._transQueue.init();
    };
    Object.defineProperty(TransactionCollection.prototype, 'clear', {
        enumerable: false
    });

    /**
     * 지정 위치에 요소 추가
     * 
     * @param {number} p_pos 인덱스 위치
     * @param {any} p_elem 요소
     * @param {object} [p_desc] 프로퍼티 기술자 객체
     * @returns {boolean}
     */
    TransactionCollection.prototype.insertAt = function(p_pos, p_elem, p_desc) {
        if (!this.autoChanges) this._transQueue.insert(p_pos, p_elem);
        return _super.prototype.insertAt.call(this, p_pos, p_elem, p_desc);
    };
    Object.defineProperty(TransactionCollection.prototype, 'insertAt', {
        enumerable: false
    });

    /**
     * 변경사항 반영
     */
    TransactionCollection.prototype.commit = function() {
        this._transQueue.commit();
    };
    Object.defineProperty(TransactionCollection.prototype, 'commit', {
        enumerable: false
    });

    /**
     * 변경사항 이전으로 복귀
     */
    TransactionCollection.prototype.rollback = function() {
        this._transQueue.rollback();
    };
    Object.defineProperty(TransactionCollection.prototype, 'rollback', {
        enumerable: false
    });

    return TransactionCollection;

}(ArrayCollection));

/**** meta-row.js | MetaRow ****/
//==============================================================

var MetaRow  = (function (_super) {
    /**
     * 메타 로우
     * 
     * @constructs MetaRow
     * @extends MetaObject
     * @param {BaseEntity} p_entity 소유하는 엔티티
     */
    function MetaRow(p_entity) {
        _super.call(this);
        
        // private
        var $event  = new EventEmitter(this);
        var $elements = [];
        var $keys = [];

        // protected
        // var _this   = this;
        var _entity  = null;

        /**
         * 내부 변수 접근
         * 
         * @member {Array<string>} MetaRow#$elements
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$elements', {
            get: function() { return $elements; },
            set: function(nVal) { $elements = nVal; },
            configurable: false,
            enumerable: false,
        });


        /** 
         * 이벤트 객체
         * 
         * @private 
         * @member {EventEmitter} MetaRow#$event  
         */
        Object.defineProperty(this, '$event', {
            get: function() { return $event; },
            configurable: false,
            enumerable: false,
        });

        /** 
         * 요소 키
         * 
         * @readonly
         * @member {Array<string>} MetaRow#$keys  
         */
        Object.defineProperty(this, '$keys', {
            get: function() {
                // var arr = [];
                // for (var i = 0; i < $keys.length; i++) arr.push($keys[i]);
                // return arr;
                return $keys;
            },
            configurable: false,
            enumerable: false,
        });

        /**
         * 로우의 소유 엔티티
         * 
         * @readonly
         * @member {BaseEntity} MetaRow#_entity
         */
        Object.defineProperty(this, '_entity', {
            get: function() { return _entity; },
            configurable: false,
            enumerable: false
        });

        /**
         * 컬렉션 목록 
         * 
         * @readonly
         * @member {Array<any>}  MetaRow#_list  
         */
        Object.defineProperty(this, '_list', {
            get: function() {
                var arr = [];
                for (var i = 0; i < $elements.length; i++) arr.push($elements[i]);
                return arr;
            },
            configurable: false,
            enumerable: false,
        });            
        
        /**
         * 컬랙션 갯수 
         * 
         * @readonly
         * @member {Number} MetaRow#count 
         */
        Object.defineProperty(this, 'count', {
            get: function() { return $elements.length; },
            configurable: false,
            enumerable: false
        });

        /**
         * 변경전 이벤트 
         * 
         * @event MetaRow#onChanged 
         * @param {function}    p_callback
         * @param {number}      p_callback.p_idx  index
         * @param {any}         p_callback.p_nValue 신규 값
         * @param {any}         p_callback.p_oValue 기존 값
         * @param {this}        p_callback.p_this 로우 객체
         */
        Object.defineProperty(this, 'onChanging', {
            set: function(fun) { this.$event.on('onChanging', fun); },
            configurable: false,
            enumerable: false,
        });
        
        /**
         * 변경후 이벤트 
         * 
         * @event MetaRow#onChanged 
         * @param {function}    p_callback
         * @param {number}      p_callback.p_idx  index
         * @param {any}         p_callback.p_nValue 신규 값
         * @param {any}         p_callback.p_oValue 기존 값
         * @param {this}        p_callback.p_this 로우 객체
         */
        Object.defineProperty(this, 'onChanged', {
            set: function(fun) { this.$event.on('onChanged', fun); },
            configurable: false,
            enumerable: false,
        });

        // inner variable access
        // this.__GET$elements = function(call) {
        //     if (call instanceof MetaRow) return $elements;
        // }
        // this.__GET$_keys = function(call) {
        //     if (call instanceof MetaRow) return _keys;
        // };
        // this.__SET$elements = function(val, call) {
        //     if (call instanceof MetaRow) $elements = val;
        // }
        // this.__SET$_keys = function(val, call) {
        //     if (call instanceof MetaRow) _keys = val;
        // };
        // this.__SET$_entity = function(val, call) {
        //     if (call instanceof MetaRow) _entity = val;
        // };
        
        // BaseEntity 등록 & order(순서) 값 계산
        if (!(p_entity instanceof MetaObject && p_entity.instanceOf('BaseEntity'))) {
            throw new ExtendError(/EL05211/, null, []);
        }
        
        // 설정
        _entity = p_entity;

        for (var i = 0; i < _entity.columns.count; i++) {
            var idx = $elements.length;
            var alias = _entity.columns[i].alias;
            $elements.push(_entity.columns[i].default);  // 기본값 등록
            $keys.push(alias);
            Object.defineProperty(this, [i], this._getPropDescriptor(idx, false));
            Object.defineProperty(this, alias, this._getPropDescriptor(idx));
        }

        

        Util.implements(MetaRow, this);         // strip:
    }
    Util.inherits(MetaRow, _super);
    
    MetaRow._UNION = [IList];
    MetaRow._NS = 'Meta.Entity';
    MetaRow._PARAMS = ['_entity'];

    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }
    
    /**
     * TODO:
     * 
     * @param {*} p_idx 
     * @param {*} p_enum 
     * @returns 
     */
    MetaRow.prototype._getPropDescriptor = function(p_idx, p_enum) {
        if (typeof p_enum !== 'boolean') p_enum = true;
        return {
            get: function() { return this.$elements[p_idx]; },
            set: function(nVal) {
                var oldValue = this.$elements[p_idx];
                var column;
                // 엔티티 항상 존재함
                column = this._entity.columns[p_idx];
                if (column && column._valueTypes.length > 0) Type.matchType([column._valueTypes], nVal);
                // 트렌젹션 처리 => 함수로 추출 검토
                if (this._entity && !this._entity.rows.autoChanges) {
                    var etc = 'idx:'+ p_idx +', new:' + nVal + ', old:'+ oldValue;
                    var pos = this._entity.rows.indexOf(this);
                    if (pos > -1) {     // 컬력션에 포힘때 : 변경시점에 큐에 추가
                        this._entity.rows._transQueue.update(pos, this, this.clone(), etc);
                    }
                }
                // 이벤트 및 처리
                this._onChanging(p_idx, nVal, oldValue);
                this.$elements[p_idx] = nVal;
                this._onChanged(p_idx, nVal, oldValue);

            },
            configurable: true,
            enumerable: p_enum
        };
    };
    Object.defineProperty(MetaRow.prototype, '_getPropDescriptor', {
        enumerable: false
    });

    /**
     * 속성명 변경
     * 
     * @param {string} [p_entity] 대상의 엔티티 기준으로 생성
     * @returns {MetaRow}
     */
    MetaRow.prototype._changeKey  = function(p_oldKey, p_newKey) {
        var idx;

        // 타입 검사
        if (!_isString(p_oldKey)) throw new ExtendError(/EL05214/, null, ['oldKey']);
        if (!_isString(p_newKey)) throw new ExtendError(/EL05214/, null, ['newKey']);

        
        // 새로운 키 중복 검사
        if (this.$keys.indexOf(p_oldKey) < 0) throw new ExtendError(/EL05215/, null, [p_oldKey]);  // 기존에 키가 존재하지 않습니다. TODO:
        if (this.$keys.indexOf(p_newKey) > -1) throw new ExtendError(/EL05216/, null, [p_newKey]); // 교체할 키가 기존 키와 중복됩니다. TODO:

        // 기존 idx 조회
        idx = this.$keys.indexOf(p_oldKey);

        // 기존 제거 및 설정
        delete this[p_oldKey];
        Object.defineProperty(this, p_newKey, this._getPropDescriptor(idx));

        // $keys 값 교체
        this.$keys.splice(idx, 1, p_newKey); 
    };
    Object.defineProperty(MetaRow.prototype, '_changeKey', {
        enumerable: false
    });


    // function $getPropDescriptor(p_idx, p_enum) {
    //     if (typeof p_enum !== 'boolean') p_enum = true;
    //     return {
    //         get: function() { return this.$elements[p_idx]; },
    //         set: function(nVal) {
    //             var oldValue = this.$elements[p_idx];
    //             var column;
    //             // 엔티티 항상 존재함
    //             column = this._entity.columns[p_idx];
    //             if (column && column._valueTypes.length > 0) Type.matchType([column._valueTypes], nVal);
    //             // 트렌젹션 처리 => 함수로 추출 검토
    //             if (this._entity && !this._entity.rows.autoChanges) {
    //                 var etc = 'idx:'+ p_idx +', new:' + nVal + ', old:'+ oldValue;
    //                 var pos = this._entity.rows.indexOf(this);
    //                 if (pos > -1) {     // 컬력션에 포힘때 : 변경시점에 큐에 추가
    //                     this._entity.rows._transQueue.update(pos, this, this.clone(), etc);
    //                 }
    //             }
    //             // 이벤트 및 처리
    //             this._onChanging(p_idx, nVal, oldValue);
    //             this.$elements[p_idx] = nVal;
    //             this._onChanged(p_idx, nVal, oldValue);

    //         },
    //         configurable: false,
    //         enumerable: p_enum
    //     };
    // }
    
    /**
     * 로우 요소 변경전 이벤트
     * 
     * @param {*} p_idx 인덱스
     * @param {*} p_nValue 변경 값
     * @param {*} p_oValue 기존 값
     * @listens MetaColumn#_onChanged
     */
    MetaRow.prototype._onChanging = function(p_idx, p_nValue, p_oValue) {
        this.$event.emit('onChanging', p_idx, p_nValue, p_oValue, this);
    };
    Object.defineProperty(MetaRow.prototype, '_onChanging', {
        enumerable: false
    });

    /**
     * 로우 요소 변경후 이벤트
     * 
     * @param {*} p_idx 인덱스
     * @param {*} p_nValue 변경 값
     * @param {*} p_oValue 기존 값
     * @listens MetaColumn#_onChanged
     */
    MetaRow.prototype._onChanged = function(p_idx, p_nValue, p_oValue) {
        this.$event.emit('onChanged', p_idx, p_nValue, p_oValue, this);
    };
    Object.defineProperty(MetaRow.prototype, '_onChanged', {
        enumerable: false
    });

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.
     * @param {number} p_vOpt 가져오기 옵션
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)   
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)   
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    MetaRow.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (!Type.deepEqual(this.$event.$storage, {})) {
            obj['$storage'] = this.$event.$storage;
        }
        if (vOpt < 2 && vOpt > -1 && this._entity) {
            obj['_entity'] = MetaRegistry.createReferObject(this._entity);
        }
        obj['_elem'] = [];
        for (var i = 0; i < this._list.length; i++) {
            var elem = this._list[i];
            if (elem instanceof MetaObject) {
                if (MetaRegistry.hasGuidObject(elem, owned)) {
                    obj['_elem'].push(MetaRegistry.createReferObject(elem));
                } else obj['_elem'].push(elem.getObject(vOpt, owned));
            } else obj['_elem'].push(elem);
        }
        obj['_key'] = [];
        for (var k = 0; k < this.$keys.length; k++) {
            var key = this.$keys[k];
            obj['_key'].push(key);
        }
        return obj;                        
    };
    Object.defineProperty(MetaRow.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    MetaRow.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;
        // var entity;
        
        if (p_oGuid['_elem'].length !== p_oGuid['_key'].length) throw new ExtendError(/EL05212/, null, [p_oGuid['_elem'].length, p_oGuid['_key'].length]);

        if (p_oGuid['$storage']) {
            this.$event.$storage = p_oGuid['$storage'];
        }
        for(var i = 0; i < p_oGuid['_elem'].length; i++) {
            var elem = p_oGuid['_elem'][i];
            if (MetaRegistry.isGuidObject(elem)) {
                var obj = MetaRegistry.createMetaObject(elem, origin);
                obj.setObject(elem, origin);
                this.$elements[i] = obj;
            } else if (elem['$ref']) {
                var meta = MetaRegistry.findSetObject(elem['$ref'], origin);
                if (!meta) throw new ExtendError(/EL05213/, null, [i, elem['$ref']]);
                this.$elements[i] = meta;   
            } else this.$elements[i] = elem;   
        }
    };
    Object.defineProperty(MetaRow.prototype, 'setObject', {
        enumerable: false
    });

    /**
     * 객체 복제
     * 
     * @param {BaseEntity} [p_entity] 대상의 엔티티 기준으로 생성
     * @returns {MetaRow}
     */
    MetaRow.prototype.clone  = function(p_entity) {
        var entity = p_entity || this._entity;
        var clone = new MetaRow(entity);
        var obj = this.getObject();

        if (obj.$storage) {
            clone.$event.$storage = obj.$storage;
        }
        clone.$elements = Util.deepCopy(obj._elem);
        return clone;
    };
    Object.defineProperty(MetaRow.prototype, 'clone', {
        enumerable: false
    });
    
    return MetaRow;

}(MetaObject));

/**** collection-meta-row.js | MetaTableCollection ****/
//==============================================================

var MetaRowCollection  = (function (_super) {
    /**
     * 로우 컬렉션
     * 
     * @constructs MetaRowCollection
     * @extends TransactionCollection
     * @param {object} [p_owner] 소유자 
     */
    function MetaRowCollection(p_owner) {
        _super.call(this, p_owner);

        this._elemTypes = MetaRow;   // 컬렉션타입 설정
        this.autoChanges = true;    // 트랜젝션 기본 해제 해제입니다.
    }
    Util.inherits(MetaRowCollection, _super);

    MetaRowCollection._NS = 'Meta.Entity';    // namespace
    MetaRowCollection._PARAMS = ['_owner'];  // creator parameter

    /**
     * 프로퍼티 기술자 설정
     * 
     * @protected
     * @param {number} p_idx 인덱스
     */
    MetaRowCollection.prototype._getPropDescriptor = function(p_idx) {
        return {
            get: function() { return this.$elements[p_idx]; },
            set: function(nVal) {
                if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], nVal);
                if (nVal._entity !== this._owner) throw new ExtendError(/EL05221/, null, [this.constructor.name]);
                this._transQueue.update(p_idx, nVal, this.$elements[p_idx]); 
                this.$elements[p_idx] = nVal;
            },
            configurable: true,
            enumerable: true,
        };
    };
    Object.defineProperty(MetaRowCollection.prototype, '_getPropDescriptor', {
        enumerable: false
    });

    /**
     * MetaRow 추가 idx 를 기준으로 검사한다.
     * 
     * @param {MetaRow} p_row 추가할 MetaRow
     * @param {boolean} [p_isCheck] 유효성 검사 여부 (기본값 = false)
     * @returns {number}
     */
    MetaRowCollection.prototype.add  = function(p_row, p_isCheck) {
        var pos = this.$elements.length;
        this.insertAt(pos, p_row, p_isCheck);  // TODO: try 문으로 묶음 필요
        return pos;
    };
    Object.defineProperty(MetaRowCollection.prototype, 'add', {
        enumerable: false
    });

    /**
     * pos 위치에 추가
     * 
     * @param {number} p_pos 추가할 위치 인덱스
     * @param {MetaRow} p_row 추가할 MetaRow
     * @param {boolean} [p_isCheck] 유효성 검사 여부 (기본값 = false)
     * @returns {boolean}
     */
    MetaRowCollection.prototype.insertAt  = function(p_pos, p_row, p_isCheck) {
        var isCheck = p_isCheck || false;
        var result;
        var entity = p_row._entity;

        if (!(p_row instanceof MetaRow )) throw new ExtendError(/EL05222/, null, []);
        if (entity._guid !== this._owner._guid) throw new ExtendError(/EL05223/, null, [this.constructor.name]);
        
        // valid 검사
        if (isCheck === true) {
            for (let i = 0; i < p_row.count; i++) {
                result = entity.columns[i].valid(p_row[i]);     // TODO: try 조건으로 변경 하면 하위 메세지 호출함
                if(result) {
                    throw new ExtendError(/EL05224/, null, [i, result.msg]);
                }
            }
        }
        return _super.prototype.insertAt.call(this, p_pos, p_row);
    };
    Object.defineProperty(MetaRowCollection.prototype, 'insertAt', {
        enumerable: false
    });

    return MetaRowCollection;
    
}(TransactionCollection));

/**** base-column.js | BaseColumn ****/
//==============================================================

var BaseColumn  = (function (_super) {
    /**
     * 컬럼 (최상위)
     * @abstract
     * @constructs BaseColumn
     * @extends MetaElement
     * @param {string} p_name 아이템명
     * @param {BaseEntity} [p_entity] 소유 BaseEntity
     */
    function BaseColumn(p_name, p_entity) {
        _super.call(this, p_name);

        var $key            = p_name;
        var $value          = null;
        var $alias          = null;
        var _entity         = null;
        var _valueTypes     = this._type._VALUE_TYPE || [];
        var _default        = '';
        var caption         = '';
        /**
         * 컬럼 컬렉션의 키
         * @member {string} BaseColumn#$key
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$key', {
            get: function() { return $key; },
            set: function(nVal) { 
                if (_isString(nVal)) $key = nVal;
            },
            configurable: false,
            enumerable: false,
        });

        /**
         * 별칭 내부값
         * @member {string | number | boolean} BaseColumn#$value
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$value', {
            get: function() { return $value; },
            set: function(nVal) { $value = nVal; },
            configurable: false,
            enumerable: false,
        });

        /**
         * 별칭 내부값
         * @member {string} BaseColumn#$alias
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$alias', {
            get: function() { return $alias; },
            set: function(nVal) { 
                if (_isString(nVal)) $alias = nVal;
            },
            configurable: false,
            enumerable: false,
        });

        /**
         * 컬럼 소유 엔티티
         * @member {BaseEntity} BaseColumn#_entity
         * @protected
         */
        Object.defineProperty(this, '_entity', {
            get: function() { return _entity; },
            set: function(nVal) { 
                if (typeof nVal !== 'undefined' && !(nVal instanceof MetaElement && nVal.instanceOf('BaseEntity'))) {
                    throw new ExtendError(/EL05111/, null, [this.constructor.name]);
                }
                _entity = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * value 타입 설정
         * @member {any} BaseColumn#_valueTypes
         * @protected
         */
        Object.defineProperty(this, '_valueTypes', {
            get: function() { return _valueTypes; },
            set: function(nVal) { 
                var arr = [];
                if (!Array.isArray(nVal)) arr.push(nVal);
                else arr = nVal;
                _valueTypes = arr;  
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 컬럼명, _name 과 동일
         * @member {string} BaseColumn#columnName
         */
        Object.defineProperty(this, 'columnName', {
            get: function() { return this._name; },
            set: function(nVal) { 
                if (nVal === this.columnName) return;
                if (typeof nVal !== 'string') throw new ExtendError(/EL05112/, null, [this.constructor.name, typeof nVal]); 
                if (_entity && _entity.columns.existColumnName(nVal)) throw new ExtendError(/EL05113/, null, [this.constructor.name, nVal]);
                if (_entity && _entity.columns.existAlias(nVal)) throw new ExtendError(/EL05114/, null, [this.constructor.name, nVal]);
                this._name = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 아이템 별칭 (bind전송시, 데이터 수신후 설정시 활용함)  
         * 사용처 (기본값 = columnName )
         * - Bind-command-ajax._execBind() : 데이터 전송시  
         * - BaseBind.setValue(row) : 로우값 을 엔티티에 설정시  
         * - getValue() : row 에 활용함  
         * @member {string} BaseColumn#alias
         */
        Object.defineProperty(this, 'alias', {
            get: function() { return typeof $alias === 'string' ? $alias : this.columnName; },
            set: function(nVal) { 
                var entity = this._entity;
                var oldKey = this.$alias || this.columnName;

                if(typeof nVal !== 'string') throw new ExtendError(/EL05115/, null, [this.constructor.name, typeof nVal]); 
                if (entity && entity.columns.existAlias(nVal)) throw new ExtendError(/EL05116/, null, [this.constructor.name, nVal]);
                
                // 기존에 rows 에 기존 명칭이 존재하면 MetaRow 변경
                if (this._entity) {
                    for (var i = 0; i < this._entity.rows.count; i++) {
                        var row = this._entity.rows[i];
                        row._changeKey(oldKey, nVal);
                    }
                }
                $alias = nVal;
            },
            configurable: false,
            enumerable: true
        }); 

        /**
         * 컬럼 value 의 기본값 (내부속성)
         * @member {string | number | boolean} BaseColumn#default
         */
        Object.defineProperty(this, 'default', {
            get: function() { return _default; },
            set: function(nVal) { 
                if (this._valueTypes.length > 0) Type.matchType([this._valueTypes], nVal);
                _default = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 컬럼 설명
         * @member {string} BaseColumn#caption
         */
        Object.defineProperty(this, 'caption', {
            get: function() { return caption; },
            set: function(nVal) { 
                if(typeof nVal !== 'string') throw new ExtendError(/EL05117/, null, [this.constructor.name, typeof nVal]); 
                caption = nVal; 
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 컬럼 값
         * @member {any} BaseColumn#value
         */
        Object.defineProperty(this, 'value', {
            get: function() { 
                return $value === null ? this.default : $value; 
            },
            set: function(nVal) {
                if (this._valueTypes.length > 0) Type.matchType([this._valueTypes], nVal);
                $value = nVal;
            },
            configurable: true,
            enumerable: true
        });

        /**
         * value 별칭
         * this.value
         * @member {object} BaseColumn#val
         */
        Object.defineProperty(this, 'val', {
            get: function() { return this.value; },
            set: function(nVal) { this.value = nVal;},
            configurable: true,
            enumerable: false
        });

        if (p_entity) _entity = p_entity;
    }
    Util.inherits(BaseColumn, _super);

    BaseColumn._NS = 'Meta.Entity';     // namespace
    BaseColumn._PARAMS = ['columnName', '_entity'];    // creator parameter
    BaseColumn._KIND = 'abstract';
    BaseColumn._VALUE_TYPE = [];

    // local funciton
    // function _isObject(obj) {    // 객체 여부
    //     if (typeof obj === 'object' && obj !== null) return true;
    //     return false;
    // }
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)   
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BaseColumn.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (vOpt < 2 && vOpt > -1 && this._entity) {
            obj['_entity'] = MetaRegistry.createReferObject(this._entity);
        }
        obj['columnName'] = this.columnName;
        if (this.default !== '') obj['default'] = this.default;
        if (this.caption !== '') obj['caption'] = this.caption;            
        if (this.$alias !== null) obj['$alias'] = this.$alias;
        // if (this.__GET$alias(this) !== null) obj['alias'] = this.__GET$alias(this);
        if (this.$value !== null) obj['$value'] = this.$value;
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.  
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체
     * 기본값은 p_oGuid 객체와 동일
     */
    BaseColumn.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;
        var entity;

        if (p_oGuid['_entity']) {
            entity = MetaRegistry.findSetObject(p_oGuid['_entity']['$ref'], origin);
            if (!entity) throw new ExtendError(/EL05118/, null, [p_oGuid['name'], p_oGuid['_entity']['$ref']]);
            this._entity = entity;
        } 
        this.columnName = p_oGuid['columnName'];
        if (p_oGuid['default']) this.default = p_oGuid['default'];
        if (p_oGuid['caption']) this.caption = p_oGuid['caption'];
        if (p_oGuid['$alias']) this.$alias = p_oGuid['$alias'];
        if (p_oGuid['$value']) this.$value = p_oGuid['$value'];
    };

    /** 
     * 컬럼 복제
     * 
     * @abstract 
     */
    BaseColumn.prototype.clone = function() {
        throw new ExtendError(/EL05119/, null, []);
    };

    return BaseColumn;

}(MetaElement));

/**** meta-column.js | MetaColumn ****/
//==============================================================

var MetaColumn  = (function (_super) {
    /**
     * 메타 컬럼
     * 
     * @constructs MetaColumn
     * @extends BaseColumn
     * @param {string} p_name 컬럼명
     * @param {BaseEntity} [p_entity] 소유 BaseEntity
     * @param {object} [p_property] 
     * @param {object} p_property.default 기본값
     * @param {boolean} p_property.required 필수 유무
     * @param {array<object.function>} p_property.constraints 제약조건
     * @param {string | number | boolean} p_property.value value 값
     * @param {function} p_property.getter 겟터
     * @param {function} p_property.setter 셋터
     * @param {string} p_property.alias 별칭
     * @param {function} p_property.onChanged value 변경 후 이벤트
     */
    function MetaColumn(p_name, p_entity, p_property) {
        _super.call(this, p_name, p_entity);

        var $event          = new EventEmitter(this);
        var required       = false;
        // var optional      = false;
        var constraints     = [];
        var getter          = null;
        var setter          = null;

        /** 
         * 이벤트 객체
         * @private
         * @member {EventEmitter} MetaColumn#$event  
         */
        Object.defineProperty(this, '$event', {
            get: function() { return $event; },
            configurable: false,
            enumerable: false,
        });        

        /**
         * 컬럼 value의 필수 여부
         * @member {boolean} MetaColumn#required
         */
        Object.defineProperty(this, 'required', {
            get: function() { return required; },
            set: function(nVal) { 
                if(typeof nVal !== 'boolean') throw new ExtendError(/EL05131/, null, [this.constructor.name, typeof nVal]);
                required = nVal; 
            },
            configurable: false,
            enumerable: true
        });
        
        /**
         * 컬럼 제약 조건 
         * 
         * @member {array<object | function>} MetaColumn#constraints
         * 
         * @example
         * var c = {
         *  regex: /aa/,
         *  msg: '매칭메세지',  // return이 true면 성공시 메세지, false 실패시 메세지
         *  condition: ture     // 매칭시 성공
         * };
         */
        Object.defineProperty(this, 'constraints', {
            get: function() { return constraints; },
            set: function(nVal) { 
                var list = [];
                constraints = [];
                if (Array.isArray(nVal))  list = nVal;
                else list.push(nVal);
                for(var i = 0; list.length > i; i++) {
                    if (!(typeof list[i] === 'function' || (typeof list[i].regex === 'object' && typeof list[i].msg === 'string'))) {
                        throw new ExtendError(/EL05133/, null, [this.constructor.name, i, typeof nVal.regex, typeof nVal.msg]);
                    }
                }
                constraints = list;
            },
            configurable: false,
            enumerable: true
        });
        
        /**
         * 컬럼 value  
         * get 우선순위 : 1. getter 있는 경우, 2. 내부값 $value  
         * set 우선순위 : 1. setter 있는 경우, 2. setter 리턴값이 없는 경우  
         * REVIEW: 정리표 보고 수정 필요!!
         * 
         * @member {string | number | boolean} MetaColumn#value
         */
        Object.defineProperty(this, 'value', {
            get: function() { 
                var __val;
                // 우선순위 : 1
                if (typeof getter === 'function' ) {
                    __val = getter.call(this);
                    if (this.$value !== null && this.$value !== __val) {
                        this._onChanged(__val, this.$value);    // 검사 및 이벤트 발생
                        this.$value = __val;   // 내부에 저장
                    }
                // 우선순위 : 2
                } else __val = this.$value;
                /**
                 * 분기 처리값 '__val' 없는경우 (null, undefined)
                 *  - this.$value 초기화 되지 않은 경우
                 *  - getter 리턴이 없는 경우
                 */
                // if (typeof __val === 'undefined' || __val === null) __val = this.$value || this.default;  REVIEW: 제거 대상
                // if (typeof __val === 'undefined' || __val === null) __val = this.$value;  
                if (typeof __val === 'undefined' || __val === null) __val = this.default;

                return __val; 
            },
            set:  function(val) { 
                var __val, _val;
                var _oldVal = this.$value;
                if (typeof setter === 'function' ) _val = setter.call(this, val);
                // settter 의 리턴이 여부
                __val = typeof _val !== 'undefined' ? _val : val;
                __val = __val === null ? '' : __val;  // null 등록 오류 처리
                if (this._valueTypes.length > 0) Type.matchType([this._valueTypes], __val);
                this.$value = __val;
                if (_oldVal !== __val && __val) this._onChanged(__val, _oldVal);    // 검사 및 이벤트 발생
            },
            configurable: true, // 재정의 허용
            enumerable: true
        });

        /**
         * 컬럼의 value 의 getter
         * 
         * @member {Function} MetaColumn#getter
         */
        Object.defineProperty(this, 'getter', {
            get: function() { return getter; },
            set: function(val) { 
                if(typeof val !== 'function') throw new ExtendError(/EL05134/, null, [this.constructor.name, typeof val]);
                getter = val;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 컬럼의 value 의 setter
         * 
         * @member {Function} MetaColumn#setter
         */
        Object.defineProperty(this, 'setter', {
            get: function() { return setter; },
            set: function(val) { 
                if(typeof val !== 'function') throw new ExtendError(/EL05135/, null, [this.constructor.name, typeof val]);
                setter = val;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 변경 이벤트 
         * 
         * @event MetaColumn#onChanged 
         * @param {function}    p_callback
         * @param {any}         p_callback.p_nValue 신규 value 값
         * @param {any}         p_callback.p_oValue 기존 value 값
         * @param {MetaColumn}  p_callback.p_this this(컬럼객체)
         */
        Object.defineProperty(this, 'onChanged', {
            set: function(fun) {
                this.$event.on('onChanged', fun);
            },
            configurable: false,
            enumerable: false,
        });
        
        if (p_property) this._load(p_property);
    }
    Util.inherits(MetaColumn, _super);

    MetaColumn._NS = 'Meta.Entity';                                 // namespace
    MetaColumn._PARAMS = ['columnName', '_entity'];    // creator parameter    // 
    MetaColumn._VALUE_TYPE = [String, Number, Boolean];

    /**
     * onChanged 이벤트를 발생합니다.
     * 
     * @param {*} p_nValue 변경 값
     * @param {*} p_oValue 기존 값
     * @listens MetaColumn#_onChanged
     */
    MetaColumn.prototype._onChanged = function(p_nValue, p_oValue) {
        p_oValue = p_oValue || this.$value;
        this.$event.emit('onChanged', p_nValue, p_oValue, this);
    };

    /**
     * 프로퍼티 객체로 속성 로드
     * 
     * @param {object} p_property 
     */
    MetaColumn.prototype._load = function(p_property) {
        if (typeof p_property === 'object' ) {
            for(var prop in p_property) {
                // if (p_property.hasOwnProperty(prop) &&
                if (Object.prototype.hasOwnProperty.call(p_property, prop) &&
                ['_valueTypes', 'alias', 'default', 'caption', 'value', 
                    'required', 'constraints', 'getter', 'setter'].indexOf(prop) > -1) {
                    this[prop] = p_property[prop];
                }
            }
        }
        if (['number', 'string', 'boolean'].indexOf(typeof p_property) > -1) {  
            this['value'] = p_property; 
        }
    };

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    MetaColumn.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (!Type.deepEqual(this.$event.$storage, {})) {
            obj['$storage'] = this.$event.$storage;
        }
        if (this.required !== false) obj['required'] = this.required;
        // if (this.optional !== false) obj['optional'] = this.optional;
        if (this.constraints.length > 0) obj['constraints'] = Util.deepCopy(this.constraints);
        if (this.getter !== null) obj['getter'] = this.getter;
        if (this.setter !== null) obj['setter'] = this.setter;
        // if (this.value !== null) obj['value'] = this.value;    // 오버라이딩
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.  
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    MetaColumn.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        // var origin = p_origin ? p_origin : p_oGuid;
        // var entity;

        if (p_oGuid['$storage']) {
            this.$event.$storage = p_oGuid['$storage'];
        }
        if (p_oGuid['required']) this.required = p_oGuid['required'];
        // if (p_oGuid['optional']) this.optional = p_oGuid['optional'];
        if (p_oGuid['constraints']) this.constraints = p_oGuid['constraints'];
        if (p_oGuid['getter']) this.getter = p_oGuid['getter'];
        if (p_oGuid['setter']) this.setter = p_oGuid['setter'];
        // if (p_oGuid['value']) this.value = p_oGuid['value'];
    };

    /**
     * 컬럼 복제
     * 
     * @param {BaseEntity} [p_entity] 지정한 엔티티로 복제
     * @returns {MetaColumn}
     */
    MetaColumn.prototype.clone = function(p_entity) {
        var clone;
        // var rObj = this.getObject();
        var entity = p_entity ? p_entity : this._entity;
        
        clone = new MetaColumn(this.columnName, entity);
        
        // BaseColumn
        if (this['default'] !== '') clone.default = this['default'];
        if (this['caption'] !== '') clone.caption = this['caption'];
        if (this['$alias'] !== null) clone.$alias = this['$alias'];
        if (this['$value'] !== null) clone.$value = this['$value'];
        
        // MetaColumn
        if (this['required']) clone.required = this['required'];
        // REVIEW: 배열 깊은 복제 해야 하는지 확인 필요
        if (this['constraints']) clone.constraints = this['constraints'];
        // REVIEW: 함수 깊은 복사 확인 필요
        if (this['getter']) clone.getter = this['getter'];
        if (this['setter']) clone.setter = this['setter'];
        
        return clone;
    };

    /**
     * 제약조건을 추가  
     * REVIEW: 정규식으로 반대 조건을 모두 나열 할수 있으므로, 항상 실패조건을 하는게 맞을지? 검토  
     * 
     * @param {Regexp} p_regex 정규표현식
     * @param {string} p_msg  regexp 입력시
     * @param {string} [p_code] regexp 입력시
     * @param {boolean} [p_condition] <기본값 false> 성공/실패 조건
     * @param {boolean} p_condition.false 실패조건이며<기본값>, 정규식이 매칭이 안되야 한다.
     * @param {boolean} p_condition.true 성공조건이며 정규식이 매칭이되어야 성공(통화)  
     */
    MetaColumn.prototype.addConstraint = function(p_regex, p_msg, p_code, p_condition) {
        p_condition = typeof p_condition === 'boolean' ? p_condition : true;

        var constraint = {};
        if (typeof p_regex === 'function') {
            this.constraints.push(p_regex);
            return;
        }
        if (!(p_regex instanceof RegExp)) throw new ExtendError(/EL05136/, null, []);
        if (!(typeof p_msg === 'string')) throw new ExtendError(/EL05137/, null, [typeof p_msg]);    

        constraint.regex = p_regex;
        constraint.msg = p_msg;
        constraint.code = p_code;
        constraint.condition = p_condition;
        
        this.constraints.push(constraint);
    };
    
    /**
     * 속성의 value에 유효성을 검사한다. (isNotnull, optional, constraints 기준)  
     * TODO: number, boolean 형이 입력될경우, 기본 제약 조건 valueTypes 검사여부 검토?, 예외가 아니고 메세지로 표현?  
     * 
     * @param {string | number | boolean} p_value 검사할 값
     * @param {object} result 메세지는 참조(객체)형 으로 전달
     * @param {number} p_option 1. required 참조 | 2: null검사 진행   |  3: null검사 무시
     * @returns {object | undefined} 리턴값이 없으면 검사 성공
     */
    MetaColumn.prototype.valid = function(p_value) {
        var result = {};
        var match;
        var value = null;
        
        result.value = p_value;
        result.msg = '';
        result.code = '';
        p_value = p_value || '';

        value = typeof p_value === 'number' ? String(p_value) : p_value;  // number 형 변환

        // 1. 기본값 얻기 문자열로 변경
        value = value.trim();

        // 2. 통과조건 검사
        if (this.required === false /* && this.optional === true */ && value.length === 0) return undefined;
        if (this.required === false && this.constraints.length === 0 ) return undefined;
        if (this.required === true && this.constraints.length === 0 && value.length > 0) return undefined;
        
        // 3. 실패조건 검사
        if (this.required === true && this.constraints.length === 0 && value.length === 0) {
            result.msg   = Message.get('EL05138', [this.name]);
            result.code  = 0;
            return result;
        }

        // 4. 제약조건 검사
        for(var i = 0; this.constraints.length > i; i++) {
            if (typeof this.constraints[i] === 'function') {
                // return this.constraints[i].call(this, this, value);     // 함수형 제약조건 REVIEW: 제거대상 

                // 함수는 false 또는 object 타입의 경우 실패로 처리
                var funReturn = this.constraints[i].call(this, value, this);     // 함수형 제약조건
                if (funReturn === true || typeof funReturn === 'undefined') continue;
                
                if (typeof funReturn === 'object' && typeof funReturn.msg === 'string') {
                    result.msg   = funReturn.msg;
                    result.code  = funReturn.code;
                } else {
                    result.msg = Message.get('EL05139', [this.name]);
                }
                return result;

            } else {
                match = value.match(this.constraints[i].regex);
                if ((this.constraints[i].condition === false && match !== null) ||    // 실패 조건
                    (this.constraints[i].condition === true && match === null)) {     // 성공 조건
                    result.msg   = Message.get('EL0513A', [this.name, this.constraints[i].msg]);
                    result.code  = this.constraints[i].code;
                    return result;
                }
            }
        }            
        return undefined;
    };

    return MetaColumn;

}(BaseColumn));

/**** object-column.js | ObjectColumn ****/
//==============================================================

var ObjectColumn  = (function (_super) {
    /**
     * 객체 컬럼
     * 
     * @constructs ObjectColumn
     * @extends BaseColumn
     * @param {string} p_name 객체컬럼명
     * @param {BaseEntity} [p_entity] 소유 BaseEntity
     * @param {object} [p_property] 
     * @param {object} p_property.default 기본값
     * @param {string} p_property.caption 설명
     * @param {object} p_property.value value 값
     * @param {string} p_property.alias 별칭
     */
    function ObjectColumn(p_name, p_entity, p_property) {
        _super.call(this, p_name, p_entity);

        if (p_property) this._load(p_property);
    }
    Util.inherits(ObjectColumn, _super);

    ObjectColumn._NS = 'Meta.Entity';     // namespace
    ObjectColumn._PARAMS = ['columnName', '_entity', '_property'];    // creator parameter
    ObjectColumn._VALUE_TYPE = [{}];    // union type


    /**
     *  프로퍼티 객체로 속성 로드
     * 
     * @param {object} p_prop 속성
     */
    ObjectColumn.prototype._load = function(p_prop) {
        if (typeof p_prop === 'object' ) {
            for(var prop in p_prop) {
                // if (p_property.hasOwnProperty(prop) &&
                if (Object.prototype.hasOwnProperty.call(p_prop, prop) &&
                    ['default', 'caption', 'value', 'alias'].indexOf(prop) > -1) {
                    this[prop] = p_prop[prop];
                }
            }
        } else throw new ExtendError(/EL05121/, null, ['p_prop', 'object']);
    };

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    ObjectColumn.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
        var defValue = this.default;
        var $value = this.$value;

        if (defValue instanceof MetaObject) {
            if (MetaRegistry.hasGuidObject(defValue, owned)) {
                obj['default'] = MetaRegistry.createReferObject(defValue);
            } else obj['default'] = defValue.getObject(vOpt, owned);
        }

        // $value 재정의
        if ($value instanceof MetaObject) {
            if (MetaRegistry.hasGuidObject($value, owned)) {
                obj['$value'] = MetaRegistry.createReferObject($value);
            } else obj['$value'] = $value.getObject(vOpt, owned);
        }
        return obj;                        
    };

    /**
     * 현재 객체를 guid 객체로 설정한다.  
     * override  
     * 
     * @param {object} p_oGuid 레벨 옵션
     * @param {object} p_origin 설정 원본 객체
     */
    ObjectColumn.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;
        var elem;

        // 주의! defuault 설정후 value 설정 :getObject() 와 동일
        elem = p_oGuid['default'];
        if (typeof elem === 'object' && elem !== null) {
            if (MetaRegistry.isGuidObject(elem)) {
                var obj = MetaRegistry.createMetaObject(elem, origin);
                obj.setObject(elem, origin);
                this['default'] = obj;
            
            } else if (elem['$ref']) {
                var meta = MetaRegistry.findSetObject(elem['$ref'], origin);
                if (!meta) throw new ExtendError(/EL05122/, null, [elem['$ref']]);
                this['default'] = meta;
            }
        }

        elem = p_oGuid['$value'];
        if (typeof elem === 'object' && elem !== null) {
            if (MetaRegistry.isGuidObject(elem)) {
                var obj2 = MetaRegistry.createMetaObject(elem, origin);
                obj2.setObject(elem, origin);
                this.$value = obj2;
            
            } else if (elem['$ref']) {
                var meta2 = MetaRegistry.findSetObject(elem['$ref'], origin);
                if (!meta2) throw new ExtendError(/EL05123/, null, [elem['$ref']]);
                this.$value = meta2;
            }
        }
    };

    /**
     * 객체 복제  
     * override  
     * 
     * @param {BaseEntity} [p_entity] 지정한 엔티티로 복제
     * @returns {ObjectColumn}
     */
    ObjectColumn.prototype.clone = function(p_entity) {
        var clone;
        var entity = p_entity ? p_entity : this._entity;
        
        clone = new ObjectColumn(this.columnName, entity);

        if (this['$value']) clone.$value = this.$value;
        if (this['$alias']) clone.$alias = this['$alias'];
        if (this['default']) clone.default = this['default'];
        if (this['caption']) clone.caption = this['caption'];

        return clone;
    };

    return ObjectColumn;

}(BaseColumn));

/**** base-column-collection.js | BaseColumnCollection ****/
//==============================================================

var BaseColumnCollection  = (function (_super) {
    /**
     * 컬럼 컬렉션 (최상위)
     * @abstract
     * @constructs BaseColumnCollection
     * @extends PropertyCollection
     * @param {object} p_owner 소유자 
     * @param {BaseColumn} [p_baseType] 기본 컬럼 타입
     */
    function BaseColumnCollection(p_owner, p_baseType) {
        _super.call(this, p_owner);
        
        var _baseType;

        /**
         * 기본 컬럼 타입
         * @member {BaseColumn} _L.Meta.Entity.BaseColumnCollection#_baseType
         */
        Object.defineProperty(this, '_baseType', {
            get: function() { return _baseType; },
            set: function(nVal) { 
                if (!(typeof nVal === 'function')) throw new ExtendError(/EL05141/, null, [this.constructor.name, typeof nVal]);
                // if (!(new nVal('temp') instanceof BaseColumn)) throw new ExtendError('ES032', ['_baseType', 'BaseColumn']);
                if (!(Type.isProtoChain(nVal, BaseColumn))) throw new ExtendError(/EL05142/, null, [this.constructor.name]);
                _baseType = nVal;
            },
            enumerable: false,
            configurable: false,
        });

        /**
         * @member {BaseColumn} BaseColumnCollection#baseType
         */
       this._baseType = p_baseType;
       // this._baseType = p_baseType || MetaColumn;

        // 예약어 등록 
        this.$KEYWORD = ['_baseType', '_ownerIsEntity', 'initValue', 'existAlias'];
        this.$KEYWORD = ['existColumnName', 'alias', 'addValue'];
    }
    Util.inherits(BaseColumnCollection, _super);
    
    BaseColumnCollection._NS = 'Meta.Entity';                   // namespace
    BaseColumnCollection._PARAMS = ['_owner', '_baseType'];     // creator parameter
    BaseColumnCollection._KIND = 'abstract';


    /**
     * this._onwer 이 엔티티 여부를 확인합니다.
     * @returns {boolean}
     */
    BaseColumnCollection.prototype._ownerIsEntity = function() {
        return this._owner instanceof MetaElement && this._owner.instanceOf('BaseEntity');
    };
    Object.defineProperty(BaseColumnCollection.prototype, '_ownerIsEntity', {
        enumerable: false
    });


    /**
     * 컬렉션에 요소를 추가할 때 설정되는 기본 기술자입니다.
     * @protected
     * @param {number} p_idx 인덱스 번호
     */
    BaseColumnCollection.prototype._getPropDescriptor = function(p_idx, p_enum) {
        if (typeof p_enum !== 'boolean') p_enum = true;
        return {
            get: function() { return this.$elements[p_idx]; },
            set: function() {
                throw new ExtendError(/EL05148/, null, []);
                // var oVal = this.$elements[p_idx];
                // if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], nVal);
                // this._onChanging(p_idx, nVal, oVal);  // before event
                // this.$elements[p_idx] = nVal;
                // this._onChanged(p_idx, nVal, oVal);   // after event
            },
            configurable: true,
            enumerable: p_enum,
        };
    };
    Object.defineProperty(BaseColumnCollection.prototype, '_getPropDescriptor', {
        enumerable: false
    });

    /**
     * 컬럼을 컬렉션에 추가
     * @param {string} p_name 컬럼명
     * @param {any} p_value 컬럼객체
     * @returns {number} 추가한 index 
     */
    BaseColumnCollection.prototype.add = function(p_name, p_value) {
        
        if (this._ownerIsEntity() && this._owner.rows.count > 0) throw new ExtendError(/EL05143/, null, [this._owner.rows.count]);
        if (this.existColumnName(p_name)) throw new ExtendError(/EL05144/, null, [this.constructor.name, p_name]);
        if (this.existAlias(p_name)) throw new ExtendError(/EL05145/, null, [this.constructor.name, p_name]); 
        
        return _super.prototype.add.call(this, p_name, p_value);
    };
    Object.defineProperty(BaseColumnCollection.prototype, 'add', {
        enumerable: false
    });

    /**
     * 컬럼을 컬렉션에서 삭제
     * @param {number} p_idx 
     * @returns {boolean}
     */
    BaseColumnCollection.prototype.removeAt = function(p_idx) {
        if (this._owner.rows.count > 0) throw new ExtendError(/EL05146/, null, [this._owner.rows.count]);
        return _super.prototype.removeAt.call(this, p_idx); 
    };
    Object.defineProperty(BaseColumnCollection.prototype, 'removeAt', {
        enumerable: false
    });

    /**
     * 컬렉에 모든 value 값을 default 값으로 초기화
     */
    BaseColumnCollection.prototype.initValue  = function() {
        for (var i = 0; this.count > i; i++) {
            this[i].value = this[i].default;
        }
    };
    Object.defineProperty(BaseColumnCollection.prototype, 'initValue', {
        enumerable: false
    });

    /**
     * 컬렉션에 별칭 이름(키)가 존재하는지 검사
     * @param {string} p_key 이름
     * @returns {boolean}
     */
    BaseColumnCollection.prototype.existAlias  = function(p_key) {
        for (var i = 0; this.count > i; i++) {
            if (this[i].alias === p_key) return true;
        }
        return false;
    };
    Object.defineProperty(BaseColumnCollection.prototype, 'existAlias', {
        enumerable: false
    });

    /**
     * 컬렉션에 컬럼 이름(키)이 존재하는지 검사
     * @param {string} p_key 이름
     * @returns {boolean}
     */
    BaseColumnCollection.prototype.existColumnName  = function(p_key) {
        for (var i = 0; this.count > i; i++) {
            if (this[i].columnName === p_key) return true;
        }
        return false;
    };
    Object.defineProperty(BaseColumnCollection.prototype, 'existColumnName', {
        enumerable: false
    });

    /**
     * 별칭에 대한 컬럼 객체 얻기
     * @param {string} p_key 키
     * @returns {BaseColumn | undefined}
     */
    BaseColumnCollection.prototype.alias  = function(p_key) {
        for (var i = 0; this.count > i; i++) {
            if (this[i].alias === p_key) return this[i];
        }
        return undefined;
    };
    Object.defineProperty(BaseColumnCollection.prototype, 'alias', {
        enumerable: false
    });

    /** @abstract */
    BaseColumnCollection.prototype.addValue = function() {
        throw new ExtendError(/EL05147/, null, []);
    };
    Object.defineProperty(BaseColumnCollection.prototype, 'addValue', {
        enumerable: false
    });

    return BaseColumnCollection;

}(PropertyCollection));

/**** collection-meta-view-column.js | MetaViewColumnCollection ****/
//==============================================================

var MetaViewColumnCollection  = (function (_super) {
    /**
     * 메타 뷰 컬럼 컬렉션
     * 
     * @constructs MetaViewColumnCollection
     * @extends BaseColumnCollection
     * @param {object} p_owner 소유자
     */
    function MetaViewColumnCollection(p_owner) {
        _super.call(this, p_owner, MetaColumn);

        /** 
         * 참조하는 엔티티 목록
         * 
         * @readonly
         * @member {array<BaseEntity>} MetaViewColumnCollection#_refEntities
         */
        Object.defineProperty(this, '_refEntities', {
            get: function() { 
                var arr = [];
                for (var i = 0; i < this.count; i++) {
                    var column = this[i];
                    if (this._owner !== column._entity && arr.indexOf(column._entity) < 0) {
                        arr.push(column._entity);
                    }
                }
                return arr; 
            },
            configurable: false,
            enumerable: false
        });

        // 예약어 등록 
        this.$KEYWORD = ['_refEntities', 'addValue', 'addEntity'];
    }
    Util.inherits(MetaViewColumnCollection, _super);

    MetaViewColumnCollection._NS = 'Meta.Entity';                       // namespace
    MetaViewColumnCollection._PARAMS = ['_owner', '_baseCollection'];   // creator parameter

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    MetaViewColumnCollection.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        
        if (vOpt === 0) {   // 참조로 바꿈
            for (var i = 0; i < obj['_elem'].length; i++) {
                var elem = obj['_elem'][i];
                if (vOpt < 2 && vOpt > -1 && elem['_entity'] && elem['_entity']['$ref'] !== this._owner._guid) {
                    var rObj = MetaRegistry.createReferObject(elem); // 소유자가 아니면 참조 리턴
                    obj['_elem'][i] = rObj;
                }
            }
        }
        return obj;                  
    };
    Object.defineProperty(MetaViewColumnCollection.prototype, 'getObject', {
        enumerable: false
    });

    /**
     * 뷰컬렉션에 컬럼을 추가(등록/설정)한다.  
     * - entity가 있는 컬럼을 추가할 경우 : 참조가 추가되는 것이다.  
     *      + collection 존재할 경우 최상위 컬렉션에도 참조가 등록된다.  
     * - entity가 없는 컬럼을 추가할 경우 : 자신을 소유자로 등록한다.  
     * - collection에 컬럼이 존재할 경우 : columns 객체는 무시되고, 리턴한 객체의 참조를 등록한다.  
     * - collection에 컬럼이 없을 경우 : 컬렉션에 entity를 설정한다.(참조 재귀호출시 최상위만 등록됨)  
     *      + collection 존재할 경우 entity 항상 존재한다.  
     * - entity가 있는 컬럼을 추가할 경우 : 참조가 추가되는 것이다.  
     * - entity가 없는 컬럼을 추가할 경우 : 자신을 소유자로 등록한다.  
     * - collection에 컬럼이 존재할 경우 : columns 객체는 무시되고, 리턴한 객체의 참조를 등록한다.  
     * - collection에 컬럼이 없을 경우 : 컬렉션에 entity를 설정한다.(참조 재귀호출시 최상위만 등록됨)  
     * 
     * @param {string | MetaColumn} p_column 컬럼
     * @param {BaseColumnCollection} [p_refCollection] 참조컬렉션
     */
    MetaViewColumnCollection.prototype.add  = function(p_column, p_refCollection) {
        var collection;
        var key;
        var column;

        if (p_refCollection && !(p_refCollection instanceof BaseColumnCollection)) {
            throw new ExtendError(/EL05161/, null, []);
        }

        if (p_column instanceof BaseColumn) {
            key = p_column.columnName;
            column = p_column;
        } else if (typeof p_column === 'string') {
            key = p_column;
            column = new this._baseType(key, this._owner);
        } else throw new ExtendError(/EL05162/, null, [typeof p_column]);

        // baseCollection & refCollection 존재하는 경우
        if (p_refCollection instanceof BaseColumnCollection) {                                  
            collection = p_refCollection;
        } else if (this._owner && this._owner._baseEntity && this._owner._baseEntity.columns) { 
            collection = this._owner._baseEntity.columns;
        }
        
        // 컬렉션이 있는 경우 : _entity 항상 존재
        if (collection) {
            if (collection.contains(collection[key])) {
                column = collection[key];   // 기존에 존재하면 참조 가져옴
            } else {                                                
                collection.add(p_column);      // 없으면 컬렉션에 추가(owner 설정됨)
                column = collection[key];
            }
        }
        if (!column._entity && this._ownerIsEntity()) column._entity = this._owner;
        // if (!column._entity) column._entity = this._owner;

        return _super.prototype.add.call(this, key, column);
    };
    Object.defineProperty(MetaViewColumnCollection.prototype, 'add', {
        enumerable: false
    });

    /**
     *  이름과 값으로 컬럼 생성하여 컬렉션에 추가
     * 
     * @param {string} p_name 컬럼명
     * @param {string | number | boolean} p_value 값
     * @param {BaseColumnCollection} [p_refCollection]
     * @returns {MetaColumn}
     */
    MetaViewColumnCollection.prototype.addValue  = function(p_name, p_value, p_refCollection) {
        var item;
        var property = {};
        var _valueTypes = this._baseType._VALUE_TYPE;

        if (typeof p_name !== 'string') throw new ExtendError(/EL05163/, null, [typeof p_name]);
        if (_valueTypes.length > 0) Type.matchType([_valueTypes], p_value);
        
        property = { value: p_value };
        item = new this._baseType(p_name, null, property);

        return this[this.add(item, p_refCollection)];
    };
    Object.defineProperty(MetaViewColumnCollection.prototype, 'addValue', {
        enumerable: false
    });

    /**
     * 엔티티의 모든 컬럼을 추가
     * 
     * @param {BaseEntity} p_entity 
     */
    MetaViewColumnCollection.prototype.addEntity  = function(p_entity) {
        if (typeof p_entity !== 'undefined' && !(p_entity instanceof MetaElement && p_entity.instanceOf('BaseEntity'))) {
            throw new ExtendError(/EL05164/, null, []);
        }

        for (var i = 0; p_entity.columns.count > i; i++) {
            this.add(p_entity.columns[i]);
        }
    };
    Object.defineProperty(MetaViewColumnCollection.prototype, 'addEntity', {
        enumerable: false
    });
    
    return MetaViewColumnCollection;

}(BaseColumnCollection));

/**** collection-meta-table-column.js | MetaTableColumnCollection ****/
//==============================================================

var MetaTableColumnCollection  = (function (_super) {
    /**
     * 테이블 컬럼 컬렉션    
     * 참조 컬럼은 독립적으로 가진다 (참조 금지)  
     * 
     * @constructs MetaTableColumnCollection
     * @extends BaseColumnCollection
     * @param {object} p_owner 소유자
     */
    function MetaTableColumnCollection(p_owner) {
        _super.call(this, p_owner, MetaColumn);

        // 예약어 등록 
        this.$KEYWORD = ['addValue'];
    }
    Util.inherits(MetaTableColumnCollection, _super);

    MetaTableColumnCollection._NS = 'Meta.Entity';          // namespace
    MetaTableColumnCollection._PARAMS = ['_owner'];         // creator parameter

    /**
     * 테이블 컬렉션에 컬럼 추가
     * 
     * @param {string | BaseColumn} p_column 컬럼명, 매타컬럼
     * @returns {number} 등록한 index
     */
    MetaTableColumnCollection.prototype.add  = function(p_column) {
        var column;
        var key;

        if (typeof p_column === 'string') {      
            key  = p_column;
            if (this._ownerIsEntity()) column = new this._baseType(key, this._owner);
            else column = new this._baseType(key);
            
        } else if (p_column instanceof BaseColumn) {
            key  = p_column.columnName;
            if (this._ownerIsEntity() && p_column._owner !== this._owner) {
                column = p_column.clone(this._owner);
            } else column = p_column;
            // if (this._ownerIsEntity()) column = p_column.clone(this._owner);
            // else column = p_column.clone();
            
        } else {
            throw new ExtendError(/EL05151/, null, [typeof p_column]); 
        }

        return _super.prototype.add.call(this, key, column);
    };
    Object.defineProperty(MetaTableColumnCollection.prototype, 'add', {
        enumerable: false
    });

    /**
     * 이름과 값으로 컬렉션에 추가 (내부에서 생성)
     * 
     * @param {string} p_name 컬럼명
     * @param {string | number | boolean} p_value 값
     * @returns {BaseColumn} 추가한 컬럼 객체
     */
    MetaTableColumnCollection.prototype.addValue  = function(p_name, p_value) {
        var item;
        var property = {};
        var _valueTypes = this._baseType._VALUE_TYPE;

        if (typeof p_name !== 'string') throw new ExtendError(/EL05152/, null, [typeof p_name]);
        if (_valueTypes.length > 0) Type.matchType([_valueTypes], p_value);
        
        property = { value: p_value };
        item = new this._baseType(p_name, this._owner, property);

        return this[this.add(item)];
    };
    Object.defineProperty(MetaTableColumnCollection.prototype, 'addValue', {
        enumerable: false
    });

    return MetaTableColumnCollection;

}(BaseColumnCollection));

/**** base-entity.js | BaseEntity ****/
//==============================================================

var BaseEntity  = (function (_super) {
    /**
     * 기본 엔티티 (최상위)
     * 
     * @abstract
     * @constructs BaseEntity
     * @extends MetaElement
     * @implements {IGroupControl}
     * @implements {ISchemaControl}
     * @implements {IImportControl}
     * @implements {IExportControl}
     * @implements {ISerialize}
     * @param {string} p_name 
     */
    function BaseEntity(p_name) {
        _super.call(this, p_name);

        var _metaSet    = null;
        var rows        = new MetaRowCollection(this);

        /**
         * 엔티티의 아이템(속성) 컬렉션
         * 
         * @member {MetaSet} BaseEntity#_metaSet
         */
        Object.defineProperty(this, '_metaSet', {
            get: function() { return _metaSet; },
            set: function(nVal) { 
                if (!(nVal instanceof MetaElement && nVal.instanceOf('MetaSet'))) {
                    throw new ExtendError(/EL05311/, null, [this.constructor.name]);
                }
                _metaSet = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 엔티티의 아이템(속성) 컬렉션
         * 
         * @readonly
         * @member {BaseColumnCollection} BaseEntity#columns
         */
        Object.defineProperty(this, 'columns', {
            get: function() { 
                throw new ExtendError(/EL05312/, null, [this.constructor.name]);
            },
            configurable: true, // 하위에서 재정의 해야함
            enumerable: true
        });
        
        /**
         * columns 별칭
         * 
         * @member {object} BaseEntity#cols
         */
        Object.defineProperty(this, 'cols', {
            get: function() { return this.columns; },
            set: function(nVal) { this.columns = nVal;},
            configurable: true,
            enumerable: false
        });

        /**
         * 엔티티의 데이터(로우) 컬렉션
         * 
         * @readonly
         * @member {MetaRowCollection} BaseEntity#rows
         */
        Object.defineProperty(this, 'rows', {
            get: function() { return rows; },
            configurable: false,
            enumerable: true
        });

        Util.implements(BaseEntity, this);      // strip:
    }
    Util.inherits(BaseEntity, _super);
    
    BaseEntity._UNION = [IGroupControl, ISchemaControl, IImportControl, IExportControl, ISerialize];
    BaseEntity._NS = 'Meta.Entity';         // namespace
    BaseEntity._PARAMS = ['name'];          // creator parameter
    BaseEntity._KIND = 'abstract';

    
    // local funciton
    function _isObject(obj) {    // 객체 여부
        if (typeof obj === 'object' && obj !== null) return true;
        return false;
    }
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }
    function _isSchema(obj) {    // 객체 여부
        if (!_isObject(obj)) return false;
        if (_isObject(obj['columns']) || _isObject(obj['rows'])) return true;
        return false;
    }

    
    /**
     * 엔티티 스카마 객체로 변환
     * 
     * @param {object} p_oGuid getObject()로 얻은 객체
     * @static
     * @returns {object}
     */
    BaseEntity.transformSchema  = function(p_oGuid) {
        var obj = {};
        var oGuid = p_oGuid;

        try {
            if (!_isSchema(p_oGuid)) { 
                throw new ExtendError(/EL05331/, null, [p_oGuid.columns, p_oGuid.rows]);
            }

            if (oGuid['_guid']) obj['_guid'] = oGuid['_guid'];
            if (oGuid['_baseEntity']) obj['_baseEntity'] = oGuid['_baseEntity'];
            obj['columns'] = $transformColumn(oGuid['columns'], oGuid);
            obj['rows'] = $transformRow(oGuid['rows'], oGuid);
            
        } catch (error) {
            throw new ExtendError(/EL05332/, error, []);
        }
        
        return obj;

        // inner funciton
        function $transformColumn(oGuid, origin) {
            var obj = {};
            for (var i = 0; i < oGuid['_elem'].length; i++) {
                var column = oGuid['_elem'][i];
                var key = oGuid['_key'][i];
                obj[key] = {};
                if (column['$ref']) obj[key] = column;
                else {
                    if (column['_entity'] && column['_entity']['$ref'] !== origin['_guid']) {
                        obj[key]._entity = {};
                        obj[key]._entity['$ref'] = column['_entity']['$ref'];
                    } 
                    if (typeof column._guid !== 'undefined') obj[key]._guid = column['_guid'];
                    if (typeof column.default !== 'undefined') obj[key].default = column['default'];
                    if (typeof column.caption !== 'undefined') obj[key].caption = column['caption'];            
                    if (typeof column.required !== 'undefined') obj[key].required = column['required'];
                    // if (column.optional) obj[key].optional = column['optional'];
                    if (Array.isArray(column.constraints)) {
                        obj[key]['constraints'] = Util.deepCopy(column['constraints']);
                    }
                    if (typeof column.getter !== 'undefined') obj[key].getter = column['getter'];
                    if (typeof column.setter !== 'undefined') obj[key].setter = column['setter'];
                    if (typeof column.$alias !== 'undefined') obj[key].alias = column['$alias'];
                    if (typeof column.$value !== 'undefined') obj[key].value = column['$value'];
                }
            }
            obj['$key'] = oGuid['_key'];
            return obj;
        }
        function $transformRow(oGuid) {
            var arr = [];
            for (var i = 0; i < oGuid['_elem'].length; i++) {
                var rows = oGuid['_elem'][i];
                var obj = {};
                for (var ii = 0; ii < rows['_elem'].length; ii++) {
                    var row = rows['_elem'][ii];
                    var key = rows['_key'][ii];
                    obj[key] = row;
                }
                arr.push(obj);
            }
            return arr;
        }
    };
    
    /**
     * 엔티티 대상에 로우 만들기
     * 
     * @protected
     * @param {BaseEntity} p_entity 빌드 대상 엔티티
     * @param {function} p_callback 로우 대상 조회 콜백
     * @param {array<string>} p_items 선택할 로우명 , [] 또는 undefined 시 전체 선택    TODO: 필수 선택 여부 확인 필요
     * @returns {BaseEntity}
     */
    BaseEntity.prototype._buildEntity = function(p_entity, p_callback, p_items) {
        var orignal = this.clone();
        var columnName;
        var column;

        try {
            // columns 구성
            if (p_items.length === 0) {
                for (var i = 0; i < this.columns.count; i++) {
                    p_entity.columns.add(this.columns[i]);  // 참조로 등록
                }

            } else {
                for (var j = 0; j < p_items.length; j++) {
                    columnName = p_items[j];
                    if (!_isString(columnName)) throw new ExtendError(/EL05321/, null, [i, typeof columnName]);
                    if (!this.columns.exists(columnName)) throw new ExtendError(/EL05322/, null, [columnName]);
                    
                    column = this.columns.alias(columnName);
                    p_entity.columns.add(column);
                }
            }

            // rows 등록
            for (var k = 0; k < orignal.rows.count; k++) {  
                if (!p_callback || (typeof p_callback === 'function' 
                    && p_callback.call(this, orignal.rows[k], k, p_entity))) {
                    p_entity.rows.add($createRow(orignal.rows[k]));
                } 
            }
            return p_entity;
            
        } catch (error) {
            throw new ExtendError(/EL05323/, error, []);
        }

        // inner function
        function $createRow(row) {
            var alias, newRow;
            newRow = p_entity.newRow();
            for (var m = 0; m < p_entity.columns.count; m++) {
                alias = p_entity.columns[m].alias;
                newRow[alias] = row[alias];
            }
            return newRow;
        }
    };

    /**
     * BaseEntity 읽기(로드)
     * 
     * @protected
     * @param {BaseEntity} p_object 대상 엔티티
     * @param {number} p_option 옵션
     */
    BaseEntity.prototype._readEntity = function(p_entity, p_option) {
        var opt = p_option || 3;
        var _this = this;

        try {
            if (!(p_entity instanceof BaseEntity)) throw new ExtendError(/EL05324/, null, []);
            if (typeof opt !== 'number') throw new ExtendError(/EL05325/, null, [typeof opt]);
        
            if (opt % 2 === 1) $loadColumn(); // opt: 1, 3
            if (Math.floor(opt / 2) >= 1) $loadRow(); // opt: 2, 3
            return;
            
        } catch (error) {
            throw new ExtendError(/EL05326/, error, [opt]);
        }

        // inner function
        function $loadColumn() {
            if (_this.rows.count > 0 ) throw new ExtendError(/EL05327/, null, [opt]);
            for (let i = 0; i < p_entity.columns.count; i++) {
                var column = p_entity.columns[i].clone();
                var key = p_entity.columns.indexToKey(i);
                if (_this.columns.exists(key)) throw new ExtendError(/EL05328/, null, [key]);
                _this.columns.add(column);
            }
        }
        function $loadRow() {    // 컬럼 기준으로 로우를 가져온다.
            for (let i = 0; i < p_entity.rows.count; i++) {
                var row = _this.newRow(this);
                for (let ii = 0; ii < _this.columns.count; ii++) {
                    var key = _this.columns.indexToKey(ii);
                    row[key] = p_entity.rows[i][key];
                }
                _this.rows.add(row);
            }
        }
    };


    /**
     * 스키마 읽기
     * 
     * @param {object} p_obj 대상 객체
     * @param {boolean} [p_createRow=false] 기본값 = false, 컬럼이 없을경우 로우이름의 컬럼 생성 여부
     * @param {object} [p_origin] 원본 객체
     */
    BaseEntity.prototype._readSchema  = function(p_obj, p_isCreateRow, p_origin) {
        var _this = this;
        var obj = p_obj;
        var columns;
        var rows = [];
        var Column = this.columns._baseType;
        var origin = p_origin ? p_origin : p_obj;
        
        try {

            if (obj['_guid']) MetaRegistry.setMetaObject(obj, this); 

            if (obj._baseEntity && obj._baseEntity['$ref']) {
                obj['_baseEntity'] = MetaRegistry.findSetObject(obj._baseEntity['$ref'], origin);
                if (!obj['_baseEntity']) throw new ExtendError(/EL05329/, null, [obj._baseEntity['$ref']]);
            }
            columns = obj['columns'];
            if (columns) {
                // 1. $key 인덱스 기준으로 컬럼명 추출
                if (columns['$key'] && Array.isArray(columns['$key'])) {
                    for (var i = 0; i < columns['$key'].length; i++) {
                        $addColumn(columns['$key'][i], columns);
                    }
                // 2. 무작위로 컬럼명 추출
                } else for (var j in columns) $addColumn(j, columns);
            }
            // opt
            if (p_isCreateRow === true && obj['rows']) {
                // rows = obj['rows'];
                if (Array.isArray(obj['rows'])) rows = obj['rows'];
                else rows.push(obj['rows']);

                if (Array.isArray(rows) && rows.length > 0 && typeof rows[0] === 'object') {
                    for (var k in rows[0]) {    // rows[0] 기준
                        if (Object.prototype.hasOwnProperty.call(rows[0], k) && !this.columns.existAlias(k)) {
                            // var prop = rows[0][key];
                            if (!this.columns.exists(k)) {
                                var column = new Column(k, this);
                                this.columns.add(column);
                            }
                        }
                    }
                }
            }

        } catch (error) {
            throw new ExtendError(/EL0532A/, error, []);
        }

        // innner function
        function $addColumn(key, columns) {
            var column;
            
            if (!_isObject(columns[key])) columns[key] = { value: columns[key] }; 
            // REVIEW: 조건문 필요성 검토
            if (_isObject(columns[key])) {
                if (_this.rows.count > 0 ) throw new ExtendError(/EL0532B/, null, []);
                var prop = columns[key];
                var obj = {};
                if (_isObject(prop) && prop['$ref']) {
                    column = MetaRegistry.findSetObject(prop['$ref'], origin);
                    if (!column) throw new ExtendError(/EL0532C/, null, [key, prop['$ref']]);
                } else {
                    if (_isObject(prop['_entity']) && prop['_entity']['$ref']) {
                        prop['_entity'] = MetaRegistry.findSetObject(prop['_entity']['$ref'], origin);
                        if (!prop['_entity']) throw new ExtendError(/EL0532D/, null, [key, '_entity']);
                    }
                    for (var p in prop) obj[p] = prop[p];

                    column = new Column(key, null, obj);
                }
                if(prop['_guid']) MetaRegistry.setMetaObject(prop, column); 
                if (_this.columns.exists(key)) throw new ExtendError(/EL0532E/, null, [key]);
                _this.columns.add(column);
            }
        }
    
    };
    
    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BaseEntity.prototype.getObject = function(p_vOpt, p_owned) {
        var obj;
        var vOpt = p_vOpt || 0;
        var owned;

        obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (vOpt < 2 && vOpt > -1 && this._metaSet) {
            obj['_metaSet'] = MetaRegistry.createReferObject(this._metaSet);
        }
        obj['columns'] = this.columns.getObject(vOpt, owned);
        obj['rows'] = this.rows.getObject(vOpt, owned);
        return obj;                        
    };

    /** 
     * rows(데이터) 초기화 한다
     */
    BaseEntity.prototype.clear = function() {
        this.rows.clear();
    };

    /** 
     * columns, rows(데이터)를 초기화 한다
     */
    BaseEntity.prototype.reset = function() {
        
        this.rows.clear();
        this.columns.clear();
    };

    /**
     * 새로운 MetaRow 를 추가한다.  
     * 
     * @returns {MetaRow} columns 구조의 row를 생성
     */
    BaseEntity.prototype.newRow  = function() {
        return new MetaRow(this);
    };

    /**
     * 컬럼의 value 값을 MetaRow 타입 객체로 얻기
     * 
     * @returns {MetaRow}
     */
    BaseEntity.prototype.getValue  = function() {
        var row = this.newRow();

        for(var i = 0; this.columns.count > i; i++) {
            var value = this.columns[i].value;    
            row[i] = value === null ? this.columns[i].default : value;
        }
        return row;
    };

    /**
     * MetaRow 의 값을 컬럼의 value에 설정한다.
     * 
     * @param {MetaRow} p_row 로우
     */
    BaseEntity.prototype.setValue  = function(p_row) {
        var alias = '';

        try {
            if (!(p_row instanceof MetaRow)) throw new ExtendError(/EL05333/, null, []);
            for(var i = 0; this.columns.count > i; i++) {
                alias = this.columns[i].alias;        // 별칭이 없을시 name 설정됨
                this.columns[i].value = p_row[alias];
            }
            
        } catch (error) {
            throw new ExtendError(/EL05334/, error, []);
        }
    };

    /**
     * 엔티티(테이블/뷰)와 병합
     * 
     * @param {BaseEntity} p_target 병할할 대상
     * @param {object} p_option 옵션
     * @param {object} p_option.0 로우(idx) 기준 병합, 초과 컬럼은 무시됨 <**>   
     * @param {object} p_option.1 컬럼(key) 기준 병합, 초과 로우는 무시됨
     * @param {object} p_option.2 로우(idx) 기준 병합, 초과 컬럼은 채워짐
     * @param {object} p_option.3 컬럼(key) 기준 병합, 초과 로우는 채워짐 
     * @param {boolean} [p_matchType] 로우 유효성 검사 유무 (기본:false)
     */
    BaseEntity.prototype.merge  = function(p_target, p_option, p_matchType) {
        var _this = this;
        var opt = p_option || 0;
        var alias, newRow, tarRow, tarRows, tarColumns;
        var tempRows = [], clone;
        var target;

        
        try {
            // 1. 유효성 검사
            if (!(p_target instanceof BaseEntity)) throw new ExtendError(/EL05341/, null, []);
            if (typeof p_option !== 'number') throw new ExtendError(/EL05342/, null, [typeof p_option]);

            // 2. 타겟 복제본 만들기
            target = p_target.clone();

            // opt = 0
            if (opt === 0) $mergeByRow();
            // opt = 1
            if (opt === 1) $mergeByColumn();
            // opt = 2
            if (opt === 2) $mergeByRowFill();
            // opt = 3
            if (opt === 3) $mergeByColumnFill();

        } catch (error) {
            throw new ExtendError(/EL05347/, error, [opt]);
        }

        // innner function
        function $mergeByRow() {    // opt = 0
            // 3-1. 로우 임시 저장 및 초기화 
            for (var i = 0; i < _this.rows.count; i++) {
                tempRows.push(_this.rows[i].clone());
            }
            _this.rows.clear();
            // 3-2. 원본 row 추가
            for (var j = 0; j < tempRows.length; j++) {
                newRow = _this.newRow();
                for (var k = 0; k < _this.columns.count; k++) {
                    alias = _this.columns[k].alias;
                    if (tempRows[j][alias]) newRow[alias] = tempRows[j][alias];
                }
                _this.rows.add(newRow, p_matchType);
            }
            // 3-3. 타겟 row 추가
            tarRows = target.rows;
            for (var m = 0; m < tarRows.count; m++) {
                newRow = _this.newRow();
                tarRow = tarRows[m];
                for (var n = 0; n < _this.columns.count; n++) {
                    alias = _this.columns[n].alias;
                    if (tarRow[alias]) newRow[alias] = tarRow[alias];
                }
                _this.rows.add(newRow, p_matchType);
            }
        }
        function $mergeByColumn() {     // opt = 1
            tarColumns = target.columns;
            tarRows = target.rows;
            // 3-1. 컬럼 중복 검사
            for (var i = 0; i < tarColumns.count; i++) {
                alias = tarColumns[i].alias;
                if (_this.columns.exists(alias)) throw new ExtendError(/EL05343/, null, [i, alias]);
                if (_this.columns.existAlias(alias)) throw new ExtendError(/EL05344/, null, [i, alias]);
            }
            // 3-2. 로우 임시 저장 및 초기화 
            for (var j = 0; j < _this.rows.count; j++) {
                tempRows.push(_this.rows[j].clone());
            }
            _this.rows.clear();
            // 3-3. 컬럼 추가
            for (var k = 0; k < tarColumns.count; k++) {
                clone = tarColumns[k].clone(_this);
                var key = tarColumns[k].alias;
                clone.columnName = key;
                clone.$key = key;
                // clone.__SET$$key(key, clone);
                _this.columns.add(clone);
            }
            // 3-4. 로우 추가 (기준:idx)
            for (var m = 0; m < tempRows.length; m++) {
                newRow = _this.newRow();
                for (var n = 0; n < _this.columns.count; n++) {
                    alias = _this.columns[n].alias;
                    if (tempRows[m][alias]) {                         // 원본 로우
                        newRow[alias] = tempRows[m][alias];
                        continue;
                    } else if (tarRows[m] && tarRows[m][alias]) newRow[alias] = tarRows[m][alias]; // 타겟 로우
                }
                _this.rows.add(newRow, p_matchType);
            }    
        }
        function $mergeByRowFill() {    // opt = 2
            tarColumns = target.columns;
            tarRows = target.rows;
            // 3-1. 로우 임시 저장 및 초기화 
            for (var i = 0; i < _this.rows.count; i++) {
                tempRows.push(_this.rows[i].clone());
            }
            _this.rows.clear();
            // 3-2. 컬럼 추가
            for (var j = 0; j < tarColumns.count; j++) {
                alias = tarColumns[j].alias;
                if (!_this.columns.exists(alias)) {
                    clone = tarColumns[j].clone(_this);
                    clone.name = alias;
                    _this.columns.add(clone);
                }
            }
            // 3-3. 로우 추가 : 원본
            for (var k = 0; k < tempRows.length; k++) {
                newRow = _this.newRow();
                for (var m = 0; m < _this.columns.count; m++) {
                    alias = _this.columns[m].alias;
                    if (tempRows[k][alias]) newRow[alias] = tempRows[k][alias];
                }
                _this.rows.add(newRow, p_matchType);
            }
            // 3-4. 로우 추가 : 타겟
            for (var n = 0; n < tarRows.count; n++) {
                newRow = _this.newRow();
                for (var p = 0; p < _this.columns.count; p++) {
                    alias = _this.columns[p].alias;
                    if (tarRows[n][alias]) newRow[alias] = tarRows[n][alias];
                }
                _this.rows.add(newRow, p_matchType);
            }
        }
        function $mergeByColumnFill() { // opt = 3
            tarColumns = target.columns;
            tarRows = target.rows;
            // 3-1. 컬럼 중복 검사
            for (var i = 0; i < tarColumns.count; i++) {
                alias = tarColumns[i].alias;
                if (_this.columns.exists(alias)) throw new ExtendError(/EL05345/, null, [i, alias]);
                if (_this.columns.existAlias(alias)) throw new ExtendError(/EL05346/, null, [i, alias]);
            }
            // 3-2. 로우 임시 저장 및 초기화 
            for (var j = 0; j < _this.rows.count; j++) {
                tempRows.push(_this.rows[j].clone());
            }
            _this.rows.clear();
            // 3-3. 컬럼 추가
            for (var k = 0; k < tarColumns.count; k++) {
                clone = tarColumns[k].clone(_this);
                clone.columnName = tarColumns[k].alias;
                _this.columns.add(clone);
            }
            // 3-4. 로우 추가 (idx)
            for (var m = 0; m < tempRows.length; m++) {
                newRow = _this.newRow();
                for (var n = 0; n < _this.columns.count; n++) {
                    alias = _this.columns[n].alias;
                    if (tempRows[m][alias]) {                         // 원본 로우
                        newRow[alias] = tempRows[m][alias];
                        continue;
                    }else newRow[alias] = tarRows[m][alias]; // 타겟 로우
                }
                _this.rows.add(newRow, p_matchType);
            }     
            // 3-5. 타겟 로우가 클 경우 로우 추가
            if (tempRows.length < tarRows.count) {
                for (var p = tempRows.length; p < tarRows.count; p++) {
                    newRow = _this.newRow();
                    for (var q = 0; q < _this.columns.count; q++) {
                        alias = _this.columns[q].alias;
                        if (tarRows[p][alias]) newRow[alias] = tarRows[p][alias];
                    }
                    _this.rows.add(newRow, p_matchType);
                }
            }
        }
    };

    /**
     * 엔티티의 지정한 컬럼과 조건의 row 를 조회
     * 
     * @param {function | array<string>| arguments<string>} p_filter 필터
     * @param {array<string> | arguments<string>} [p_args] filter 설정시 컬럼명
     * @returns {MetaRow[]}
     */
    BaseEntity.prototype.select  = function(p_filter, p_args) {
        var args = Array.prototype.slice.call(arguments);
        var MetaView;
        var columnNames = [];
        var callback;
        var view;
        var selectList = [];

        try {
            args = Array.prototype.slice.call(arguments);
            MetaView = MetaRegistry.namespace.find('Meta.Entity.MetaView');
            
            if (!MetaView) throw new ExtendError(/EL05335/, null, ['Meta.Entity.MetaView']);
            
            view = new MetaView('select');

            // 매개변수 구성
            if (typeof p_filter === 'function') {
                callback = p_filter;
                if (Array.isArray(p_args)) columnNames = p_args;
                else if (args.length > 1) columnNames = args.splice(1);
            } else if (Array.isArray(p_filter)) {
                columnNames = p_filter;
            } else {
                columnNames = args.splice(0);
            }
            // 엔티티 빌드
            // return this._buildEntity(view, callback, columnNames);

            this._buildEntity(view, callback, columnNames);
            
            for (var i = 0; i < view.rows.count; i++) {
                selectList.push(view.rows[i]);
            }
            return selectList;

        } catch (error) {
            throw new ExtendError(/EL05336/, error, []);
        }

    };
    
    /**
     * 객체(직렬화) 로드  
     * 불러오기/가져오기 (!! 병합용도가 아님)  
     * 기존을 초기화 하고 불러오는 역활  
     * 
     * @param {object | string} p_obj 불러오기 대상
     * @param {function} [p_parse] 파서
     */
    BaseEntity.prototype.load = function(p_obj, p_parse) {
        var obj = p_obj;
        
        
        try {
            if (p_obj instanceof BaseEntity) throw new ExtendError(/EL05351/, null, []);
            if (typeof obj === 'string') {
                if (typeof p_parse === 'function') obj = p_parse(obj);
                else obj = JSON.parse(obj, null);
            }    
            if (!_isObject(obj)) throw new ExtendError(/EL05352/, null, [typeof obj]);
            this.setObject(obj);
            
        } catch (error) {
            throw new ExtendError(/EL05353/, error, []);
        }
    };

    // BaseEntity.prototype.load._TYPE = { params: String };

    /**
     * 객체 출력(직렬화)
     * 
     * @param {number} [p_vOpt] 옵션 (0, 1, 2)
     * @param {function} [p_stringify] 파서출력 사용자 함수
     * @param {string} [p_space] 공백
     * @returns {string}
     */
    BaseEntity.prototype.output = function(p_vOpt, p_stringify, p_space) {
        var rObj;
        var str;

        rObj = this.getObject(p_vOpt);
        if (typeof p_stringify === 'function') str = p_stringify(rObj, { space: p_space } );
        else str = JSON.stringify(rObj, null, p_space);
        return str;
    };

    /**
     * object 로 읽기   
     * JSON 스키마 규칙   
     * { table: { columns: {}, rows: {} }}   
     * { columns: {...}, rows: {} }  
     * 
     * @param {object} p_obj mObject 또는 rObject 또는 entity
     * @param {number} [p_option] 기본값  = 3
     * @param {number} p_option.1 컬럼(구조)만 가져온다. 
     * @param {number} p_option.2 로우(데이터)만 가져온다 (컬럼 참조)  
     * @param {number} p_option.3 컬럼/로우를 가져온다. 로우만 존재하면 로우 이름의 빈 컬럼을 생성한다. 
     */
    BaseEntity.prototype.read  = function(p_obj, p_option) {
        var entity = null;
        var opt = typeof p_option === 'undefined' ? 3 : p_option;

        try {
            if (!_isObject(p_obj)) throw new ExtendError(/EL05354/, null, [typeof p_obj]);
            if (typeof opt !== 'number') throw new ExtendError(/EL05355/, null, [typeof opt]);
            if (opt <= 0 || opt > 3) throw new ExtendError(/EL05356/, null, [opt]);

            if (p_obj instanceof BaseEntity) {
                this._readEntity(p_obj, p_option);
            } else {    
                // REVIEW: entity, table 필요성 검토
                if (p_obj['entity']) entity = p_obj['entity'];
                else if (p_obj['table']) entity = p_obj['table'];
                else entity = p_obj;

                // 스키마 및 데이터 읽기
                if (opt % 2 === 1) this.readSchema(entity, opt === 3 ? true : false); // opt: 1, 3
                if (Math.floor(opt / 2) >= 1) this.readData(entity); // opt: 2, 3
            }
            
        } catch (error) {
            throw new ExtendError(/EL05357/, error, []);
        }
    };
    
    /**
     * 없으면 빈 컬럼을 생성해야 하는지?  
     * 이경우에 대해서 명료하게 처리햐야함 !!  
     * 
     * @param {object} p_obj object<Schema> | object<Guid>
     * @param {boolean} [p_createRow] true 이면, row[0] 기준으로 컬럼을 추가함
     */
    BaseEntity.prototype.readSchema  = function(p_obj, p_createRow) {
        var obj = p_obj;
        
        try {
            if (!_isObject(p_obj)) throw new ExtendError(/EL05358/, null, [typeof p_obj]);
            if (MetaRegistry.isGuidObject(p_obj)) {
                if (MetaRegistry.hasRefer(p_obj)) obj = MetaRegistry.transformRefer(p_obj);
                obj = BaseEntity.transformSchema(obj); // gObj >> sObj<요약>
            }
            if (!_isSchema(obj)) throw new ExtendError(/EL05359/, null, [obj.columns, obj.rows]);

            if (obj.viewName) this.viewName = obj.viewName;
            if (obj.tableName) this.tableName = obj.tableName;

            this._readSchema(obj, p_createRow);
            
        } catch (error) {
            throw new ExtendError(/EL0535A/, error, []);
        }
    };        

    /**
     * 존재하는 로우만 읽기  
     * 
     * @param {object} p_obj 읽을 객체
     */
    BaseEntity.prototype.readData  = function(p_obj) {
        var obj = p_obj;
        var rows = [];

        try {
            if (!_isObject(p_obj)) throw new ExtendError(/EL0535B/, null, [typeof p_obj]);

            if (MetaRegistry.isGuidObject(p_obj)) {
                if (MetaRegistry.hasRefer(p_obj)) obj = MetaRegistry.transformRefer(p_obj);
                obj = BaseEntity.transformSchema(p_obj);
            }
            if (!_isSchema(obj)) throw new ExtendError(/EL0535C/, null, [obj.columns, obj.rows]);
            
            if (Array.isArray(obj['rows'])) rows = obj['rows'];
            else rows.push(obj['rows']);
            
            for (var i = 0; i < rows.length && this.columns.count > 0; i++) {
                var row = this.newRow(this);
                for (var key in rows[i]) {
                    if (Object.prototype.hasOwnProperty.call(row, key)) row[key] = rows[i][key];
                }
                this.rows.add(row);
            }
            
        } catch (error) {
            throw new ExtendError(/EL0535D/, error, []);
        }
    };

    /**
     * 엔티티를 컬럼과 로우를 스키마 타입의 객체로 쓰기(내보내기)
     * 
     * @param {number} p_vOpt 기본 = 0
     * @returns {object} 스키마 타입
     */
    BaseEntity.prototype.write  = function(p_vOpt) {
        var vOpt = p_vOpt || 0;
        var oGuid;
        
        oGuid = this.getObject(vOpt);
        return BaseEntity.transformSchema(oGuid);
    };

    /**
     * 엔티티 스키마(컬럼)을 스키마 타입의 객체로 쓰기
     * @param {number} [p_vOpt] 기본 = 0
     * @returns {object} 스키마 타입
     */
    BaseEntity.prototype.writeSchema  = function(p_vOpt) {
        var vOpt = p_vOpt || 0;
        var schema;

        schema = this.write(vOpt);
        delete schema.rows;
        return schema;                
    };

    /**
     * 엔티티 데이터(로우)를 스키마 타입의 객체로 쓰기
     * 
     * @param {number} p_vOpt 기본 = 0
     * @returns {object} 스키마 타입
     */
    BaseEntity.prototype.writeData  = function(p_vOpt) {
        var vOpt = p_vOpt || 0;
        var schema;
        
        schema = this.write(vOpt);
        delete schema.columns;

        return schema;
    };

    /** 
     * columns 컬렉션에 포함된 MetaColumn의 유효성을 검사합니다. 
     * column.valid() 메서드는 required 속성과 constraints를 기준으로 value 값의 유효성을 확인합니다.
     *  
     * @returns {boolean} 모든 컬럼이 유효성 검사를 통과한 경우 true 
     */
    BaseEntity.prototype.validate = function() {
        // 컬럼 타입 검사
        var typeCheck = this.columns.every(function(elem) {
            if (elem instanceof MetaColumn) return true;
            return false;
        });

        if (!typeCheck) throw new ExtendError(/EL05338/, null, []);
        
        if (this.columns.every(function(elem) {
            if (typeof elem.valid(elem.value) === 'undefined') return true;
            return false;
        })) return true;
        else return false;
    };

    /** 
     * 엔티티 복제
     * 
     * @abstract 
     * @returns {BaseEntity} 복제한 객체
     */
    BaseEntity.prototype.clone = function() {
        throw new ExtendError(/EL05337/, null, []);
    };

    /** 
     * 엔티티 복사
     * 
     * @abstract 
     * @returns {BaseEntity} 복사한 뷰 객체
     */
    BaseEntity.prototype.copy = function() {
        throw new ExtendError(/EL05348/, null, []);
    };

    return BaseEntity;

}(MetaElement));

/**** meta-table.js | MetaTable ****/
//==============================================================

var MetaTable  = (function (_super) {
    /**
     * 테이블 엔티티
     * 
     * @constructs MetaTable
     * @extends BaseEntity
     * @param {string} p_name 테이블명
     */
    function MetaTable(p_name) {
        _super.call(this, p_name);

        var columns  = new MetaTableColumnCollection(this);

        /**
         * 테이블 이름
         * 
         * @member {string} MetaTable#tableName
         */
        Object.defineProperty(this, 'tableName', {
            get: function() { return this._name; },
            set: function(nVal) { 
                if (nVal === this.tableName) return;
                if (typeof nVal !== 'string') throw new ExtendError(/EL05411/, null, [typeof nVal]);
                this._name = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 엔티티의 아이템(속성) 컬렉션
         * 
         * @member {MetaTableColumnCollection} MetaTable#columns
         */
        Object.defineProperty(this, 'columns', {
            get: function() { return columns; },
            set: function(nVal) { 
                if (!(nVal instanceof MetaTableColumnCollection)) throw new ExtendError(/EL05412/, null, []);
                if (this.rows.count > 0) throw new ExtendError(/EL05413/, null, [this.constructor.name, this.rows.count]);
                columns = nVal;
            },
            configurable: false,
            enumerable: true
        });
        
        Util.implements(MetaTable, this);       // strip:
    }
    Util.inherits(MetaTable, _super);
    
    MetaTable._UNION = [ITransaction];
    MetaTable._NS = 'Meta.Entity';      // namespace
    MetaTable._PARAMS = ['name'];       // creator parameter

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    MetaTable.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        obj['tableName'] = this.tableName;
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    MetaTable.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;
        var metaSet;

        if(p_oGuid['_metaSet']) {
            metaSet = MetaRegistry.findSetObject(p_oGuid['_metaSet']['$ref'], origin);
            if (!metaSet) throw new ExtendError(/EL05414/, null, [p_oGuid['_metaSet']['$ref']]);
            this._metaSet = metaSet;
        }
        this.columns.setObject(p_oGuid['columns'], origin);
        this.rows.setObject(p_oGuid['rows'], origin);
        this.tableName = p_oGuid['tableName'];
    };

    /**
     * 객체 복제
     * 
     * @returns {MetaTable}
     */
    MetaTable.prototype.clone  = function() {
        var clone = new MetaTable(this.tableName);
        
        // columns 복제본 추가
        for(var i = 0; i < this.columns.count; i++) {
            clone.columns.add(this.columns[i].clone(clone));
        }
        
        // rows 복제본 추가
        for(var k = 0; k < this.rows.count; k++) {
            clone.rows.add(this.rows[k].clone(clone));
        }
        return clone;
    };


    /**
     * 엔티티를 복사한다. (조회 후 복제)
     * 
     * @param {overload}            type1
     * @param {function}            type1.p_filter 로우 필터 함수
     * @param {arguments<string>}   type1.p_args 컬럼명
     * @param {overload}            type2
     * @param {string}              type2.p_columns 컬럼명
     */
    MetaTable.prototype.copy  = function(p_filter, p_args) {
        var args = Array.prototype.slice.call(arguments);
        var columnNames = [];
        var callback = null;
        var entity = new MetaTable(this.tableName);

        // 매개변수 구성
        if (typeof p_filter === 'function') {
            callback = p_filter;
            if (Array.isArray(p_args)) columnNames = p_args;
            else if (args.length > 1) columnNames = args.splice(1);
        } else if (Array.isArray(p_filter)) {
            columnNames = p_filter;
        } else {
            columnNames = args.splice(0);
        }

        return this._buildEntity(entity, callback, columnNames);
    };

    /**
     * 변경사항 허락 : commit
     */
    MetaTable.prototype.acceptChanges  = function() {
        this.rows.commit();
    };

    /**
     * 변경사항 취소 : rollback
     */
    MetaTable.prototype.rejectChanges  = function() {
        this.rows.rollback();
    };

    /**
     * 변경목록 얻기
     * 
     * @returns {array<object>}
     */
    MetaTable.prototype.getChanges  = function() {
        return this.rows._transQueue.select();
    };

    return MetaTable;

}(BaseEntity));

/**** collection-meta-table.js | MetaTableCollection ****/
//==============================================================

var MetaTableCollection  = (function (_super) {
    /**
     * 메타 테이블 컬렉션
     * 
     * @constructs MetaTableCollection
     * @extends PropertyCollection
     * @param {object} p_owner 소유자 
     */
    function MetaTableCollection(p_owner) {   // COVER:
        _super.call(this, p_owner);

        var _baseType = MetaTable;
        /**
         * 기본 생성 타입
         * @member {BaseColumnCollection} MetaTableCollection#_baseType
         */
        Object.defineProperty(this, '_baseType', {
            get: function() { return _baseType; },
            set: function(nVal) { 
                if (!(typeof nVal === 'function')) throw new ExtendError(/EL05421/, null, [this.constructor.name, typeof nVal]);
                // if (!(new nVal('temp') instanceof MetaTable)) throw new ExtendError('ES032', ['_baseType', 'MetaTable']);
                if (!(Type.isProtoChain(nVal, MetaTable))) throw new ExtendError(/EL05422/, null, [this.constructor.name]);
                _baseType = nVal;
            },
            configurable: false,
            enumerable: true
        });

        this._elemTypes = MetaTable;   // 컬렉션 타입 설정

        // 예약어 등록 
        this.$KEYWORD = ['_baseType', 'existTableName'];
    }
    Util.inherits(MetaTableCollection, _super);

    MetaTableCollection._NS = 'Meta.Entity';    // namespace
    MetaTableCollection._PARAMS = ['_owner'];  // creator parameter

    /**
     * 테이블 컬렉션에 엔티티 추가
     * 
     * @param {string | MetaTable} p_table 추가할 메타테이블
     * @returns {MetaTable} 등록한 아이템
     */
    MetaTableCollection.prototype.add  = function(p_table) { // COVER:
        var table;
        var key;

        if (typeof p_table === 'string' && p_table.length > 0) {      
            key  = p_table;
            table = new this._baseType(key);
            if (this._owner instanceof MetaObject && this._owner.instanceOf('MetaSet')) table._metaSet = this._owner;
            // table._metaSet = this._owner;

        } else if (p_table instanceof MetaTable) {
            key  = p_table.tableName;
            table = p_table;
            if (this._owner instanceof MetaObject && this._owner.instanceOf('MetaSet')) p_table._metaSet = this._owner;
            // p_table._metaSet = this._owner;
        } else throw new ExtendError(/EL05423/, null, [typeof any]);

        if (this.existTableName(key)) throw new ExtendError(/EL05424/, null, [key]);

        return _super.prototype.add.call(this, key, table);
    };

    /**
     * 테이블명 존재 유무
     * 
     * @param {string} p_key 테이블명
     * @returns {boolean}
     */
    MetaTableCollection.prototype.existTableName  = function(p_key) {
        for (var i = 0; this.count > i; i++) {
            if (this[i].tableName === p_key) return true;
        }
        return false;
    };
    
    return MetaTableCollection;

}(PropertyCollection));

/**** meta-view.js | MetaView ****/
//==============================================================

var MetaView  = (function (_super) {
    /**
     * 메타 뷰
     * 
     * @constructs MetaView
     * @extends BaseEntity
     * @param {string} p_name 뷰이름
     * @param {BaseEntity} [p_baseEntity] 기본 엔티티, 컬럼 추가시 기본엔티티에 추가 된다.
     */
    function MetaView(p_name, p_baseEntity) {
        _super.call(this, p_name);

        var _baseEntity;
        var columns = new MetaViewColumnCollection(this);
        /**
         * 메타 뷰 이름
         * 
         * @member {string} MetaView#viewName
         */
        Object.defineProperty(this, 'viewName', {
            get: function() { return this._name; },
            set: function(nVal) { 
                if (nVal === this.viewName) return;
                if (typeof nVal !== 'string') throw new ExtendError(/EL05431/, null, [typeof nVal]);
                this._name = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 뷰의 컬럼 컬렉션
         * 
         * @member {MetaViewColumnCollection} MetaView#columns
         */
        Object.defineProperty(this, 'columns', {
            get: function() { return columns; },
            set: function(nVal) { 
                if (!(nVal instanceof MetaViewColumnCollection)) throw new ExtendError(/EL05432/, null, [this.constructor.name]);
                if (this.rows.count > 0) throw new ExtendError(/EL05433/, null, [this.constructor.name, this.rows.count ]);
                columns = nVal;
            },
            configurable: false,
            enumerable: true
        });
        
        /**
         * 기본 엔티티  
         * null 으로 undefined  
         * 
         * @member {MetaViewColumnCollection} MetaView#_baseEntity
         */
        Object.defineProperty(this, '_baseEntity', {
            get: function() { return _baseEntity; },
            set: function(nVal) { 
                if (nVal === null || typeof nVal === 'undefined') {
                    _baseEntity = undefined;    // init
                    return;
                }
                if (!(nVal instanceof BaseEntity)) throw new ExtendError(/EL05434/, null, [this.constructor.name]);
                _baseEntity = nVal;
            },
            configurable: false,
            enumerable: true
        });

        if (p_baseEntity) this._baseEntity = p_baseEntity;
        
    }
    Util.inherits(MetaView, _super);

    MetaView._NS = 'Meta.Entity';                   // namespace
    MetaView._PARAMS = ['name', '_baseEntity'];     // creator parameter

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    MetaView.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
        // var origin = p_origin ? p_origin : obj;

        obj['viewName'] = this.viewName;
        if (vOpt < 2 && vOpt > -1 && this._baseEntity) {
            obj['_baseEntity'] = MetaRegistry.createReferObject(this._baseEntity);
        }
        return obj;                  
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.  
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    MetaView.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;
        var metaSet;
        var baseEntity;

        if(p_oGuid['_metaSet']) {
            metaSet = MetaRegistry.findSetObject(p_oGuid['_metaSet']['$ref'], origin);
            if (!metaSet) throw new ExtendError(/EL05435/, null, [p_oGuid['_metaSet']['$ref']]);
            this._metaSet = metaSet;
        }
        // this.metaSet = mObj.metaSet;
        if (p_oGuid['_baseEntity']) {
            baseEntity = MetaRegistry.findSetObject(p_oGuid['_baseEntity']['$ref'], origin);
            if (!baseEntity) throw new ExtendError(/EL05436/, null, [p_oGuid['_baseEntity']['$ref']]);
            // this.__SET$_baseEntity(baseEntity, this);
            this._baseEntity = baseEntity;
        } 
        this.columns.setObject(p_oGuid['columns'], origin);
        this.rows.setObject(p_oGuid['rows'], origin);
        this.viewName = p_oGuid['viewName'];
    };
    /**
     * 객체 복제  
     * override  
     * 
     * @returns {MetaView}
     */
    MetaView.prototype.clone  = function() {
        var clone = new MetaView(this.viewName, this._baseEntity);  // 뷰를 복제하면 참조타입 >> 엔티티타입으로 변경

        for(var i = 0; i < this.columns.count; i++) {
            if (this.columns[i]._entity === this) clone.columns.add(this.columns[i].clone(clone));
            else clone.columns.add(this.columns[i].clone());
        }

        for(var k = 0; k < this.rows.count; k++) {
            clone.rows.add(this.rows[k].clone(clone));
        }
        return clone;
    };
    
    /**
     * 엔티티를 복사한다. (조회 후 복제)  
     * 
     * @param {overload}            type1
     * @param {function}            type1.p_filter 로우 필터 함수
     * @param {arguments<string>}   type1.p_args 컬럼명
     * @param {overload}            type2
     * @param {string}              type2.p_columns 컬럼명
     */
    MetaView.prototype.copy  = function(p_filter, p_args) {
        var args = Array.prototype.slice.call(arguments);
        // var _this = this;
        var items = [];
        var callback = null;
        var entity = new MetaView(this.viewName, this);
        // var orignal = this.clone();

        // 매개변수 구성
        if (typeof p_filter === 'function') {
            callback = p_filter;
            if (Array.isArray(p_args)) items = p_args;
            else if (args.length > 1) items = args.splice(1);
        } else if (Array.isArray(p_filter)) {
            items = p_filter;
        } else {
            items = args.splice(0);
        }

        return this._buildEntity(entity, callback, items);
    };
    
    return MetaView;

}(BaseEntity));

/**** collection-meta-view.js | MetaViewCollection ****/
//==============================================================

var MetaViewCollection  = (function (_super) {
    /**
     * 뷰 엔티티 컬렉션
     * 
     * @constructs MetaViewCollection
     * @extends PropertyCollection
     * @param {object} p_owner 소유자 
     */
    function MetaViewCollection(p_owner) {    // COVER:
        _super.call(this, p_owner);

        var _baseType = MetaView;

        /**
         * 기본 생성 타입
         * 
         * @member {MetaView} MetaViewCollection#_baseType
         */
        Object.defineProperty(this, '_baseType', {
            get: function() { return _baseType; },
            set: function(nVal) { 
                if (!(typeof nVal === 'function')) throw new ExtendError(/EL05441/, null, [typeof nVal]);
                // if (!(new nVal('temp') instanceof MetaView)) throw new ExtendError('ES032', ['_baseType', 'MetaView']);
                if (!(Type.isProtoChain(nVal, MetaView))) throw new ExtendError(/EL05442/, null, [this.constructor.name]);
                _baseType = nVal;
            },
            configurable: false,
            enumerable: true
        });

        this._elemTypes = MetaView;   // 컬렉션타입 설정

        // 예약어 등록 
        this.$KEYWORD = ['_baseType', 'existViewName'];
    }
    Util.inherits(MetaViewCollection, _super);

    MetaViewCollection._NS = 'Meta.Entity';    // namespace
    MetaViewCollection._PARAMS = ['_owner'];  // creator parameter

    /**
     * 뷰 컬렉션에 뷰 엔티티를 추가한다.
     * 
     * @param {string | MetaView} p_view 추가할 뷰
     * @param {BaseColumnCollection} [p_baseEntity] 기본 컬럼 컬렉션
     * @returns {MetaView} 등록한 아이템
     * 
     * @example
     *  - string                    : 생성후   string      이름으로 등록 
     *  - string, colltion          : 생성후   string      이름으로  등록 (collection보냄)
     *  - entityView                :         entityView  이름으로 등록
     *  - entityView, collection    :         entityView  이름으로 등록 (collection보냄) => 오류발생
     */
    MetaViewCollection.prototype.add  = function(p_view, p_baseEntity) {    // COVER:
        var view;
        var key;

        if (p_view instanceof MetaView && p_baseEntity) {
            throw new ExtendError(/EL05443/, null, []);
        }
        if (p_baseEntity && !(p_baseEntity instanceof BaseEntity)) {
            throw new ExtendError(/EL05444/, null, []);
        }

        if (typeof p_view === 'string') {      
            key  = p_view;
            view = new this._baseType(key, p_baseEntity);
            if (this._owner instanceof MetaObject && this._owner.instanceOf('MetaSet')) view._metaSet = this._owner;
            // view._metaSet = this._owner;
        } else if (p_view instanceof MetaView) {
            key  = p_view.viewName;
            view = p_view;
            if (this._owner instanceof MetaObject && this._owner.instanceOf('MetaSet')) p_view._metaSet = this._owner;
            // p_view._metaSet = this._owner;
        } else throw new ExtendError(/EL05445/, null, [typeof p_view]);

        if (this.existViewName(key)) throw new ExtendError(/EL05446/, null, [key]);

        return _super.prototype.add.call(this, key, view);
    };

    /**
     * 메타뷰가 존재하는지 확인합니다.
     * 
     * @param {string} p_key 뷰이름
     * @returns 
     */
    MetaViewCollection.prototype.existViewName  = function(p_key) {
        for (var i = 0; this.count > i; i++) {
            if (this[i].viewName === p_key) return true;
        }
        return false;
    };

    return MetaViewCollection;

}(PropertyCollection));

/**** meta-set.js | MetaSet ****/
//==============================================================

var MetaSet  = (function (_super) {
    /**
     * 메타셋
     * 
     * @constructs MetaSet
     * @extends MetaElement
     * @implements {ISchemaControl}
     * @implements {IImportControl}
     * @implements {IExportControl}
     * @implements {ITransaction}
     * @implements {ISerialize}
     * @param {string} p_name 메타셋 이름
     */
    function MetaSet(p_name) {
        _super.call(this, p_name);

        var tables = new MetaTableCollection(this);
        var views  = new MetaViewCollection(this);

        /**
         * 테이블 이름
         * 
         * @member {string} MetaSet#setName
         */
        Object.defineProperty(this, 'setName', {
            get: function() { return this._name; },
            set: function(nVal) { 
                if (typeof nVal !== 'string') throw new ExtendError(/EL05451/, null, [this.constructor.name, typeof nVal]);
                this._name = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 메타 테이블 컬렉션
         * 
         * @readonly
         * @member {MetaTableCollection} MetaSet#tables
         */
        Object.defineProperty(this, 'tables', {
            get: function() { return tables; },
            configurable: false,
            enumerable: true
        });
        
        /**
         * 메타 뷰 컬렉션
         * 
         * @readonly
         * @member {MetaViewCollection} MetaSet#views
         */
        Object.defineProperty(this, 'views', {
            get: function() { return views; },
            configurable: false,
            enumerable: true
        });

        /**
         * 트랜젝션 사용 유무 (기본값: 사용 false)
         * 
         * @member {boolean}  MetaSet#autoChanges
         */
        Object.defineProperty(this, 'autoChanges', {
            set: function(nVal) { 
                if (typeof nVal !== 'boolean') {
                    throw new ExtendError(/EL05452/, null, [this.constructor.name, typeof nVal]);
                }
                for (var i = 0; i < this.tables.count; i++) {
                    this.tables[i].rows.autoChanges = nVal;
                }
            },
            configurable: false,
            enumerable: true
        });

        Util.implements(MetaSet, this);     // strip:
    }
    Util.inherits(MetaSet, _super);
    
    MetaSet._UNION = [ISchemaControl, IImportControl, IExportControl, ITransaction, ISerialize];
    MetaSet._NS = 'Meta.Entity';    // namespace
    MetaSet._PARAMS = ['name'];     // creator parameter

    // local funciton
    function _isObject(obj) {
        if (typeof obj === 'object' && obj !== null) return true;
        return false;
    }
    function _isSchema(obj) {    // 객체 여부
        if (!_isObject(obj)) return false;
        if (_isObject(obj['tables']) || _isObject(obj['views'])) return true;
        return false;
    }
    
    /**
     * 메타셋 스카마 객체로 변환
     * 
     * @param {object} p_oGuid getObject()로 얻은 객체
     * @returns {object}
     */
    MetaSet.transformSchema  = function(p_oGuid) {
        var obj = {};

        if (!_isSchema(p_oGuid)) { 
            throw new ExtendError(/EL05453/, null, []);
        }

        obj['name'] = p_oGuid['name']; 
        obj['tables'] = $transformTable(p_oGuid['tables']);
        obj['views'] = $transformView(p_oGuid['views']);   
        
        return obj;

        // inner function
        function $transformTable(p_oGuid) {
            var obj = {};
            for (var i = 0; i < p_oGuid['_elem'].length; i++) {
                var table = p_oGuid['_elem'][i];
                var key = p_oGuid['_key'][i]; 
                obj[key] = BaseEntity.transformSchema(table);
            }
            obj['$key'] = p_oGuid['_key'];
            return obj;
        }
        function $transformView(p_oGuid) {
            var obj = {};
            for (var i = 0; i < p_oGuid['_elem'].length; i++) {
                var view = p_oGuid['_elem'][i];
                var key = p_oGuid['_key'][i]; 
                obj[key] = BaseEntity.transformSchema(view);
            }
            obj['$key'] = p_oGuid['_key'];
            return obj;
        }
    };
    

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    MetaSet.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        obj['setName'] = this.setName;
        obj['tables'] = this.tables.getObject(vOpt, owned);
        obj['views'] = this.views.getObject(vOpt, owned);
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    MetaSet.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);

        var origin = p_origin ? p_origin : p_oGuid;
        
        this.setName = p_oGuid['setName'];
        this.tables.setObject(p_oGuid['tables'], origin);
        this.views.setObject(p_oGuid['views'], origin);
    };

    /**
     * 메타셋 복제
     * 
     * @returns {MetaSet}
     */
    MetaSet.prototype.clone  = function() {
        var clone = new MetaSet(this.setName);

        for(var i = 0; i < this.tables.count; i++) {
            clone.tables.add(this.tables[i].clone());
        }

        for(var k = 0; k < this.views.count; k++) {
            clone.views.add(this.views[k].clone());
        }
        return clone;
    };
    
    /**
     * 모든 view 와 모든 table 의 row 를 초기화
     */
    MetaSet.prototype.clear  = function() {
        for(var i = 0; i < this.tables.count; i++) this.tables[i].clear();
        for(var k = 0; k < this.views.count; k++) this.views[k].clear();
    };
    
    /**
     * 전체 초기화
     */
    MetaSet.prototype.reset  = function() {
        this.tables.clear();
        this.views.clear();
    };

    /**
     * 불러오기/가져오기 (!! 병합용도가 아님)  
     * 기존을 초기화 하고 불러오는 역활  
     * 
     * @param {object | string} p_obj 불러오기 대상
     * @param {function} [p_parse] 파서
     */
    MetaSet.prototype.load = function(p_obj, p_parse) {
        var obj = p_obj;
        // var mObj;

        if (p_obj instanceof MetaSet) throw new ExtendError(/ES022/, null, []);

        if (typeof obj === 'string') {
            if (typeof p_parse === 'function') obj = p_parse(obj);
            else obj = JSON.parse(obj, null);
        }
        
        if (!_isObject(obj)) throw new ExtendError(/EL05455/, null, [typeof obj]);
        
        this.setObject(obj);
    };

    // MetaSet.prototype.load._TYPE = { params: String };

    /**
     * 메타셋 객체 출력(직렬화)
     * 
     * @param {number} [p_vOpt] 옵션 (0, 1, 2)
     * @param {function} [p_stringify] 파서출력 함수
     * @param {string} [p_space] 공백
     * @returns {string}
     */
    MetaSet.prototype.output = function(p_vOpt, p_stringify, p_space) {
        var rObj = this.getObject(p_vOpt);
        var str;
        
        if (typeof p_stringify === 'function') str = p_stringify(rObj, { space: p_space } );
        else str = JSON.stringify(rObj, null, p_space);
        return str;
    };

    /**
     * object 로 로딩하기   
     * JSON 스키마 규칙   
     * { table: { columns: {}, rows: {} }}   
     * { columns: {...}, rows: {} }  
     * 
     * @param {object} p_obj mObject 또는 rObject 또는 entity
     * @param {Number} [p_option=3] 기본값  = 3
     * @param {Number} p_option.1 컬럼(구조)만 가져온다. 
     * @param {Number} p_option.2 로우(데이터)만 가져온다 (컬럼 참조)  
     * @param {Number} p_option.3 컬럼/로우를 가져온다. 로우만 존재하면 로우 이름의 빈 컬럼을 생성한다. 
     */
    MetaSet.prototype.read  = function(p_obj, p_opt) {
        var opt = typeof p_opt === 'undefined' ? 3 : p_opt;
        var entity;
        var key;

        if (typeof p_obj !== 'object' || p_obj === null) throw new ExtendError(/EL05456/, null, [typeof p_obj]);
        if (typeof opt !== 'number') throw new ExtendError(/EL05457/, null, [typeof opt]);

        if (p_obj instanceof MetaSet) {
            this.setName = p_obj.setName;

            for (var i = 0; i < p_obj.tables.count; i++) {
                key = p_obj.tables.indexToKey(i);
                if (this.tables.keyToIndex(key) < 0) this.tables.add(key);
                entity = this.tables[key];
                entity._readEntity(p_obj.tables[key], p_opt);
            }
            for (var k = 0; k < p_obj.views.count; k++) {
                key = p_obj.views.indexToKey(k);
                if (this.views.keyToIndex(key) < 0) this.views.add(key);
                entity = this.views[key];
                entity._readEntity(p_obj.views[key], p_opt);
            }
        } else {
            if (opt % 2 === 1) this.readSchema(p_obj, opt === 3 ? true : false); // opt: 1, 3
            if (Math.floor(opt / 2) >= 1) this.readData(p_obj); // opt: 2, 3
        }
    };
    
    /**
     * 없으면 빈 컬럼을 생성해야 하는지?  
     * 이경우에 대해서 명료하게 처리햐야함 !!  
     * 
     * @param {object} p_obj object<Schema> | object<Guid>
     * @param {boolean} p_createRow true 이면, row[0] 기준으로 컬럼을 추가함
     */
    MetaSet.prototype.readSchema  = function(p_obj, p_createRow) {
        // var _this = this;
        var metaSet = null;
        var obj;
        var entity;

        if (!_isObject(p_obj)) throw new ExtendError(/EL05458/, null, [typeof p_obj]);

        metaSet = p_obj['metaSet'] || p_obj['dataSet'] || p_obj;

        if (MetaRegistry.isGuidObject(metaSet)) {
            // if (MetaRegistry.hasRefer(metaSet)) metaSet = MetaRegistry.transformRefer(metaSet);  // 참조가 기본 존재함
            metaSet = MetaRegistry.transformRefer(metaSet);
            obj = MetaSet.transformSchema(metaSet);
        } else obj = metaSet;

        if (!_isSchema(obj)) throw new ExtendError(/EL05459/, null, [obj.tables, obj.views]);

        if (obj['tables']) {
            entity = obj['tables'];
            if (entity['$key'] && Array.isArray(entity['$key'])) {
                for (var i = 0; i < entity['$key'].length; i++) {
                    $addEntity(entity['$key'][i], entity, this.tables);
                }
            } else for (var key in entity) $addEntity(key, entity, this.tables);
        }
        if (obj['views']) {
            entity = obj['views'];
            if (entity['$key'] && Array.isArray(entity['$key'])) {
                for (var k = 0; k < entity['$key'].length; k++) {
                    $addEntity(entity['$key'][k], entity, this.views);
                }
            } else for (var key2 in entity) $addEntity(key2, entity, this.views);
        }
        return;

        // inner funciton
        function $addEntity(key, p_collec, p_baseCollec) {
            var prop = p_collec[key];
            if (!p_baseCollec.exists(key)) p_baseCollec.add(key);
            MetaRegistry.setMetaObject(prop, p_baseCollec[key]);                 
            p_baseCollec[key]._readSchema(p_collec[key], p_createRow, obj);                    
        }
    };

    /**
     * row 들을 불러 온다
     * 
     * @param {object} p_obj 읽을 데이터
     */
    MetaSet.prototype.readData  = function(p_obj) {
        var metaSet = null;
        var obj;

        if (!_isObject(p_obj)) throw new ExtendError(/EL0545A/, null, [typeof p_obj]);

        metaSet = p_obj['metaSet'] || p_obj['dataSet'] || p_obj;
        
        if (MetaRegistry.isGuidObject(metaSet)) {
            // if (MetaRegistry.hasRefer(metaSet)) metaSet = MetaRegistry.transformRefer(metaSet);
            metaSet = MetaRegistry.transformRefer(metaSet);
            obj = MetaSet.transformSchema(metaSet);
        } else obj = metaSet;

        if (!_isSchema(obj)) throw new ExtendError(/EL0545B/, null, [obj.tables, obj.views]);
        
        if (_isObject(obj['tables'])) $createRow(obj['tables'], this.tables);
        if (_isObject(obj['views'])) $createRow(obj['views'], this.views);

        function $createRow(p_entity, p_collec) {
            for (var key in p_entity) {
                if (Object.prototype.hasOwnProperty.call(p_entity, key) && p_collec.exists(key)) {
                    p_collec[key].readData(p_entity[key]);
                }
            }
        }
    };

    /**
     * 메타셋을 스키마 타입의 객체로 쓰기(내보내기)
     * 
     * @param {number} p_vOpt 옵션
     * @returns {object} 스키마 타입
     */
    MetaSet.prototype.write  = function(p_vOpt) {
        // var vOpt = p_vOpt || 0;
        // var oSch;
        var oGuid = this.getObject(p_vOpt);

        return MetaSet.transformSchema(oGuid);
    };

    /**
     * 메타셋 스키마(컬럼)을 스키마 타입의 객체로 쓰기
     * 
     * @param {number} p_vOpt 옵션
     * @returns {object} 스키마 타입
     */
    MetaSet.prototype.writeSchema  = function(p_vOpt) {
        var vOpt = p_vOpt || 0;
        var schema = this.write(vOpt);
        
        for (var prop in schema.tables) {
            if (prop.indexOf('$') < 0) schema.tables[prop].rows = [];
        }
        for (var prop2 in schema.views) {
            if (prop2.indexOf('$') < 0) schema.views[prop2].rows = [];
        }
        return schema;
        
    };

    /**
     * 메타셋 데이터(로우)를 스키마 타입의 객체로 쓰기
     * 
     * @param {number} p_vOpt 옵션
     * @returns {object} 스키마 타입
     */
    MetaSet.prototype.writeData  = function(p_vOpt) {
        var vOpt = p_vOpt || 0;
        var schema = this.write(vOpt);

        for (var prop in schema.tables) {
            if (prop.indexOf('$') < 0) schema.tables[prop].columns = {};
        }
        for (var prop2 in schema.views) {
            if (prop2.indexOf('$') < 0) schema.views[prop2].columns = {};
        }
        return schema;
    };

    /**
     * 메타테이블의 변경사항 허락 : commit
     */
    MetaSet.prototype.acceptChanges  = function() {
        for (let i = 0; i < this.tables.count; i++) {
            this.tables[i].acceptChanges();                
        }
    };
    
    /**
     * 메타테이블의 변경사항 취소 : rollback
     */
    MetaSet.prototype.rejectChanges  = function() {
        for (let i = 0; i < this.tables.count; i++) {
            this.tables[i].rejectChanges();                
        }
    };
    
    /**
     * 메타테이블들의 변경 유무
     * @returns {boolean} 변경 여부
     */
    MetaSet.prototype.hasChanges  = function() {
        for (let i = 0; i < this.tables.count; i++) {
            var table = this.tables[i];
            if (table.getChanges().length > 0) return true;
        }
        return false;
    };

    return MetaSet;

}(MetaElement));

/* eslint-disable */
var defaultCode = {
    "EL01610": "---- Common ----",
    "EL01611": "validSelector; document object is required",
    "EL01612": "loadScript(url, callback); url is not of string type",
    "EL01613": "loadScript(url, callback); document object is required",
    "EL01614": "",
    "EL02310": "---- i-bind.js ----",
    "EL02311": "addColumn() is an abstract method. [$1] must be implemented",
    "EL02320": "---- i-bind-model.js ----",
    "EL02321": "",
    "EL02330": "---- i-bind-command.js ----",
    "EL02331": "Execute() is an abstract method. [$1] must be implemented",
    "EL02340": "---- i-command-callback.js ----",
    "EL02341": "",
    "EL02350": "---- i-model-callback.js ----",
    "EL02351": "",
    "EL02360": "---- i-service.js ----",
    "EL02361": "",
    "EL02370": "---- i-service-ajax.js ----",
    "EL02371": "",
    "EL054600": "---- html-column.js ----",
    "EL054601": "$1.domType is object type",
    "EL054602": "$1.isReadOnly is boolean type",
    "EL054603": "$1.isHide is boolean type",
    "EL054604": "$1.element is object type",
    "EL054605": "$1.selector type is string | {key: string, type: string}",
    "EL054606": "$1.getFilter is function type",
    "EL054607": "$1.setFilter is function type",
    "EL054608": "When you get $1.value, selector type='prop' must specify a subordinate name ($2. substitute name)",
    "EL054609": "When obtaining $1.value, selector type='attr' must specify a subordinate name ($2. substitute name)",
    "EL054610": "When obtaining $1.value, selector type='css' must specify a subordinate name ($2. subsidiary name)",
    "EL054611": "Only selector type='value' | 'value' | 'text' | 'prop' | 'attr' | 'css' when you get $1.value.",
    "EL054612": "Only number, string, boolean type is allowed when setting $1.value.",
    "EL054613": "When setting $1.value, selector type='prop' must specify a substitute name ($2. substitute name)",
    "EL054614": "When setting $1.value, selector type='attr' must specify a substitute name ($2. substitute name)",
    "EL054615": "When setting $1.value, selector type='css' must specify a subordinate name ($2. subsidiary name)",
    "EL054616": "Only selector type='value' | 'value' | 'text' | 'prop' | 'attr' | 'css' when setting $1.value.",
    "EL054617": "",
    "EL06100": "---- Meta.Entity.Bind.* ----",
    "EL06110": "---- base-bind.js ----",
    "EL06111": "$1._baseTable [MetaTable] instance not,",
    "EL06112": "$1.onExecute is of type 'function' ",
    "EL06113": "$1.onExecutted is of type 'function' ",
    "EL06114": "addColumn() is an abstract method",
    "EL061200": "---- bind-model.js ----",
    "EL061201": "$1._tables value is not of type [MetaTableCollection]",
    "EL061202": "$1._columnType value is not a child of [MetaColumn]",
    "EL061203": "$1.items value is not of type [PropertyCollection]",
    "EL061204": "$1.fn value is not of [PropertyCollection] type",
    "EL061205": "$1.command value is not of type [PropertyCollection]",
    "EL061206": "$1.cbFail is of type '(msg: stirng, valid: MetaView) => void'",
    "EL061207": "$1.cbError 는  '(msg: string, status: number, response: object) => void' It's type.",
    "EL061208": "$1.cbBaseBegin is of type '(cmd: BaseBindcommand) => void'",
    "EL061209": "$1.cbBaseValid 는  '(valid: MetaView, cmd: BaseBindCommand) => boolean' It's type.",
    "EL061210": "$1.cbBaseBind 는  '(view: MetaView, cmd: BaseBindCommand, config: object) => void' It's type.",
    "EL061211": "$1.cbBaseResult 는  '(data: object, cmd: BaseBindCommand, res: object) => object' It's type.",
    "EL061212": "$1.cbBaseOutput 는  '(views: MetaViewColleciton, cmd: BaseBindCommand, res: object) => void' It's type.",
    "EL061213": "$1.cbBaseEnd 는  '(status: number, cmd: BaseBindCommand, res: object) => void' It's type.",
    "EL061214": "$1.preRegister is of type '(bm: BaseBindModel) => void'",
    "EL061215": "$1.preCheck is of type '(bm: BaseBindModel) => boolean'",
    "EL061216": "$1.preReady is of type '(bm: BaseBindModel) => void'",
    "EL061217": "Column name is not of type 'string'. typeof columnName = '$1'",
    "EL061218": "_readItem(item, bEntity); item is of type string | string[]",
    "EL061219": "_readItem(); target table does not exist",
    "EL061220": "_readItem(); Target table is not of type [MetaTable]",
    "EL061221": "_readItem(); column generation failed",
    "EL061222": "setObject(oGuid, origin); oGuid.['_baseTable']$set lookup failed.guid = '$1'",
    "EL061223": "setObject(oGuid, origin); oGuid.['_baseTable'] guid not found: guid = '$1'",
    "EL061224": "addTable(name); name is of type 'string'. type of name = '$1'",
    "EL061225": "addTable(name); name value '$1' is a reserved word,",
    "EL061226": "addTable(name); name value '$1' is duplicated with an existing name",
    "EL061227": "addColumn(column, cmds, views, bTable); column 은 string | MetaColumn It's type.",
    "EL061228": "addColumn(column, cmds, views, bTable); cmds 은 string | string[] It's type.",
    "EL061229": "addColumn (column, cmds, views, bTable); Target table does not exist",
    "EL061230": "addColumn(column, cmds, views, bTable); cmds[$1] is not of string type. typeof cmds[$1] = '$2'",
    "EL061231": "addColumn(cmds, views, bTable); target command does not exist. cmds[$1] = '$2'",
    "EL061232": "addColumnValue(name, value, cmds, views, bTable); name 는 'string' It's type.",
    "EL061233": "addColumnValue (name, value, cmds, views, bTable); Target table does not exist",
    "EL061234": "mapping is not PropertyCollection | object type",
    "EL061235": "Target table does not exist",
    "EL061236": "column or item named '$1' does not exist // REVIEW: removed", 
    "EL061237": "setMapping (bTable); Mapping failed",
    "EL061238": "addcommand() is an abstract method. [$1] must be inherited and implemented.",
    "EL061239": "tables are of string | string[] type",
    "EL061240": "setservice(service, passChk); service setup failed // REVIEW: removed", 
    "EL061241": "command views are of type string[]. type of views == '$1'",
    "EL061242": "",
    "EL061300": "---- bind-command.js ----",
    "EL061301": "$1.valid [MetaView] instance not",
    "EL061302": "$1.bind [MetaView] instance not",
    "EL061303": "$1.outputOption Type is number | {option: number, index: number | number[] } 입니다.",
    "EL061304": "$1.cbBegin is of type '(cmd: BaseBindcommand) => void'",
    "EL061305": "$1.cbValid 는  '(valid: MetaView, cmd: BaseBindCommand) => boolean' It's type.",
    "EL061306": "$1.cbBind 는  '(view: MetaView, cmd: BaseBindCommand, config: object) => void' It's type.",
    "EL061307": "$1.cbResult 는  '(data: object, cmd: BaseBindCommand, res: object) => object' It's type.",
    "EL061308": "$1.cbOutput 는  '(views: MetaViewColleciton, cmd: BaseBindCommand, res: object) => void' It's type.",
    "EL061309": "$1.cbEnd 는  '(status: number, cmd: BaseBindCommand, res: object) => void' It's type.",
    "EL061310": "Column name is not of type 'string'. typeof columnName = '$1'",
    "EL061311": "Output['$1'] setting is MetaView type only",
    "EL061312": "setObject(oGuid, origin); oGuid.['_baseTable'] $set lookup failed: guid = $1",
    "EL061313": "setObject(oGuid, origin); oGuid.['_baseTable'] guid not found: guid = $1",
    "EL061314": "setObject(oGuid, origin); oGuid.['_model'] $set lookup failed. guid = $1",
    "EL061315": "Execute() is an abstract method. [$1] must be inherited and implemented.",
    "EL061316": "addColumn(column, views, bTable); Column is string | Meta Column type.",
    "EL061317": "addColumn(column, views, bTable); views are of the type string | string[].",
    "EL061318": "addColumn(column, views, bTable); Target table does not exist",
    "EL061319": "addColumn(column, views, bTable); views[$1] is not of string type. typeof views[$1] = '$2'",
    "EL061320": "addColumn(column, views, bTable); target views do not exist. views[$1] = '$2'",
    "EL061321": "addColumnValue(name, value, views, bTable); name is of type 'string'. typeof name = $1",
    "EL061322": "addColumnValue (name, value, views, bTable); Target table does not exist",
    "EL061323": "setColumn(names, views, bTable); The name is the string | string[] type.",
    "EL061324": "setColumn(names, views, bTable); names[$1] is not a string type. typeof names[$1] = '$2'",
    "EL061325": "setColumn(name, value, views, bTable); Target table does not exist",
    "EL061326": "setColumn(name, value, views, bTable); column($1) does not exist in target table",
    "EL061327": "release(names, views); The name is the string | string[] type.",
    "EL061328": "release(names, views); views are of the type string | string[].",
    "EL061329": "release(names, views); views[$1] is not of string type: typeof views[$1] = '$2'",
    "EL061330": "release(names, views); view($1) named '$1' does not exist",
    "EL061331": "newOutput(name); name is not of string type.",
    "EL061332": "newOutput(name); name value '$1' is duplicated with existing name",
    "EL061333": "removeOutput(name); name is not of string type: typeof name = '$1'",
    "EL061334": "removeOutput(name); built-in output($1) cannot be deleted",
    "EL061335": "removeOutput(names); view($1) named '$1' does not exist",
    "EL061336": "$1.state type is number",
    "EL06140": "---- empty ----",
    "EL06150": "---- bind-model.js ----",
    "EL06151": "$1.baseConfig is object type",
    "EL06152": "$1.url is the string type",
    "EL06153": "checkSelector(collection, viewLog); The collection is not of the [PropertyCollection] type.",
    "EL06154": "getSelector(collection); The collection is not of the [PropertyCollection] type.",
    "EL06155": "addcommand(name, opt, bTable); name is not of string type. typeof name = '$1'",
    "EL06156": "addcommand(name, opt, bTable); command addition failed",
    "EL06157": "setService(service, passChk); service setup failed",
    "EL06158": "",
    "EL06160": "---- bind-command-ajax.js ----",
    "EL06161": "$1.config is object type",
    "EL06162": "$1.url is the string type",
    "EL06163": "_execOutput(data, res); data is not object | array type. typeof data = '$1'",
    "EL06164": "_execOutput(data, res); outputOption.index[$1] Value is not number. typeof outputOption.index[$1] = '$2'",
    "EL06165": "_execOutput(data, res); _output['$1'].columns does not exist",
    "EL06166": "[$2]th row does not exist in _execOutput(data, res); _output['$1'].rows",
    "EL06167": ""
};

/**** message-wrap.js | Message esm ****/
//==============================================================

const isNode = typeof globalThis.isDOM === 'boolean' ? !globalThis.isDOM :  typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;
let localesPath = './locales';

async function absolutePath(localPath) {
    try {
        const { fileURLToPath } = await import('url');
        const path = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return path.resolve(__dirname, localesPath);
    } catch (error) {
        return localPath;  // Fallback to the original path
    }
}

if (isNode) {
    localesPath = await absolutePath(localesPath);
}

Message.importMessage(defaultCode, localesPath);

await Message.autoDetect();

/**** util-wrap.js | Util ****/
//==============================================================

// local function
function _isString(obj) {    // 공백아닌 문자 여부
    if (typeof obj === 'string' && obj.length > 0) return true;
    return false;
}

/**
 * 셀렉터의 유효성 검사 : 대상을 모두 검사하여 결과를 리턴한다.  
 * 주의!! DOM(web) 에서만 작동한다.  
 * 
 * @param {string} p_selector 
 * @returns {boolean} selector 유효성 여부
 * @memberof _L.Common.Util
 */
Util.validSelector = function validSelector(p_selector) {   // COVER:
    // var selectors = [];

    // selector 얻기
    if (!_isString(p_selector)) return false;

    if (typeof document === 'object' && typeof document.querySelector === 'function') {
        if (document.querySelector(p_selector)) return true;
        return false;

    } else {
        throw new ExtendError(/EL01611/, null, []);
    }
};

/**
 * 스크립트를 로드한다.
 * 
 * @param {*} url 
 * @param {*} callback 
 */
Util.loadScript = function loadScript(url, callback) {
    var head;
    var script;
    
    if (typeof url !== 'string') throw new ExtendError(/EL01612/, null, []);
    if (typeof document !== 'object') throw new ExtendError(/EL01613/, null, []);

    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');

    script.type= 'text/javascript';
    // script.async = true;
    // script.async = false;
    script.defer = true;
    script.src = url;
    if (typeof callback === 'function') {
        // script.onload = callback.bind(this);
        script.addEventListener('load', function() { if(typeof callback === 'function'){ callback(); }});
    }

    head.appendChild(script);
};

/**** i-bind.js | IBind ****/
//==============================================================

/**
 * 바인드 인터페이스입니다.
 * 
 * @interface
 * @constructs IBind
 */
class IBind {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 실행 전 이벤트
     * 
     * @member {MetaTable}
     */
    _baseTable = [['_any_']];

    /**
     * 대상을 내보냅니다. (쓰기)
     * 
     * @returns {any}
     * @abstract
     */
    addColumn() {
        throw new ExtendError(/EL02311/, null, ['IBind']);
    }
}

/**** i-bind-command.js | IBindCommand ****/
//==============================================================

/**
 * 바인드 명령 인터페이스입니다.
 * 
 * @interface
 * @constructs IBindCommand
 */
class IBindCommand {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }
    
    /**
     * 유효성 뷰
     * 
     * @member {MetaView}
     */
    valid = {};

    /**
     * 바인드 뷰
     * 
     * @member {MetaView}
     */
    bind = {};

    /**
     * 출력 뷰
     * 
     * @member {MetaView}
     */
    output = {};

    /**
     * 출력 옵션
     * 
     * @member {object}
     */
    outputOption = {
        option: Number,
        index: [[[Number], Number]]
    };

    /**
     * 대상을 내보냅니다. (쓰기)
     * 
     * @returns {any}
     * @abstract
     */
    execute() {
        throw new ExtendError(/EL02331/, null, ['IBindCommand']);
    }
}

/**** i-bind-model.js | IBindModel ****/
//==============================================================

/**
 * 바인드 모델 인터페이스입니다.
 * 
 * @interface
 * @constructs IBindModel
 */
class IBindModel {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 아이템
     * 
     * @member {object[][]}
     */
    items = [[{}]];

    /**
     * 지역 함수
     * 
     * @member {object[][]}
     */
    fn = [[{}]];

    /**
     * 바인드 명령
     * 
     * @member {object[][]}
     */
    command = [[{}]];

    /**
     * 초기화 이전 등록
     * 
     * @member {Function[][]}
     */
    preRegister = [[Function]];

    /**
     * 초기화 이전 검사
     * 
     * @member {Function[][]}
     */
    preCheck = [[Function]];

    /**
     * 초기화 이전 준비완료
     * 
     * @member {Function[][]}
     */
    preReady = [[Function]];
}

/**** i-command-callback.js | ICommandCallback ****/
//==============================================================

/**
 * 명령 콜백 인터페이스입니다.
 * 
 * @interface
 * @constructs ICommandCallback
 */
class ICommandCallback {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 시작 콜백
     * 
     * @member {function[][]}
     */
    cbBegin = [[Function]];

    /**
     * 유효성 콜백
     * 
     * @member {function[][]}
     */
    cbValid = [[Function]];

    /**
     * 바인드 콜백
     * 
     * @member {function[][]}
     */
    cbBind = [[Function]];

    /**
     * 결과 콜백
     * 
     * @member {function[][]}
     */
    cbResult = [[Function]];

    /**
     * 출력 콜백
     * 
     * @member {function[][]}
     */
    cbOutput = [[Function]];

    /**
     * 실행 종료 콜백
     * 
     * @member {function[][]}
     */
    cbEnd = [[Function]];
}

/**** i-model-callback.js | IModelCallback ****/
//==============================================================

/**
 * 모델 콜백 인터페이스입니다.
 * 
 * @interface
 * @constructs IModelCallback
 */
class IModelCallback {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 실패 콜백
     * 
     * @member {function[][]}
     */
    cbFail = [[Function]];

    /**
     * 오류 콜백
     * 
     * @member {function[][]}
     */
    cbError = [[Function]];

    /**
     * 기본 시작 콜백
     * 
     * @member {function[][]}
     */
    cbBaseBegin = [[Function]];

    /**
     * 기본 유효성 콜백
     * 
     * @member {function[][]}
     */
    cbBaseValid = [[Function]];

    /**
     * 기본 바인드 콜백
     * 
     * @member {function[][]}
     */
    cbBaseBind = [[Function]];

    /**
     * 기본 결과 콜백
     * 
     * @member {function[][]}
     */
    cbBaseResult = [[Function]];

    /**
     * 기본 출력 콜백
     * 
     * @member {function[][]}
     */
    cbBaseOutput = [[Function]];

    /**
     * 기본 실행 종료 콜백
     * 
     * @member {function[][]}
     */
    cbBaseEnd = [[Function]];
}

/**** i-service.js | IService ****/
//==============================================================

/**
 * 서비스 인터페이스입니다.
 * 
 * @interface
 * @constructs IService
 */
class IService {

    static _UNION = [IBindModel, IModelCallback];
    static _NS = 'Interface';
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 테이블
     * 
     * @member {object[][]}
     */
    tables = [[ String, [String], {} ]];

    /**
     * 매핑 컬렉션
     * 
     * @member {object[][]}
     */
    mapping = [[{}]];

    // IBindModel 구성 요소
    items = [[{}]];
    fn = [[{}]];
    command = [[{}]];
    preRegister = [[Function]];
    preCheck = [[Function]];
    preReady = [[Function]];

    // IModelCallback 구성 요소
    cbFail = [[Function]];
    cbError = [[Function]];
    cbBaseBegin = [[Function]];
    cbBaseValid = [[Function]];
    cbBaseBind = [[Function]];
    cbBaseResult = [[Function]];
    cbBaseOutput = [[Function]];
    cbBaseEnd = [[Function]];
}

/**** i-service-ajax.js | IAjaxService ****/
//==============================================================

/**
 * AJAX 서비스 인터페이스입니다.
 * 
 * @interface
 * @extends IService
 * @constructs IAjaxService
 */
class IAjaxService extends IService {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
        super();
    }

    /**
     * 기본 AJAX Setup 객체
     * 
     * @member {object[][]}
     */
    baseConfig = [[{}]];

    /**
     * 기본 요청 url
     * 
     * @member {string[][]}
     */
    url = [[String]];
}

/**** html-column.js | HTMLColumn ****/
//==============================================================

function setDocument(flag, selector, option, value) {
    // 요소 선택: key 셀렉터에 해당하는 첫 번째 요소를 선택합니다.
    var elem = document.querySelector(selector);

    flag = flag.toLowerCase();

    if (elem) {
        // 1. jquery(key).val(value);
        // → 폼 요소(input, select, textarea 등)의 값을 설정합니다.
        if (flag === 'val' || flag === 'value') {
            elem.value = value;
            return;
        }
        // 2. jquery(key).text(value);
        // → 요소의 텍스트 콘텐츠를 설정합니다.
        if (flag === 'text') {
            elem.textContent = value;
            return;
        }
        // 3. jquery(key).html(value);
        // → 요소의 내부 HTML(markup)을 설정합니다.
        if (flag === 'html') {
            elem.innerHTML = value;
            return;
        }
        // 4. jquery(key).prop(option, value);
        // → DOM 프로퍼티를 설정합니다. 예를 들어, option이 "checked"인 경우 elem.checked = value;
        if (flag === 'prop') {
            // elem.prop(option, value);
            // → 요소의 프로퍼티 값을 설정합니다.
            // elem[option] = value;
            elem[option] = value;
            return;
        }
        // 5. jquery(key).attr(option, value);
        // → 요소의 attribute 값을 설정합니다.
        if (flag === 'attr') {
            elem.setAttribute(option, value);
            return;
        }
        // 6. jquery(key).css(option, value);
        // → 인라인 스타일을 설정합니다. option이 CSS 프로퍼티 이름(예: "backgroundColor" 또는 "background-color")이어야 합니다.
        //    만약 하이픈 표기법("background-color")를 사용하는 경우, 이를 camelCase("backgroundColor")로 변환해주어야 합니다.
        if (flag === 'css') {
            elem.style[option] = value;
            return;
        }
    }
}

function getDocument(flag, selector, option) {
    // 요소 선택: key 셀렉터에 해당하는 첫 번째 요소를 선택합니다.
    var elem = document.querySelector(selector);
    
    flag = flag.toLowerCase();

    if (elem) {
        // 1. jquery(key).val(__val);
        // → 폼 요소(input, select, textarea 등)의 값을 설정합니다.
        if (flag === 'val' || flag === 'value') {
            return elem.value;
        }
        // 2. jquery(key).text(__val);
        // → 요소의 텍스트 콘텐츠를 설정합니다.
        if (flag === 'text') {
            return elem.textContent;
        }
        // 3. jquery(key).html(__val);
        // → 요소의 내부 HTML(markup)을 설정합니다.
        if (flag === 'html') {
            return elem.innerHTML;
        }
        // 4. jquery(key).prop(option, __val);
        if (flag === 'prop') {
            // elem.prop(option, __val);
            // → 요소의 프로퍼티 값을 설정합니다.
            // elem[option] = __val;
            return elem[option];
        }
        // 5. jquery(key).attr(option, __val);
        if (flag === 'attr') {
            return elem.getAttribute(option);
        }
        // 6. jquery(key).css(option, __val);
        if (flag === 'css') {
            return elem.style[option];
            // var computedStyle = window.getComputedStyle(elem);
            // return computedStyle.getPropertyValue(option);
        }
    }
    return '';
}

var HTMLColumn  = (function (_super) {
    /**
     * HTML 컬럼
     * 
     * @constructs HTMLColumn
     * @extends MetaColumn
     */
    function HTMLColumn(p_name, p_entity, p_option) {
        _super.call(this, p_name, p_entity, p_option);

        var domType       = null;
        var isReadOnly    = false;
        var isHide        = false;
        var element       = null;
        var getFilter     = null;
        var setFilter     = null;
        // var selector      = { key: '', type: 'none' };
        var selector      = null;

        /**
         * 아이템 DOM 타입
         * 
         * @member {*} HTMLColumn#domType
         */
        Object.defineProperty(this, 'domType', {
            get: function() { return domType; },
            set: function(nVal) { 
                // TODO:: 자료종류 {input: {type: 'text'...}} 만들어야함 => 필요성 검토해야함
                // TODO: DOM 인스턴스 여부로 검사해야함
                if(typeof nVal !== 'object') throw new ExtendError(/EL054601/, null, [this.constructor.name]);
                domType = nVal;
            },
            configurable: true,
            enumerable: true
        });
        
        /**
         * 읽기전용 여부
         * 
         * @member {*} HTMLColumn#isReadOnly
         */
        Object.defineProperty(this, 'isReadOnly', {
            get: function() { return isReadOnly; },
            set: function(nVal) { 
                if(typeof nVal !== 'boolean') throw new ExtendError(/EL054602/, null, [this.constructor.name]);
                isReadOnly = nVal;
            },
            configurable: true,
            enumerable: true
        });
        
        /**
         * 숨김 여부
         * 
         * @member {*} HTMLColumn#isHide
         */
        Object.defineProperty(this, 'isHide', {
            get: function() { return isHide; },
            set: function(nVal) { 
                if(typeof nVal !== 'boolean') throw new ExtendError(/EL054603/, null, [this.constructor.name]);
                isHide = nVal;
            },
            configurable: true,
            enumerable: true
        });
        
        /**
         * DOM 요소
         * 
         * @member {*} HTMLColumn#element
         */
        Object.defineProperty(this, 'element', {
            get: function() { return element; },
            set: function(nVal) {       // TODO: DOM 인스턴스 여부로 검사해야함
                if(typeof nVal !== 'object') throw new ExtendError(/EL054604/, null, [this.constructor.name]);
                element = nVal;
            },
            configurable: true,
            enumerable: true
        });

        /**
         * 셀렉터
         * 
         * @member {*} HTMLColumn#selector
         * @example
         * type
         *  - val | value   : 요소의 value 속성값
         *  - text          : 요소의 텍스트값
         *  - html          : 요소의 html값
         *  - css.속성명    : css 의 속성값 (객체)
         *  - prop.속성명   : 요소의 속성명값 (초기상태기준)
         *  - attr.속성명   : 요소의 속성명값 (현재상태)
         *  - none         : 아무일도 하지 않음, 표현의 목적
         */
        Object.defineProperty(this, 'selector', {
            get: function() { return selector; },
            // set: function(nVal) { 
            //     var newSelector = { key: '', type: 'value' };

            //     if (typeof nVal === 'string') {
            //         // selector.key = nVal;
            //         selector = newSelector;
            //         selector.key = nVal;
            //     } else if (typeof nVal === 'object' && typeof nVal.key !== 'undefined') {
            //         selector = nVal;
            //     } else {
            //         throw new Error('Only [selector] type "string | object.key" can be added');
            //     }
            //     // selector = selector;
            // },
            set: function(nVal) { 
                var newSelector = { key: '', type: 'none' };
                if (typeof nVal === 'string' ) {
                    newSelector['key'] = nVal;
                } else if (typeof nVal === 'object') {
                    if (typeof nVal['key'] === 'string') newSelector['key'] = nVal['key'];
                    if (typeof nVal['type'] === 'string') newSelector['type'] = nVal['type'].toLowerCase();
                } else throw new ExtendError(/EL054605/, null, [this.constructor.name]);
                selector = newSelector;
            },
            configurable: true,
            enumerable: true
        });

        /**
         * value 값 필터
         * 
         * @member {Function} HTMLColumn#getFilter
         */
        Object.defineProperty(this, 'getFilter', {
            get: function() { return getFilter; },
            set: function(val) { 
                if(typeof val !== 'function') throw new ExtendError(/EL054606/, null, [this.constructor.name]);
                getFilter = val;
            },
            configurable: true,
            enumerable: true
        });
                    
        /**
         * value 값 필터
         * 
         * @member {Function} HTMLColumn#setFilter
         */
        Object.defineProperty(this, 'setFilter', {
            get: function() { return setFilter; },
            set: function(val) { 
                if(typeof val !== 'function') throw new ExtendError(/EL054607/, null, [this.constructor.name]);
                setFilter = val;
            },
            configurable: true,
            enumerable: true
        });

        /**
         * 아이템 값 (오버라이딩)
         * 
         * @override
         * @member {*} HTMLColumn#value
         */
        Object.defineProperty(this, 'value', {
            get: function() { 
                var __val;
                var key, type, option;

                // 우선순위 : 1
                if (typeof this.getter === 'function' ) {
                    
                    __val = this.getter.call(this);
                    
                    // 검사 및 이벤트 발생
                    if (this.$value !== null && this.$value !== __val) {
                        this._onChanged(__val, this.$value);
                        this.$value = __val;   // 내부에 저장
                    }

                // 우선순위 : 2
                // } else if (__selector !== null && __filter === null) {
                } else if (selector !== null || typeof this.getFilter === 'function') {

                    const isNode = typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null && globalThis.isDOM !== true;
                    // node 에서는 강제 종료함
                    if (!isNode) {

                        key = this.selector.key;
                        type = this.selector.type.split('.')[0].toLowerCase();
                        option = this.selector.type.split('.')[1] || '';
                        // option = type.indexOf('.') > -1 ? type.substr(type.indexOf('.') + 1) : '';
                       
                        if (type !== 'none'){

                            if (type === 'prop' && option === '') throw new ExtendError(/EL054608/, null, [this.constructor.name, key]);
                            if (type === 'attr' && option === '') throw new ExtendError(/EL054609/, null, [this.constructor.name, key]);
                            if (type === 'css' && option === '') throw new ExtendError(/EL054610/, null, [this.constructor.name, key]);
                            if (['val', 'value', 'text', 'html', 'prop', 'attr', 'css'].indexOf(type) < 0) throw new ExtendError(/EL054611/, null, [this.constructor.name, key]);
                            __val = getDocument(type, key, option);

                            // if (type === 'value' || type === 'val') {
                            //     __val = jquery(key).val();
                            // } else if (type === 'text') {
                            //     __val = jquery(key).text();
                            // } else if (type === 'html') {
                            //     __val = jquery(key).html();
                            // } else if (type.indexOf('prop') > -1) {
                            //     if (option === '') throw new ExtendError(/EL054608/, null, [this.constructor.name, key]);
                            //     else __val = jquery(key).prop(option);
                            // } else if (type.indexOf('attr') > -1) {
                            //     if (option === '') throw new ExtendError(/EL054609/, null, [this.constructor.name, key]);
                            //     else __val = jquery(key).attr(option);
                            // } else if (type.indexOf('css') > -1) {
                            //     if (option === '') throw new ExtendError(/EL054610/, null, [this.constructor.name, key]);
                            //     else __val = jquery(key).css(option);
                            // } else {
                            //     throw new ExtendError(/EL054611/, null, [this.constructor.name]);
                            // }
                            
                            // selector 검사
                            if (typeof __val === 'undefined' || __val === null) {
                                console.warn('selector key = '+ key +', type = '+ type +'에 일치하는 값이 없습니다. ');                    
                            } 

                            // 검사 및 이벤트 발생
                            if (this.__sValue !== null && this.__sValue !== __val && __val) {
                                this._onChanged(__val, this.__sValue);
                                this.__sValue = String(__val);  // sValue 저장
                            }

                        }
                    }

                    // 필터 적용 : get
                    if (typeof this.getFilter === 'function') __val = this.getFilter.call(this, __val);
                
                // 우선순위 : 3        
                } else {
                    __val = this.$value;
                }
                    
                /**
                 * 분기 처리값 '__val' 없는경우 (null, undefined)
                 *  - this.$value 초기화 되지 않은 경우
                 *  - getter 리턴이 없는 경우
                 *  - node selector 를 사용한 경우
                 *  - selector 매칭값이 없는 경우
                 */
                if (typeof __val === 'undefined' || __val === null) {
                    // __val = this.$value || this.default;  REVIEW: 제거대상
                    // __val = this.$value;
                    __val = this.$value === null ? this.default : this.$value;
                }

                // Get값과 내부값이 다를경우 값 설정 (내부적으로 change 이벤트 발생함)
                // if (__val !== this.$value) {
                //     this.value = __val;
                // }

                return __val; 
            },
            set:  function(val) { 
                var __val, _fVal;
                var key, type, option;
                var _oldVal = this.$value;
                // var _isSetFilter = true;   // selector 설정 여부

                // if (typeof this.setter === 'function' ) _val = this.setter.call(this, val);
                
                // // settter 의 리턴이 여부
                // if (typeof _val !== 'undefined') __val = _val;
                // else __val = val;
                if (typeof this.setter === 'function') __val = this.setter.call(this, val) || val;
                else __val = val;

                // __val = __val === null ? '' : __val;  // null 등록 오류 처리
                
                if (this._valueTypes.length > 0) Type.matchType([this._valueTypes], __val);
                // if(['number', 'string', 'boolean'].indexOf(typeof __val) < 0) {
                //     throw new ExtendError(/EL054612/, null, [this.constructor.name]);   // TODO: EL054612 에러 코드 제거됨
                // }
                this.$value = __val;   // 내부에 저장
        
                if (selector !== null || typeof this.setFilter === 'function') {

                    if (typeof this.setFilter === 'function') {
                        _fVal = this.setFilter.call(this, __val);
                    }
                    
                    // 셀렉터 설정 값 1> 필터값, 2> __value
                    __val = _fVal || __val;
                    const isNode = typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null && globalThis.isDOM !== true;
                    // node 에서는 강제 종료함
                    if (!isNode) {

                        // 필터 적용 : set
                        // if (typeof this.setFilter === 'function') {
                        //     __val = this.setFilter.call(this, __val);
                        //     _isSetFilter = __val ? true : false;
                        // }

                        // if (typeof this.setFilter === 'function') {
                        //     _fVal = this.setFilter.call(this, __val);
                        // }
                        
                        // // 셀렉터 설정 값 1> 필터값, 2> __value
                        // __val = _fVal || __val;

                        // 셀렉터 내부값 저장
                        this.__sValue = String(__val);

                        // key = this.selector.key;
                        // type = this.selector.type;
                        // option = type.indexOf('.') > -1 ? type.substr(type.indexOf('.') + 1) : '';
                        
                        key = this.selector.key;
                        type = this.selector.type.split('.')[0].toLowerCase();
                        option = this.selector.type.split('.')[1] || '';

                        // 유효한 셀렉터 이면서, 설정할 ....
                        // if (type !== 'none' && type !== '' && _isSetFilter){
                        if (type !== 'none'){

                            if (type === 'prop' && option === '') throw new ExtendError(/EL054613/, null, [this.constructor.name, key]);
                            if (type === 'attr' && option === '') throw new ExtendError(/EL054614/, null, [this.constructor.name, key]);
                            if (type === 'css' && option === '') throw new ExtendError(/EL054615/, null, [this.constructor.name, key]);
                            if (['val', 'value', 'text', 'html', 'prop', 'attr', 'css'].indexOf(type) < 0) throw new ExtendError(/EL054616/, null, [this.constructor.name, key]);
                            setDocument(type, key, option, __val);

                            // if (type === 'value' || type === 'val') {
                            //     jquery(key).val(__val);
                            // } else if (type === 'text') {
                            //     jquery(key).text(__val);
                            // } else if (type === 'html') {
                            //     jquery(key).html(__val);
                            // } else if (type.indexOf('prop') > -1) {
                            //     if (option === '') throw new ExtendError(/EL054613/, null, [this.constructor.name, key]);
                            //     else jquery(key).prop(option, __val);
                            // } else if (type.indexOf('attr') > -1) {
                            //     if (option === '') throw new ExtendError(/EL054614/, null, [this.constructor.name, key]);
                            //     else jquery(key).attr(option, __val);
                            // } else if (type.indexOf('css') > -1) {
                            //     if (option === '') throw new ExtendError(/EL054615/, null, [this.constructor.name, key]);
                            //     else jquery(key).css(option, __val);
                            // } else {
                            //     throw new ExtendError(/EL054616/, null, [this.constructor.name]);
                            // }
                        }
                    }
                }

                // 검사 및 이벤트 발생 : 타입간 호환성
                if (_oldVal !== __val && __val) this._onChanged(__val, _oldVal);

                // // 이벤트 발생
                // this._onChanged();
            },
            configurable: true,
            enumerable: true
        });

        // 아이템 옵션속성 추가
        if (typeof p_option === 'object' ) {
            for(var prop in p_option) {
                // POINT: get/setFilter 는 후처리해야함
                if (p_option.hasOwnProperty(prop) && 
                    ['domType', 'isReadOnly', 'isHide', 'element', 'selector', 'getFilter', 'setFilter'].indexOf(prop) > -1) {
                    this[prop] = p_option[prop];
                }
            }
        }
        // 기본값 설정
        // this.default = this.default || '';
    }
    Util.inherits(HTMLColumn, _super);
    
    HTMLColumn._UNION = [];
    HTMLColumn._NS = 'Meta.Entity';                                 // namespace
    HTMLColumn._PARAMS = ['columnName', '_entity'];                 // creator parameter        // REVIEW: 통일 시켜야함
    HTMLColumn._VALUE_TYPE = [null, String, Number, Boolean];

    /**
     * HTMLColumn 을 복제합니다.
     * 
     * @returns {HTMLColumn}
     */
    HTMLColumn.prototype.clone  = function(p_entity) {
        // var clone;
        // var rObj = this.getObject();
        var entity = p_entity ? p_entity : this._entity;

        // var top = _super.prototype.clone.call(this);
        var clone = new HTMLColumn(this.columnName, entity);

        // for(var prop in top) {
        //     if (top.hasOwnProperty(prop)) {
        //         if (top[prop]) clone[prop] = top[prop];
        //     }
        // }
        if (this['default'] !== '') clone.default = this['default'];
        if (this['caption'] !== '') clone.caption = this['caption'];
        if (this['required']) clone.required = this['required'];
        // if (this['optional']) clone.isNullPass = this['optional'];
        if (this['constraints']) clone.constraints = this['constraints'];
        if (this['getter']) clone.getter = this['getter'];
        if (this['setter']) clone.setter = this['setter'];
        if (this['$alias'] !== null) clone.$alias = this['$alias'];
        if (this['$value'] !== null) clone.$value = this['$value'];
        if (this['domType']) clone.domType = this['domType'];
        if (this['isReadOnly']) clone.isReadOnly = this['isReadOnly'];
        if (this['isHide']) clone.isHide = this['isHide'];
        if (this['element']) clone.element = this['element'];
        if (this['selector']) clone.selector = this['selector'];
        if (this['getFilter']) clone.getFilter = this['getFilter'];
        if (this['setFilter']) clone.setFilter = this['setFilter'];

        // if (this.selector) clone.__selector        = this.__selector.concat([]); // 배열 + 함수형
        
        return clone;
    };

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    HTMLColumn.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (this.domType !== null) obj['domType'] = this.domType;
        if (this.isReadOnly !== false) obj['isReadOnly'] = this.isReadOnly;
        if (this.isHide !== false) obj['isHide'] = this.isHide;
        if (this.element !== null) obj['element'] = this.element;
        if (this.selector !== null) obj['selector'] = this.selector;
        if (this.getFilter !== null) obj['getFilter'] = this.getFilter;
        if (this.setFilter !== null) obj['setFilter'] = this.setFilter;
        // if (this.value !== null) obj['value'] = this.value; // 상위에서 설정함
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.  
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    HTMLColumn.prototype.setObject = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        // var origin = p_origin ? p_origin : p_oGuid;
        // var entity;

        if (p_oGuid['domType']) this.domType = p_oGuid['domType'];
        if (typeof p_oGuid['isReadOnly'] !== 'undefined') this.isReadOnly = p_oGuid['isReadOnly'];
        if (typeof p_oGuid['isHide'] !== 'undefined') this.isHide = p_oGuid['isHide'];
        if (p_oGuid['element']) this.element = p_oGuid['element'];
        if (p_oGuid['selector']) this.selector = p_oGuid['selector'];
        if (p_oGuid['getFilter']) this.getFilter = p_oGuid['getFilter'];
        if (p_oGuid['setFilter']) this.setFilter = p_oGuid['setFilter'];
    };

    // TODO: 컬럼간 변환 기능
    // HTMLColumn.prototype.toEntityColumn = function() {
    // };

    return HTMLColumn;

}(MetaColumn));

/**** base-bind.js | BaseBind ****/
//==============================================================


var BaseBind = (function (_super) {
    /**
     * 기본 바인드 (최상위)
     * 
     * @constructs BaseBind
     * @abstract
     * @extends MetaObject
     */
    function BaseBind() {
        _super.call(this);

        var $event = new EventEmitter(this, this);
        var $KEYWORD = [];
        var _baseTable = null;

        /** 
         * 이벤트 객체
         * 
         * @private 
         * @member {EventEmitter} BaseBind#$event  
         */
        Object.defineProperty(this, '$event', {
            get: function() { return $event; },
            configurable: false,
            enumerable: false,
        });
        
        /** 
         * 컬렉션 예약어
         * 
         * @private
         * @member {array<string>}  BaseCollection#$KEYWORD  
         */
        Object.defineProperty(this, '$KEYWORD', {
            get: function() { return $KEYWORD; },
            set: function(newVal) { $KEYWORD = $KEYWORD.concat(newVal); },
            configurable: false,
            enumerable: false,
        });

        /**
         * 기본 엔티티
         * 
         * @member BaseBind#_baseTable
         * @protected
         */
        Object.defineProperty(this, '_baseTable', {
            get: function() { return _baseTable; },
            set: function(nVal) { 
                if (!(nVal instanceof MetaTable)) throw new ExtendError(/EL06111/, null, [this.constructor.name]);
                _baseTable = nVal;
            },
            configurable: true,
            enumerable: true
        });  

        /**
         * 실행 전 이벤트
         * 
         * @event BaseBind#onExecute
         */
        Object.defineProperty(this, 'onExecute', {
            enumerable: true,
            configurable: true,
            set: function(p_fn) {
                if (typeof p_fn !== 'function') throw new ExtendError(/EL06112/, null, [this.constructor.name]);
                this.$event.on('execute', p_fn);
            }
        });

        /**
         * 실행후 이벤트
         * 
         * @event BaseBind#onExecuted
         */
        Object.defineProperty(this, 'onExecuted', {
            enumerable: true,
            configurable: true,
            set: function(p_fn) {
                if (typeof p_fn !== 'function') throw new ExtendError(/EL06113/, null, [this.constructor.name]);
                this.$event.on('executed', p_fn);
            }
        });

        // 예약어 등록
        this.$KEYWORD = ['equal', 'instanceOf', 'getTypes'];            // IObject
        this.$KEYWORD = ['_guid', '_type', 'getObject', 'setObject'];   // IMarshal
        this.$KEYWORD = ['$event', '$KEYWORD', '_baseTable'];
        this.$KEYWORD = ['addColumn'];
        this.$KEYWORD = ['onExecute', 'onExecuted'];
        this.$KEYWORD = ['_onExecute', '_onExecuted'];

        Util.implements(BaseBind, this);        // strip:
    }
    Util.inherits(BaseBind, _super);

    BaseBind._UNION = [IBind];
    BaseBind._NS = 'Meta.Bind';
    BaseBind._PARAMS = [];
    BaseBind._KIND = 'abstract';

    /**
     * 실행 전 이벤트 리스너
     * 
     * @param {*} p_command 바인드 커맨드
     * @param {*} [p_model] 바인드 모델
     * @listens BaseBind#_onExecute
     */
    BaseBind.prototype._onExecute = function(p_model, p_command) {
        this.$event.emit('execute', p_model, p_command, this);
    };

    /**
     * 실행 후 이벤트 리스너
     * 
     * @param {*} p_command 바인드 커맨드
     * @param {*} [p_model] 바인드 모델
     * @listens BaseBind#_onExecuted
     */
    BaseBind.prototype._onExecuted = function(p_model, p_command) {
        this.$event.emit('executed', p_model, p_command, this); 
    };

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BaseBind.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (!Type.deepEqual(this.$event.$storage, {})) {
            obj['$storage'] = this.$event.$storage;
        }
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BaseBind.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        // var origin = p_origin ? p_origin : p_oGuid;
        // var baseTable;
        
        if (p_oGuid['$storage']) {
            this.$event.$storage = p_oGuid['$storage'];
        }
    };

    /** 
     * 메타테이블에 컬럼을 추가합니다.
     * 
     * @abstract
     */
    BaseBind.prototype.addColumn = function() {
        throw new ExtendError(/EL06114/, null, [this.constructor.name]);
    };

    return BaseBind;

}(MetaObject));

/**** bind-command.js | BaseBindCommand ****/
//==============================================================

var BaseBindCommand  = (function (_super) {
    /**
     * 바인드 명령 
     * 
     * @constructs BaseBindCommand
     * @abstract
     * @extends BaseBind
     * @param {BaseBindModel} p_BaseBindModel 
     * @param {MetaTable} [p_baseTable] 
     */
    function BaseBindCommand(p_BaseBindModel, p_baseTable) {
        _super.call(this);
        
        // p_baseTable = p_baseTable || p_BaseBindModel._baseTable;     // 기본값
        if (!p_baseTable && p_BaseBindModel && p_BaseBindModel._baseTable) {
            p_baseTable = p_BaseBindModel._baseTable;
        }

        var $newOutput          = [];
        var _this               = this;
        var _model              = null;
        var _outputs            = null;
        var valid;
        var bind;
        var misc;
        var cbBegin;
        var cbValid;
        var cbBind;
        var cbResult;
        var cbEnd;
        var cbOutput;
        var outputOption        = { option: 0, index: 0 };     // 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만          
        var state;

        // if (p_baseTable && !(p_BaseBindModel instanceof MetaObject && p_baseTable.instanceOf('BaseEntity'))) {
        //     throw new Error('Only [p_baseTable] type "BaseEntity" can be added');
        // }
        
        /**
         * 별칭 내부값
         * 
         * @member {string | number | boolean} BaseBindCommand#$model
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$model', {
            get: function() { return _model; },
            set: function(nVal) { _model = nVal; },
            configurable: false,
            enumerable: false,
        });

        /**
         * 별칭 내부값
         * 
         * @member {string | number | boolean} BaseBindCommand#$newOutput
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$newOutput', {
            get: function() { return $newOutput; },
            set: function(nVal) { $newOutput = nVal; },
            configurable: false,
            enumerable: false,
        });

        /**
         * _outputs MetaView 컬켁션
         * 
         * @member {BaseBindModel} BaseBindCommand#_outputs
         * @readonly
         * @protected
         */
        Object.defineProperty(this, '_outputs', {
            get: function() { 
                if (_outputs === null) _outputs = new MetaViewCollection(_this, _this._baseTable);
                return _outputs;
            },
            // set: function(nVal) { 
            //     if (!(nVal instanceof MetaViewCollection)) {
            //         throw new Error('Only [_outputs] type "MetaViewCollection" can be added');
            //     }
            //     _outputs = nVal;
            // },
            configurable: false,
            enumerable: true
        });

        /**
         * _model 바인드모델
         * 
         * @member {BaseBindModel} BaseBindCommand#_model
         * @readonly
         */
        Object.defineProperty(this, '_model', {
            get: function() { return _model; },
            // set: function(nVal) { 
            //     if (!(nVal instanceof MetaObject && nVal.instanceOf('BaseBindModel'))) {
            //         throw new Error('Only [_model] type "BaseBindModel" can be added');
            //     }
            //     _model = nVal;
            // },
            configurable: false,
            enumerable: true
        });

        /**
         * 검사대상 MetaView
         * 
         * @member {MetaView} BaseBindCommand#valid 
         */
        Object.defineProperty(this, 'valid', {
            get: function() { 
                if (typeof valid === 'undefined') valid = new MetaView('valid', _this._baseTable);
                return valid; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof MetaView)) throw new ExtendError(/EL061301/, null, [this.constructor.name]);
                valid = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드 MetaView
         * 
         * @member {MetaView} BaseBindCommand#bind 
         */
        Object.defineProperty(this, 'bind', {
            get: function() { 
                if (typeof bind === 'undefined') bind = new MetaView('bind', _this._baseTable);
                return bind; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof MetaView)) throw new ExtendError(/EL061302/, null, [this.constructor.name]);
                bind = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 기타 MetaView
         * 
         * @member {MetaView} BaseBindCommand#misc 
         */
        Object.defineProperty(this, 'misc', {
            get: function() { 
                if (typeof misc === 'undefined') misc = new MetaView('misc', _this._baseTable);
                return misc; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof MetaView)) throw new ExtendError(/EL061302/, null, [this.constructor.name]);  // REVIEW: EL061302 오류 코드 중복됨
                misc = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 출력(output) 특성  
         * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만  
         * 
         * @member {object} BaseBindCommand#outputOption 
         */
        Object.defineProperty(this, 'outputOption', {
            get: function() { return outputOption; },
            set: function(nVal) { 
                if (typeof nVal === 'number' ) outputOption['option'] = nVal;
                else if (typeof nVal === 'object') {
                    if (typeof nVal['option'] === 'number') outputOption['option'] = nVal['option'];
                    if (typeof nVal['index'] === 'number' || Array.isArray(nVal['index'])) outputOption['index'] = nVal['index'];
                } else throw new ExtendError(/EL061303/, null, [this.constructor.name]);
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 출력(output) 특성  === outputOption  
         * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만  
         * 
         * @member {object} BaseBindCommand#outOpt 
         */
        Object.defineProperty(this, 'outOpt', {
            get: function() { return this.outputOption; },
            set: function(nVal) { this.outputOption = nVal;},
            configurable: true,
            enumerable: false
        });

        /**
         * 시작 전 콜백
         * 
         * @member {Function} BaseBindCommand#cbBegin 
         */
        Object.defineProperty(this, 'cbBegin', {
            get: function() { return cbBegin; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061304/, null, [this.constructor.name]);
                cbBegin = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 검사(valid) 전 콜백
         * 
         * @member {Function} BaseBindCommand#cbValid 
         */
        Object.defineProperty(this, 'cbValid', {
            get: function() { return cbValid; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061305/, null, [this.constructor.name]);
                cbValid = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드(bind) 전 콜백
         * 
         * @member {Function} BaseBindCommand#cbBind
         */
        Object.defineProperty(this, 'cbBind', {
            get: function() { return cbBind; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061306/, null, [this.constructor.name]);
                cbBind = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드(bind) 결과 콜백 (주요 : 회신자료의 가공의 역활)
         * 
         * @member {Function} BaseBindCommand#cbValid 
         */
        Object.defineProperty(this, 'cbResult', {
            get: function() { return cbResult; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061307/, null, [this.constructor.name]);
                cbResult = nVal;
            },
            configurable: true,
            enumerable: true
        });

        /**
         * 바인드 결과 출력 콜백 (주요: 목록의 출력)
         * 
         * @member {Function} BaseBindCommand#cbOutput 
         */
        Object.defineProperty(this, 'cbOutput', {
            get: function() { return cbOutput; },
            set: function(nVal) { 
                if (typeof nVal  !== 'function') throw new ExtendError(/EL061308/, null, [this.constructor.name]);
                cbOutput = nVal;
            },
            configurable: true,
            enumerable: true
        });
        
        /**
         * 바인드 처리 종료 후 콜백 (주요: 다른 이벤트 또는 명령과의 연결)
         * 
         * @member {Function} BaseBindCommand#cbEnd 
         */
        Object.defineProperty(this, 'cbEnd', {
            get: function() { return cbEnd; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061309/, null, [this.constructor.name]);
                cbEnd = nVal;
            },
            configurable: true,
            enumerable: true
        });    

        /**
         * exectue 처리 상태 0 ~ 8, -1 ~ -8 은 실패 위치
         * 
         * @member {Function} BaseBindCommand#state 
         */
        Object.defineProperty(this, 'state', {
            get: function() { return state; },
            set: function(nVal) { 
                if (typeof nVal !== 'number') throw new ExtendError(/EL061336/, null, [this.constructor.name]);
                state = nVal;
            },
            configurable: true,
            enumerable: true
        });  


        // default set
        if (p_baseTable) this._baseTable = p_baseTable;
        if (p_BaseBindModel) this.$model = p_BaseBindModel;
        this.newOutput('output');

        // 예약어 등록
        this.$KEYWORD = ['_model', '_outputs'];
        this.$KEYWORD = ['valid', 'bind', 'output', 'misc'];
        this.$KEYWORD = ['cbBegin', 'cbValid', 'cbBind', 'cbResult', 'cbOutput', 'cbEnd'];
        this.$KEYWORD = ['outputOption', 'outOpt', 'state'];
        this.$KEYWORD = ['addColumnValue', 'setColumn', 'release', 'execute', 'exec', 'newOutput', 'removeOutput'];

        Util.implements(BaseBindCommand, this);         // strip:
    }
    Util.inherits(BaseBindCommand, _super);

    BaseBindCommand._UNION = [IBindCommand, ICommandCallback];
    BaseBindCommand._NS = 'Meta.Bind';
    BaseBindCommand._PARAMS = ['_model', '_baseTable'];
    BaseBindCommand._KIND = 'abstract';

    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    function _isObject(obj) {
        if (typeof obj !== null && typeof obj === 'object') return true;
        return false;   
    }

    function _getTableName(itemName) {
        var tName = '';
        if (itemName.indexOf('.') > -1) tName = itemName.split('.')[0];
        return tName;
    }
    
    function _getColumnName(itemName) {
        var cName;
        if (itemName.indexOf('.') > -1) cName = itemName.split('.')[1];
        else cName = itemName;
        if (!_isString(cName)) throw new ExtendError(/EL061310/, null, [cName]);
        return cName;
    }

    function _isAllName(p_name) {
        if (p_name.toLowerCase() === '$all') return true;
        return false;
    }
    function _getPropDescriptor(_this, oName) {
        return {
            get: function() { return _this._outputs[oName];},
            set: function(newVal) { 
                if (!(newVal instanceof MetaView)) throw new ExtendError(/EL061311/, null, [oName]);
                _this._outputs[oName] = newVal;
            },
            configurable: true,
            enumerable: true
        };
    }

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BaseBindCommand.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (MetaRegistry.hasGuidObject(this._baseTable, owned)) {
            obj['_baseTable'] = MetaRegistry.createReferObject(this._baseTable);
        } else obj['_baseTable'] = this._baseTable.getObject(vOpt, owned);

        obj['_outputs']     = this._outputs.getObject(vOpt, owned);
        if (vOpt < 2 && vOpt > -1 && this._model) {
            obj['_model'] = MetaRegistry.createReferObject(this._model);
        }
        obj['valid']        = this.valid.getObject(vOpt, owned);
        obj['bind']         = this.bind.getObject(vOpt, owned);
        obj['misc']         = this.misc.getObject(vOpt, owned);

        obj['outputOption'] = this.outputOption;
        
        obj['cbBegin']      = this.cbBegin;
        obj['cbValid']      = this.cbValid;
        obj['cbBind']       = this.cbBind;
        obj['cbResult']     = this.cbResult;
        obj['cbOutput']     = this.cbOutput;
        obj['cbEnd']        = this.cbEnd;            
        obj['$newOutput']   = this.$newOutput;

        return obj;
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BaseBindCommand.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;
        var _model;

        if (MetaRegistry.isGuidObject(p_oGuid['_baseTable'])) {
            var obj = MetaRegistry.createMetaObject(p_oGuid['_baseTable'], origin);
            obj.setObject(p_oGuid['_baseTable'], origin);
            this._baseTable = obj;
            
        } else if (p_oGuid['_baseTable']['$ref']) {
            var meta = MetaRegistry.findSetObject(p_oGuid['_baseTable']['$ref'], origin);
            if (!meta) throw new ExtendError(/EL061312/, null, [p_oGuid['_baseTable']['$ref']]);
            this._baseTable = meta;
        } else throw new ExtendError(/EL061313/, null, [p_oGuid['_baseTable']['$ref']]);

        this._outputs.setObject(p_oGuid['_outputs'], origin);
        if (p_oGuid['_model']) {
            _model = MetaRegistry.findSetObject(p_oGuid['_model']['$ref'], origin);
            if (!_model) throw new ExtendError(/EL061314/, null, [p_oGuid['_baseTable']['$ref']]);
            this.$model = _model;
        }

        this.valid.setObject(p_oGuid['valid'], origin);
        this.bind.setObject(p_oGuid['bind'], origin);
        this.misc.setObject(p_oGuid['misc'], origin);

        this.outputOption = p_oGuid['outputOption'];
        
        if (typeof p_oGuid['cbBegin'] === 'function') this.cbBegin = p_oGuid['cbBegin'];
        if (typeof p_oGuid['cbValid'] === 'function') this.cbValid = p_oGuid['cbValid'];
        if (typeof p_oGuid['cbBind'] === 'function') this.cbBind = p_oGuid['cbBind'];
        if (typeof p_oGuid['cbResult'] === 'function') this.cbResult = p_oGuid['cbResult'];
        if (typeof p_oGuid['cbOutput'] === 'function') this.cbOutput = p_oGuid['cbOutput'];
        if (typeof p_oGuid['cbEnd'] === 'function') this.cbEnd = p_oGuid['cbEnd'];

        this.$newOutput = p_oGuid['$newOutput'];
        for(var i = 0; i < this.$newOutput.length; i++) {
            var nObj = this.$newOutput[i];
            Object.defineProperty(this, nObj.cmdName, _getPropDescriptor(this, nObj.viewName));
        }
    };

    /** 
     * 실행 ( valid >> bind >> result >> output >> end )
     * 
     * @abstract 
     */
    BaseBindCommand.prototype.execute = function() {
        throw new ExtendError(/EL061315/, null, [this.constructor.name]);
    };

    /** 
     * execute 메소드 별칭
     */
    BaseBindCommand.prototype.exec = BaseBindCommand.prototype.execute;

    
    /**
     * 컬럼을 추가하고 지정 테이블에 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output, misc MetaView 에 등록합니다.
     * 
     * @param {string | MetaColumn} p_column 컬럼
     * @param {string | string[]} p_views 추가할 뷰 엔티티  TODO: 필수 조건으로 변경함, 전체추가시 [] 빈배열 전달
     * @param {string | MetaTable} [p_bTable] 추가할 메타테이블
     */
    BaseBindCommand.prototype.addColumn = function(p_column, p_views, p_bTable) {
        var views = [];     // 파라메터 변수
        var property = [];      // View 실체 
        var collection;
        var table;
        var column;
        var idx;

        // 1.유효성 검사
        if (!(p_column instanceof MetaColumn || _isString(p_column))) {
            throw new ExtendError(/EL061316/, null, []);
        }
        if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
            throw new ExtendError(/EL061317/, null, []);
        }
        // if (p_bTable && !(p_bTable instanceof MetaTable)) {
        //     throw new Error('Only [p_bTable] type "MetaTable" can be added');
        // }

        // 2.초기화 설정
        if (Array.isArray(p_views)) views = p_views;
        else if (typeof p_views === 'string') views.push(p_views);
        // $all 일 경우 빈배열로 변경
        if (views.some(function(elem){
            if (!_isString(elem)) throw new ExtendError(/EL061319/, null, [i, typeof views[i]]);
            if (_isAllName(elem)) return true;
            return false;
        })) views.length = 0;


        if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
        else table = p_bTable || this._baseTable;
        
        if (!(table instanceof MetaTable)) {
            throw new ExtendError(/EL061318/, null, []);
        }
        if (_isString(p_column)) column = new this._model._columnType(p_column, table);
        else column = p_column;

        // baseTable 에 컬럼이 없으면 등록, 중복이름은 기존 이름을 사용함
        if (!table.columns.contains(column))  {
            idx = table.columns.add(column);
            column = table.columns[idx];
        }

        // 3.설정 대상 가져오기
        if (views.length > 0) {
            for (var i = 0; i < views.length; i++) {
                
                // 속성 유무 검사
                if (this[views[i]]) property.push(views[i]);
                else throw new ExtendError(/EL061320/, null, [i, views[i]]);
            }
        } else {
            // 공개(public) BaseEntity 프로퍼티 검사
            property = ['valid', 'bind', 'misc'];
            for (var j = 0; j < this._outputs.count; j++) {
                property.push(this._outputs.indexToKey(j));
            }
        }

        // 4.컬렉션 추가(등록)
        for (var k = 0;  k < property.length; k++) {
            collection = this[property[k]].columns;
            // if (this[property[i]] instanceof MetaView ){
            // } else {
            //     // console.warn('Warning!! [' + property[i] + ']속성이 this 에 없습니다. ');
            //     throw new Error(' Param p_views 에 [' + property[i] + ']가 없습니다. ');
            // }
            collection.add(column, table.columns);
        }
    };

    /**
     * 지정한 이름으로 컬럼과 값을 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output MetaView 에 등록합니다.
     * 
     * @param {string} p_name 컬럼명
     * @param {object | string | number | boolean} p_value 컬럼값 또는 속성
     * @param {string | string[]} [p_views] <선택> 추가할 뷰 엔티티
     * @param {string | MetaTable} [p_bTable] 대상 기본 엔티티 
     */
    BaseBindCommand.prototype.addColumnValue = function(p_name, p_value, p_views, p_bTable) {
        var property = {};
        var table;
        var tableName;
        var columnName;
        var column;        
        
        // 유효성 검사
        if (!_isString(p_name)) {
            throw new ExtendError(/EL061321/, null, [typeof p_name]);
        }
        // if (p_bTable && !(p_bTable instanceof MetaTable)) {
        //     throw new Error('Only [p_bTable] type "MetaTable" can be added');
        // }

        columnName = _getColumnName(p_name);
        tableName = _getTableName(p_name);

        if (tableName) {
            table = this._model._tables[tableName];
        } else table = this._model._tables[p_bTable] || this._baseTable;

        if (tableName) table = this._model._tables[tableName];
        else if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
        else table = p_bTable || this._baseTable;

        if (_isObject(p_value)) property = p_value;
        else property = { value: p_value };
        
        if (!(table instanceof MetaTable)) {
            throw new ExtendError(/EL061322/, null, []);
        }

        column = new this._model._columnType(columnName, table, property);  // REVIEW: 파라메터 일반화 요구됨
        this.addColumn(column, p_views, table);
    };

    /**
     * 메타테이블의 컬럼을 지정한 MetaView 에 설정합니다.
     * 
     * @param {string | array} p_names 컬럼명
     * @param {string | string[]} [p_views] 설정할 뷰
     * @param {string | MetaTable} [p_bTable] 컬럼을 소유한 메타테이블
     * @example
     * e.read.setEntity(['idx', 'addr'], 'valid');
     */
    BaseBindCommand.prototype.setColumn = function(p_names, p_views, p_bTable) {

        var names = [];     // 파라메터 변수
        var itemName;
        var column;
        var table;
        var tableName;
        var columnName;            

        // 초기화
        if (Array.isArray(p_names)) names = p_names;
        else if (typeof p_names === 'string') names.push(p_names);

        // 유효성 검사
        if (names.length === 0) throw new ExtendError(/EL061323/, null, []);

        // 아이템 검사 및 등록 함수 this.add(..) 호출
        for(var i = 0; names.length > i; i++) {
            itemName = names[i]; 

            if (!_isString(itemName)) {
                throw new ExtendError(/EL061323/, null, [i, typeof itemName]);
            }

            columnName = _getColumnName(itemName);
            tableName = _getTableName(itemName);

            // if (tableName) {
            //     table = this._model._tables[tableName];
            // } else table = this._baseTable;
            if (tableName) table = this._model._tables[tableName];
            else if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
            else table = p_bTable || this._baseTable;

            if (!(table instanceof MetaTable)) {
                throw new ExtendError(/EL061325/, null, []);
            }

            column = table.columns[columnName];
            if (typeof column !== 'undefined') {
                this.addColumn(column, p_views, table);
            } else {
                throw new ExtendError(/EL061326/, null, [columnName]);
            }
        }
    };

    /**
     * 지정한 컬럼을 대상 MeteView 에서 제거합니다.  (컬럼삭제 아님)
     * 
     * @param {string | string[]} p_names 해제할 아이템명
     * @param {string | string[]} [p_views] 'valid', 'bind', 'output', 'misc' 해제할 뷰 엔티티 지정
     * 
     * @example
     * e.read.release(['idx', 'addr'], 'valid');
     */
    BaseBindCommand.prototype.release = function(p_names, p_views) {

        var names = [];         // 파라메터 변수
        var views = [];      // 파라메터 변수
        var property = [];      // 속성
        var columnName;
        var viewName;

        // 초기화
        if (Array.isArray(p_names)) names = p_names;
        else if (_isString(p_names)) names.push(p_names);
        // 1. 유효성 검사
        if (names.length === 0) throw new ExtendError(/EL061327/, null, []);
        if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
            throw new ExtendError(/EL061328/, null, []);
        } 
        // 2. 초기화 설정
        if (Array.isArray(p_views)) views = p_views;
        else if (typeof p_views === 'string') views.push(p_views);
        // $all 일 경우 빈배열로 변경
        if (views.some(function(elem){
            if (!_isString(elem)) throw new ExtendError(/EL061329/, null, [i, typeof views[i]]);
            if (_isAllName(elem)) return true;
            return false;
        })) views.length = 0;
        
        // 3. 설정 대상 가져오기
        if (views.length > 0) {
            for (var i = 0; i < views.length; i++) {
                viewName = views[i];
                if (!_isString(viewName)) throw new ExtendError(/EL061329/, null, [i, typeof viewName]);
                // 속성 유무 검사
                if (this[viewName]) property.push(viewName);
                else throw new ExtendError(/EL061330/, null, [viewName]);
            }
        } else {
            property = ['valid', 'bind', 'misc'];
            for (var j = 0; j < this._outputs.count; j++) {
                property.push(this._outputs.indexToKey(j));
            }
        }
        // 4. 아이템 검사 및 아이템 해제
        for(var k = 0; names.length > k; k++) {
            columnName = names[k]; 
            for (var m = 0; property.length > m; m++) {
                var idx = this[property[m]].columns.keyToIndex(columnName);
                if (idx > -1) this[property[m]].columns.removeAt(idx);
            }
        }
    };

    /**
     * _output MetaViewCollection 에 MetaView 을 추가합니다.  
     * -  기본 이름 =  'output' + _outout.count  
     * 
     * @param {string} [p_name] MetaView 이름
     */
    BaseBindCommand.prototype.newOutput = function(p_name) {
        var _this = this;
        var cntName = 'output' + (Number(this._outputs.count) + 1);

        // 유효성 검사
        if (p_name && !_isString(p_name)) throw new ExtendError(/EL061331/, null, [typeof p_name]);

        // 이름 추가
        $addOutput(cntName);

        // 참조 이름 추가
        if (_isString(p_name)) {
            if (!$checkDoubleName(p_name)) {
                throw new ExtendError(/EL061332/, null, [typeof p_name]);
            }
            this.$newOutput.push({ cmdName: p_name, viewName: cntName });
            Object.defineProperty(this, p_name, _getPropDescriptor(this, cntName));
        }
        
        // inner function
        function $addOutput(vName) {
            _this._outputs.add(new MetaView(vName, _this._baseTable));  // 등록방법 1   // TODO: getter/setter 추가 필요 검토?
            Object.defineProperty(_this, vName, _getPropDescriptor(_this, vName));
            return _this._outputs[vName];
        }
        function $checkDoubleName(newName) {
            // 예약어 검사
            if (_this.$KEYWORD.indexOf(newName) > -1) return false;
            // 이름 중복 검사
            if (typeof _this[newName] !== 'undefined') return false;
            return true;
        }
    };

    /**
     * _output MetaViewCollection 에 MetaView 을 제거합니다.  
     * 
     * @param {string} p_name 
     */
    BaseBindCommand.prototype.removeOutput = function(p_name) {
        // var idx = this._outputs.indexToKey(p_name);
        var defOutput = this['output'];
        var view;
        var pos;

        if (!_isString(p_name)) throw new ExtendError(/EL061333/, null, [typeof p_name]);
        
        view = this[p_name];
        if (view === defOutput)  throw new ExtendError(/EL061334/, null, [p_name]);
        
        if (this._outputs.indexOf(view) < 0) throw new ExtendError(/EL061335/, null, [p_name]);

        pos = this.$newOutput.indexOf(p_name);

        delete this[p_name];
        this.$newOutput.splice(pos, 1);
        this._outputs.remove(view);
    };

    return BaseBindCommand;

}(BaseBind));

function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************

var utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError$1(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils$1.inherits(AxiosError$1, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype$1 = AxiosError$1.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError$1, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError$1.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError$1.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData$1(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError$1('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData$1(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

var platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hasBrowserEnv: hasBrowserEnv,
    hasStandardBrowserEnv: hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin: origin
});

var platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data) ||
      utils$1.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData$1(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

let AxiosHeaders$1 = class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
};

AxiosHeaders$1.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders$1);

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError$1(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError$1.call(this, message == null ? 'canceled' : message, AxiosError$1.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError$1, AxiosError$1, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$1(
      'Request failed with status code ' + response.status,
      [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};

const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;

var cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$1.isString(path) && cookie.push('path=' + path);

      utils$1.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig$1(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

var resolveConfig = (config) => {
  const newConfig = mergeConfig$1({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError$1('Request aborted', AxiosError$1.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError$1(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError$1('Unsupported protocol ' + protocol + ':', AxiosError$1.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils$1.asap(unsubscribe);

    return signal;
  }
};

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
};

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils$1.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
      });
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils$1.isBlob(body)) {
    return body.size;
  }

  if(utils$1.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils$1.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};

const resolveBodyLength = async (headers, body) => {
  const length = utils$1.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
};

var fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader);
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError$1.from(err, err && err.code, config, request);
  }
});

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};

utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError$1(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel$1(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const VERSION$1 = "1.8.4";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION$1 + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError$1(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError$1.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError$1('options must be an object', AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1('option ' + opt + ' must be ' + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1('Unknown option ' + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
let Axios$1 = class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig$1(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios$1.prototype[method] = generateHTTPMethod();

  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
let CancelToken$1 = class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError$1(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread$1(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError$1(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode$1 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;

// Expose AxiosError class
axios.AxiosError = AxiosError$1;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread$1;

// Expose isAxiosError
axios.isAxiosError = isAxiosError$1;

// Expose mergeConfig
axios.mergeConfig = mergeConfig$1;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = axios;

/**** bind-command-ajax.js | BindCommand ****/
//==============================================================

var EXEC_STATE = {
    INIT: 0,
    ON_EXECUTE: 1,
    BEGIN: 2,
    VALID: 3,
    BIND: 4,
    RESULT: 5,
    OUTPUT: 6,
    END: 7,
    ON_EXECUTED: 8
};

var BindCommand  = (function (_super) {
    /**
     * 바인드 명령 Ajax 
     * 
     * @constructs BindCommand
     * @extends BaseBindCommand
     * @param {BaseBindModel} p_BaseBindModel 
     * @param {Number | obejct} p_outputOption 
     * @param {Entity} p_baseTable 
     */
    function BindCommand(p_BaseBindModel, p_outputOption, p_baseTable) {
        _super.call(this, p_BaseBindModel, p_baseTable);

        var config = {
            url: null,              // 요청 경로
            method: null,           // 전송 방법 : GET, POST TODO: method 교체 요망
            responseType: null      //      TODO: responseType 으로 교체 요망
        };
        
        /**
         * config 설정값 (jquery의 config 과 동일)
         * 
         * @member {Object} BindCommand#config 
         */
        Object.defineProperty(this, 'config', {
            get: function() { return config; },
            set: function(nVal) {
                if (typeof nVal === 'object') {
                    if (typeof nVal['url'] === 'string')            config['url'] = nVal['url'];
                    if (typeof nVal['method'] === 'string')           config['method'] = nVal['method'];
                    if (typeof nVal['responseType'] === 'string')       config['responseType'] = nVal['responseType'];
                    for (var prop in nVal) {
                        if (prop === 'url' || prop === 'method' || prop === 'responseType') continue;
                        config[prop] = nVal[prop];
                    }
                } else throw new ExtendError(/EL06161/, null, [this.constructor.name]);
            },
            configurable: true,
            enumerable: true
        });
        
        /**
         * config.url 의 값에 설정한다.
         * 
         * @member {String} BindCommand#url 
         */
        Object.defineProperty(this, 'url', {
            get: function() { return config.url; },
            set: function(nVal) {
                if (!(_isString(nVal))) throw new ExtendError(/EL06162/, null, [this.constructor.name]);
                config.url = nVal;
            },
            configurable: true,
            enumerable: true
        }); 

        // outputOption 설정
        if (p_outputOption) this.outputOption = p_outputOption;

        // 예약어 등록
        this.$KEYWORD = ['config', 'url'];
        this.$KEYWORD = ['_execValid', '_execBind', '_execOutput'];
        this.$KEYWORD = ['_ajaxSuccess', '_execError', '_ajaxComplete', '_ajaxCall'];
    }
    Util.inherits(BindCommand, _super);

    BindCommand._UNION = [];
    BindCommand._NS = 'Meta.Bind';
    BindCommand._PARAMS = ['_model', 'outputOption', '_baseTable'];
    
    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    function _isObject(obj) {
        if (obj !== null && typeof obj === 'object') return true;
        return false;
    }

    /**
     * execute() 실행시 처음으로 실행됩니다.  
     * 
     * @protected
     */
    BindCommand.prototype._execBegin = function() {
        this.state = EXEC_STATE.ON_EXECUTE;
        this._model._onExecute(this._model, this);
        this._onExecute(this._model, this);         // '실행 시작' 이벤트 발생

        this.state = EXEC_STATE.BEGIN;
        if (typeof this.cbBegin === 'function' ) {
            this.cbBegin.call(this, this);
        } else if (typeof this._model.cbBaseBegin === 'function') {
            this._model.cbBaseBegin.call(this, this);
        }
    };

    /** 
     * cbValid 콜백함수를 실행하고 view(MetaView)의 유효성을 검사합니다.
     * 
     * @returns {boolean} 유효성 검사 결과
     * @protected
     */
    BindCommand.prototype._execValid = function() {
        var result = {};     // 오류 참조 변수
        var value = null;
        var bReturn = true;

        this.state = EXEC_STATE.VALID;
        // 콜백 검사 (valid)
        if (typeof this.cbValid  === 'function') {
            bReturn = this.cbValid.call(this, this.valid, this);
        } else if (typeof this._model.cbBaseValid  === 'function') {
            bReturn = this._model.cbBaseValid.call(this, this.valid, this);
        }

        // undefined 회신을 안할 경우
        // bReturn = typeof bReturn !== 'boolean' ? true : bReturn;
        
        // if (bReturn === false)

        // valid 검사 결과
        // if (!bReturn) {
        //     this._execFail('valid 검사가 실패하였습니다.');
        //     return false;
        // }
        if (!bReturn) {     // undefind 는 종료하지만, 실패 처리는 하지 않는다.
            if (bReturn === false) this._execFail('valid 검사가 실패하였습니다.');
            return false;
        }

        // 아이템 검사
        for(var i = 0; i < this.valid.columns.count; i++) {
            value = this.valid.columns[i].value;
            
            // 공백 && isNotNull = false    => 검사 넘어감
            // 공백 && isNotNull = true     => 오류 리턴
            // 값존재시                     => 검사 수행
            // if (value.length > 0 || this.valid.columns[i].isNotNull) {
            // if (typeof this.valid.columns[i].valid(value, result, 2) !== 'undefined') {
            result = this.valid.columns[i].valid(value);
            if (result) {
                this._execFail(result.msg);
                return false;
            }
        }
        return true;
    };

    /**
     * cbBind 콜백함수를 실행하고, ajax 을 호출합니다.
     * 
     * @returns {Promise} 프로미스 객체를 리턴합니다.
     * @protected
     */
    BindCommand.prototype._execBind = function() {
        var value;
        var column;
        var config = {};
        
        this.state = EXEC_STATE.BIND;
        // 기본값 못가져오는 오류 변경함 
        config.url           = this.config.url || this._model.baseConfig.url;
        config.method          = this.config.method || this._model.baseConfig.method;
        config.responseType      = this.config.responseType || this._model.baseConfig.responseType;

        for (var prop in this.config) {
            if (typeof config[prop] !== 'undefined') continue;
            config[prop] = this.config[prop];
        }
        
        for (var prop2 in this._model.baseConfig) {
            if (typeof config[prop2] !== 'undefined') continue;
            config[prop2] = this._model.baseConfig[prop2];
        }

        if (!_isObject(config.data)) config.data = {};
        for(var i = 0; i < this.bind.columns.count; i++) {
            var dataName = '';
            column = this.bind.columns[i];
            value = column.value || column.default;
            dataName = column.alias;
            // data가 bind Column 보다 우선순위가 높음
            if (typeof config.data[dataName] === 'undefined') config.data[dataName] = value;    // 별칭에 설정, 없을시 기본 name
        }
        
        // 콜백 검사 (bind)
        if (typeof this.cbBind === 'function') {
            this.cbBind.call(this, this.bind, this, config);
        } else if (typeof this._model.cbBaseBind === 'function') {
            this._model.cbBaseBind.call(this, this.bind, this, config);
        }
        return this._ajaxCall(config);       // Ajax 호출 (web | node)
    };

    /**
     * ajax 호출하고 성공시, cbResult 콜백함수로 결과(data)를 변경합니다.
     * 
     * @param {object} p_data  데이터
     * @param {object} p_res response 객체
     * @returns {object} data
     * @protected
     */
    BindCommand.prototype._execResult = function(p_data, p_res) {
        var data = p_data;

        this.state = EXEC_STATE.RESULT;
        if (typeof this.cbResult === 'function' ) {
            data = this.cbResult.call(this, p_data, this, p_res) || p_data;
        } else if (typeof this._model.cbBaseResult === 'function' ) {
            data = this._model.cbBaseResult.call(this, p_data, this, p_res) || p_data;
        }
        
        return data;
    };

    /**
     * 결과 data 로 outputs ViewCollection 을 설정하고, cbOutput 콜백함수를 호출합니다.
     * 
     * @param {object} p_data data
     * @param {object} p_res response 객체
     * @protected
     */
    BindCommand.prototype._execOutput = function(p_data, p_res) {
        var _this = this;
        var data  = p_data;
        var option = this.outputOption.option;
        var index = this.outputOption.index;
        var loadOption = (option === 1) ? 3  : (option === 2 || option === 3) ? 2 : 0;

        // TODO: result 타입 검사 추가  

        this.state = EXEC_STATE.OUTPUT;

        // 1. 초기화 : opt = 1
        for (var i = 0; this._outputs.count > i; i++) {
            if (loadOption === 1) this._outputs[i].clear();  // 전체 초기화 (item, rows)
            else this._outputs[i].rows.clear();              // Row 초기화
        }
        
        /**
         * - {columns, row}
         * - {props: {colums, rows}, ... }
         * - [ {columns, rows}, ...]
         * - [ {props: {colums, rows} } ] = > X
         */

        // 2. 결과 MetaView 에 로딩
        if ($isEntitySchema(data)) {
            $readOutput(data, 1, loadOption);
        } else {
            if (Array.isArray(data)) {
                for (var j = 0; j < data.length; j++) {
                    $readOutput(data[j], j + 1, loadOption);
                }

            } else if (_isObject(data)){
                var k = 0;
                for (var prop in data) {
                    $readOutput(data[prop], k + 1, loadOption);
                    k++;
                }
            } else {
                throw new ExtendError(/EL06163/, null, [typeof data]);
            }
        }
        
        // 3. 존재하는 아이템 중에 지정된 값으로 설정
        if (option === 3) {
            if (Array.isArray(index)) {
                for (var m = 0; m < this._outputs.count && m < index.length; m++) {
                    $setOutputValue(index[m], m);
                }
            } else {
                for (var n = 0; this._outputs.count > n; n++) {
                    $setOutputValue(index, n);
                }
            }
        }

        // 콜백 검사 (Output)
        if (typeof this.cbOutput === 'function' ) {
            this.cbOutput.call(this,  this._outputs, this, p_res);
        } else if (typeof this._model.cbBaseOutput === 'function' ) { 
            this._model.cbBaseOutput.call(this, this._outputs, this, p_res);
        }

        // inner function
        function $isEntitySchema(target) {
            if (target['rows'] || target['columns'] ) return true;
            return false;
        }
        function $readOutput(entity, cnt, readOpt) {
            // var idx = cnt > 0 ? cnt - 1 : 0;
            var idx = cnt - 1;
            if (readOpt === 3 && typeof _this._outputs[idx] === 'undefined') {
                _this.newOutput();
            }
            _this._outputs[idx].read(entity, readOpt);
        }
        function $setOutputValue(rowIdx, i) {
            if (typeof rowIdx !== 'number') throw new ExtendError(/EL06164/, null, [i, typeof rowIdx]);
            if (_this._outputs[i].columns.count === 0) throw new ExtendError(/EL06165/, null, [i]);
            if (_this._outputs[i].rows.count - 1 < rowIdx) throw new ExtendError(/EL06166/, null, [i, rowIdx]);
            _this._outputs[i].setValue(_this._outputs[i].rows[rowIdx]);
        }
    };

    /**
     * excute() 실행 후 마지막으로 cbEnd 콜백함수를 호출합니다.
     * 
     * @param {object} p_status 상태값
     * @param {object} p_res response
     * @protected
     */
    BindCommand.prototype._execEnd = function(p_status, p_res) {
        try {
            if (this.state > 0) this.state = EXEC_STATE.END;

            if (typeof this.cbEnd === 'function' ) {
                this.cbEnd.call(this, p_status, this, p_res);
            } else if (typeof this._model.cbBaseEnd === 'function') {
                this._model.cbBaseEnd.call(this, p_status, this, p_res);
            }

            if (this.state > 0) this.state = EXEC_STATE.ON_EXECUTED;
            this._onExecuted(this._model, this);
            this._model._onExecuted(this._model, this);
            
        } catch (err) {
            var msg = 'Err: _execEnd(cmd='+ this.name +') message:'+ err.message;
            this._execError(msg, p_status, p_res);
        }
    };

    /**
     * 오류 발생시 호출됩니다. (cbError 콜백함수 호출)
     * 
     * @param {string} p_error 에러 메세지
     * @param {string} p_status  상태값
     * @param {string} p_res response
     * @protected
     */
    BindCommand.prototype._execError = function(p_error, p_status, p_res) {
        var msg = p_error;
        
        if (this.state > 0) this.state = this.state * -1;
        if (p_res && p_res.statusText) msg += ', statusText: '+ p_res.statusText;
        this._model.cbError.call(this, msg, p_status, p_res);
    };

    /**
     * excute() 실행시 유효성 검사가 실패하면 호출됩니다.
     * 
     * @param {string} p_msg 실패 메세지
     */
    BindCommand.prototype._execFail = function(p_msg) {
        if (this.state > 0) this.state = this.state * -1;
        this._model.cbFail.call(this, p_msg, this.valid);
    };

    /**
     * ajax 를 호출합니다. (axios)
     * 
     * @param {object} p_config axios 설정
     * @protected
     */
    BindCommand.prototype._ajaxCall = function(p_config) {
        var _this = this;
        var config = {};

        // return axios(p_config)
        //     .then(function(res){
        //         _this._ajaxSuccess.call(_this, res.data, res.status, res);
        //     })
        //     .catch(function(err){
        //         var status = '';
        //         if (err.response && err.response.status) status = err.response.status;  // Branch:
        //         _this._execError.call(_this, err, status, err.response);
        //         _this._execEnd(err.status, err.response);
        //     });
        
        for (var prop in p_config) {
            if (prop === 'url' || prop === 'method' || prop === 'data') continue;
            config[prop] = p_config[prop];
        }
        if (p_config.method === 'GET') {            // 요청
            // TODO:
            // data 를 params 문자열로 변환 필요
            // 데이터 전송 여부 확인 필요
            return axios.get(p_config.url, config)
                .then(function(res){
                    _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err, err.status, err.response);
                    _this._execEnd(err.status, err.response);
                });
                
        } else if (p_config.method === 'DELETE') {  // 삭제
            return axios.delete(p_config.url, p_config.data, config)
                .then(function(res){
                    _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err, err.status, err.response);
                    _this._execEnd(err.status, err.response);
                });

        } else if (p_config.method === 'POST') {    // 추가
            return axios.post(p_config.url, p_config.data, config)
                .then(function(res){
                    _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err, err.status, err.response);
                    _this._execEnd(err.status, err.response);
                });
                
        } else if (p_config.method === 'PUT') {    // 수정 
            return axios.put(p_config.url, p_config.data, config)
                .then(function(res){
                    _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err, err.status, err.response);
                    _this._execEnd(err.status, err.response);
                });


        } else if (p_config.method === 'PATCH') {   // 일부 수정
            return axios.patch(p_config.url, p_config.data, config)
                .then(function(res){
                    _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err, err.status, err.response);
                    _this._execEnd(err.status, err.response);
                });

        } else {
            throw new Error('mothod 타입이 아닙니다.'); // TODO: 에외처리
        }
    };

    /**
     * ajax 호출이 성공할 경우 호출됩니다.
     * 
     * @param {*} p_data 데이터
     * @param {*} p_status 상태값
     * @param {*} p_res response
     * @protected
     */
    BindCommand.prototype._ajaxSuccess = function(p_data, p_status, p_res) {
        var option = this.outputOption.option;
        var data;
        
        try {
            data = typeof p_data === 'object' ? p_data : JSON.parse(JSON.stringify(p_data));
            data = this._execResult(data, p_res);

            if (option > 0) this._execOutput(data, p_res);
            
        } catch (error) {
            this._execError(error, p_status, p_res);
            
        } finally {
            this._execEnd(p_status, p_res);
        }
    };

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BindCommand.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        obj['config'] = this.config;
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BindCommand.prototype.setObject = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        // var origin = p_origin ? p_origin : p_oGuid;
        // var entity;

        this.config = p_oGuid['config'];
    };

    /**
     * command 을 실행합니다.  
     * 실행 순서 <정상흐름>  
     *  _execBegin() >> _execValid() >> execBind() >>  
     *  [콜백] _execResult() >> _execOutput() >> _execEnd()  
     * 
     * @returns {Promise} 프로미스 객체
     */
    BindCommand.prototype.execute = function() {
        var _this = this;

        try {
            this.state = EXEC_STATE.INIT;
            this._execBegin();

            if (!this._execValid()) {
                this.state = this.state * -1;
                this._execEnd();
                // throw new Error('valid check fail');
                return null;
            } 
            return this._execBind();

        } catch (err) {
            if (this.state > 0) this.state = this.state * -1;
            var msg = 'Err:execue(cmd='+ _this.name +') message:'+ err.message;
            this._execError(msg);
            this._execEnd();
            return null;
        }
    };

    /** 
     * execute 메소드 별칭
     */
    BindCommand.prototype.exec = BindCommand.prototype.execute;

    return BindCommand;

}(BaseBindCommand));

/**** bind-model.js | BaseBindModel ****/
//==============================================================

var BaseBindModel  = (function (_super) {
    /**
     * 바인드모델 추상클래스
     * 
     * @constructs BaseBindModel
     * @abstract
     * @extends BaseBind
     */
    function BaseBindModel()  {
        _super.call(this);

        var _tables         = new MetaTableCollection(this);
        var _columnType     = MetaColumn;
        var items           = new PropertyCollection(this);
        var command         = new PropertyCollection(this);
        var fn              = new PropertyCollection(this);

        var cbFail        = function(msg, valid) { console.warn('Failed. Err:'+ msg, valid); };
        var cbError       = function(msg, status, response) { console.error('An error has occurred. : '+ msg, status, response); };
        var cbBaseBegin;
        var cbBaseValid;
        var cbBaseBind ;
        var cbBaseResult;
        var cbBaseOutput;
        var cbBaseEnd;
        
        var preRegister    = function() {};
        var preCheck       = function() {return true; };
        var preReady       = function() {};
        
        var DEFALUT_TABLE_NAME = 'first';
        
        // items._elemTypes = [Object, String, Number, Boolean];    // REVIEW: 특성 제거 했음, 필요시 검사후 삽입

        /**
         * _tables 
         * 
         * @member {PropertyCollection} BaseBindModel#_tables
         */
        Object.defineProperty(this, '_tables', {
            get: function() { return _tables; },
            set: function(nVal) { 
                if (!(nVal instanceof MetaTableCollection)) throw new ExtendError(/EL061201/, null, [this.constructor.name]);
                _tables = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 아이템 타입을 설정한다.
         * 
         * @member {MetaColumn} BaseBindModel#_columnType
         */
        Object.defineProperty(this, '_columnType', {
            get: function() { return _columnType; },
            set: function(nVal) { 
                if (!(Type.isProtoChain(nVal, MetaColumn))) throw new ExtendError(/EL061202/, null, [this.constructor.name]);
                _columnType = nVal;
                for (var i = 0; i < this._tables.count; i++) {
                    this._tables[i].columns._baseType = nVal;
                }
            },
            configurable: false,
            enumerable: true
        });

        /**
         * items
         * 
         * @member {PropertyCollection} BaseBindModel#items
         */
        Object.defineProperty(this, 'items', {
            get: function() { return items; },
            set: function(nVal) { // REVIEW: readonly 가 검토 필요
                if (!(nVal instanceof PropertyCollection)) throw new ExtendError(/EL061203/, null, [this.constructor.name]);
                items = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드모델 함수 (내부함수 + 노출함수)
         * 
         * @member {PropertyCollection} BaseBindModel#fn
         */
        Object.defineProperty(this, 'fn', {
            get: function() { return fn; },
            set: function(nVal) { 
                if (!(nVal instanceof PropertyCollection)) throw new ExtendError(/EL061204/, null, [this.constructor.name]);
                fn = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인딩 command 
         * 
         * @member {PropertyCollection} BaseBindModel#command
         */
        Object.defineProperty(this, 'command', {
            get: function() { return command; },
            set: function(nVal) { 
                if (!(nVal instanceof PropertyCollection)) throw new ExtendError(/EL061205/, null, [this.constructor.name]);
                command = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인딩 cmd = command (별칭)
         * 
         * @member {PropertyCollection} BaseBindModel#cmd
         */
        Object.defineProperty(this, 'cmd', {
            get: function() { return this.command; },
            set: function(nVal) { this.command = nVal; },
            configurable: false,
            enumerable: false
        });
        
        /**
         * columns = _baseTable.columns
         * 
         * @member {MetaTableColumnCollection} BaseBindModel#columns
         */
        Object.defineProperty(this, 'columns', {
            get: function() { return this._baseTable.columns; },
            configurable: false,
            enumerable: true
        });

        /**
         * columns 별칭
         * 
         * @member {object} BaseBindModel#cols 
         */
        Object.defineProperty(this, 'cols', {
            get: function() { return this.columns; },
            set: function(nVal) { this.columns = nVal;},
            configurable: true,
            enumerable: false
        });

        /**
         * valid 에서 실패시 콜백
         * 
         * @member {Funtion} BaseBindModel#cbFail
         */
        Object.defineProperty(this, 'cbFail', {
            get: function() { return cbFail; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061206/, null, [this.constructor.name]);
                cbFail = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * valid 에서 오류발생시 콜백
         * 
         * @member {Funtion} BaseBindModel#cbError
         */
        Object.defineProperty(this, 'cbError', {
            get: function() { return cbError; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061207/, null, [this.constructor.name]);
                cbError = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 실행 시작시 기본 콜백 (cbBegin 콜백함수가 없을 경우)
         * 
         * @member {Funtion} BaseBindModel#cbBaseBegin
         */
        Object.defineProperty(this, 'cbBaseBegin', {
            get: function() { return cbBaseBegin; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061208/, null, [this.constructor.name]);
                cbBaseBegin = nVal;
            },
            configurable: false,
            enumerable: true
        });


        /**
         * 검사(valid)시 기본 콜백 (cbValid 콜백함수가 없을 경우)
         * 
         * @member {Funtion} BaseBindModel#cbBaseValid
         */
        Object.defineProperty(this, 'cbBaseValid', {
            get: function() { return cbBaseValid; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061209/, null, [this.constructor.name]);
                cbBaseValid = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드(valid)시 기본 콜백 (cbBind 콜백함수가 없을 경우)
         * 
         * @member {Funtion} BaseBindModel#cbBaseBind
         */
        Object.defineProperty(this, 'cbBaseBind', {
            get: function() { return cbBaseBind; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061210/, null, [this.constructor.name]);
                cbBaseBind = nVal;
            },
            configurable: false,
            enumerable: true
        });
        
        /**
         * 바인드 결과 수신 기본 콜백 (cbResult 콜백함수가 없을 경우)
         * 
         * @member {Funtion} BaseBindModel#cbBaseResult
         */
        Object.defineProperty(this, 'cbBaseResult', {
            get: function() { return cbBaseResult; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061211/, null, [this.constructor.name]);
                cbBaseResult = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 출력 기본 콜백 (cbOutput 콜백함수가 없을 경우)
         * 
         * @member {Funtion} BaseBindModel#cbBaseOutput
         */
        Object.defineProperty(this, 'cbBaseOutput', {
            get: function() { return cbBaseOutput; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061212/, null, [this.constructor.name]);
                cbBaseOutput = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 실행 완료시 기본 콜백 (cbEnd 콜백함수가 없을 경우)
         * 
         * @member {Funtion} BaseBindModel#cbBaseEnd
         */
        Object.defineProperty(this, 'cbBaseEnd', {
            get: function() { return cbBaseEnd; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061213/, null, [this.constructor.name]);
                cbBaseEnd = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 초기화시 등록 preRegister
         * 
         * @member {Funtion} BaseBindModel#preRegister
         */
        Object.defineProperty(this, 'preRegister', {
            get: function() { return preRegister; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061214/, null, [this.constructor.name]);
                preRegister = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 초기화시 검사 preCheck
         * 
         * @member {Funtion} BaseBindModel#preCheck
         */
        Object.defineProperty(this, 'preCheck', {
            get: function() { return preCheck; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061215/, null, [this.constructor.name]);
                preCheck = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 초기화시 준비 완료 preReady
         * 
         * @member {Funtion} BaseBindModel#preReady
         */
        Object.defineProperty(this, 'preReady', {
            get: function() { return preReady; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061216/, null, [this.constructor.name]);
                preReady = nVal;
            },
            configurable: false,
            enumerable: true
        });

        // default set
        this.fn._elemTypes  = Function;    // REVIEW: 위치 변경 
        this._baseTable     = this.addTable(DEFALUT_TABLE_NAME);    // Entity 추가 및 baseEntity 설정
        // this._columnType    = MetaColumn;                           // 기본 아이템 타입 변경

        // 예약어 등록
        this.$KEYWORD = ['_tables', '_baseTable', '_columnType', 'items', 'fn', 'command', 'cmd', 'columns'];
        this.$KEYWORD = ['cbFail', 'cbError'];
        this.$KEYWORD = ['cbBaseBegin', 'cbBaseValid', 'cbBaseBind', 'cbBaseResult', 'cbBaseOutput', 'cbBaseEnd'];
        this.$KEYWORD = ['init', 'preRegister', 'preCheck', 'preReady'];
        this.$KEYWORD = ['addColumnValue', '_readItem', 'setMapping', 'addTable'];
        this.$KEYWORD = ['addCommand', 'setService'];
        this.$KEYWORD = DEFALUT_TABLE_NAME;

        Util.implements(BaseBindModel, this);       // strip:
    }
    Util.inherits(BaseBindModel, _super);

    BaseBindModel._UNION    = [IBindModel, IModelCallback];
    BaseBindModel._NS       = 'Meta.Bind';
    BaseBindModel._PARAMS   = [];
    BaseBindModel._KIND     = 'abstract';

    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    function _isObject(obj) {
        if (obj !== null && typeof obj === 'object') return true;
        return false;
    }

    function _getTableName(itemName) {
        var tName = '';
        if (itemName.indexOf('.') > -1) tName = itemName.split('.')[0];
        return tName;
    }
    
    function _getColumnName(itemName) {
        var cName;
        if (itemName.indexOf('.') > -1) cName = itemName.split('.')[1];
        else cName = itemName;
        if (!_isString(cName)) throw new ExtendError(/EL061217/, null, [cName]);
        return cName;
    }

    function _isAllName(p_name) {
        if (p_name.toLowerCase() === '$all') return true;
        return false;
    }
    /**
     * 지정한 item 또는 전체 items 목록을 기본 MetaTable 에 등록합니다.(기존에 등록되 있으면 통과)
     * 
     * @param {string | string[]} p_items 읽을 아이템
     * @param {string | MetaTable} [p_bEntity=_baseTable] 기본 엔티티 
     */
    BaseBindModel.prototype._readItem = function(p_items, p_bEntity) {
        var items = [];
        var table;
        var itemName;
        var tableName;
        var columnName;            

        // 1. 초기화
        if (Array.isArray(p_items)) items = items.concat(p_items);
        else if (_isString(p_items)) items.push(p_items);
        else  throw new ExtendError(/EL061218/, null, []);

        if (items.length === 0) items = this.items.$keys;   // 없을 경우 (전체 가져옴)

        // 2. 속성정보 등록
        for(var i = 0; items.length > i; i++) {
            itemName    = items[i];
            columnName  = _getColumnName(itemName);
            tableName   = _getTableName(itemName);
            
            if (tableName) table = this._tables[tableName];
            else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
            else  table = p_bEntity || this._baseTable;

            //3. 메타테이블 유효성 검사
            if (!table) throw new ExtendError(/EL061219/, null, []);
            if (!(table instanceof MetaTable)) throw new ExtendError(/EL061220/, null, []);

            if (columnName.indexOf('__') > -1 ) continue; // __이름으로 제외 조건 추가 TODO: 아이템명 조건 별도 함수로 분리
            if(['number', 'string', 'boolean'].indexOf(typeof this.items[itemName]) > -1) { 
                table.columns.addValue(columnName, this.items[itemName]);
            } else if (_isObject(this.items[itemName])){
                table.columns.add(new this._columnType(columnName, table, this.items[itemName]));
            } else throw new ExtendError(/EL061221/, null, []);
        }
    };

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BaseBindModel.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        var vOpt = p_vOpt || 0;
        var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        obj['_tables']      = this._tables.getObject(vOpt, owned);
        obj['_columnType']  = this._columnType;
        obj['fn']           = this.fn.getObject(vOpt, owned);
        obj['command']      = this.command.getObject(vOpt, owned);

        obj['cbFail']       = this.cbFail;
        obj['cbError']      = this.cbError;
        obj['cbBaseBegin']  = this.cbBaseBegin;
        obj['cbBaseValid']  = this.cbBaseValid;
        obj['cbBaseBind']   = this.cbBaseBind;
        obj['cbBaseResult'] = this.cbBaseResult;
        obj['cbBaseOutput'] = this.cbBaseOutput;
        obj['cbBaseEnd']    = this.cbBaseEnd;
        obj['preRegister']  = this.preRegister;
        obj['preCheck']     = this.preCheck;
        obj['preReady']     = this.preReady;
        // _tables (내부)에 존재하는 경우 참조로, 독립적으로 사용하는 추가함
        if (MetaRegistry.hasGuidObject(this._baseTable, owned)) {
            obj['_baseTable'] = MetaRegistry.createReferObject(this._baseTable);
        } else obj['_baseTable'] = this._baseTable.getObject(vOpt, owned);

        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.  
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BaseBindModel.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;

        this._tables.setObject(p_oGuid['_tables'], origin);
        this._columnType = p_oGuid['_columnType'];
        this.fn.setObject(p_oGuid['fn'], origin);
        this.command.setObject(p_oGuid['command'], origin);
        
        this.cbFail         = p_oGuid['cbFail'];
        this.cbError        = p_oGuid['cbError'];
        if (typeof p_oGuid['cbBaseBegin'] === 'function')   this.cbBaseBegin = p_oGuid['cbBaseBegin'];
        if (typeof p_oGuid['cbBaseValid'] === 'function')   this.cbBaseValid = p_oGuid['cbBaseValid'];
        if (typeof p_oGuid['cbBaseBind'] === 'function')    this.cbBaseBind = p_oGuid['cbBaseBind'];
        if (typeof p_oGuid['cbBaseResult'] === 'function')  this.cbBaseResult = p_oGuid['cbBaseResult'];
        if (typeof p_oGuid['cbBaseOutput'] === 'function')  this.cbBaseOutput = p_oGuid['cbBaseOutput'];
        if (typeof p_oGuid['cbBaseEnd'] === 'function')     this.cbBaseEnd = p_oGuid['cbBaseEnd'];
        this.preRegister    = p_oGuid['preRegister'];
        this.preCheck       = p_oGuid['preCheck'];
        this.preReady       = p_oGuid['preReady'];

        if (MetaRegistry.isGuidObject(p_oGuid['_baseTable'])) {
            var obj = MetaRegistry.createMetaObject(p_oGuid['_baseTable'], origin);
            obj.setObject(p_oGuid['_baseTable'], origin);
            this._baseTable = obj;
            
        } else if (p_oGuid['_baseTable']['$ref']) {
            var meta = MetaRegistry.findSetObject(p_oGuid['_baseTable']['$ref'], origin);
            if (!meta) throw new ExtendError(/EL061222/, null, [p_oGuid['_baseTable']['$ref']]);
            this._baseTable = meta;
        
        } else throw new ExtendError(/EL061223/, null, [p_oGuid['_baseTable']['$ref']]);
    };        

    /** 
     * 전처리 콜백함수를 호출합니다.  
     * 실행순서 : preRegister() >>  preCheck(): boolean  >> preRedy()  
     */
    BaseBindModel.prototype.init = function() {
        try {
            this.preRegister.call(this, this);
            if (this.preCheck.call(this, this)) {
                this.preReady.call(this, this);
            } else this.cbFail('Fail :init()');

        } catch (err) {
            this.cbError('Error :init() message:'+ err.message);
        } 
    };
    
    /**
     * 메타테이블을 생성하고, 지정한 테이블 이름을 속성으로 등록합니다.
     * 
     * @param {string} p_name 테이블명
     * @returns {MetaTable} 등록한 메타테이블
     */
    BaseBindModel.prototype.addTable = function(p_name) {
        var table;

        // 유효성 검사
        if (!_isString(p_name)) throw new ExtendError(/EL061224/, null, [typeof p_name]);
        // 예약어 검사
        if (this.$KEYWORD.indexOf(p_name) > -1) {
            throw new ExtendError(/EL061225/, null, [p_name]);
        }            
        // 이름 중복 검사
        if (this._tables.existTableName(p_name)) {
            throw new ExtendError(/EL061226/, null, [p_name]);
        }

        this._tables.add(p_name);
        
        table = this._tables[p_name];
        table.columns._baseType = this._columnType;    // 아이템타입 설정            
        // 접근 키 설정
        this[p_name] = table;   
        
        return table;
    };

    /**
     * 컬럼을 추가하고 지정테이블에 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output MetaView 에 등록합니다.
     * 
     * @param {string | MetaColumn} p_column 등록할 아이템
     * @param {string | string[]} [p_cmds]  추가할 아이템 명령, [] 입력시 전체 command 선택됨
     * @param {string | string[]} [p_views] 추가할 뷰 엔티티
     * @param {string | MetaTable} [p_bTable] 메타테이블
     */
    BaseBindModel.prototype.addColumn = function(p_column, p_cmds, p_views, p_bTable) {
        var cmds = [];
        var command = [];
        var table;
        var column;

        // 1. 유효성 검사
        if (!(p_column instanceof MetaColumn || _isString(p_column))) {
            throw new ExtendError(/EL061227/, null, []);
        }
        if (typeof p_cmds !== 'undefined' && p_cmds !== null && (!(Array.isArray(p_cmds) || _isString(p_cmds)))) {
            throw new ExtendError(/EL061228/, null, []);
        }
        // 2. 초기값 설정
        if (Array.isArray(p_cmds)) cmds = p_cmds;
        else if (_isString(p_cmds)) cmds.push(p_cmds);

        if (_isString(p_bTable)) table = this._tables[p_bTable];
        else table = p_bTable || this._baseTable;

        if (!(table instanceof MetaTable)) {
            throw new ExtendError(/EL061229/, null, []);
        }
        if (_isString(p_column)) column = new this._columnType(p_column, table);
        else column = p_column;
        // 3. command 확인
        if (typeof p_cmds !== 'undefined' && cmds.length > 0) {
            for (var i = 0; i< cmds.length; i++) {
                if (!_isString(cmds[i])) throw new ExtendError(/EL061230/, null, [i, typeof cmds[i]]);
                
                if (this.command.exists(cmds[i])) command.push(cmds[i]);
                else throw new ExtendError(/EL061231/, null, [i, cmds[i]]);
            }
        } else if (typeof p_cmds !== 'undefined') {
            command = this.command.$keys;
        }
        // 4. 컬럼 등록 및 조회
        column = table.columns[table.columns.add(column)];
        // 5. command 에 컬럼 등록
        for (var j = 0; j < command.length; j++) {
            this.command[command[j]].setColumn(column.columnName, p_views, table);
        }
    };

    /**
     * 지정한 이름으로 컬럼과 값을 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output MetaView 에 등록합니다.
     * 
     * @param {string} p_name
     * @param {object | string | number | boolean} p_value 
     * @param {string[]} [p_cmds] <선택> 추가할 아이템 명령
     * @param {string | string[]} [p_views] <선택> 추가할 뷰 엔티티
     * @param {string | MetaTable} [p_bEntity] 대상 기본 엔티티 
     */
    BaseBindModel.prototype.addColumnValue = function(p_name, p_value, p_cmds, p_views, p_bEntity) {
        var column;
        var property = {};
        var table;
        var tableName;
        var columnName;            
    
        // 유효성 검사
        if (!_isString(p_name)) {
            throw new ExtendError(/EL061232/, null, [typeof p_name]);
        }
        columnName = _getColumnName(p_name);
        tableName = _getTableName(p_name);

        if (tableName) table = this._tables[tableName];
        else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
        else table = p_bEntity || this._baseTable;

        if (!(table instanceof MetaTable)) {
            throw new ExtendError(/EL061233/, null, []);
        }

        if (_isObject(p_value)) property = p_value;
        else property = { value: p_value };
        
        column = new this._columnType(columnName, table, property);  // REVIEW: 파라메터 일반화 요구됨

        this.addColumn(column, p_cmds, p_views, table);
    };

    /**
     * 매핑객체를 BaseBindModel 객체에 설정합니다.
     * 
     * @param {ProperyCollection | object} p_mapping MetaColumn 에 매핑할 객체 또는 컬렉션
     * @param {string | MetaTable} [p_bEntity=_baseTable] 대상 기본 엔티티 
     */
    BaseBindModel.prototype.setMapping = function(p_mapping, p_bEntity) {
        var mappingCollection;
        // var itemsCollection;
        // var table;
        // var itemName;
        // var tableName;
        // var columnName;
        var column;
        
        try {
            // 1.유효성 검사
            if (!(p_mapping instanceof PropertyCollection || _isObject(p_mapping))) {
                throw new ExtendError(/EL061234/, null, []);
            }

            // 2. 임시 매핑 컬렉션에 등록
            if (p_mapping instanceof PropertyCollection) {
                mappingCollection = p_mapping;
                // itemsCollection = p_mapping;
            } else if (_isObject(p_mapping)) {
                mappingCollection = new PropertyCollection();
                // itemsCollection = this.items;
                for(var prop in p_mapping) {
                    if (p_mapping.hasOwnProperty(prop) && typeof p_mapping[prop] !== 'undefined') {
                        mappingCollection.add(prop, p_mapping[prop]);
                    }
                }
            }

            // 3. 매핑에 존재하고, 아이템에 존재하고, 컬럼에 추가
            // for(var i = 0; mappingCollection.count > i; i++) {
            //     itemName = mappingCollection.indexToKey(i);
            //     columnName = _getColumnName(itemName);
            //     tableName = _getTableName(itemName);

            //     if (tableName) {
            //         // POINT:
            //         if (!this._tables.exists(tableName)) this.addTable(tableName)
            //         table = this._tables[tableName];
            //     } else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
            //     else table = p_bEntity || this._baseTable;

            //     if (!(table instanceof MetaTable)) {
            //         throw new ExtendError(/EL061235/, null, []);
            //     }

            //     if (!table.columns.exists(columnName)) {
            //         if (this.items.exists(columnName)) {
            //             this._readItem(columnName, table);
            //         } else {
            //             // POINT: 빈 컬럼 추가
            //             table.columns.add(columnName);
            //             // throw new ExtendError(/EL061236/, null, [columnName]);
            //         }
            //     }
            //     column = table.columns[columnName];
            //     for (var prop in mappingCollection[i]) {
            //         if (_isAllName(prop)) {
            //             for (var ii = 0; ii < this.command.count; ii++) {
            //                 this.command[ii].addColumn(column, mappingCollection[i][prop], table);
            //             }
            //         } else {
            //             // POINT: 빈 커멘드 생성
            //             if(!this.command.exists(prop)) this.addCommand(prop);
            //             this.command[prop].addColumn(column, mappingCollection[i][prop], table);
            //         }
            //     }
            // }

            // 첫 번째 반복문
            for (var i = 0; i < mappingCollection.count; i++) {
                $processMapping.call(this, mappingCollection, i, p_bEntity, false);
            }

            // 두 번째 반복문
            for (var j = 0; j < mappingCollection.count; j++) {
                $processMapping.call(this, mappingCollection, j, p_bEntity, true);
            }

        } catch (error) {
            throw new ExtendError(/EL061237/, error, []);
        }

        // inner function
        function $processMapping(mappingCollection, i, p_bEntity, isAllCommand) {
            var table;
            var itemName = mappingCollection.indexToKey(i);
            var columnName = _getColumnName(itemName);
            var tableName = _getTableName(itemName);

            if (tableName) {
                if (!this._tables.exists(tableName)) this.addTable(tableName);
                table = this._tables[tableName];
            } else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
            else table = p_bEntity || this._baseTable;

            if (!(table instanceof MetaTable)) {
                throw new ExtendError(/EL061235/, null, []);
            }

            if (!table.columns.exists(columnName)) {
                if (this.items.exists(columnName)) {
                    this._readItem(columnName, table);
                } else {
                    table.columns.add(columnName);
                }
            }
            column = table.columns[columnName];
            for (var prop in mappingCollection[i]) {
                if (isAllCommand) {
                    if (_isAllName(prop)) {
                        for (var ii = 0; ii < this.command.count; ii++) {
                            this.command[ii].addColumn(column, mappingCollection[i][prop], table);
                        }
                    }
                } else {
                    // POINT: 빈 커멘드 생성
                    if (!_isAllName(prop)) {
                        if(!this.command.exists(prop)) this.addCommand(prop);
                        this.command[prop].addColumn(column, mappingCollection[i][prop], table);
                    }
                }
            }

            // for (var prop in mappingCollection[i]) {
            //     if (isAllCommand ? _isAllName(prop) : !_isAllName(prop)) {
            //         if (!this.command.exists(prop)) this.addCommand(prop);
            //         if (isAllCommand) {
            //             for (var ii = 0; ii < this.command.count; ii++) {
            //                 this.command[ii].addColumn(column, mappingCollection[i][prop], table);
            //             }
            //         } else {
            //             this.command[prop].addColumn(column, mappingCollection[i][prop], table);
            //         }
            //     }
            // }

        }
    };

    /**
     * BaseBindCommand 객체를 추가합니다.
     * 
     * @param {string} p_name BaseBindCommand 이름
     * @param {number | object} p_option 옵션
     * @param {BaseEntity} [p_bEntity] 기본 메타테이블
     * @abstract
     */
    BaseBindModel.prototype.addCommand = function() {
        throw new ExtendError(/EL061238/, null, [this.constructor.name]);
    };

    /**
     * 서비스 객체로 현재 객체를 설정합니다.
     * 
     * @param {IService} [p_service] 서비스 객체
     * @param {boolean} [p_passTypeChk=false] 서비스객체 type 검사 통과 유무
     */
    BaseBindModel.prototype.setService = function(p_service, p_passTypeChk) {
        var propObject;
        var command;
        var tables = [];
        var mapping = new PropertyCollection(this);

        // Type.allowType(IService, p_service, 1);
        if (!p_passTypeChk) Type.matchType(IService, p_service, 1);
        // tables 등록
        if (p_service['tables']) {
            if (Array.isArray(p_service['tables'])) tables = p_service['tables'];
            else if (_isString(p_service['tables'])) tables.push(p_service['tables']);
            else throw new ExtendError(/EL061239/, null, []);
            for (var i = 0; i < tables.length; i++) {
                this.addTable(tables[i]);
            }
        }
        // command 등록
        if (_isObject(p_service['command'])) {
            propObject = p_service['command'];
            for(var prop in propObject) {
                if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                    // command 등록 및 설정
                    command = this.addCommand(prop);
                    if (propObject[prop]['views']) {
                        var views = propObject[prop]['views'];
                        if (!Array.isArray(views)) {
                            throw new ExtendError(/EL061241/, null, [typeof views]);
                        }
                        for (var j= 0; j < views.length; j++) {
                            command.newOutput(views[j]);
                        }
                    }                      
                    if (propObject[prop]['outputOption'])                       command['outputOption'] = propObject[prop]['outputOption'];  // TODO: ['블럭으로 감싸야함']
                    if (typeof propObject[prop]['config'] === 'object')         command['config'] = propObject[prop]['config'];
                    if (typeof propObject[prop]['url'] === 'string')            command['url'] = propObject[prop]['url'];
                    if (typeof propObject[prop]['onExecute'] === 'function')    command['onExecute'] = propObject[prop]['onExecute'];
                    if (typeof propObject[prop]['onExecuted'] === 'function')   command['onExecuted'] = propObject[prop]['onExecuted'];
                    if (typeof propObject[prop]['cbBegin'] === 'function')      command['cbBegin'] = propObject[prop]['cbBegin'];
                    if (typeof propObject[prop]['cbValid'] === 'function')      command['cbValid'] = propObject[prop]['cbValid'];
                    if (typeof propObject[prop]['cbBind'] === 'function')       command['cbBind'] = propObject[prop]['cbBind'];
                    if (typeof propObject[prop]['cbResult'] === 'function')     command['cbResult'] = propObject[prop]['cbResult'];
                    if (typeof propObject[prop]['cbOutput'] === 'function')     command['cbOutput'] = propObject[prop]['cbOutput'];
                    if (typeof propObject[prop]['cbEnd'] === 'function')        command['cbEnd'] = propObject[prop]['cbEnd']; 
                }
            }
        }
        // prop 등록
        if (_isObject(p_service['items'])) {
            propObject = p_service['items'];
            for(var prop2 in propObject) {
                if (propObject.hasOwnProperty(prop2) && typeof propObject[prop2] !== 'undefined') {
                    //__prop.add(prop, propObject[prop]);
                    // get/sett 형식의 기능 추가        REVIEW:: 확인필요 get/set 의 필요성, 중복 및 혼선의 이슈
                    // if (typeof propObject[prop] === 'object' 
                    //     && (typeof propObject[prop].get === 'function' || typeof propObject[prop].set === 'function')) {
                    //     this.items.add(prop, '', propObject[prop]);    
                    // } else {
                    //     this.items.add(prop, propObject[prop]);
                    // }
                    this.items.add(prop2, propObject[prop2]);
                }
            }
        }
        // fn 등록
        if (_isObject(p_service['fn'])) {
            propObject = p_service['fn'];
            for(var prop3 in propObject) {
                if (propObject.hasOwnProperty(prop3) && typeof propObject[prop3] !== 'undefined') {
                    this.fn.add(prop3, propObject[prop3]);
                }
            }
        }
        if (_isObject(p_service['mapping'])) {
            propObject = p_service['mapping'];
            for(var prop4 in propObject) {
                if (propObject.hasOwnProperty(prop4) && typeof propObject[prop4] !== 'undefined') {
                    mapping.add(prop4, propObject[prop4]);
                    // this._mapping.add(prop, propObject[prop]);
                }
            }
        }
        // pre 메소드 등록
        if (typeof p_service['preRegister'] === 'function') {
            this.preRegister = p_service['preRegister'];
        }
        if (typeof p_service['preCheck'] === 'function') {
            this.preCheck = p_service['preCheck'];
        }
        if (typeof p_service['preReady'] === 'function') {
            this.preReady = p_service['preReady'];
        }
        // fail, error 등록
        if (typeof p_service['cbFail'] === 'function') {
            this.cbFail = p_service['cbFail'];
        }
        if (typeof p_service['cbError'] === 'function') {
            this.cbError = p_service['cbError'];
        }
        // baseCallback 등록
        if (typeof p_service['cbBaseBegin'] === 'function') {
            this.cbBaseBegin = p_service['cbBaseBegin'];
        }
        if (typeof p_service['cbBaseValid'] === 'function') {
            this.cbBaseValid = p_service['cbBaseValid'];
        }
        if (typeof p_service['cbBaseBind'] === 'function') {
            this.cbBaseBind = p_service['cbBaseBind'];
        }
        if (typeof p_service['cbBaseResult'] === 'function') {
            this.cbBaseResult = p_service['cbBaseResult'];
        }
        if (typeof p_service['cbBaseOutput'] === 'function') {
            this.cbBaseOutput = p_service['cbBaseOutput'];
        }
        if (typeof p_service['cbBaseEnd'] === 'function') {
            this.cbBaseEnd = p_service['cbBaseEnd'];
        }
        // execute 이벤트 등록
        if (typeof p_service['onExecute'] === 'function') {
            this.onExecute = p_service['onExecute'];    // 복수 등록
        }
        if (typeof p_service['onExecuted'] === 'function') {
            this.onExecuted = p_service['onExecuted'];  // 복수 등록
        }
        // 서비스에 onwer bindModel 설정
        p_service.bindModel = this;

        // 속성(prop)을 아이템으로 로딩 ('__'시작이름 제외)
        // if (p_isReadItem === true) {   // REVIEW: 필요성 유무, 아이템을 별도로 안불러올 이유가?
        //     this._readItem();
        // }
        this.setMapping(mapping);
    };

    return BaseBindModel;

}(BaseBind));

/**** bind-model.js | BindModel ****/
//==============================================================

var BindModel  = (function (_super) {
    /**
     * 바인드모델 Ajax
     * 
     * @constructs BindModel
     * @extends BaseBindModel
     * @param {IBaseBindModel} [p_service] 서비스 객체
     */
    function BindModel(p_service) {
        _super.call(this);

        var $service;
        var baseConfig = {
            url: '',
            method: 'GET',
            responseType: 'json'
        };

        /**
         * 별칭 내부값
         * 
         * @member {string | number | boolean} BindModel#$service
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$service', {
            get: function() { return $service; },
            set: function(nVal) { $service = nVal; },
            configurable: false,
            enumerable: false,
        });

        /**
         * 바인딩 기본 config 을 설정한다.
         * 
         * @member {Object} BindModel#baseConfig
         */
        Object.defineProperty(this, 'baseConfig', {
            get: function() { return baseConfig; },
            set: function(nVal) { 
                if (typeof nVal === 'object') {
                    if (typeof nVal['url'] === 'string') baseConfig['url'] = nVal['url'];
                    if (typeof nVal['baseURL'] === 'string') baseConfig['baseURL'] = nVal['baseURL'];
                    if (typeof nVal['method'] === 'string') baseConfig['method'] = nVal['method'];
                    if (typeof nVal['responseType'] === 'string') baseConfig['responseType'] = nVal['responseType'];
                    for (var prop in nVal) {
                        if (prop === 'url' || prop === 'method' || prop === 'responseType') continue;
                        baseConfig[prop] = nVal[prop];
                    }
                } else throw new ExtendError(/EL06151/, null, [this.constructor.name]);
            },
            configurable: true,
            enumerable: true
        });

        /**
         * 바인딩 기본 config.url 을 설정한다.
         * 
         * @member {String} BindModel#url
         */
        Object.defineProperty(this, 'url', {
            get: function() { return baseConfig.url; },
            set: function(nVal) { 
                if (!(_isString(nVal))) throw new ExtendError(/EL06152/, null, [this.constructor.name]);
                baseConfig.url = nVal;
            },
            configurable: true,
            enumerable: true
        });

        // default set
        this._columnType = HTMLColumn;  // 기본 아이템 타입 변경

        // 객체 등록
        if (_isObject(p_service)) {
            // 서비스 설정
            this.$service = p_service;
            this.setService(p_service);
        }

        // 예약어 등록
        this.$KEYWORD = ['$service', 'baseConfig', 'url'];
        this.$KEYWORD = ['getSelector', 'checkSelector'];
    }
    Util.inherits(BindModel, _super);

    BindModel._UNION = [];
    BindModel._NS = 'Meta.Bind';
    BindModel._PARAMS = ['$service'];

    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    function _isObject(obj) {
        if (obj !== null && typeof obj === 'object') return true;
        return false;
    }

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BindModel.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        obj['$service']         = this.$service;
        obj['baseConfig']    = this.baseConfig;

        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BindModel.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        // var origin = p_origin ? p_origin : p_oGuid;

        this.$service       = p_oGuid['$service'];
        this.baseConfig  = p_oGuid['baseConfig'];
    };     
    
    /**
     * 셀렉터 검사
     * 
     * @param {PropertyCollection} [p_collection] 공백시 items.selector 검사
     * @param {boolean} [p_viewLog=false] 로그 출력 유무
     * @returns {string[]} 빈 배열이면 성공
     */
    BindModel.prototype.checkSelector  = function(p_collection, p_viewLog) {
        var collection = p_collection || this.items;
        var arrFail = [];
        var key;

        // 유효성 검사
        if (!(collection instanceof PropertyCollection)) throw new ExtendError(/EL06153/, null, []);

        // 검사         
        for (var i = 0; collection.count > i; i++) {
            if (_isObject(collection[i].selector)) {
                key = collection[i].selector.key;

                if (!_isString(key) || !Util.validSelector(key)) {
                    arrFail.push(key);
                    if (p_viewLog) console.warn('selector 검사 실패 : %s ', key);
                }
            }
        }
        return arrFail;
    };

    /**
     * 셀렉터 목록
     * 
     * @param {PropertyCollection} [p_collection] 공백시 items.selector 검사
     * @returns {string[]} 전체 selector 
     */
    BindModel.prototype.getSelector  = function(p_collection) {
        var collection = p_collection || this.items;
        var arrSelector = [];

        // 유효성 검사
        if (!(collection instanceof PropertyCollection)) throw new ExtendError(/EL06154/, null, []);

        // 검사         
        for (var i = 0; collection.count > i; i++) {
            if (_isObject(collection[i].selector)) {    
                arrSelector.push(collection[i].selector);
            }
        }
        return arrSelector;
    };

    /**
     * 명령 추가
     * 
     * @param {string} p_name 
     * @param {number} [p_option] 
     * @param {string | MetaTable} [p_bTable] 기본테이블
     */
    BindModel.prototype.addCommand  = function(p_name, p_option, p_bTable) {
        var bindCommand;
        var table;
        
        try {
            // 유효성 검사
            if (!_isString(p_name)) throw new ExtendError(/EL06155/, null, [typeof p_name]);

            if (_isString(p_bTable)) table = this._tables[p_bTable];
            else table = p_bTable || this._baseTable;

            bindCommand = new BindCommand(this, p_option, table);
            this.command.add(p_name, bindCommand);

            return bindCommand;
        } catch (error) {
            throw new ExtendError(/EL06156/, error, []);
        }
    };

    /**
     * 서비스를 설정한다.
     * 
     * @param {IBaseBindModel} p_service 서비스객체
     * @param {boolean} [p_passTypeChk=false] 서비스객체 type 검사 통과 유무
     */
    BindModel.prototype.setService  = function(p_service, p_passTypeChk) {
        var InterfaceTypeCheck = 1;

        if (typeof p_passTypeChk !== 'boolean') p_passTypeChk = false;

        try {
            _super.prototype.setService.call(this, p_service, p_passTypeChk);    // 부모 호출
                
            if (!p_passTypeChk) Type.matchType(IAjaxService, p_service, InterfaceTypeCheck);

            // base
            if (typeof p_service['baseConfig'] === 'object') {
                this.baseConfig = p_service['baseConfig'];
            }
            if (typeof p_service['url'] === 'string') {
                this.url = p_service['url'];
            }

            // 사용자 서비스 객체 설정
            for (var prop in p_service) {
                if (p_service.hasOwnProperty(prop) && this.$KEYWORD.indexOf(prop) < 0) {
                    // console.log(prop);
                    this[prop] = p_service[prop];
                }
            }

        // TODO: ExtendError 로 교체
        } catch (error) {
            throw new ExtendError(/EL06157/, error, []);
        }               
    };

    return BindModel;

}(BaseBindModel));

/// <reference path="./types/index.d.ts" />

export { ArrayCollection, BaseBind, BaseBindCommand, BaseBindModel, BaseCollection, BaseColumn, BaseColumnCollection, BaseEntity, BindCommand, BindModel, EventEmitter, ExtendError, HTMLColumn, IAjaxService, IArrayCollection, IBind, IBindCommand, IBindModel, ICollection, ICommandCallback, IElement, IExportControl, IGroupControl, IImportControl, IList, IListControl, IMarshal, IModelCallback, IObject, IPropertyCollection, ISchemaControl, ISerialize, IService, ITransaction, Message, MetaColumn, MetaElement, MetaObject, MetaRegistry, MetaRow, MetaRowCollection, MetaSet, MetaTable, MetaTableCollection, MetaTableColumnCollection, MetaView, MetaViewCollection, MetaViewColumnCollection, NamespaceManager, ObjectColumn, PropertyCollection, TransactionCollection, TransactionQueue, Type, Util, BindModel as default };
//# sourceMappingURL=bind-model.esm.js.map
