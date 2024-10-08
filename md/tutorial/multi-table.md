---
lang: ko
title: "멀티 테이블 관리"
layout: single
permalink: /ko/docs/multi-table/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

BindModel 객체는 기본적으로 ‘first’라는 이름의 MetaTable을 자동 생성하여 사용합니다. 필요에 따라 다른 MetaTable을 추가할 수 있으며, 이는 컬럼명이 같지만 속성이 다르거나 특별한 경우에 유용합니다.


## MetaTable 추가

### addTable() 메소드로 추가

addTable() 메소드를 통해 \_tables 컬렉션에 MetaTable을 추가할 수 있습니다. 이 메소드를 사용하면, BindModel 객체에서 테이블에 접근하기 위한 참조 키를 자동으로 만듭니다.

```js
var bm = new BindModel();

bm.addTable('second');

// bm._tables[0] === bm._tables['first'] == bm.first
// bm._tables[1] === bm._tables['second'] == bm.second
// bm._tables.count == 2
```
- bm.second 로 추가한 테이블의 접근할 수 있습니다.

### \_tables 컬렉션으로 추가

\_tables.add() 메소드를 통해 MetaTable을 추가할 수 있습니다. 이 방법도 유사하게 \_tables 컬렉션에 테이블을 추가하지만, addTable()과는 달리 테이블명 참조 키를 자동으로 생성하지 않습니다.

```js
var bm = new BindModel();

bm._tables.add('second');

// bm._tables[1] === bm._tables['second']
// bm._tables.count == 2
```
## 기본 테이블 변경

추가한 MetaTable을 기본 테이블로 설정하면, 이후에 addColumn() 또는 addCommand()를 사용할 때 기본 테이블이 변경된 테이블로 설정됩니다.

```js
var bm = new BindModel();

bm._tables.add('second');

// 기본테이블 설정
bm._baseTable = bm['second'];  

// 컬럼 추가
bm.addColumnValue('aa', 10);

// bm.columns['aa'].value == 10
// bm._tables['first'].columns.count == 0
// bm._tables['second'].columns.count == 1
```
- `columns` 속성은 `_baseTable`의 columns 을 참조합니다. (columns === \_tabeTable.columns)

이와 같이 BindModel 객체에서 MetaTable을 추가하고 활용할 수 있습니다.

# 여러 메소드에서 추가한 테이블 지정

여러 메소드에서 추가한 테이블을 지정할 수 있습니다. \_tables 컬렉션 외부에 테이블을 지정할 경우, 객체 직렬화 기능을 사용할 수 없습니다.

## BindModel 영역

### addCommand() : 명령 추가 (BindModel)

command 추가시 테이블을 지정할 수 있습니다.

```js
var bm = new BindModel();

bm.addTable('second');

bm.addCommand('read', 3, 'second');
bm.addCommand('list', 3, bm.second);

// bm.command['read']._baseTable == bm.second
// bm.command['list']._baseTable == bm.second
```
- read 명령의 기본 테이블은 'second'로 지정됩니다.
- list 명령의 기본 테이블은 'second'로 지정됩니다.

### addColumn() : 컬럼 추가 (BindModel)

컬럼 추가 시 테이블을 지정할 수 있습니다.

```js
var bm = new BindModel();

bm.addTable('second');
bm.addCommand('read');

bm.addColumn('aa', 'read', 'valid', 'second');
bm.addColumn('bb', 'read', '$all', bm.second);
```
- 'aa' 컬럼은 'second' 테이블에 등록되고 read 명령의 valid 에 참조가 등록됩니다.
- 'bb' 컬럼은 'second' 테이블에 등록되고 read 명령의 전체 MetaView 에 참조가 등록됩니다.

### addColumnValue() : 컬럼 추가 (초기값 설정)

column 추가 시 초기값을 지정하고 테이블을 설정할 수 있습니다.

