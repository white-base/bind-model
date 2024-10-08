---
lang: ko
title: "객체 생성 방식"
layout: single
permalink: /ko/docs/create-method/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

`BindModel`는 사용자의 다양한 요구에 맞게 여러 가지 생성 방식을 제공합니다. 각 방식의 장단점을 이해하고 필요에 따라 적절한 방법을 선택하여 사용할 수 있습니다.

### 1. 서비스 객체를 통한 생성

서비스 객체를 별도로 분리하여 관리할 수 있어 생산성을 향상시킵니다. 객체 생성 시 필요한 항목과 명령을 한 번에 정의합니다.

```js
var bm = new BindModel({
	items: {
		aa: 10,
		bb: 20,
		cc: 30,
		dd: 40
	},
	command: {
		create: {},
		read: {
			outputOption: 3
		}
	},
	mapping: {
		aa: { create: 'valid'},
		bb: { read: ['bind', 'output']},
		cc: { $all: 'output'}
	}
});

// Check it out
// bm.command['create'].valid.columns.count   == 1 ('aa')
// bm.command['create'].bind.columns.count    == 0
//  bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 2 ('bb','cc')
// bm.columns.count  // 3 ('aa','bb','cc')
```

### 2. items 에 추가 후 매핑 

공통으로 관리되는 item을 지정하고, 여러 명령에 컬럼이 사용될 경우 유용합니다.

```js
var bm = new BindModel();

// command 추가
bm.addCommand('create');
bm.addCommand('read', 3);

// 아이템 추가
bm.items.add('aa', 10);
bm.items.add('bb', 20);
bm.items.add('cc', 30);
bm.items.add('dd', 40);

// 매핑
bm.setMapping({
	aa: { create: 'valid' },
	bb: { read: 'bind' },
	cc: { $all: ['output'] }   // $all = all command
});

// Check it out
// bm.command['create'].valid.columns.count  == 1 ('aa')
// bm.command['create'].bind.columns.count   == 0
// bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 1 ('cc')

// bm.columns.count  == 3 ('aa','bb')

// bm.columns['aa'].value; == 10
// bm.columns['bb'].value; == 20
// bm.columns['cc'].value; == 30
```

### 3. 컬럼 추가 시 명령 설정

컬럼 생성 시점에 command를 지정하는 방식입니다. 점진적으로 기능을 확장할 때 효과적입니다.

```js
var bm = new BindModel();

// command 추가
bm.addCommand('create');
bm.addCommand('read', 3);

// 컬럼 추가 및 명령 설정
bm.addColumn('aa', 'create', 'valid');
bm.addColumn('bb', 'read', 'bind');
bm.addColumn('cc', '$all', 'output');   

// Check it out
// bm.command['create'].valid.columns.count  == 1 ('aa')
// bm.command['create'].bind.columns.count   == 0
// bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 1 ('cc')

// bm.columns.count  // 3 'aa','bb'
```

### 4. 컬럼 추가 후 명령에 설정

관리해야 할 컬럼을 사전에 생성하여, 필요한 command에서 설정해서 사용하는 방식입니다. 테이블을 별도로 관리하거나 공통 컬럼을 사전에 생성하므로 코드 중복을 줄일 수 있습니다.

```js
var bm = new BindModel();

// Add command
bm.addCommand('create');
bm.addCommand('read', 3);

// Add a column to the default columns
bm.columns.addValue('aa', 10);
bm.columns.addValue('bb', 20);
bm.columns.addValue('cc', 30);

// Set to Command
bm.command['create'].setColumn('aa', 'valid');
bm.command['create'].setColumn('cc', 'output');
bm.command['read'].setColumn('bb', ['bind']);
bm.command['read'].setColumn('cc', ['output']);

// Check it out
// bm.command['create'].valid.columns.count  == 1 ('aa')
// bm.command['create'].bind.columns.count   == 0
// bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 1 ('cc')

// bm.columns.count  // 3 ('aa','bb')
```

### 5. 명령별 컬럼 등록

각각의 command별로 컬럼을 생성하는 방식이며, command 별로 독립된 컬럼으로 관리할 경우 유용합니다.

```js
var bm = new BindModel();
bm.addCommand('create');
bm.addCommand('read');
bm.command['create'].addColumn('aa', 'valid');
bm.command['read'].addColumn('bb', ['bind', 'output']);

// Check it out
// bm.command['create'].valid.count  == 1 ('aa')
// bm.command['create'].bind.count   == 0
// bm.command['create'].output.count == 0

// bm.command['read'].valid.count    == 0
// bm.command['read'].bind.count     == 1 ('bb')
// bm.command['read'].output.count   == 1 ('bb')

// bm.columns.count  == 2 ('aa','bb')
```

이렇게 다양한 객체 생성 방식을 통해 BindModel를 유연하게 활용할 수 있으며, 각 방식의 장단점을 고려하여 적절한 방법을 선택하는 것이 중요합니다.
