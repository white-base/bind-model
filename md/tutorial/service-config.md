---
lang: ko
title: "서비스객체 구성"
layout: single
permalink: /ko/docs/service-config/
date: 2024-08-14T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

서비스 객체를 사용하면 `BindModel`객체를 쉽게 생성할 수 있으며, 상속으로 공통 영역을 분리하여 재사용성을 높일 수 있습니다.

콜백 함수에서 this.bindModel 속성으로 `BindModel` 객체에 접근할 수 있습니다.

타입 : ServiceType
```ts
// items area
type KeyType = 'none' | 'value' | 'text' | 'html' | 'prop' | 'attr' | 'css';
type SelectorType = { key: string, type: KeyType };
type RegExpType = { reg: RegExp, msg: string, return?: boolean };
type FuncType = (value: any) => boolean;
type ConstraintType = RegExpType | FuncType;
type ColumnType = {
	selector?: SelectorType,
	getter?: () => any,
	setter?: (val: any) => any,
	getFilter?: () => any,
	setFilter?: (val; any) => any,
	default?: stirng | number | boolean | null,
	value?: any,
	alias?: string,
	caption?: string,
	constraints?: ConstraintType[] | ConstraintType,
	required?: boolean | false,
	columnName?: string
};
type Itemtype = {
	[key: string]: string | number | boolean | ColumnType
};
// command area
type CmdValueType = {
	outputOption?: 0 | 1 | 2 | 3,  // alias : outOpt
	config?: see axiosConfig, // axios type
	url?: string,
	views?: string[],
	cbBegin?: (cmd: BindCommand) => void,
	cbValid?: (view: MetaView, cmd: BindCommand) => boolean,
	cbBind?: (view: MetaView, cmd: BindCommand, cfg: object) => void,
	cbResult?: (data: object, cmd: BindCommand, res: object) => object,
	cbOutput?: (views: MetaViewCollection, cmd: BindCommand, res: object) => void,
	cbEnd?: (status: number, cmd: BindCommand, res: object) => void,
	onExecute?: (bindModel, bindCommand) => void,
	onExecuted?: (bindModel, bindCommand) => void,
};
type CommandType = {
	[key: string]: CmdValueType
};
// mapping area
typeColumnName = string; // 'item name' | 'column name' | 'table name.column name';
type CommandName = '$all' | string;  // string = 'command name'
type ViewName = 'valid' | 'bind' | 'output' | '$all' | string; // add view name
type MappingType = {
	[key: ColumnName]: {
		[key: CommandName]: ViewName | ViewName[]
	}
};
// fn area
type fnType = {
	[key: string]: Function
};
// -------------------------
// service area
type ServiceType = {
	tables?: string | string[],
	baseConfig?: axiosConfig,  // // axios type
	url?: string,
	cbBaseBegin?: (cmd: BindCommand) => void;
	cbBaseValid?: (view: MetaView, cmd: BindCommand) => boolean,
	cbBaseBind?: (view: MetaView, cmd: BindCommand, cfg) => void,
	cbBaseResult?: (data: object, cmd: BindCommand, res) => object,
	cbBaseOutput?: (views: MetaViewCollection, cmd: BindCommand, res: object) => void,
	cbBaseEnd?: (status: number, cmd: BindCommand, res: object) => void,
	onExecute?: (bindModel, bindCommand) => void,
	onExecuted?: (bindModel, bindCommand) => void,
	items?: Itemtype,
	command?: CommandType,
	mapping?: MappingType,
	fn?: fnType,
	preRegister?: (bindModel) => void',
	preCheck?: (bindModel) => boolean',
	preReady?: (bindModel) => void,

};
```

# 서비스 객체

## 기본 영역 구성하기

서비스객체의 기본 콜백함수와 서버요청 정보를 구성합니다. 

