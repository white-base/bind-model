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
            EL061208: '$1.cbBaseBegin 는  \'(cmd: BindCommand) => void\' 타입입니다.',
            EL061209: '$1.cbBaseValid 는  \'(valid: MetaView, cmd: BindCommand) => boolean\' 타입입니다.',
            EL061210: '$1.cbBaseBind 는  \'(view: MetaView, cmd: BindCommand, config: object) => void\' 타입입니다.',
            EL061211: '$1.cbBaseResult 는  \'(data: object, cmd: BindCommand, res: object) => object\' 타입입니다.',
            EL061212: '$1.cbBaseOutput 는  \'(views: MetaViewColleciton, cmd: BindCommand, res: object) => void\' 타입입니다.',
            EL061213: '$1.cbBaseEnd 는  \'(status: number, cmd: BindCommand, res: object) => void\' 타입입니다.',
            EL061214: '$1.preRegister 는  \'(bm: BindModel) => void\' 타입입니다.',
            EL061215: '$1.preCheck 는  \'(bm: BindModel) => boolean\' 타입입니다.',
            EL061216: '$1.preReady 는  \'(bm: BindModel) => void\' 타입입니다.',
            EL061217: '컬럼 이름은 \'string\' 타입이 아닙니다. typeof columnName = $1',
            EL061218: '_readItem(item, bEntity); item 은 string | string[] 타입이 입니다.',
            EL061219: '_readItem(); 대상 table 이 존재하지 않습니다.',
            EL061220: '_readItem(); 대상 table 이 [MetaTable] 타입이 아닙니다.',
            EL061221: '_readItem(); 컬럼 생성이 실패 하였습니다.',
            EL061222: 'setObject(oGuid, origin); oGuid.[\'_baseTable\'] $set 조회가 실패하엿습니다. guid = $1',
            EL061223: '',
            EL061224: '',
            EL061225: '',
            EL061226: '',
            EL061227: '',
            EL061228: '',
            EL061229: '',
            EL061230: '',
            EL061231: '',
            EL061232: '',
            EL061233: '',
            EL061234: '',
            EL061235: '',
            EL061236: '',
            EL061237: '',
            EL061238: '',
            EL061239: '',

            // bind-command.js
            EL06130: '',
            EL06131: '',
            // html-column.js
            EL06140: '',
            EL06141: '',
            // bind-model-ajax.js
            EL06150: '',
            EL06151: '',
            // bind-command-ajax.js
            EL06160: '',
            EL06161: '',
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