---
lang: ko
title: "BindCommand 구성"
layout: single
permalink: /ko/docs/bind-commnad-config/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

`BindCommand` 는 연관된 `MetaView` 의 묶음으로 execute() 메소드로 작동합니다.

### 주요 기능

- 흐름제어 : 단계별 콜백함수로 흐름 제어 할 수 있습니다.
- 컬럼 추가 : `HTMLColumn` 객체의 추가합니다.(컬럼 참조값)
- 응답 관리 : 서버 응답을 `MetaView` 로 바인딩 합니다.
- 유효성 검사 : 컬럼 제약조건 설정으로 유효성 검사를 합니다.
### 주요 속성

- 'outputOption' : 옵션에 따라 output(MetaView) 불러오는 방식입니다.
- 'url' : `axios.url` 경로 입니다.
- 'config' : `axios` config 객체 입니다.
- 'valid' : 유효성 검사하는 `MetaView` 입니다.
- 'bind' : 서버에 요청하는 `MetaView` 입니다.
- 'output' : 서버의 응답받는 `MetaView` 입니다. 
- '\_outputs' : 출력과 관련된 `MetaView` 를 제어하는 컬렉션입니다.
- '\_model' : `BindModel` 객체를 가르킵니다 (소유자)

### 콜백(속성)

- 'cbBegin' : 시작 전 콜백함수 입니다.
- 'cbValid' : 유효성 검사 콜백함수 입니다.
- 'cbBind' : 서버 요청 콜백함수 입니다.
- 'cbResult' : 서버 응답 콜백함수 입니다.
- 'cbOutput' : 출력 콜백함수 입니다.
- 'cbEnd' : 종료 전 콜백함수 입니다.

### 이벤트

- `onExecute` :   execute() 실행시 처음으로 호출합니다.
- `onExecuted` : execute() 실행시 마지막으로 호출합니다.
- 
### 주요 메소드

- execute() : `BindCommand` 객체를 실행합니다.
- addColumn() : `HTMLColumn` 객체를 추가합니다.
- addColumnValue() : `HTMLColumn` 객체를 추가하고, 'value' 값을 설정합니다.
- setColumn() : 지정한 컬럼을 `MetaView` 에 참조로 등록합니다.
- release() : 지정한 MetaView 에 참조를 해제합니다.
- newOutput() : 응답 출력 `MetaView` 을 추가합니다. (\_outputs)
- removeOptput() : 출력 `MetaView` 를 제거합니다. (\_outputs)

## 명령별 서버 요청 설정하기

### 명령별 요청 경로

'url' 은 서버에 요청하는 url 경로 입니다. 값이 없으면 'baseUrl' 으로 대체됩니다.

```js
var bm = new BindModel();

bm.addCommand('cmdA');
bm.addCommand('cmdB');

bb.command['cmdA'].url = '/user/1';
bb.command['cmdB'].url = '/list';
```
- command 'cmdA', 'cmdB'는 다른 경로를 가집니다.

#### 동적 url 설정하기

때로는 특정 작업(command)에 따라 요청 경로(url)를 동적으로 변경해야 할 때가 있습니다. BindModel 객체의 콜백 함수를 통해서 쉽게 설정할 수 있습니다.

 ```js
 var idx = 1;
 bb.command['cmdA'].cbBegin = function(cmd) {
	 cmd.url = `/user/${idx}`;
 };
```
### 요청 환경 설정(axios)

http 통신을 위한 axios 의 config 를 설정합니다.
#TODO

## 명령별 이벤트 설정하기

명령별 이벤트 설정은 execute() 메서드를 실행할 때 특정 이벤트를 호출하여 다양한 작업을 수행할 수 있도록 하는 기능입니다.

타입 : onExecute, onExecuted
```ts
// Event Type
type onExecute = (model: BindModel, cmd: BindCommand) => void; 
type onExecuted = (model: BindModel, cmd: BindCommand) => void; 
```
- onExecute : 해당 execute() 메서드가 처음 실행될 때 호출됩니다.
- onExecuted :  해당 execute() 메서드가 실행된 후 마지막으로 호출됩니다.

이 이벤트 타입들은 BindModel과 BindCommand 객체를 인자로 받아 다양한 작업을 수행할 수 있게 합니다.

