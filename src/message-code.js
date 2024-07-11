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
        eng: {},
        kor: {
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
            EL061236: '\'$1\' 이름의 column 또는 item 이 존재하지 않습니다.',
            EL061237: 'setMapping(mapping, bTable); 매핑이 실패하였습니다.',
            EL061238: 'addCommand() 은 추상메소드 입니다. [$1] 을 상속해서 구현해야 합니다.',
            EL061239: 'tables 은 string | string[] 타입입니다.',
            EL061240: 'setService(service, passChk); 서비스 설정이 실패하였습니다.',    // REVIEW: 제거함
            EL061241: '',
            // bind-command.js
            EL061300: '',
            EL061301: '$1.valid [MetaView] 인스턴스가 아닙니다. ',
            EL061302: '$1.bind [MetaView] 인스턴스가 아닙니다. ',
            EL061303: '$1.outputOption 타입은 number | {option: number, index: number | number[] } 입니다.',
            EL061304: '$1.cbBegin 는  \'(cmd: BindCommand) => void\' 타입입니다.',
            EL061305: '$1.cbValid 는  \'(valid: MetaView, cmd: BindCommand) => boolean\' 타입입니다.',
            EL061306: '$1.cbBind 는  \'(view: MetaView, cmd: BindCommand, config: object) => void\' 타입입니다.',
            EL061307: '$1.cbResult 는  \'(data: object, cmd: BindCommand, res: object) => object\' 타입입니다.',
            EL061308: '$1.cbOutput 는  \'(views: MetaViewColleciton, cmd: BindCommand, res: object) => void\' 타입입니다.',
            EL061309: '$1.cbEnd 는  \'(status: number, cmd: BindCommand, res: object) => void\' 타입입니다.',
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
            // bind-model-ajax.js
            EL06150: '',
            EL06151: '$1.baseConfig 는 object 타입입니다.',
            EL06152: '$1.baseUrl 는 string 타입입니다.',
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
    if (isNode) exports.messageCode = messageCode;    // strip:

    _global._L.messageCode          = _global._L.messageCode || {};

    _global._L.messageCode.bind     = messageCode;

}(typeof window !== 'undefined' ? window : global));