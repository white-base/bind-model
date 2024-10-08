---
lang: ko
title: "핵심 개념"
layout: single
permalink: /ko/docs/core/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

BindModel의 핵심은 MetaTable과 MetaView의 조합으로 이루어져 있습니다. 이 두 가지 요소는 BindModel의 기능을 구성하는 중요한 기반이며, 실 프로젝트에서 중복을 최소화하고 다양한 사례를 수용할 수 있도록 설계되었습니다.

## MetaTable 클래스

MetaTable 클래스는 데이터를 테이블 형식으로 쉽게 표현하고 다양한 기능을 제공합니다. 이 클래스는 .NET의 DataTable과 유사한 기능을 제공하여, .NET 경험자들이 익숙하게 사용할 수 있습니다. MetaTable은 컬럼과 행을 관리하는 두 가지 주요 속성(columns와 rows)을 통해 데이터를 효율적으로 처리할 수 있습니다.

[55. MetaTable Class-B| - Reference: MetaTable Class]

### MetaTable.columns 속성 (컬렉션)

`MetaTable` 의 'columns' 컬렉션은 컬럼(MetaColumn)의 추가/제거의 기능을 제공합니다.
이 컬렉션은 테이블 구조를 정의하며, 각 컬럼은 고유한 키(컬럼명)와 인덱스를 가집니다. 이를 통해 컬럼에 대한 접근을 쉽게 할 수 있습니다.

```js
var table1 = new MetaTabe('t1');

table1.columns.add('age');
table1.columns.add('gender');

// Access to a column
// table1.columns['age'] === table1.columns[0]
// table1.columns['gender'] === table1.columns[1]
// table1.colmmns.count === 2
```
#### 제약조건
MetaTable에 MetaRow가 rows 컬렉션에 추가된 이후에는 columns 컬렉션에 컬럼을 추가하거나 제거할 수 없습니다. 이는 데이터의 일관성을 유지하기 위한 제약입니다. 컬럼 정의는 데이터를 삽입하기 전에 완료되어야 합니다.

### MetaTable.rows 속성 (컬렉션)

MetaTable의 rows 속성은 데이터(MetaRow)를 추가하거나 제거할 수 있는 컬렉션입니다. 새로운 행은 newRow() 메서드를 통해 생성되며, 생성된 MetaRow 객체는 rows 컬렉션에 추가될 수 있습니다.

```js
var table1 = new MetaTabe('t1');
var row = table1.newRow();

row['age'] = 20;
row['gender'] = 'man';

table1.rows.add(row);

// Access to data
// row.count == 2
// table1.rows[0]['age'] == 20
// table1.rows[0]['gender'] == 'man'
// table1.rows.count == 1
```
- rows 컬렉션에 추가된 MetaRow는 연속된 인덱스를 제공합니다.

## MetaView 클래스

MetaView 클래스는 MetaTable과 유사한 역할을 수행하지만, 중요한 차이점은 MetaView의 columns 컬렉션에 컬럼(MetaColumn)을 직접 추가하는 대신, 참조값을 통해 추가할 수 있다는 점입니다. 이는 MetaView가 기존 데이터 구조를 기반으로 다양한 뷰(View)를 정의하고 활용할 수 있습니다.

[56. MetaView Class-B|Reference | -Reference: MetaView Class]

### 전체 컬럼을 참조 컬럼으로 등록

MetaView의 \_baseEntity 속성을 설정한 후, MetaView에 컬럼을 추가하면 해당 컬럼은 \_baseEntity에 실제로 추가되고, MetaView에는 참조값만 등록됩니다. 이 방식은 기존 테이블(MetaTable)의 구조를 그대로 활용하면서도 별도의 뷰를 정의하고 사용할 수 있게 합니다.

```js
var table1 = new MetaTabe('t1');
var view1 = new MetaView('v1', table1);

view1.columns.add('age');
view1.columns.add('gender');

// table1.colmmns.count === 2
// view1.colmmns.count === 2
// view1.columns['age'] === table1.columns['age']
// view1.columns['gender'] === table1.columns['gender']
```
- 컬럼 추가시 기존 컬럼명의 컬렉션이 존재하면, 참조값을 등록합니다.

### 개별 컬럼을 참조 컬럼으로 등록

