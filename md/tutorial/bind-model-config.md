---
lang: ko
title: "바인드 모델 구성"
layout: single
permalink: /ko/docs/bind-model-config/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---
`BindModel`는 프레임워크의 핵심 클래스이며, 주요 기능으로 명령 추가, 컬럼 추가, 테이블 추가, 서비스 객체 주입 등을 지원합니다.

### 주요 기능

- 명령 추가 : `BindCommand` 객체를 추가합니다.
- 컬럼 추가 : `HTMLColumn` 객체를 추가합니다.
- 테이블 추가 : `MetaTable` 객체를 추가합니다.
- 기본 콜백함수 제공 : 단계별 기본 콜백함수를 제공합니다.
- 서비스객체 주입 : 서비스 객체를 주입하여 `BindModel` 객체를 구성합니다.

### 주요 속성

- 'baseConfig' : 기본 axios 의 config 설정 객체입니다.
- 'url' : `baseConfig.url` 경로입니다. 
- 'columns' :  `HTMLColumn` 을 제어하는 컬렉션입니다.
- 'command' : `BindCommand` 을 제어하는 컬렉션입니다. (별칭 : cmd)
- 'fn' :  사용자 함수를 제어하는 컬렉션입니다.
- 'items' : item 을 제어하는 컬렉션 입니다. (컬럼의 원시 속성)
- '\_tables' : `MetaTable` 을 제어하는 컬렉션입니다.
- '\_baseTable' : 기본 테이블 입니다. ('columns' = \_baseTable.columns)

### 이벤트

- `onExecute` :  공통으로  execute() 실행시 처음으로 호출합니다.
- `onExecuted` : 공통으로 execute() 실행시 마지막으로 호출합니다.

### 콜백(속성)

- 'cbBaseBegin' : 기본 시작 전 콜백함수 입니다.
- 'cbBaseValid' : 기본 유효성 검사 콜백함수 입니다.
- 'cbBaseBind' : 기본 서버 요청 콜백함수 입니다.
- 'cbBaseResult' : 기본 서버 응답 콜백함수 입니다.
- 'cbBaseOutput' : 기본 출력 콜백함수 입니다.
- 'cbBaseEnd' : 기본 종료 전 콜백함수 입니다.
### 주요 메소드

- addCommand() : `BindCommand` 객체를 생성합니다.
- addTable() : `MetaTable` 객체를 추가합니다.
- setService() : 서비스 객체를 주입하여 `BindModel`  객체를 구성합니다.
- checkSelector() :  'selector' 객체로 DOM 유효성 검사합니다.
- getSelector() : 'selector' 객체 목록을 가져옵니다.
- addColumn() : `HTMLColumn` 객체를 추가합니다.
- addColumnValue() : `HTMLColumn` 객체를 추가하고, 'value' 값을 설정합니다.
- setMapping() : `HTMLColumn` 을 `BindCommand` 의 `MetaView` 객체에 매핑합니다.
- init() : 'preRegister', 'preCheck', 'preRedy' 콜백함수를 순차적으로 실행합니다.

`BindModel` 는 다목적 프레임워크로, 다양한 명령과 테이블, 컬럼을 유연하게 추가하고 관리할 수 있는 기능을 제공합니다. 이 문서를 통해 이 클래스의 주요 기능과 콜백을 숙지하여 효과적으로 사용할 수 있습니다.


## 서버 요청 설정하기

### 기본 요청 경로

url 속성은 서버에 요청하는 기본 URL 경로를 설정합니다. BindCommand 객체에 url 경로를 설정하면, BindModel의 url 경로는 무시됩니다.

```js
var bm = new BindModel();

bm.url  = '/user';
```

#### 동적 url 설정하기

특정 작업(command)에 따라 요청 경로를 동적으로 변경해야 할 경우, BindModel 객체의 콜백 함수를 활용하여 URL을 쉽게 설정할 수 있습니다.

 ```js
 var idx = 1;
 bm.cbBegin = function(cmd) {
	cmd._model.url = `/user/${idx}`;
 };
```
- `cmd._model`은 BindCommand가 포함된 BindModel을 참조합니다.

### 기본 요청 환경 설정(axios)

