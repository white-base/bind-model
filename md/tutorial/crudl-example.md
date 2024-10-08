---
lang: ko
title: "CRUD + L 예제"
layout: single
permalink: /ko/docs/crudl-example/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

CRUDL은 전통적인 데이터 처리 기능인 Create, Read, Update, Delete에 List를 추가한 개념입니다. 이는 데이터베이스와 상호작용을 단순화하고 효율적으로 관리하는 데 유용합니다. BindModel은 데이터베이스와의 상호작용을 위한 유용한 도구로, CRUDL 관점의 설계를 지향합니다.

## 등록 (Create)

Create는 데이터베이스에 새로운 레코드를 삽입하는 작업을 의미하며, REST API에서는 POST 요청에 해당합니다.


```js
var bm = new BindModel();
// url 설정 및 command 생성
bm.url = '/user'
bm.addCommand('create');
// 컬럼 추가
bm.addColumn('user_name', 'create', ['valid', 'bind']);
bm.addColumn('tel', 'create', 'bind');
// 실행
bm.command['create'].execute();
```
- `bm.command['create'].valid.columns` : 유효성 검사 대상의 컬럼들
	- "user_name" 컬럼의 유효성 검사를 합니다.
- `bm.command['create'].bind.columns`  : HTTP 전송 대상의 컬럼들
	- "user_name, tel" 컬럼값은 `/user` 로 전송합니다.
- POST 요청을 전송할 경우, `bm.baseConfig.method = 'post'`를 설정합니다.

## 읽기 (Read)

Read는 데이터베이스에서 특정 레코드를 조회하는 작업을 의미하며, REST API에서는 GET 요청에 해당합니다.

```js
var bm = new BindModel();
// Create command
bm.addCommand('read', 3);
// Add Column
bm.addColumn('idx','read', ['valid', 'bind']);
bm.addColumn('tel','read', 'output');
// Setting and executing commands
bm.command['read'].url = '/user/1'
bm.command['read'].execute();
```
- `bm.command['read'].valid.columns` : 유효성 검사 대상의 컬럼들
	- "idx" 컬럼의 유효성 검사를 합니다.
- `bm.command['read'].bind.columns`  : HTTP 전송 대상의 컬럼들
	- "idx" 컬럼값은 `/user` 로 전송합니다.
- `bm.command['read'].output.columns`  : HTTP 응답에서 받아올 컬럼들
	- "tel" 컬럼값은 `/user` 로 전송합니다.
- RESTful 요청의 URL 수정은 cbBegin 콜백에서 설정할 수 있습니다.

## 수정 (Update)
Update는 데이터베이스의 기존 레코드를 수정하는 작업을 의미하며, REST API에서는 PUT 또는 PATCH 요청에 해당합니다.

```js
var bm = new BindModel();
// url 설정 및 command 생성
bm.url = '/user'
bm.addCommand('update');
// Add Column
bm.addColumn ('idx', 'update', ['valid', 'bind']); // Check Required Values
bm.addColumn('tel', 'update', 'bind');
// Execute
bm.command['update'].execute();
```
- `bm.command['update'].valid.columns` : 유효성 검사 대상의 컬럼들
	- "idx" 컬럼의 유효성 검사를 합니다.
- `bm.command['update'].bind.columns`  : HTTP 전송 대상의 컬럼들
	- "idx, tel" 컬럼값은 `/user` 로 전송합니다.
- PATCH 요청을 전송할 경우, `bm.baseConfig.method = 'patch'`를 설정합니다.

## 삭제 (Delete)

Delete는 데이터베이스의 특정 레코드를 삭제하는 작업을 의미하며, REST API에서는 DELETE 요청에 해당합니다.

```js
var bm = new BindModel();
// url 설정 및 command 생성
bm.url = '/user';
bm.addCommand('delete');
// Add Column
bm.addColumn ('idx', 'delete', ['valid', 'bind']); // Required value check
// Execute
bm.command['update'].execute();
```
- `bm.command['update'].valid.columns` : 유효성 검사 대상의 컬럼들
	- "idx" 컬럼의 유효성 검사를 합니다.
- `bm.command['update'].bind.columns`  : HTTP 전송 대상의 컬럼들
	- "idx" 컬럼값은 `/user` 로 전송합니다.
- DELETE 요청을 전송할 경우, `bm.baseConfig.method = 'delete'`를 설정합니다.

## 조회 (List)