```js
var bm = new BindModel();

bm.addTable('second');
bm.addCommand('read');

bm.addColumn('aa', 'AA', 'read', 'valid', 'second');
bm.addColumn('bb', 'BB', 'read', '$all', bm.second);
```
- ‘aa’ 컬럼의 초기값은 ‘AA’로 ‘second’ 테이블에 등록되고 read 명령의 valid에 참조가 등록됩니다.
- ‘bb’ 컬럼의 초기값은 ‘BB’로 ‘second’ 테이블에 등록되고 read 명령의 전체 MetaView에 참조가 등록됩니다.

### setMapping() : 컬럼 매핑

매핑 시 기본 테이블을 지정할 수 있습니다

```js
var bm = new BindModel();
bm.addTable('second');
bm.addCommand('read');

bm.items.add('aa', '');
bm.items.add('bb', '');

bm.setMapping({
	aa: { read: ['valid'] },
	bb: { read: ['bind'] },
}, 'second');

// bm.second.columns.count == 2
// bm.first.columns.count == 0
```
- 아이템들은 ‘second’ 테이블에 등록되고, read 명령의 MetaView에 참조값이 등록됩니다.

### 서비스 객체

items, mapping 영역에서 테이블명과 조합해서 사용할 수 있습니다.

```js
var bm1 = new BindModel({
	tables: ['second', 'three'],
	items: {
        'aa': '',
        'second.bb': '',
        'cc': '',
    },
    command: {
        read: {}
	},
    mapping: {
        'aa': { read: ['valid'] },
        'bb': { read: ['bind'] },
        'three.cc': { read: ['output'] }
    },
});
```
- 'aa' 아이템은 기본 테이블(first)에 등록되고 대상 command 에 매핑됩니다.
- 'bb' 아이템은 추가 테이블(second)에 등록되고 대상 command 에 매핑됩니다.
- 'cc' 아이템은 추가 테이블(three)에 등록되고 대상 command 에 매핑됩니다.


## BindCommand 영역

### addColumn() : 컬럼 추가

컬럼 추가 시 테이블을 지정할 수 있습니다.

```js
var bm = new BindModel();

bm.addTable('second');
bm.addCommand('read');

bm.cmd['read'].addColumn('aa', 'valid', 'second');
bm.cmd['read'].addColumn('bb', '$all', bm.second);
```
- 'aa' 컬럼은 'second' 테이블에 등록되고 read 명령의 valid 에 참조가 등록됩니다.
- 'bb' 컬럼은 'second' 테이블에 등록되고 read 명령의 전체 MetaView 에 참조가 등록됩니다.

### addColumnValue() : 컬럼 추가 (초기값 설정)

column 추가 시 초기값을 설정하고 테이블을 지정할 수 있습니다.

```js
var bm = new BindModel();

bm.addTable('second');
bm.addCommand('read');

bm.cmd['read'].addColumn('aa', 'AA', 'read', 'valid', 'second');
bm.cmd['read'].addColumn('bb', 'BB', 'read', '$all', bm.second);
```
- 'aa' 컬럼은 초기값은 'AA' 로  'second' 테이블에 등록되고 read 명령의 valid 에 참조가 등록됩니다.
- 'bb' 컬럼은 초기값은 'AA' 로 'second' 테이블에 등록되고 read 명령의 전체 MetaView 에 참조가 등록됩니다.
### setColumn() : 컬럼 설정

column 설정 시 테이블을 지정할 수 있습니다.

```js
var bm = new BindModel();

bm.addTable('second');
bm.addCommand('read');

bb.first.columns.add('aa');
bb.first.columns.add('bb');
bb.seoncd.columns.add('cc');

bm.command['read'].setColumn('aa', 'valid');
bm.command['read'].setColumn(['bb', 'second.cc'], 'bind');
```
- 기본 테이블에 등록된 'aa' 컬럼은 read 명령의 valid 에 참조가 등록됩니다.
- 기본 테이블에 등록된 'bb' 컬럼은 read 명령의 bind 에 참조가 등록됩니다.
- 'second' 테이블에 등록된 'cc' 컬럼은 read 명령의 bind 에 참조가 등록됩니다.