MetaView는 특정 컬럼만 \_baseEntity에 참조값으로 등록할 수 있습니다. 이는 MetaView가 필요한 특정 데이터만 선택적으로 참조하여 사용할 수 있도록 해줍니다.

```js
var table1 = new MetaTabe('t1');
var view1 = new MetaView('v1');

view1.columns.add('age');
view1.columns.add('gender', table1);

// table1.colmmns.count === 1
// view1.colmmns.count === 2
// view1.columns['gender'] === table1.columns['gender']
```
- '\_baseEntity' 대상이 `MetaView` 일 경우 순환규칙을 따르게됩니다.


## HTMLColumn 클래스

HTMLColumn은 MetaColumn의 자식 클래스이며, HTML 요소와 데이터를 연동하는 기능을 제공합니다. 특히 value 속성을 통해 컬럼의 현재 값을 관리할 수 있으며, 다양한 프로퍼티를 통해 값의 설정과 조회를 유연하게 제어할 수 있습니다. HTMLColumn의 주요 프로퍼티로는 selector, setter/getter, setFilter/getFilter 등이 있습니다.

[54. HTML Column Class-B| - Reference: Column Configuration]

### MetaRow 로 컬럼 value 값 설정하기

setValue() 메서드를 사용하여 MetaRow 객체로부터 데이터를 가져와 컬럼의 value 값에 설정할 수 있습니다.

```js
var table1 = new MetaTabe('t1');
var row = table1.newRow();

row['age'] = 30;
row['gender'] = 'man';

tables.setValue(row);

// table1.columns['age'].value == 30
// table1.columns['gender'].value == 'man'
```

### 컬럼의 value 값을 MetaRow 로 가져오기

getValue() 메서드를 사용하여 컬럼의 value 값을 MetaRow 타입으로 반환받을 수 있습니다.

```js
var table1 = new MetaTabe('t1');

table1.columns['age'].value = 40;
table1.columns['gender'].value = 'man';

var row = tables.getValue();

// row['age'].value == 40
// row['gender'].value == 'man'
```

### 컬럼의 value 값 조회하기

HTMLColumn의 value 값을 조회할 때, 설정된 우선순위에 따라 하나의 값이 선택되어 반환됩니다.

#### 우선순위
1. *getter 리턴값* : getter가 설정되어 있다면, 이 값이 최우선으로 반환됩니다.
2. *getFillter 리턴값* : getFilter가 설정되어 있다면, selector 값이 매개변수로 전달되며 가공된 값이 반환됩니다.
3. *selector 조회값* :  selector에 설정된 타입(text, value, attr, prop, html)에 따라 값이 반환됩니다.
4. *내부값* : getter, getFilter, selector 설정이 없을 경우, 내부에 저장된 값이 반환됩니다.
5. *default 값* : 위의 설정이 모두 없으며 초기값이 Empty일 경우, 기본값이 반환됩니다. 
   (초기값은 null 또는 빈 문자열)
   