List는 데이터베이스에서 여러 레코드를 조회하는 작업을 의미하며, REST API에서는 GET 또는 POST 요청에 해당합니다.

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
// url 설정 및 command 생성
bm.url = '/user/list'
bm.addCommand('list', 2);
// 컬럼 추가
bm.addColumn('user_name', 'list', 'output');
bm.addColumn('gender', 'list', 'output');
// 출력 콜백 설정
bm.command['list'].cbOutput = function(views){
	for(var i = 0; i < views[0].rows.count; i++) {
		var row = views['first'].rows[i];
		console.log(i, row['user_name'], row['gender']);
		// 0 Hong Gil-dong M
		// 1. Sung Chunhyang W
	}
}
// Execute
bm.command['list'].execute();
```
- `bm.command['update'].valid.columns` : 유효성 검사 대상의 컬럼들
	- "idx" 컬럼의 유효성 검사를 합니다.
- `bm.command['update'].bind.columns`  : HTTP 전송 대상의 컬럼들
	- "idx" 컬럼값은 `/user` 로 전송합니다.
- cbOutput 콜백에서 화면 출력 관련 작업을 작성합니다.


이와 같이 CRUDL은 전통적인 CRUD 기능에 조회(List)를 추가하여 보다 유연하고 강력한 데이터 조작 기능을 제공합니다. BindModel을 사용하면 이러한 CRUDL 작업을 간편하게 수행할 수 있습니다.

## 등록 / 읽기 / 수정 / 삭제 / 조회 예제

다음은 Create, Read, Update, Delete, List 전체 예제를 포함한 예제입니다.

서버 데이터
```json
{
	"rows": [
		{ "u_name": "Neo", "gender", "M" },
		{ "u_name": "Seri", "gender", "W" },
	]
}
```
컬럼을 command 에서 공유되어서 컬럼을 등록 후 설정하는 방식을 선택했습니다.

예제 : 메소드 호출 방식
```js
var bm = new BindModel();

// setting url
bm.url = '/user'

// command registration
bm.addCommand('create');
bm.addCommand('read', 3);
bm.addCommand('update');
bm.addCommand('delete');
bm.addCommand('list', 2);

// Register a column
bm.addColumn('user_name');
bm.addColumn('tel');
bm.addColumn('idx');
bm.addColumn('gender');

// create command setting
bm.command['create'].seColumn('user_name', ['valid', 'bind']);
bm.command['create'].seColumn('tel', 'bind');

// read command setting
bm.command['read'].seColumn('idx', ['valid', 'bind']);
bm.command['read'].seColumn('tel', 'output');
bm.command['read'].url = '/user/1';

// update command setting
bm.command['update'].seColumn('idx', ['valid', 'bind']);
bm.command['update'].seColumn('tel', 'bind');

// delete command setting
bm.command['delete'].seColumn('idx', ['valid', 'bind']);

// list command setting
bm.command['list'].seColumn('user_name', 'output');
bm.command['list'].seColumn('gender', 'output');

bm.command['list'].url = '/user/list';
bm.command['list'].cbOutput = function(views){
	for(var i = 0; i < views[0].rows.count; i++) {
		var row = views['first'].rows[i];
		console.log(i, row['user_name'], row['gender']);
		// 0 Hong Gil-dong M
		// 1. Sung Chunhyang W
	}
};

// Execute
bm.command['create'].execute();
bm.command['read'].execute();
bm.command['update'].execute();
bm.command['delete'].execute();
bm.command['list'].execute();
```

예제 : 서비스객체 주입 방식
```js
var bm = new BindModel({
	url: '/user',
	items: {
		user_name: '',
		tel: '',
		idx: '',
		gender: '',
	},
	command: {
		create: {},
		read: {
			outputOption: 3,
			url: '/user/1'
		},
		update: {},
		delete: {},
		list: {
			outputOption: 2,
			url: '/user/list',
			cbOutput = function(views){
				for(var i = 0; i < views[0].rows.count; i++) {
					var row = views['first'].rows[i];
					console.log(i, row['user_name'], row['gender']);
					// 0 Hong Gil-dong M
					// 1. Sung Chunhyang W
				}
			}
		},
	},
	mapping: {
		user_name: { 
			create: ['valid', 'bind'], 
			list: 'output' 
		},
		tel: { 
			create: 'bind', 
			read: 'bind', 
			update: 'bind'
		},
		idx: { 
			read: ['valid', 'bind'], 
			update: ['valid', 'bind'], 
			delete: ['valid', 'bind'] },
		},
		gender: { 
			list: 'output' 
		}
	}
});

// Execute
bm.command['create'].execute();
bm.command['read'].execute();
bm.command['update'].execute();
bm.command['delete'].execute();
bm.command['list'].execute();
```

이 두 가지 예제는 CRUDL 작업을 효율적으로 수행하기 위한 방법을 보여줍니다. 메소드 호출 방식과 서비스 객체 주입 방식을 사용하여 각 명령어를 설정하고 실행하는 방법을 설명하고 있습니다.