타입 : 기본 서버요청 및 기본 콜백함수
```ts
// Configuring Callback and Server Requests on Service Objects
type ServiceType = {
	baseConfig?: axiosConfig,  // axios 타입 참조
	url?: string,
	cbBaseBegin?: (cmd: BindCommand) => void;
	cbBaseValid?: (view: MetaView, cmd: BindCommand) => boolean,
	cbBaseBind?: (view: MetaView, cmd: BindCommand, cfg) => void,
	cbBaseResult?: (data: object, cmd: BindCommand, res) => object,
	cbBaseOutput?: (views: MetaViewCollection, cmd: BindCommand, res: object) => void,
	cbBaseEnd?: (status: number, cmd: BindCommand, res: object) => void,
	onExecute?: (bindModel, bindCommand) => void,
	onExecuted?: (bindModel, bindCommand) => void,
};
```
- 'url' 은 `baseConfig.url` 값 입니다.

예제 : 기본
```js
var bm = new BindModel({
	// 기본 서버 요청
	baseConfig: { method: 'GET' },
	url: '/user',
	// 기본 콜백함수
	cbBaseBegin: function(cmd) { 
		console.log('기본 시작 콜백'); 
	},
	cbBaseValid: function(view, cmd) {
		console.log('기본 유효성 검사 콜백');
		return true;
	},
	cbBaseBind: function(view, cmd, cfg) { 
		console.log('기본 서버 요청 콜백'); 
	},
	cbBaseResult: function(data, cmd, res) {
		console.log('기본 서버 응답 콜백');
		return data;
	},
	cbBaseOutput: function(vidw, cmd, res) => { 
		console.log('기본 응답 출력 콜백'); 
	},
	cbBaseEnd: function(status, cmd, res) => { 
		console.log('기본 종료 콜백'); 
	},	
});
```

예제 : 메소드를 통한 기본 구성
```js
var bm = new BindModel();

// 기본 서버 설정
bm.baseConfig = { method: 'GET', url: '/user' };
bm.cbBaseBegin = function(cmd) { 
	console.log('기본 시작 콜백'); 
};

// 기본 콜백함수
bm.cbBaseValid: function(view, cmd) {
	console.log('기본 유효성 검사 콜백');
	return true;
};
bm.cbBaseBind: function(view, cmd, cfg) { 
	console.log('기본 서버 요청 콜백'); 
};
bm.cbBaseResult: function(data, cmd, res) {
	console.log('기본 서버 응답 콜백');
	return data;
};
bm.cbBaseOutput: function(vidw, cmd, res) => { 
	console.log('기본 응답 출력 콜백'); 
};
bm.cbBaseEnd: function(status, cmd, res) => { 
	console.log('기본 종료 콜백'); 
};
```
- 위의 구성한 서비스 객체와 동일합니다.

기본 구성은 commnad 별로 설정이 가능하며, 기본 구성 보다  'command' 의 우선순위가 높습니다.

## 테이블 영역 구성하기

서비스객체의 추가 테이블 정보를 구성합니다. 

타입 : tables
```ts
// Configuring Tables in a Service Object
type ServiceType = {
	tables?: string | string[],
};
```

`BindModel` 객체는 'first' 라는 이름의 `MetaTable`을 자동 생성하여 사용합니다. 추가 테이블을 'tables' 속성으로 설정합니다.

```js
var bm = new BindModel({
    tables: ['second', 'third']
});

// 기본 테이블 참조
// bm.first === bm._tables['first']  // true
// bm.first === bm._tables[0]        // true

// 추가 테이블 참조
// bm.second === bm._tables['second'] // true
// bm.second === bm._tables[1]        // true
// bm.third === bm._tables['third']   // true
// bm.third === bm._tables[2]         // true
```
- 추가적인 테이블이 필요할 경우에 사용합니다.

예제 : 메소드를 통한 테이블 구성
```js
var bm = new BindModel();

// Create a table
bm.addTable('second');
bm.addTable('third');
```
- 위의 구성한 서비스 객체와 동일합니다.

## 아이템 영역 구성하기

서비스객체의 컬럼 원시값을 구성합니다.

### 컬럼의 원시값 설정

- items 각 요소는 컬럼의 원시값을 입니다. 
- items 의 키값이 `string, number, boolean, null` 타입일 경우, 컬럼의 value에 설정됩니다. 
- items 의 키값이 `object` 타입일 경우, 컬럼의  프로퍼티 값으로 사용됩니다.

