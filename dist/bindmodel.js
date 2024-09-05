/**** message-code.js | _L.messageCode.core ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    //==============================================================
    // 2. module dependency check
    //==============================================================
    var messageCode = {
        en: {},
        ko: {
            // 실패
            ES010: '기타 오류',
            ES011: '["$1"] 모듈을 가져오는데 실패하였습니다.',
            ES012: '["$1"()] 함수를 가져오는데 실패하였습니다.',
            ES013: '[$1]는 [$2] 처리가 실패하였습니다.',
            // 타입
            ES021: '[$1]는 [$2] 타입만 가능합니다.',
            ES022: '[$1]는 처리할 수 없는 타입니다.', 
            ES023: '[$1]는 [$2]타입이 아닙니다.',
            // 객체
            ES031: '[$1]는 객체가 아닙니다.',
            ES032: '[$1]는 [$2]의 인스턴스가 아닙니다.',
            ES033: '[$1]의 객체가 [$2]와 다릅니다.',
            // 중복
            ES041: '[$1]는 [$2]와 중복이 발생했습니다.',
            ES042: '[$1]에 [$2]가 존재하여 [$3]를 재거 할 수 없습니다.',
            ES043: '[$1]에 [$1]가 존재하여 [$3]를 추가 할 수 없습니다.',
            ES044: '[$1]는 예약어 입니다.',
            // 필수
            ES051: '필수값 [$1]이 없습니다.',
            ES052: '[$1]에는 [$2]이 필요합니다.',
            ES053: '[$1]에 [$2]이 존재하지 않습니다.',
            ES054: '[$1]에 공백을 입력할 수 없습니다.',
            // 범위
            ES061: '[$1]의 [$2] 범위를 초과하였습니다.',
            ES062: '[$1]는 [$2]보다 작을 수가 없습니다.',
            ES063: '[$1]와 [$2]의 길이가 다릅니다.',
            ES064: 'and(&&) 조건 검사에 실패하였습니다. $1',
            ES065: 'or(||) 조건 검사에 실패하였습니다. $1',
            ES066: '[$1]의 범위는 [$2]에서 [$3]까지 입니다. ',
            // Common.*
            // util-type : match
            EL01100: 'util-type.js match',
            EL01101: '타입 매치 : $1 의 세부 타입을 지정해야 합니다. $1: $2',
            EL01102: '타입 매치 : target 은 \'$1\' 타입이 아닙니다. tarType: $2',
            EL01103: '타입 매치 : 처리할 수 없는 타입니다. ',
            // match array
            EL01110: '',
            EL01111: '배열 매치 : target 은 array 타입이 아닙니다. tarType: $1',
            EL01112: '배열 매치 : array(_ANY_) 타입은 target array 의 요소가 하나 이상 가지고 있어야 합니다. target.length = $1',
            EL01113: '배열 매치 : array(_SEQ_) 타입의 길이보다 target array 의 길이가 작습니다. extType.length = $1, target.length = $2',
            EL01114: '배열 매치 : array(_SEQ_) [$1]번째 리터럴 타입이 target 값과 다릅니다. extType[$1] = $2, target[$1] = $3',
            EL01115: '배열 매치 : array(_SEQ_) [$1]번째 타입 검사가 실패하였습니다. extType[$1] = $2',
            EL01116: '배열 매치 : array(_REQ_) 타입은 target array 의 요소가 하나 이상 가지고 있어야 합니다. target.length = $1',
            EL01117: '배열 매치 : array($1) 는 처리할 수 없는 array 타입 종류입니다.',
            EL01118: '배열 매치 : array 요소 검사가 실패하였습니다. extType: $1, tarType: $2',
            // match choice
            EL01120: '',
            EL01121: '초이스 매치 : choice(_ANY_) 타입에 \'undefined\' 은 사용할 수 없습니다.',
            EL01122: '초이스 매치 : choice(_NON_) 타입에 \'undefined\' 만 가능합니다.',
            EL01123: '초이스 매치 : choice(_ERR_) 타입에 Errror 인스턴스 만 가능합니다.',
            EL01124: '초이스 매치 : choice(_EUM_) 타입의 세부 타입은 리터럴만 가능합니다. extType[$1]: $2',
            EL01125: '초이스 매치 : choice(_DEF_) 타입의 첫번째 세부 타입은 리터럴만 가능합니다. extType[0]: $1',
            EL01126: '초이스 매치 : choice($1) 는 처리할 수 없는 choice 타입 종류입니다.',
            EL01127: '초이스 매치 : choice 세부 타입 검사가 실패하였습니다. extType: $1, tarType: $2',
            // match class
            EL01130: '',
            EL01131: '클래스 매치 : class 타입을 union 타입으로 생성 후 검사에 실패하였습니다. (opt = 1)',
            EL01132: '클래스 매치 : target은 [$1]의 인스턴스가 아닙니다.',
            EL01133: '클래스 매치 : target 이 class, object, union 타입이 아닙니다. tarType: $1',
            // match union
            EL01140: '',
            EL01141: '유니언 매치 : target 은 union 타입이 아닙니다. tarType: $1',
            EL01142: '유니언 매치 : target[\'$1\'] 키가 존재하지 않습니다. extType[\'$1\'] = $2',
            EL01143: '유니언 매치 : \'$1\' 타입 검사가 실패하였습니다.',
            // match function
            EL01150: '',
            EL01151: '함수 매치 : target 은 function 타입이 아닙니다. tarType: $1',
            EL01152: '함수 매치 : 선언한 extType.name = \'$1\' 과 target name 이 일치하지 않습니다. function.name = \'$2\'',
            EL01153: '함수 매치 : extType.func 을 선언하였는데 target.func 이 functon 타입이 아닙니다.',
            EL01154: '함수 매치 : extType.func 과 target.func 서로 다릅니다.(proto check)',
            EL01155: '함수 매치 : target의 params 또는 return 객체를 설정해야 합니다. extType.param = $1, extType.return = $2',
            EL01156: '함수 매치 : params 허용검사가 거부되었습니다. <array(_SEQ_) 변환>',
            EL01157: '함수 매치 : return 허용검사가 거부되었습니다.',
            // allow
            EL01200: '',
            EL01201: '타입 허용 : $1 의 세부 타입을 지정해야 합니다. $1: $2',
            EL01202: '타입 허용 : $1 타입의 리터럴 값과 다릅니다. extType = $2, tarType = $3',
            EL01203: '타입 허용 : $1 타입이 아닙니다. tarType = $2',
            EL01204: '타입 허용 : 처리할 수 없는 타입입니다.',
            // allow array
            EL01210: '',
            EL01211: '배열 허용 : array 타입이 아닙니다. tarType: $1',
            EL01212: '타입 허용 : array(_ANY_) 타입에 array(_ALL_, _OPT_) 타입을 허용하지 않습니다. tarType: $1',
            EL01213: '배열 허용 : array(_SEQ_) 타입에 array(_SEQ_) 타입만 허용합니다. tarType: $1',
            EL01214: '배열 허용 :extType 의 array(_SEQ_) 타입의 길이보다 tarType 은 같거나 커야합니다. extType.length = $1, target.length = $2',
            EL01215: '배열 허용 : array(_SEQ_) [$1]번째 타입 검사가 실패하였습니다.',
            EL01216: '배열 허용 : array(_REQ_) 타입에 array(_ALL_, _ANY_, _OPT_) 타입을 허용하지 않습니다. tarType: $2',
            EL01217: '배열 허용 : array(_OPT_) 타입에 array(_ALL_, _ANY_) 타입을 허용하지 않습니다. tarType: $2',
            EL01218: '배열 허용 : array($1) 는 처리할 수 없는 array 타입 종류입니다.',
            EL01219: '배열 허용 : array 요소 검사가 실패하였습니다. extType: $1, tarType: $2',
            // allow choice 
            EL01220: '',
            EL01221: '초이스 허용 : choice(_ALL_) 타입에 choice(_ERR_) 타입을 허용하지 않습니다. tarType: $1',
            EL01222: '초이스 허용 : choice(_ANY_) 타입에 \'undefined\' 타입은 사용할 수 없습니다.',
            EL01223: '초이스 허용 : choice(_ANY_) 타입에 choice(_NON_, _ERR_), \'undefined\' 타입을 허용하지 않습니다. tarType: $1',
            EL01224: '초이스 허용 : choice(_NON_) 타입에 choice(_NON_) 타입만 허용합니다. tarType: $1',
            EL01225: '초이스 허용 : choice(_ERR_) 타입에 choice(_ERR_) 타입만 가능합니다. tarType: $1',
            EL01226: '초이스 허용 : choice(_REQ_) 타입에 choice(_ALL_, _ANY_, _OPT_, _NON_, _ERR_) 타입을 허용하지 않습니다. tarType: $1',
            EL01227: '초이스 허용 : choice(_OPT_) 타입에 choice(_ALL_, _ANY_, _NON_, _ERR_) 타입을 허용하지 않습니다. tarType: $1',
            EL01228: '초이스 허용 : choice(_EUM_) 타입에 choice(_EUM_) 타입만 가능합니다.',
            EL01229: '초이스 허용 : choice(_EUM_) 의 세부 타입은 리터럴만 가능합니다. extType[$1]: $2',
            EL0122A: '초이스 허용 : tarType choice(_EUM_) 의 세부 타입은 리터럴만 가능합니다. tarType[$1]: $2',
            EL0122B: '초이스 허용 : choice(_DEF_) 타입에 choice(_DEF_) 타입만 가능합니다.',
            EL0122C: '초이스 허용 : extType choice(_DEF_) 의 첫번째 세부 타입은 리터럴만 가능합니다. extType[0]: $1',
            EL0122D: '초이스 허용 : tarType choice(_DEF_) 의 첫번째 세부 타입은 리터럴만 가능합니다. tarType[0]: $1',
            EL0122E: '초이스 허용 : choice($1) 는 처리할 수 없는 choice 타입 종류입니다.',
            EL0122F: '초이스 허용 : tarType[$1] = $3 타입에 허용하는 extType 이 없습니다. extType = $2',
            // allow class
            EL01230: '',
            EL01231: '클래스 허용 : extType, tarType class 타입을 union 타입으로 생성 후 검사에 실패하였습니다. (opt = 1)',
            EL01232: '클래스 허용 : class to class 허용이 거부 되었습니다. (opt = $1)',
            EL01233: '클래스 허용 : tarType class 타입을 union 타입으로 생성 후 검사에 실패하였습니다. (opt = 1)',
            EL01234: '클래스 허용 : class to union 허용이 거부 되었습니다. (opt = $1)',
            EL01235: '클래스 허용 : tarType 이 class, union 타입이 아닙니다. tarType: $1',
            // allow union
            EL01240: '',
            EL01241: '유니언 허용 : tarType 은 union 타입이 아닙니다. tarType: $1',
            EL01242: '유니언 허용 : tarType[\'$1\'] 키가 존재하지 않습니다. extType[\'$1\'] = $2',
            EL01243: '유니언 허용 : \'$1\' 타입 검사가 실패하였습니다.',
            // allow function
            EL01250: '',
            EL01251: '함수 허용 : tarType 은 function 타입이 아닙니다. tarType: $1',
            EL01252: '함수 허용 : 선언한 extType.name = \'$1\' 과 target name 이 일치하지 않습니다. function.name = \'$2\'',
            EL01253: '함수 허용 : extType.func 을 선언하였는데 target.func 이 functon 타입이 아닙니다.',
            EL01254: '함수 허용 : extType.func 과 target.func 서로 다릅니다.(proto check)',
            EL01255: '함수 허용 : tarType의 params 또는 return 객체를 설정해야 합니다. extType.param = $1, extType.return = $2',
            EL01256: '함수 허용 : params 허용검사가 거부되었습니다. <array(_SEQ_) 변환>',
            EL01257: '함수 허용 : return 허용검사가 거부되었습니다.',
            // etc
            // util-type.js
            EL01300: '',
            EL01301: '파싱 검사 : function 규칙이 아닙니다. "$1"',
            EL01302: '파싱 검사 : function 에 argument, body 내용이 없습니다. "$1"',
            EL01303: '파싱 검사 : function 파싱 실패 $1',
            EL01304: '타입 검사 : [$1]는 처리할 수 스페셜타입 입니다.',
            EL01305: '타입 검사 : array($1) 타입은 처리할 수 없는 스페설타입 입니다.',
            EL01306: '타입 검사 : choice($1) 타입은 처리할 수 없는 스페셜타입 입니다.',
            EL01307: '타입 검사 : array($1) 타입은 처리할 수 없는 타입 입니다.',
            EL01308: '타입 검사 : choice($1) 타입은 처리할 수 없는 타입 입니다.',
            // EL01309: '',
            EL0130A: '타입 허용 : allowType(extType, tarType) 검사가 실패하였습니다.',
            EL0130B: '타입 매치 : matchType(extType, target) 검사가 실패하였습니다.',
            EL0130C: 'ctor 이 function 타입이 아닙니다. typeof ctor = $1',
            // util.js
            EL01400: '',
            EL01401: 'implements(ctor, obj, args..); ctor 이 <function> 타입이 아닙니다. typeof ctor == \'$1\'',
            EL01402: 'implements(ctor, obj, args..); obj 이 <object> 타입이 아닙니다. typeof obj == \'$1\'',
            EL01403: 'implements(ctor, obj, args..); args[$1] 이 <function> 타입이 아닙니다. typeof args[$1] == \'$2\'',
            EL01404: '[$1] 는 [$2] 타입을 구현해야 합니다. $1._KIND = \'$3\'',
            EL01405: 'isImplementOf(target); target 은 <function, string> 타입만 가능합니다. typeof target = \'$1\'',
            // etc
            EL01500: '',
            // observer.js
            // REVIEW: 전체 변겯
            EL01510: '',
            // EL01511: 'new Observer(caller); caller 는 \'object\' 타입이 아닙니다. typeof caller = $1',
            // EL01512: 'Observer.isLog 는 \'boolean\' 타입이 아닙니다. typeof isLog = $1',
            // EL01513: 'Observer.isSingleMode 는 \'boolean\' 타입이 아닙니다. typeof isSingleMode = $1',
            // EL01514: 'Observer.__$subscribers 값은  \'object\' 타입이 아닙니다. typeof __$subscribers = $1',
            // EL01515: 'Observer.__$subscribers[\'any\'] 객체가 없습니다. { any: undefined }',
            // EL01516: 'subscribe(fn, code); fn 는 \'function\' 타입이 아닙니다. typeof fn = $1',
            EL01501: '$1.$events 는 obejct 타입입니다. typeof $events $2',
            EL01502: '$1.isLog 는 boolean 타입입니다. typeof isLog $2',
            EL01503: 'on(event, listener); event 는 <string> 타입이 아닙니다. typeof event == \'$1\'',
            EL01504: 'on(event, listener); listener 는 <function> 타입이 아닙니다. typeof listener == \'$1\'',
            EL01505: 'once(event, listener); event 는 string 타입이 아닙니다. typeof event == \'$1\'',
            EL01506: 'once(event, listener); listener 는 <function> 타입이 아닙니다. typeof listener == \'$1\'',
            EL01507: 'off(event, listener); event 는 <string> 타입이 아닙니다. typeof event == \'$1\'',
            EL01508: 'off(event, listener); listener 는 <function> 타입이 아닙니다. typeof listener == \'$1\'',
            EL01509: 'emit(event); event 는 <string> 타입이 아닙니다. typeof event == \'$1\'',
            EL01510: '',
            // Interface.*
            // EL02
            EL02100: '',
            // i-object.js
            EL02110: '',
            EL02111: 'getTypes(): array<function> 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02112: 'instanceOf(any): boolean 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02113: 'equal(any): boolena 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-marshal.js
            EL02120: '',
            EL02121: 'getObject(opt?, origin?): object 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02122: 'setObject(mObj) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-element.js
            EL02130: '',
            EL02131: 'clone(): object 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-list.js
            EL02140: '',
            // i-control-list.js
            EL02150: '',
            EL02151: 'add(key) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02152: 'del(key) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02153: 'has(key): boolean 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02154: 'find(any): any 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-collection.js
            EL02160: '',
            EL02161: 'add(any): boolean 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02162: 'remove(elem): boolean 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02163: 'cantains(any): boolean 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02164: 'indexOf(any): number 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-collection-array.js
            EL02170: '',
            EL02171: 'insertAt(pos, val, ..): boolean 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-collection-property.js
            EL02180: '',
            EL02181: 'indexToKey(idx): string 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-serialize.js
            EL02190: '',
            EL02191: 'output(opt, ...): string 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02192: 'load(any, ...) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // Meta.Entity.*
            EL02300: '',
            // Meta.*
            EL03100: '',
            // meta-object.js
            EL03110: '',
            EL03111: 'abstract, interface, enum 타입은 생성할 수 없습니다. $1[\'_KIND\'] = \'$2\'',
            EL03112: 'setObject(oGuid, origin); oGuid 는 \'object\' 타입입니다. typeof oGuid = \'$1\'',
            EL03113: 'setObject(oGuid, origin); 네임스페이스가 서로 다릅니다. this._type = $1, oGuid._type = $2',
            EL03114: 'setObject(oGuid, origin); origin 은 Guid 객체가 아닙니다. origin._type = \'$1\', origin._guid = \'$2\'',
            // meta-element.js
            EL03120: '',
            EL03121: '$name; val 은 \'string\' 타입입니다. typeof val = \'$1\'',
            EL03122: '$name; val.length 은 0 보다 커야 합니다.',
            // meta-registry.js
            EL03200: '',
            // object
            EL03211: 'register(meta); 등록할 meta 가 Guid 객체가 아닙니다. meta._type = \'$1\', meta._guid = \'$2\'',
            EL03212: 'register(meta); 등록할 meta._guid 가 이미 등록되어 있습니다. meta._guid = \'$1\'',
            EL03213: 'release(meta); 해제할 meta 는 string(guid) | object(Guid) 타입만 가능합니다. typeof meta = \'$1\'',
            // create
            EL03220: '',
            EL03221: 'createMetaObject(oGuid, origin); oGuid 는 \'object\' 타입만 가능합니다. typeof oGuid = \'$1\'',
            EL03222: 'createMetaObject(oGuid, origin); oGuid._type 은 \'string\' 타입만 가능합니다.(length > 0) typeof oGuid._type = \'$1\'',
            EL03223: 'createMetaObject(oGuid, origin); origin 는 \'object\' 타입만 가능합니다. typeof origin = \'$1\'',
            EL03224: 'createMetaObject(oGuid, origin); [$1] 네임스페이스가 \'function\' 타입이 아닙니다. typeof coClass = \'$2\'',
            EL03225: 'createReferObject(meta); meta 는 \'object\' 타입만 가능합니다. typeof meta = \'$1\'',
            EL03226: 'createReferObject(meta); meta._guid 은 \'string\' 타입만 가능합니다.(length > 0) typeof meta._guid = \'$1\'',
            EL03227: 'createNsReferObject(fun); fun 는 \'function\' 타입이 아닙니다. typeof fun = \'$1\'',
            // ns Class
            EL03230: '',
            EL03231: 'registerClass(fun, ns, key); fun 이 \'function\' 타입이 아닙니다. typeof fun = \'$1\'',
            EL03232: 'registerClass(fun, ns, key); ns 가 \'string\' 타입이 아닙니다. typeof ns = \'$1\'',
            EL03233: 'registerClass(fun, ns, key); key 가 \'string\' 타입이 아닙니다. typeof key = \'$1\'',
            EL03234: 'releaseClass(fullName); fullName 은 \'string\' 타입만 가능합니다.(length > 0) typeof fullName = \'$1\'',
            EL03235: 'findClass(fun); fun 는 \'function\' 타입이 아닙니다. typeof fun = \'$1\'',
            EL03236: 'getClass(fullName); fullName 은 \'string\' 타입만 가능합니다.(length > 0) typeof fullName = \'$1\'',
            // set, transform, load
            EL03240: '',
            EL03241: 'setMetaObject(oGuid, meta); oGuid 는 \'object\' 타입만 가능합니다. typeof oGuid = \'$1\'',
            EL03242: 'setMetaObject(oGuid, meta); meta 는 \'object\' 타입만 가능합니다. typeof meta = \'$1\'',
            EL03243: 'setMetaObject(meta); meta._guid 은 \'string\' 타입만 가능합니다.(length > 0) typeof meta._guid = \'$1\'',
            EL03244: 'transformRefer(oGuid); oGuid 는 \'object\' 타입만 가능합니다. typeof oGuid = \'$1\'',
            EL03245: 'transformRefer(oGuid); $1[\'$2\'][\'$ns\'] 는 \'function\' 타입이 아닙니다.',
            EL03246: 'loadMetaObject(str, parse?); str 은 \'string\' 타입만 가능합니다. typeof str = \'$1\'',
            EL03247: 'loadMetaObject(str, parse?); str 을 파싱한 객체가 Guid 객체가 아닙니다. obj._type = \'$1\', obj._guid = \'$2\'',
            // has, valid, find
            EL03250: '',
            EL03251: 'validObject(oGuid); oGuid 는 \'object\' 타입만 가능합니다. typeof oGuid = \'$1\'',
            EL03252: 'hasGuidObject(oGuid, origin); guid 는 \'string\' 타입만 가능합니다.(length > 0) typeof guid = \'$1\'',
            EL03253: 'hasGuidObject(oGuid, origin); origin[$1]는 \'object\' 타입이 아닙니다. typeof origin[$1] = \'$2\'',
            EL03254: 'hasRefer(oGuid); oGuid 는 \'object\' 타입만 가능합니다. typeof oGuid = \'$1\'',
            EL03255: 'hasRefer(oGuid); oGuid 가 Guid 객체가 아닙니다. oGuid._type = \'$1\', oGuid._guid = \'$2\'',
            EL03256: 'findSetObject(oGuid, origin); [ oGuid._guid | oGuid ]는 \'string\' 타입만 가능합니다.(length > 0) guid = \'$1\'',
            EL03257: 'findSetObject(oGuid, origin); origin 는 \'object\' 타입만 가능합니다. typeof origin = \'$1\'',
            // namespace-manager.js
            EL03300: '',
            // private function, proterty
            EL03310: '',
            EL03311: 'NamespaceManager.isOverlap 은  \'boolean\' 타입만 가능합니다. typeof isOverlap = $1',
            EL03312: '_getArray(ns); ns 는 유효한 네임스페이스 이름 규칙이 아닙니다. ns = $1',
            EL03313: '_getArray(ns); ns 타입은 \'string\', \'array<string>\' 타입만 가능합니다. typeof ns = $1',
            EL03314: '_getArray(ns); ns[$1] 는 \'string\' 타입이 아닙니다. typeof ns[$1] = $2',
            EL03315: '_getArray(ns); ns[$1] 는 유효한 이름 규칙이 아닙니다. ns[$1] = $1',
            // addNamespace, delNamespace, path
            EL03320: '',
            EL03321: 'addNamespace(ns); 네임스페이스 추가가 실패하였습니다.',
            EL03322: 'delNamespace(ns); 네임스페이스 삭제가 실패하였습니다.',
            EL03323: 'path(ns); 네임스페이스 경로 얻기에 실패하였습니다.',
            // add, del 
            EL03330: '',
            EL03331: 'add(fullName, elem); [$1] 는 유효한 이름 규칙이 아닙니다.',
            EL03332: 'add(fullName, elem); elem 이 이미 등록되었습니다. 중복허용 [this.isOverlap = \'true\']',
            EL03333: 'add(fullName, elem); 네임스페이스에 요소 등록이 실패하였습니다.',
            EL03334: 'del(fullName); 네임스페이스에 요소 삭제가 실패하였습니다.',
            // getPath, output, load
            EL03340: '',
            EL03341: 'getPath(elem); elem 값이 없습니다. typeof elem = $1',
            EL03342: 'output(stringify, space); 네임스페이스 내보내기가 실패하였습니다. $1',
            EL03343: 'load(str, parse); str 는 \'string\' 타입이 아닙니다. typeof str = $1',
            EL03344: 'load(str, parse); 네임스페이스 로딩이 실패하였습니다. $1',
            // Collection.*
            EL04100: '',
            // base-collection.js
            EL04110: '',
            EL04111: '_remove(idx): boolean 는 추상메소드 입니다. 구현해야 합니다.',
            EL04112: 'setObject(oGuid, origin); oGuid 의 _owner 연결이 실패하였습니다. guid = $1',
            EL04113: 'removeAt(idx); idx 는 \'number\' 타입이 아닙니다. typeof idx = $1',
            EL04114: 'add(any): number 는 추상메소드 입니다. 구현해야 합니다.',
            EL04115: 'clear() 는 추상메소드 입니다. 구현해야 합니다.',
            EL04116: 'map(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            EL04117: 'filter(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            EL04118: 'reduce(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            EL04119: 'find(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            EL041110: 'forEach(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            EL041111: 'some(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            EL041112: 'every(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            EL041113: 'findIndex(callback); callback 이 function 타입이 아닙니다. typeof callback = $1',
            //
            EL04200: '',
            // collection-array.js
            EL04210: '',
            EL04211: 'setObject(oGuid, origin); oGuid[\'_elem\'][$1] 의 _elements 연결이 실패하였습니다. guid = $2',
            EL04212: 'insertAt(pos, value, desc); pos 는 \'number\' 타입이 아닙니다. typeof pos = $1',
            EL04213: 'insertAt(pos, value, desc); pos 는 this.count 보다 클 수 없습니다. pos = $1, count = $2',
            EL04214: 'insertAt(pos, value, desc);  pos 는 0 보다 작을 수 없습니다. pos = $1',
            EL04215: 'insertAt(pos, value, desc); 등록이 실패하였습니다. pos = $1, value = $2',
            // collection-property.js
            EL04220: '',
            EL04221: 'setObject(oGuid, origin); oGuid[\'_elem\'].length = $1 길이와 oGuid[\'_key\'].length = $2 길이가 서로 다릅니다.',
            EL04222: 'setObject(oGuid, origin); oGuid[\'_elem\'].length = $1 길이와 oGuid[\'_desc\'].length = $2 길이가 서로 다릅니다.',
            EL04223: 'setObject(oGuid, origin); oGuid._elem[$1] guid 를 찾을 수 없습니다. guid = $2' ,
            EL04224: 'indexOf(obj, isKey); key로 인덱스값을 찾을 경우 obj 는 \'string\' 타입이어야 합니다. typeof obj = $1',
            EL04225: 'add(name, value, desc); name 이 \'string\' 타입이 아닙니다. typeof name = $1',
            EL04226: 'add(name, value, desc); name = \'$1\' 이 이름규칙에 맞지 않습니다. 규칙 = \'$2\'',
            EL04227: 'add(name, value, desc); name = \'$1\' 이 예약어 입니다.',
            EL04228: 'add(name, value, desc); name = \'$1\' 이 기존 이름과 중복이 발생했습니다.',
            EL04229: 'add(name, value, desc); 추가가 실패하였습니다. name = \'$1\', value = \'$2\'',
            EL0422A: 'indexToKey(idx); idx 이 \'number\' 타입이 아닙니다. typeof idx = $1',
            EL0422B: 'exist(key); key 이 \'string\' 타입이 아닙니다.(length > 0) typeof key = $1',
            //
            EL04300: '',
            // collection-transaction.js
            EL04310: '',
            EL04311: '$1.autoChanges 는 \'boolean\' 타입입니다. typeof aucoChanges = \'$2\'',
            // trans-queue.js
            EL04320: '',
            EL04321: 'collection 값이 [MetaObject] 을 상속한 인스턴스가 아닙니다.',
            EL04322: 'collection 이 [ArrayCollection] 의 인스턴스가 아닙니다.',
            EL04323: 'rollback(); \'$1\' 는 처리할 수 없는 cmd 입니다.',
            // Warn
            WS011: '[$1] 대상 [$2]는 삭제 할 수 없습니다.',
        }
    };
    //==============================================================
    // 4. module export
    // create namespace
    _global._L                      = _global._L || {};
    _global._L.messageCode          = _global._L.messageCode || {};
    _global._L.messageCode.core     = messageCode;
}(typeof window !== 'undefined' ? window : global));
/**** message.js | _L.Common.Message ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var messageCode                    = _global._L.messageCode.core;              
    //==============================================================
    // 2. module dependency check
    //==============================================================
    // 3. module implementation       
    var Message = (function () {
       /**
        * 메세지와 코드를 관리합니다. (static)
        * @constructs _L.Common.Message
        * @static
        */
       function Message() { 
        }
        Message._NS = 'Common';     // namespace
        // inner function
        function isObject(obj) {
            return obj && typeof obj === 'object' && !Array.isArray(obj);
        }
        function _isString(obj) {    // 공백아닌 문자 여부
            if (typeof obj === 'string' && obj.length > 0) return true;
            return false;
        }
        function deepMerge(target, source) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    var targetValue = target[key];
                    var sourceValue = source[key];
                    if (isObject(sourceValue)) {
                        if (!isObject(targetValue)) {
                            target[key] = {};
                        }
                        target[key] = deepMerge(target[key], sourceValue);
                    } else {
                        target[key] = sourceValue;
                    }
                }
            }
            return target;
        }
        // var define
        var $storage = {};
        var lang = 'ko';
        // var isLong = false;
        /**
         * 메시지 코드 스토리지
         * @member {string} _L.Common.Message#$storage
         */
        Object.defineProperty(Message, "$storage", {
            get: function() { 
                // if (!$storage) {
                //     var objs = [];
                //     for (var key in messageCode) {
                //         if (Object.prototype.hasOwnProperty.call(messageCode, key)) {
                //             objs.push(messageCode[key]);
                //         }
                //     }
                //     $storage = deepMerge.apply(null, {}, objs);
                // }
                return $storage;
            },
            set: function(val) { 
                deepMerge($storage, val);
            },
            configurable: false,
            enumerable: true,
        });
        /**
         * 메세지 언어 
         * @member {string} _L.Common.Message#lang
         */
        Object.defineProperty(Message, "lang", {
            get: function() { return lang; },
            set: function(val) { 
                if (!Message.$storage[val]) throw new Error('The ['+ val +'] language does not exist.');
                lang = val;
            },
            configurable: false,
            enumerable: false,
        });
        /**
         * 긴 메세지 여부
         * @member {string} _L.Common.Message#isLong
         */
        // Object.defineProperty(Message, "isLong", {
        //     get: function() { return isLong; },
        //     set: function(val) { 
        //         isLong = val; 
        //     },
        //     configurable: false,
        //     enumerable: false,
        // });
        // local function
        function _getCodeObject(code){
            var MSG = Message.$storage[lang];
            // var div, part, num;
            if (!_isString(code)) return;
            // div = code.substring(0, 1);
            // part = code.substring(1, 4);
            // num = code.substring(4, code.length);
            // if (!MSG[div] || !MSG[div] || !MSG[div][part]) return;
            // return MSG[div][part][num];
            return MSG[code];
        }
        function _buildMessage(code, arr) {
            var str = _getCodeObject(code);
            var msg;
            if (!_isString(str)) return 'There are no messages about the code.' ;
            // if (typeof str !== 'string') return 'There are no messages about the code.' 
            msg = $build(str);
            // if (isLong) {
            //     long = $build(str);
            //     if (long.length > 0) msg += '\n' + long;
            // }
            return $intro(code) + msg;
            // inner function
            function $build(p_msg) {
                var msg = p_msg;
                var result;
                var max = 0;
                // if (!msg) return msg;
                result = msg.match(/\$\d+/g);
                if (!Array.isArray(result)) return msg;
                for (var i = 0; i < result.length; i++) {
                    var num = Number(result[i].replace('$', ''));
                    if (num > max) max = num;
                }
                for (var i = 1; i <= max; i++) {
                    var val = arr[i - 1];
                    msg = msg.replace(new RegExp('\\$'+ i, 'g'), val);
                }
                return msg;
            }
            function $intro(code) {
                var intro = '';
                var firstChar = code.substring(0, 1);
                if (firstChar === 'E') intro = 'Error';
                else if (firstChar === 'W') intro = 'Warn';
                return intro + ' ['+ code +'] ';
            }
        }
        /**
         * 메세지 코드에 대한 문자열를 얻습니다.
         * @param {string} p_code 메세지 코드
         * @param {array<string>} p_aValue msg $1, $2... 매창값
         * @returns {string}
         */
        Message.get = function(p_code, p_aValue) {
            return _buildMessage(p_code, p_aValue);
        };
        /**
         * 메세지 코드에 대한 Error 객체를 생성해서 예외룰 발생합니다.
         * @param {string} p_code 메세지 코드
         * @param {array<string>} p_aValue msg $1, $2... 매창값
         */
        Message.error = function(p_code, p_aValue) {
            throw new Error(Message.get(p_code, p_aValue));
        };
        /**
         * 메세지 코드에 대한 console.warn 을 발생합니다.
         * @param {string} p_code 메세지 코드
         * @param {array<string>} p_aValue msg $1, $2... 매창값
         */
        Message.warn = function(p_code, p_aValue) {
            console.warn(Message.get(p_code, p_aValue));
        };
        return Message;
    }());
    Message.$storage = messageCode;
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Common               = _global._L.Common || {};
    _global._L.Message = Message;
    _global._L.Common.Message = Message;
}(typeof window !== 'undefined' ? window : global));
/**** extend-error.js | _L.Common.ExtendError ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;   
    //==============================================================Á
    // 2. module dependency check
    //==============================================================
    // 3. module implementation   
    var OLD_ENV = _global.OLD_ENV ? _global.OLD_ENV : false;    // 커버리지 테스트 역활
    var ExtendError = (function () {
        /**
         * @overload
         * @param {string} p_msg 사용자 메세지 내용
         * @param {ExtendError | object} p_prop  상위 Error 객체
         * @returns {Error}
         */
        /**
         * @overload
         * @param {Regexp} p_msg 메세지 코드
         * @param {ExtendError | object} p_prop  메세지 코드 전달 파라메터
         * @param {array<string>} p_codeVal  메세지 코드 전달 파라메터
         * @returns {Error}
         */
        /**
         * 확장오류를 생성합니다.  
         * (ES5 하위 호환성 지원을 위해서 자체 상속방식으로 처리함)
         * @constructs _L.Common.ExtendError
         * @param {string | Regexp} p_msg  메세지코드 또는 메세지
         * @param {ExtendError | object} p_prop  이전 ExtendError 객체 또는 속성타입 오류메세지
         * @param {array<string>} p_codeVal  메세지코드값의 $1, $2 변환 값
         * @example
         * new ExtendError({code:'', ctx: []})
         * new ExtendError(/E0011/, [''])
         */
        function ExtendError(p_msg, p_prop, p_codeVal) {
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
            if (_prop) _build += $buildMessageProp(_prop);
            if (_queue.length > 0) _build += $buildMsgQueue(_queue);
            // var _instance = _super.call(this, _build);
            var _instance = new Error(_build);
            /**
             * 이전에 발생한 message 큐
             * @member {array<string>} _L.Common.ExtendError#queue
             */
            // if (_queue) _instance.queue = _queue;   // 참조 개념 복사 변경 검토 REVIEW:
            // else _instance.queue = [];
            _instance.queue = _queue;
            /**
             * 속성타입 오류 메세지
             * @member {object} _L.Common.ExtendError#prop
             */
            if (_prop) _instance.prop = _prop;
            else _instance.prop = {};
            _instance.queue.push(_msg);
            if (Error.captureStackTrace && !OLD_ENV) {
                Error.captureStackTrace(_instance, ExtendError);
            }
            Object.setPrototypeOf(_instance, Object.getPrototypeOf(this));
            return _instance;
            // inner function 
            function $buildMessageProp(obj) {
                var msg = '';
                for (var prop in obj) {
                    if (typeof obj[prop] === 'string') msg += prop + ' : '+ obj[prop] + '\n';
                    else continue;
                }
                return msg;
            }
            function $buildMsgQueue(queue) {
                var msg = '';
                var queue_cnt = queue.length;
                for (var i = queue_cnt; i > 0; i--) {
                    var mark = '';
                    for (var ii = i; ii <= queue_cnt; ii++) { mark += '#'; }
                    msg += '' + mark + ' '+ queue[i - 1] + '\n';
                }
                return msg;
            }
        }
        ExtendError._NS = 'Common';    // namespace
        ExtendError.prototype = Object.create(Error.prototype, {
            constructor: {
                value: Error,
                enumerable: false,
                writable: true,
                configurable: true,
            },
        });
        ExtendError.prototype.toString = function() {
            return 'ExtendError : ' + this.message;
        };
        // REVIEW: 이부분이 제거 해도 문제 없는게 맞느지 검토해야함
        // if (Object.setPrototypeOf) {
        //     Object.setPrototypeOf(ExtendError, Error);
        // } else {
        //     ExtendError.__proto__ = Error;
        // }
        // Util.inherits(ExtendError, _super);
        return ExtendError;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Common               = _global._L.Common || {};
    _global._L.ExtendError = ExtendError;
    _global._L.Common.ExtendError = ExtendError;
}(typeof window !== 'undefined' ? window : global));
/**** util-type.js _L.Common.Type.- ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation 
    var OLD_ENV = _global.OLD_ENV ? _global.OLD_ENV : false;    // 커버리지 테스트 역활
    var Type = {};  // namespace
    /**
     * object 와 new 생성한 사용자 함수를 제외한 객쳐 여부
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
     * @param {*} obj 
     * @returns {boolean}
     */
    function _isObject(obj)  {  // REVIEW: 정리 필요, 의미적으로 명료하게
        if(typeof obj === 'object' && obj !== null && !_isPrimitiveObj(obj)) {
            return true;
        }
        return false;
    }
    /**
     * 공백객체 인지 확인
     * @param {*} obj 검사대상
     * @returns {boolean}
     */
    function _isEmptyObj(obj)  {
        if(_isObject(obj) && Object.keys(obj).length === 0 && getAllProperties(obj).length === 0) return true;
        return false;
    }
    /**
     * 공백이 아닌 객체 (prototype 및 속성 있는것)
     * @param {*} obj 대상 
     * @returns {boolean}
     */
    function _isFillObj(obj)  {
        if(_isObject(obj) && getAllProperties(obj).length > 0) return true;
        return false;
    }
    /**
     * 내장함수 유무
     * @param {*} obj 
     * @returns {boolean}
     */
    function _isBuiltFunction(obj) {
        if (typeof obj === 'function' && (false 
            || obj === Number || obj === String || obj === Boolean
            || obj === Object || obj === Array || obj === Function
            || obj === RegExp || obj === Date 
            || obj === Symbol || obj === BigInt
        )) return true;
        return false;
    }
    /**
     * 첫문자 대문자 여부
     * @param {string} strValue 
     * @returns {boolean}
     */
    function _isUpper(strValue) {
        var firstStr = strValue.charAt(0);
        if (firstStr === '') return false;
        if(firstStr === firstStr.toUpperCase()) return true;
        else false;
    }
    /**
     * 리터럴 여부  
     * number, string, boolean, bigint, RexExp instance
     * @param {*} obj 
     * @returns {boolean}
     */
    function _isLiteral(obj) {
        if (typeof obj  === 'number') return true;
        if (typeof obj  === 'string') return true;
        if (typeof obj  === 'boolean') return true;
        if (typeof obj  === 'bigint') return true;
        if (obj instanceof RegExp) return true;
    }
    /**
     * 리터럴값 비교  
     * number, string, boolean, bigint, RexExp instance
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
    }
    /**
     * 타임명 얻기
     * @param {*} obj 
     * @returns {string}
     */
    function _typeName(obj) {
        return obj['name'];
    }
    /**
     * kind 코드, 대문자로 얻기 '_any_'...
     * @param {*} val 
     * @returns {string}
     */
    function _getKeyCode(val) {
        var reg = /^_[a-zA-Z]+_/;
        var result;
        if (typeof val !== 'string') return;
        result = reg.exec(val);
        if (result !== null) return result[0].toUpperCase();
    }
    /**
     * 함수 규칙   
     * - (params 내부에는 '()' 입력 금지)  
     * - 참조형 타입 금지 : new Function() 시점에 자동 해석됨  
     * @param {*} funBody 
     * @returns {object}
     */
    function _parseFunc(funBody) {
        var syntax1 = /\([,_\[\]{:}\w\s]*\)\s*(?:=>)?\s*{\s*.*\s*.*\s*}/;    // 제한 규칙
        var syntax2 = /(\(.*\)|\w+)\s*(?:=>).*/;
        var regFunc1 = /(?:function\s)?\(([\[\]{:}\s\w,]*)\)\s*(?:=>)?\s*{(?:\s*return\s+|\s*)?([\[\]{:}\s\w,]*);?\s*}/;
        var regFunc2 = /\(?([\[\]{:}\s\w,]*)\)?\s*(?:=>)\s*{?(?:\s*return\s+|\s*)?([\[\]\s\w,]*);?\s*}?/;
        var arrFunc, arrParam;
        var result = { params: [], return: undefined };
        var arrParam = [];
        var arrRetrun;
        funBody = $skipComment(funBody);
        try {
            if (syntax1.test(funBody)) arrFunc = regFunc1.exec(funBody);
            else if (syntax2.test(funBody)) arrFunc = regFunc2.exec(funBody);
            else throw new ExtendError(/EL01301/, null, [funBody]);
            if (arrFunc === null) throw new ExtendError(/EL01302/, null, [funBody]);
            arrParam = (new Function('return ['+ arrFunc[1] +']'))();
            result['params'] = arrParam;
            if (arrFunc[2] !== '') arrRetrun = (new Function('return '+ arrFunc[2]))()
            result['return'] = arrRetrun;
        } catch (error) {
            throw new ExtendError(/EL01303/, error, ['']);
        }
        return result;
        // inner function
        function $skipComment(body) {    // 주석 제거 comment
            var rBody = body;
            var bloackComment = /\/\*[^](.*?)\*\//g
            var lineComment = /\/\/[^](.*?)(\n|$)/g
            rBody = rBody.replace(bloackComment, '');
            rBody = rBody.replace(lineComment, '');
            return rBody;
        }
    }
    /**
     * 타입 여부
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
     * 전체 프로퍼티를 조회합니다.
     * @memberof _L.Common.Type
     * @param {object} obj  Object를 제외한 프로퍼티 객체 리턴
     * @param {boolean?} hasObj Object를 포함 여부
     * @returns {array<string>}  
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
        } while (cur = Object.getPrototypeOf(cur))
        return allProps;
    };
    Type.getAllProperties = getAllProperties;
    /**
     * 객체를 비교합니다. (proto 제외)
     * @memberof _L.Common.Type
     * @param {any} obj1 
     * @param {any} obj2 
     * @returns {boolean}
     */
    // function deepEqual(obj1, obj2) {
    //     if (obj1 === obj2) return true;
    //     if (typeof obj1 !== typeof obj2) return false;
    //     if ($_isPrimitiveType(obj1) && !(obj1 === obj2)) return false;
    //     if (typeof obj1 === 'function' && !$equalFunction(obj1, obj2)) return false;
    //     if (Array.isArray(obj1)) {
    //         if (obj1.length !== obj2.length) return false;
    //         for (var i = 0; i < obj1.length; i++) {
    //             var val1 = obj1[i];
    //             var val2 = obj2[i];
    //             if (!deepEqual(val1, val2)) return false;
    //         }
    //     } else {
    //         if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    //         for (var key in obj1) {
    //             if (Object.prototype.hasOwnProperty.call(obj1, key)) {
    //                 var val1 = obj1[key];
    //                 var val2 = obj2[key];
    //                 if (!deepEqual(val1, val2)) return false;
    //             }
    //         }
    //     }
    //     return true;
    //     // inner function
    //     function $equalFunction(fun1, fun2) {
    //         // if (typeof fun1 !== 'function') return false;
    //         // if (typeof fun2 !== 'function') return false;
    //         if (fun1 === fun2 || fun1.toString() === fun2.toString()) return true;
    //         return false;
    //     }
    //     function $_isPrimitiveType(obj) {
    //         if (typeof obj === 'string' || typeof obj === 'number' 
    //             || typeof obj === 'boolean' || typeof obj === 'undefined' || typeof obj === 'bigint') return true;
    //         return false;
    //     }
    // }
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
        for (var i = 0; i < keys1.length; i++) {
            var key = keys1[i];
            if (keys2.indexOf(key) === -1 || !deepEqual(obj1[key], obj2[key])) return false;
        }
        return true;
    }
    Type.deepEqual = deepEqual;
    /**
     * 함수 타입을 가져옵니다. (_UNION 포함)  
     * ctor 자신부터 리턴 배열에 push
     * @memberof _L.Common.Type
     * @param {function} ctor 생성자
     * @param {boolean} [hasUnion= true] _UNION 포함 여부
     * @returns {array<function>} 
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
        for (var i = 0; i < arr.length; i++) {
            var idx = tempArr.indexOf(arr[i]);
            if (idx < 0) tempArr.push(arr[i]);
        }
        return tempArr;
        // innner function
        function $getPrototype(ctor) {
            // if (ctor.hasOwnProperty('super')) return ctor.super;
            if (Object.prototype.hasOwnProperty.call(ctor, 'super')) return ctor.super;
            return !OLD_ENV && typeof Object.getPrototypeOf === 'function' ? Object.getPrototypeOf(ctor) : ctor.__proto__;
        }
    }
    Type.getTypes = getTypes;
    /**
     * 함수 타입의 prototype(상속) 타입 여부를 검사합니다.
     * @memberof _L.Common.Type
     * @param {function} ctor 생성자
     * @param {function | string} target 검사 대상
     * @returns {boolean}
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
     * 함수 타입의 prototype(상속) 또는 _UNION 타입 여부를 검사합니다.
     * @memberof _L.Common.Type
     * @param {function} ctor 생성자
     * @param {function | string} target 검사 대상
     * @returns {boolean}
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
     * 확장타입 객체를 얻습니다. (하위 타입 포함)  
     * @memberof _L.Common.Type
     * @param {*} target 
     * @returns {object}
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
        var typeObj = _isObject(target) && target['$type'] ? target : extendType(target);
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
            for(var i = 0; i < obj['params'].length; i++) {
                obj['params'][i] = typeObject(typeObj['params'][i]);
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
            var temp = typeObj['ref'] || typeObj['_prop'];
            var list = getAllProperties(temp);
            for (var i = 0; i < list.length; i++) {
                var key = list[i];
                if ('_interface' === key || 'isImplementOf' === key ) continue;             // 예약어
                obj['_prop'][key] = typeObject(temp[key]);
            }
        }
        return obj;
    };
    Type.typeObject = typeObject;
    /**
     * 확장타입명을 얻습니다.
     * @memberof _L.Common.Type
     * @param {*} target 
     * @returns {string}
     */
    function typeOf(target) {
        return extendType(target)['$type'];
    };
    Type.typeOf = typeOf;
    /**
     * 확장타입을 얻는다.
     * @memberof _L.Common.Type
     * @param {any} target 대상타입
     * @returns {object} 
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
        }
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
                } catch (err) {
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
            } else if (eType['kind'] == '_REQ_') {
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
            for (var i = 0; i < tType['list'].length; i++) {
                var success = false;
                for (var ii = 0; ii < eType['list'].length; ii++) {
                    try {
                        if (success) break;
                        if (extendType(tType['list'][i])['$type'] === 'choice' && extendType(eType['list'][ii])['$type'] !== 'choice' ) {
                            var oriChoice = { $type: 'choice', kind: '_OPT_', list: eType['list'] };
                            _execAllow(oriChoice, tType['list'][i], opt, pathName);
                        } else {
                            _execAllow(eType['list'][ii], tType['list'][i], opt, pathName);
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
                for (var ii = 0; ii < eType['list'].length; ii++) {
                    if (!_isLiteral(eType['list'][ii])) throw new ExtendError(/EL01229/, prop, [ii, extendType(eType['list'][ii])]);
                }
                for (var ii = 0; ii < tType['list'].length; ii++) {
                    if (!_isLiteral(tType['list'][ii])) throw new ExtendError(/EL0122A/, prop, [ii, extendType(tType['list'][ii])]);
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
            for (var i = 0; i < arrTarget.length; i++) {
                var success = false;
                for (var ii = 0; ii < eType['list'].length; ii++) {
                    try {
                        if (success) continue;
                        _execAllow(eType['list'][ii], arrTarget[i], opt, pathName);
                        success = true;
                    } catch (error) {
                        continue;
                    }
                }
                if (!success) throw new ExtendError(/EL0122F/, prop, [i, eType, extendType(arrTarget[i])['$type']]);
            }
        }
        function $classAllow() {
            if (tType['$type'] === 'class') {         // # class to class
                if (isProtoChain(tType['ref'], eType['ref'])) return;   // 1.proto check
                if (opt === 1) {
                    try {
                        // 생성비교
                        var oriObj = new eType['ref']();
                        var tarObj = new tType['ref']();
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
                        var oriObj = new eType['ref']();
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
    };
    /**
     * 타입을 검사하여 메세지를 리턴
     * @param {any} extType 검사할 타입 , extType 
     * @param {any} target 검사대상
     * @param {number} opt 허용옵션 : 0 = 기본, 1 = 타입생성 비교 
     * @param {string?} pathName '' 공백시 성공
     * @returns {throw?}
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
                            _execMatch(_elem, _tar, opt, pathName)
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
            for (var i = 0; i < target.length; i++) {
                var tar = target[i];
                var success = false;
                for (var ii = 0; ii < eType['list'].length; ii++) {
                    try {
                        var elem = eType['list'][ii];
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
                return;
            // _ANY_ (any)
            } else if (eType['kind'] === '_ANY_') {
                if (typeof target !== 'undefined') return;
                throw new ExtendError(/EL01121/, prop, []);
            // _NON_ (none)
            } else if (eType['kind'] === '_NON_') {
                if (typeof target === 'undefined') return;
                throw new ExtendError(/EL01122/, []);
            // _ERR_ (error)
            } else if (eType['kind'] === '_ERR_') {
                if (target instanceof Error) return;
                throw new ExtendError(/EL01123/, []);
            // _REQ_ (require)
            } else if (eType['kind'] === '_REQ_') {
            // _OPT_ (option)
            } else if (eType['kind'] === '_OPT_') {
                if (typeof target === 'undefined') return;
            // _EUN_ (enumeration)
            } else if (eType['kind'] === '_EUM_') {
                for (var ii = 0; ii < eType['list'].length; ii++) {
                    if (!_isLiteral(eType['list'][ii])) throw new ExtendError(/EL01124/, prop, [ii, typeOf(eType['list'][ii])]);
                }
            // _DEF_ (default)
            } else if (eType['kind'] === '_DEF_') {
                if (!_isLiteral(eType['list'][0])) throw new ExtendError(/EL01125/, prop, [typeOf(eType['list'][0])]);
                if (typeof target === 'undefined') {
                    target = eType['list'][0];
                    return;
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
            for (var ii = 0; ii < eType['list'].length; ii++) {
                try {
                    var elem = eType['list'][ii];
                    if (_isLiteral(elem)) {
                        if (_equalLiternal(elem, target)) return;
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
                if (typeof eType['ref'] === 'undefined') return;  // 전역 클래스 타입
                if (isProtoChain(tType['ref'], eType['ref'])) return;
            } else if (typeof target === 'object') {    // # class to typeof 'object'
                if (target instanceof extType) return;     
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
                if ('_interface' === key || 'isImplementOf' === key ) continue;             // 예약어
                // REVIEW: 재귀로 구현 체크
                if (typeof listDefType['default'] !== 'undefined' && listDefType['default'] !== null && typeof target[key] === 'undefined')      // default 설정
                target[key] = listDefType['default'];
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
    };
    /**
     * 확장타입이 대상타입을 허용하는지 검사합니다.
     * @memberof _L.Common.Type
     * @param {any} extType 확장 타입
     * @param {any} tarType 검사 대상 타입
     * @param {number} [opt=0] 허용옵션 : 0 = 기존 유지, 1 = class 타입 생성
     * @returns {throw?} 실패시 예외
     */
    function allowType(extType, tarType, opt) {
        try {
            _execAllow(extType, tarType, opt);
        } catch (error) {
            throw new ExtendError(/EL0130A/, error);
        }
    };    
    Type.allowType = allowType;
    /**
     * 확장타입이 대상과 매치되는지 검사합니다.
     * @memberof _L.Common.Type
     * @param {any} extType 확장 타입
     * @param {any} target 검사 대상
     * @param {number} [opt=0] 허용옵션 : 0 = 기존 유지, 1 = class 타입 생성
     * @returns {throw?} 실패시 예외
     */
    function matchType(extType, target, opt) {
        try {
            _execMatch(extType, target, opt);
        } catch (error) {
            throw new ExtendError(/EL0130B/, error);
        }
    };
    Type.matchType = matchType;
    /**
     * 확장타입이 대상타입을 허용하는지 검사합니다.
     * @memberof _L.Common.Type
     * @param {any} extType 확장 타입
     * @param {any} target 검사 대상 타입
     * @param {number} [opt=0] 허용옵션 : 0 = 기존 유지, 1 = class 타입 생성
     * @returns {boolean} 검사 통과 여부
     */
    function isAllowType(extType, tarType, opt) {
        try {
            _execAllow(extType, tarType, opt);
        } catch (error) {
            return false;
        }
        return true;
    };  
    Type.isAllowType = isAllowType;
    /**
     * 확장타입이 대상과 매치되는지 검사합니다.
     * @memberof _L.Common.Type
     * @param {any} extType 확장 타입
     * @param {any} target 검사 대상
     * @param {number} [opt=0] 허용옵션 : 0 = 기존 유지, 1 = class 타입 생성
     * @returns {boolean} 검사 통과 여부
     */
    function isMatchType(extType, target, opt) {
        try {
            _execMatch(extType, target, opt);
            return true;
        } catch (error) {
            return false;
        }
    };
    Type.isMatchType = isMatchType;
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Common           = _global._L.Common || {};
    _global._L.Type = Type;
    _global._L.Common.Type = Type;
}(typeof window !== 'undefined' ? window : global));
/**** util.js | _L.Common.Util.- ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    var Type                       = _global._L.Type;          
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    //==============================================================
    // 3. module implementation   
    var OLD_ENV = _global.OLD_ENV ? _global.OLD_ENV : false;    // 커버리지 테스트 역활
    var Util = {};  // namespace
    // local function
    function _isObject(obj) {
        return obj != null && typeof obj === 'object';
    }
    // polyfill
    if (!Array.isArray || OLD_ENV) {
        Array.isArray = function(p_obj) {
          return Object.prototype.toString.call(p_obj) === '[object Array]';
        };
    }
    // REVIEW: 제거해둠, 대부분은 keys 는 기본으로 정의되어 있음
    // if (!Object.keys) {
    //     Object.keys = (function () {
    //         var hasOwnProperty = Object.prototype.hasOwnProperty;
    //         var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
    //         var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
    //         var dontEnumsLength = dontEnums.length;
    //         return function (obj) {
    //             if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new Error('Object.keys called on non-object');
    //             var result = [];
    //             for (var prop in obj) if (hasOwnProperty.call(obj, prop)) result.push(prop);
    //             if (hasDontEnumBug) {
    //               for (var i=0; i < dontEnumsLength; i++) {
    //                 if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
    //               }
    //             }
    //             return result;
    //         }
    //     })()
    // };
    /**
     * 배열의 깊이를 가져옵니다.  
     * REVIEW: 필요성 검토 필요!
     * @memberof _L.Common.Util
     * @param {array} p_elem 
     * @param {number} p_depts 
     * @returns {number} 
     */
    Util.getArrayDepth = function getArrayDepth(p_elem, p_depts) {
        var MAX     = 10;
        var level   = 0;
        p_depts = p_depts || 0;
        if (p_elem instanceof Array && MAX > p_depts) {
            level++;
            p_depts++;
            level = level + getArrayDepth(p_elem[0], p_depts);
        }
        return level;
    };
    /**
     * guid 값을 생성합니다. (36자)
     * @memberof _L.Common.Util
     * @returns {string} 예> 'b806a5b5-75f7-a1ba-3736-17f56fb5d65a'
     */
    Util.createGuid = function createGuid() {
        function _p8(s) {  
            var p = (Math.random().toString(16)+'000000000').substring(2,10);  
            return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 8) : p ;  
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    };
    /**
     * 객체를 깊은 복사를합니다. (proto제외)
     * @memberof _L.Common.Util
     * @param {object} p_target 대상 객체
     * @returns {object}
     */
    Util.deepCopy = function deepCopy(p_target) {
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
    }    
    /**
     * superCtor 을 상속합니다.
     * @function
     * @memberof _L.Common.Util
     * @param {function | object} ctor 생성자 또는 생성 객체
     * @param {function | object} superCtor 상속 받을 부모 생성자 또는 객체
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
            }
        }
    }());
    /**
     * ctor 로 생성한 obj 객체의 args<funtion>의 구현 여부를 검사합니다.
     * 종류(ctor._KIND)가 'inteface'이면 allowType(), 아니면 matchType()로 검사한다.
     * @name implements
     * @function
     * @memberof _L.Common.Util
     * @param {function} p_ctor 검사 대상 생성자
     * @param {object} p_obj 검사 대상 인스턴스 객체
     * @param {function?} args 인터페이스들, ctor._UNION 정적 속성으로 설정 가능
     */
    Util.implements = function(p_ctor, p_obj, args) {
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
        for (var i = 0; i < p_ctor['_UNION'].length; i++) {
            if (p_obj._interface.indexOf(p_ctor['_UNION'][i]) < 0) {    // 인터페이스 중복 검사 후 등록
                p_obj._interface.push(p_ctor['_UNION'][i]);
                addCnt++;
            }
        }
        try {
            var beginIdx = p_obj._interface.length - addCnt;
            for (var i = beginIdx; i < p_obj._interface.length; i++) {
                if (p_ctor['_KIND'] === 'interface') {  // 인터페이스 타입과 분리
                    Type.allowType(p_obj._interface[i], p_obj, 1);
                } else Type.matchType(p_obj._interface[i], p_obj, 1);
            }
        } catch (error) { 
            throw new ExtendError(/EL01404/, error, [$typeName(p_obj), $typeName(p_obj._interface[i]), p_ctor['_KIND'] || 'class']);
        }
        if (typeof p_obj.isImplementOf === 'undefined') {   // 내부 메소드 설정
            Object.defineProperty(p_obj, 'isImplementOf',
            {
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
                for (var i = 0; i < this._interface.length; i++) {
                    if (this._interface[i].name === target) return true;  
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
    };
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Common               = _global._L.Common || {};
    _global._L.Util = Util;
    _global._L.Common.Util = Util;
}(typeof window !== 'undefined' ? window : global));
/**** trans-queue.js | _L.Common.EventEmitter ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Util                       = _global._L.Util;              
    //==============================================================Á
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    //==============================================================
    // 3. module implementation  
    var EventEmitter = (function () {
        /**
         * 이벤트 발행 클래스
         * @constructs _L.Common.EventEmitter
         */
        function EventEmitter() {
            var $storage = {};
            var isLog = false;
            /**
             * 리스너 객체 스토리지
             * @private
             * @member {object}  _L.Common.EventEmitter#$subscribers  
             */
            Object.defineProperty(this, '$storage',
            {
                get: function() { return $storage; },
                set: function(nVal) { 
                    if (!_isObject(nVal)) throw new ExtendError(/EL01501/, null, [this.constructor.name, nVal]);
                    $storage = nVal;
                },
                configurable: false,
                enumerable: false
            });
            /**
             * 전체 이벤트명
             * @protected
             * @member {object}  _L.Common.EventEmitter#_list  
             */
            Object.defineProperty(this, '_list',
                {
                    get: function() { 
                        return Object.keys(this.$storage);
                    },
                    configurable: false,
                    enumerable: false
                });
            /**
             * log 출력 여부
             * @member {boolean}  _L.Common.EventEmitter#isLog  
             */
            Object.defineProperty(this, 'isLog', 
            {
                get: function() { return isLog; },
                set: function(nVal) {
                    if (typeof nVal !== 'boolean') throw new ExtendError(/EL01502/, null, [this.constructor.name, nVal]);
                    isLog = nVal;
                }
            });
        }
        EventEmitter._NS = 'Common';    // namespace
        // local function
        function _isString(obj) {    // 공백아닌 문자 여부
            if (typeof obj === 'string' && obj.length > 0) return true;
            return false;
        }
        function _isObject(obj) {    // 객체 여부
            if (typeof obj === 'object' && obj !== null) return true;
            return false;
        }
        /**
         * 이벤트에 대한 리스너(함수)를 추가합니다. 
         * @param {string} p_event 이벤트 명
         * @param {function} p_listener 리스너 함수
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
        EventEmitter.prototype.addListener = EventEmitter.prototype.on; // 별칭
        /**
         * 이벤트에 대한 일회성 함수를 추가합니다. 
         * @param {string} p_event 이벤트 명
         * @param {function} p_listener 리스너 함수
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
         * 지정한 이벤트 의 리스너(함수)를 제거합니다. (이벤트명은 유지)
         * @param {string} p_event 이벤트 명
         * @param {function} p_listener 리스너 함수
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
        EventEmitter.prototype.removeListener = EventEmitter.prototype.off; // 별칭
        /**
         * 전체 이벤트 또는 지정한 이벤트에 등록된 이벤트명과 리스너를 모두 제거합니다.
         * @param {string} [p_event] 이벤트명
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
         * 이벤트명으로 등록된 리스너(함수)를 실행합니다.
         * @param {string} p_event 이벤트명
         * @returns {boolean} 리스너가 실행되었는지 여부
         */
        EventEmitter.prototype.emit = function(p_event) {
            var args = [].slice.call(arguments, 1);
            var listeners;
            var isListener = false;
            if (!_isString(p_event)) throw new ExtendError(/EL01509/, null, [typeof p_event]);
            if (typeof this.$storage[p_event] === 'object') {
                listeners = this.$storage[p_event].slice();
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i].apply(this, args);
                }
                if (listeners.length > 0) isListener = true;
            }
            if (this.isLog) {
                console.log('['+p_event+'] 이벤트가 밸생하였습니다.');
            }
            return isListener;
        };
        return EventEmitter;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Common                   = _global._L.Common || {};
    _global._L.EventEmitter = EventEmitter;
    _global._L.Common.EventEmitter = EventEmitter; 
}(typeof window !== 'undefined' ? window : global));
/**** i-object.js | _L.Interface.IObject ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IObject  = (function () {
        /**
         * 객체 인터페이스 입니다. (최상위)
         * @constructs _L.Interface.IObject 
         * @interface
         */
        function IObject() {
        }
        IObject._NS = 'Interface';    // namespace
        IObject._KIND = 'interface';
        /**
         * 객체 타입들을 얻습니다.
         * @returns {array<any>}
         * @abstract
         */
        IObject.prototype.getTypes  = function() {
            throw new ExtendError(/EL02111/, null, ['IObject']);
        };
        /**
         * 객체의 인스턴스 여부를 확인합니다.
         * @returns {boolean}
         * @abstract
         */
        IObject.prototype.instanceOf  = function() {
            throw new ExtendError(/EL02112/, null, ['IObject']);
        };
        /**
         * 객체와 비교합니다.
         * @returns {boolean}
         * @abstract
         */
        IObject.prototype.equal  = function() {
            throw new ExtendError(/EL02113/, null, ['IObject']);
        };
        return IObject;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface            = _global._L.Interface || {};
    _global._L.IObject = IObject;
    _global._L.Interface.IObject = IObject;
}(typeof window !== 'undefined' ? window : global));
/**** i-marshal.js | _L.Interface.IMarshal ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IMarshal  = (function () {
        /**
         * 객체 통제 인터페이스 입니다.
         * @constructs _L.Interface.IMarshal
         * @interface
         */
        function IMarshal() {
            /**
             * 객체의 고유 식별자
             * @member {string} _L.Interface.IMarshal#_guid
             */
            this._guid = String;
            /**
             * 객체의 타입
             * @member {string} _L.Interface.IMarshal#_type REVIEW:
             */
            this._type = [['_req_', Function, {$type: 'class'} ]];
        }
        IMarshal._NS = 'Interface';    // namespace
        IMarshal._KIND = 'interface';
        /**
         * 대상의 직렬화 객체를 얻습니다.
         * @abstract
         */
        IMarshal.prototype.getObject = function() {
            throw new ExtendError(/EL02121/, null, ['IMarshal']);
        };
        /**
         * 직렬화 객체를 설정합니다.
         * @abstract
         */
        IMarshal.prototype.setObject  = function() {
            throw new ExtendError(/EL02122/, null, ['IMarshal']);
        };
        return IMarshal;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface            = _global._L.Interface || {};
    _global._L.IMarshal = IMarshal;
    _global._L.Interface.IMarshal = IMarshal;
}(typeof window !== 'undefined' ? window : global));
/**** i-colleciton.js | _L.Interface.ICollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    // var Util                       = _global._L.Util;          
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    // if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    //==============================================================
    // 3. module implementation
    var ICollection  = (function () {
        /**
         * 컬렉션 인터페이스 입니다.
         * @constructs _L.Interface.ICollection
         * @interface
         */
        function ICollection() {
        }
        ICollection._KIND = 'interface';
        ICollection._NS = 'Interface';    // namespace
        /**
         * 컬렉션에 요소를 추가합니다.
         * @abstract
         */
        ICollection.prototype.add  = function() {
            throw new ExtendError(/EL02161/, null, ['ICollection']);
        };
        /**
         * 컬렉션에서 요소를 제거합니다.
         * @abstract
         */
        ICollection.prototype.remove  = function() {
            throw new ExtendError(/EL02162/, null, ['ICollection']);
        };
        /**
         * 요소가 컬렉션에 존재하는지 확인합니다.
         * @returns {boolean}
         * @abstract
         */
        ICollection.prototype.contains  = function() {
            throw new ExtendError(/EL02163/, null, ['ICollection']);
        };
        /**
         * 컬렉션에서 요소을 조회합니다.
         * @returns {number}
         * @abstract
         */
        ICollection.prototype.indexOf  = function() {
            throw new ExtendError(/EL02164/, null, ['ICollection']);
        };
        return ICollection;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface            = _global._L.Interface || {};    
    _global._L.ICollection = ICollection;
    _global._L.Interface.ICollection = ICollection;
}(typeof window !== 'undefined' ? window : global));
/**** i-colleciton-property.js | _L.Interface.IPropertyCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    var Util                       = _global._L.Util;          
    var ICollection                = _global._L.ICollection;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!ICollection) throw new Error(Message.get('ES011', ['ICollection', 'i-collection']));
    //==============================================================
    // 3. module implementation   
    var IPropertyCollection  = (function (_super) {
        /**
         * 프로퍼티 컬렉션 인터페이스 입니다.
         * @constructs _L.Interface.IPropertyCollection
         * @interface
         * @extends  _L.Interface.ICollection
         */
        function IPropertyCollection() {
            _super.call(this);
        }
        Util.inherits(IPropertyCollection, _super);
        IPropertyCollection._KIND = 'interface';
        IPropertyCollection._NS = 'Interface';    // namespace
        /**
         * 프로퍼티 키가 존재하는지 확인합니다.
         * @returns {boolean}
         * @abstract
         */
        IPropertyCollection.prototype.indexToKey  = function() {
            throw new ExtendError(/EL02181/, null, ['IPropertyCollection']);
        };
        return IPropertyCollection;
    }(ICollection));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                    = _global._L.Interface || {};
    _global._L.IPropertyCollection = IPropertyCollection;
    _global._L.Interface.IPropertyCollection = IPropertyCollection;
}(typeof window !== 'undefined' ? window : global));
/**** i-element.js | _L.Interface.IElement ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IElement  = (function () {
        /**
         * 요소(독립) 인터페이스 입니다.
         * @constructs _L.Interface.IElement
         * @interface
         */
        function IElement() {
            /**
             * 요소명
             * @member {string} _L.Interface.IElement#_name
             */
            this._name = String;
        }
        IElement._NS = 'Interface';    // namespace
        IElement._KIND = 'interface';
        /**
         * 요소를 복제합니다.
         * @returns {any}
         * @abstract
         */
        IElement.prototype.clone  = function() {
            throw new ExtendError(/EL02131/, null, ['IElement']);
        };
        return IElement;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface            = _global._L.Interface || {};
    _global._L.IElement = IElement;
    _global._L.Interface.IElement = IElement;
}(typeof window !== 'undefined' ? window : global));
/**** i-list.js | _L.Interface.IList ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IList  = (function () {
        /**
         * 목록 인터페이스 입니다.
         * @constructs _L.Interface.IList
         * @interface
         */
        function IList() {
            /**
             * 목록
             * @member {array} _L.Interface.IList#_list
             */
            this._list = Array;
            /**
             * 목록 갯수
             * @member {number} _L.Interface.IList#count
             */
            this.count = Number;
        }
        IList._NS = 'Interface';    // namespace
        IList._KIND = 'interface';
        return IList;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface        = _global._L.Interface || {};
    _global._L.IList = IList;
    _global._L.Interface.IList = IList;
}(typeof window !== 'undefined' ? window : global));
/**** i-control-list.js | _L.Interface.IListControl ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IListControl  = (function () {
        /**
         * 목록 제어 인터페이스 입니다.
         * @constructs _L.Interface.IListControl
         * @interface
         */
        function IListControl() {
        }
        IListControl._NS = 'Interface';    // namespace
        IListControl._KIND = 'interface';
        /**
         * 목록에 대상을 추가합니다.
         * @abstract
         */
        IListControl.prototype.add = function() {
            throw new ExtendError(/EL02151/, null, ['IListControl']);
        };
        /**
         * 목록에서 대상을 삭제합니다.
         * @abstract
         */
        IListControl.prototype.del  = function() {
            throw new ExtendError(/EL02152/, null, ['IListControl']);
        };
        /**
         * 목록에 대상의 존재 여부를 확인합니다.
         * @returns {boolean}
         * @abstract
         */
        IListControl.prototype.has  = function() {
            throw new ExtendError(/EL02153/, null, ['IListControl']);
        };
        /**
         * 목록에서 대상을 찾습니다.
         * @returns {any}
         * @abstract
         */
        IListControl.prototype.find  = function() {
            throw new ExtendError(/EL02154/, null, ['IListControl']);
        };
        return IListControl;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};
    _global._L.IListControl = IListControl;
    _global._L.Interface.IListControl = IListControl;
}(typeof window !== 'undefined' ? window : global));
/**** i-serialize.js | _L.Interface.ISerialize ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var ISerialize  = (function () {
        /**
         * 직렬화 인터페이스 입니다.
         * @constructs _L.Interface.ISerialize
         * @interface
         */
        function ISerialize() {
        }
        ISerialize._NS = 'Interface';    // namespace
        ISerialize._KIND = 'interface';
        /**
         * 내보내기(출력)를 합니다.
         * @returns {any}
         * @abstract
         */
        ISerialize.prototype.output  = function() {
            throw new ExtendError(/EL02191/, null, ['ISerialize']);
        };
        /**
         * 가져오기(로드) 합니다.
         * @abstract
         */
        ISerialize.prototype.load  = function(String) {
            throw new ExtendError(/EL02192/, null, ['ISerialize']);
        };
        return ISerialize;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface            = _global._L.Interface || {};
    _global._L.ISerialize = ISerialize;
    _global._L.Interface.ISerialize = ISerialize;
}(typeof window !== 'undefined' ? window : global));
/**** i-colleciton-array.js | _L.Interface.IArrayCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Util                       = _global._L.Util;              
    var ICollection                = _global._L.ICollection;       
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!ICollection) throw new Error(Message.get('ES011', ['ICollection', 'i-collection']));
    //==============================================================
    // 3. module implementation   
    var IArrayCollection  = (function (_super) {
        /**
         * 배열 컬렉션 인터페이스 입니다.
         * @constructs _L.Interface.IArrayCollection
         * @interface
         * @extends  _L.Interface.ICollection
         */
        function IArrayCollection() {
            _super.call(this);
        }
        Util.inherits(IArrayCollection, _super);
        IArrayCollection._KIND = 'interface';
        IArrayCollection._NS = 'Interface';    // namespace
        /**
         * 요소를 지정위치에 추가합니다.
         * @abstract
         */
        IArrayCollection.prototype.insertAt  = function() {
            throw new ExtendError(/EL02171/, null, ['IArrayCollection']);
        };
        return IArrayCollection;
    }(ICollection));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                    = _global._L.Interface || {};
    _global._L.IArrayCollection = IArrayCollection;
    _global._L.Interface.IArrayCollection = IArrayCollection;
}(typeof window !== 'undefined' ? window : global));
/**** namespace-manager.js | _L.Meta.NamespaceManager ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Type                       = _global._L.Type;              
    var Util                       = _global._L.Util;              
    var IList                      = _global._L.IList;             
    var IListControl               = _global._L.IListControl;      
    var ISerialize                 = _global._L.ISerialize;        
    //==============================================================Á
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!IList) throw new Error(Message.get('ES011', ['IList', 'i-list']));
    if (!IListControl) throw new Error(Message.get('ES011', ['IListControl', 'i-control-list']));
    if (!ISerialize) throw new Error(Message.get('ES011', ['ISerialize', 'i-serialize']));
    //==============================================================
    // 3. module implementation   
    var NamespaceManager = (function () {
        /**
         * 네임스페이스 관리자를 생성합니다.
         * @constructs _L.Meta.NamespaceManager
         */
        function NamespaceManager() {
            var $storage = this.$createNsRefer();
            var _elemTypes  = []; 
            var isOverlap = false;
            /**
             * 내부 변수 접근
             * @member {string} _L.Meta.NamespaceManager#$storage
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$storage',
            {
                get: function() { return $storage; },
                set: function(nVal) { $storage = nVal; },
                configurable: false,
                enumerable: false,
            });
            // /**
            //  * 네임스페이스 저장소
            //  * @member {array} _L.Meta.NamespaceManager#$storage 
            //  * @private
            //  * @readonly
            //  */
            // Object.defineProperty(this, '$storage',
            // {
            //     get: function() { return $storage; },
            //     configurable: false,
            //     enumerable: false
            // });
            /** 
             * 네임스페이스 요소 타입, elemTypes.length == 0 전체허용
             * @member {array<any>}  _L.Meta.NamespaceManager#_elemTypes  
             * @protected
             */
            Object.defineProperty(this, '_elemTypes', 
            {
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
             * 네임스페이스 요소 목록
             * @member {array<string>}  _L.Meta.NamespaceManager#_list
             * @readonly
             */
            Object.defineProperty(this, '_list', 
            {
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
             * 네임스페이스 요소 갯수
             * @member {number} _L.Meta.NamespaceManager#count 
             * @readonly
             */
            Object.defineProperty(this, 'count', 
            {
                get: function() {
                    return this._list.length;
                },
                configurable: false,
                enumerable: true,
            });
            /**
             * 중복 요소 등록 허용 여부, 기본값 = false (중복금지)
             * @member {boolean} _L.Meta.NamespaceManager#isOverlap
             */
            Object.defineProperty(this, 'isOverlap',
            {
                get: function() { return isOverlap; },
                set: function(val) { 
                    if (typeof val !== 'boolean') throw new ExtendError(/EL03311/, null, [typeof val]);
                    isOverlap = val;
                },
                configurable: false,
                enumerable: true
            });
            // inner variable access
            // this.__SET$storage = function(val, call) {
            //     if (call instanceof NamespaceManager) $storage = val;
            // }
            this._$KEYWORD = ['namespace', 'ns', 'NS', '_type'];    // 금지단어
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
            return regex.test(nsName)
        }
        function _validName(sName) {   // 이름 검사
            var regex = /^[_a-zA-Z]([_0-9a-zA-Z])*$/;
            return regex.test(sName)
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
         * 네임스페이스 저장소 초기화 객체를 생성합니다.
         * @returns {object} {_type: 'ns'}
         * @private
         */
        NamespaceManager.prototype.$createNsRefer = function() {
            return { _type: 'ns' };
        };
        /**
         * 네임스페이스 경로객체를 얻습니다.
         * @param {string | object} p_elem 얻을 요소
         * @returns {object} {ns: '..', key: '..'}
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
            if (typeof fullName !== 'string') return;
            arr = fullName.split('.');
            key = arr.pop();
            nsPath = arr.join('.');
            obj['ns'] = nsPath;
            obj['key'] = key;
            return obj;
        };
        /**
         * 네임스페이스를 초기화 합니다.
         */
        NamespaceManager.prototype.init = function() {
            this.$storage = this.$createNsRefer();
        };
        /**
         * 네임스페이스에 경로를 추가합니다.
         * @param {string | array<string>} p_ns 네임스페이스 이름
         */
        NamespaceManager.prototype.addNamespace = function(p_ns) {
            var parent = this.$storage;
            var sections;
            try {
                sections = _getArray(p_ns);
                if (this._$KEYWORD.indexOf(sections[0]) > -1) sections = sections.slice(1); // 최상위 에약어 제거
                for (var i = 0; i < sections.length; i+=1) {
                    var sName = sections[i];
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
         * 네임스페이스에 경로를 삭제합니다.
         * @param {string | array<string>} p_ns 네임스페이스 이름
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
         * 네임스페이스에 경로 객체를 얻습니다.
         * @param {string | array<sting>} p_ns 네임스페이스 이름
         * @returns {object} 경로에 대한 객체
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
                    } else return;
                }
            } catch (error) {
                throw new ExtendError(/EL03323/, error, []);
            }
        };
        /**
         * 네임스페이스의 경로에 요소를 추가합니다.
         * @param {string} p_fullName 네임스페이스 전체 경로명
         * @param {any} p_elem 요소
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
                if (!this.isOverlap && this.getPath(p_elem)) {
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
         * 네임스페이스의 경로에 요소를 삭제합니다.
         * @param {string} p_fullname 네임스페이스 전체 경로명
         * @returns {boolean}
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
            } catch (error) {
                throw new ExtendError(/EL03334/, error, []);
            }
        };
        /**
         * 네임스페이스에 요소가 있는지 확인합니다.
         * @param {string | any} p_elem 경로 | 객체
         * @returns {boolean}
         */
        NamespaceManager.prototype.has = function(p_elem) {
            if (_isString(p_elem) && this.find(p_elem)) return true;
            else if (typeof this.getPath(p_elem) === 'string') return true;
            return false;
        };
        /**
         * 네임스페이스의 경로에 요소를 찾아서 돌려줍니다.
         * @param {string | array<string>} p_fullName 네임스페이스 전체 경로명
         * @returns {(object | function)?}
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
                    } else return;
                }
            } catch (error) {
                return;                
            }
        };
        /**
         * 네임스페이스에 요소로 경로를 얻습니다.  
         * (중복시 첫번째 요소 return)
         * @param {any} p_elem 얻을 객체
         * @returns {string?}
         */
        NamespaceManager.prototype.getPath = function(p_elem) {
            var namespace = this.$storage;
            var stack = [];
            if (!p_elem) throw new ExtendError(/EL03341/, null, [typeof p_elem]);
            if ($findElement(namespace)) {
                return stack.join('.');
            } else return;
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
         * 네임스페이스 저장소를 문자열로 내보냅니다.  
         * 함수를 JSON 으로 출력하기 위해서 별도의 stringify 지정해야합니다.!
         * @param {function?} p_stringify JSON stringify
         * @param {string?} p_space 공백
         * @returns {string} 직렬화한 문자열
         */
        NamespaceManager.prototype.output = function(p_stringify, p_space) {
            var arr = [];
            var obj;
            var str;
            var temp = {list: arr};
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
                if (typeof p_stringify === 'function') str = p_stringify(temp, {space: p_space} );
                else str = JSON.stringify(temp, null, p_space);
                return str;
            } catch (error) {
                throw new ExtendError(/EL03342/, error, [error]);
            }
        };
        /**
         * 문자열을 파싱해서 네임스페이스 저장소로 가져옵니다.  
         * @param {string} p_str 직렬화한 문자열
         * @param {function?} p_parse JSON 파서
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                         = _global._L.Meta || {};
    _global._L.NamespaceManager = NamespaceManager;
    _global._L.Meta.NamespaceManager = NamespaceManager;
}(typeof window !== 'undefined' ? window : global));
/**** meta-registry.js | _L.Meta.MetaRegistry ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Util                       = _global._L.Util;              
    var NamespaceManager           = _global._L.NamespaceManager;  
    //==============================================================Á
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!NamespaceManager) throw new Error(Message.get('ES011', ['NamespaceManager', 'namespace-manager']));
    //==============================================================
    // 3. module implementation       
    var MetaRegistry = (function () {
        /**
         * 메타 객체 등록소입니다. (static)
         * @constructs _L.Meta.MetaRegistry
         * @static
         */
        function MetaRegistry() { 
        }
        MetaRegistry._NS = 'Meta';    // namespace
        // var define
        var _list = [];
        var namespace = new NamespaceManager();
        /**
         * 메타 객체 목록 (참조값)
         * @member {any[]} _L.Meta.MetaRegistry#_list
         * @readonly
         */
        Object.defineProperty(MetaRegistry, "_list", 
        {
            get: function() { 
                var arr = [];
                for (var i = 0; i < _list.length; i++) arr.push(_list[i]);
                return arr;
            },
            configurable: false,
            enumerable: true,
        });
        /**
         * 메타 객체 전체 갯수
         * @member {number} _L.Meta.MetaRegistry#count
         * @readonly
         */
        Object.defineProperty(MetaRegistry, "count", 
        {
            get: function() { return _list.length; },
            configurable: false,
            enumerable: true,
        });        
        /**
         * 메타 객체의 네임스페이스
         * @member {NamespaceManager} _L.Meta.MetaRegistry#namespace
         * @readonly
         */
        Object.defineProperty(MetaRegistry, "namespace", 
        {
            get: function() { return namespace; },
            configurable: false,
            enumerable: true,
        });
        // local function
        function _isBuiltFunction(obj) {    // 내장함수 여부
            if (typeof obj === 'function' && (false 
                || obj === Number || obj === String 
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
        };
        /**
         * 등록된 메타 객체 및 네임스페이스를 초기화 합니다.
         */
        MetaRegistry.init = function() {
            _list.length = 0;
            this.namespace.init();
        };
        /**
         * 메타 객체를 등록하고, 생성자를 네임스페이스에 등록합니다.  
         * - 기존에 객체가 등록되어 있으면 예외가 발생합니다.  
         * - 네임스페이스에 생성자가 없을 경우 등록합니다.
         * @param {MetaObject} p_meta 메타 객체
         */
        MetaRegistry.register = function(p_meta) {
            var _ns;
            var key;
            var type;
            var fullName;
            if (!this.isMetaObject(p_meta)) throw new ExtendError(/EL03211/, null, [p_meta._type, p_meta._guid]);
            if (this.has(p_meta)) throw new ExtendError(/EL03212/, null, [p_meta._guid]);
            _ns         = p_meta['_ns'] || '';
            type        = p_meta['_type'];
            key         = type.name;
            fullName    = p_meta['_ns'] && p_meta['_ns'].length > 0 ?  _ns +'.'+key : key;
            _list.push(p_meta);  // 객체 등록
            this.registerClass(type, _ns, key); // 클래스 등록
        };
        /**
         * 등록소에서 메타 객체를 해제합니다. 
         * @param {MetaObject | string} p_meta 메타 객체 또는 guid
         * @returns {boolean} 성공 여부
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
         * 등록소에 메타 객체 여부를 확인합니다.
         * @param {object | string} p_oGuid  guid 타입의 객체 또는 guid
         * @returns {boolean} 존재 여부
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
         * 등록소에서 메타 객체를 찾습니다.
         * @param {object | string} p_oGuid guid 타입의 객체 또는 guid
         * @returns {MetaObject?}
         */
        MetaRegistry.find = function(p_oGuid) {
            var guid = _isObject(p_oGuid) ? p_oGuid['_guid'] : p_oGuid;
            if (!_isString(guid)) return;
            for(var i = 0; i < _list.length; i++) {
                if (_list[i]['_guid'] === guid) return _list[i];
            }
        };
        /**
         * 매타 객체 여부를 확인합니다.  
         * @param {object} p_target 대상 객체
         * @returns {boolean}
         */
        MetaRegistry.isMetaObject = function(p_target) {
            if (!_isObject(p_target)) return false;
            if (_isString(p_target['_guid']) && typeof p_target['_type'] === 'function') return true;
            return false;
        };
        /**
         * guid 객체에 대한 메타 객체를 생성합니다.
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체
         * @returns {MetaObject}
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
         * guid 객체에 대한 guid 참조를 생성합니다.  
         * @param {MetaObject} p_meta 메타 객체
         * @returns {object} { $ref: 'guid값' }
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
         * target을 네임스페이스에 등록하고, 참조를 생성합니다.
         * 
         * @param {function} p_target 함수 또는 생성자
         * @returns {object} { $ns: string }
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
         * guid 객체에 메타 객체의 guid 를 설정합니다.  
         * - oGuid.$set = meta._guid
         * @param {object} p_oGuid guid 타입의 객체
         * @param {MetaObject} p_meta 
         * @returns {object} oGuid.$set에 설정한 guid값
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
         * guid 객체의 유효성 검사를 합니다.  
         * 1. 객체의 guid 값의 중복 여부 확인합니다.  
         * 2. 객체의 '$ref'을 값으로 가지는 guid 객체의 존재 여부를 확인합니다.  
         * 3. 객체의 '$ns'을 값으로 하는 네임스페이스의 존재 여부를 확인합니다.  
         * 4. 객체의 '_key'와 '_elem' 의 갯수가 같은지 검사합니다.  
         * @param {object} p_oGuid 검사할 guid 객체
         * @returns {boolean} 성공 여부
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
            }
            function $validReference(oGuid) { // 참조 검사
                if (oGuid['$ref'] && !$findGuid(oGuid['$ref'], arrObj)) return false;
                if (oGuid['$set'] && !$findGuid(oGuid['$set'], arrObj)) return false;
                if (oGuid['$ns'] && !_this.getClass(oGuid['$ns'])) return false;
                if (Array.isArray(oGuid)){
                    for(var i = 0; i < oGuid.length; i++) {
                        if (_isObject(oGuid[i]) && !$validReference(oGuid[i])) return false
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
                    for (var ii = 0; ii < arrObj.length; ii++) {
                        if (arrObj[i]['_guid'] === arrObj[ii]['_guid'] && i !== ii) return false; // 중복
                    }
                }
                return true;
            }
        };
        /**
         * guid 객체 여부를 확인합니다.
         * @param {object} p_target 확인 대상
         * @returns {boolean} 
         */
        MetaRegistry.isGuidObject = function(p_target) {
            if (!_isObject(p_target)) return false;
            if (_isString(p_target['_guid']) && _isString(p_target['_type'])) return true;
            return false;
        };
        /**
         * origin 객체에 guid 객체의 포함 여부를 확인합니다.
         * @param {string| object} p_oGuid 확인 대상
         * @param {object | array<object>} p_origin  원본 객체
         * @returns {boolean}
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
                for (var ii = 0; ii < arrObj.length; ii++) {
                    if (arrObj[ii]._guid === guid) return true;
                }
            }
            return false;
        };
        /**
         * guid 객체에 참조타입 요소가 포함되어 있는지 확인힙니다.  
         * - 참조타입 : $ref: '', $ns:''
         * @param {object} p_oGuid 확인 대상
         * @returns {boolean}
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
                        if (_isObject(oGuid[prop]) && $hasRefer(oGuid[prop])) return true
                    }
                }
                return false;
            }
        };     
        /**
         * origin 객체에 설정된 guid 객체를 찾습니다.  
         * 1. guid 객체 내부에서 guid 값의 요소 조회 ?  
         * 2. 조회한 요소의 $set 값을 사용하여  메타객체 저장소헤 대상 객체 조회 ?   
         * @param {string | object} p_oGuid 조회 대상 guid 값 또는  guid 객체
         * @param {object} p_origin 원본 객체
         * @returns {MetaObject}
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
         * guid 객체의 참조요소값을 객체 참조로 변환합니다.  
         * 변환대상 : $ns => [object object]
         * @param {object} p_oGuid 변환할 guid 객체
         * @returns {object} 참조 변환한 oGuid 객체
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
         * 네임스페이스(ns)에 생성자 또는 객체를 등록합니다.  
         * - 중복 검사 후 등록  
         * - 기본제공 함수는 내부 저장하지 않음  
         * @param {function | object} p_target 대상
         * @param {string} p_ns fullname 또는 네임스페이스 
         * @param {string} p_key 대상 이름
         */
        MetaRegistry.registerClass = function(p_target, p_ns, p_key) {
            var fullName;
            if (!(_isObject(p_target) || typeof p_target === 'function')) throw new ExtendError(/EL03231/, null, [typeof p_target]);
            if (p_ns && typeof p_ns !== 'string') throw new ExtendError(/EL03232/, null, [typeof p_ns]);
            if (p_key && !_isString(p_key)) throw new ExtendError(/EL03233/, null, [typeof p_key]);
            if (p_key) fullName = p_ns.length > 0 ? p_ns +'.'+ p_key : p_key;
            else fullName = p_ns;
            if (_isBuiltFunction(p_target)) return;    // 내장함수 제외
            if (typeof _global[fullName] === 'function') return;
            if (!this.namespace.find(fullName)) this.namespace.add(fullName, p_target);  // 중복 검사 후 등록
        };
        /**
         * 네임스페이스(ns)에 생성자 또는 객체를 해제합니다.
         * @param {string} p_fullName 네임스페이스 전체 이름
         * @returns {boolean} 삭제 성공 여부
         */
        MetaRegistry.releaseClass = function(p_fullName) {
            if (!_isString(p_fullName)) throw new ExtendError(/EL03234/, null, [typeof p_fullName]);
            if (typeof _global[p_fullName] === 'function') return true; // 내장함수 & 전역 함수
            return this.namespace.del(p_fullName);
        };
        /**
         * 네임스페이스(ns)에서 생성자 또는 객체를 찾아서 전체 경로를 돌려줍니다.
         * @param {function} p_target 생성자 또는 객체 
         * @returns {string?} 네임스페이스 전체 이름
         */
        MetaRegistry.findClass = function(p_target) {
            var fullName;
            if (typeof p_target !== 'function') throw new ExtendError(/EL03235/, null, [typeof p_target]);
            fullName = p_target.name;
            if (typeof _global[fullName] === 'function') return fullName;   // 내장함수 & 전역 함수
            return this.namespace.getPath(p_target);
        };
        /**
         * 네임스페이스(ns)에서 전체이름에 대한 생성자 또는 객체를 얻습니다.
         * @param {string} p_fullName 전체경로
         * @returns {(object | function)?} 객체 또는 생성자
         */
        MetaRegistry.getClass = function(p_fullName) {
            if (!_isString(p_fullName)) throw new ExtendError(/EL03236/, null, [typeof p_fullName]);
            if (typeof _global[p_fullName] === 'function') return _global[p_fullName];  // 내장함수 & 전역 함수
            return this.namespace.find(p_fullName);
        };
        /**
         * 직렬화한 guid 문자열을 파싱하여 MetaObject 로 불러옵니다.  
         * REVIEW: 필요성 재검토 필요  
         * @param {string} p_str guid 객체를 직렬화한 문자열
         * @param {function?} p_parse JSON 파서
         * @returns {MetaObject} 불러온 MetaObject
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                     = _global._L.Meta || {};
    _global._L.MetaRegistry = MetaRegistry;
    _global._L.Meta.MetaRegistry = MetaRegistry;
}(typeof window !== 'undefined' ? window : global));
/**** meta-object.js | _L.Meta.MetaObject ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Type                       = _global._L.Type;              
    var Util                       = _global._L.Util               
    var IObject                    = _global._L.IObject;           
    var IMarshal                   = _global._L.IMarshal;          
    var MetaRegistry               = _global._L.MetaRegistry;      
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!IObject) throw new Error(Message.get('ES011', ['IObject', 'i-object']));
    if (!IMarshal) throw new Error(Message.get('ES011', ['IMarshal', 'i-marshal']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    //==============================================================
    // 3. module implementation   
    var MetaObject  = (function () {
        /**
         * 메타 최상위 객체를 생성합니다.
         * @constructs _L.Meta.MetaObject
         * @implements {_L.Interface.IObject}
         * @implements {_L.Interface.IMarshal}
         */
        function MetaObject() {
            var _guid;
            var _ns;
            /**
             * 현재 객체의 고유식별자(guid)
             * @readonly
             * @member {string} _L.Meta.MetaObject#_guid 
             * @example
             * var obj = MetaObject();
             * console.log(obj._guid);      // '5337877c-49d6-9add-f35a-7bd31d510d4f' unique key code
             */
            Object.defineProperty(this, '_guid', 
            {
                get: function() { 
                    if (!_guid) _guid = Util.createGuid();
                    return _guid;
                },
                set: function(nVal) { _guid = nVal; },
                configurable: false,
                enumerable: false
            });
            /**
             * 현재 객체의 생성자
             * @readonly
             * @member {function} _L.Meta.MetaObject#_type 
             * @example
             * var obj = new MetaObject();
             * obj._type === MetaObject;        // true
             * console.log(typeof obj._type);   // 'function'
             */
            Object.defineProperty(this, '_type', 
            {
                get: function() { 
                    var proto = this.__proto__ || Object.getPrototypeOf(this);
                    return proto.constructor;
                },
                configurable: false,
                enumerable: false
            });
            Object.defineProperty(this, '_ns', 
            {
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
         * 현재 객체와 target 객체를 비교합니다.  
         * (참조 주소의 비교(===)가 아니고, 속성과 값을 비교,  _guid 값은 비교 제외)  
         * @param {object} p_target 대상 객체
         * @returns {boolean}
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
         * 현재 객체의 생성자와 상위(proto) 생성자를 목록으로 가져옵니다.  
         * @returns {array<function>}
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
         * 현재 객체의 target 인스턴스 여부를 검사합니다 .(_UNION 포함)
         * @param {function | string} p_target 함수명 또는 생성자
         * @returns {boolean}
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
                for (var i = 0; i < unionTypes.length; i++) {
                    if (fun ===  unionTypes[i]) return true;
                }
                return false;
            }
            function $$findFunctionName(funName) {
                var types = _this.getTypes();
                for (var i = 0; i < types.length; i++) {
                    if (funName === types[i].name) return true;
                }
                for (var i = 0; i < unionTypes.length; i++) {
                    if (funName === unionTypes[i].name) return true;
                }
                return false;
            }
        };
        Object.defineProperty(MetaObject.prototype, 'instanceOf', {
            enumerable: false
        });
        /**
         * 현재 객체를 직렬화(guid 타입) 객체로 얻습니다.  
         * (순환참조는 $ref 값으로 대체된다.)  
         * @param {number} [p_vOpt=0] 가져오기 옵션
         * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
         * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
         * - opt=2 : 비침조 구조(_guid:No,  $ref:No)   
         * @param {object | array<object>} [p_owned={}] 현재 객체를 소유하는 상위 객체들
         * @returns {object}  guid 타입 객체
         * @example
         * a.getObject(2) == b.getObject(2)   
         */
        MetaObject.prototype.getObject = function(p_vOpt, p_owned) {
            var vOpt = p_vOpt || 0;
            var obj = {};
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            if (vOpt < 2 && vOpt > -1) obj['_guid'] = this._guid;
            obj['_type'] = this._type._NS ? this._type._NS +'.'+ this._type.name : this._type.name;
            return obj;                        
        };
        Object.defineProperty(MetaObject.prototype, 'getObject', {
            enumerable: false
        });
        /**
         * 직렬화(guid 타입) 객체를 현재 객체에 설정합니다.  
         * (객체는 초기화 된다.)
         * @param {object} p_oGuid 직렬화 할 guid 타입의 객체
         * @param {object} [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체  
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.MetaObject = MetaObject;
    _global._L.Meta.MetaObject = MetaObject;
}(typeof window !== 'undefined' ? window : global));
/**** meta-element.js | _L.Meta.MetaElement ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Util                       = _global._L.Util;              
    var MetaObject                 = _global._L.MetaObject;        
    var IElement                   = _global._L.IElement;          
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!IElement) throw new Error(Message.get('ES011', ['IElement', 'i-element']));
    if (!MetaObject) throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    //==============================================================
    // 3. module implementation   
    var MetaElement  = (function (_super) {
        /**
         * 메타 요소 객체를 생성합니다.  
         * (독립체 사용 단위)
         * @constructs _L.Meta.MetaElement
         * @extends _L.Meta.MetaObject
         * @implements {_L.Interface.IElement}
         * @param {string} p_name 
         */
        function MetaElement(p_name) {
            _super.call(this);
            var _name;
            // /**
            //  * 내부 변수 접근
            //  * @member {string} _L.Meta.MetaElement#$name
            //  * @readonly
            //  * @private
            //  */
            // Object.defineProperty(this, '$name',
            // {
            //     get: function() { return _name; },
            //     set: function(nVal) { 
            //         if (typeof nVal !== 'string') throw new ExtendError(/EL03121/, null, [typeof val]);
            //         if (nVal.length === 0) throw new ExtendError(/EL03122/, null, []);
            //         _name = nVal;
            //     },
            //     configurable: false,
            //     enumerable: false,
            // });
            /**
             * 현재 객체의 이름
             * @readonly
             * @member {string} _L.Meta.MetaElement#_name
             */
            Object.defineProperty(this, '_name',
            {
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
        }
        Util.inherits(MetaElement, _super);
        MetaElement._UNION = [IElement];
        MetaElement._NS = 'Meta';           // namespace
        MetaElement._PARAMS = ['name'];     // creator parameter
        /**
         * 현재 객체를 직렬화(guid 타입) 객체로 얻습니다.  
         * (순환참조는 $ref 값으로 대체된다.)  
         * @param {number} [p_vOpt=0] 가져오기 옵션
         * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
         * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
         * - opt=2 : 비침조 구조(_guid:No,  $ref:No)   
         * @param {object | array<object>} [p_owned={}] 현재 객체를 소유하는 상위 객체들
         * @returns {object}  guid 타입 객체
         * @example
         * a.getObject(2) == b.getObject(2)   
         */
        MetaElement.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            obj['name'] = this._name;
            return obj;
        };
        Object.defineProperty(MetaElement.prototype, 'getObject', {
            enumerable: false
        });
        /**
         * 직렬화(guid 타입) 객체를 현재 객체에 설정합니다.  
         * (객체는 초기화 된다.)
         * @param {object} p_oGuid 직렬화 할 guid 타입의 객체
         * @param {object} [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체  
         */
        MetaElement.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            this._name = p_oGuid['name'];
            // this.__SET$_name(p_oGuid['name'], this);
        };
        Object.defineProperty(MetaElement.prototype, 'setObject', {
            enumerable: false
        });
        /**
         * 현제 객체를 복제합니다.
         * @returns {MetaElement}
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.MetaElement = MetaElement;
    _global._L.Meta.MetaElement = MetaElement;
}(typeof window !== 'undefined' ? window : global));
/**** base-collection.js | _L.Collection.BaseCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Type                       = _global._L.Type;              
    var Util                       = _global._L.Util;              
    var EventEmitter               = _global._L.EventEmitter;      
    var ICollection                = _global._L.ICollection;       
    var IList                      = _global._L.IList;             
    var MetaRegistry               = _global._L.MetaRegistry;      
    var MetaObject                 = _global._L.MetaObject;        
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!EventEmitter) throw new Error(Message.get('ES011', ['EventEmitter', 'event-emitter']));
    if (!ICollection) throw new Error(Message.get('ES011', ['ICollection', 'i-collection']));
    if (!IList) throw new Error(Message.get('ES011', ['IList', 'i-list']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaObject) throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    //==============================================================
    // 3. module implementation
    var BaseCollection  = (function (_super) {
        /**
        * 기본 컬렉션을 생성합니다.
        * @abstract
        * @extends _L.Meta.MetaObject
        * @constructs _L.Collection.BaseCollection
        * @implements {_L.Interface.ICollection}
        * @implements {_L.Interface.IList}
        * @param {object} [p_owner] 소유객체
        */
        function BaseCollection(p_owner) { 
            _super.call(this);
            // private variable
            var $event = new EventEmitter();
            var $elements = [];
            var $descriptors = [];
            var $KEYWORD = [];
            // protected variable
            var _owner ;
            var _elemTypes  = [];
            /** 
             * 이벤트 객체입니다.
             * @private
             * @member {EventEmitter} _L.Collection.BaseCollection#$event  
             */
            Object.defineProperty(this, '$event', 
            {
                get: function() { return $event; },
                configurable: false,
                enumerable: false,
            });
            /**
             * 컬렉션 요소들입니다.
             * @private
             * @member {string} _L.Meta.Entity.BaseColumn#$elements
             */
            Object.defineProperty(this, '$elements',
            {
                get: function() { return $elements; },
                set: function(nVal) { $elements = nVal; },
                configurable: false,
                enumerable: false,
            });
            /**
             * 컬렉션 요소의 기술자들 (getter, setter)입니다.
             * @private
             * @member {string} _L.Meta.Entity.BaseColumn#$descriptors
             */
            Object.defineProperty(this, '$descriptors',
            {
                get: function() { return $descriptors; },
                set: function(nVal) { $descriptors = nVal; },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 예약어입니다.
             * @private
             * @member {array<string>}  _L.Collection.BaseCollection#$KEYWORD
             */
            Object.defineProperty(this, '$KEYWORD', 
            {
                get: function() { return $KEYWORD; },
                set: function(newVal) { $KEYWORD = $KEYWORD.concat(newVal); },  // REVIEW: 예약어 중복
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 소유자입니다.
             * @protected 
             * @member {object} _L.Collection.BaseCollection#_owner  
             */
            Object.defineProperty(this, '_owner', 
            {   
                get: function() { return _owner; },
                set: function(val) { _owner = val; },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 요소의 타입 제약조건입니다.
             * @protected 
             * @member {array<any>}  _L.Collection.BaseCollection#_elemTypes  
             */
            Object.defineProperty(this, '_elemTypes', 
            {
                get: function() { return _elemTypes; },
                set: function(val) {
                    var arrType = Array.isArray(val) ? val : Array.prototype.slice.call(arguments, 0);
                    var reg = /^_[a-zA-Z]+_/;
                    var arr1 = arrType.length > 0 && typeof arrType[0] === 'string' ? arrType[0] : '';
                    // var result;
                    if (arrType.length > 0  && reg.exec(arr1) === null) arrType = ['_req_'].concat(arrType);
                    // result = reg.exec(val);
                    // if (result !== null) return result[0].toUpperCase();
                    _elemTypes = arrType;
                },
                configurable: false,
                enumerable: false,
            });
            /**
             * 컬렉션 요소의 목록입니다.
             * @protected 
             * @readonly
             * @member {array}  _L.Collection.BaseCollection#_list  
             */
            Object.defineProperty(this, '_list', 
            {
                get: function() {
                    var arr = [];
                    for (var i = 0; i < $elements.length; i++) arr.push(this.$elements[i]);
                    return arr;
                },
                configurable: false,
                enumerable: false,
            });
            /**
             * 컬렉션 요소의 갯수입니다.
             * @readonly
             * @member {number} _L.Collection.BaseCollection#count 
             */
            Object.defineProperty(this, 'count', 
            {
                get: function() { return this.$elements.length; },
                enumerable: false,
                configurable: false
            });
            /**
             * 컬렉션 요소의 갯수입니다.
             * @readonly
             * @member {number} _L.Collection.BaseCollection#length 
             */
            Object.defineProperty(this, 'length', 
            {
                get: function() { return this.$elements.length; },
                enumerable: false,
                configurable: false
            });
            /**
             * 컬렉션 요소를 추가 전에 발생하는 이벤트 입니다.
             * @event _L.Collection.BaseCollection#onAdd
             * @param {function}    p_callback
             * @param {number}      p_callback.p_idx 삭제하는 index
             * @param {any}         p_callback.p_elem 삭제하는 value
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onAdd', 
            {
                set: function(fun) { this.$event.on('add', fun); },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 요소를 추가한 후에 발생하는 이벤트입니다.
             * @event _L.Collection.BaseCollection#onAdded
             * @param {function}    p_callback
             * @param {number}      p_callback.p_idx 삭제하는 index
             * @param {any}         p_callback.p_elem 삭제하는 value
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onAdded', 
            {
                set: function(fun) { this.$event.on('added', fun); },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 요소를 삭제하기 전에 발생하는 이벤트입니다.
             * @event _L.Collection.BaseCollection#onRemove
             * @param {function}    p_callback
             * @param {number}      p_callback.p_idx 삭제하는 index
             * @param {any}         p_callback.p_elem 삭제하는 value
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onRemove', 
            {
                set: function(fun) { this.$event.on('remove', fun); },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 요소를 삭제한 후에 발생하는 이벤트입니다.
             * @event _L.Collection.BaseCollection#onRemoved
             * @param {function}    p_callback
             * @param {number}      p_callback.p_idx 삭제하는 index
             * @param {any}         p_callback.p_elem 삭제하는 value
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onRemoved', 
            {
                set: function(fun) { this.$event.on('removed', fun); },
                configurable: false,
                enumerable: false,
            });
            /** 
             *컬렉션을 초기화하기 전에 발생하는 이벤트입니다.
             * @event _L.Collection.BaseCollection#onClear
             * @param {function}    p_callback
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onClear', 
            {
                set: function(fun) { this.$event.on('clear', fun); },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션을 초기화한 후에 발생하는 이벤트입니다.
             * @event _L.Collection.BaseCollection#onCleared
             * @param {function}    p_callback
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onCleared', 
            {
                set: function(fun) { this.$event.on('cleared', fun); },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 요소를 변경하기 전에 발생하는 이벤트 입니다.
             * @event _L.Collection.BaseCollection#onChanging 
             * @param {function}    p_callback
             * @param {number}      p_callback.p_idx 삭제하는 index
             * @param {any}         p_callback.p_elem 삭제하는 value
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onChanging', 
            {
                set: function(fun) { this.$event.on('changing', fun); },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 요소를 변경한 후에 발생하는 이벤트 입니다.
             * @event _L.Collection.BaseCollection#onChanged 
             * @param {function}    p_callback
             * @param {number}      p_callback.p_idx 삭제하는 index
             * @param {any}         p_callback.p_elem 삭제하는 value
             * @param {this}        p_callback.p_this 현재 컬렉션
             */
            Object.defineProperty(this, 'onChanged', 
            {
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
        }
        Util.inherits(BaseCollection, _super);
        BaseCollection._UNION = [ICollection, IList];
        BaseCollection._NS = 'Collection';
        BaseCollection._PARAMS = ['_owner'];
        BaseCollection._KIND = 'abstract';
        /**
         * onAdd 이벤트를 발생시킵니다.
         * @param {number} p_idx 인덱스 번호
         * @param {any} p_elem 요소
         * @listens _L.Collection.BaseCollection#onAdd
         */
        BaseCollection.prototype._onAdd = function(p_idx, p_elem) {
            this.$event.emit('add', p_idx, p_elem, this); 
        };
        Object.defineProperty(BaseCollection.prototype, '_onAdd', {
            enumerable: false
        });
        /**
         * onAdded 이벤트를 발생시킵니다.
         * @param {number} p_idx 인덱스 번호
         * @param {any} p_elem 요소
         * @listens _L.Collection.BaseCollection#onAdded
         */
        BaseCollection.prototype._onAdded = function(p_idx, p_elem) {
            this.$event.emit('added', p_idx, p_elem, this); 
        };
        Object.defineProperty(BaseCollection.prototype, '_onAdded', {
            enumerable: false
        });
        /**
         * onRemove 이벤트를 발생시킵니다.
         * @param {number} p_idx 인덱스 번호
         * @param {any} p_elem 요소
         * @listens _L.Collection.BaseCollection#onRemove
         */
        BaseCollection.prototype._onRemove = function(p_idx, p_elem) {
            this.$event.emit('remove', p_idx, p_elem, this);
        };
        Object.defineProperty(BaseCollection.prototype, '_onRemove', {
            enumerable: false
        });
        /**
         * onRemoved 이벤트를 발생시킵니다.
         * @param {number} p_idx 인덱스 번호
         * @param {any} p_elem 요소
         * @listens _L.Collection.BaseCollection#onRemoved
         */
        BaseCollection.prototype._onRemoved = function(p_idx, p_elem) {
            this.$event.emit('removed', p_idx, p_elem, this);
        };
        Object.defineProperty(BaseCollection.prototype, '_onRemoved', {
            enumerable: false
        });
        /** 
         * onClear 이벤트를 발생시킵니다.
         * @listens _L.Collection.BaseCollection#onClear
         */
        BaseCollection.prototype._onClear = function() {
            this.$event.emit('clear', this); 
        };
        Object.defineProperty(BaseCollection.prototype, '_onClear', {
            enumerable: false
        });
        /** 
         * onCheared 이벤트를 발생시킵니다.
         * @listens _L.Collection.BaseCollection#onCleared
         */
        BaseCollection.prototype._onCleared = function() {
            this.$event.emit('cleared', this); 
        };
        Object.defineProperty(BaseCollection.prototype, '_onCleared', {
            enumerable: false
        });
        /** 
         * onChanging 이벤트를 발생시킵니다.
         * @param {number} p_idx 인덱스 번호
         * @param {any} p_elem 요소
         * @listens _L.Collection.BaseCollection#onChanging
         */
        BaseCollection.prototype._onChanging = function(p_idx, p_elem) {
            this.$event.emit('changing', p_idx, p_elem, this); 
        };
        Object.defineProperty(BaseCollection.prototype, '_onChanging', {
            enumerable: false
        });
        /** 
         * onChanged 이벤트를 발생시킵니다.
         * @param {number} p_idx 인덱스 번호
         * @param {any} p_elem 요소
         * @listens _L.Collection.BaseCollection#onChanged
         */        
        BaseCollection.prototype._onChanged = function(p_idx, p_elem) {
            this.$event.emit('changed', p_idx, p_elem, this); 
        };
        Object.defineProperty(BaseCollection.prototype, '_onChanged', {
            enumerable: false
        });
        /**
         * 컬렉션에 요소를 추가할 때 설정되는 기본 기술자입니다.
         * @protected
         * @param {number} p_idx 인덱스 번호
         */
        BaseCollection.prototype._getPropDescriptor = function(p_idx, p_enum) {
            if (typeof p_enum !== 'boolean') p_enum = true;
            return {
                get: function() { return this.$elements[p_idx]; },
                set: function(nVal) {
                    if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], nVal);
                    this._onChanging(p_idx, nVal);  // before event
                    this.$elements[p_idx] = nVal;
                    this._onChanged(p_idx, nVal);   // after event
                },
                configurable: true,
                enumerable: p_enum,
            };
        };
        Object.defineProperty(BaseCollection.prototype, '_getPropDescriptor', {
            enumerable: false
        });
        /** 
         * 컬렉션의 요소를 삭제합니다. (내부 사용)
         * @abstract 
         */
        BaseCollection.prototype._remove  = function() {
            throw new ExtendError(/EL04111/, null, []);
        };
        Object.defineProperty(BaseCollection.prototype, '_remove', {
            enumerable: false
        });
        /**
         * 컬렉션 객체를 직렬화(guid 타입) 객체로 반환합니다.  
         * (순환참조는 $ref 값으로 대체된다.)  
         * @param {number} [p_vOpt=0] 가져오기 옵션
         * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
         * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
         * - opt=2 : 비침조 구조(_guid:No,  $ref:No)   
         * @param {object | array<object>} [p_owned={}] 현재 객체를 소유하는 상위 객체들
         * @returns {object}  guid 타입 객체
         * @example
         * a.getObject(2) == b.getObject(2)   
         */
        BaseCollection.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
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
         * 직렬화(guid 타입) 객체를 컬렉션 객체에 설정합니다.  
         * (객체는 초기화 된다.)
         * @param {object} p_oGuid 직렬화 할 guid 타입의 객체
         * @param {object} [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체  
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
         * 컬렉션에 요소를 삭제합니다.
         * @param {any} p_elem 요소
         * @returns {number} 삭제한 인덱스 번호
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
         * 컬렉션에서 지정된 위치의 요소를 삭제합니다.
         * @param {number} p_pos 인덱스 번호
         * @returns {boolean} 처리 결과  
         */
        BaseCollection.prototype.removeAt = function(p_pos) {
            var elem;
            if (typeof p_pos !== 'number') throw new ExtendError(/EL04113/, null, [typeof p_pos]);
            if (p_pos < 0 ) return false;
            elem = this.$elements[p_pos];
            if (this.$elements.length > p_pos) {
                this._onRemove(p_pos, elem);
                if (!this._remove(p_pos)) return false;
                this._onRemoved(p_pos, elem);
                return true;
            }
            return false;
        };
        Object.defineProperty(BaseCollection.prototype, 'removeAt', {
            enumerable: false
        });
        /**
         * 요소가 컬렉션에 존재하는지 확인합니다.
         * @param {any} p_elem 요소
         * @returns {boolean}
         */
        BaseCollection.prototype.contains = function(p_elem) {
            return this.$elements.indexOf(p_elem) > -1;
        };
        Object.defineProperty(BaseCollection.prototype, 'contains', {
            enumerable: false
        });
        /**
         *  컬렉션에서 요소를 조회합니다.
         * @param {any} p_elem 요소
         * @returns {number} 0 보다 작으면 존재하지 않음
         */
        BaseCollection.prototype.indexOf = function(p_elem) {
            return this.$elements.indexOf(p_elem);
        };
        Object.defineProperty(BaseCollection.prototype, 'indexOf', {
            enumerable: false
        });
        /**
         * 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환합니다.
         * @param {Function} callback 콜백함수 (currentValue, index, array) => any[]
         * @param {any} thisArg 콜백함수에서 this 로 사용됩니다.
         * @returns  {Array}
         */
        BaseCollection.prototype.map  = function(callback, thisArg) {
            var newArr = [];
            if (typeof callback != 'function') throw new ExtendError(/EL04116/, null, [typeof callback]);
            for (var i = 0; i < this.length; i++) {
                newArr[i] = callback.call(thisArg || this, this[i], i, this);
            }
            return newArr;
        };
        Object.defineProperty(BaseCollection.prototype, 'map', {
            enumerable: false
        });
        /**
         * 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링 합니다
         * @param {Function} callback 콜백함수 (currentValue, index, array) => any[]
         * @param {any} thisArg 콜백함수에서 this 로 사용됩니다.
         * @returns  {Array}
         */
        BaseCollection.prototype.filter = function (callback, thisArg) {
            let newArr = [];
            if (typeof callback != 'function') throw new ExtendError(/EL04117/, null, [typeof callback]);
            for (let i = 0; i < this.length; i++) {
                if (callback.call(thisArg || this, this[i], i, this)) {
                    newArr.push(this[i]);
                }
            }
            return newArr;
        };
        Object.defineProperty(BaseCollection.prototype, 'filter', {
            enumerable: false
        });
        /**
         * 각 요소에 대해 주어진 리듀서 (reducer) 함수를 실행하고, 하나의 결과값을 반환합니다.
         * @param {Function} callback 콜백함수 (accumulator, currentValue, index, array) => any
         * @param {any} initialValue 초기값을 제공하지 않으면 배열의 첫 번째 요소를 사용합니다.
         * @returns  {any}
         */
        BaseCollection.prototype.reduce = function(callback, initialValue) {
            var acc = initialValue;
            if (typeof callback != 'function') throw new ExtendError(/EL04118/, null, [typeof callback]);
            for(let i=0; i < this.length; i++) {
                acc = acc ? callback(acc, this[i], i, this) : this[i];
            }
            return acc;
        }
        Object.defineProperty(BaseCollection.prototype, 'reduce', {
            enumerable: false
        });
        /**
         * 제공된 테스트 함수를 만족하는 첫 번째 요소를 반환합니다
         * @param {Function} callback 콜백함수 (currentValue, index, array) => any
         * @param {any} thisArg 콜백함수에서 this 로 사용됩니다.
         * @returns  {any}
         */
        BaseCollection.prototype.find = function(callback, thisArg) {
            if (typeof callback != 'function') throw new ExtendError(/EL04119/, null, [typeof callback]);
            for (var i = 0; i < this.length; i++) {
              if ( callback.call(thisArg || this, this[i], i, this) ) {
                return this[i];
              }
            }
        };
        Object.defineProperty(BaseCollection.prototype, 'find', {
            enumerable: false
        });
        /**
         * 각 요소에 대해 제공된 함수를 한 번씩 실행합니다.
         * @param {Function} callback 콜백함수 (currentValue, index, array) => void
         * @param {any} thisArg 콜백함수에서 this 로 사용됩니다.
         */
        BaseCollection.prototype.forEach = function(callback, thisArg) {
            if (typeof callback != 'function') throw new ExtendError(/EL041110/, null, [typeof callback]);
            for (var i = 0; i <this.length; i++) {
              callback.call(thisArg || this, this[i], i, this);
            }
        };
        Object.defineProperty(BaseCollection.prototype, 'forEach', {
            enumerable: false
        });
        /**
         * 어떤 요소라도 주어진 판별 함수를 적어도 하나라도 통과하는지 테스트합니다. 
         * @param {Function} callback 콜백함수 (currentValue, index, array) => boolean
         * @param {any} thisArg 콜백함수에서 this 로 사용됩니다.
         * @returns  {boolean}
         */
        BaseCollection.prototype.some = function(callback, thisArg) {
            if (typeof callback != 'function') throw new ExtendError(/EL041111/, null, [typeof callback]);
            for(var i=0; i < this.length; i++){
                if (callback.call(thisArg || this, this[i], i, this)) return true;
            }
            return false;
        };
        Object.defineProperty(BaseCollection.prototype, 'some', {
            enumerable: false
        });
        /**
         * 모든 요소가 제공된 함수로 구현된 테스트를 통과하는지 테스트합니다. 
         * @param {Function} callback 콜백함수 (currentValue, index, array) => boolean
         * @param {any} thisArg 콜백함수에서 this 로 사용됩니다.
         * @returns  {boolean}
         */
        BaseCollection.prototype.every = function(callback, thisArg) {
            if (typeof callback != 'function') throw new ExtendError(/EL041112/, null, [typeof callback]);
            for(var i=0; i < this.length; i++){
                if (!callback.call(thisArg || this, this[i], i, this)) return false;
              }
              return true;
        };
        Object.defineProperty(BaseCollection.prototype, 'every', {
            enumerable: false
        });
        /**
         * 주어진 판별 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스를 반환합니다. 
         * @param {Function} callback 콜백함수 (currentValue, index, array) => number
         * @param {any} thisArg 콜백함수에서 this 로 사용됩니다.
         * @returns  {any}
         */
        BaseCollection.prototype.findIndex = function(callback, thisArg) {
            if (typeof callback != 'function') throw new ExtendError(/EL041113/, null, [typeof callback]);
            for (var i = 0; i < this.length; i++) {
              if ( callback.call(thisArg || this, this[i], i, this) ) {
                return i;
              }
            }
            return -1;
        };
        Object.defineProperty(BaseCollection.prototype, 'findIndex', {
            enumerable: false
        });
        /** 
         * 컬렉션에 요소를 추가합니다.
         * @abstract 
         */
        BaseCollection.prototype.add  = function() {
            throw new ExtendError(/EL04114/, null, []);
        };
        Object.defineProperty(BaseCollection.prototype, 'add', {
            enumerable: false
        });
        /**
         * 컬렉션을 초기화 합니다.
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Collection           = _global._L.Collection || {};
    _global._L.BaseCollection = BaseCollection;
    _global._L.Collection.BaseCollection = BaseCollection;
}(typeof window !== 'undefined' ? window : global));
/**** collection-array.js | _L.Collection.ArrayCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Type                       = _global._L.Type;              
    var Util                       = _global._L.Util;              
    var IArrayCollection           = _global._L.IArrayCollection;  
    var BaseCollection             = _global._L.BaseCollection;    
    var MetaObject                 = _global._L.MetaObject;        
    var MetaRegistry               = _global._L.MetaRegistry;      
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!IArrayCollection) throw new Error(Message.get('ES011', ['IArrayCollection', 'i-collection-array']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaObject) throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (!BaseCollection) throw new Error(Message.get('ES011', ['BaseCollection', 'base-collection']));
    //==============================================================
    // 3. module implementation
    var ArrayCollection  = (function (_super) {
        /**
         * 배열 컬렉션을 생성합니다.
         * @constructs _L.Collection.ArrayCollection
         * @implements {_L.Interface.IArrayCollection}
         * @extends _L.Collection.BaseCollection
         * @param {object} [p_owner] 소유 객체
         */
        function ArrayCollection(p_owner) {
            _super.call(this, p_owner);
            this.$KEYWORD = ['insertAt'];
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
         * 배열 컬렉션의 요소를 삭제합니다.(템플릿메소드패턴)
         * @protected
         * @param {number} p_pos 인덱스 위치
         * @returns {boolean}
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
         * 배열 컬렉션 객체를 직렬화(guid 타입) 객체로 얻습니다.  
         * (순환참조는 $ref 값으로 대체된다.)  
         * @param {number} [p_vOpt=0] 가져오기 옵션
         * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
         * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
         * - opt=2 : 비침조 구조(_guid:No,  $ref:No)   
         * @param {object | array<object>} [p_owned={}] 현재 객체를 소유하는 상위 객체들
         * @returns {object}  guid 타입 객체
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
            for (var i = 0; i < this.$elements.length; i++) {
                var elem = this.$elements[i];
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
         * 직렬화(guid 타입) 객체를 배열 컬렉션 객체에 설정합니다.  
         * (객체는 초기화 된다.)
         * @param {object} p_oGuid 직렬화 할 guid 타입의 객체
         * @param {object} [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체  
         */
        ArrayCollection.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            if (Array.isArray(p_oGuid['_desc']) && p_oGuid['_desc'].length > 0) {
                for (var i = 0; i < p_oGuid['_desc'].length; i++) {
                    this.$descriptors.push(p_oGuid['_desc'][i]);
                }
            }
            for(var i = 0; i < p_oGuid['_elem'].length; i++) {
                Object.defineProperty(this, [i], this._getPropDescriptor(i));
            }
            for(var i = 0; i < p_oGuid['_elem'].length; i++) {
                var elem = p_oGuid['_elem'][i];
                if (MetaRegistry.isGuidObject(elem)) {
                    var obj = MetaRegistry.createMetaObject(elem, origin);
                    obj.setObject(elem, origin);
                    this.$elements.push(obj);
                } else if (elem['$ref']) {
                    var meta = MetaRegistry.findSetObject(elem['$ref'], origin);
                    if (!meta) throw new ExtendError(/EL04211/, null, [i, elem['$ref']]);
                    this.$elements.push(meta);  
                } else this.$elements.push(elem);
            }
        };        
        Object.defineProperty(ArrayCollection.prototype, 'setObject', {
            enumerable: false
        });
        /**
         * 배열 컬렉션에 요소를 추가합니다.
         * @param {any} p_elem 요소
         * @param {object} [p_desc] 프로퍼티 기술자 객체
         * @returns {number} 추가한 인덱스
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
         * 배열 컬렉션을 초기화 합니다.
         * 대상 : _element =[], _descriptors = []  
         */
        ArrayCollection.prototype.clear = function() {
            this._onClear();    // event
            for (var i = 0; i < this.count; i++) delete this[i];
            this.$elements = [];
            this.$descriptors = [];
            this._onCleared();    // event
        };
        Object.defineProperty(ArrayCollection.prototype, 'clear', {
            enumerable: false
        });
        /**
         * 배열 컬렉션의 지정위치에 요소를 추가합니다.
         * @param {number} p_pos 인덱스 위치
         * @param {any} p_elem 요소
         * @param {object} [p_desc] 프로퍼티 기술자 객체
         * @returns {boolean} 
         */
        ArrayCollection.prototype.insertAt = function(p_pos, p_elem, p_desc) {
            try {
                var index   = this.count;
                if (typeof p_pos !== 'number') throw new ExtendError(/EL04212/, null, [typeof p_pos]);
                if (index < p_pos) throw new ExtendError(/EL04213/, null, [p_pos, index]);
                if (p_pos < 0) throw new ExtendError(/EL04214/, null, [p_pos]);
                if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], p_elem);
                if (_isObject(p_desc) && p_desc.configurable === false) {
                    Message.warn('WS011', ['configurable = false', 'element']); 
                }
                if (_isObject(p_desc) && p_desc.writable === false ) {
                    Message.warn('WS011', ['writable = false', 'element']);
                }
                this._onAdd(p_pos, p_elem);
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
                this._onAdded(p_pos, p_elem);
                return true;
            } catch (error) {
                throw new ExtendError(/EL04215/, error, [p_pos, p_elem]);
            }
        };
        Object.defineProperty(ArrayCollection.prototype, 'insertAt', {
            enumerable: false
        });
        return ArrayCollection;
    }(BaseCollection));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Collection           = _global._L.Collection || {};
    _global._L.ArrayCollection = ArrayCollection;
    _global._L.Collection.ArrayCollection = ArrayCollection;
}(typeof window !== 'undefined' ? window : global));
/**** collection-property.js | _L.Collection.PropertyCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Type                       = _global._L.Type;                  
    var Util                       = _global._L.Util;                  
    var IPropertyCollection        = _global._L.IPropertyCollection;   
    var BaseCollection             = _global._L.BaseCollection;        
    var MetaObject                 = _global._L.MetaObject;            
    var MetaRegistry               = _global._L.MetaRegistry;          
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!IPropertyCollection) throw new Error(Message.get('ES011', ['IPropertyCollection', 'i-collection-property']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaObject) throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (!BaseCollection) throw new Error(Message.get('ES011', ['BaseCollection', 'base-collection']));
    //==============================================================
    // 3. module implementation   
    var PropertyCollection  = (function (_super) {
        /**
         * 프로퍼티 컬렉션을 생성합니다.
         * @constructs _L.Collection.PropertyCollection
         * @implements {_L.Interface.IPropertyCollection}
         * @extends _L.Collection.BaseCollection
         * @param {object} p_owner 소유 객체
         */
        function PropertyCollection(p_owner) {
            _super.call(this, p_owner); 
            var $keys = [];
            /**
             * 내부 변수 접근
             * @member {string} _L.Collection.PropertyCollection#$keys
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$keys',
            {
                get: function() { return $keys; },
                set: function(nVal) { $keys = nVal; },
                configurable: false,
                enumerable: false,
            });
            // /** 
            //  * 컬렉션 요소의 키값들
            //  * @readonly
            //  * @member {array<string>} _L.Collection.PropertyCollection#_keys 
            //  */
            // Object.defineProperty(this, '_keys',
            // {
            //     get: function() {
            //         var arr = [];
            //         for (var i = 0; i < _keys.length; i++) arr.push(_keys[i]);
            //         return arr;
            //     },
            //     configurable: false,
            //     enumerable: false
            // });
            // 예약어 등록 
            this.$KEYWORD = ['$keys', 'indexOf', 'exist', 'indexToKey'];
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
         * 컬렉션의 요소를 삭제합니다.(템플릿메소드패턴)
         * @protected
         * @param {number} p_pos 인덱스 위치
         * @returns {boolean} 
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
         * 프로퍼티 컬렉션 객체를 직렬화(guid 타입) 객체로 얻습니다.  
         * (순환참조는 $ref 값으로 대체된다.)  
         * @param {number} [p_vOpt=0] 가져오기 옵션
         * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
         * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
         * - opt=2 : 비침조 구조(_guid:No,  $ref:No)   
         * @param {object | array<object>} [p_owned={}] 현재 객체를 소유하는 상위 객체들
         * @returns {object}  guid 타입 객체
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
            for (var i = 0; i < this.count; i++) {
                var elem = this.$elements[i];
                if (elem instanceof MetaObject) {
                    if (MetaRegistry.hasGuidObject(elem, owned)) {
                        obj['_elem'].push(MetaRegistry.createReferObject(elem));
                    } else obj['_elem'].push(elem.getObject(vOpt, owned));
                } else obj['_elem'].push(elem);
            }
            obj['_key'] = [];
            for (var i = 0; i < this.$keys.length; i++) {
                var key = this.$keys[i];
                obj['_key'].push(key);
            }
            return obj;                        
        };
        Object.defineProperty(PropertyCollection.prototype, 'getObject', {
            enumerable: false
        });
        /**
         * 직렬화(guid 타입) 객체를 프로퍼티 컬렉션 객체에 설정합니다.  
         * (객체는 초기화 된다.)
         * @param {object} p_oGuid 직렬화 할 guid 타입의 객체
         * @param {object} [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체  
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
            for(var i = 0; i < p_oGuid['_key'].length; i++) {
                var key = p_oGuid['_key'][i];
                this.$keys.push(key);
                Object.defineProperty(this, [i], this._getPropDescriptor(i, false));
                Object.defineProperty(this, key, this._getPropDescriptor(i));
            }
            for(var i = 0; i < p_oGuid['_elem'].length; i++) {
                var elem = p_oGuid['_elem'][i];
                if (MetaRegistry.isGuidObject(elem)) {
                    var obj = MetaRegistry.createMetaObject(elem, origin);
                    obj.setObject(elem, origin);
                    this.$elements.push(obj);
                } else if (elem['$ref']) {
                    var meta = MetaRegistry.findSetObject(elem['$ref'], origin);
                    if (!meta) throw new ExtendError(/EL04223/, null, [i, elem['$ref']]);
                    this.$elements.push(meta);
                } else this.$elements.push(elem);
            }
        };
        Object.defineProperty(PropertyCollection.prototype, 'setObject', {
            enumerable: false
        });
        // /**
        //  * 프로퍼티 컬렉션의 인덱스 값을 조회합니다.
        //  * @param {string | any} p_target 키 또는 요소
        //  * @param {boolean} [p_isKey=false] 키로 조회 여부
        //  * @returns {number} 없을시 -1
        //  */
        // PropertyCollection.prototype.indexOf = function(p_target, p_isKey) {
        //     var isKey = p_isKey || false;
        //     if (!isKey) return this.$elements.indexOf(p_target);
        //     else {
        //         if (!_isString(p_target))  throw new ExtendError(/EL04224/, null, [typeof p_target]);
        //         return this.$keys.indexOf(p_target);
        //     }
        // };
        /**
         * 프로퍼티 컬렉션에 요소를 추가합니다.
         * @param {string} p_key 키
         * @param {any} [p_elem] 요소
         * @param {object} [p_desc] 기술자
         * @returns {number} index 번호
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
                if (this.exist(p_key)) throw new ExtendError(/EL04228/, null, [p_key]);
                if (this._elemTypes.length > 0) Type.matchType([this._elemTypes], p_elem);
                // if (this._elemTypes.length > 0) Util.matchType(types, p_elem);
                if (_isObject(p_desc) && p_desc.configurable === false) {
                        Message.warn('WS011', ['configurable = true', 'element']);
                }
                if (_isObject(p_desc) && p_desc.writable === false ) {
                    Message.warn('WS011', ['writable = true', 'element']);
                }
                this._onAdd(index, p_elem);
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
                this._onAdded(index, p_elem);
                return index;
            } catch (error) {
                throw new ExtendError(/EL04229/, error, [p_key, p_elem]);
            }
        };
        Object.defineProperty(PropertyCollection.prototype, 'add', {
            enumerable: false
        });
        /**
         * 프로러티 컬렉션을 초기화 합니다.
         * - 대상 : _element = [], _descriptors = [], _keys = []  
         * - 이벤트는 초기화 되지 않습니다.
         */
        PropertyCollection.prototype.clear = function() {
            this._onClear();
            for (var i = 0; i < this.count; i++) {
                var propName = this.indexToKey(i);
                delete this[i];
                delete this[propName];
            }
            this.$elements = [];
            this.$descriptors = [];
            this.$keys = [];
            this._onCleared();
        };
        Object.defineProperty(PropertyCollection.prototype, 'clear', {
            enumerable: false
        });
        /**
         * 프로퍼티 컬렉션키의 인덱스 값을 조회합니다.
         * @param {string} p_key 키
         * @returns {number} 없을시 -1
         */
        PropertyCollection.prototype.keyToIndex = function(p_key) {
            if (!_isString(p_key))  throw new ExtendError(/EL04224/, null, [typeof p_key]);
            return this.$keys.indexOf(p_key);
        };
        Object.defineProperty(PropertyCollection.prototype, 'keyToIndex', {
            enumerable: false
        });
        /**
         * 프로퍼티 컬렉션의 인덱스에 대한 키값을 조회합니다.
         * @param {number} p_idx 인덱스 값
         * @returns {string}
         */
        PropertyCollection.prototype.indexToKey = function(p_idx) {
            if (typeof p_idx !== 'number') throw new ExtendError(/EL0422A/, null, [typeof p_idx]);
            return this.$keys[p_idx];
        };
        Object.defineProperty(PropertyCollection.prototype, 'indexToKey', {
            enumerable: false
        });
        /**
         * 프로퍼티 컬렉션의 키 존재하는지 확인합니다.
         * @param {string} p_key 키
         * @returns {boolean}
         */
        PropertyCollection.prototype.exist = function(p_key) {
            if (!_isString(p_key)) throw new ExtendError(/EL0422B/, null, [typeof p_key]);
            return Object.prototype.hasOwnProperty.call(this, p_key);
        };
        Object.defineProperty(PropertyCollection.prototype, 'exist', {
            enumerable: false
        });
        return PropertyCollection;
    }(BaseCollection));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Collection                   = _global._L.Collection || {};
    _global._L.PropertyCollection = PropertyCollection;
    _global._L.Collection.PropertyCollection = PropertyCollection;
}(typeof window !== 'undefined' ? window : global));
/**** message-code.js | _L.messageCode.entity ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    //==============================================================
    // 2. module dependency check
    //==============================================================
    var messageCode = {
        en: {},
        ko: {
            // Interface.*
            // i-control-export.js
            EL02210: '',
            EL02211: 'write(opt): object 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-control-import.js
            EL02220: '',
            EL02221: 'read(object) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-control-group.js
            EL02230: '',
            EL02231: 'merge(any, opt) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02232: 'copy(filter) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-control-schema.js
            EL02240: '',
            EL02241: 'readSchema(json) 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02242: 'writeSchema(opt): object 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-transaction.js
            EL02250: '',
            EL02251: 'acceptChanges() 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            EL02252: 'rejectChanges() 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // Meta.Entity.*
            EL05100: '',
            // BaseColumn
            EL05110: '',
            EL05111: '$1._entity 값이 [MetaElement] 인스턴스가 아닙니다.',
            EL05112: '$1.columnName 는 \'string\' 타입입니다. typeof columnName = \'$2\'',
            EL05113: '기존에 $1.columnName \'$2\'이 존재합니다.',
            EL05114: '기존에 $1.alias \'$2\'이 존재하여 columnName 을 설정할 수 없습니다.',
            EL05115: '$1.alias 는 \'string\' 타입입니다. typeof alias = \'$2\'',
            EL05116: '기존에 $1.alias \'$2\'이 존재합니다.',
            EL05117: '$1.caption 는 \'string\' 타입입니다. typeof caption = \'$2\'',
            EL05118: 'setObject(oGuid, origin); oGuid.[\'_entity\'] guid 를 찾을 수 없습니다. name = $1, guid = $2' ,
            EL05119: 'clone() 은 추상메소드 입니다. 상속해서 구현해야 합니다.',
            // ObjectColumn
            EL05120: '',
            EL05121: '_load(prop); prop 는 \'object\' 타입입니다. typeof prop = \'$2\'',
            EL05122: 'setObject(oGuid, origin); oGuid.[\'default\'] guid 를 찾을 수 없습니다. guid = $1' ,
            EL05123: 'setObject(oGuid, origin); oGuid.[\'value\'] guid 를 찾을 수 없습니다. guid = $1' ,
            // MetaColumn
            EL05130: '',
            EL05131: '$1.required 는 \'boolean\' 타입입니다. typeof required = \'$2\'',
            EL05132: '$1.isNullPass 는 \'boolean\' 타입입니다. typeof isNullPass = \'$2\'',  //  TODO: 제거됨
            EL05133: '$1.constraints 의 배열 요소는 \'function\' | {regex: RegExp, msg: string} 타입입니다. typeof [$2].regex = \'$3\', [$2].msg = \'$4\'',
            EL05134: '$1.getter 는 \'function\' 타입입니다. typeof getter = \'$2\'',
            EL05135: '$1.setter 는 \'function\' 타입입니다. typeof setter = \'$2\'',
            EL05136: 'addConstraint(regex, msg, code, condition); regex 는 RegExp 인스턴스가 아닙니다.',
            EL05137: 'addConstraint(regex, msg, code, condition); msg 는 \'string\' 타입입니다. typeof msg = \'$1\'',
            // BaseColumnCollection
            EL05140: '',
            EL05141: '$1._baseType 는 \'function\' 타입입니다. typeof getter = \'$2\'',
            EL05142: '$1._baseType [BaseColumn]의 prototype 이 연결되어 있어야 합니다.(상속)',
            EL05143: 'add(name, vlaue); _onwer 의 rows 가 존재하여 columnColleciton 을 추가할 수 없습니다. _onwer.rows.count = $1',
            EL05144: 'add(name, vlaue); $1 에 \'$2\' 존재하여 추가할 수 없습니다.',
            EL05145: 'add(name, vlaue); $1 에 alias \'$2\'이 존재하여 추가할 수 없습니다.',
            EL05146: 'removeAt(idx); _onwer 의 rows 가 존재하여 columnColleciton 을 제거할 수 없습니다. _onwer.rows.count  = $1',
            EL05147: 'addValue(name, value) 은 추상메소드 입니다. 구현해야 합니다.',
            // MetaTableColumnCollection
            EL05150: '',
            EL05151: 'add(any); any 는 \'string\' | [BaseColumn] 타입입니다. typeof any = $1',
            EL05152: 'addValue(name, value); name 은 \'string\' 타입입니다. typeof name = $1',
            // MetaViewColumnCollection
            EL05160: '',
            EL05161: 'add(any, refCol); refCol 값이 [BaseColumnCollection] 타입이 아닙니다.',
            EL05162: 'add(any, refCol); any 는 \'string\' | [BaseColumn] 타입입니다. typeof any = $1',
            EL05163: 'addValue(name, value, refCol); name 은 \'string\' 타입입니다. typeof name = $1',
            EL05164: 'addEntity(entity); entity 값이 [BaseEntity] 타입이 아닙니다.',
            // 
            EL05200: '',
            // MetaRow
            EL05210: '',
            EL05211: '$1.constructor(entity) 값이 [BaseEntity] 타입이 아닙니다.',
            EL05212: 'setObject(oGuid, origin); oGuid[\'_elem\'].length = $1 길이와 oGuid[\'_key\'].length = $2 길이가 서로 다릅니다.',
            EL05213: 'setObject(oGuid, origin); oGuid[\'_elem\'][$1] guid 를 찾을 수 없습니다. guid = $2',
            // MetaRowCollection
            EL05220: '',
            EL05221: 'target의 _entity 객체와 $1._onwer 객체가 같이야 합니다.',
            EL05222: 'insertAt(pos, row, isCheck); row 는 [MetaRow] 타입이 아닙니다.',
            EL05223: 'insertAt(pos, row, isCheck); row 의 _entity 객체와 $1._onwer 객체가 같이야 합니다.',
            EL05224: 'insertAt(pos, row, isCheck); row[$1] 의 유효성 검사(valid)가 실패하였습니다. fail msg = \'$2\'',
            // base-entity.js
            EL05300: '',
            // property
            EL05310: '',
            EL05311: '$1._mestaset 값은 [MetaSet] 타입이 아닙니다.',
            EL05312: '$1.columns 속성을 재정의해야 합니다.',
            // private method :: _buildEntity, _readEntity, _readSchema - 14
            EL05320: '',
            EL05321: '_buildEntity(entity, cb, items); items[$1] 가 \'string\' 타입이 아닙니다. typeof items[$1] = $2',
            EL05322: '_buildEntity(entity, cb, items); this.columns 에 \'$1\' 컬럼명이 존재하여 추가할 수 없습니다.',
            EL05323: '_buildEntity(entity, cb, items); entity 에 대한 row 생성이 실패하였습니다.',
            EL05324: '_readEntity(entity, opt); entity 가 [BaseEntity] 타입이 아닙니다.',
            EL05325: '_readEntity(entity, opt); opt 가 \'number\' 타입이 아닙니다. typeof opt = $1',
            EL05326: '_readEntity(entity, opt); entity 읽기가 실패하였습니다. opt = $1',
            EL05327: '_readEntity(entity, opt); this.rows 가 존재하여 컬럼을 load 할 수 없습니다. opt = $1',
            EL05328: '_readEntity(entity, opt); this.columns 에 \'$1\' 컬럼명이 존재하여 추가할 수 없습니다.',
            EL05329: '_readSchema(obj, isRow, origin); obj._baseEntity guid를 찾을 수 없습니다. guid = $1',
            EL0532A: '_readSchema(obj, isRow, origin); 스키마 읽기가 실패하였습니다.',
            EL0532B: '_readSchema(obj, isRow, origin); this.rows 가 존재하여 컬럼을 추가 할 수 없습니다.',
            EL0532C: '_readSchema(obj, isRow, origin); this.columns[$1] guid를 찾을 수 없습니다. guid = $2',
            EL0532D: '_readSchema(obj, isRow, origin); this.columns[$1]._entity guid를 찾을 수 없습니다. guid = $2',
            EL0532E: '_readSchema(obj, isRow, origin); this.columns 에 \'$1\' 컬럼명이 존재하여 추가할 수 없습니다.',
            // method :: transformSchema(static), setValue, clone, select - 7, 예외 없음 : getValue, clear, reset, newRow, getObject, setObject
            EL05330: '',
            EL05331: 'BaseEntity.transformSchema(oGuid); oGuid 는 스키마 객체가 아닙니다. oGuid = {columns: $1, rows: $2}',
            EL05332: 'BaseEntity.transformSchema(oGuid); 스키마 변환이 실패하였습니다.',
            EL05333: 'setValue(row); row 가 [MetaRow] 타입이 아닙니다.',
            EL05334: 'setValue(row); columns 에 row 설정이 실패하였습니다.',
            EL05335: 'select(filter, ...); MetaRegistry.namespace 에서 \'$1\' 가져오는데 싪패하였습니다.',
            EL05336: 'select(filter, ...); 조회가 실패하였습니다.',
            EL05337: 'clone() 은 추상메소드 입니다. 구현해야 합니다.',
            EL05338: 'validate(); 모든 컬럼이 MetaColumn 타입일 경우 유효성 검사를 수행할 수 있습니다. ',
            // merge, copy - 8
            EL05340: '',
            EL05341: 'merge(target, opt, isMath); target 이 [BaseEntity] 타입이 아닙니다.',
            EL05342: 'merge(target, opt, isMath); opt 이 \'number\' 타입이 아닙니다. typeof opt = $1',
            EL05343: 'merge(target, opt, isMath); opt = 1, target.columns[$1].name = \'$2\' 이 column name 에 존재합니다.',
            EL05344: 'merge(target, opt, isMath); opt = 1, target.columns[$1].name = \'$2\' 이 column alias 에 존재합니다.',
            EL05345: 'merge(target, opt, isMath); opt = 3, target.columns[$1].name = \'$2\' 이 columns name 에 존재합니다.',
            EL05346: 'merge(target, opt, isMath); opt = 3, target.columns[$1].name = \'$2\' 이 columns alias 에 존재합니다.',
            EL05347: 'merge(target, opt, isMath); 병합이 실패하였습니다. opt = $1',
            EL05348: 'copy() 은 추상메소드 입니다. 구현해야 합니다.',
            // load, read, readSchema, readDate - 12
            EL05350: '',
            EL05351: 'load(obj, parse); [BaseEntity] 타입의 obj 는 로드할 수 없습니다.',
            EL05352: 'load(obj, parse); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL05353: 'load(obj, parse); 로드가 실패하였습니다.',
            EL05354: 'read(obj, opt); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL05355: 'read(obj, opt); opt 이 \'number\' 타입이 아닙니다. typeof opt = $1',
            EL05356: 'read(obj, opt); opt 값은 범위(1 ~ 3)가 아닙니다. obj = $1',
            EL05357: 'read(obj, opt); 읽기가 실패하였습니다.',
            EL05358: 'readSchema(obj, isCreate, origin); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL05359: 'readSchema(obj, isCreate, origin); obj 는 스키마 객체가 아닙니다. obj = {columns: $1, rows: $2}',
            EL0535A: 'readSchema(obj, isCreate, origin); 스카미 읽기가 실패하였습니다.',
            EL0535B: 'readData(obj); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL0535C: 'readData(obj); obj 는 스키마 객체가 아닙니다. obj = {columns: $1, rows: $2}',
            EL0535D: 'readData(obj); 데이터 읽기가 실패하였습니다.',
            // output, write, writeSchema, writeData
            EL05360: '',
            EL05361: '',
            //
            EL05400: '',
            // MetaTable
            EL05410: '',
            EL05411: '$1.tableName 값은 \'string\' 타입이 아닙니다. typeof tableName = $2',
            EL05412: '$1.columns 값이 [MetaTableColumnCollection] 타입이 아닙니다.',
            EL05413: '$1.rows 존재하여 columns 을 설정할 수 없습니다. rows.count = $2',
            EL05414: 'setObject(oGuid, origin); oGuid.[\'_metaSet\'] guid 를 찾을 수 없습니다. guid = $1',
            // MetaTableColleciton
            EL05420: '',
            EL05421: '$1._baseType 값은 function 타입이 아닙니다. typeof _baseType = $2',
            EL05422: '$1._baseType [MetaTable]의 prototype 이 연결되어 있어야 합니다.(상속)',
            EL05423: 'add(any); any 는 \'string\' | [MetaTable] 타입만 가능합니다. typeof any = $1',
            EL05424: 'add(any); tableName = \'$1\'이 기존에 존재합니다.',
            // MetaView
            EL05430: '',
            EL05431: '$1.viewName 값은 \'string\' 타입이 아닙니다. typeof viewName = $2',
            EL05432: '$1.columns 값은 [MetaViewColumnCollection] 타입이 아닙니다.',
            EL05433: '$1.rows 존재하여 columns 을 설정할 수 없습니다. rows.count = $2',
            EL05434: '$1._baseEntity 값은 [BaseEntity] 타입이 아닙니다.',
            EL05435: 'setObject(oGuid, origin); oGuid.[\'_metaSet\'] guid 를 찾을 수 없습니다. guid = $1' ,
            EL05436: 'setObject(oGuid, origin); oGuid.[\'_baseEntity\'] guid 를 찾을 수 없습니다. guid = $1' ,
            // MetaViewColleciton
            EL05440: '',
            EL05441: '$1._baseType 값은 \'function\' 타입이 아닙니다. typeof _baseType = $2',
            EL05442: '$1._baseType [MetaView]의 prototype 이 연결되어 있어야 합니다.(상속)',
            EL05443: 'add(obj, baseEntity); [MetaView] 타입의 obj와  baseEntity 를 동시에 입력할 수 없습니다.',
            EL05444: 'add(obj, baseEntity); baseEntity 는 [BaseEntity] 타입이 아닙니다.',
            EL05445: 'add(obj, baseEntity); obj 는 \'string\' | [MetaView] 타입만 가능합니다. typeof obj = $1',
            EL05446: 'add(obj, baseEntity); viewName = \'$1\'이 기존에 존재합니다.',
            // MetaSet
            EL05450: '',
            EL05451: '$1.setName 값은 \'string\' 타입이 아닙니다. typeof setName = $2',
            EL05452: '$1.autoChanges 값은 \'boolean\' 타입이 아닙니다. typeof setName = $2',
            EL05453: 'MetaSet.transformSchema(oGuid); oGuid 는 스키마 객체가 아닙니다. oGuid = {tables: .., views: ..}',
            EL05454: 'load(obj, parse); [MetaSet] 타입의 obj 는 로드할 수 없습니다.',
            EL05455: 'load(obj, parse); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL05456: 'read(obj, opt); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL05457: 'read(obj, opt); opt 이 \'number\' 타입이 아닙니다. typeof opt = $1',
            EL05458: 'readSchema(obj, isCreate); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL05459: 'readSchema(obj, isCreate); obj 는 스키마 객체가 아닙니다. obj = {tables: $1, views: $2}',
            EL0545A: 'readData(obj); obj 가 \'object\' 타입이 아닙니다.(null제외) typeof obj = $1',
            EL0545B: 'readData(obj); obj 는 스키마 객체가 아닙니다. obj = {tables: $1, views: $2}',
            // Warn
            WS011: '[$1] 대상 [$2]는 삭제 할 수 없습니다.',
        }
    };
    //==============================================================
    // 4. module export
    // create namespace
    _global._L                      = _global._L || {};
    _global._L.messageCode          = _global._L.message || {};
    _global._L.messageCode.entity   = messageCode;
}(typeof window !== 'undefined' ? window : global));
/**** message.js | _L.Common.Message ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                = _global._L.Message;                       
    var messageCode            = _global._L.messageCode.entity;            
    //==============================================================
    // 2. module dependency check
    //==============================================================
    // 3. module implementation       
    Message.$storage = messageCode;
    //==============================================================
    // 4. module export
}(typeof window !== 'undefined' ? window : global));
/**** i-control-export.js | _L.Interface.IExportControl ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IExportControl  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IExportControl
         * @interface
         */
        function IExportControl() {
        }
        IExportControl._NS = 'Interface';    // namespace
        IExportControl._KIND = 'interface';
        /**
         * 대상을 내보냅니다. (쓰기)
         * @returns {any}
         * @abstract
         */
        IExportControl.prototype.write  = function() {
            throw new ExtendError(/EL02211/, null, ['IExportControl']);
        };
        return IExportControl;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};
    _global._L.IExportControl = IExportControl;
    _global._L.Interface.IExportControl = IExportControl;
}(typeof window !== 'undefined' ? window : global));
/**** i-control-group.js | _L.Interface.IGroupControl ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IGroupControl  = (function () {
        /**
         * 그룹 제어 인터페이스 입니다.
         * @constructs _L.Interface.IGroupControl
         * @interface
         */
        function IGroupControl() {
        }
        IGroupControl._NS = 'Interface';    // namespace
        IGroupControl._KIND = 'interface';
        /**
         * 병합합니다.
         * @abstract
         */
        IGroupControl.prototype.merge  = function() {
            throw new ExtendError(/EL02231/, null, ['IGroupControl']);
        };
        /**
         * 복사합니다.
         * @returns {any}
         * @abstract
         */
        IGroupControl.prototype.copy  = function() {
            throw new ExtendError(/EL02232/, null, ['IGroupControl']);
        };
        return IGroupControl;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};
    _global._L.IGroupControl = IGroupControl;
    _global._L.Interface.IGroupControl = IGroupControl;
}(typeof window !== 'undefined' ? window : global));
/**** i-control-import.js | _L.Interface.IImportControl ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IImportControl  = (function () {
        /**
         * 가져오기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IImportControl
         * @interface
         */
        function IImportControl() {
        }
        IImportControl._NS = 'Interface';    // namespace
        IImportControl._KIND = 'interface';
        /**
         * 대상을 가져옵니다. (읽기)
         * @abstract
         */
        IImportControl.prototype.read  = function() {
            throw new ExtendError(/EL02221/, null, ['IImportControl']);
        };
        return IImportControl;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};
    _global._L.IImportControl = IImportControl;
    _global._L.Interface.IImportControl = IImportControl;
}(typeof window !== 'undefined' ? window : global));
/**** i-control-schema.js | _L.Interface.ISchemaControl ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var ISchemaControl  = (function () {
        /**
         * 스키마 제어 인터페이스 입니다.
         * @constructs _L.Interface.ISchemaControl
         * @interface
         */
        function ISchemaControl() {
        }
        ISchemaControl._NS = 'Interface';    // namespace
        ISchemaControl._KIND = 'interface';
        /**
         * 스키마를 가져옵니다.
         * @abstract
         */
        ISchemaControl.prototype.readSchema  = function() {
            throw new ExtendError(/EL02241/, null, ['ISchemaControl']);
        };
        /**
         * 스키마를 내보냅니다. 
         * @returns {any}
         * @abstract
         */
        ISchemaControl.prototype.writeSchema  = function() {
            throw new ExtendError(/EL02242/, null, ['ISchemaControl']);
        };
        return ISchemaControl;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};
    _global._L.ISchemaControl = ISchemaControl;
    _global._L.Interface.ISchemaControl = ISchemaControl;
}(typeof window !== 'undefined' ? window : global));
/**** i-transaction.js | _L.Interface.ITransaction ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var ITransaction  = (function () {
        /**
         * 트렌젝션 인터페이스 입니다.
         * @constructs _L.Interface.ITransaction
         * @interface
         */
        function ITransaction() {
        }
        ITransaction._NS = 'Interface';    // namespace
        ITransaction._KIND = 'interface';
        /**
         * 변경을 수락합니다. (commit)
         * @abstract
         */
        ITransaction.prototype.acceptChanges  = function() {
            throw new ExtendError(/EL02251/, null, ['ITransaction']);
        };
        /**
         * 변경을 거부합니다. (rollback)
         * @abstract
         */
        ITransaction.prototype.rejectChanges  = function() {
            throw new ExtendError(/EL02252/, null, ['ITransaction']);
        };
        return ITransaction;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};
    _global._L.ITransaction = ITransaction;
    _global._L.Interface.ITransaction = ITransaction;
}(typeof window !== 'undefined' ? window : global));
/**** trans-queue.js | _L.Collection.TransactionQueue ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Util                       = _global._L.Util;                  
    var MetaObject                 = _global._L.MetaObject;            
    var ArrayCollection            = _global._L.ArrayCollection;       
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof ArrayCollection === 'undefined') throw new Error(Message.get('ES011', ['ArrayCollection', 'i-collection-array']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    //==============================================================
    // 3. module implementation   
    var TransactionQueue  = (function () {
        /**
         * 트랜젝션 큐
         * @constructs _L.Collection.TransactionQueue
         * @param {ArrayCollection} p_collection 배열컬렉션
         */
        function TransactionQueue(p_collection) {
            var queue = [];
            var collection;
            /**
             * 큐 목록
             * @readonly
             * @member {array<object>} _L.Collection.TransactionQueue#queue
             */
            Object.defineProperty(this, 'queue', 
            {
                get: function() { return queue; },
                configurable: false,
                enumerable: true
            });
            /**
             * 대상 컬랙션
             * @member {Number} _L.Collection.TransactionQueue#count 
             */
            Object.defineProperty(this, 'collection', 
            {
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
         * @returns {array<object>}
         */
        TransactionQueue.prototype.select  = function() {
            return this.queue;
        };
        return TransactionQueue;
    }());
    //==============================================================
    // 4. module export
    // create namespace    
    _global._L.Collection                   = _global._L.Collection || {};
    _global._L.TransactionQueue = TransactionQueue;
    _global._L.Collection.TransactionQueue = TransactionQueue;
}(typeof window !== 'undefined' ? window : global));
/**** collection-transaction.js | _L.Collection.TransactionCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Type                       = _global._L.Type;              
    var Util                       = _global._L.Util;              
    var ArrayCollection            = _global._L.ArrayCollection;   
    var TransactionQueue           = _global._L.TransactionQueue;  
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof ArrayCollection === 'undefined') throw new Error(Message.get('ES011', ['ArrayCollection', 'i-collection-array']));
    if (typeof TransactionQueue === 'undefined') throw new Error(Message.get('ES011', ['TransactionQueue', 'trans-queue']));
    //==============================================================
    // 3. module implementation
    var TransactionCollection  = (function (_super) {
        /**
         * 트랜젝션 컬렉션 클래스
         * @constructs _L.Collection.TransactionCollection
         * @extends _L.Collection.ArrayCollection
         * @param {object} p_owner 소유객체
         */
        function TransactionCollection(p_owner) {
            _super.call(this, p_owner);
            var _transQueue = new TransactionQueue(this);
            var autoChanges = false;
            /**
             * 트렌젝션 큐
             * @readonly
             * @member {TransactionQueue} _L.Collection.TransactionCollection#_transQueue
             */
            Object.defineProperty(this, '_transQueue',
            {
                get: function() { return _transQueue; },
                configurable: false,
                enumerable: false
            });
            /**
             * 자동 변경 유무 (기본값: 사용 false)
             * @member {boolean} _L.Collection.TransactionCollection#autoChanges
             */
            Object.defineProperty(this, 'autoChanges', 
            {
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
             * @readonly
             * @member {TransactionCollection} _L.Collection.TransactionCollection#hasChanges
             */
            Object.defineProperty(this, 'hasChanges',
            {
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
            var vOpt = p_vOpt || 0;
            // var origin = p_origin ? p_origin : obj;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            if (this.autoChanges !== false) obj['autoChanges'] = this.autoChanges;
            return obj;                        
        };
        Object.defineProperty(TransactionCollection.prototype, 'getObject', {
            enumerable: false
        });
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Collection                       = _global._L.Collection || {};
    _global._L.TransactionCollection = TransactionCollection;
    _global._L.Collection.TransactionCollection = TransactionCollection;
}(typeof window !== 'undefined' ? window : global));
/**** meta-row.js | _L.Meta.Entity.MetaRow, _L.Meta.Entity.MetaRowCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;                   
    var ExtendError                = _global._L.ExtendError;               
    var Type                       = _global._L.Type;                      
    var Util                       = _global._L.Util;                      
    var EventEmitter               = _global._L.EventEmitter;              
    var MetaObject                 = _global._L.MetaObject;                
    var IList                      = _global._L.IList;                     
    var TransactionCollection      = _global._L.TransactionCollection;     
    var MetaRegistry               = _global._L.MetaRegistry;              
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof EventEmitter === 'undefined') throw new Error(Message.get('ES011', ['EventEmitter', 'event-emitter']));
    if (typeof IList === 'undefined') throw new Error(Message.get('ES011', ['IList', 'i-list']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof TransactionCollection === 'undefined') throw new Error(Message.get('ES011', ['TransactionCollection', 'collection-transaction']));
    //==============================================================
    // 3. module implementation   
    var MetaRow  = (function (_super) {
        /**
         * 메타 로우
         * @constructs _L.Meta.Entity.MetaRow
         * @extends _L.Meta.MetaObject
         * @param {BaseEntity} p_entity 소유하는 엔티티
         */
        function MetaRow(p_entity) {
            _super.call(this);
            // private
            var $event  = new EventEmitter(this);
            var $elements = [];
            var $keys = [];
            // protected
            var _this   = this;
            var _entity  = null;
            /**
             * 내부 변수 접근
             * @member {Array<string>} _L.Meta.Entity.MetaRow#$elements
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$elements',
            {
                get: function() { return $elements; },
                set: function(nVal) { $elements = nVal; },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 이벤트 객체
             * @private 
             * @member {EventEmitter} _L.Meta.Entity.MetaRow#$event  
             */
            Object.defineProperty(this, '$event', 
            {
                get: function() { return $event; },
                configurable: false,
                enumerable: false,
            });
            // /** 
            //  * 로우 요소값 
            //  * @readonly
            //  * @member {Array<any>} _L.Meta.Entity.MetaRow#$elements  
            //  */
            // Object.defineProperty(this, '$elements', 
            // {
            //     get: function() {
            //         var arr = [];
            //         for (var i = 0; i < $elements.length; i++) arr.push($elements[i]);
            //         return arr;
            //     },
            //     configurable: false,
            //     enumerable: false,
            // });
            /** 
             * 요소 키
             * @readonly
             * @member {Array<string>} _L.Meta.Entity.MetaRow#$keys  
             */
            Object.defineProperty(this, '$keys',
            {
                get: function() {
                    var arr = [];
                    for (var i = 0; i < $keys.length; i++) arr.push($keys[i]);
                    return arr;
                },
                configurable: false,
                enumerable: false,
            });
            /**
             * 로우의 소유 엔티티
             * @readonly
             * @member {BaseEntity} _L.Meta.Entity.MetaRow#_entity
             */
            Object.defineProperty(this, '_entity', 
            {
                get: function() { return _entity; },
                configurable: false,
                enumerable: false
            });
            /**
             * 컬렉션 목록 
             * @readonly
             * @member {Array<any>}  _L.Meta.Entity.MetaRow#_list  
             */
            Object.defineProperty(this, '_list', 
            {
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
             * @readonly
             * @member {Number} _L.Meta.Entity.MetaRow#count 
             */
            Object.defineProperty(this, 'count', 
            {
                get: function() { return $elements.length; },
                configurable: false,
                enumerable: false
            });
            /**
             * 변경전 이벤트 
             * @event _L.Meta.Entity.MetaRow#onChanged 
             * @param {function}    p_callback
             * @param {number}      p_callback.p_idx  index
             * @param {any}         p_callback.p_nValue 신규 값
             * @param {any}         p_callback.p_oValue 기존 값
             * @param {this}        p_callback.p_this 로우 객체
             */
            Object.defineProperty(this, 'onChanging', 
            {
                set: function(fun) { this.$event.on('onChanging', fun); },
                configurable: false,
                enumerable: false,
            });
            /**
             * 변경후 이벤트 
             * @event _L.Meta.Entity.MetaRow#onChanged 
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
                Object.defineProperty(this, [i], $getPropDescriptor(idx, false));
                Object.defineProperty(this, alias, $getPropDescriptor(idx));
            }
            function $getPropDescriptor(p_idx, p_enum) {
            if (typeof p_enum !== 'boolean') p_enum = true;
            return {
                    get: function() { return $elements[p_idx]; },
                    set: function(nVal) { 
                        var oldValue = $elements[p_idx];
                        var column;
                        // 엔티티 항상 존재함
                        column = _entity.columns[p_idx];
                        if (column && column._valueTypes.length > 0) Type.matchType([column._valueTypes], nVal);
                        // 트렌젹션 처리 => 함수로 추출 검토
                        if (_entity && !_entity.rows.autoChanges) {
                            var etc = 'idx:'+ p_idx +', new:' + nVal + ', old:'+ oldValue;
                            var pos = _entity.rows.indexOf(this);
                            if (pos > -1) {     // 컬력션에 포힘때 : 변경시점에 큐에 추가
                                _entity.rows._transQueue.update(pos, this, this.clone(), etc);
                            }
                        }
                        // 이벤트 및 처리
                        _this._onChanging(p_idx, nVal, oldValue);
                        $elements[p_idx] = nVal;
                        _this._onChanged(p_idx, nVal, oldValue);
                    },
                    configurable: false,
                    enumerable: p_enum
                };
            }
        }
        Util.inherits(MetaRow, _super);
        MetaRow._UNION = [IList];
        MetaRow._NS = 'Meta.Entity';
        MetaRow._PARAMS = ['_entity'];
        /**
         * 로우 요소 변경전 이벤트
         * @param {*} p_idx 인덱스
         * @param {*} p_nValue 변경 값
         * @param {*} p_oValue 기존 값
         * @listens _L.Meta.Entity.MetaColumn#_onChanged
         */
        MetaRow.prototype._onChanging = function(p_idx, p_nValue, p_oValue) {
            this.$event.emit('onChanging', p_idx, p_nValue, p_oValue, this);
        };
        Object.defineProperty(MetaRow.prototype, '_onChanging', {
            enumerable: false
        });
        /**
         * 로우 요소 변경후 이벤트
         * @param {*} p_idx 인덱스
         * @param {*} p_nValue 변경 값
         * @param {*} p_oValue 기존 값
         * @listens _L.Meta.Entity.MetaColumn#_onChanged
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
            for (var i = 0; i < this.$keys.length; i++) {
                var key = this.$keys[i];
                obj['_key'].push(key);
            }
            return obj;                        
        };
        Object.defineProperty(MetaRow.prototype, 'getObject', {
            enumerable: false
        });
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        MetaRow.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            var entity;
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
    //---------------------------------------
    var MetaRowCollection  = (function (_super) {
        /**
         * 로우 컬렉션
         * @constructs _L.Meta.Entity.MetaRowCollection
         * @extends _L.Collection.TransactionCollection
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.MetaRow = MetaRow;
    _global._L.MetaRowCollection = MetaRowCollection;
    _global._L.Meta.Entity.MetaRow = MetaRow;
    _global._L.Meta.Entity.MetaRowCollection = MetaRowCollection;
}(typeof window !== 'undefined' ? window : global));
/**** base-column.js | _L.Meta.Entity.BaseColumn ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                   = _global._L.Message;        
    var ExtendError               = _global._L.ExtendError;    
    var Type                      = _global._L.Type;           
    var Util                      = _global._L.Util;           
    var MetaRegistry              = _global._L.MetaRegistry;   
    var MetaElement               = _global._L.MetaElement;    
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011',['Util', 'util']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaElement === 'undefined') throw new Error(Message.get('ES011', ['MetaElement', 'meta-element']));
    //==============================================================
    // 3. module implementation
    var BaseColumn  = (function (_super) {
        /**
         * 컬럼 (최상위)
         * @abstract
         * @constructs _L.Meta.Entity.BaseColumn
         * @extends _L.Meta.MetaElement
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
            var value           = null;
            var caption         = null;
            /**
             * 컬럼 컬렉션의 키
             * @member {string} _L.Meta.Entity.BaseColumn#$key
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$key',
            {
                get: function() { return $key; },
                set: function(nVal) { 
                    if (_isString(nVal)) $key = nVal;
                },
                configurable: false,
                enumerable: false,
            });
            /**
             * 별칭 내부값
             * @member {string | number | boolean} _L.Meta.Entity.BaseColumn#$value
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$value',
            {
                get: function() { return $value; },
                set: function(nVal) { $value = nVal; },
                configurable: false,
                enumerable: false,
            });
            /**
             * 별칭 내부값
             * @member {string} _L.Meta.Entity.BaseColumn#$alias
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$alias',
            {
                get: function() { return $alias; },
                set: function(nVal) { 
                    if (_isString(nVal)) $alias = nVal;
                },
                configurable: false,
                enumerable: false,
            });
            /**
             * 컬럼 소유 엔티티
             * @member {BaseEntity} _L.Meta.Entity.BaseColumn#_entity
             * @protected
             */
            Object.defineProperty(this, '_entity', 
            {
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
             * @member {any} _L.Meta.Entity.BaseColumn#_valueTypes
             * @protected
             */
            Object.defineProperty(this, '_valueTypes', 
            {
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
             * @member {string} _L.Meta.Entity.BaseColumn#columnName
             */
            Object.defineProperty(this, 'columnName', 
            {
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
             * @member {string} _L.Meta.Entity.BaseColumn#alias
             */
            Object.defineProperty(this, 'alias', 
            {
                get: function() { return typeof $alias === 'string' ? $alias : this.columnName; },
                set: function(nVal) { 
                   var entity = this._entity;
                   if(typeof nVal !== 'string') throw new ExtendError(/EL05115/, null, [this.constructor.name, typeof nVal]); 
                   if (entity && entity.columns.existAlias(nVal)) throw new ExtendError(/EL05116/, null, [this.constructor.name, nVal]);
                   $alias = nVal;
                },
                configurable: false,
                enumerable: true
            }); 
            /**
             * 컬럼 value 의 기본값 (내부속성)
             * @member {string | number | boolean} _L.Meta.Entity.BaseColumn#default
             */
            Object.defineProperty(this, 'default', 
            {
                get: function() { return value; },
                set: function(nVal) { 
                    if (this._valueTypes.length > 0) Type.matchType([this._valueTypes], nVal);
                    value = nVal; 
                },
                configurable: false,
                enumerable: true
            });
            /**
             * 컬럼 설명
             * @member {string} _L.Meta.Entity.BaseColumn#caption
             */
            Object.defineProperty(this, 'caption', 
            {
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
             * @member {any} _L.Meta.Entity.BaseColumn#value
             */
            Object.defineProperty(this, 'value', 
            {
                get: function() { return $value; },
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
             * @member {object} _L.Meta.Entity.BaseColumn#val 
             */
            Object.defineProperty(this, 'val', 
            {
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
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            if (vOpt < 2 && vOpt > -1 && this._entity) {
                obj['_entity'] = MetaRegistry.createReferObject(this._entity);
            }
            obj['columnName'] = this.columnName;
            if (this.default !== null) obj['default'] = this.default;
            if (this.caption !== null) obj['caption'] = this.caption;            
            if (this.$alias !== null) obj['alias'] = this.$alias;
            // if (this.__GET$alias(this) !== null) obj['alias'] = this.__GET$alias(this);
            if (this.value !== null) obj['value'] = this.value;
            return obj;                        
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
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
            if (p_oGuid['alias']) this.alias = p_oGuid['alias'];
            if (p_oGuid['value']) this.value = p_oGuid['value'];
        };
        /** 
         * 컬럼 복제
         * @abstract 
         */
        BaseColumn.prototype.clone = function() {
            throw new ExtendError(/EL05119/, null, []);
        };
        return BaseColumn;
    }(MetaElement));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.BaseColumn = BaseColumn;
    _global._L.Meta.Entity.BaseColumn = BaseColumn;
}(typeof window !== 'undefined' ? window : global));
/**** meta-column.js | _L.Meta.Entity.MetaColumn ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    var Type                       = _global._L.Type;          
    var Util                       = _global._L.Util;          
    var EventEmitter               = _global._L.EventEmitter;  
    var BaseColumn                 = _global._L.BaseColumn;    
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof EventEmitter === 'undefined') throw new Error(Message.get('ES011', ['EventEmitter', 'event-emitter']));
    if (typeof BaseColumn === 'undefined') throw new Error(Message.get('ES011', ['BaseColumn', 'base-column']));
    //==============================================================
    // 3. module implementation
    //--------------------------------------------------------------
    // implementation   
    var MetaColumn  = (function (_super) {
        /**
         * 메타 컬럼
         * @constructs _L.Meta.Entity.MetaColumn
         * @extends _L.Meta.Entity.BaseColumn
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
             * @member {EventEmitter} _L.Meta.Entity.MetaColumn#$event  
             */
            Object.defineProperty(this, '$event', 
            {
                get: function() { return $event; },
                configurable: false,
                enumerable: false,
            });        
            /**
             * 컬럼 value의 필수 여부
             * @member {boolean} _L.Meta.Entity.MetaColumn#required
             */
            Object.defineProperty(this, 'required', 
            {
                get: function() { return required },
                set: function(nVal) { 
                    if(typeof nVal !== 'boolean') throw new ExtendError(/EL05131/, null, [this.constructor.name, typeof nVal]);
                    required = nVal; 
                },
                configurable: false,
                enumerable: true
            });
            /**
             * 컬럼 제약 조건 
             * @member {array<object | function>} _L.Meta.Entity.MetaColumn#constraints
             * @example
             * var c = {
             *  regex: /aa/,
             *  msg: '매칭메세지',  // return이 true면 성공시 메세지, false 실패시 메세지
             *  condition: ture     // 매칭시 성공
             * };
             */
            Object.defineProperty(this, 'constraints', 
            {
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
             * @member {string | number | boolean} _L.Meta.Entity.MetaColumn#value
             */
            Object.defineProperty(this, 'value', 
            {
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
                    if (typeof __val === 'undefined' || __val === null) __val = this.$value || this.default;  
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
             * @member {Function} _L.Meta.Entity.MetaColumn#getter
             */
            Object.defineProperty(this, 'getter', 
            {
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
             * @member {Function} _L.Meta.Entity.MetaColumn#setter
             */
            Object.defineProperty(this, 'setter', 
            {
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
             * @event _L.Meta.Entity.MetaColumn#onChanged 
             * @param {function}    p_callback
             * @param {any}         p_callback.p_nValue 신규 value 값
             * @param {any}         p_callback.p_oValue 기존 value 값
             * @param {MetaColumn}  p_callback.p_this this(컬럼객체)
             */
            Object.defineProperty(this, 'onChanged', 
            {
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
         * @param {*} p_nValue 변경 값
         * @param {*} p_oValue 기존 값
         * @listens _L.Meta.Entity.MetaColumn#_onChanged
         */
        MetaColumn.prototype._onChanged = function(p_nValue, p_oValue) {
            p_oValue = p_oValue || this.$value;
            this.$event.emit('onChanged', p_nValue, p_oValue, this);
        };
        /**
         * 프로퍼티 객체로 속성 로드
         * @param {object} p_property 
         */
        MetaColumn.prototype._load = function(p_property) {
            if (typeof p_property === 'object' ) {
                for(var prop in p_property) {
                    // if (p_property.hasOwnProperty(prop) &&
                    if (Object.prototype.hasOwnProperty.call(p_property, prop) &&
                        [
                            '_valueTypes', 'alias', 'default', 'caption', 'value',          // BaseColumn
                            'required', 'constraints', 'getter', 'setter'    // MetaColumn                        
                        ].indexOf(prop) > -1) {
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
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            if (!Type.deepEqual(this.$event.$storage, {})) {
                obj['$storage'] = this.$event.$storage;
            }
            if (this.required !== false) obj['required'] = this.required;
            // if (this.optional !== false) obj['optional'] = this.optional;
            if (this.constraints.length > 0) obj['constraints'] = Util.deepCopy(this.constraints);
            if (this.getter !== null) obj['getter'] = this.getter;
            if (this.setter !== null) obj['setter'] = this.setter;
            if (this.value !== null) obj['value'] = this.value;    // 오버라이딩
            return obj;                        
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        MetaColumn.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            var entity;
            if (p_oGuid['$storage']) {
                this.$event.$storage = p_oGuid['$storage'];
            }
            if (p_oGuid['required']) this.required = p_oGuid['required'];
            // if (p_oGuid['optional']) this.optional = p_oGuid['optional'];
            if (p_oGuid['constraints']) this.constraints = p_oGuid['constraints'];
            if (p_oGuid['getter']) this.getter = p_oGuid['getter'];
            if (p_oGuid['setter']) this.setter = p_oGuid['setter'];
            if (p_oGuid['value']) this.value = p_oGuid['value'];
        };
        /**
         * 컬럼 복제
         * @param {BaseEntity} [p_entity] 지정한 엔티티로 복제
         * @returns {MetaColumn}
         */
        MetaColumn.prototype.clone = function(p_entity) {
            var clone;
            var rObj = this.getObject();
            var entity = p_entity ? p_entity : this._entity;
            clone = new MetaColumn(this.columnName, entity);
            if (rObj['default']) clone.default = rObj['default'];
            if (rObj['caption']) clone.caption = rObj['caption'];
            if (rObj['required']) clone.required = rObj['required'];
            // if (rObj['optional']) clone.optional = rObj['optional'];
            if (rObj['constraints']) clone.constraints = rObj['constraints'];
            if (rObj['getter']) clone.getter = rObj['getter'];
            if (rObj['setter']) clone.setter = rObj['setter'];
            if (rObj['alias']) clone.alias = rObj['alias'];
            clone.value = rObj['value'];
            return clone;
        };
        /**
         * 제약조건을 추가  
         * REVIEW: 정규식으로 반대 조건을 모두 나열 할수 있으므로, 항상 실패조건을 하는게 맞을지? 검토
         * @param {Regexp} p_regex 정규표현식
         * @param {string} p_msg  regexp 입력시
         * @param {string} [p_code] regexp 입력시
         * @param {boolean} [p_condition] <기본값 false> 성공/실패 조건
         * @param {boolean} p_condition.false 실패조건이며<기본값>, 정규식이 매칭이 안되야 한다.
         * @param {boolean} p_condition.true 성공조건이며 정규식이 매칭이되어야 성공(통화)  
         */
        MetaColumn.prototype.addConstraint = function(p_regex, p_msg, p_code, p_condition) {
            p_condition = p_condition || false;
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
            if (this.required === false /* && this.optional === true */ && value.length === 0) return;
            if (this.required === false && this.constraints.length === 0 ) return;
            if (this.required === true && this.constraints.length === 0 && value.length > 0) return;
            // 3. 실패조건 검사
            if (this.required === true && this.constraints.length === 0 && value.length === 0) {
                result.msg   = Message.get('ES055', [this.name]);
                result.code  = 0;
                return result;
            }
            // 4. 제약조건 검사
            for(var i = 0; this.constraints.length > i; i++) {
                if (typeof this.constraints[i] === 'function') {
                    return this.constraints[i].call(this, this, value);     // 함수형 제약조건  
                } else {
                    match = value.match(this.constraints[i].regex);
                    if ((this.constraints[i].condition === false && match !== null) ||    // 실패 조건
                        (this.constraints[i].condition === true && match === null)) {     // 성공 조건
                        result.msg   = Message.get('ES056', [this.name, this.constraints[i].msg]);
                        result.code  = this.constraints[i].code;
                        return result;
                    }
                }
            }            
            return;
        };
        return MetaColumn;
    }(BaseColumn));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.MetaColumn = MetaColumn;
    _global._L.Meta.Entity.MetaColumn = MetaColumn;
}(typeof window !== 'undefined' ? window : global));
/**** object-column.js | _L.Meta.Entity.ObjectColumn ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Util                       = _global._L.Util;                  
    var MetaObject                 = _global._L.MetaObject;            
    var MetaElement                = _global._L.MetaElement;           
    var BaseColumn                 = _global._L.BaseColumn;            
    var PropertyCollection         = _global._L.PropertyCollection;    
    var MetaRegistry               = _global._L.MetaRegistry;          
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof MetaElement === 'undefined') throw new Error(Message.get('ES011', ['MetaElement', 'meta-element']));
    if (typeof BaseColumn === 'undefined') throw new Error(Message.get('ES011', ['BaseColumn', 'base-column']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    //==============================================================
    // 3. module implementation
    var ObjectColumn  = (function (_super) {
        /**
         * 객체 컬럼
         * @constructs _L.Meta.Entity.ObjectColumn
         * @extends _L.Meta.Entity.BaseColumn
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
            var value = this.value;
            if (defValue instanceof MetaObject) {
                if (MetaRegistry.hasGuidObject(defValue, owned)) {
                    obj['default'] = MetaRegistry.createReferObject(defValue);
                } else obj['default'] = defValue.getObject(vOpt, owned);
            }
            if (value instanceof MetaObject) {
                if (MetaRegistry.hasGuidObject(value, owned)) {
                    obj['value'] = MetaRegistry.createReferObject(value);
                } else obj['value'] = value.getObject(vOpt, owned);
            }
            return obj;                        
        };
        /**
         * 현재 객체를 guid 객체로 설정한다.
         * override
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
            elem = p_oGuid['value'];
            if (typeof elem === 'object' && elem !== null) {
                if (MetaRegistry.isGuidObject(elem)) {
                    var obj = MetaRegistry.createMetaObject(elem, origin);
                    obj.setObject(elem, origin);
                    this.value = obj;
                } else if (elem['$ref']) {
                    var meta = MetaRegistry.findSetObject(elem['$ref'], origin);
                    if (!meta) throw new ExtendError(/EL05123/, null, [elem['$ref']]);
                    this.value = meta;
                }
            }
        };
        /**
         * 객체 복제
         * override
         * @param {BaseEntity} [p_entity] 지정한 엔티티로 복제
         * @returns {ObjectColumn}
         */
        ObjectColumn.prototype.clone = function(p_entity) {
            var clone;
            var rObj = this.getObject();
            var entity = p_entity ? p_entity : this._entity;
            clone = new ObjectColumn(this.columnName, entity);
            if (rObj['default']) clone.default = this['default'];
            if (rObj['caption']) clone.caption = rObj['caption'];
            if (rObj['alias']) clone.alias = rObj['alias'];
            if (rObj['value']) clone.value = this.value;
            return clone;
        };
        return ObjectColumn;
    }(BaseColumn));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                     = _global._L.Meta || {};
    _global._L.Meta.Entity              = _global._L.Meta.Entity || {};
    _global._L.ObjectColumn = ObjectColumn;
    _global._L.Meta.Entity.ObjectColumn = ObjectColumn;
}(typeof window !== 'undefined' ? window : global));
/**** collection-column.js | _L.Meta.Entity.BaseColumnCollection, MetaViewColumnCollection, MetaTableColumnCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Type                       = _global._L.Type;                  
    var Util                       = _global._L.Util;                  
    var MetaElement                = _global._L.MetaElement;           
    var BaseColumn                 = _global._L.BaseColumn;            
    var PropertyCollection         = _global._L.PropertyCollection;    
    var MetaRegistry               = _global._L.MetaRegistry;          
    var MetaColumn                 = _global._L.MetaColumn;            
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    // if (typeof Observer === 'undefined') throw new Error(Message.get('ES011', ['Observer', 'observer']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaElement === 'undefined') throw new Error(Message.get('ES011', ['MetaElement', 'meta-element']));
    if (typeof BaseColumn === 'undefined') throw new Error(Message.get('ES011', ['BaseColumn', 'base-column']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (typeof MetaColumn === 'undefined') throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    //==============================================================
    // 3. module implementation
    var BaseColumnCollection  = (function (_super) {
        /**
         * 컬럼 컬렉션 (최상위)
         * @abstract
         * @constructs _L.Meta.Entity.BaseColumnCollection
         * @extends _L.Collection.PropertyCollection
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
            Object.defineProperty(this, '_baseType', 
            {
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
            // this._baseType = p_baseType || MetaColumn;
            this._baseType = p_baseType;
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
    var MetaTableColumnCollection  = (function (_super) {
        /**
         * 테이블 컬럼 컬렉션  
         * 참조 컬럼은 독립적으로 가진다 (참조 금지)
         * @constructs _L.Meta.Entity.MetaTableColumnCollection
         * @extends _L.Meta.Entity.BaseColumnCollection
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
    var MetaViewColumnCollection  = (function (_super) {
        /**
         * 메타 뷰 컬럼 컬렉션
         * @constructs _L.Meta.Entity.MetaViewColumnCollection
         * @extends _L.Meta.Entity.BaseColumnCollection
         * @param {object} p_owner 소유자
         */
        function MetaViewColumnCollection(p_owner) {
            _super.call(this, p_owner, MetaColumn);
            /** 
             * 참조하는 엔티티 목록
             * @readonly
             * @member {array<BaseEntity>} _L.Meta.Entity.MetaViewColumnCollection#_refEntities
             */
            Object.defineProperty(this, '_refEntities', 
            {
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.BaseColumnCollection = BaseColumnCollection;
    _global._L.MetaViewColumnCollection = MetaViewColumnCollection;
    _global._L.MetaTableColumnCollection = MetaTableColumnCollection;
    _global._L.Meta.Entity.BaseColumnCollection = BaseColumnCollection;
    _global._L.Meta.Entity.MetaViewColumnCollection = MetaViewColumnCollection;
    _global._L.Meta.Entity.MetaTableColumnCollection = MetaTableColumnCollection;
}(typeof window !== 'undefined' ? window : global));
/**** base-entity.js | _L.Meta.Entity.BaseEntity ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Util                       = _global._L.Util;                  
    var IGroupControl              = _global._L.IGroupControl;         
    var ISchemaControl             = _global._L.ISchemaControl;        
    var IImportControl             = _global._L.IImportControl;        
    var IExportControl             = _global._L.IExportControl;        
    var ISerialize                 = _global._L.ISerialize;            
    var MetaObject                 = _global._L.MetaObject;            
    var MetaElement                = _global._L.MetaElement;           
    var MetaRowCollection          = _global._L.MetaRowCollection;     
    var MetaRow                    = _global._L.MetaRow;               
    var BaseColumnCollection       = _global._L.BaseColumnCollection;  
    var MetaColumn                 = _global._L.MetaColumn;            
    var MetaRegistry               = _global._L.MetaRegistry;          
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof IGroupControl === 'undefined') throw new Error(Message.get('ES011', ['IGroupControl', 'i-control-group']));
    if (typeof ISchemaControl === 'undefined') throw new Error(Message.get('ES011', ['ISchemaControl', 'i-control-schema']));
    if (typeof IImportControl === 'undefined') throw new Error(Message.get('ES011', ['IImportControl', 'i-control-import']));
    if (typeof IExportControl === 'undefined') throw new Error(Message.get('ES011', ['IExportControl', 'i-control-export']));
    if (typeof ISerialize === 'undefined') throw new Error(Message.get('ES011', ['ISerialize', 'i-serialize']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof MetaElement === 'undefined') throw new Error(Message.get('ES011', ['MetaElement', 'meta-element']));
    if (typeof MetaRowCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaRowCollection', 'meta-row']));
    if (typeof MetaRow === 'undefined') throw new Error(Message.get('ES011', ['MetaRow', 'meta-row']));
    if (typeof BaseColumnCollection === 'undefined') throw new Error(Message.get('ES011', ['BaseColumnCollection', 'collection-column']));
    if (typeof MetaColumn === 'undefined') throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    //==============================================================
    // 3. module implementation
    var BaseEntity  = (function (_super) {
        /**
         * 기본 엔티티 (최상위)
         * @abstract
         * @constructs _L.Meta.Entity.BaseEntity
         * @extends _L.Meta.MetaElement
         * @implements {_L.Interface.IGroupControl}
         * @implements {_L.Interface.ISchemaControl}
         * @implements {_L.Interface.IImportControl}
         * @implements {_L.Interface.IExportControl}
         * @implements {_L.Interface.ISerialize}
         * @param {string} p_name 
         */
        function BaseEntity(p_name) {
            _super.call(this, p_name);
            var _metaSet    = null;
            var rows        = new MetaRowCollection(this);
            /**
             * 엔티티의 아이템(속성) 컬렉션
             * @member {MetaSet} _L.Meta.Entity.BaseEntity#_metaSet
             */
            Object.defineProperty(this, '_metaSet', 
            {
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
             * @readonly
             * @member {BaseColumnCollection} _L.Meta.Entity.BaseEntity#columns
             */
            Object.defineProperty(this, 'columns', 
            {
                get: function() { 
                    throw new ExtendError(/EL05312/, null, [this.constructor.name]);
                },
                configurable: true, // 하위에서 재정의 해야함
                enumerable: true
            });
            /**
             * columns 별칭
             * @member {object} _L.Meta.Entity.BaseEntity#cols 
             */
            Object.defineProperty(this, 'cols', 
            {
                get: function() { return this.columns; },
                set: function(nVal) { this.columns = nVal;},
                configurable: true,
                enumerable: false
            });
            /**
             * 엔티티의 데이터(로우) 컬렉션
             * @readonly
             * @member {MetaRowCollection} _L.Meta.Entity.BaseEntity#rows
             */
            Object.defineProperty(this, 'rows', {
                get: function() { return rows; },
                configurable: false,
                enumerable: true
            });
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
                        if (column._guid) obj[key]._guid = column['_guid'];
                        if (column.default) obj[key].default = column['default'];
                        if (column.caption) obj[key].caption = column['caption'];            
                        if (column.required) obj[key].required = column['required'];
                        // if (column.optional) obj[key].optional = column['optional'];
                        if (Array.isArray(column.constraints)) {
                            obj[key]['constraints'] = Util.deepCopy(column['constraints']);
                        }
                        if (column.getter) obj[key].getter = column['getter'];
                        if (column.setter) obj[key].setter = column['setter'];
                        if (column.alias) obj[key].alias = column['alias'];
                        if (column.value) obj[key].value = column['value'];
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
                    for (var i = 0; i < p_items.length; i++) {
                        columnName = p_items[i];
                        if (!_isString(columnName)) throw new ExtendError(/EL05321/, null, [i, typeof columnName]);
                        if (!this.columns.exist(columnName)) throw new ExtendError(/EL05322/, null, [columnName]);
                        column = this.columns.alias(columnName)
                        p_entity.columns.add(column);
                    }
                }
                // rows 등록
                for (var i = 0; i < orignal.rows.count; i++) {  
                    if (!p_callback || (typeof p_callback === 'function' 
                        && p_callback.call(this, orignal.rows[i], i, p_entity))) {
                        p_entity.rows.add($createRow(orignal.rows[i]));
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
                for (var ii = 0; ii < p_entity.columns.count; ii++) {
                    alias = p_entity.columns[ii].alias;
                    newRow[alias] = row[alias];
                }
                return newRow;
            }
        };
        /**
         * BaseEntity 읽기(로드)
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
                    if (_this.columns.exist(key)) throw new ExtendError(/EL05328/, null, [key]);
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
                        } else for (var key in columns) $addColumn(key, columns);
                }
                // opt
                if (p_isCreateRow === true && obj['rows']) {
                    // rows = obj['rows'];
                    if (Array.isArray(obj['rows'])) rows = obj['rows'];
                    else rows.push(obj['rows']);
                    if (Array.isArray(rows) && rows.length > 0 && typeof rows[0] === 'object') {
                        for (var key in rows[0]) {    // rows[0] 기준
                            if (Object.prototype.hasOwnProperty.call(rows[0], key) && !this.columns.existAlias(key)) {
                                var prop = rows[0][key];
                                if (!this.columns.exist(key)) {
                                    var column = new Column(key, this);
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
                    if (_this.columns.exist(key)) throw new ExtendError(/EL0532E/, null, [key]);
                    _this.columns.add(column);
                }
            }
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
         * @returns {MetaRow} columns 구조의 row를 생성
         */
        BaseEntity.prototype.newRow  = function() {
            return new MetaRow(this);
        };
        /**
         * 컬럼의 value 값을 MetaRow 타입 객체로 얻기
         * @returns {MetaRow}
         */
        BaseEntity.prototype.getValue  = function() {
            var row = this.newRow();
            for(var i = 0; this.columns.count > i; i++) {
                 row[i] = this.columns[i].value;
            }
            return row;
        };
        /**
         * MetaRow 의 값을 컬럼의 value에 설정한다.
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
            var key, alias, newRow, tarRow, oriRows, tarRows, tarColumns;
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
                for (var i = 0; i < tempRows.length; i++) {
                    newRow = _this.newRow();
                    for (var ii = 0; ii < _this.columns.count; ii++) {
                        alias = _this.columns[ii].alias;
                        if (tempRows[i][alias]) newRow[alias] = tempRows[i][alias];
                    }
                    _this.rows.add(newRow, p_matchType);
                }
                // 3-3. 타겟 row 추가
                tarRows = target.rows;
                for (var i = 0; i < tarRows.count; i++) {
                    newRow = _this.newRow();
                    tarRow = tarRows[i];
                    for (var ii = 0; ii < _this.columns.count; ii++) {
                        alias = _this.columns[ii].alias;
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
                    if (_this.columns.exist(alias)) throw new ExtendError(/EL05343/, null, [i, alias]);
                    if (_this.columns.existAlias(alias)) throw new ExtendError(/EL05344/, null, [i, alias]);
                }
                // 3-2. 로우 임시 저장 및 초기화 
                for (var i = 0; i < _this.rows.count; i++) {
                    tempRows.push(_this.rows[i].clone());
                }
                _this.rows.clear();
                // 3-3. 컬럼 추가
                for (var i = 0; i < tarColumns.count; i++) {
                    clone = tarColumns[i].clone(_this);
                    var key = tarColumns[i].alias;
                    clone.columnName = key;
                    clone.$key = key;
                    // clone.__SET$$key(key, clone);
                    _this.columns.add(clone);
                }
                // 3-4. 로우 추가 (기준:idx)
                for (var i = 0; i < tempRows.length; i++) {
                    newRow = _this.newRow();
                    for (var ii = 0; ii < _this.columns.count; ii++) {
                        alias = _this.columns[ii].alias;
                        if (tempRows[i][alias]) {                         // 원본 로우
                            newRow[alias] = tempRows[i][alias];
                            continue;
                        } else if (tarRows[i] && tarRows[i][alias]) newRow[alias] = tarRows[i][alias]; // 타겟 로우
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
                for (var i = 0; i < tarColumns.count; i++) {
                    alias = tarColumns[i].alias;
                    if (!_this.columns.exist(alias)) {
                        clone = tarColumns[i].clone(_this);
                        clone.name = alias;
                        _this.columns.add(clone);
                    }
                }
                // 3-3. 로우 추가 : 원본
                for (var i = 0; i < tempRows.length; i++) {
                    newRow = _this.newRow();
                    for (var ii = 0; ii < _this.columns.count; ii++) {
                        alias = _this.columns[ii].alias;
                        if (tempRows[i][alias]) newRow[alias] = tempRows[i][alias];
                    }
                    _this.rows.add(newRow, p_matchType);
                }
                // 3-4. 로우 추가 : 타겟
                for (var i = 0; i < tarRows.count; i++) {
                    newRow = _this.newRow();
                    for (var ii = 0; ii < _this.columns.count; ii++) {
                        alias = _this.columns[ii].alias;
                        if (tarRows[i][alias]) newRow[alias] = tarRows[i][alias];
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
                    if (_this.columns.exist(alias)) throw new ExtendError(/EL05345/, null, [i, alias]);
                    if (_this.columns.existAlias(alias)) throw new ExtendError(/EL05346/, null, [i, alias]);
                }
                // 3-2. 로우 임시 저장 및 초기화 
                for (var i = 0; i < _this.rows.count; i++) {
                    tempRows.push(_this.rows[i].clone());
                }
                _this.rows.clear();
                // 3-3. 컬럼 추가
                for (var i = 0; i < tarColumns.count; i++) {
                    clone = tarColumns[i].clone(_this);
                    clone.name = tarColumns[i].alias;
                    _this.columns.add(clone);
                }
                // 3-4. 로우 추가 (idx)
                for (var i = 0; i < tempRows.length; i++) {
                    newRow = _this.newRow();
                    for (var ii = 0; ii < _this.columns.count; ii++) {
                        alias = _this.columns[ii].alias;
                        if (tempRows[i][alias]) {                         // 원본 로우
                            newRow[alias] = tempRows[i][alias];
                            continue;
                        }else newRow[alias] = tarRows[i][alias]; // 타겟 로우
                    }
                    _this.rows.add(newRow, p_matchType);
                }     
                // 3-5. 타겟 로우가 클 경우 로우 추가
                if (tempRows.length < tarRows.count) {
                    for (var i = tempRows.length; i < tarRows.count; i++) {
                        newRow = _this.newRow();
                        for (var ii = 0; ii < _this.columns.count; ii++) {
                            alias = _this.columns[ii].alias;
                            if (tarRows[i][alias]) newRow[alias] = tarRows[i][alias];
                        }
                        _this.rows.add(newRow, p_matchType);
                    }
                }
            }
        };
        /**
         * 엔티티의 지정한 컬럼과 조건의 row 를 조회
         * @param {function | array<string>| arguments<string>} p_filter 필터
         * @param {array<string> | arguments<string>} [p_args] filter 설정시 컬럼명
         * @returns {MetaView}
         */
        BaseEntity.prototype.select  = function(p_filter, p_args) {
            var args = Array.prototype.slice.call(arguments);
            var _this = this;
            var MetaView;
            var columnNames = [];
            var callback;
            var view;
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
                return this._buildEntity(view, callback, columnNames);
            } catch (error) {
                throw new ExtendError(/EL05336/, error, []);
            }
        };
        /**
         * 객체(직렬화) 로드
         * 불러오기/가져오기 (!! 병합용도가 아님)
         * 기존을 초기화 하고 불러오는 역활
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
         * @param {number} [p_vOpt] 옵션 (0, 1, 2)
         * @param {function} [p_stringify] 파서출력 사용자 함수
         * @param {string} [p_space] 공백
         * @returns {string}
         */
        BaseEntity.prototype.output = function(p_vOpt, p_stringify, p_space) {
            var rObj;
            var str;
            rObj = this.getObject(p_vOpt);
            if (typeof p_stringify === 'function') str = p_stringify(rObj, {space: p_space} );
            else str = JSON.stringify(rObj, null, p_space);
            return str;
        };
        /**
         * object 로 읽기   
         * JSON 스키마 규칙   
         * { table: { columns: {}, rows: {} }}   
         * { columns: {...}, rows: {} }
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
                } else {    // REVIEW: entity, table 필요성 검토
                    if (p_obj['entity']) entity = p_obj['entity'];
                    else if (p_obj['table']) entity = p_obj['table'];
                    else entity = p_obj;
                    if (entity.viewName) this.viewName = entity.viewName;
                    if (entity.tableName) this.tableName = entity.tableName;
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
                this._readSchema(obj, p_createRow);
            } catch (error) {
                throw new ExtendError(/EL0535A/, error, []);
            }
        };        
        /**
         * 존재하는 로우만 읽기
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
            schema.rows = [];
            return schema;                
        };
        /**
         * 엔티티 데이터(로우)를 스키마 타입의 객체로 쓰기
         * @param {number} p_vOpt 기본 = 0
         * @returns {object} 스키마 타입
         */
        BaseEntity.prototype.writeData  = function(p_vOpt) {
            var vOpt = p_vOpt || 0;
            var schema;
            schema = this.write(vOpt);
            schema.columns = {};
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
            });
            if (!typeCheck) throw new ExtendError(/EL05338/, null, []);
            if (this.columns.every(function(elem) {
                if (typeof elem.valid(elem.value) === 'undefined') return true;
            })) return true;
            else return false;
        };
        /** 
         * 엔티티 복제
         * @abstract 
         * @returns {BaseEntity} 복제한 객체
         */
        BaseEntity.prototype.clone = function() {
            throw new ExtendError(/EL05337/, null, []);
        };
        /** 
         * 엔티티 복사
         * @abstract 
         * @returns {BaseEntity} 복사한 뷰 객체
         */
        BaseEntity.prototype.copy = function() {
            throw new ExtendError(/EL05348/, null, []);
        };
        return BaseEntity;
    }(MetaElement));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.BaseEntity = BaseEntity;
    _global._L.Meta.Entity.BaseEntity = BaseEntity;
}(typeof window !== 'undefined' ? window : global));
/**** meta-table.js | _L.Meta.Entity.MetaTable, _L.Meta.Entity.MetaTableCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;                       
    var ExtendError                = _global._L.ExtendError;                   
    var Type                       = _global._L.Type;                          
    var Util                       = _global._L.Util;                          
    var MetaRegistry               = _global._L.MetaRegistry;                  
    var ITransaction               = _global._L.ITransaction;                  
    var PropertyCollection         = _global._L.PropertyCollection;            
    var MetaObject                 = _global._L.MetaObject;                    
    var BaseEntity                 = _global._L.BaseEntity;                    
    var MetaTableColumnCollection  = _global._L.MetaTableColumnCollection;     
    var ExtendError                = _global._L.ExtendError;                   
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof ITransaction === 'undefined') throw new Error(Message.get('ES011', ['ITransaction', 'i-transaction']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (typeof BaseEntity === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));
    if (typeof MetaTableColumnCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaTableColumnCollection', 'meta-column']));
    //==============================================================
    // 3. module implementation   
    var MetaTable  = (function (_super) {
        /**
         * 테이블 엔티티
         * @constructs _L.Meta.Entity.MetaTable
         * @extends _L.Meta.Entity.BaseEntity
         * @param {string} p_name 테이블명
         */
        function MetaTable(p_name) {
            _super.call(this, p_name);
            var columns  = new MetaTableColumnCollection(this);
            /**
             * 테이블 이름
             * @member {string} _L.Meta.Entity.MetaTable#tableName
             */
            Object.defineProperty(this, 'tableName', 
            {
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
             * @member {MetaTableColumnCollection} _L.Meta.Entity.MetaTable#columns
             */
            Object.defineProperty(this, 'columns', 
            {
                get: function() { return columns; },
                set: function(nVal) { 
                    if (!(nVal instanceof MetaTableColumnCollection)) throw new ExtendError(/EL05412/, null, []);
                    if (this.rows.count > 0) throw new ExtendError(/EL05413/, null, [this.constructor.name, this.rows.count]);
                    columns = nVal;
                },
                configurable: false,
                enumerable: true
            });
        }
        Util.inherits(MetaTable, _super);
        MetaTable._UNION = [ITransaction];
        MetaTable._NS = 'Meta.Entity';      // namespace
        MetaTable._PARAMS = ['name'];       // creator parameter
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
        MetaTable.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            obj['tableName'] = this.tableName;
            return obj;                        
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
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
         * @returns {MetaTable}
         */
        MetaTable.prototype.clone  = function() {
            var clone = new MetaTable(this.tableName);
            // columns 복제본 추가
            for(var i = 0; i < this.columns.count; i++) {
                clone.columns.add(this.columns[i].clone(clone));
            }
            // rows 복제본 추가
            for(var i = 0; i < this.rows.count; i++) {
                clone.rows.add(this.rows[i].clone(clone));
            }
            return clone;
        };
        /**
         * 엔티티를 복사한다. (조회 후 복제)
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
            var entity = new MetaTable(this.tableName, this);
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
         * @returns {array<object>}
         */
        MetaTable.prototype.getChanges  = function() {
            return this.rows._transQueue.select();
        };
        return MetaTable;
    }(BaseEntity));
     var MetaTableCollection  = (function (_super) {
        /**
         * 메타 테이블 컬렉션
         * @constructs _L.Meta.Entity.MetaTableCollection
         * @extends _L.Collection.PropertyCollection
         * @param {object} p_owner 소유자 
         */
        function MetaTableCollection(p_owner) {   // COVER:
            _super.call(this, p_owner);
            var _baseType = MetaTable;
            /**
             * 기본 생성 타입
             * @member {BaseColumnCollection} _L.Meta.Entity.MetaTableCollection#_baseType
             */
            Object.defineProperty(this, '_baseType', 
            {
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.MetaTable = MetaTable;
    _global._L.MetaTableCollection = MetaTableCollection;
    _global._L.Meta.Entity.MetaTable = MetaTable;
    _global._L.Meta.Entity.MetaTableCollection = MetaTableCollection;
}(typeof window !== 'undefined' ? window : global));
/**** meta-view.js | _L.Meta.Entity.MetaView, _L.Meta.Entity.MetaViewCollection ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;                   
    var ExtendError                = _global._L.ExtendError;               
    var Type                       = _global._L.Type;                      
    var Util                       = _global._L.Util;                      
    var PropertyCollection         = _global._L.PropertyCollection;        
    var MetaObject                 = _global._L.MetaObject;                
    var BaseEntity                 = _global._L.BaseEntity;                
    var MetaRegistry               = _global._L.MetaRegistry;              
    var MetaViewColumnCollection   = _global._L.MetaViewColumnCollection;  
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (typeof BaseEntity === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));
    if (typeof MetaViewColumnCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaViewColumnCollection', 'meta-column']));
    //==============================================================
    // 3. module implementation   
    var MetaView  = (function (_super) {
        /**
         * 메타 뷰
         * @constructs _L.Meta.Entity.MetaView
         * @extends _L.Meta.Entity.BaseEntity
         * @param {string} p_name 뷰이름
         * @param {BaseEntity} [p_baseEntity] 기본 엔티티, 컬럼 추가시 기본엔티티에 추가 된다.
         */
        function MetaView(p_name, p_baseEntity) {
            _super.call(this, p_name);
            var _baseEntity;
            var columns = new MetaViewColumnCollection(this);
            /**
             * 메타 뷰 이름
             * @member {string} _L.Meta.Entity.MetaView#viewName
             */
            Object.defineProperty(this, 'viewName', 
            {
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
             * @member {MetaViewColumnCollection} _L.Meta.Entity.MetaView#columns
             */
            Object.defineProperty(this, 'columns', 
            {
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
             * @member {MetaViewColumnCollection} _L.Meta.Entity.MetaView#_baseEntity
             */
            Object.defineProperty(this, '_baseEntity', 
            {
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
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            // var origin = p_origin ? p_origin : obj;
            obj['viewName'] = this.viewName;
            if (vOpt < 2 && vOpt > -1 && this._baseEntity) {
                obj['_baseEntity'] = MetaRegistry.createReferObject(this._baseEntity);
            }
            return obj;                  
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.  
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
         * @returns {MetaView}
         */
        MetaView.prototype.clone  = function() {
            var clone = new MetaView(this.viewName, this._baseEntity);  // 뷰를 복제하면 참조타입 >> 엔티티타입으로 변경
            for(var i = 0; i < this.columns.count; i++) {
                if (this.columns[i]._entity === this) clone.columns.add(this.columns[i].clone(clone));
                else clone.columns.add(this.columns[i].clone());
            }
            for(var i = 0; i < this.rows.count; i++) {
                clone.rows.add(this.rows[i].clone(clone));
            }
            return clone;
        };
        /**
         * 엔티티를 복사한다. (조회 후 복제)
         * @param {overload}            type1
         * @param {function}            type1.p_filter 로우 필터 함수
         * @param {arguments<string>}   type1.p_args 컬럼명
         * @param {overload}            type2
         * @param {string}              type2.p_columns 컬럼명
         */
        MetaView.prototype.copy  = function(p_filter, p_args) {
            var args = Array.prototype.slice.call(arguments);
            var _this = this;
            var items = [];
            var callback = null;
            var entity = new MetaView(this.viewName, this);
            var orignal = this.clone();
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
    var MetaViewCollection  = (function (_super) {
        /**
         * 뷰 엔티티 컬렉션
         * @constructs _L.Meta.Entity.MetaViewCollection
         * @extends _L.Meta.Entity.PropertyCollection
         * @param {object} p_owner 소유자 
         */
        function MetaViewCollection(p_owner) {    // COVER:
            _super.call(this, p_owner);
            var _baseType = MetaView;
            /**
             * 기본 생성 타입
             * @member {MetaView} _L.Meta.Entity.MetaViewCollection#_baseType
             */
            Object.defineProperty(this, '_baseType', 
            {
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
         * @param {string | MetaView} p_view 추가할 뷰
         * @param {BaseColumnCollection} [p_baseEntity] 기본 컬럼 컬렉션
         * @returns {MetaView} 등록한 아이템
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.MetaView = MetaView;
    _global._L.MetaViewCollection = MetaViewCollection;
    _global._L.Meta.Entity.MetaView = MetaView;
    _global._L.Meta.Entity.MetaViewCollection = MetaViewCollection;
}(typeof window !== 'undefined' ? window : global));
/**** meta-set.js | _L.Meta.Entity.MetaSet ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Util                       = _global._L.Util;                  
    var ISchemaControl             = _global._L.ISchemaControl;        
    var IImportControl             = _global._L.IImportControl;        
    var IExportControl             = _global._L.IExportControl;        
    var ISerialize                 = _global._L.ISerialize;            
    var ITransaction               = _global._L.ITransaction;          
    var MetaElement                = _global._L.MetaElement;           
    var BaseEntity                 = _global._L.BaseEntity;            
    var MetaTableCollection        = _global._L.MetaTableCollection;   
    var MetaViewCollection         = _global._L.MetaViewCollection;    
    var MetaRegistry               = _global._L.MetaRegistry;          
    //==============================================================
    // 2. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof ISchemaControl === 'undefined') throw new Error(Message.get('ES011', ['ISchemaControl', 'i-control-schema']));
    if (typeof IImportControl === 'undefined') throw new Error(Message.get('ES011', ['IImportControl', 'i-control-import']));
    if (typeof IExportControl === 'undefined') throw new Error(Message.get('ES011', ['IExportControl', 'i-control-export']));
    if (typeof ISerialize === 'undefined') throw new Error(Message.get('ES011', ['ISerialize', 'i-serialize']));
    if (typeof ITransaction === 'undefined') throw new Error(Message.get('ES011', ['ITransaction', 'i-transaction']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (typeof MetaElement === 'undefined') throw new Error(Message.get('ES011', ['MetaElement', 'meta-element']));
    if (typeof BaseEntity === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));
    if (typeof MetaTableCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaTableCollection', 'meta-table']));
    if (typeof MetaViewCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaViewCollection', 'meta-view']));
    //==============================================================
    // 3. module implementation   
    var MetaSet  = (function (_super) {
        /**
         * 메타셋
         * @constructs _L.Meta.Entity.MetaSet
         * @extends _L.Meta.MetaElement
         * @implements {_L.Interface.ISchemaControl}
         * @implements {_L.Interface.IImportControl}
         * @implements {_L.Interface.IExportControl}
         * @implements {_L.Interface.ITransaction}
         * @implements {_L.Interface.ISerialize}
         * @param {string} p_name 메타셋 이름
         */
        function MetaSet(p_name) {
            _super.call(this, p_name);
            var tables = new MetaTableCollection(this);
            var views  = new MetaViewCollection(this);
            /**
             * 테이블 이름
             * @member {string} _L.Meta.Entity.MetaSet#setName
             */
            Object.defineProperty(this, 'setName', 
            {
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
             * @readonly
             * @member {MetaTableCollection} _L.Meta.Entity.MetaSet#tables
             */
            Object.defineProperty(this, 'tables', 
            {
                get: function() { return tables; },
                configurable: false,
                enumerable: true
            });
            /**
             * 메타 뷰 컬렉션
             * @readonly
             * @member {MetaViewCollection} _L.Meta.Entity.MetaSet#views
             */
            Object.defineProperty(this, 'views', 
            {
                get: function() { return views; },
                configurable: false,
                enumerable: true
            });
            /**
             * 트랜젝션 사용 유무 (기본값: 사용 false)
             * @member {boolean}  _L.Meta.Entity.MetaSet#autoChanges
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
         * @returns {MetaSet}
         */
        MetaSet.prototype.clone  = function() {
            var clone = new MetaSet(this.setName);
            for(var i = 0; i < this.tables.count; i++) {
                clone.tables.add(this.tables[i].clone());
            }
            for(var i = 0; i < this.views.count; i++) {
                clone.views.add(this.views[i].clone());
            }
            return clone;
        };
        /**
         * 모든 view 와 모든 table 의 row 를 초기화
         */
        MetaSet.prototype.clear  = function() {
            for(var i = 0; i < this.tables.count; i++) this.tables[i].clear();
            for(var i = 0; i < this.views.count; i++) this.views[i].clear();
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
         * @param {object | string} p_obj 불러오기 대상
         * @param {function} [p_parse] 파서
         */
        MetaSet.prototype.load = function(p_obj, p_parse) {
            var obj = p_obj;
            var mObj;
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
         * @param {number} [p_vOpt] 옵션 (0, 1, 2)
         * @param {function} [p_stringify] 파서출력 함수
         * @param {string} [p_space] 공백
         * @returns {string}
         */
        MetaSet.prototype.output = function(p_vOpt, p_stringify, p_space) {
            var rObj = this.getObject(p_vOpt);
            var str;
            if (typeof p_stringify === 'function') str = p_stringify(rObj, {space: p_space} );
            else str = JSON.stringify(rObj, null, p_space);
            return str;
        };
        /**
         * object 로 로딩하기   
         * JSON 스키마 규칙   
         * { table: { columns: {}, rows: {} }}   
         * { columns: {...}, rows: {} }
         * @param {object} p_obj mObject 또는 rObject 또는 entity
         * @param {Number} [p_option=3] 기본값  = 3
         * @param {Number} p_option.1 컬럼(구조)만 가져온다. 
         * @param {Number} p_option.2 로우(데이터)만 가져온다 (컬럼 참조)  
         * @param {Number} p_option.3 컬럼/로우를 가져온다. 로우만 존재하면 로우 이름의 빈 컬럼을 생성한다. 
         */
        MetaSet.prototype.read  = function(p_obj, p_opt) {
            var opt = typeof p_opt === 'undefined' ? 3 : p_opt;
            var entity;
            if (typeof p_obj !== 'object' || p_obj === null) throw new ExtendError(/EL05456/, null, [typeof p_obj]);
            if (typeof opt !== 'number') throw new ExtendError(/EL05457/, null, [typeof opt]);
            if (p_obj instanceof MetaSet) {
                this.setName = p_obj.setName;
                for (var i = 0; i < p_obj.tables.count; i++) {
                    var key = p_obj.tables.indexToKey(i);
                    if (this.tables.keyToIndex(key) < 0) this.tables.add(key);
                    entity = this.tables[key];
                    entity._readEntity(p_obj.tables[key], p_opt);
                }
                for (var i = 0; i < p_obj.views.count; i++) {
                    var key = p_obj.views.indexToKey(i);
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
         * @param {object} p_obj object<Schema> | object<Guid>
         * @param {boolean} p_createRow true 이면, row[0] 기준으로 컬럼을 추가함
         */
        MetaSet.prototype.readSchema  = function(p_obj, p_createRow) {
            var _this = this;
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
                    for (var i = 0; i < entity['$key'].length; i++) {
                        $addEntity(entity['$key'][i], entity, this.views);
                    }
                } else for (var key in entity) $addEntity(key, entity, this.views);
            }
            return;
            // inner funciton
            function $addEntity(key, p_collec, p_baseCollec) {
                var prop = p_collec[key];
                if (!p_baseCollec.exist(key)) p_baseCollec.add(key);
                MetaRegistry.setMetaObject(prop, p_baseCollec[key]);                 
                p_baseCollec[key]._readSchema(p_collec[key], p_createRow, obj);                    
            }
        };
        /**
         * row 들을 불러 온다
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
                    if (Object.prototype.hasOwnProperty.call(p_entity, key) && p_collec.exist(key)) {
                        p_collec[key].readData(p_entity[key]);
                    }
                }
            }
        };
        /**
         * 메타셋을 스키마 타입의 객체로 쓰기(내보내기)
         * @param {number} p_vOpt 옵션
         * @returns {object} 스키마 타입
         */
        MetaSet.prototype.write  = function(p_vOpt) {
            var vOpt = p_vOpt || 0;
            var oSch;
            var oGuid = this.getObject(p_vOpt);
            return MetaSet.transformSchema(oGuid);
        };
        /**
         * 메타셋 스키마(컬럼)을 스키마 타입의 객체로 쓰기
         * @param {number} p_vOpt 옵션
         * @returns {object} 스키마 타입
         */
        MetaSet.prototype.writeSchema  = function(p_vOpt) {
            var vOpt = p_vOpt || 0;
            var schema = this.write(vOpt);
            for (var prop in schema.tables) {
                if (prop.indexOf('$') < 0) schema.tables[prop].rows = [];
            }
            for (var prop in schema.views) {
                if (prop.indexOf('$') < 0) schema.views[prop].rows = [];
            }
            return schema;
        };
        /**
         * 메타셋 데이터(로우)를 스키마 타입의 객체로 쓰기
         * @param {number} p_vOpt 옵션
         * @returns {object} 스키마 타입
         */
        MetaSet.prototype.writeData  = function(p_vOpt) {
            var vOpt = p_vOpt || 0;
            var schema = this.write(vOpt);
            for (var prop in schema.tables) {
                if (prop.indexOf('$') < 0) schema.tables[prop].columns = {};
            }
            for (var prop in schema.views) {
                if (prop.indexOf('$') < 0) schema.views[prop].columns = {};
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.MetaSet = MetaSet;
    _global._L.Meta.Entity.MetaSet = MetaSet;
}(typeof window !== 'undefined' ? window : global));
/**** message-code.js | _L.messageCode.bind ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    //==============================================================
    // 2. module dependency check
    //==============================================================
    var messageCode = {
        en: {},
        ko: {
            // Common.*
            EL01610: '',
            EL01611: 'validSelector(selector); document 객체가 필요합니다.',
            EL01612: 'loadScript(url, callback); url 이 string 타입이 아닙니다.',
            EL01613: 'loadScript(url, callback); document 객체가 필요합니다.',
            EL01614: '',
            // Interface.*
            // i-bind.js
            EL02310: '',
            EL02311: 'addColumn() 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-bind-model.js
            EL02320: '',
            EL02321: '',
            // i-bind-command.js
            EL02330: '',
            EL02331: 'execute() 은 추상메소드 입니다. [$1] 을 구현해야 합니다.',
            // i-command-callback.js
            EL02340: '',
            EL02341: '',
            // i-model-callback.js
            EL02350: '',
            EL02351: '',
            // i-service.js
            EL02360: '',
            EL02361: '',
            // i-service-ajax.js
            EL02370: '',
            EL02371: '',
            // Meta.Entity.*
            // html-column.js
            EL054600: '',
            EL054601: '$1.domType 는 object 타입입니다.',
            EL054602: '$1.isReadOnly 는 boolean 타입입니다.',
            EL054603: '$1.isHide 는 boolean 타입입니다.',
            EL054604: '$1.element 는 object 타입입니다.',
            EL054605: '$1.selector 타입은 string | {key: string, type: string } 입니다.',
            EL054606: '$1.getFilter 는 function 타입입니다.',
            EL054607: '$1.setFilter 는 function 타입입니다.',
            EL054608: '$1.value 얻을 때 selector type=\'prop\'는 하위속성명($2.속성명)을 지정해야 합니다.',
            EL054609: '$1.value 얻을 때 selector type=\'attr\'는 하위속성명($2.속성명)을 지정해야 합니다.',
            EL054610: '$1.value 얻을 때 selector type=\'css\'는 하위속성명($2.속성명)을 지정해야 합니다.',
            EL054611: '$1.value 얻을 때 selector type=\'value\' | \'val\' | \'text\' | \'prop\' | \'attr\' | \'css\' 타입만 가능합니다.',
            EL054612: '$1.value 설정할 때 number, string, boolean 타입만 가능합니다.',
            EL054613: '$1.value 설정할 때 selector type=\'prop\'는 하위속성명($2.속성명)을 지정해야 합니다.',
            EL054614: '$1.value 설정할 때 selector type=\'attr\'는 하위속성명($2.속성명)을 지정해야 합니다.',
            EL054615: '$1.value 설정할 때 selector type=\'css\'는 하위속성명($2.속성명)을 지정해야 합니다.',
            EL054616: '$1.value 설정할 때 selector type=\'value\' | \'val\' | \'text\' | \'prop\' | \'attr\' | \'css\' 타입만 가능합니다.',
            EL054617: '',
            // Meta.Entity.Bind.*
            EL06100: '',
            // base-bind.js
            EL06110: '',
            EL06111: '$1._baseTable [MetaTable] 인스턴스가 아닙니다. ',
            EL06112: '$1.onExecute 는  \'function\' 타입입니다.',
            EL06113: '$1.onExecuted 는  \'function\' 타입입니다.',
            EL06114: 'addColumn() 은 추상메소드 입니다. [$1] 을 상속해서 구현해야 합니다.',
            // bind-model.js
            EL061200: '',
            EL061201: '$1._tables 값이 [MetaTableCollection] 타입이 아닙니다.',
            EL061202: '$1._columnType 값이 [MetaColumn] 의 자식(proto chain)이 아닙니다.',
            EL061203: '$1.items 값이 [PropertyCollection] 타입이 아닙니다.',
            EL061204: '$1.fn 값이 [PropertyCollection] 타입이 아닙니다.',
            EL061205: '$1.command 값이 [PropertyCollection] 타입이 아닙니다.',
            EL061206: '$1.cbFail 는  \'(msg: stirng, valid: MetaView) => void\' 타입입니다.',
            EL061207: '$1.cbError 는  \'(msg: string, status: number, response: object) => void\' 타입입니다.',
            EL061208: '$1.cbBaseBegin 는  \'(cmd: BaseBindCommand) => void\' 타입입니다.',
            EL061209: '$1.cbBaseValid 는  \'(valid: MetaView, cmd: BaseBindCommand) => boolean\' 타입입니다.',
            EL061210: '$1.cbBaseBind 는  \'(view: MetaView, cmd: BaseBindCommand, config: object) => void\' 타입입니다.',
            EL061211: '$1.cbBaseResult 는  \'(data: object, cmd: BaseBindCommand, res: object) => object\' 타입입니다.',
            EL061212: '$1.cbBaseOutput 는  \'(views: MetaViewColleciton, cmd: BaseBindCommand, res: object) => void\' 타입입니다.',
            EL061213: '$1.cbBaseEnd 는  \'(status: number, cmd: BaseBindCommand, res: object) => void\' 타입입니다.',
            EL061214: '$1.preRegister 는  \'(bm: BaseBindModel) => void\' 타입입니다.',
            EL061215: '$1.preCheck 는  \'(bm: BaseBindModel) => boolean\' 타입입니다.',
            EL061216: '$1.preReady 는  \'(bm: BaseBindModel) => void\' 타입입니다.',
            EL061217: '컬럼 이름은 \'string\' 타입이 아닙니다. typeof columnName = $1',
            EL061218: '_readItem(item, bEntity); item 은 string | string[] 타입이 입니다.',
            EL061219: '_readItem(); 대상 table 이 존재하지 않습니다.',
            EL061220: '_readItem(); 대상 table 이 [MetaTable] 타입이 아닙니다.',
            EL061221: '_readItem(); 컬럼 생성이 실패 하였습니다.',
            EL061222: 'setObject(oGuid, origin); oGuid.[\'_baseTable\'] $set 조회가 실패하였습니다. guid = $1',
            EL061223: 'setObject(oGuid, origin); oGuid.[\'_baseTable\'] guid 를 찾을 수 없습니다. guid = $1' ,
            EL061224: 'addTable(name); name 는 \'string\' 타입입니다. typeof name = $1',
            EL061225: 'addTable(name); name 값 \'$1\' 는 예약어 입니다.',
            EL061226: 'addTable(name); name 값 \'$1\' 이 기존 이름과 중복이 발생했습니다.',
            EL061227: 'addColumn(column, cmds, views, bTable); column 은 string | MetaColumn 타입입니다.',
            EL061228: 'addColumn(column, cmds, views, bTable); cmds 은 string | string[] 타입입니다.',
            EL061229: 'addColumn(column, cmds, views, bTable); 대상 테이블이 존재하지 않습니다.',
            EL061230: 'addColumn(column, cmds, views, bTable); cmds[$1] 가 string 타입이 아닙니다. typeof cmds[$1] = \'$2\'',
            EL061231: 'addColumn(column, cmds, views, bTable); 대상 command 가 존재하지 않습니다. cmds[$1] = \'$2\'',
            EL061232: 'addColumnValue(name, value, cmds, views, bTable); name 는 \'string\' 타입입니다. typeof name = $1',
            EL061233: 'addColumnValue(name, value, cmds, views, bTable); 대상 테이블이 존재하지 않습니다.',
            EL061234: 'mapping 이 PropertyCollection | object 타입이 아닙니다.',
            EL061235: '대상 테이블이 존재하지 않습니다.',
            EL061236: '\'$1\' 이름의 column 또는 item 이 존재하지 않습니다.',   // REVIEW: 제거함
            EL061237: 'setMapping(mapping, bTable); 매핑이 실패하였습니다.',
            EL061238: 'addCommand() 은 추상메소드 입니다. [$1] 을 상속해서 구현해야 합니다.',
            EL061239: 'tables 은 string | string[] 타입입니다.',
            EL061240: 'setService(service, passChk); 서비스 설정이 실패하였습니다.',    // REVIEW: 제거함
            EL061241: 'command 의 views 는 string[] 타입입니다. typeof views == $1',
            EL061242: '',
            // bind-command.js
            EL061300: '',
            EL061301: '$1.valid [MetaView] 인스턴스가 아닙니다. ',
            EL061302: '$1.bind [MetaView] 인스턴스가 아닙니다. ',
            EL061303: '$1.outputOption 타입은 number | {option: number, index: number | number[] } 입니다.',
            EL061304: '$1.cbBegin 는  \'(cmd: BaseBindCommand) => void\' 타입입니다.',
            EL061305: '$1.cbValid 는  \'(valid: MetaView, cmd: BaseBindCommand) => boolean\' 타입입니다.',
            EL061306: '$1.cbBind 는  \'(view: MetaView, cmd: BaseBindCommand, config: object) => void\' 타입입니다.',
            EL061307: '$1.cbResult 는  \'(data: object, cmd: BaseBindCommand, res: object) => object\' 타입입니다.',
            EL061308: '$1.cbOutput 는  \'(views: MetaViewColleciton, cmd: BaseBindCommand, res: object) => void\' 타입입니다.',
            EL061309: '$1.cbEnd 는  \'(status: number, cmd: BaseBindCommand, res: object) => void\' 타입입니다.',
            EL061310: '컬럼 이름은 \'string\' 타입이 아닙니다. typeof columnName = $1',
            EL061311: 'output[\'$1\'] 설정은 MetaView 타입만 가능합니다.',
            EL061312: 'setObject(oGuid, origin); oGuid.[\'_baseTable\'] $set 조회가 실패하였습니다. guid = $1',
            EL061313: 'setObject(oGuid, origin); oGuid.[\'_baseTable\'] guid 를 찾을 수 없습니다. guid = $1' ,
            EL061314: 'setObject(oGuid, origin); oGuid.[\'_model\'] $set 조회가 실패하였습니다. guid = $1',
            EL061315: 'execute() 은 추상메소드 입니다. [$1] 을 상속해서 구현해야 합니다.',
            EL061316: 'addColumn(column, views, bTable); column 은 string | MetaColumn 타입입니다.',
            EL061317: 'addColumn(column, views, bTable); views 은 string | string[] 타입입니다.',
            EL061318: 'addColumn(column, views, bTable); 대상 테이블이 존재하지 않습니다.',
            EL061319: 'addColumn(column, views, bTable); views[$1] 가 string 타입이 아닙니다. typeof views[$1] = \'$2\'',
            EL061320: 'addColumn(column, views, bTable); 대상 views 가 존재하지 않습니다. views[$1] = \'$2\'',
            EL061321: 'addColumnValue(name, value, views, bTable); name 는 \'string\' 타입입니다. typeof name = $1',
            EL061322: 'addColumnValue(name, value, views, bTable); 대상 테이블이 존재하지 않습니다.',
            EL061323: 'setColumn(names, views, bTable); names 은 string | string[] 타입입니다.',
            EL061324: 'setColumn(names, views, bTable); names[$1] 은 string 타입이 아닙니다. typeof names[$1] = \'$2\'',
            EL061325: 'setColumn(name, value, views, bTable); 대상 테이블이 존재하지 않습니다.',
            EL061326: 'setColumn(name, value, views, bTable); 대상 테이블에 컬럼($1)이 존재하지 않습니다.',
            EL061327: 'release(names, views); names 은 string | string[] 타입입니다.',
            EL061328: 'release(names, views); views 은 string | string[] 타입입니다.',
            EL061329: 'release(names, views); views[$1] 은 string 타입이 아닙니다. typeof views[$1] = \'$2\'',
            EL061330: 'release(names, views); \'$1\' 이름의 view($1) 가 존재하지 않습니다.',
            EL061331: 'newOutput(name); name 은 string 타입이 아닙니다. typeof name = \'$1\'',
            EL061332: 'newOutput(name); name 값 \'$1\' 이 기존 이름과 중복이 발생했습니다.',
            EL061333: 'removeOutput(name); name 은 string 타입이 아닙니다. typeof name = \'$1\'',
            EL061334: 'removeOutput(name); 기본 제공되는 output($1) 은 삭제할 수 없습니다.',
            EL061335: 'removeOutput(names); \'$1\' 이름의 view($1) 가 존재하지 않습니다.',
            EL061336: '',
            // empty
            EL06140: '',
            // bind-model.js
            EL06150: '',
            EL06151: '$1.baseConfig 는 object 타입입니다.',
            EL06152: '$1.url 는 string 타입입니다.',
            EL06153: 'checkSelector(collection, viewLog); collection 이 [PropertyCollection] 타입이 아닙니다.',
            EL06154: 'getSelector(collection); collection 이 [PropertyCollection] 타입이 아닙니다.',
            EL06155: 'addCommand(name, opt, bTable); name 은 string 타입이 아닙니다. typeof name = \'$1\'',
            EL06156: 'addCommand(name, opt, bTable); 커멘드 추가가 실패하였습니다.',
            EL06157: 'setService(service, passChk); 서비스 설정이 실패하였습니다.',
            EL06158: '',
            // bind-command-ajax.js
            EL06160: '',
            EL06161: '$1.config 는 object 타입입니다.',
            EL06162: '$1.url 는 string 타입입니다.',
            EL06163: '_execOutput(data, res); data 가 object | array 타입이 아닙니다. typeof data = \'$1\'',
            EL06164: '_execOutput(data, res); outputOption.index[$1] 값이 number 가 아닙니다. typeof outputOption.index[$1] = \'$2\'',
            EL06165: '_execOutput(data, res); _output[$1].columns 에 컬럼이 존재하지 않습니다.',
            EL06166: '_execOutput(data, res); _output[$1].rows 에 [$2]번째 로우가 존재하지 않습니다.',
            EL06167: '',
        }
    };
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.messageCode          = _global._L.messageCode || {};
    _global._L.messageCode.bind     = messageCode;
}(typeof window !== 'undefined' ? window : global));
/**** message-wrap.js | _L.Common.Message ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                = _global._L.Message;                       
    var messageCode            = _global._L.messageCode.bind;              
    //==============================================================
    // 2. module dependency check
    //==============================================================
    // 3. module implementation       
    Message.$storage = messageCode;
    //==============================================================
    // 4. module export
}(typeof window !== 'undefined' ? window : global));
/**** util-wrap.js | _L.Common.Util ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Util                       = _global._L.Util;              
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    //==============================================================
    // 3. module implementation
    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }
    /**
     * 셀렉터의 유효성 검사 : 대상을 모두 검사하여 결과를 리턴한다.
     * 주의!! DOM(web) 에서만 작동한다.
     * @param {string} p_selector 
     * @returns {string} 없는 셀렉터, 통화하면 null 리턴
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
            script.addEventListener("load", function(event) { if(typeof callback == "function"){ callback(); }});
        }
        head.appendChild(script);
    };
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Common        = _global._L.Common || {};
    _global._L.Util = Util;
    _global._L.Common.Util = Util;
}(typeof window !== 'undefined' ? window : global));
/**** i-bind.js | _L.Interface.IBind ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IBind  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IBind
         * @interface
         */
        function IBind() {
            /**
             * 실행 전 이벤트
             * @member {MetaTable} _L.Interface.IBind#_baseTable
             */
            this._baseTable = [['_any_']];
        }
        IBind._NS = 'Interface';    // namespace
        IBind._KIND = 'interface';
        /**
         * 대상을 내보냅니다. (쓰기)
         * @returns {any}
         * @abstract
         */
        IBind.prototype.addColumn  = function() {
            throw new ExtendError(/EL02311/, null, ['IBind']);
        };
        return IBind;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface        = _global._L.Interface || {};    
    _global._L.IBind = IBind;
    _global._L.Interface.IBind = IBind;
}(typeof window !== 'undefined' ? window : global));
/**** i-bind-command.js | _L.Interface.IBindCommand ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IBindCommand  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IBindCommand
         * @interface
         */
        function IBindCommand() {
            /**
             * 유효성 뷰
             * @member {MetaView} _L.Interface.IBindCommand#valid
             */
            this.valid = {};
            /**
             * 바인드 뷰
             * @member {MetaView} _L.Interface.IBindCommand#bind
             */
            this.bind = {};
            /**
             * 출력 뷰
             * @member {MetaView} _L.Interface.IBindCommand#output
             */
            this.output = {};
            /**
             * 출력 옵션
             * @member {object} _L.Interface.IBindCommand#outputOption
             */
            this.outputOption = {option: Number, index: [[ [Number], Number ]]};
        }
        IBindCommand._NS = 'Interface';    // namespace
        IBindCommand._KIND = 'interface';
        /**
         * 대상을 내보냅니다. (쓰기)
         * @returns {any}
         * @abstract
         */
        IBindCommand.prototype.execute  = function() {
            throw new ExtendError(/EL02331/, null, ['IBindCommand']);
        };
        return IBindCommand;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};    
    _global._L.IBindCommand = IBindCommand;
    _global._L.Interface.IBindCommand = IBindCommand;
}(typeof window !== 'undefined' ? window : global));
/**** i-bind-model.js | _L.Interface.IBindModel ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IBindModel  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IBindModel
         * @interface
         */
        function IBindModel() {
            /**
             * 아이템
             * @member {object} _L.Interface.IBindModel#items
             */
            this.items = [[{}]];
            /**
             * 지역 함수
             * @member {object} _L.Interface.IBindModel#fn
             */
            this.fn = [[{}]];
            /**
             * 바인드 명령
             * @member {object} _L.Interface.IBindModel#command
             */
            this.command = [[{}]];
            /**
             * 초기화 이전 등록
             * @member {Function} _L.Interface.IBindModel#preRegister
             */
            this.preRegister = [[Function]];
            /**
             * 초기화 이전 검사
             * @member {Function} _L.Interface.IBindModel#preCheck
             */
            this.preCheck = [[Function]];
            /**
             * 초기화 이전 준비완료
             * @member {Function} _L.Interface.IBindModel#preReady
             */
            this.preReady = [[Function]];
        }
        IBindModel._NS = 'Interface';    // namespace
        IBindModel._KIND = 'interface';
        return IBindModel;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface            = _global._L.Interface || {};    
    _global._L.IBindModel = IBindModel;
    _global._L.Interface.IBindModel = IBindModel;
}(typeof window !== 'undefined' ? window : global));
/**** i-command-callback.js | _L.Interface.ICommandCallback ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var ICommandCallback  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.ICommandCallback
         * @interface
         */
        function ICommandCallback() {
            /**
             * 시작 콜백
             * @member {function} _L.Interface.ICommandCallback#cbBegin
             */
            this.cbBegin = [[Function]];
            /**
             * 유효성 콜백
             * @member {function} _L.Interface.ICommandCallback#cbValid
             */
            this.cbValid = [[Function]];
            /**
             * 바인드 콜백
             * @member {function} _L.Interface.ICommandCallback#cbBind
             */
            this.cbBind = [[Function]];
            /**
             * 결과 콜백
             * @member {function} _L.Interface.ICommandCallback#cbResult
             */
            this.cbResult = [[Function]];
            /**
             * 출력 콜백
             * @member {function} _L.Interface.ICommandCallback#cbOutput
             */
            this.cbOutput = [[Function]];
            /**
             * 실행 종료 콜백
             * @member {function} _L.Interface.ICommandCallback#cbEnd
             */
            this.cbEnd = [[Function]];
        }
        ICommandCallback._NS = 'Interface';    // namespace
        ICommandCallback._KIND = 'interface';
        return ICommandCallback;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                    = _global._L.Interface || {};    
    _global._L.ICommandCallback = ICommandCallback;
    _global._L.Interface.ICommandCallback = ICommandCallback;
}(typeof window !== 'undefined' ? window : global));
/**** i-model-callback.js | _L.Interface.IModelCallback ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    //==============================================================
    // 3. module implementation   
    var IModelCallback  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IModelCallback
         * @interface
         */
        function IModelCallback() {
            /**
             * 실패 콜백
             * @member {function} _L.Interface.IModelCallback#cbFail
             */
            this.cbFail = [[Function]];
            /**
             * 오류 콜백
             * @member {function} _L.Interface.IModelCallback#cbError
             */
            this.cbError = [[Function]];
            /**
             * 기본 시작 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseBegin
             */
            this.cbBaseBegin = [[Function]];
            /**
             * 기본 유효성 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseValid
             */
            this.cbBaseValid = [[Function]];
            /**
             * 기본 바인드 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseBind
             */
            this.cbBaseBind = [[Function]];
            /**
             * 기본 결과 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseResult
             */
            this.cbBaseResult = [[Function]];
            /**
             * 기본 출력 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseOutput
             */
            this.cbBaseOutput = [[Function]];
            /**
             * 기본 실행 종료 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseEnd
             */
            this.cbBaseEnd = [[Function]];
        }
        IModelCallback._NS = 'Interface';    // namespace
        IModelCallback._KIND = 'interface';
        return IModelCallback;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};  
    _global._L.IModelCallback = IModelCallback;
    _global._L.Interface.IModelCallback = IModelCallback;
}(typeof window !== 'undefined' ? window : global));
/**** i-service.js | _L.Interface.IService ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Util                       = _global._L.Util;              
    var IBindModel                 = _global._L.IBindModel;        
    var IModelCallback             = _global._L.IModelCallback;    
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!IBindModel) throw new Error(Message.get('ES011', ['IBindModel', 'i-bind-model']));
    if (!IModelCallback) throw new Error(Message.get('ES011', ['IModelCallback', 'i-model-callback']));
    //==============================================================
    // 3. module implementation   
    var IService  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IService
         * @interface
         */
        function IService() {
            /**
             * 테이블
             * @member {object} _L.Interface.IService#tables
             */
            this.tables = [[ String, [String], {} ]];
            /**
             * 매핑 컬렉션
             * @member {Funciton} _L.Interface.IService#mapping
             */
            this.mapping = [[{}]];
            // TODO: 인터페이스 구현 재정의 해야함
            // IBindModel
            this.items = [[{}]];
            this.fn = [[{}]];
            this.command = [[{}]];
            // this.preRegister = [[Function]];
            // this.preCheck = [[Function]];
            // this.preReady = [[Function]];
            // IModelCallback
            this.cbFail = [[Function]];
            this.cbError = [[Function]];
            this.cbBaseBegin = [[Function]];
            this.cbBaseValid = [[Function]];
            this.cbBaseBind = [[Function]];
            this.cbBaseResult = [[Function]];
            this.cbBaseOutput = [[Function]];
            this.cbBaseEnd = [[Function]];
            /**
             * 초기화 이전 등록
             * @member {Function} _L.Interface.IBindModel#preRegister
             */
            this.preRegister = [[Function]];
            /**
             * 초기화 이전 검사
             * @member {Function} _L.Interface.IBindModel#preCheck
             */
            this.preCheck = [[Function]];
            /**
             * 초기화 이전 준비완료
             * @member {Function} _L.Interface.IBindModel#preReady
             */
            this.preReady = [[Function]];
        }
        IService._UNION = [IBindModel, IModelCallback];
        IService._NS = 'Interface';    // namespace
        IService._KIND = 'interface';
        // /**
        //  * 초기화 전 등록
        //  * @returns {any}
        //  * @abstract
        //  */
        // IService.prototype.preRegister  = function() {
        //     throw new ExtendError(/EL02311/, null, ['IService']);
        // };
        // /**
        //  * 초기화 전 검사
        //  * @returns {any}
        //  * @abstract
        //  */
        // IService.prototype.preCheck  = function() {
        //     throw new ExtendError(/EL02311/, null, ['IService']);
        // };
        // /**
        //  * 초기화 전 준비
        //  * @returns {any}
        //  * @abstract
        //  */
        // IService.prototype.preReady  = function() {
        //     throw new ExtendError(/EL02311/, null, ['IService']);
        // };
        return IService;
    }());
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface            = _global._L.Interface || {};    
    _global._L.IService = IService;
    _global._L.Interface.IService = IService;
}(typeof window !== 'undefined' ? window : global));
/**** i-service-ajax.js | _L.Interface.IAjaxService ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    var Util                       = _global._L.Util;          
    var IService                   = _global._L.IService;      
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!IService) throw new Error(Message.get('ES011', ['IService', 'i-service']));
    //==============================================================
    // 3. module implementation   
    var IAjaxService  = (function (_super) {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IAjaxService
         * @extends  _L.Interface.IService
         * @interface
         */
        function IAjaxService() {
            _super.call(this);
            /**
             * 기본 AJAX Setup 객체
             * @member {object} _L.Interface.IAjaxService#baseConfig
             */
            this.baseConfig = [[{}]];
            /**
             * 기본 요청 url
             * @member {string} _L.Interface.IAjaxService#url
             */
            this.url = [[String]];
        }
        Util.inherits(IAjaxService, _super);
        IAjaxService._NS = 'Interface';    // namespace
        IAjaxService._KIND = 'interface';
        return IAjaxService;
    }(IService));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Interface                = _global._L.Interface || {};   
    _global._L.IAjaxService = IAjaxService;
    _global._L.Interface.IAjaxService = IAjaxService;
}(typeof window !== 'undefined' ? window : global));
/**** html-column.js | _L.Meta.Entity.HTMLColumn ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    var Util                       = _global._L.Util;          
    var MetaColumn                 = _global._L.MetaColumn;    
    var jquery                     = _global.jQuery;           
    // jquery 로딩// Branch:
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!MetaColumn) throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    //==============================================================
    // 3. module implementation
    var HTMLColumn  = (function (_super) {
        /**
         * HTML 컬럼
         * @constructs _L.Meta.Entity.HTMLColumn
         * @extends _L.Meta.Entity.MetaColumn
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
             * @member {*} _L.Meta.Entity.HTMLColumn#domType
             */
            Object.defineProperty(this, 'domType', 
            {
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
             * @member {*} _L.Meta.Entity.HTMLColumn#isReadOnly
             */
            Object.defineProperty(this, 'isReadOnly', 
            {
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
             * @member {*} _L.Meta.Entity.HTMLColumn#isHide
             */
            Object.defineProperty(this, 'isHide', 
            {
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
             * @member {*} _L.Meta.Entity.HTMLColumn#element
             */
            Object.defineProperty(this, 'element', 
            {
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
             * @member {*} _L.Meta.Entity.HTMLColumn#selector
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
            Object.defineProperty(this, 'selector', 
            {
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
             * @member {Function} _L.Meta.Entity.HTMLColumn#getFilter
             */
             Object.defineProperty(this, 'getFilter', 
             {
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
             * @member {Function} _L.Meta.Entity.HTMLColumn#setFilter
             */
              Object.defineProperty(this, 'setFilter', 
              {
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
             * @member {*} _L.Meta.Entity.HTMLColumn#value
             */
            Object.defineProperty(this, 'value', 
            {
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
                        // node 에서는 강제 종료함
                        if (!isNode) {
                            key = this.selector.key;
                            type = this.selector.type;
                            option = type.indexOf('.') > -1 ? type.substr(type.indexOf('.') + 1) : '';
                            if (type !== 'none'){
                                if (type === 'value' || type === 'val') {
                                    __val = jquery(key).val();
                                } else if (type === 'text') {
                                    __val = jquery(key).text();
                                } else if (type === 'html') {
                                    __val = jquery(key).html();
                                } else if (type.indexOf('prop') > -1) {
                                    if (option === '') throw new ExtendError(/EL054608/, null, [this.constructor.name, key]);
                                    else __val = jquery(key).prop(option);
                                } else if (type.indexOf('attr') > -1) {
                                    if (option === '') throw new ExtendError(/EL054609/, null, [this.constructor.name, key]);
                                    else __val = jquery(key).attr(option);
                                } else if (type.indexOf('css') > -1) {
                                    if (option === '') throw new ExtendError(/EL054610/, null, [this.constructor.name, key]);
                                    else __val = jquery(key).css(option);
                                } else {
                                    throw new ExtendError(/EL054611/, null, [this.constructor.name]);
                                }
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
                        __val = this.$value || this.default;  
                    }
                    // Get값과 내부값이 다를경우 값 설정 (내부적으로 change 이벤트 발생함)
                    // if (__val !== this.$value) {
                    //     this.value = __val;
                    // }
                    return __val; 
                },
                set:  function(val) { 
                    var __val, _val, _fVal;
                    var key, type, option;
                    var _oldVal = this.$value;
                    // var _isSetFilter = true;   // selector 설정 여부
                    // if (typeof this.setter === 'function' ) _val = this.setter.call(this, val);
                    // // settter 의 리턴이 여부
                    // if (typeof _val !== 'undefined') __val = _val;
                    // else __val = val;
                    if (typeof this.setter === 'function') __val = this.setter.call(this, val) || val;
                    else __val = val;
                    __val = __val === null ? '' : __val;  // null 등록 오류 처리
                    if(['number', 'string', 'boolean'].indexOf(typeof __val) < 0) {
                        throw new ExtendError(/EL054612/, null, [this.constructor.name]);
                    }
                    this.$value = __val;   // 내부에 저장
                    if (selector !== null || typeof this.setFilter === 'function') {
                        if (typeof this.setFilter === 'function') {
                            _fVal = this.setFilter.call(this, __val);
                        }
                        // 셀렉터 설정 값 1> 필터값, 2> __value
                        __val = _fVal || __val;
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
                            key = this.selector.key;
                            type = this.selector.type;
                            option = type.indexOf('.') > -1 ? type.substr(type.indexOf('.') + 1) : '';
                            // 유효한 셀렉터 이면서, 설정할 ....
                            // if (type !== 'none' && type !== '' && _isSetFilter){
                            if (type !== 'none'){
                                if (type === 'value' || type === 'val') {
                                    jquery(key).val(__val);
                                } else if (type === 'text') {
                                    jquery(key).text(__val);
                                } else if (type === 'html') {
                                    jquery(key).html(__val);
                                } else if (type.indexOf('prop') > -1) {
                                    if (option === '') throw new ExtendError(/EL054613/, null, [this.constructor.name, key]);
                                    else jquery(key).prop(option, __val);
                                } else if (type.indexOf('attr') > -1) {
                                    if (option === '') throw new ExtendError(/EL054614/, null, [this.constructor.name, key]);
                                    else jquery(key).attr(option, __val);
                                } else if (type.indexOf('css') > -1) {
                                    if (option === '') throw new ExtendError(/EL054615/, null, [this.constructor.name, key]);
                                    else jquery(key).css(option, __val);
                                } else {
                                    throw new ExtendError(/EL054616/, null, [this.constructor.name]);
                                }
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
                    if (p_option.hasOwnProperty(prop) && 
                        ['domType', 'isReadOnly', 'isHide', 'element', 'selector', 'getFilter', 'setFilter'].indexOf(prop) > -1) {
                        this[prop] = p_option[prop];
                    }
                }
            }
            // 기본값 설정
            this.default = this.default || '';
        }
        Util.inherits(HTMLColumn, _super);
        HTMLColumn._UNION = [];
        HTMLColumn._NS = 'Meta.Entity';                                 // namespace
        HTMLColumn._PARAMS = ['columnName', '_entity'];                 // creator parameter        // REVIEW: 통일 시켜야함
        HTMLColumn._VALUE_TYPE = [null, String, Number, Boolean];
        /**
         * HTMLColumn 을 복제합니다.
         * @returns {HTMLColumn}
         */
        HTMLColumn.prototype.clone  = function(p_entity) {
            var clone;
            var rObj = this.getObject();
            var entity = p_entity ? p_entity : this._entity;
            // var top = _super.prototype.clone.call(this);
            var clone = new HTMLColumn(this.columnName, entity);
            // for(var prop in top) {
            //     if (top.hasOwnProperty(prop)) {
            //         if (top[prop]) clone[prop] = top[prop];
            //     }
            // }
            if (rObj['default']) clone.default = rObj['default'];
            if (rObj['caption']) clone.caption = rObj['caption'];
            if (rObj['required']) clone.required = rObj['required'];
            // if (rObj['optional']) clone.isNullPass = rObj['optional'];
            if (rObj['constraints']) clone.constraints = rObj['constraints'];
            if (rObj['getter']) clone.getter = rObj['getter'];
            if (rObj['setter']) clone.setter = rObj['setter'];
            if (rObj['alias']) clone.alias = rObj['alias'];
            if (rObj['value']) clone.value = rObj['value'];
            if (rObj['domType']) clone.domType = rObj['domType'];
            if (rObj['isReadOnly']) clone.isReadOnly = rObj['isReadOnly'];
            if (rObj['isHide']) clone.isHide = rObj['isHide'];
            if (rObj['element']) clone.element = rObj['element'];
            if (rObj['selector']) clone.selector = rObj['selector'];
            if (rObj['getFilter']) clone.getFilter = rObj['getFilter'];
            if (rObj['setFilter']) clone.setFilter = rObj['setFilter'];
            // if (this.selector) clone.__selector        = this.__selector.concat([]); // 배열 + 함수형
            return clone;
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
        HTMLColumn.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
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
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        HTMLColumn.prototype.setObject = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            var entity;
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    _global._L.HTMLColumn = HTMLColumn;
    _global._L.Meta.Entity.HTMLColumn = HTMLColumn;
}(typeof window !== 'undefined' ? window : global));
/**** base-bind.js | _L.Meta.Bind.BaseBind ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Type                       = _global._L.Type;                  
    var Util                       = _global._L.Util;                  
    var EventEmitter               = _global._L.EventEmitter;          
    var MetaRegistry               = _global._L.MetaRegistry;          
    var MetaObject                 = _global._L.MetaObject;            
    var MetaTable                  = _global._L.MetaTable;             
    var IBind                      = _global._L.IBind;                 
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!EventEmitter) throw new Error(Message.get('ES011', ['EventEmitter', 'event-emitter']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaObject) throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (!MetaTable) throw new Error(Message.get('ES011', ['MetaTable', 'base-entity']));
    if (!IBind) throw new Error(Message.get('ES011', ['IBind', 'i-bind']));
    //==============================================================
    // 3. module implementation
    var BaseBind = (function (_super) {
        /**
         * 기본 바인드 (최상위)
         * @constructs _L.Meta.Bind.BaseBind
         * @abstract
         * @extends _L.Meta.MetaObject
         */
        function BaseBind() {
            _super.call(this);
            var $event = new EventEmitter(this, this);
            var $KEYWORD = [];
            var _baseTable = null;
            /** 
             * 이벤트 객체
             * @private 
             * @member {EventEmitter} _L.Meta.Bind.BaseBind#$event  
             */
            Object.defineProperty(this, '$event', 
            {
                get: function() { return $event; },
                configurable: false,
                enumerable: false,
            });
            /** 
             * 컬렉션 예약어
             * @private
             * @member {array<string>}  _L.Collection.BaseCollection#$KEYWORD  
             */
            Object.defineProperty(this, '$KEYWORD', 
            {
                get: function() { return $KEYWORD; },
                set: function(newVal) { $KEYWORD = $KEYWORD.concat(newVal); },
                configurable: false,
                enumerable: false,
            });
            /**
             * 기본 엔티티
             * @member _L.Meta.Bind.BaseBind#_baseTable
             * @protected
             */
            Object.defineProperty(this, '_baseTable', 
            {
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
             * @event _L.Meta.Bind.BaseBind#onExecute
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
             * @event _L.Meta.Bind.BaseBind#onExecuted
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
        }
        Util.inherits(BaseBind, _super);
        BaseBind._UNION = [IBind];
        BaseBind._NS = 'Meta.Bind';
        BaseBind._PARAMS = [];
        BaseBind._KIND = 'abstract';
        /**
         * 실행 전 이벤트 리스너
         * @param {*} p_command 바인드 커맨드
         * @param {*} [p_model] 바인드 모델
         * @listens _L.Meta.Bind.BaseBind#_onExecute
         */
        BaseBind.prototype._onExecute = function(p_model, p_command) {
            this.$event.emit('execute', p_model, p_command, this);
        };
        /**
         * 실행 후 이벤트 리스너
         * @param {*} p_command 바인드 커맨드
         * @param {*} [p_model] 바인드 모델
         * @listens _L.Meta.Bind.BaseBind#_onExecuted
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
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            if (!Type.deepEqual(this.$event.$storage, {})) {
                obj['$storage'] = this.$event.$storage;
            }
            return obj;                        
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BaseBind.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            var baseTable;
            if (p_oGuid['$storage']) {
                this.$event.$storage = p_oGuid['$storage'];
            }
        };
        /** 
         * 메타테이블에 컬럼을 추가합니다.
         * @abstract
         */
        BaseBind.prototype.addColumn = function() {
            throw new ExtendError(/EL06114/, null, [this.constructor.name]);
        };
        return BaseBind;
    }(MetaObject));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Bind            = _global._L.Meta.Bind || {};
    _global._L.BaseBind = BaseBind;
    _global._L.Meta.Bind.BaseBind = BaseBind;
}(typeof window !== 'undefined' ? window : global));
/**** bind-command.js | _L.Meta.Bind.BaseBindCommand ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Type                       = _global._L.Type;                  
    var Util                       = _global._L.Util;                  
    var MetaRegistry               = _global._L.MetaRegistry;          
    var MetaColumn                 = _global._L.MetaColumn;            
    var MetaTable                  = _global._L.MetaTable;             
    var MetaView                   = _global._L.MetaView;              
    var MetaViewCollection         = _global._L.MetaViewCollection;    
    var IBindCommand               = _global._L.IBindCommand;          
    var ICommandCallback           = _global._L.ICommandCallback;      
    var BaseBind                   = _global._L.BaseBind;              
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaColumn) throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    if (!MetaTable) throw new Error(Message.get('ES011', ['MetaTable', 'meta-table']));
    if (!MetaView) throw new Error(Message.get('ES011', ['MetaView', 'meta-view']));
    if (!MetaViewCollection) throw new Error(Message.get('ES011', ['MetaViewCollection', 'meta-view']));
    if (!IBindCommand) throw new Error(Message.get('ES011', ['IBindCommand', 'i-bind-command']));
    if (!ICommandCallback) throw new Error(Message.get('ES011', ['ICommandCallback', 'i-base-command-callback']));
    if (!BaseBind) throw new Error(Message.get('ES011', ['BaseBind', 'base-bind']));
    //==============================================================
    // 3. module implementation
    var BaseBindCommand  = (function (_super) {
        /**
         * 바인드 명령 
         * @constructs _L.Meta.Bind.BaseBindCommand
         * @abstract
         * @extends _L.Meta.Bind.BaseBind
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
            var outputOption        = {option: 0, index: 0};     // 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만          
            // if (p_baseTable && !(p_BaseBindModel instanceof MetaObject && p_baseTable.instanceOf('BaseEntity'))) {
            //     throw new Error('Only [p_baseTable] type "BaseEntity" can be added');
            // }
            /**
             * 별칭 내부값
             * @member {string | number | boolean} _L.Meta.Bind.BaseBindCommand#$model
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$model',
            {
                get: function() { return _model; },
                set: function(nVal) { _model = nVal; },
                configurable: false,
                enumerable: false,
            });
            /**
             * 별칭 내부값
             * @member {string | number | boolean} _L.Meta.Bind.BaseBindCommand#$newOutput
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$newOutput',
            {
                get: function() { return $newOutput; },
                set: function(nVal) { $newOutput = nVal; },
                configurable: false,
                enumerable: false,
            });
            /**
             * _outputs MetaView 컬켁션
             * @member {BaseBindModel} _L.Meta.Bind.BaseBindCommand#_outputs
             * @readonly
             * @protected
             */
            Object.defineProperty(this, '_outputs', 
            {
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
             * @member {BaseBindModel} _L.Meta.Bind.BaseBindCommand#_model
             * @readonly
             */
            Object.defineProperty(this, '_model', 
            {
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
             * @member {MetaView} _L.Meta.Bind.BaseBindCommand#valid 
             */
            Object.defineProperty(this, 'valid', 
            {
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
             * @member {MetaView} _L.Meta.Bind.BaseBindCommand#bind 
             */
            Object.defineProperty(this, 'bind', 
            {
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
             * @member {MetaView} _L.Meta.Bind.BaseBindCommand#misc 
             */
            Object.defineProperty(this, 'misc', 
                {
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
             * @member {object} _L.Meta.Bind.BaseBindCommand#outputOption 
             */
            Object.defineProperty(this, 'outputOption', 
            {
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
             * @member {object} _L.Meta.Bind.BaseBindCommand#outOpt 
             */
            Object.defineProperty(this, 'outOpt', 
            {
                get: function() { return this.outputOption; },
                set: function(nVal) { this.outputOption = nVal;},
                configurable: true,
                enumerable: false
            });
            /**
             * 시작 전 콜백
             * @member {Function} _L.Meta.Bind.BaseBindCommand#cbBegin 
             */
            Object.defineProperty(this, 'cbBegin', 
            {
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
             * @member {Function} _L.Meta.Bind.BaseBindCommand#cbValid 
             */
            Object.defineProperty(this, 'cbValid', 
            {
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
             * @member {Function} _L.Meta.Bind.BaseBindCommand#cbBind
             */
            Object.defineProperty(this, 'cbBind', 
            {
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
             * @member {Function} _L.Meta.Bind.BaseBindCommand#cbValid 
             */
            Object.defineProperty(this, 'cbResult', 
            {
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
             * @member {Function} _L.Meta.Bind.BaseBindCommand#cbOutput 
             */
            Object.defineProperty(this, 'cbOutput', 
            {
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
             * @member {Function} _L.Meta.Bind.BaseBindCommand#cbEnd 
             */
            Object.defineProperty(this, 'cbEnd', 
            {
                get: function() { return cbEnd; },
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new ExtendError(/EL061309/, null, [this.constructor.name]);
                    cbEnd = nVal;
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
            this.$KEYWORD = ['outputOption', 'outOpt'];
            this.$KEYWORD = ['addColumnValue', 'setColumn', 'release', 'execute', 'exec', 'newOutput', 'removeOutput'];
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
        };
        function _getPropDescriptor(_this, oName) {
            return {
                get: function() { return _this._outputs[oName];},
                set: function(newVal) { 
                    if (!(newVal instanceof MetaView)) throw new ExtendError(/EL061311/, null, [oName]);
                    _this._outputs[oName] = newVal;
                },
                configurable: true,
                enumerable: true
            }
        }
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
            })) views.length = 0;
            if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
            else table = p_bTable || this._baseTable;
            if (!(table instanceof MetaTable)) {
                throw new ExtendError(/EL061318/, null, []);
            }
            if (_isString(p_column)) column = new this._model._columnType(p_column, table)
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
                for (var i = 0; i < this._outputs.count; i++) {
                    property.push(this._outputs.indexToKey(i));
                }
            }
            // 4.컬렉션 추가(등록)
            for (var i = 0; i < property.length; i++) {
                collection = this[property[i]].columns;
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
         * @param {string | string[]} p_names 해제할 아이템명
         * @param {string | string[]} [p_views] 'valid', 'bind', 'output', 'misc' 해제할 뷰 엔티티 지정
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
                for (var i = 0; i < this._outputs.count; i++) {
                    property.push(this._outputs.indexToKey(i));
                }
            }
            // 4. 아이템 검사 및 아이템 해제
            for(var i = 0; names.length > i; i++) {
                columnName = names[i]; 
                for (var ii = 0; property.length > ii; ii++) {
                    var idx = this[property[ii]].columns.keyToIndex(columnName);
                    if (idx > -1) this[property[ii]].columns.removeAt(idx);
                }
            }
        };
        /**
         * _output MetaViewCollection 에 MetaView 을 추가합니다.  
         * -  기본 이름 =  'output' + _outout.count
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Bind            = _global._L.Meta.Bind || {};
    _global._L.BaseBindCommand = BaseBindCommand;
    _global._L.Meta.Bind.BaseBindCommand = BaseBindCommand;
}(typeof window !== 'undefined' ? window : global));
/**** bind-command-ajax.js | _L.Meta.Bind.BindCommand ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;           
    var ExtendError                = _global._L.ExtendError;       
    var Util                       = _global._L.Util;              
    var BaseBindCommand                = _global._L.BaseBindCommand;       
    var axios                      = _global.axios;                
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!BaseBindCommand) throw new Error(Message.get('ES011', ['BaseBindCommand', 'bind-command']));
    if (!axios) throw new Error(Message.get('ES011', ['axios', 'axios']));
    //==============================================================
    // 3. module implementation
    var BindCommand  = (function (_super) {
        /**
         * 바인드 명령 Ajax 
         * @constructs _L.Meta.Bind.BindCommand
         * @extends _L.Meta.Bind.BaseBindCommand
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
             * @member {Object} _L.Meta.Bind.BindCommand#config 
             */
            Object.defineProperty(this, 'config', 
            {
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
             * @member {String} _L.Meta.Bind.BindCommand#url 
             */
            Object.defineProperty(this, 'url', 
            {
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
         * @protected
         */
        BindCommand.prototype._execBegin = function() {
            this._model._onExecute(this._model, this);
            this._onExecute(this._model, this);         // '실행 시작' 이벤트 발생
            if (typeof this.cbBegin === 'function' ) {
                this.cbBegin.call(this, this);
            } else if (typeof this._model.cbBaseBegin === 'function') {
                this._model.cbBaseBegin.call(this, this);
            }
        };
        /** 
         * cbValid 콜백함수를 실행하고 view(MetaView)의 유효성을 검사합니다.
         * @returns {boolean} 유효성 검사 결과
         * @protected
         */
        BindCommand.prototype._execValid = function() {
            var result = {};     // 오류 참조 변수
            var value = null;
            var bReturn = true;
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
         * @returns {Promise} 프로미스 객체를 리턴합니다.
         * @protected
         */
        BindCommand.prototype._execBind = function() {
            var value;
            var column;
            var config = {};
            // 기본값 못가져오는 오류 변경함 
            config.url           = this.config.url || this._model.baseConfig.url;
            config.method          = this.config.method || this._model.baseConfig.method;
            config.responseType      = this.config.responseType || this._model.baseConfig.responseType;
            for (var prop in this._model.baseConfig) {
                if (typeof config[prop] !== 'undefined') continue;
                config[prop] = this._model.baseConfig[prop];
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
         * @param {object} p_data  데이터
         * @param {object} p_res response 객체
         * @returns {object} data
         * @protected
         */
        BindCommand.prototype._execResult = function(p_data, p_res) {
            var data = p_data;
            if (typeof this.cbResult === 'function' ) {
                data = this.cbResult.call(this, p_data, this, p_res) || p_data;
            } else if (typeof this._model.cbBaseResult === 'function' ) {
                data = this._model.cbBaseResult.call(this, p_data, this, p_res) || p_data;
            }
            return data;
        };
        /**
         * 결과 data 로 outputs ViewCollection 을 설정하고, cbOutput 콜백함수를 호출합니다.
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
                    for (var i = 0; i < data.length; i++) {
                        $readOutput(data[i], i + 1, loadOption);
                    }
                } else if (_isObject(data)){
                    var i = 0;
                    for (var prop in data) {
                        $readOutput(data[prop], i + 1, loadOption);
                        i++;
                    }
                } else {
                    throw new ExtendError(/EL06163/, null, [typeof data]);
                }
            }
            // 3. 존재하는 아이템 중에 지정된 값으로 설정
            if (option === 3) {
                if (Array.isArray(index)) {
                    for (var i = 0; i < this._outputs.count && i < index.length; i++) {
                        $setOutputValue(index[i], i);
                    }
                } else {
                    for (var i = 0; this._outputs.count > i; i++) {
                        $setOutputValue(index, i);
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
                else false;
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
         * @param {object} p_status 상태값
         * @param {object} p_res response
         * @protected
         */
        BindCommand.prototype._execEnd = function(p_status, p_res) {
            try {
                if (typeof this.cbEnd === 'function' ) {
                    this.cbEnd.call(this, p_status, this, p_res);
                } else if (typeof this._model.cbBaseEnd === 'function') {
                    this._model.cbBaseEnd.call(this, p_status, this, p_res);
                }
                this._onExecuted(this._model, this);
                this._model._onExecuted(this._model, this);
            } catch (err) {
                var msg = 'Err: _execEnd(cmd='+ this.name +') message:'+ err.message;
                this._execError(msg, p_status, p_res);
            }
        };
        /**
         * 오류 발생시 호출됩니다. (cbError 콜백함수 호출)
         * @param {string} p_error 에러 메세지
         * @param {string} p_status  상태값
         * @param {string} p_res response
         * @protected
         */
        BindCommand.prototype._execError = function(p_error, p_status, p_res) {
            var msg = p_error;
            if (p_res && p_res.statusText) msg += ', statusText: '+ p_res.statusText;
            this._model.cbError.call(this, msg, p_status, p_res);
        };
        /**
         * excute() 실행시 유효성 검사가 실패하면 호출됩니다.
         * @param {string} p_msg 실패 메세지
         */
        BindCommand.prototype._execFail = function(p_msg) {
            this._model.cbFail.call(this, p_msg, this.valid);
        };
        /**
         * ajax 를 호출합니다. (axios)
         * @param {object} p_config axios 설정
         * @protected
         */
        BindCommand.prototype._ajaxCall = function(p_config) {
            var _this = this;
            // var config = {};
            return axios(p_config)
                .then(function(res){
                    _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    var status = '';
                    if (err.response && err.response.status) status = err.response.status;  // Branch:
                    _this._execError.call(_this, err, status, err.response);
                    _this._execEnd(err.status, err.response);
                });
            // for (var prop in p_config) {
            //     if (prop === 'url' || prop === 'method' || prop === 'data') continue;
            //     config[prop] = p_config[prop];
            // }
            // if (p_config.method === 'GET') {            // 요청
            //     // TODO:
            //     // data 를 params 문자열로 변환 필요
            //     // 데이터 전송 여부 확인 필요
            //     return axios.get(p_config.url, config)
            //         .then(function(res){
            //             _this._ajaxSuccess.call(_this, res.data, res.status, res);
            //         })
            //         .catch(function(err){
            //             _this._execError.call(_this, err, err.status, err.response);
            //             _this._execEnd(err.status, err.response);
            //         });
            // } else if (p_config.method === 'DELETE') {  // 삭제
            //     return axios.delete(p_config.url, p_config.data, config)
            //         .then(function(res){
            //             _this._ajaxSuccess.call(_this, res.data, res.status, res);
            //         })
            //         .catch(function(err){
            //             _this._execError.call(_this, err, err.status, err.response);
            //             _this._execEnd(err.status, err.response);
            //         });
            // } else if (p_config.method === 'POST') {    // 추가
            //     return axios.post(p_config.url, p_config.data, config)
            //         .then(function(res){
            //             _this._ajaxSuccess.call(_this, res.data, res.status, res);
            //         })
            //         .catch(function(err){
            //             _this._execError.call(_this, err, err.status, err.response);
            //             _this._execEnd(err.status, err.response);
            //         });
            // } else if (p_config.method === 'PUT') {    // 수정 
            //     return axios.put('p_config.url', p_config.data, config)
            //         .then(function(res){
            //             _this._ajaxSuccess.call(_this, res.data, res.status, res);
            //         })
            //         .catch(function(err){
            //             _this._execError.call(_this, err, err.status, err.response);
            //             _this._execEnd(err.status, err.response);
            //         });
            // } else if (p_config.method === 'PATCH') {   // 일부 수정
            //     return axios.patch(p_config.url, p_config.data, config)
            //         .then(function(res){
            //             _this._ajaxSuccess.call(_this, res.data, res.status, res);
            //         })
            //         .catch(function(err){
            //             _this._execError.call(_this, err, err.status, err.response);
            //             _this._execEnd(err.status, err.response);
            //         });
            // } else {
            //     throw new Error('mothod 타입이 아닙니다.');
            // }
        };
        /**
         * ajax 호출이 성공할 경우 호출됩니다.
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
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            obj['config'] = this.config;
            return obj;                        
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BindCommand.prototype.setObject = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            var entity;
            this.config = p_oGuid['config'];
        };
        /**
         * command 을 실행합니다.  
         * 실행 순서 <정상흐름>
         *  _execBegin() >> _execValid() >> execBind() >> 
         *  [콜백] _execResult() >> _execOutput() >> _execEnd() 
         * @returns {Promise} 프로미스 객체
         */
        BindCommand.prototype.execute = function() {
            var _this = this;
            try {
                this._execBegin();
                if (!this._execValid()) this._execEnd();
                else return this._execBind();
            } catch (err) {
                var msg = 'Err:execue(cmd='+ _this.name +') message:'+ err.message;
                this._execError(msg);
                this._execEnd();                
            }
        };
        return BindCommand;
    }(BaseBindCommand));
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                     = _global._L.Meta || {};
    _global._L.Meta.Bind                = _global._L.Meta.Bind || {};
    _global._L.BindCommand = BindCommand;
    _global._L.Meta.Bind.BindCommand = BindCommand;
}(typeof window !== 'undefined' ? window : global));
/**** bind-model.js | _L.Meta.Bind.BaseBindModel ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Type                       = _global._L.Type;                  
    var Util                       = _global._L.Util;                  
    var MetaRegistry               = _global._L.MetaRegistry;          
    var MetaColumn                 = _global._L.MetaColumn;            
    var PropertyCollection         = _global._L.PropertyCollection;    
    var MetaTable                  = _global._L.MetaTable;             
    var MetaTableCollection        = _global._L.MetaTableCollection;   
    var IBindModel                 = _global._L.IBindModel;            
    var IModelCallback             = _global._L.IModelCallback;        
    var IService                   = _global._L.IService;              
    var BaseBind                   = _global._L.BaseBind;              
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaColumn) throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    if (!PropertyCollection) throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (!MetaTable) throw new Error(Message.get('ES011', ['MetaTable', 'meta-table']));
    if (!MetaTableCollection) throw new Error(Message.get('ES011', ['MetaTableCollection', 'meta-table']));
    if (!IBindModel) throw new Error(Message.get('ES011', ['IBindModel', 'i-bind-model']));
    if (!IModelCallback) throw new Error(Message.get('ES011', ['IModelCallback', 'i-model-callback']));
    if (!IService) throw new Error(Message.get('ES011', ['IService', 'i-service']));
    if (!BaseBind) throw new Error(Message.get('ES011', ['BaseBind', 'base-bind']));
    //==============================================================
    // 3. module implementation
    var BaseBindModel  = (function (_super) {
        /**
         * 바인드모델 추상클래스
         * @constructs _L.Meta.Bind.BaseBindModel
         * @abstract
         * @extends _L.Meta.Bind.BaseBind
         */
        function BaseBindModel()  {
            _super.call(this);
            var _tables         = new MetaTableCollection(this);
            var _columnType     = MetaColumn;
            var items           = new PropertyCollection(this);
            var command         = new PropertyCollection(this);
            var fn              = new PropertyCollection(this);
            var cbFail        = function(msg, valid) { console.warn('실패하였습니다. Err:'+ msg); };
            var cbError       = function(msg, status, response) { console.error('오류가 발생 하였습니다. Err: '+ msg); };
            var cbBaseBegin;
            var cbBaseValid;
            var cbBaseBind ;
            var cbBaseResult;
            var cbBaseOutput;
            var cbBaseEnd;
            var preRegister    = function() {};
            var preCheck       = function() {return true};
            var preReady       = function() {};
            var DEFALUT_TABLE_NAME = 'first';
            // items._elemTypes = [Object, String, Number, Boolean];    // REVIEW: 특성 제거 했음, 필요시 검사후 삽입
            /**
             * _tables 
             * @member {PropertyCollection} _L.Meta.Bind.BaseBindModel#_tables
             */
            Object.defineProperty(this, '_tables', 
            {
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
             * @member {MetaColumn} _L.Meta.Bind.BaseBindModel#_columnType
             */
            Object.defineProperty(this, '_columnType', 
            {
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
             * @member {PropertyCollection} _L.Meta.Bind.BaseBindModel#items
             */
            Object.defineProperty(this, 'items', 
            {
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
             * @member {PropertyCollection} _L.Meta.Bind.BaseBindModel#fn
             */
            Object.defineProperty(this, 'fn', 
            {
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
             * @member {PropertyCollection} _L.Meta.Bind.BaseBindModel#command
             */
            Object.defineProperty(this, 'command', 
            {
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
             * @member {PropertyCollection} _L.Meta.Bind.BaseBindModel#cmd
             */
            Object.defineProperty(this, 'cmd', 
            {
                get: function() { return this.command; },
                set: function(nVal) { this.command = nVal; },
                configurable: false,
                enumerable: false
            });
            /**
             * columns = _baseTable.columns
             * @member {MetaTableColumnCollection} _L.Meta.Bind.BaseBindModel#columns
             */
            Object.defineProperty(this, 'columns', 
            {
                get: function() { return this._baseTable.columns; },
                configurable: false,
                enumerable: true
            });
            /**
             * columns 별칭
             * @member {object} _L.Meta.Bind.BaseBindModel#cols 
             */
            Object.defineProperty(this, 'cols', 
            {
                    get: function() { return this.columns; },
                    set: function(nVal) { this.columns = nVal;},
                    configurable: true,
                    enumerable: false
            });
            /**
             * valid 에서 실패시 콜백
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbFail
             */
            Object.defineProperty(this, 'cbFail', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbError
             */
            Object.defineProperty(this, 'cbError', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbBaseBegin
             */
            Object.defineProperty(this, 'cbBaseBegin', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbBaseValid
             */
            Object.defineProperty(this, 'cbBaseValid', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbBaseBind
             */
            Object.defineProperty(this, 'cbBaseBind', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbBaseResult
             */
            Object.defineProperty(this, 'cbBaseResult', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbBaseOutput
             */
            Object.defineProperty(this, 'cbBaseOutput', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#cbBaseEnd
             */
            Object.defineProperty(this, 'cbBaseEnd', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#preRegister
             */
            Object.defineProperty(this, 'preRegister', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#preCheck
             */
            Object.defineProperty(this, 'preCheck', 
            {
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
             * @member {Funtion} _L.Meta.Bind.BaseBindModel#preReady
             */
            Object.defineProperty(this, 'preReady', 
            {
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
        };
        /**
         * 지정한 item 또는 전체 items 목록을 기본 MetaTable 에 등록합니다.(기존에 등록되 있으면 통과)
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
        }
        /**
         * 컬럼을 추가하고 지정테이블에 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output MetaView 에 등록합니다.
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
            if (_isString(p_column)) column = new this._columnType(p_column, table)
            else column = p_column;
            // 3. command 확인
            if (typeof p_cmds !== 'undefined' && cmds.length > 0) {
                for (var i = 0; i< cmds.length; i++) {
                    if (!_isString(cmds[i])) throw new ExtendError(/EL061230/, null, [i, typeof cmds[i]]);
                    if (this.command.exist(cmds[i])) command.push(cmds[i]);
                    else throw new ExtendError(/EL061231/, null, [i, cmds[i]]);
                }
            } else if (typeof p_cmds !== 'undefined') {
                command = this.command.$keys;
            }
            // 4. 컬럼 등록 및 조회
            column = table.columns[table.columns.add(column)];
            // 5. command 에 컬럼 등록
            for (var i = 0; i < command.length; i++) {
                this.command[command[i]].setColumn(column.columnName, p_views, table);
            }
        };
        /**
         * 지정한 이름으로 컬럼과 값을 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output MetaView 에 등록합니다.
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
         * @param {ProperyCollection | object} p_mapping MetaColumn 에 매핑할 객체 또는 컬렉션
         * @param {string | MetaTable} [p_bEntity=_baseTable] 대상 기본 엔티티 
         */
        BaseBindModel.prototype.setMapping = function(p_mapping, p_bEntity) {
            var mappingCollection;
            // var itemsCollection;
            var table;
            var itemName;
            var tableName;
            var columnName;
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
                //         if (!this._tables.exist(tableName)) this.addTable(tableName)
                //         table = this._tables[tableName];
                //     } else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
                //     else table = p_bEntity || this._baseTable;
                //     if (!(table instanceof MetaTable)) {
                //         throw new ExtendError(/EL061235/, null, []);
                //     }
                //     if (!table.columns.exist(columnName)) {
                //         if (this.items.exist(columnName)) {
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
                //             if(!this.command.exist(prop)) this.addCommand(prop);
                //             this.command[prop].addColumn(column, mappingCollection[i][prop], table);
                //         }
                //     }
                // }
                // 첫 번째 반복문
                for (var i = 0; i < mappingCollection.count; i++) {
                    $processMapping.call(this, mappingCollection, i, p_bEntity, false);
                }
                // 두 번째 반복문
                for (var i = 0; i < mappingCollection.count; i++) {
                    $processMapping.call(this, mappingCollection, i, p_bEntity, true);
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
                    if (!this._tables.exist(tableName)) this.addTable(tableName)
                    table = this._tables[tableName];
                } else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
                else table = p_bEntity || this._baseTable;
                if (!(table instanceof MetaTable)) {
                    throw new ExtendError(/EL061235/, null, []);
                }
                if (!table.columns.exist(columnName)) {
                    if (this.items.exist(columnName)) {
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
                            if(!this.command.exist(prop)) this.addCommand(prop);
                            this.command[prop].addColumn(column, mappingCollection[i][prop], table);
                        }
                    }
                }
                // for (var prop in mappingCollection[i]) {
                //     if (isAllCommand ? _isAllName(prop) : !_isAllName(prop)) {
                //         if (!this.command.exist(prop)) this.addCommand(prop);
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
         * @param {string} p_name BaseBindCommand 이름
         * @param {number | object} p_option 옵션
         * @param {BaseEntity} [p_bEntity] 기본 메타테이블
         * @abstract
         */
        BaseBindModel.prototype.addCommand = function(p_name, p_option, p_bEntity) {
            throw new ExtendError(/EL061238/, null, [this.constructor.name]);
        };
        /**
         * 서비스 객체로 현재 객체를 설정합니다.
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
                            for (var i = 0; i < views.length; i++) {
                                command.newOutput(views[i]);
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
                for(var prop in propObject) {
                    if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                        //__prop.add(prop, propObject[prop]);
                        // get/sett 형식의 기능 추가        REVIEW:: 확인필요 get/set 의 필요성, 중복 및 혼선의 이슈
                        // if (typeof propObject[prop] === 'object' 
                        //     && (typeof propObject[prop].get === 'function' || typeof propObject[prop].set === 'function')) {
                        //     this.items.add(prop, '', propObject[prop]);    
                        // } else {
                        //     this.items.add(prop, propObject[prop]);
                        // }
                        this.items.add(prop, propObject[prop]);
                    }
                }
            }
            // fn 등록
            if (_isObject(p_service['fn'])) {
                propObject = p_service['fn'];
                for(var prop in propObject) {
                    if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                        this.fn.add(prop, propObject[prop]);
                    }
                }
            }
            if (_isObject(p_service['mapping'])) {
                propObject = p_service['mapping'];
                for(var prop in propObject) {
                    if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                        mapping.add(prop, propObject[prop]);
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Bind            = _global._L.Meta.Bind || {};
    _global._L.BaseBindModel = BaseBindModel;
    _global._L.Meta.Bind.BaseBindModel = BaseBindModel;
}(typeof window !== 'undefined' ? window : global));
/**** bind-model.js | _L.Meta.Bind.BindModel ****/
(function(_global) {
    'use strict';
    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    var Message                    = _global._L.Message;               
    var ExtendError                = _global._L.ExtendError;           
    var Type                       = _global._L.Type;                  
    var Util                       = _global._L.Util;                  
    var PropertyCollection         = _global._L.PropertyCollection;    
    var IAjaxService               = _global._L.IAjaxService;          
    var BaseBindModel                  = _global._L.BaseBindModel;             
    var HTMLColumn                 = _global._L.HTMLColumn;            
    var BindCommand            = _global._L.BindCommand;       
    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!PropertyCollection) throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (!IAjaxService) throw new Error(Message.get('ES011', ['IAjaxService', 'i-service-ajax']));
    if (!BaseBindModel) throw new Error(Message.get('ES011', ['BaseBindModel', 'base-entity']));
    if (!HTMLColumn) throw new Error(Message.get('ES011', ['HTMLColumn', 'html-column']));
    if (!BindCommand) throw new Error(Message.get('ES011', ['BindCommand', 'bind-command-ajax']));
    //==============================================================
    // 3. module implementation
    var BindModel  = (function (_super) {
        /**
         * 바인드모델 Ajax
         * @constructs _L.Meta.Bind.BindModel
         * @extends _L.Meta.Bind.BaseBindModel
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
             * @member {string | number | boolean} _L.Meta.Bind.BindModel#$service
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$service',
            {
                get: function() { return $service; },
                set: function(nVal) { $service = nVal; },
                configurable: false,
                enumerable: false,
            });
            /**
             * 바인딩 기본 config 을 설정한다.
             * @member {Object} _L.Meta.Bind.BindModel#baseConfig
             */
            Object.defineProperty(this, 'baseConfig', 
            {
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
             * @member {String} _L.Meta.Bind.BindModel#url
             */
            Object.defineProperty(this, 'url', 
            {
                get: function() { return baseConfig.url; },
                set: function(nVal) { 
                    if (!(_isString(nVal))) throw new ExtendError(/EL06152/, null, [this.constructor.name]);
                    baseConfig.url = nVal;
                },
                configurable: true,
                enumerable: true
            });
            // default set
            this._columnType                    = HTMLColumn;                           // 기본 아이템 타입 변경
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
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            obj['$service']         = this.$service;
            obj['baseConfig']    = this.baseConfig;
            return obj;                        
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BindModel.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            this.$service       = p_oGuid['$service'];
            this.baseConfig  = p_oGuid['baseConfig'];
        };     
        /**
         * 셀렉터 검사
         * @param {PropertyCollection} [p_collection] 공백시 items.selector 검사
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
         * @param {IBaseBindModel} p_service 서비스객체
         * @param {boolean} [p_passTypeChk=false] 서비스객체 type 검사 통과 유무
         */
         BindModel.prototype.setService  = function(p_service, p_passTypeChk) {
             var InterfaceTypeCheck = 1;
             try {
                _super.prototype.setService.call(this, p_service, true);    // 부모 호출
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
    //==============================================================
    // 4. module export
    // create namespace
    _global._L.Meta                     = _global._L.Meta || {};
    _global._L.Meta.Bind                = _global._L.Meta.Bind || {};
    _global._L.BindModel = BindModel;
    _global._L.Meta.Bind.BindModel = BindModel;
}(typeof window !== 'undefined' ? window : global));