```js
var bm = new BindModel();

bm.addCommand('read');
// Global Event Settings
bm.onExecute = function() { 
    console.log('model 에서 onExecute 호출');
};
bm.onExecuted = function() { 
    console.log('model 에서 onExecuted 호출');
};
// Command Event Settings
bm.command['read'].onExecute = function() { 
    console.log('command 에서 onExecute 호출');
};
bm.command['read'].onExecuted = function() { 
    console.log('command 에서 onExecuted 호출');
};
// Execute
bm.command['read'].execute();

// Output results:
// Call onExecute from model
// Call onExecute from command
// Call onExecuted from command
// Call onExecuted in model
```

전역 이벤트와 명령별 이벤트를 설정하면 execute() 메서드가 실행될 때 다양한 작업을 순차적으로 처리할 수 있습니다. 이는 특정 작업이 실행될 때 필요한 초기화 작업이나 후속 작업을 정의하는 데 유용합니다.

## 명령별 흐름 제어하기

execute() 메서드를 실행할 때 순차적으로 콜백 함수가 호출되어 흐름을 제어할 수 있습니다. 

[[41. Callback Lifecycle-B|Refer to: Callback Lifecycle]

#### 콜백 함수의 호출 순서
1. cbBegin : URL 및 config 정보 설정
2. cbValid : 유효성 검사
3. cbBind : 서버 요청 전에 호출
4. 서버 요청 수행
5. cbResult : 서버 응답 후 호출
6. cbOutput : \_outputs 컬렉션으로 응답 처리
7. cbEnd : 모든 과정이 완료된 후 호출

### 1. 시작시 콜백

execute() 호출시 처음으로 호출되는 콜백입니다.

타입: cbBegin
```ts
type cbBegin = (cmd: BindCommand) => void;
```

일반적인 활용방안은
- url 및 config 의 정보 설정에 활용됩니다.

```js
var bm = new BindModel();
// Add Commands
bm.addCommand('list');
// Callback Settings
bm.command['list'].cbBegin = (command) => { 
    command.url = '/member/1'; 
};
```

### 2. 유효성 검사 콜백

execute() 실행 시 `valid(MetaView)`에 대한 유효성 검사 전에 호출되는 콜백입니다. 
리턴값이 false 이면 cbFail 콜백이 호출되고 실행이 종료됩니다.

타입: cbValid
```ts
type cbValid = (valid: MetaView, cmd: BindCommand) => boolean;
```

일반적인 활용방안은
- 서버 요청전 검사에 활용됩니다.
- 사용자에게 처리결과를 확인하는 용도로 활용됩니다.

```js
var bm = new BindModel();
// Add Commands
bm.addCommand('list');
// Callback Settings
bm.command['list'].cbValid = function(view) { 
	return view.colums.count <= 0 
};
bm.command['list'].cbValid = function() {
	return confirm ('Do you want to delete?')
};
```

### 3. 서버 요청 콜백

execute() 실행 시 `bind(MetaView)` 컬럼 값을 전송하기 전에 호출되는 콜백입니다.

타입 : cbBind
```ts
type cbBind = (view: MetaView, cmd: BindCommand, config: object) => void;
```

일반적인 활용방안은
- 전송타입의 설정에 활용됩니다. (enctype)
- 통합 로그인 관련 설정에 활용됩니다.
- 비밀번호 암호화에 활용됩니다.


### 4. 서버 응답 콜백

execute() 실행 시 서버에서 응답을 받은 후에 호출되는 콜백입니다.
타입 : cbResult
```ts
type cbResult = (data: object, cmd: BindCommand, res: object) => object;
```

일반적인 활용방안은
- 응답받은 data 를 `MetaView` 형식의 스키마로 커스텀 하는 용도활용됩니다.

```js
// data = { aa: 1, bb: 2 }
bm.command['list'].cbResult = function(data) {
	return = {
		rows: data
	};
};
```
- 리턴값 : `{ rows: {aa: 1, bb: 2 }} `

### 5. 출력 콜백

응답을 '\_outputs' 컬렉션으로 읽어들인 후에 호출되는 콜백입니다.

`BindCommand` 출력 옵션에 따라서 데이터를 '\_outputs' 컬렉션에 가져오는 방식이 달라집니다.
[24. Bind Command Configuration - B# Type of Output Option (output) | Reference: Type of Output Option]

타입: cbOutput
```ts
type cbOutput = (
	views: MetaViewColleciton, 
	cmd: BindCommand, 
	res: object
) => void;
```

일반적인 활용방안은
- 응답받은 `output(MetaView)`을 사용하여 화면(html) 바인딩에 활용됩니다.

```json
{
	"rows": [
		{ "u_name": "Neo", "gender", "M" },
		{ "u_name": "Jane", "gender", "W" },
	]
}
```

```js
bm.command['list'].cbOutput = function(views) {
	for(var i = 0; i < views[0].rows.count; i++) {
		var row = views['first'].rows[i];
		console.log(1, row['u_name'], row['gender']);
	}
};
// Output results:
// 0  Neo  M
// 1  Jane  W
```
- `views[0]` 은 `BindCommand` 의 'output' 과 동일합니다.

### 6. 종료시 콜백

execute() 실행시 마지막으로 호출되는 콜백입니다.

타입 : cbEnd
```ts
type cbEnd = (status: number, cmd: BindCommand, res: object) => void; 
```

일반적인 활용방안은
- 성공 메세지 전달에 활용합니다.
- 경로 리다이렉트에 활용합니다.
- 다른 명령의 *execute()* 체인 연결에 활용합니다.

```js
bm.command['list'].cbEnd = function(views) {
	alert('Normal processed')
}
```

각 콜백 함수는 특정 상황에서 명령의 동작을 조정하거나, 데이터를 전처리 및 후처리하는 데 사용됩니다. 이를 통해 BindCommand의 실행 흐름을 세부적으로 제어할 수 있습니다.

## 출력 옵션 설정하기

`BindCommand` 에 제공되는 `output(MetaView)`외에 추가 `MetaView` 를 지정할 수 있습니다.

타입: outputOption
```ts
type outputOption = { option: number, index: number }`; 
```
- 객체타입 초기값은 `outputOption = {option: 0, index: 0}` 입니다.
- 'option' 속성은 값에 따라 `output(MetaView)`에서 데이터를 불러오는 방식입니다.
- 'index' 속성은 컬럼의 값을 설정할 때 rows 인덱스 위치를 지정합니다. (option: 3일 경우 사용)
- 'outOpt' 는 'outputOption' 의 별칭입니다.

### 생성자를 통한 설정

객체를 생성할 때 outputOption 파라미터를 전달하여 설정할 수 있습니다.

```js
var bm = new BindModel();

var bc1 = new BindCommand(bm, 1);
var bc2 = new BindCommand(bm, { option: 1, index: 1 });
```
- 'bc1.outputOption' 값은 `{option:1, index: 0}` 입니다.
- 'bc2.outputOption' 값은 `{option:1, index: 1}` 입니다.


### addCommand() 에서 설정

`BindModel` 객체의 addCommand() 메소드를 통해 생성 시 파라미터로 'outputOption'을 전달할 수 있습니다.

```js
var bm = new BindModel();

bm.addCommand('read', 2);
bm.addCommand('view', { option: 2, index: 1 });
```
- `bm.command['read'].outputOption` 값은 `{option:2, index: 0}` 입니다.
- `bm.command['view'].outputOption` 값은 `{option:2, index: 1}` 입니다.

### 프로퍼티로 설정

`BindCommand` 객체의 'outputOption' 속성을 변경하여 설정할 수 있습니다.

```js
bm.command['read'].outputOption = 3;
bm.command['view'].outputOption = { option: 3, index: 1 };
```
- `bm.command['read'].outputOption` 값은 `{option:3, index: 0}` 입니다.
- `bm.command['view'].outputOption` 값은 `{option:3, index: 1}` 입니다.

## 유효성 검사 대상 설정하기 (valid)

유효성 검사하기 위해서는 `valid(MetaView)`을 구성해야 합니다.
먼저 검사 대상은 `valid.columns` 컬렉션에 추가하고 'required', 'constraints' 속성을 설정합니다.

타입 : constraints (HTMLColumn 속성)
```ts
type RegExpType = {reg: RegExp, msg: string, return: boolean = true};
type FuncType = (value: any)=>boolean;
type ContiditionType = RegExpType | FuncType;
type ConstrainstType = ContiditionType[] | ContiditionType;

const constraints: ConstrainstType[] | ConstrainstType;
```
- required : 필수 여부를 나타내며, true일 경우 'value' 값이 `공백, null`이면 실패합니다.
- constraints : value 값이 공백이나 null이 아니면 제약 조건을 검사합니다.
	• reg : 매칭되어야 할 정규식입니다.
	• msg : 매칭 여부에 따라 return이 false이면 실패 메시지입니다.
		• return이 true이면 매칭 실패 시 오류 메시지입니다.
		• return이 false이면 매칭 성공 시 오류 메시지입니다.
	• return : reg 매칭 시 리턴 결과입니다. 기본값은 true입니다.

#### 사용빈도별 제약조건

| **빈도** | **required** | **constraints** | **설명**                      |
| ------ | ------------ | --------------- | --------------------------- |
| 50%    |              |                 | 선택값입니다.                     |
| 30%    | true         |                 | 필수값입니다.                     |
| 15%    |              | {...}           | 선택값이며, value 값이 제약조건이 있습니다. |
| 5%     | true         | {...}           | 필수값이며, value 값에 제약조건이 있습니다. |

 (쇼핑몰 table: 20ea 기준)

```js
var bm = new BindModel();

bm.addCommand('test');

bm.cmd['test'].addColumn('user_name');
bm.cmd['test'].addColumn('passwd');
bm.cmd['test'].addColumn('user_id');
bm.cmd['test'].addColumn('email');

bm.columns['user_name'].required = true;
bm.columns['passwd'].required = true;
bm.columns['user_id'].required = true;

bm.columns['passwd'].constraints = {
	regex: /.{6}/, msg: "Please enter at least 6 characters."
};
bm.columns['user_id'].constraints = [
	(val)=>{ reutrn val.length > 8 }, 
	{regex: /\D{8}/, msg: "Please type in English", return: false}
];
bm.columns['email'].constraints = {
	regex: /.{6}/, msg: "Please enter at least 6 characters."
};

bm.cmd['test'].execute();
```
- user_name : 필수 조건입니다. 공백 입력 시 실패합니다. 'cbFail' 이 호출됩니다.
- passwd : 필수 조건이며, 정규식 조건에 매칭되어야 성공합니다.
- user_id : 필수 조건이며, 첫 번째 함수 조건에서 성공하고, 두 번째 정규식 조건에서는 비매칭되어야 성공합니다.
- email : 선택 조건입니다. 공백일 경우 성공하며, 값을 입력 시 정규식과 매칭되어야 성공합니다.

## 컬럼 추가하기

컬럼을 추가하면 기본 테이블인 '\_baseTable'에 컬럼이 추가되고, 바인드 명령에 지정한 `MetaView` 에 참조가 등록됩니다. 컬럼을 추가하는 메소드로는 addColumn() 과 addColumnValue() 가 있습니다.

타입 : addColumn(), addColumnValue()
```ts
type addColumn = (
	colName: string, 
	views?: string | string[], 
	bTable?: string | MetaTable
) => BindCommand;

type addColumnValue = (
	colName: string, 
	value: any, 
	views?: string | string[], 
	bTable?: string | MetaTable
) => BindCommand;
```
- views 파라메터에 '$all' 지시자를 사용하면, 모든 `MetaView(valid, bind, output)`에 추가됩니다.
- bTable 파라미터는 컬럼을 추가할 테이블을 지정하며, 기본값은 '\_baseTable'입니다.

### 컬럼 추가 및 매핑

기본 테이블에 컬럼을 추가하고, 지정한 `MetaView`에 참조를 등록합니다. addColumn() 메소드는 빈 컬럼을 추가하고, addColumnValue() 메소드는 컬럼 추가 후 'value' 값을 설정합니다.

```js
var bm = new BindModel();

bm.addCommand('test');

bm.command['test'].addColumn('aa', 'valid');
bm.command['test'].addColumn('bb', ['bind', 'output']);
bm.command['test'].addColumn('cc', '$all');
bm.command['test'].addColumn('dd');

// bm['first'].columns.count  == 4 ('aa', 'bb', 'cc', 'dd')

// bm.command['test'].valid.columns.count  == 3 ('aa', 'cc', 'dd')
// bm.command['test'].bind.columns.count   == 3 ('bb', 'cc', 'dd')
// bm.command['test'].output.columns.count == 3 ('bb', 'cc', 'dd')
```
- addColumn() 메소드를 호출하면 빈 컬럼이 추가됩니다.
- addColumnValue() 메소드를 호출하면 컬럼 추가 후 'value' 값이 설정합니다.
- 'aa' 컬럼은  지정한 `MetaView(valid)` 에 참조를 등록합니다.
- 'bb' 컬럼은  지정한 `MetaView(bind, output)` 에 참조를 등록합니다.
- 'cc' 컬럼은  전체 `MetaView(valid, bind, output)` 에 참조를 등록합니다.
- 'dd' 컬럼 추가시 파라메터를 생략하면 전체 `MetaView` 에 참조를 등록합니다.

### 확장 테이블에 컬럼 추가 및 매핑

지정한 `MetaTable` 에 컬럼을 추가하고 지정한 `MetaView` 에 참조를 등록합니다.

```js
var bm = new BindModel();

bm.addTable('second');
bm.addCommand('test');

bm.command['test'].addColumn('aa', 'valid', bm.second);
bm.command['test'].addColumn('bb', '$all', 'second');

// bm['first'].columns.count  == 0
// bm['second'].columns.count == 2 ('aa', 'bb')

// bm.command['test'].valid.columns.count  == 1 ('aa', 'bb')
// bm.command['test'].bind.columns.count   == 1 ('bb')
// bm.command['test'].output.columns.count == 1 ('bb')
```
- 'aa' 컬럼은` MetaTable(second)` 에 추가하고  지정한 `MetaView(valid)` 에 참조를 등록합니다.
- 'bb' 컬럼은 `MetaTable(second)` 에 추가하고  전체 `MetaView` 에참조를 등록합니다.

위의 메소드를 활용하여 다양한 방식으로 테이블과 컬럼을 추가하고, 각 컬럼을 적절한 `MetaView`에 매핑할 수 있습니다. 이는 데이터의 유효성 검사, 바인딩, 출력 등 다양한 요구사항을 효율적으로 처리하는 데 유용합니다.

## 기존 컬럼 설정하기

이미 등록된 컬럼을 `MetaView`에 참조로 등록하거나 해제할 수 있습니다. 이를 통해 데이터의 유효성 검사, 바인딩, 출력 등 다양한 요구사항에 맞춰 컬럼을 동적으로 관리할 수 있습니다.

#### 주요 기능 요약
-  컬럼 설정: 특정 테이블의 컬럼을 원하는 MetaView에 설정하여 데이터 유효성 검사, 바인딩, 출력 등의 처리를 할 수 있습니다.
- 컬럼 해제 : 설정된 컬럼을 원하는 MetaView에서 해제하여 동적으로 컬럼 참조를 관리할 수 있습니다.

타입 : setColumn(), release()
```ts
type TableNameType : string;
type ColumnType : string;
type FullColumnType : TableNameType + '.'+ ColumnType;
type ColumnDotType : FullColumnType | ColumnType;
type ViewType : 'valid' | 'bind' | 'output' | '$all' | string;

type setColumn = (
	colName: ColumnDotType, 
	views: ViewType | ViewType[], 
	bTable?: string | MetaTable
) => void;

type release = (
	colName: string, 
	views?: ViewType | ViewType[]
) => void;
```
### 컬럼 설정 및 해제

컬럼을 설정할 때는 `테이블명 + . + 컬럼명` 표기법을 사용하여 특정 테이블의 컬럼을 지정할 수 있습니다.

```js
var bm = new BindModel();
bm.addTable('second');

// Add a column to the default table, first
bm.addColumn('aa');
bm.addColumn('bb');

// Adding a column to the extension table, second
bm['second'].columns.add('cc');
bm['second'].columns.add('dd');

bm.addCommand('test');

// Column Settings
bm.command['test'].setColumn('aa', 'valid');
bm.command['test'].setColumn(['bb', 'second.cc'], 'bind');
bm.command['test'].setColumn('second.dd', '$all');

// Number of columns in the base table
// bm.first.columns.count == 2 ('aa', 'bb')
// Number of columns in the extension table
// bm.second.columns.count == 2 ('cc', 'dd')
// Number of columns in MetaView
// bm.command['test'].valid.columns.count == 2 ('aa', 'dd')
// bm.command['test'].bind.columns.count == 2 ('bb', 'dd')
// bm.command['test'].output.columns.count == 2 ('cc', 'dd')

// Release the column
bm.command['test'].release('aa', 'valid');
bm.command['test'].release(['bb', 'cc'], 'bind');
bm.command['test'].release('dd', '$all');

// Number of columns in MetaView
// bm.command['test'].valid.columns.count == 0
// bm.command['test'].bind.columns.count == 0
// bm.command['test'].output.columns.count == 0
```
- 'aa' 컬럼을 추가하고 지정한 `MetaView(valid)` 에 참조를 등록합니다.
- 'bb' 컬럼을 추가하고 지정한 `MetaView(bind)` 에 참조를 등록합니다.
- 'cc' 컬럼을 `MetaTable(second)` 추가하고 지정한 `MetaView(bind)`에 참조를 등록합니다.
- 'dd' 컬럼을 `MetaTable(second)` 추가하고 전체 `MetaView`에 참조를 등록합니다.

위의 메소드를 사용하면 기존 컬럼을 동적으로 MetaView에 설정하거나 해제할 수 있어, 복잡한 데이터 처리 요구사항에 유연하게 대응할 수 있습니다.

## 출력옵션의 종류 (output)

응답 데이터가 복수 레코드일 경우, '\_outputs' 컬렉션의 순서대로 데이터를 가져옵니다. 복수의 레코드를 가져오려면 레코드 개수만큼 '\_outputs' 컬렉션을 추가해야 합니다. 
'\_outputs '컬렉션의 개수보다 많은 레코드는 제외됩니다. (option > 0)

| 옵션          | 설명                                                              |
| ----------- | --------------------------------------------------------------- |
| 0 (default) | output bind 안함                                                  |
| 1           | 모든 column 의 row 를 가져옵니다.                                        |
| 2           | 존재하는 column 의 row 를 가져옵니다.                                      |
| 3           | 존재하는 column 의 row 를 가져오고, index 위치의 row 를 column value 에 설정합니다. |

### 출력 무시하기 : option = 0

`output(MetaView)`에 데이터를 가져오지 않습니다. 주로 create, update, delete와 같은 데이터 수정 작업에 사용되며, 응답 데이터가 필요 없는 경우에 적합합니다. 
이 옵션은 주로 데이터 변경 작업을 수행할 때 사용되며, 데이터 반환을 최소화하여 효율성을 높입니다.


```js
var bm = new BindModel();
// Add 'create' command and set output option to 0 to not get data
bm.addCommand('create', 0);
// Set a value in column 'aa'
bm.cmd['create'].addColumnValue('aa', -10);
// Execute a command
bm.cmd['create'].execute();

// bm.columns.count == 1
// bm.columns['aa'].value == -10
// bm.cmd['create'].output.rows.count == 0
```

### 모든 데이터 가져오기 : option = 1 

옵션 값 1은 모든 응답 데이터를 `output(MetaView)`에 불러오는 방식입니다. 이 옵션은 서버로부터 수신한 전체 데이터의 컬럼을 단순하게 출력하거나, 데이터 구조를 확인할 때 유용합니다. 

```js
{
	"rows": [
		{ "aa": 10, "bb", 20, "cc": 30 },
		{ "aa": 11, "bb", 21, "cc": 31 },
	]
}
```

```js
var bm = new BindModel();

// Add 'list' command and set output option to 1 to get all data
bm.addCommand('list', 1);

bm.cmd['list'].execute();

// bm.columns.count == 3
// bm.cmd['list'].output.rows.count == 2
// bm.cmd['list'].output.rows[0]['aa'] == 10
// bm.cmd['list'].output.rows[0]['bb'] == 20
// bm.cmd['list'].output.rows[0]['cc'] == 30
// bm.cmd['list'].output.rows[1]['aa'] == 11
// bm.cmd['list'].output.rows[2]['bb'] == 21
// bm.cmd['list'].output.rows[3]['cc'] == 31
```
- 컬럼이 미리 정의되지 않더라도 응답 데이터에 기반하여 동적으로 생성됩니다.

이 옵션은 서버로부터 수신한 데이터의 전체 구조를 확인하거나, 디스플레이 및 후속 처리 작업을 위한 기본 데이터 로딩에 유용합니다.

### 지정한 컬럼의 데이터만 가져오기 : option = 2 

응답 데이터에서 `ouput(MetaView)` 에 존재하는 컬럼만 불러옵니다.

```js
{
	"rows": [
		{ "aa": 10, "bb", 20, "cc": 30 },
		{ "aa": 11, "bb", 21, "cc": 31 },
	]
}
```

```js
var bm = new BindModel();
bm.addCommand('list', 2);
bm.cmd['list'].addColumnValue('aa', 0);
bm.cmd['list'].addColumnValue('bb', 0);
bm.cmd['list'].execute();

// bm.columns.count == 2
// bm.cmd['list'].output.rows.count == 2
// bm.cmd['list'].output.rows[0]['aa'] == 10
// bm.cmd['list'].output.rows[0]['bb'] == 20
// bm.cmd['list'].output.rows[1]['aa'] == 11
// bm.cmd['list'].output.rows[2]['bb'] == 21
```

### 데이터를 컬럼값에 설정하기 (지정한 컬럼) : option = 3

응답 데이터에서 `ouput(MetaView)` 에 존재하는 컬럼만 불러오고, 지정한 데이터를 컬럼 'value' 값으로 설정합니다.

```json
{
	"rows": { "aa": 10, "bb", 20, "cc": 30 },
}
```

```js
var bm = new BindModel();
bm.addCommand('read', 3);
bm.cmd['read'].addColumnValue('aa', 0);
bm.cmd['read'].addColumnValue('bb', 0);
bm.cmd['read'].execute();

// bm.columns.count == 2
// bm.columns['aa'].value == 10
// bm.columns['bb'].value == 20
```

#### 단일 인덱스 지정 (option : 3)

응답 데이터의 특정 '행' 값을 '값' 열로 설정합니다.

```json
{
	"rows": [
		{ "aa": 10, "bb", 20, "cc": 30 },
		{ "aa": 11, "bb", 21, "cc": 31 },
	]
}
```

```js
var bm = new BindModel();
bm.addCommand('test', 3);
bc.outputOption.index = 1;   // index set
bm.cmd['test'].addColumnValue('aa', 0);
bm.cmd['test'].addColumnValue('bb', 0);
bm.cmd['test'].execute();

// bm.columns.count == 2
// bm.columns['aa'].value == 11
// bm.columns['bb'].value == 21
```
- 2번째(index = 1) 'rows' 의 값이 'value' 값으로 설정되었습니다.

#### 복합 인덱스 지정 (option : 3)

복수의 응답 데이터의 특정 'rows' 값을 컬럼 'value' 값으로 설정합니다.

```json
[
	{
		"rows": [
			{ "aa": 10, "bb", 20, "cc": 30 },
			{ "aa": 11, "bb", 21, "cc": 31 },
		]
	},
	{
		"rows": [
			{ "dd": 40, "ee", 50 },
			{ "dd": 41, "ee", 51 },
			{ "dd": 42, "ee", 52 },
		]
	},
]
```

```js
var bm = new BindModel();
bm.addCommand('test', 3);
bc.outputOption.index = [0, 1];   // index set
bm.cmd['test'].newOutput('two');
bm.cmd['test'].addColumnValue('aa', 0);
bm.cmd['test'].addColumnValue('bb', 0);
bm.cmd['test'].addColumnValue('dd', 0);
bm.cmd['test'].execute();

// bm.columns.count == 3
// bm.columns['aa'].value == 10
// bm.columns['bb'].value == 20
// bm.columns['dd'].value == 41
// bm.cmd['test'].output.rows.count == 2
// bm.cmd['test'].two.rows.count == 3
```
- 첫번째 응답 레코드의 index = 0 의 값이 컬럼 ('aa', 'bb') 값으로 설정되었습니다.
- 두번째 응답 레코드의 index = 1 의 값이 컬럼('dd') 값으로 설정되었습니다. 