타입 : items
```ts
type KeyType = 'none' | 'value' | 'text' | 'html' | 'prop' | 'attr' | 'css';
type SelectorType = { key: string, type: KeyType };
type RegExpType = {reg: RegExp, msg: string, return?: boolean = true};
type FuncType = (value: any) => boolean;
type ConstraintType = RegExpType | FuncType;
type ColumnType = {
	selector?: SelectorType,
	getter?: () => any,
	setter?: (val: any) => any,
	getFilter?: () => any,
	setFilter?: (val: any) => any,
	default?: stirng | number | boolean | null,
	value?: any,
	alias?: string,
	caption?: string,
	constraints?: ConstraintType[] | ConstraintType,
	required?: boolean | false,
	columnName?: string
};
type Itemtype = {
	[key: string]: string | number | boolean | ColumnType
};
// 서비스 객체에서 items 구성
type ServiceType = {
	items?: ItemType
};
```

### item 네이밍 규칙
- 컬럼명 : 기본테이블에 컬럼을 등록됩니다.
- 테이블명.컬럼명 : 대상 테이블에 컬럼을 등록됩니다.

### items 속성 설명
- `string, number, boolean, null `: 원시값으로 컬럼의 value 에 설정됩니다.
- selector : 컬럼의 value 를 DOM 에서 가져오거나 설정할 때 사용할 선택자입니다.
- setter : 외부에 value 을 설정할 때 사용할 함수입니다.
- getter : 외부에서 value 을 가져올 때 사용할 함수입니다.
- required : 컬럼 value 의 필수 여부를 설정합니다.
- setFilter : value 를 설정할 때 사용할 필터 함수입니다.
- getFilter : value 를 가져올 때 사용할 필터 함수입니다.
- constraints : 정규식 또는 사용자 함수로 value 의 제약조건을 설정하며, 유효성 검사에 사용됩니다.

[[54. HTML Column Class-B|Refer to HTML Column]]


예제 : items
```js
var bm = new BindModel({
	// 추가 테이블 생성
	tables: 'second',
	
	// 아이템 생성
	items: {
		aa: 'Cat',
		'second.bb': 10,
		'second.cc': true,
		dd: {
			selector: { key: '#U_ID', type: 'value' },  // 컬럼의 selector 설정
			setter: (val) => {/*외부에 설정 영역*/},        // 컬럼의 setter 설정
			getter: () => { return '외부값'; },           // 컬럼의 getter 설정
		},
		ee: {
			required: true,                             // 컬럼의 required 설정
			setFilter: (val) => {/*외부에 설정영역*/},      // 컬럼의 setFilter 설정
			getFilter: () => { return '외부값'; },        // 컬럼의 getFilter 설정
		},
		ff: {
			constraints: { reg: /abc/, msg: '매칭되지 실패!' } // 컬럼의 제약조건 설정
		}
	}
});
```
- aa' 아이템은 기본테이블에 컬럼으로 등록하고, value 에 'Cat' 을 설정합니다.
- bb' 아이템은 second 테이블에 컬럼으로 등록하고, value 에 10 을 설정합니다.
- cc' 아이템은 second 테이블에 컬럼으로 등록하고, value 에 true 을 설정합니다.

예제 : 메소드를 통한 아이템 구성
```js
var bm = new BindModel();

// 추가 테이블 생성
bm.addTable('second');

// 아이템 생성
bm.items.add('aa', 'Cat');
bm.items.add('second.bb', 10);
bm.items.add('second.cc', true);
bm.items.add('dd', {
	selector: { key: '#U_ID', type: 'value' },
	setter: function(val) {/*외부에 설정 영역*/},
	getter: function() { return '외부값'; }, 
});
bm.items.add('ee', {
	required: true,
	setFilter: function(val) {/*외부에 설정영역*/},
	getFilter: function() { return '외부값'; },
});
bm.items.add('ff', {
	constraints: { reg: /abc/, msg: '매칭되지 실패!' }
});
```
- 위의 구성한 서비스 객체와 동일합니다.

또한 items 은 여러 테이블에 동일한 컬럼을 등록할 때 유용하게 데이터를 관리할 수 있습니다.

## 명령 영역 구성하기

서비스객체의 command 정보를 구성합니다.

