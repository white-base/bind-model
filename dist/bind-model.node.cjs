/*! Logic Core v1.0.30 Copyright (c) 2025 logicfeel and contributors */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var logicEntity = require('logic-entity');
var axios = require('axios');

/**** load-json.cjs loadJSON() CJS module ****/

var loadJson;
var hasRequiredLoadJson;

function requireLoadJson () {
	if (hasRequiredLoadJson) return loadJson;
	hasRequiredLoadJson = 1;
	//==============================================================
	const isNode = typeof globalThis.isDOM === 'boolean' ? !globalThis.isDOM :  typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;

	async function loadJSON(filePath) {
	    try {
	        if (isNode) {
	            const path = require('path');
	            const fs = require('fs');
	            var absolutePath = path.resolve(__dirname, filePath);
	            const data = fs.readFileSync(absolutePath, 'utf8');
	            const parsed = JSON.parse(data);
	            return parsed;
	        } else {
	            var absolutePath = await getLocalePath(filePath);
	            const response = await fetch(absolutePath);
	            return await response.json();
	        }
	    } catch (error) {
	        return undefined;
	    }
	}

	async function getLocalePath(filename) {
	    try {
	        if (isNode) {
	            const path = require('path');
	            return path.resolve(__dirname, filename);
	        }
	        if (typeof window !== 'undefined') {
	            let baseURL = '';
	            if (typeof document !== 'undefined' && document.currentScript) {
	                baseURL = document.currentScript.src;
	            } else {
	                baseURL = new URL('./', window.location.href).href;
	            }
	            return new URL(filename, baseURL).href;
	        } 
	        throw new Error('Unsupported environment');

	    } catch (error) {
	        throw new Error('Unsupported environment');
	    }
	}

	// exports.loadJSON = loadJSON;
	// exports.__esModule = true;
	loadJson = {
	    loadJSON,
	    default: { loadJSON } // ESM default import 대응
	};
	return loadJson;
}

