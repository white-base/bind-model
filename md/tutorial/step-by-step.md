---
lang: ko
title: "단계별 제작 과정"
layout: single
permalink: /ko/docs/step-by-step/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

BindModel 를 활용하여 고객 정보 등록, 조회, 수정 기능을 처리하는 HTML 제작 과정입니다.

## 고객정보 등록 하기

여러 command에서 컬럼을 공유해서 사용하는 화면이므로 서비스 객체 주입 방식을 사용하여 제작했습니다.

### 1. 회원 등록 HTML  제작
```html
<div>
	name <input type="text" id="user_name"/>
</div>
<div>
	man<input type="radio" name="gender" value="male" />
	woman<input type="radio" name="gender" value="female" />	
</div>
<div>
	tel <input type="text" id="tel"/>
</div>

<button type="button" id="btn_create">등록</button>
```
- 이 HTML은 사용자 이름, 성별, 연락처를 입력할 수 있는 입력 필드와 등록 버튼을 포함합니다.

### 2. 아이템 및 명령 설정
```js
var bm = new BindModel({
	items: {
		user_name: {
			selector: { key: '#user_name', type: 'value' },
			required: true
		},
		gender: {
			setFilter: function(val) { 
				$('input[name=gender][value='+ val + ']').prop('checked',true);
			},
			getFilter: function() { 
				return $('input[name=gender]:checked').val() 
			}
		},
		tel: {
			selector: { key: '#tel', type: 'value' },
			constraints: [
				{ regex: /\d{3}-\d{3,4}-\d{4}/, msg: "Not in phone number format."}
			]
		}
	},
	command: {
		create: {
			cbEnd: function() {
				alert( 'Registration processed successfully');
			}
		}
	},
	mapping: {
		user_name: { create: ['valid', 'bind'] },
		gender:    { create: ['bind'] },
		tel:       { create: ['bind', 'bind'] }
	}
});
bm.url = '/user';
```
- items는 입력 필드와 그 특성을 정의합니다.
	- user_name :  ID 가 'user_name' 인 요소와 바인딩되며 필수 항목입니다.
	- gender : 라디오 버튼을 설정 및 가져오는 필터를 사용합니다.
	- tel: ID 가 'tel' 인 요소와 바인딩되며 전화번호 형식을 검사하는 유효성 검사를 포함합니다.
- command는 서버와의 상호작용을 정의합니다.
	- create: 등록 관련 command 이며, 완료 시 알림을 표시하는 콜백 함수를 포함합니다.
- mapping은 아이템과  명령 간의 매핑을 정의합니다.
	- user_name, gender, tel 필드가 create 명령에 어떻게 매핑되는지 설정합니다.

### 3. 이벤트 등록

```js
$('#btn_create').click(() => bm.command['create'].execute());
```
- 등록 버튼이 클릭되면 create 명령을 실행합니다.

## 고객정보 조회 하기

서버 데이터 예시
```json
// Restful :/user/1
{
	"rows": [
		{
			"user_name": "Hong Gildong",
			"gender": "male",
			"tel": "010-123-1234"
		}
	]
}
```
- 서버에서 조회할 때 받을 JSON 형식의 데이터입니다.
### 1. html 추가

```html
<input type="hidden" id="idx"/>
```
- 조회할 고객의 ID를 저장하기 위한 숨김 필드를 추가합니다.

### 2. items, command, mapping 추가
```js
var bm = new BindModel({
	items: {
		idx: {
			selector: { key: '#idx', type: 'value' },
		}
	},
	command: {
		read: {
			outputOption: 3
		}
	},
	mapping: {
		idx:       { read: ['valid', 'bind'] },
		user_name: { read: ['output'] },
		gender:    { read: ['output'] },
		tel:       { read: ['output'] }
	}
});
```
-  items에 idx 아이템을 추가하여 고객 ID를 저장합니다.
- command에 read 명령을 추가하여 조회 기능을 정의합니다.
- mapping에서 idx, user_name, gender, tel 아이템을 read 명령에 매핑합니다.

### 3. url 에서 idx 가져와서 읽기