HTTP 통신을 위한 axios의 기본 설정을 통해 요청 환경을 구성할 수 있습니다. 

```js
var bm = new BindModel();
// Axios Preference Example
bm.baseConfig.baseURL = 'https://api.example.com';
bm.baseConfig.timeout = 10000; // 10초
bm.baseConfig.headers.common['Authorization'] = 'Bearer YOUR_TOKEN';
bm.baseConfig.headers.post['Content-Type'] = 'application/json';
```
- baseURL : 모든 요청에 공통으로 적용될 기본 URL을 설정합니다.
- timeout : 요청의 최대 대기 시간을 설정합니다.
- headers : 요청 시 사용할 기본 헤더를 설정합니다. 예를 들어, 인증 토큰을 설정하거나 콘텐츠 유형을 지정할 수 있습니다.


## 실행 이벤트 설정하기

모든 명령의 execute() 실행 시 호출되는 전역 이벤트입니다.

타입 : onExecute, onExecuted
```ts
type onExecute = (model: BindModel, cmd: BindCommand) => void; 
type onExecuted = (model: BindModel, cmd: BindCommand) => void; 
```
- 'onExecute' 이벤트는 모든 execute() 실행시 처음으로 호출됩니다.
- 'onExecuted' 이벤트는 모든 execute() 실행시 마지막으로 호출됩니다.

```js
var bm = new BindModel();
bm.addCommand('read');
// Global Event Settings
bm.onExecute = () => { 
	console.log('model 에서 onExecute 호출')
};
bm.onExecuted = () => { 
	console.log('model 에서 onExecuted 호출')
};
// Execute
bm.command['read'].execute();

// Output results:
// Call onExecute from model
// Call onExecuted in model
```
## 오류 및 실패 처리하기

### 오류 처리

모든 오류 및 예외 발생 시 호출되는 콜백입니다.
타입 : cbError
```ts
type cbError = (msg: string, status: number, response: object) => void;
```
cbError 발생 시점은
- 서버 요청 관련 axios error, ajax error 발생시 호출됩니다.
- 모든 에러 및 예외 발생시 호출됩니다.

```js
var bm = new BindModel();

bm.cbError = function(msg, status, res) { 
	console.error('Err: '+ msg); 
};
```
- 'cbError' 의 기본값을 객체생성시 제공됩니다.

### 실패 처리

논리적 실패 메시지를 처리합니다. (주로 유효성 검사 실패시 사용합니다.)

타입 : cbFail
```ts
type cbFail = (msg: string, valid: MetaView) => void;
```
'cbFail' 발생 시점은 execute() 메소드 실행되어
-  `valid(MetaView)` 유효성 검사가 실패한 경우 호출됩니다.
- 'cbValid' / 'cbBaseValid' 콜백함수에서 false 반환한 경우 호출됩니다.

```js
var bm = new BindModel();

bm.cbFail = function(msg, valid) { 
	console.warn ('Failed. Err:'+ msg); 
};
```
- 'cbFail' 의 기본값을 객체생성시 제공됩니다.

## 흐름 제어하기 (hooking)

execute() 실행시 순차적으로 콜백함수가 호출되어흐름을 제어할 수 있습니다. 

