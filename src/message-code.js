/**** base-collection.js | _L.Collection.BaseCollection ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    //==============================================================
    // 2. module dependency check
    //==============================================================
    var messageCode = {
        eng: {},
        kor: {
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
            EL05123: '',
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
            EL05335: 'select(filter, ...); MetaRegistry.ns 에서 \'$1\' 가져오는데 싪패하였습니다.',
            EL05336: 'select(filter, ...); 조회가 실패하였습니다.',
            EL05337: 'clone() 은 추상메소드 입니다. 구현해야 합니다.',
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
            EL05412: '$1.columns 값은 [MetaTableColumnCollection] 타입이 아닙니다.',
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
            // =====================
            // Meta.Entity.Bind
            EL0545B

        }
    };

    //==============================================================
    // 4. module export
    if (isNode) exports.messageCode = messageCode;    // strip:

    _global._L                      = _global._L || {};
    _global._L.messageCode          = _global._L.message || {};
    _global._L.messageCode.entity   = {};

    _global._L.messageCode.entity   = messageCode;

}(typeof window !== 'undefined' ? window : global));