```js


$(document).ready(function () {
	var idx = window.location.href.split('=')[1];
	if (idx) {
		$("#idx").val(idx);  // input hidden 설정
		bm.command['read'].execute();
	}
});
```
- 페이지가 로드될 때 URL에서 idx 값을 가져와 idx 컬럼에 설정하고, read 명령을 실행하여 데이터를 조회합니다.

## 고객정보 수정 하기

### 1. 수정 버튼 추가

```html
<button type="button" id="btn_update">수정</button>
```
- 수정 버튼을 추가합니다.

### 2. command 및 mapping 추가
```js
var bm = new BindModel({
	command: {
		update: {
			cbEnd: function() {
				alert('Corrected processed');
			}
		}
	},
	mapping: {
		user_name: { update: ['valid', 'bind'] },
		gender:    { update: ['bind'] },
		tel:       { update: ['bind', 'bind'] }
	}
});
```
-  command에 update 명령을 추가하여 수정 기능을 정의합니다.
-  mapping에서 user_name, gender, tel 컬럼을 update 명령과 매핑합니다.

### 3. 이벤트 등록
```js
$('#btn_update').click(() => bm.command['update'].execute());
```
- 수정 버튼이 클릭되면 update 명령을 실행합니다.


## 전체 소스 (조회, 등록, 수정)

### 1. body  영역
```html
<input type="hidden" id="idx"/>
<div>
	name <input type="text" id="user_name"/>
</div>
<div>
	man<input type="radio" name="gender" value="male" />
	woman<input type="radio" name="gender" value="female" />	
</div>
<div>
	tel <input type="text" id="tel"/>
</div>

<button type="button" id="btn_create">create</button>
<button type="button" id="btn_update">update</button>
```

### 2. script 영역

```html
<script>
var bm = new BindModel({
	items: {
		idx: {
			selector: { key: '#idx', type: 'value' },
		},
		user_name: {
			selector: { key: '#user_name', type: 'value' },
			required: true
		},
		gender: {
			setFilter: function(val) { 
				$('input[name=gender][value='+ val + ']').prop('checked',true);
			},
			getFilter: function() { 
				return $('input[name=gender]:checked').val() 
			}
		},
		tel: {
			selector: { key: '#tel', type: 'value' },
			constraints: [
				{ regex: /\d{3}-\d{3,4}-\d{4}/, msg: "Not in phone number format."}
			]
		}
	},
	command: {
		create: {
			cbEnd: function() {
				alert( 'Registration processed successfully');
			}
		},
		read: {
			outputOption: 3
		},
		update: {
			cbEnd: function() {
				alert('Corrected processed');
			}
		}
	},
	mapping: {
		idx:       {
			read: ['valid', 'bind'] 
		},
		user_name: { 
			create: ['valid', 'bind'],
			update: ['valid', 'bind'],
			read:   ['output'] 
		},
		gender: { 
			create: ['bind'],
			update: ['bind'],
			read:   ['output']
		},
		tel: { 
			create: ['valid', 'bind'],
			update: ['valid', 'bind'],
			read:   ['output']
		}
	}
});
bm.url = '/user';

$(document).ready(function () {
	var idx = window.location.href.split('=')[1];  // page?idx=764998
	// Register for an event
	$('#btn_create').click(() => bm.command['create'].execute());
	$('#btn_update').click(() => bm.command['update'].execute());
	if (idx) {
		$("#idx").val(idx);  // input hidden setting
		bm.command['read'].execute();
	}
	
	// bm.columns.user_name.value == 'Neo'
	// bm.columns.gender.value == 'male'
	// bm.columns.tel.value == '010-123-1234'
});
</script>
```

이 코드는 BindModel 를 활용하여 간단하고 직관적으로 입력 필드와 명령 간의 바인딩 및 서버와의 상호작용을 설정하는 예시입니다. 고객 정보를 등록, 조회, 수정하는 기능을 구현하는 데 필요한 모든 요소를 포함하고 있으며, 사용자의 입력과 서버 간의 데이터 교환을 효율적으로 처리합니다.