[54. HTML Column Class-B#getter Internal Structure | - Reference: getter Internal Structure]

예제 : getter 설정 시
```js
column.getter = function(sVal) {
	return 'user value';
};

// column.value == 'user value'
```

Example: When setting up getFilter
```js
column.getFilter = function(sVal) {
	return $('input[name=type_cd]:checked').val(); // Blue
};

// column.value == 'Blue'
```
예제 : getFilter 설정 시
```js
column.selector = { key: '#u_name', type: 'value' }; // Cat
column.getFilter = function(sVal) {
	return $('input[name=type_cd]:checked').val() +'-'+ sVal; // Blue
};

// column.value == 'Blue-Cat'
```
- selector 의 값이 getFilter 에 전달되고, getFilter 에서 가공 후 전달 됩니다.

예제 : selector 설정 시
```js
column.selector = { key: '#u_name', type: 'value' };
```

#### 참조
getter 와 getFilter 는 비슷한 역할을 하지만, 차이점이 있습니다. getter 는 단일 설정값을 반환하는 데 사용되며, getFilter 는 내부 값(원시값)을 기반으로 여러 HTMLElement 의 값을 설정하거나 가공하는 역할을 합니다.

### 컬럼의 value 값 설정

HTMLColumn의 value 값을 설정할 때, 설정된 순서에 따라 값을 저장하고 전달합니다. 설정 순서는 다음과 같습니다.

설정 순서
1. *setter* : 설정하려는 값이 첫 번째로 저장됩니다.
2. *내부* : setter가 반환값을 가지면 그 값을 저장하고, 반환값이 없으면 설정값을 내부에 저장합니다.
3. *setFilter* : 내부값을 매개변수로 전달하여 값을 설정합니다.
5. *selector* : setFilter의 반환값이 있으면 그 값을 설정하고, 반환값이 없으면 내부값을 설정합니다.


[54. HTML Column Class-B#setter Internal Structure | - Reference: setter Internal Structure]

예제 : setter 만 설정 시
```js
var temp;

column.setter = function(val) {
	temp = val;
};

column.value = 'user value';
// temp == 'user value'
// column.$value == 'user value'
```
예제 : setter 와 setFilter 설정 시
```js
var temp;

column.setter = function(val) {
	temp = val * 10;
};
column.setFilter = function(val) {
	$('input[name=active_yn][value='+ val + ']').prop('checked', true);
};

column.value = 2;
// temp == 20
// <input type="checkbox" name="action_yn" value="2"/>
// column.$value == 2
```
- setFilter 의 매개변수는 setter 가 반환값이 전달하고, 반환값이 없으면 내부값을 전달합니다.

예제 : setter 와 selector 설정 시 
```js
column.setter = function(val) {
	return temp = val * 10;
};
column.selector = { key: '#u_name', type: 'value' }; // Cat

column.value = 2;
// temp == 20
// <input type="text" name="u_name" value="20"/>
// column.$value == 20
```
- setter 리턴값을 반환값으로 내부값에 저장됩니다.
- selector 의 값은 내부값이 설정됩니다.

예제 : selector 만 설정 시
```js
column.selector = { key: '#u_name', type: 'value' };

column.value = 2;
// <input type="text" name="u_name" value="2"/>
// column.$value == 2
```

#### 참조
setter 와 setFilter 는 비슷한 역할을 하지만, 차이가 있습니다. setter는 단일 값을 설정하는 데 사용되고, setFilter는 내부 값(원시값)을 기반으로 여러 HTMLElement의 값을 설정하거나 가공하는 역할을 합니다.
예를 들어, 통화 단위를 표현할 때, 내부 값이 1000 이라면 화면에는 ‘1,000’으로 출력하는 식입니다.

## BindModel 구조의 이해

BindModel 은 하나의 MetaTable(이름: first)을 자동으로 생성하며, 이 구조 내에서 추가된 각 BindCommand 객체는 세 개의 MetaView(valid, bind, output)를 포함합니다.

[[52. BindModel class-B#Main structure | - Reference: BindModel's main structure]
[53. Bind Command Class-B#Main Structure | - Reference: BindComand Main Structure]

### BindModel 의 엔티티의 구조 요약

다음은 BindModel의 내부 엔티티 구조(MetaTable, MetaView)를 요약한 코드입니다:

```js
function createCommand(baseTable) {
	return {
		valid: new MetaView('valid', baseTable),
		bind: new MetaView('bind', baseTable),
		output: new MetaView('output', baseTable)
	};
}

var table1 = new MetaTabe('first');
var cmd1 = createCommand(table1);

cmd1.bind.columns.add('aa');
cmd1.output.columns.add('bb');

// table1.colmmns.count === 2 ('aa','bb')
// table1.columns['aa'] === view2.columns['aa']
// table1.columns['bb'] === view3.columns['bb']

// view1.colmmns.count === 0
// view2.colmmns.count === 1 ('aa')
// view3.colmmns.count === 1 ('bb')
```
- MetaView 에 컬럼을 추가하면, 해당 컬럼은 MetaView의\_baseEntity로 지정된 MetaTable에 추가됩니다. 이때 MetaView에는 컬럼의 참조만 등록됩니다.
- MetaTable 에 직접 컬럼을 추가하면, 해당 컬럼은 독립적으로 추가됩니다. MetaView와는 달리 다른 뷰에서 참조하지 않습니다.
- BindModel을 생성하면, 기본적으로 first라는 이름의 MetaTable이 자동으로 생성됩니다. 각 BindCommand 객체는 자동으로 valid, bind, output이라는 이름의 MetaView를 포함합니다.

BindModel에서 execute() 메소드를 실행하면, MetaTable과 MetaView의 구조에 따라 컬럼과 데이터가 설정됩니다. 이 과정을 통해 다양한 사용자 요구사항에 맞게 커스터마이징할 수 있습니다.