[[41. Callback Lifecycle-B|Refer to: Callback Lifecycle]

### 1. 기본 시작시 콜백

execute() 호출시 처음으로 호출되는 콜백입니다.
대상 'cbBegin' 이 'cbBaseBegin' 콜백보다 우선순위가 높습니다.

타입 : cbBaseBegin
```ts
type cbBaseBegin = (cmd: BindCommand) => void;
```
 일반적인 활용방안은
- url 및 config 의 공통 정보 설정에 활용됩니다.


```js
var bm = new BindModel();

bm.cbBaseBegin = function(cmd) {
	cmd.url = '/member/1';
};
```
### 2. 기본 유효성 검사 콜백

execute() 실행시 `valid(MetaView)` 에 대한 유효성 검사 전에 호출되는 콜백입니다.
대상 'cbValid' 이 'cbBaseValid' 콜백보다 우선순위가 높습니다.
리턴값이 false 이면 'cbFail' 콜백 호출되고 종료합니다.
타입 : cbBaseValid
```ts
type cbBaseValid = (valid: MetaView, cmd: BindCommand) => boolean;
```
일반적인 활용방안은
- 서버 요청전 검사에 활용됩니다.
- 사용자에게 처리결과를 확인하는 용도로 활용됩니다.

```js
var bm = new BindModel();

bm.cbBaseValid = function(view, cmd) { 
	return view.colums.count <= 0;
};
bm.cbBaseValid = function(view, cmd) {
	return confirm ('Do you want to delete?');
};
```
### 3. 기본 서버 요청 콜백

execute() 실행시 `bind(MetaView)` 컬럼값을 전송하기 전에 호출되는 콜백입니다.
대상 'cbBind' 이 'cbBaseBind' 콜백보다 우선순위가 높습니다.

타입 : cbBaseBind

```ts
type cbBaseBind = (view: MetaView, cmd: BindCommand, config: object) => void;
```

일반적인 활용방안은
- 전송타입의 설정에 활용됩니다. (enctype)
- 통합 로그인 관련 설정에 활용됩니다.
- 비밀번호 암호화에 활용됩니다.

### 4. 기본 서버 응답 콜백

execute() 실행시 서버에서 응답을 받은 후에 호출되는 콜백입니다.
대상 'cbResult' 이 'cbBaseResult' 콜백보다 우선순위가 높습니다.

타입 : cbBaseRes
```ts
type cbBaseResult = (data: object, cmd: BindCommand, res: object) => object;
```

일반적인 활용방안은
- 응답받은 data 를 `MetaView` 형식의 스키마로 변경하는 용도로 활용됩니다.


```js
var bm = new BindModel();
// data = { aa: 1, bb: 2 }
bm.cbBaseResult = function(data) {
	return {
		rows: data
	};
};
```
- 리턴값 : `{ rows: {aa: 1, bb: 2 }} `

### 5. 기본 출력 콜백

응답을 \_outputs 컬렉션으로 읽어들인 후에 호출되는 콜백입니다.
대상 'cbOutput' 이 'cbBaseOutput' 콜백보다 우선순위가 높습니다.
`BindCommand` 출력옵션에 따라서 data와 '\_outputs' 컬렉션에 가져오는 방식이 달라집니다.

[24. Bind Command Configuration - C# Type of Output Option (output) | Reference: Type of Output Option]

타입 : cbBaseOutput
```ts
type cbBaseOutput = (views: MetaViewColleciton, cmd: BindCommand, res: object) => void; 
```

일반적인 활용방안은
- 응답받은 `output(MetaView)`을 사용하여 화면(html) 바인딩에 활용됩니다.

```json
{
	"rows": [
		{ "u_name": "Hong Gildong", "gender", "M" },
		{ "u_name": "Sungchunhyang", "gender", "W" },
	]
}
```

```js
var bm = new BindModel();

bm.cbBaseOutput = function(views) {
	// views[0] instanceof MetaView
	for(var i = 0; i < views[0].rows.count; i++) {
		var row = views['first'].rows[i];
		console.log(i, row['u_name'], row['gender']);
	}
}
// 0 Hong Gil-dong M
// 1. Sung Chunhyang W
```
- - `views[0]` 은 `BindCommand` 의 'output' 과 동일합니다.

[[42. Multi-view (output)-C | Reference: Multi-view (output)]

### 6. 기본 종료시 콜백

execute() 실행시 마지막으로 호출되는 콜백입니다.
대상 'cbEnd' 이 'cbBaseEnd' 콜백보다 우선순위가 높습니다.

타입 : cbBaseEnd
```ts
type cbBaseEnd = (status: number, cmd: BindCommand, res: object) => void; 
```

일반적인 활용방안은
- 성공 메세지 전달에 활용합니다.
- 경로 리다이렉트에 활용합니다.
- 다른 명령의 execute() 체인 연결에 활용합니다.

```js
var bm = new BindModel();

bm.cbBaseEnd = function(views) {
	alert('Normal Processed');
};
```

## 명령 추가하기

addCommand() 메소드를 호출해서 `BindCommand` 객체를 생성합니다.
`BindCommand` 객체는 바인드 모델의 처리 단위이며, 'valid', 'bind', 'output' 속성의 `MetaView` 를 포함하고 있습니다.

타입 : addCommand()
```ts
function addCommand(cmdName: string, outOpt?: number = 0, bTable?: string | MetaTable): BindCommand;
```
- 'cmdName' 의 `BindCommand` 의 별칭을 지정하고 출력옵션으로 추가합니다. (기본값 outOpt = 0)
- bTable 을 지정하면, 추가한 `BindCommand` 의 '\_baseTable' 이 설정됩니다.

```js
var bm = new BindModel();

bm.addCommand('create');
bm.addCommand('read', 3);

// bm.command['create'] instanceof BindCommand
// bm.command['read'] instanceof BindCommand
// bm.command['create'].outputOption == 0 
// bm.command['read'].outputOption == 3 
```
- outOpt 기본값은 '0' 입니다.
- 추가한 `BindCommand` 객체는 'command' 컬렉션으로 접근할 수 있습니다.
- 'command' 는 'cmd' 별칭을 제공합니다.

예제 : 기본테이블 지정
```js
var bm = new BindModel();

bm.addTable('second');

bm.addCommand('list', 1, 'second');
bm.addCommand('edit', 3, bm.second);

// bm.command['list']._baseTable === bm.second
// bm.command['edit']._baseTable === bm.second
```
- `BindCommand` 추가시 `MetaTable` 을 지정하면 모든 `MetaView` 는 'baseTable' 이 설정됩니다.

## 컬럼 추가하기

컬럼을 추가합니다.

타입 : addColumn(), addColumnValue()
```ts
type addColumn = (
	colName: string, 
	cmds?: string | string[], 
	views?: string | string[], 
	bTable?: string | MetaTable
) => BindCommand;

type addColumnValue = (
	colName: string, 
	value: any, 
	cmds?: string | string[], 
	views?: string | string[], 
	bTable?: string | MetaTable
) => BindCommand;
```
- cmds, views을 생략하면 기본테이블에 컬럼이 추가됩니다.
- cmds 와 views 을 지정하면 'command' 의 MetaView 에 참조가 등록됩니다.
- cmds 파라메터에 '$all' 지시자를 사용하면, 모든 'command' 에 추가됩니다.

### 컬럼 추가

기본테이블(\_baseTable)에 컬럼을 추가합니다.

```js
var bm = new BindModel();
// Add Column
bm.addColumn('aa');
bm.addColumnValue('bb', 'man');

// bm.columns['aa'].value  == ''
// bm.columns['bb'].value  == 'man'
// bm._baseTable === bm._tables['first'] === bm._tables[0] === bm.first
```
- addColumn() 메소드를 호출하여 'aa' 이름의 컬럼이 추가됩니다.
- addColumnValue() 메소드를 호출하여 'bb' 이름의 컬럼이 추가되고 'man' 값이 설정됩니다.
- 'bTable' 을 지정하여 지정된 `MetaTable` 에 컬럼에 추가할 수 있습니다.  (기본값 : '\_baseTable')

### 컬럼 추가 및 매핑

기본테이블에 컬럼을 추가하고 대상 `BindCommand` 에 매핑합니다.

```js
var bm = new BindModel();
// command generation 
bm.addCommand('cmd1');
bm.addCommand('cmd2');
bm.addCommand('cmd3');
// Add Column
bm.addColumn('aa', 'cmd1');
bm.addColumn('bb', ['cmd2', 'cmd3'], ['valid', 'bind']);
bm.addColumn('cc', '$all', 'output');

// bm['first'].columns.count  == 3 ('aa', 'bb', 'cc')

// bm.command['cmd1'].valid.columns.count  == 1 ('aa')
// bm.command['cmd1'].bind.columns.count   == 1 ('aa')
// bm.command['cmd1'].output.columns.count == 2 ('aa', 'cc')

// bm.command['cmd2'].valid.columns.count  == 1 ('bb')
// bm.command['cmd2'].bind.columns.count   == 1 ('bb')
// bm.command['cmd2'].output.columns.count == 1 ('cc')

// bm.command['cmd3'].valid.columns.count  == 1 ('bb')
// bm.command['cmd3'].bind.columns.count   == 1 ('bb')
// bm.command['cmd3'].output.columns.count == 1 ('cc')
```
- addCommand() 메소드로 지정한 이름의 `BindCommand` 를 추가합니다.
- 'aa' 이름의 컬럼은 지정한(cmd1) 의 모든 `MetaView` 에 매핑됩니다.
- 'bb' 이름의 컬럼은 지정한(cmd2, cmd3) 의 `MetaView(valid, bind)` 에 매핑됩니다.
- 'cc' 이름의 컬럼은 전체(cmd1, cmd2, cmd3) 의  `MetaView(output)` 에 매핑됩니다.

### 추가한 테이블에 컬럼 추가 및 매핑

지정한 `MetaTable` 에 컬럼을 추가하고 대상 `BindCommand` 에 매핑합니다.

```js
var bm = new BindModel();
// Adding Tables and Commands
bm.addTable('second');
bm.addCommand('cmd1');
// Adding and mapping columns
bm.addColumn('aa', 'cmd1', 'valid');
bm.addColumn('bb', 'cmd1', 'bind', 'second');

// bm['first'].columns.count  == 1 ('aa')
// bm['second'].columns.count == 1 ('bb')

// bm.command['cmd1'].valid.columns.count  == 1 ('aa')
// bm.command['cmd1'].bind.columns.count   == 1 ('bb')
// bm.command['cmd1'].output.columns.count == 0
```
- addTable() 메소드로는 `MetaTable` 을 '\_tables' 컬렉션에 추가합니다.
- addCommand() 메소드로 지정한 이름의 `BindCommand` 를 추가합니다.
- 'aa' 이름의 컬럼은 기본 테이블에 추가하고  지정한 `MetaView(valid)` 에 매핑됩니다.
- 'bb' 이름의 컬럼은 `second(MetaTable)`에 추가하고  지정한 `MetaView(bind)`에 매핑됩니다.

## 테이블 추가하기

addTable() 메소드로 `MetaTable` 을 추가합니다.

타입 : addTable()
```ts
type addTable (tableName: string) => MetaTable;
```


일반적인 활용방안은
- 기본테이블을 변경할 활용합니다.
- \_baseTable 을 변경하기 위한 테이블을 생성할 때 활용합니다.
- 'command' 의 `MetaView` 의 참조 테이블로 지정할 때 활용합니다.

```js
var bm = new BindModel();
// step A
bm.addTable('second');
bm.addTable('three');
// step B
bm._baseTable = bm.second;  // baseTable 설정
bm.addColumn('aa');
// step C
bm.addCommand('cmd1', 0, 'three');
bm.command['cmd1'].addColumn('bb');

// bm['first'] === bm._tables['first'] === bm._tables[0]
// bm['second'] === bm._tables['second']
// bm['three'] === bm._tables['three']

// bm['first'].columns.count  == 0
// bm['second'].columns.count == 1 ('aa')
// bm['three'].columns.count  == 1 ('bb')

// bm.command['cmd1']._baseTable === bm.second

// bm.command['cmd1'].valid.columns.count  == 1 ('bb')
// bm.command['cmd1'].bind.columns.count   == 1 ('bb')
// bm.command['cmd1'].output.columns.count == 1 ('bb')
```
- A : addTable() 메소드로 `MetaTable` 이 '\_tables' 컬렉션과 `BindModel` 객체에 추가됩니다.
- B : '\_baseTable' 을 지정하여 기본테이블을 `second(MetaTable)`로 변경하였습니다.
- C : addCommand() 메소드에서  'cmd1' 의 '\_baseTable' 을 'three' 로 지정하였습니다.

## 전역 아이템 설정하기 (global column)

'items' 는 컬럼의 원시 정보를 가지고 있습니다.

일반적인 활용방안은
- `BindModel` 에 서비스객체를 주입할때 컬럼의 전역정보를 관리하는데 활용합니다.
- 하나의 컬럼을 여러 테이블에 공유될때 활용합니다.
- 'selector' 속성으로 DOM 유효성 검사에 활용합니다.

### 아이템 추가

아이템의 추가하는 방법으로는 items 컬렉션에서 추가하는 방법과, 서비스객체에서 추가할 수 있습니다.

[[25. 서비스 객체 구성-C#아이템 영역 구성하기| 참조 : 서비스객체의 아이템 구성하기]]
타입 : items.add()
```ts
type ColumnType = {
	selector: SelectorType,
	getter: ()=>any,
	setter: (val)=>any,
	getFilter: ()=>any,
	setFilter: (val)=>any,
	default: stirng | number | boolean | null, // 기본값
	value: any,
	alias: string,
	caption: string,
	constraints: ConstrainstType,  // 제약조건
	required: boolean | false, // required
};
type ValueType = string | number | boolean | ColumnType;

// items.add()
type add = (itemName: string, iType: ValueType) => void;
```

```js
var bm = new BindModel();
// Add Item
bm.items.add('col1', 1);
bm.items.add('col2', '');
bm.items.add('col3', { columnName: 'newCol3'});
bm.items.add('col4', {selector: { key:'#ID', type: 'value'}});
// Create as item column
bm._readItem();
```
- 'col1' 이름의 아이템에 추가하고 `{value: 1}` 값을 설정합니다.
- col2' 이름의 아이템에  추가하고 `{value: ''}` 값을 설정합니다.
- 'col3' 이름의 아이템에 추가하고 `{columnName: 'newCol3'}` 값을 설정합니다..
- 'col4' 이름의 아이템에 추가하고 `{selector: { key:'#ID', type: 'value'}}` 값을 설정합니다.
- \_readItem() 메소드를 호출하면 아이템이 기본테이블에 컬럼으로 생성됩니다.

### 아이템 유효성 검사

 checkSelector() 메소드로 items 컬렉션의 selector 속성의 DOM 에서 유효한지 검사할 수 있습니다.
타입 : checkSelector()
```ts
type checkSelector = (
	collection?: PropertyCollection = this.items, 
	isLog: boolean = false
) => string[];
```
- 'collection'  파라메터의 기본값은 `this.items` 의 컬렉션입니다.
- 'collection' 으로 items, columns, `['테이블명'].columns`, `valid.columns`, `bind.columns`, `output.columns` 으로 지정할 수 있습니다.
- isLog = true 을 설정하면, 실패한 'selector' 의 'key' 값이 콘솔창에 출력됩니다.

```js
var bm = new BindModel();
// Add Item
bm.items.add('item1', {selector: { key:'#user_name', type: 'value'}});
bm.items.add('item2', {selector: { key:'.sub_name', type: 'text'}});
bm.items.add('item3', {selector: { key:'input[name=gender]', type: 'none'}});
// Selector Examination
bm.checkSelector(); // Empty Array Check Successful
```
- checkSelector() 메소드는 'items' 의 'selector' 값이 유효한지 검사합니다.

preCheck 콜백함수를 통해서 서비스객체 주입시 DOM 유효성 검사를 자동으로 처리할 수 있습니다.

[25. Service Object Configuration-C | Reference: Service Object Configuration]

```js
var bm = new BindModel();

bm.columns.add('item1', {selector: { key:'#user_name', type: 'value'}});
bm.columns.add('item2', {selector: { key:'.sub_name', type: 'text'}});
bm.columns.add('item3', {selector: { key:'input[name=gender]', type: 'none'}});

bm.checkSelector (bm.column, true); // List of failed selector objects
```
- DOM 에서 해당 요소가 존재하는지 검사합니다.
  `< ... id="user_name">, \< ... class="sub_name">, \<input name="gender"... >`


## 셀렉터 조회하기(selector)

'items' 컬렉션의 'selector' 목록을 얻습니다.
타입 : getSelector(
```ts
type KeyType = 'none' | 'value' | 'text' | 'html' | 'prop' | 'attr' | 'css';
type SelectorType = { key: string, type: KeyType };

type getSelector = (
	collection?: PropertyCollection = this.items
) => SelectorType[];
```
- 'collection' 파라메터의 기본값은 this.items 컬렉션입니다.

```js
var bm = new BindModel();

bm.columns.add('item1', {selector: {key:'#ID1', type: 'value'}});
bm.columns.add('item2', {selector: {key:'#ID2', type: 'text'}});

bm.getSelector();
// [{key:'#ID1', type: 'value'}, {key:'#ID2', type: 'text'}]
```
```
- 지정한 컬렉션의 'selector' 의 목록을 얻을 수 있습니다. 