var loadJsonExports = requireLoadJson();

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
            msg = await loadJsonExports.loadJSON(`${localPath}/${p_lang}.json`);

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
var defaultCode$1 = {
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

/**** message-wrap-bundle.js | Message ****/
//==============================================================

const localesPath$1 = './locales';    // 상대 경로

Message.importMessage(defaultCode$1, localesPath$1);

(async () => {
    await Message.autoDetect();
})();

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
 
var _global$1 = globalThis;
var OLD_ENV$1 = _global$1.OLD_ENV ? _global$1.OLD_ENV : false;    // 커버리지 테스트 역활

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
   
var _global = globalThis;

var OLD_ENV = _global.OLD_ENV ? _global.OLD_ENV : false;    // 커버리지 테스트 역활

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
   
((function (_super) {

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

})(MetaObject));

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

((function (_super) {
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

})(BaseCollection));

/**** collection-property.js | PropertyCollection ****/
//==============================================================

((function (_super) {
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

})(BaseCollection));

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

/**** message-wrap-bundle.js | Message cjs ****/
//==============================================================

const isNode = typeof globalThis.isDOM === 'boolean' ? !globalThis.isDOM :  typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;
const localesPath = './locales';

function absolutePath(localPath) {
    try {
        const path = require('path');
        return path.resolve(__dirname, localPath);
    } catch (error) {
        return localPath;  // Fallback to the original path
    }
}

if (isNode) {
    localesPath = absolutePath(localesPath);
}

Message.importMessage(defaultCode, localesPath);

(async () => {
    await Message.autoDetect();
})();

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
logicEntity.Util.validSelector = function validSelector(p_selector) {   // COVER:
    // var selectors = [];

    // selector 얻기
    if (!_isString(p_selector)) return false;

    if (typeof document === 'object' && typeof document.querySelector === 'function') {
        if (document.querySelector(p_selector)) return true;
        return false;

    } else {
        throw new logicEntity.ExtendError(/EL01611/, null, []);
    }
};

/**
 * 스크립트를 로드한다.
 * 
 * @param {*} url 
 * @param {*} callback 
 */
logicEntity.Util.loadScript = function loadScript(url, callback) {
    var head;
    var script;
    
    if (typeof url !== 'string') throw new logicEntity.ExtendError(/EL01612/, null, []);
    if (typeof document !== 'object') throw new logicEntity.ExtendError(/EL01613/, null, []);

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
        throw new logicEntity.ExtendError(/EL02311/, null, ['IBind']);
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
        throw new logicEntity.ExtendError(/EL02331/, null, ['IBindCommand']);
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
                if(typeof nVal !== 'object') throw new logicEntity.ExtendError(/EL054601/, null, [this.constructor.name]);
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
                if(typeof nVal !== 'boolean') throw new logicEntity.ExtendError(/EL054602/, null, [this.constructor.name]);
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
                if(typeof nVal !== 'boolean') throw new logicEntity.ExtendError(/EL054603/, null, [this.constructor.name]);
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
                if(typeof nVal !== 'object') throw new logicEntity.ExtendError(/EL054604/, null, [this.constructor.name]);
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
                } else throw new logicEntity.ExtendError(/EL054605/, null, [this.constructor.name]);
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
                if(typeof val !== 'function') throw new logicEntity.ExtendError(/EL054606/, null, [this.constructor.name]);
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
                if(typeof val !== 'function') throw new logicEntity.ExtendError(/EL054607/, null, [this.constructor.name]);
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

                            if (type === 'prop' && option === '') throw new logicEntity.ExtendError(/EL054608/, null, [this.constructor.name, key]);
                            if (type === 'attr' && option === '') throw new logicEntity.ExtendError(/EL054609/, null, [this.constructor.name, key]);
                            if (type === 'css' && option === '') throw new logicEntity.ExtendError(/EL054610/, null, [this.constructor.name, key]);
                            if (['val', 'value', 'text', 'html', 'prop', 'attr', 'css'].indexOf(type) < 0) throw new logicEntity.ExtendError(/EL054611/, null, [this.constructor.name, key]);
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
                
                if (this._valueTypes.length > 0) logicEntity.Type.matchType([this._valueTypes], __val);
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

                            if (type === 'prop' && option === '') throw new logicEntity.ExtendError(/EL054613/, null, [this.constructor.name, key]);
                            if (type === 'attr' && option === '') throw new logicEntity.ExtendError(/EL054614/, null, [this.constructor.name, key]);
                            if (type === 'css' && option === '') throw new logicEntity.ExtendError(/EL054615/, null, [this.constructor.name, key]);
                            if (['val', 'value', 'text', 'html', 'prop', 'attr', 'css'].indexOf(type) < 0) throw new logicEntity.ExtendError(/EL054616/, null, [this.constructor.name, key]);
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
    logicEntity.Util.inherits(HTMLColumn, _super);
    
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

}(logicEntity.MetaColumn));

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

        var $event = new logicEntity.EventEmitter(this, this);
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
                if (!(nVal instanceof logicEntity.MetaTable)) throw new logicEntity.ExtendError(/EL06111/, null, [this.constructor.name]);
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
                if (typeof p_fn !== 'function') throw new logicEntity.ExtendError(/EL06112/, null, [this.constructor.name]);
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
                if (typeof p_fn !== 'function') throw new logicEntity.ExtendError(/EL06113/, null, [this.constructor.name]);
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

        logicEntity.Util.implements(BaseBind, this);        // strip:
    }
    logicEntity.Util.inherits(BaseBind, _super);

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

        if (!logicEntity.Type.deepEqual(this.$event.$storage, {})) {
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
        throw new logicEntity.ExtendError(/EL06114/, null, [this.constructor.name]);
    };

    return BaseBind;

}(logicEntity.MetaObject));

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
                if (_outputs === null) _outputs = new logicEntity.MetaViewCollection(_this, _this._baseTable);
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
                if (typeof valid === 'undefined') valid = new logicEntity.MetaView('valid', _this._baseTable);
                return valid; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof logicEntity.MetaView)) throw new logicEntity.ExtendError(/EL061301/, null, [this.constructor.name]);
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
                if (typeof bind === 'undefined') bind = new logicEntity.MetaView('bind', _this._baseTable);
                return bind; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof logicEntity.MetaView)) throw new logicEntity.ExtendError(/EL061302/, null, [this.constructor.name]);
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
                if (typeof misc === 'undefined') misc = new logicEntity.MetaView('misc', _this._baseTable);
                return misc; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof logicEntity.MetaView)) throw new logicEntity.ExtendError(/EL061302/, null, [this.constructor.name]);  // REVIEW: EL061302 오류 코드 중복됨
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
                } else throw new logicEntity.ExtendError(/EL061303/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061304/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061305/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061306/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061307/, null, [this.constructor.name]);
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
                if (typeof nVal  !== 'function') throw new logicEntity.ExtendError(/EL061308/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061309/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'number') throw new logicEntity.ExtendError(/EL061336/, null, [this.constructor.name]);
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

        logicEntity.Util.implements(BaseBindCommand, this);         // strip:
    }
    logicEntity.Util.inherits(BaseBindCommand, _super);

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
        if (!_isString(cName)) throw new logicEntity.ExtendError(/EL061310/, null, [cName]);
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
                if (!(newVal instanceof logicEntity.MetaView)) throw new logicEntity.ExtendError(/EL061311/, null, [oName]);
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

        if (logicEntity.MetaRegistry.hasGuidObject(this._baseTable, owned)) {
            obj['_baseTable'] = logicEntity.MetaRegistry.createReferObject(this._baseTable);
        } else obj['_baseTable'] = this._baseTable.getObject(vOpt, owned);

        obj['_outputs']     = this._outputs.getObject(vOpt, owned);
        if (vOpt < 2 && vOpt > -1 && this._model) {
            obj['_model'] = logicEntity.MetaRegistry.createReferObject(this._model);
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

        if (logicEntity.MetaRegistry.isGuidObject(p_oGuid['_baseTable'])) {
            var obj = logicEntity.MetaRegistry.createMetaObject(p_oGuid['_baseTable'], origin);
            obj.setObject(p_oGuid['_baseTable'], origin);
            this._baseTable = obj;
            
        } else if (p_oGuid['_baseTable']['$ref']) {
            var meta = logicEntity.MetaRegistry.findSetObject(p_oGuid['_baseTable']['$ref'], origin);
            if (!meta) throw new logicEntity.ExtendError(/EL061312/, null, [p_oGuid['_baseTable']['$ref']]);
            this._baseTable = meta;
        } else throw new logicEntity.ExtendError(/EL061313/, null, [p_oGuid['_baseTable']['$ref']]);

        this._outputs.setObject(p_oGuid['_outputs'], origin);
        if (p_oGuid['_model']) {
            _model = logicEntity.MetaRegistry.findSetObject(p_oGuid['_model']['$ref'], origin);
            if (!_model) throw new logicEntity.ExtendError(/EL061314/, null, [p_oGuid['_baseTable']['$ref']]);
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
        throw new logicEntity.ExtendError(/EL061315/, null, [this.constructor.name]);
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
        if (!(p_column instanceof logicEntity.MetaColumn || _isString(p_column))) {
            throw new logicEntity.ExtendError(/EL061316/, null, []);
        }
        if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
            throw new logicEntity.ExtendError(/EL061317/, null, []);
        }
        // if (p_bTable && !(p_bTable instanceof MetaTable)) {
        //     throw new Error('Only [p_bTable] type "MetaTable" can be added');
        // }

        // 2.초기화 설정
        if (Array.isArray(p_views)) views = p_views;
        else if (typeof p_views === 'string') views.push(p_views);
        // $all 일 경우 빈배열로 변경
        if (views.some(function(elem){
            if (!_isString(elem)) throw new logicEntity.ExtendError(/EL061319/, null, [i, typeof views[i]]);
            if (_isAllName(elem)) return true;
            return false;
        })) views.length = 0;


        if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
        else table = p_bTable || this._baseTable;
        
        if (!(table instanceof logicEntity.MetaTable)) {
            throw new logicEntity.ExtendError(/EL061318/, null, []);
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
                else throw new logicEntity.ExtendError(/EL061320/, null, [i, views[i]]);
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
            throw new logicEntity.ExtendError(/EL061321/, null, [typeof p_name]);
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
        
        if (!(table instanceof logicEntity.MetaTable)) {
            throw new logicEntity.ExtendError(/EL061322/, null, []);
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
        if (names.length === 0) throw new logicEntity.ExtendError(/EL061323/, null, []);

        // 아이템 검사 및 등록 함수 this.add(..) 호출
        for(var i = 0; names.length > i; i++) {
            itemName = names[i]; 

            if (!_isString(itemName)) {
                throw new logicEntity.ExtendError(/EL061323/, null, [i, typeof itemName]);
            }

            columnName = _getColumnName(itemName);
            tableName = _getTableName(itemName);

            // if (tableName) {
            //     table = this._model._tables[tableName];
            // } else table = this._baseTable;
            if (tableName) table = this._model._tables[tableName];
            else if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
            else table = p_bTable || this._baseTable;

            if (!(table instanceof logicEntity.MetaTable)) {
                throw new logicEntity.ExtendError(/EL061325/, null, []);
            }

            column = table.columns[columnName];
            if (typeof column !== 'undefined') {
                this.addColumn(column, p_views, table);
            } else {
                throw new logicEntity.ExtendError(/EL061326/, null, [columnName]);
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
        if (names.length === 0) throw new logicEntity.ExtendError(/EL061327/, null, []);
        if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
            throw new logicEntity.ExtendError(/EL061328/, null, []);
        } 
        // 2. 초기화 설정
        if (Array.isArray(p_views)) views = p_views;
        else if (typeof p_views === 'string') views.push(p_views);
        // $all 일 경우 빈배열로 변경
        if (views.some(function(elem){
            if (!_isString(elem)) throw new logicEntity.ExtendError(/EL061329/, null, [i, typeof views[i]]);
            if (_isAllName(elem)) return true;
            return false;
        })) views.length = 0;
        
        // 3. 설정 대상 가져오기
        if (views.length > 0) {
            for (var i = 0; i < views.length; i++) {
                viewName = views[i];
                if (!_isString(viewName)) throw new logicEntity.ExtendError(/EL061329/, null, [i, typeof viewName]);
                // 속성 유무 검사
                if (this[viewName]) property.push(viewName);
                else throw new logicEntity.ExtendError(/EL061330/, null, [viewName]);
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
        if (p_name && !_isString(p_name)) throw new logicEntity.ExtendError(/EL061331/, null, [typeof p_name]);

        // 이름 추가
        $addOutput(cntName);

        // 참조 이름 추가
        if (_isString(p_name)) {
            if (!$checkDoubleName(p_name)) {
                throw new logicEntity.ExtendError(/EL061332/, null, [typeof p_name]);
            }
            this.$newOutput.push({ cmdName: p_name, viewName: cntName });
            Object.defineProperty(this, p_name, _getPropDescriptor(this, cntName));
        }
        
        // inner function
        function $addOutput(vName) {
            _this._outputs.add(new logicEntity.MetaView(vName, _this._baseTable));  // 등록방법 1   // TODO: getter/setter 추가 필요 검토?
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

        if (!_isString(p_name)) throw new logicEntity.ExtendError(/EL061333/, null, [typeof p_name]);
        
        view = this[p_name];
        if (view === defOutput)  throw new logicEntity.ExtendError(/EL061334/, null, [p_name]);
        
        if (this._outputs.indexOf(view) < 0) throw new logicEntity.ExtendError(/EL061335/, null, [p_name]);

        pos = this.$newOutput.indexOf(p_name);

        delete this[p_name];
        this.$newOutput.splice(pos, 1);
        this._outputs.remove(view);
    };

    return BaseBindCommand;

}(BaseBind));

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
                } else throw new logicEntity.ExtendError(/EL06161/, null, [this.constructor.name]);
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
                if (!(_isString(nVal))) throw new logicEntity.ExtendError(/EL06162/, null, [this.constructor.name]);
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
    logicEntity.Util.inherits(BindCommand, _super);

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
                throw new logicEntity.ExtendError(/EL06163/, null, [typeof data]);
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
            if (typeof rowIdx !== 'number') throw new logicEntity.ExtendError(/EL06164/, null, [i, typeof rowIdx]);
            if (_this._outputs[i].columns.count === 0) throw new logicEntity.ExtendError(/EL06165/, null, [i]);
            if (_this._outputs[i].rows.count - 1 < rowIdx) throw new logicEntity.ExtendError(/EL06166/, null, [i, rowIdx]);
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

        var _tables         = new logicEntity.MetaTableCollection(this);
        var _columnType     = logicEntity.MetaColumn;
        var items           = new logicEntity.PropertyCollection(this);
        var command         = new logicEntity.PropertyCollection(this);
        var fn              = new logicEntity.PropertyCollection(this);

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
                if (!(nVal instanceof logicEntity.MetaTableCollection)) throw new logicEntity.ExtendError(/EL061201/, null, [this.constructor.name]);
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
                if (!(logicEntity.Type.isProtoChain(nVal, logicEntity.MetaColumn))) throw new logicEntity.ExtendError(/EL061202/, null, [this.constructor.name]);
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
                if (!(nVal instanceof logicEntity.PropertyCollection)) throw new logicEntity.ExtendError(/EL061203/, null, [this.constructor.name]);
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
                if (!(nVal instanceof logicEntity.PropertyCollection)) throw new logicEntity.ExtendError(/EL061204/, null, [this.constructor.name]);
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
                if (!(nVal instanceof logicEntity.PropertyCollection)) throw new logicEntity.ExtendError(/EL061205/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061206/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061207/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061208/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061209/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061210/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061211/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061212/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061213/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061214/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061215/, null, [this.constructor.name]);
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
                if (typeof nVal !== 'function') throw new logicEntity.ExtendError(/EL061216/, null, [this.constructor.name]);
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

        logicEntity.Util.implements(BaseBindModel, this);       // strip:
    }
    logicEntity.Util.inherits(BaseBindModel, _super);

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
        if (!_isString(cName)) throw new logicEntity.ExtendError(/EL061217/, null, [cName]);
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
        else  throw new logicEntity.ExtendError(/EL061218/, null, []);

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
            if (!table) throw new logicEntity.ExtendError(/EL061219/, null, []);
            if (!(table instanceof logicEntity.MetaTable)) throw new logicEntity.ExtendError(/EL061220/, null, []);

            if (columnName.indexOf('__') > -1 ) continue; // __이름으로 제외 조건 추가 TODO: 아이템명 조건 별도 함수로 분리
            if(['number', 'string', 'boolean'].indexOf(typeof this.items[itemName]) > -1) { 
                table.columns.addValue(columnName, this.items[itemName]);
            } else if (_isObject(this.items[itemName])){
                table.columns.add(new this._columnType(columnName, table, this.items[itemName]));
            } else throw new logicEntity.ExtendError(/EL061221/, null, []);
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
        if (logicEntity.MetaRegistry.hasGuidObject(this._baseTable, owned)) {
            obj['_baseTable'] = logicEntity.MetaRegistry.createReferObject(this._baseTable);
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

        if (logicEntity.MetaRegistry.isGuidObject(p_oGuid['_baseTable'])) {
            var obj = logicEntity.MetaRegistry.createMetaObject(p_oGuid['_baseTable'], origin);
            obj.setObject(p_oGuid['_baseTable'], origin);
            this._baseTable = obj;
            
        } else if (p_oGuid['_baseTable']['$ref']) {
            var meta = logicEntity.MetaRegistry.findSetObject(p_oGuid['_baseTable']['$ref'], origin);
            if (!meta) throw new logicEntity.ExtendError(/EL061222/, null, [p_oGuid['_baseTable']['$ref']]);
            this._baseTable = meta;
        
        } else throw new logicEntity.ExtendError(/EL061223/, null, [p_oGuid['_baseTable']['$ref']]);
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
        if (!_isString(p_name)) throw new logicEntity.ExtendError(/EL061224/, null, [typeof p_name]);
        // 예약어 검사
        if (this.$KEYWORD.indexOf(p_name) > -1) {
            throw new logicEntity.ExtendError(/EL061225/, null, [p_name]);
        }            
        // 이름 중복 검사
        if (this._tables.existTableName(p_name)) {
            throw new logicEntity.ExtendError(/EL061226/, null, [p_name]);
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
        if (!(p_column instanceof logicEntity.MetaColumn || _isString(p_column))) {
            throw new logicEntity.ExtendError(/EL061227/, null, []);
        }
        if (typeof p_cmds !== 'undefined' && p_cmds !== null && (!(Array.isArray(p_cmds) || _isString(p_cmds)))) {
            throw new logicEntity.ExtendError(/EL061228/, null, []);
        }
        // 2. 초기값 설정
        if (Array.isArray(p_cmds)) cmds = p_cmds;
        else if (_isString(p_cmds)) cmds.push(p_cmds);

        if (_isString(p_bTable)) table = this._tables[p_bTable];
        else table = p_bTable || this._baseTable;

        if (!(table instanceof logicEntity.MetaTable)) {
            throw new logicEntity.ExtendError(/EL061229/, null, []);
        }
        if (_isString(p_column)) column = new this._columnType(p_column, table);
        else column = p_column;
        // 3. command 확인
        if (typeof p_cmds !== 'undefined' && cmds.length > 0) {
            for (var i = 0; i< cmds.length; i++) {
                if (!_isString(cmds[i])) throw new logicEntity.ExtendError(/EL061230/, null, [i, typeof cmds[i]]);
                
                if (this.command.exists(cmds[i])) command.push(cmds[i]);
                else throw new logicEntity.ExtendError(/EL061231/, null, [i, cmds[i]]);
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
            throw new logicEntity.ExtendError(/EL061232/, null, [typeof p_name]);
        }
        columnName = _getColumnName(p_name);
        tableName = _getTableName(p_name);

        if (tableName) table = this._tables[tableName];
        else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
        else table = p_bEntity || this._baseTable;

        if (!(table instanceof logicEntity.MetaTable)) {
            throw new logicEntity.ExtendError(/EL061233/, null, []);
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
            if (!(p_mapping instanceof logicEntity.PropertyCollection || _isObject(p_mapping))) {
                throw new logicEntity.ExtendError(/EL061234/, null, []);
            }

            // 2. 임시 매핑 컬렉션에 등록
            if (p_mapping instanceof logicEntity.PropertyCollection) {
                mappingCollection = p_mapping;
                // itemsCollection = p_mapping;
            } else if (_isObject(p_mapping)) {
                mappingCollection = new logicEntity.PropertyCollection();
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
            throw new logicEntity.ExtendError(/EL061237/, error, []);
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

            if (!(table instanceof logicEntity.MetaTable)) {
                throw new logicEntity.ExtendError(/EL061235/, null, []);
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
        throw new logicEntity.ExtendError(/EL061238/, null, [this.constructor.name]);
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
        var mapping = new logicEntity.PropertyCollection(this);

        // Type.allowType(IService, p_service, 1);
        if (!p_passTypeChk) logicEntity.Type.matchType(IService, p_service, 1);
        // tables 등록
        if (p_service['tables']) {
            if (Array.isArray(p_service['tables'])) tables = p_service['tables'];
            else if (_isString(p_service['tables'])) tables.push(p_service['tables']);
            else throw new logicEntity.ExtendError(/EL061239/, null, []);
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
                            throw new logicEntity.ExtendError(/EL061241/, null, [typeof views]);
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
                } else throw new logicEntity.ExtendError(/EL06151/, null, [this.constructor.name]);
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
                if (!(_isString(nVal))) throw new logicEntity.ExtendError(/EL06152/, null, [this.constructor.name]);
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
    logicEntity.Util.inherits(BindModel, _super);

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
        if (!(collection instanceof logicEntity.PropertyCollection)) throw new logicEntity.ExtendError(/EL06153/, null, []);

        // 검사         
        for (var i = 0; collection.count > i; i++) {
            if (_isObject(collection[i].selector)) {
                key = collection[i].selector.key;

                if (!_isString(key) || !logicEntity.Util.validSelector(key)) {
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
        if (!(collection instanceof logicEntity.PropertyCollection)) throw new logicEntity.ExtendError(/EL06154/, null, []);

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
            if (!_isString(p_name)) throw new logicEntity.ExtendError(/EL06155/, null, [typeof p_name]);

            if (_isString(p_bTable)) table = this._tables[p_bTable];
            else table = p_bTable || this._baseTable;

            bindCommand = new BindCommand(this, p_option, table);
            this.command.add(p_name, bindCommand);

            return bindCommand;
        } catch (error) {
            throw new logicEntity.ExtendError(/EL06156/, error, []);
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
                
            if (!p_passTypeChk) logicEntity.Type.matchType(IAjaxService, p_service, InterfaceTypeCheck);

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
            throw new logicEntity.ExtendError(/EL06157/, error, []);
        }               
    };

    return BindModel;

}(BaseBindModel));

/// <reference path="./types/index.d.ts" />

Object.defineProperty(exports, "ArrayCollection", {
    enumerable: true,
    get: function () { return logicEntity.ArrayCollection; }
});
Object.defineProperty(exports, "BaseCollection", {
    enumerable: true,
    get: function () { return logicEntity.BaseCollection; }
});
Object.defineProperty(exports, "BaseColumn", {
    enumerable: true,
    get: function () { return logicEntity.BaseColumn; }
});
Object.defineProperty(exports, "BaseColumnCollection", {
    enumerable: true,
    get: function () { return logicEntity.BaseColumnCollection; }
});
Object.defineProperty(exports, "BaseEntity", {
    enumerable: true,
    get: function () { return logicEntity.BaseEntity; }
});
Object.defineProperty(exports, "EventEmitter", {
    enumerable: true,
    get: function () { return logicEntity.EventEmitter; }
});
Object.defineProperty(exports, "ExtendError", {
    enumerable: true,
    get: function () { return logicEntity.ExtendError; }
});
Object.defineProperty(exports, "IArrayCollection", {
    enumerable: true,
    get: function () { return logicEntity.IArrayCollection; }
});
Object.defineProperty(exports, "ICollection", {
    enumerable: true,
    get: function () { return logicEntity.ICollection; }
});
Object.defineProperty(exports, "IElement", {
    enumerable: true,
    get: function () { return logicEntity.IElement; }
});
Object.defineProperty(exports, "IExportControl", {
    enumerable: true,
    get: function () { return logicEntity.IExportControl; }
});
Object.defineProperty(exports, "IGroupControl", {
    enumerable: true,
    get: function () { return logicEntity.IGroupControl; }
});
Object.defineProperty(exports, "IImportControl", {
    enumerable: true,
    get: function () { return logicEntity.IImportControl; }
});
Object.defineProperty(exports, "IList", {
    enumerable: true,
    get: function () { return logicEntity.IList; }
});
Object.defineProperty(exports, "IListControl", {
    enumerable: true,
    get: function () { return logicEntity.IListControl; }
});
Object.defineProperty(exports, "IMarshal", {
    enumerable: true,
    get: function () { return logicEntity.IMarshal; }
});
Object.defineProperty(exports, "IObject", {
    enumerable: true,
    get: function () { return logicEntity.IObject; }
});
Object.defineProperty(exports, "IPropertyCollection", {
    enumerable: true,
    get: function () { return logicEntity.IPropertyCollection; }
});
Object.defineProperty(exports, "ISchemaControl", {
    enumerable: true,
    get: function () { return logicEntity.ISchemaControl; }
});
Object.defineProperty(exports, "ISerialize", {
    enumerable: true,
    get: function () { return logicEntity.ISerialize; }
});
Object.defineProperty(exports, "ITransaction", {
    enumerable: true,
    get: function () { return logicEntity.ITransaction; }
});
Object.defineProperty(exports, "MetaColumn", {
    enumerable: true,
    get: function () { return logicEntity.MetaColumn; }
});
Object.defineProperty(exports, "MetaElement", {
    enumerable: true,
    get: function () { return logicEntity.MetaElement; }
});
Object.defineProperty(exports, "MetaObject", {
    enumerable: true,
    get: function () { return logicEntity.MetaObject; }
});
Object.defineProperty(exports, "MetaRegistry", {
    enumerable: true,
    get: function () { return logicEntity.MetaRegistry; }
});
Object.defineProperty(exports, "MetaRow", {
    enumerable: true,
    get: function () { return logicEntity.MetaRow; }
});
Object.defineProperty(exports, "MetaRowCollection", {
    enumerable: true,
    get: function () { return logicEntity.MetaRowCollection; }
});
Object.defineProperty(exports, "MetaSet", {
    enumerable: true,
    get: function () { return logicEntity.MetaSet; }
});
Object.defineProperty(exports, "MetaTable", {
    enumerable: true,
    get: function () { return logicEntity.MetaTable; }
});
Object.defineProperty(exports, "MetaTableCollection", {
    enumerable: true,
    get: function () { return logicEntity.MetaTableCollection; }
});
Object.defineProperty(exports, "MetaTableColumnCollection", {
    enumerable: true,
    get: function () { return logicEntity.MetaTableColumnCollection; }
});
Object.defineProperty(exports, "MetaView", {
    enumerable: true,
    get: function () { return logicEntity.MetaView; }
});
Object.defineProperty(exports, "MetaViewCollection", {
    enumerable: true,
    get: function () { return logicEntity.MetaViewCollection; }
});
Object.defineProperty(exports, "MetaViewColumnCollection", {
    enumerable: true,
    get: function () { return logicEntity.MetaViewColumnCollection; }
});
Object.defineProperty(exports, "NamespaceManager", {
    enumerable: true,
    get: function () { return logicEntity.NamespaceManager; }
});
Object.defineProperty(exports, "ObjectColumn", {
    enumerable: true,
    get: function () { return logicEntity.ObjectColumn; }
});
Object.defineProperty(exports, "PropertyCollection", {
    enumerable: true,
    get: function () { return logicEntity.PropertyCollection; }
});
Object.defineProperty(exports, "TransactionCollection", {
    enumerable: true,
    get: function () { return logicEntity.TransactionCollection; }
});
Object.defineProperty(exports, "TransactionQueue", {
    enumerable: true,
    get: function () { return logicEntity.TransactionQueue; }
});
Object.defineProperty(exports, "Type", {
    enumerable: true,
    get: function () { return logicEntity.Type; }
});
Object.defineProperty(exports, "Util", {
    enumerable: true,
    get: function () { return logicEntity.Util; }
});
exports.BaseBind = BaseBind;
exports.BaseBindCommand = BaseBindCommand;
exports.BaseBindModel = BaseBindModel;
exports.BindCommand = BindCommand;
exports.BindModel = BindModel;
exports.HTMLColumn = HTMLColumn;
exports.IAjaxService = IAjaxService;
exports.IBind = IBind;
exports.IBindCommand = IBindCommand;
exports.IBindModel = IBindModel;
exports.ICommandCallback = ICommandCallback;
exports.IModelCallback = IModelCallback;
exports.IService = IService;
exports.Message = Message;
exports.default = BindModel;
//# sourceMappingURL=bind-model.node.cjs.map