타입 : command
```ts
type CmdValueType = {
	outputOption?: 0 | 1 | 2 | 3,  // 별칭 : outOpt
	config?: see axiosConfig, // axios type
	url?: string,
	views?: string[],
	cbBegin?: (cmd: BindCommand) => void,
	cbValid?: (view: MetaView, cmd: BindCommand) => boolean,
	cbBind?: (view: MetaView, cmd: BindCommand, cfg: object) => void,
	cbResult?: (data: object, cmd: BindCommand, res: object) => object,
	cbOutput?: (views: MetaViewCollection, cmd: BindCommand, res: object) => void,
	cbEnd?: (status: number, cmd: BindCommand, res: object) => void,
	onExecute?: (bindModel, bindCommand) => void,
	onExecuted?: (bindModel, bindCommand) => void,
};
type CommandType = {
	[key: string]: CmdValueType
};
// 서비스 객체에서 command 구성
type ServiceType = {
	command?: CommandType,
};
```
- `CmdValueType.url` 은 `CmdValueType.config.url` 값을 참조합니다.
- `CommandType` key 는 추가할 'command' 의 이름 입니다.

### 명령 타입 설명
-  outputOption : 뷰 출력 방식을 지정합니다. 기본값은 0입니다. 
-  config : axios의 설정 객체와 동일합니다.
-  url : `config.url`값이며, axios을 통해 요청할 URL 경로를 설정합니다.
- views : 추가할 출력 뷰(MetaView) 이름 입니다.
- cbBegin : 시작 전 콜백함수 입니다.
- cbValid : 유효성 검사 콜백함수 입니다.
- cbBind : 서버 요청 콜백함수 입니다.
- cbResult : 서버 응답 콜백함수 입니다.
- cbOutput : 응답 출력 콜백함수 입니다.
- cbEnd : 종료 전 콜백함수 입니다.

[24. Bind Command Composition - C#Callback (Attribute)]
예제 : command
```js
var bm = new BindModel({
	command: {
		create: {},
		read: {
			outputOption: 3,  // 데이터를 컬럼값에 설정하기 (지정한 컬럼)
			config: { method: 'GET' },  // GET 요청 설정
			cbEnd: function() { alert('정상처리되었습니다.'); } // 처리 완료 후 콜백 함수
		},
		update: {
			views: ['two'],  // 'two' 뷰를 추가
			url: '/user'     // 요청할 URL 경로
		}
	}
});
```
- 'create'  를 생성하고 
	- 기본값 outputOption = 0 을 설정합니다.
- 'read' 를 생성하고
	- outputOption = 3 을 설정하고
	- config 서버 요청을 설정하고
	- cbEnd 콜백함수를 설정합니다.
- 'update' 를 생성하고
	- 기본값 outputOption = 0 설정하고
	- 출력뷰 'two'을 추가하고
	- 서버요청 url 을 설정합니다.

예제 : 메소드를 통한 명령 구성
```js
var bm = new BindModel();

// 명령 생성
bm.addCommand('create');
bm.addCommand('read');
bm.addCommand('update');

// read 명령 설정
bm.commmand['read'].outputOption = 3;
bm.commmand['read'].config = { method: 'GET' };
bm.commmand['read'].cbEnd = { 
	alert('정상처리되었습니다.');
};

// update 명령 설정
bm.commmand['update'].newOutput('two');
bm.commmand['update'].url = '/user';
```
- 위의 구성한 서비스 객체와 동일합니다.

## 매핑 영역 구성하기

서비스객체에서 items 과 'command' 의 매핑을 구성합니다.

타입 : mapping
```ts
type ColumnName = string;            // '아이템명' | '컬럼명' | '테이블명.컬럼명';
type CommandName = '$all' | string;  // string = '명령 이름'
type ViewName = 'valid' | 'bind' | 'output' | '$all' | string; // 추가 뷰 이름
type MappingType = {
	[key: ColumnName]: {
		[key: CommandName]: ViewName | ViewName[]
	}
};
// 서비스 객체에서 mapping 구성
type ServiceType = {
	mapping?: MappingType
};
```

### 매핑 규칙
- 컬럼명(ColumnName) 
	- `'컬럼명'` : 기본테이블의 컬럼이 선택됩니다.
	- `'테이블명.컬럼명'` : 지정한 테이블의 컬럼이 선택됩니다. (없을시 생성) #REVIEW
- 명령명(CommandName) 
	- `'명령명'` : 지정한 command 가 선택됩니다.
	- `'$all'` : 전체 command 가 선택됩니다.
- 뷰명(ViewName)
	- `'valid', 'bind', 'output'` : 선택된 MetaView 에 매핑됩니다. (복수는 배열로 지정)
	- '`$all'` : 전체 MetaView 에 매핑됩니다.  (추가된 output 도 포함됨)
	
[00. Column mapping]

예제 : mapping
```js
var bm = new BindModel();
bm.setService({
	// 테이블 영역
	tables: ['second'],
	// 아이템 영역
	items: {
		aa: '',
		bb: '',
		cc: '',
		dd: ''
	},
	// 명령 영역
	command: {
		one: {},
		two: {},
	},
	// 매핑 영역
	mapping: {
		aa: { $all: ['valid'] }, // 모든 명령의 'valid' 뷰에 'aa' 등록
		bb: { one: ['bind'] },   // 'one' 명령의 'bind' 뷰에 'bb' 등록
		'second.cc': { two: ['output'] }  // 'two' 명령의 'output' 뷰에 'cc' 등록
	}
});

// bm.items.count == 4 ('aa','bb','cc','dd')
// bm.first.columns.count == 2 ('aa','bb')
// bm.second.columns.count == 1 ('cc')
// bm.cmd['one'].valid.columns.count == 1 ('aa')
// bm.cmd['one'].bind.columns.count == 1 ('bb')
// bm.cmd['one'].output.columns.count == 0
// bm.cmd['two'].valid.columns.count == 1 ('aa')
// bm.cmd['two'].bind.columns.count == 0
// bm.cmd['two'].output.columns.count  == 1 ('cc')
```
- 'aa' 아이템은 기본 테이블에 등록 되고, 모든 commnad 의 valid(MetaVeiw)에 매핑 됩니다.
- 'bb' 아이템은 기본 테이블에 등록 되고, 'one' commnad 의 bind(MetaVeiw)에 매핑 됩니다.
- 'cc' 아이템은 'second' 테이블에 등록 되고, 'two' commnad 의 output(MetaVeiw)에 매핑 됩니다.

타입 : setMapping()
```ts
type setMapping(
	mapping: PropertyCollection | object, 
	bTable?: MetaTable | string
) => void;
```
- mapping : 매핑할 컬렉션입니다.
- bTable : 매핑할 기본테이블 입니다. 기본값은 \_baseTable 입니다.

예제 : 메소드를 통한 매핑 구성
```js
var bm = new BindModel();

// 추가 테이블 생성
bm.addTable('second');

// 아이템 생성
bm.items.add('aa', '');
bm.items.add('bb', '');
bm.items.add('cc', '');
bm.items.add('dd', '');

// 명령 생성
bm.addCommand('one');
bm.addCommand('two');

// 아이템 매핑
bm.setMapping({
	aa: { $all: ['valid'] }, // 모든 명령의 'valid' 뷰에 'aa' 등록
	bb: { one: ['bind'] },   // 'one' 명령의 'bind' 뷰에 'bb' 등록
	'second.cc': { two: ['output'] }  // 'two' 명령의 'output' 뷰에 'cc' 등록
});
```
- 위의 구성한 서비스 객체와 동일합니다.

각 명령의 특정 뷰에 필요한 컬럼들을 효율적으로 매핑할 수 있으며, 이를 통해 데이터 처리의 일관성을 유지하고 관리의 편의성을 높일 수 있습니다.

## 함수 영역 구성하기

서비스객체의 사용자함수를 구성합니다.

타입 : fn
```ts
type fnType = {
	[key: string]: Function;
};
// 서비스 객체에서 fn 구성
type ServiceType = {
	fn?: fnType
};
```
- key 는 사용자함수명입니다.

예제 : fn
```js
var bm = new BindModel({
	cbBaseBegin: function(cmd) {
		Access the parameter at cmd._model.fn.ecCreate(); // cmd 에서 파라메터로 접근
		this.bindModel.fn.sum(1, 1); // this.bindModel로 접근
	},
	command: {
		create: {
			cbEnd: function() {
				this.bindModel.fn.sum(1, 2);
			}
		},
	},
	fn: {
		sum: function(a, b) {return a + b},
		execCreate: function() {
			this.bindModel.cmd.read.execute();
		}
	}
});

// 이벤트 등록
$('#btn_create').click(function() {
	bm.fn.execCreate();
});
```
- 콜백함수에서 `파라메터` 또는 `this.bindModel` 속성으로 BindModel 객체에 접근할 수 있습니다.

예제 : 메소드를 함수 구성
```js
var bm = new BindModel();

// 함수 구성
bm.fn.add('sum', function(a, b) {return a + b});
bm.fn.add('execCreate', function() {
	this.bindModel.cmd.read.execute(); // this.bindModel 로 접근
});

// 공통 콜백 구성
bm.cbBaseBegin = function(cmd) {
	cmd._model.fn.execCreate();  // cmd 파라메터로의 접근
	this.bindModel.fn.sum(1, 1); // this.bindModel 로 접근
};

// 명령 구성
bm.addCommand('create');
bm.command['create'].cbEnd = function() {
	this.bindModel.fn.sum(1, 2);  // this.bindModel 로 접근
}

// 이벤트 등록
$('#btn_create').click(function() {
	bm.fn.execCreate();  // 외부에서 함수 접근
});
```
- 위의 구성한 서비스 객체와 동일합니다.

각각 영역은 결합도를 높이고, 재사용성과 유지보수성을 높일 수 있습니다.ty and maintenance.

## 전처리 영역 구성하기

서비스객체의 전처리 정보를 구성합니다. 주로 서비스객체를 자동화 할 때 사용합니다.

타입 : init(), preRegister, preCheck, preReady
```ts
type init = () => void;

type preRegister = (bindModel) => void; 
type preCheck = (bindModel) => boolean; 
type preReady = (bindModel) => void; 
```

### 전처리 호출 흐름

1. init() 메소들 호출하면 preRegister, preCheck, preReady 순차적으로 호출됩니다.
2. preCheck 에서 false 을 리턴하면 preReady 는 호출하지 않고 cbFail 을 호출됩니다.
3. preCheck 에서 true 을 리턴하면 preReady 호출됩니다.

전처리는 서비스객체와 화면 페이지와의 상호작용 또는 selector 유효성 검사에 활용됩니다.

예제 : 전처리
```js
var bm = new BindModel({
preRegister: function(bindModel) { 
		// 전처리 : 검사전
	},
	preCheck: function(bindModel) {
		// 전처리 : 검사
		if (bm.checkSelector().length === 0) return true;
	},
	preReady: function(bindModel) { 
		// 전처리 : 준비 완료
		bindModel.command['test'].execute();
	},
});

$(document).ready(function () {
	bm.init();
});
```
- 페이지가 준비되면 init() 메소드를 호출해서 DOM 을 검사하고, 'test' command 를 실행합니다.

예제 : 메소드를 전처리 구성
```js
var bm = new BindModel();
// BindModel Settings...

bm.preRegister = function(bindModel) { 
	// 전처리 : 검사전
};
bm.preCheck = function(bindModel) { 
	// 전처리 : 검사
	if (bm.checkSelector().length === 0) return true;
};
bm.preReady = function(bindModel) { 
	// 전처리 : 준비 완료
	bindModel.command['test'].execute();
};

$(document).ready(function () {
	bm.init();
});
```
- 위의 구성한 서비스 객체와 동일합니다.

전처리 영역은 자동화가 필요할 경우 활용할 수 있습니다.


# 기능

## 서비스 객체 주입하기

`BindModel` 객체를 생성할 때 파라미터 전달하거나, setService() 메소드를 호출하여 서비스 객체를 주입할 수 있습니다. 

타입 : setservice()
```ts
type setService = (service: IService, isTypeCheck: boolean = false) => void;
```
-  service : 주입할 서비스 객체입니다.
- isTypeCheck : 타입 검사를 할지 여부를 설정합니다. 기본값은 false 입니다.

setService() 메소드로 사용은 서비스객체 분리하여 코드의 가독성과 유지보수성을 높여줍니다.

예제 : 생성자를 통한 주입
```js
var bm1 = new BindModel({
	items: {
        aa: 'Cat',
        bb: 10,
        cc: true,
    },
    fn: {
        sum: function(a, b) { return a + b; },
    },
    url: '/user',
    command: {
        read: {
            outputOption: 3,
            cbEnd: function() { console.log('Normal Processed'); }
        },
        update: {
            views: ['two'],
            url: '/user'
        }
    },
    mapping: {
        aa: { $all: ['valid'] },
        bb: { read: ['bind'], update: 'output' },
        cc: { update: ['output'] }
    },
});
```
예제 : setService() 메소드로 주입
```js
// items, fn 구성
var svcItems = {
	items: {
        aa: 'Cat',
        bb: 10,
        cc: true,
    },
    fn: {
        sum: function(a, b) { return a + b; },
    }
};

// 기타 구성
var svcCommon = {
    baseConfig: { method: 'GET' },
    url: '/user',
    command: {
        read: {
            outputOption: 3,
            config: { method: 'GET' },
            cbEnd: function() { console.log('Normal Processed'); }
        },
    },
    mapping: {
        aa: { $all: ['valid'] },
        bb: { read: ['bind'], update: 'output' },
        cc: { update: ['output'] }
    },
};

barbm = new BindModel(); // 파라메터를 통한 주입

bm2.setService(svcItems);
bm2.setService(svcCommon);
```
- 위의 구성한 서비스 객체와 동일합니다.
- 첫번째 setService() 메소드 호출에서는 items, fn 을 서비스를 설정합니다.
- 두번째 setService() 메소드 호출에서는 command, mapping 등 서비스를 설정합니다.

중복된 설정은 마직막 값을 유지되며, 이벤트 값의 경우는 추가됩니다.

'items', 'fn' 영역 다른 영역에 대한 의존성이 낮습니다.
서비스 객체를 통해 공통 설정을 관리하고, 재사용성을 높일 수 있습니다. 

## 서비스 클래스로 정의하기

### 상속을 통한 서비스객체 생성

서비스를 클래스로 제작하여 공통 부분을 코드의 재사용성을 높일 수 있습니다.
서비스 클래스를 다양한 구조로 활용할 수 있습니다.

common-svc.js
```js
class CommonService() {
	cbFail = function(msg) {
		console.warn ("user failure handling:+ msg");
	};
	cbError = function(msg) {
		console.error ("User error handling")
	};
}
```
- 공통으로 사용되는 영역을 공통서비스 클래스로 작성하였습니다.

member-svc.js
```js
class MemberService(suffix) extends CommonService {
	items = {
		idx: -1,
		user_no: { selector: { key: '#user_no'+ suffix, type: 'value' } },
		u_name: { selector: { key: '#u_name'+ suffix, type: 'value' } },
	};
	command = {
		create: 0,
		read: {
			outputOption: 3,
			cbEnd: () => { alert('Normal Processed'); }
		}
	};
	mapping = {
		idx: { 
			read: ['valid', 'bind'] 
		},
		u_name: { 
			create: ['valid', 'bind'],
			read: ['output']
		},
		user_no: { 
			create: ['bind'],
			read:: ['output'],
		}
	};
	preCheck = function(bindModel) { 
		if (bm.checkSelector().length === 0) return true;
	}
};
```
- suffix 파라메터는 selector 이름의 충돌을 방지를 접두사입니다.

member.html
```html

<div>
	Class number <h2 id="user_no"></h2>
</div>
<div>
	이름 <input id="u_name" type="text"/>
</div>
<button id="btn_Create" type="button">추가</button>

<script src="BindModel.js"></script>
<script src="common-svc"></script>
<script src="member-svc"></script>
<script>

	var meb = new _L.BindModel(new MemberService());
	
	meb.url = 'http://SEVER_URL'; // 요청경로를 설정합니다.
	meb.preReady = function(bindModel) {
		$('#btn_Create').click(bindModel.command.execute());
	};
	
	$(document).ready(function () {
		meb.init();
	});

</script>
```
- 페이지를 준비가 되면 init() 메소드 호출되어 preReady 에서  selector 유효성 검사를 합니다.
- '추가' 버튼 클릭시 command.create.execute() 실행하여, 서버요청 결과를 화면에 바인딩합니다.

화면의 paging 처리 같은 공통 부분을 관리하기에 용이합니다.


