
[![Node.js CI](https://github.com/white-base/bind-model/actions/workflows/ci.yml/badge.svg)](https://github.com/white-base/bind-model/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/white-base/bind-model/branch/main/graph/badge.svg)](https://codecov.io/gh/white-base/bind-model)
[![npm version](https://img.shields.io/npm/v/logic-bind-model.svg)](https://www.npmjs.com/package/logic-bind-model)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

# 시작하기

웹사이트 : https://bindmodel.com

## BindModel 이란?

BindModel은 웹과 Node.js 환경에서 작동하는 프론트엔드 프레임워크입니다. 명령과 엔티티(Table, View)를 기반으로 하여 단순함과 생산성을 목표로 설계되었습니다. HTML, CSS, JavaScript의 기초를 숙지한 상태에서 BindModel을 사용하여 손쉽게 웹사이트를 제작할 수 있습니다.

- 모든 데이터를 엔티티(MetaTable, MetaView)로 관리합니다.
- MVC 패턴에서 Controller의 역할을 수행하며, View(화면)와 완전히 분리되어 있습니다.
- 명령(BindCommand) 기반의 프로세서를 제공하여, 일관된 개발 패턴을 제공합니다.
- 라우팅, 폼 관리, 클라이언트-서버 통신 등 웹 개발에 필요한 라이브러리를 조화롭게 통합한 모음집입니다.
- 다른 프레임워크의 연동하여 사용할 수 있습니다.


## Vue & React Mix

Vue와 React의 복잡한 상태 관리를 분리하여, BindModel과의 혼합을 통해 기존 코드의 상태 관리와 비즈니스 로직을 명확히 분리합니다. 이를 통해 코드의 가독성, 유지보수성, 재사용성을 크게 향상시킬 수 있으며, 특히 대규모 프로젝트나 복잡한 데이터 처리에 적합합니다.

https://bindmodel.com/exam/notice/ 예제 참조


https://bindmodel.com/exam/notice/ See Example

Example source when mixing vue and bindModel
```js
import NoticeList from './components/NoticeList.js';
import NoticeForm from './components/NoticeForm.js';
import NoticeAdminService from './service/notice-admin-svc.js'

const { createApp, ref } = Vue
const bm = new _L.BindModel(new NoticeAdminService());  

bm.url =' /notice/data/list.json';

const app = createApp({
  data() {
    return {
      notices: [],
      selectedNotice: null,
      statusOptions: {
        'D': 'Standby',
        'A': 'Activation',
        'H': 'Hidden'
      },
      bindModel: bm,
    };
  },
  methods: {
    selectNotice(idx) {
      this.selectedNotice = idx;
    },
    deselectNotice() {
      this.selectedNotice = null;
    },
  },
  components: {
    'notice-list': NoticeList,
    'notice-form': NoticeForm
  }
});

app.mount('#app');
```

## 설치

BindModel 설치와 사용법에 대해서 배워봅니다.

### npm 을 이용한 설치

Node.js 환경에서 BindModel 을 설치하려면 다음 명령어를 사용하십시오.

```sh
npm install logic-bind-model
```

### 브라우저 환경에서의 설치

브라우저 환경에서는 BindModel 을 CDN을 통해 사용할 수 있습니다.

```html
<script src="https://unpkg.com/logic-bind-model/dist/bindmodel.pack.js"></script>
```

## 사용

BindModel 는 프레임워크의 핵심 객체입니다.

### 서버 환경 (node.js)

Node.js 환경에서는 require 또는 import 문을 통해 BindModel 을 사용할 수 있습니다.

예제 : CommonJS 에서 사용
```js
const { BindModel } = require('logic-bind-model');

const bm = new BindModel();
```


예제 : ESM 에서 사용
```js
import { BindModel } from 'logic-bind-model';  

const bm = new BindModel();
```

### HTML 환경

브라우저 환경에서는 '_L' 전역 변수를 통해서 접근합니다. 

예제 : HTML 환경에서 사용
```html    
<script src="https://unpkg.com/logic-bind-model/dist/bindmodel.pack.js"></script>
<script>
	const bm = new _L.BindModel();
</script>
```


## 패키징

BindModel는 axios 와 jQuery 모듈에 의존하여 서버와의 비동기 통신 및 DOM 조작을 수행합니다. 이러한 의존성을 반영하여 다양한 배포 패키지를 제공합니다.

### bindmodel.js

이 패키지는 BindModel 만을 포함하고 있으며, axios와 jQuery는 포함되지 않습니다. 이 패키지를 사용할 경우, 외부에서 axios와 jQuery를 이미 포함하고 있거나, 별도로 관리하고 있을 때 유용합니다.

### bindmodel.pack.js

이 패키지는 BindModel와 함께 axios와 jQuery 라이브러리를 포함하고 있습니다. 이 패키지는 외부에서 별도로 axios나 jQuery를 설치하지 않아도, bind-model.pack.js 하나만으로 모든 기능을 사용할 수 있습니다. 

`패키지명 + min.js` 은  압축파일입니다.
* bindmodel.min.js
* bindmodel.pack.min.js

# 기본 사용법

간단하게 기본 사용법을 배워봅니다.

## BindModel 생성

`BindModel` 객체 생성은 데이터 바인딩과 서버 간 통신을 위한 첫 번째 단계입니다.
 이 객체는 서버와의 AJAX 통신을 관리하는 핵심 역할을 합니다.
 

```js
var bm = new BindModel();

bm.url = '/user';
```
- '/user' 경로는 사용자의 정보와 관련된 API 요청을 처리하기 위한 기본 경로로 설정됩니다.
- 'command' 별로 'url' 을 설정할 수도 있습니다.


## command 추가

BindModel 객체에 새로운 명령(command)을 추가하려면 addCommand() 메서드를 사용합니다. 이 메서드는 BindCommand 객체를 생성하고, 이를 BindModel에 등록하여 서버와의 데이터 통신을 관리할 수 있도록 합니다.

BindCommand 객체는 서버와의 데이터 통신을 위해 세 가지 주요 역할을 하는 MetaView 객체들을 포함하고 있습니다.
- **valid** : 데이터의 유효성을 검사하는 역할을 합니다.
- **bind** : 클라이언트의 데이터가 서버에 전달되기 전에 데이터를 바인딩하는 역할을 합니다. 
- **output** : 서버로부터 수신된 데이터를 가져오는 역할을 합니다.

```js
bm.addCommand('newCmd', 3);

// bm.command['newCmd'] === bm.cmd['newCmd']
// bm.command['newCmd'] instanceof BindCommand
// bm.cmd['newCmd'].vallid instanceof MetaView
// bm.cmd['newCmd'].bind instanceof MetaView
// bm.cmd['newCmd'].output instanceof MetaView
```
- 출력옵션 에 따라 다르게 동작합니다. (범위 : 0, 1, 2, 3 )
- `'bm.command['명칭']'` 으로 `BindCommand` 객체에 접근할 수 있습니다.
- `bm.cmd['명칭']` 는 동일한 객체를 참조하며, 이 중 더 짧은 `bm.cmd` 를 별칭으로 사용할 수 있습니다.


## column 추가

addColumn() 메서드는 BindModel 객체에 컬럼을 추가하고, 지정된 BindCommand 객체의 MetaView에 컬럼을 설정하는 기능을 제공합니다. 추가적으로, addColumnValue() 메서드를 사용하여 컬럼의 초기값을 설정할 수 있습니다.

예시 : 빈 컬럼 추가
```js
bm.addColumn('aa', 'newCmd', 'valid');
bm.addColumn('bb', 'newCmd', ['valid', 'bind']);
bm.addColumn('cc', 'newCmd', '$all');
```
- 'aa' 이름으로 컬럼을 추가하고 cmd['newCmd'] 의 valid(MetaView)에 설정합니다.
- 'bb' 이름으로 컬럼을 추가하고 cmd['newCmd'] 의 'valid', 'bind' 에 설정합니다.
- 'cc' 이름으로 컬럼을 추가하고 cmd['newCmd'] 의 전체('valid', 'bind', 'output')에 설정합니다.

예제 : 초기값으로 컬럼 추가
```js
bm.addColumnValue('aa', 100, 'newCmd', 'valid');
bm.addColumnValue('bb', 'B', 'newCmd', ['valid', 'bind']);
bm.addColumnValue('cc', true, 'newCmd', '$all');
```
- 'aa' 이름으로 `100` 초기값으로 컬럼을 추가하고 cmd['newCmd'] 의 'valid' 에 설정합니다.
- 'bb' 이름으로 `'B'` 초기값으로 컬럼을 추가하고 cmd['newCmd'] 의 'valid', 'bind' 에 설정합니다.
- 'cc' 이름으로 `true` 초기값으로 컬럼을 추가하고 cmd['newCmd'] 의 전체에 설정합니다.


## 실행

BindCommand 객체의 execute() 메서드는 유효성 검사, 데이터 요청, 데이터 수신의 세 가지 주요 단계를 처리합니다. 각 단계는 콜백 함수를 통해 제어할 수 있으며, 이를 통해 요청의 흐름을 세부적으로 관리할 수 있습니다.

```js
bm.command['newCmd'].execute();
```
- execute() 메소드 호출시 세 가지 주요 단계를 거칩니다.
	- 유효성 검사 : 'valid' 컬럼 유효성 검사를 진행하고, 실패하면 'cbFail' 콜백을 호출합니다.
	- 데이터 바인딩 : 'bind' 에 컬럼과 같을 서버경로에 요청합니다.
	- 데이터 수신 : 수신된 데이터를 'output' 으로 가져옵니다.



# 객체 생성 방식

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

// 확인
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

// 확인
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

// 확인
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

// command 추가
bm.addCommand('create');
bm.addCommand('read', 3);

// 기본 columns 에 컬럼 추가
bm.columns.addValue('aa', 10);
bm.columns.addValue('bb', 20);
bm.columns.addValue('cc', 30);

// 명령에 설정
bm.command['create'].setColumn('aa', 'valid');
bm.command['create'].setColumn('cc', 'output');
bm.command['read'].setColumn('bb', ['bind']);
bm.command['read'].setColumn('cc', ['output']);

// 확인
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

// 확인
// bm.command['create'].valid.count  == 1 ('aa')
// bm.command['create'].bind.count   == 0
// bm.command['create'].output.count == 0

// bm.command['read'].valid.count    == 0
// bm.command['read'].bind.count     == 1 ('bb')
// bm.command['read'].output.count   == 1 ('bb')

// bm.columns.count  == 2 ('aa','bb')
```

이렇게 다양한 객체 생성 방식을 통해 BindModel를 유연하게 활용할 수 있으며, 각 방식의 장단점을 고려하여 적절한 방법을 선택하는 것이 중요합니다.


## 피드백 및 제안

여러분의 의견을 듣고 싶습니다! 이 프로젝트를 개선하기 위해 노력하는 동안 여러분의 피드백은 매우 귀중합니다. 문제를 발견했거나 개선할 사항이 있거나 경험을 공유하고 싶으시다면 언제든지 연락해 주세요!

1. 💡 **약간 이상한 점을 발견하거나 개선할 방법을 생각하시나요?**  
   저희는 지속적으로 성장하고 개선하고 있으며, 여러분의 의견은 더 빠르게 도달하는 데 도움이 됩니다! **bindmodel@gmail.com ** 😊로 연락주세요

2. 🚀 **"무언가 고장 났어요!"**  
   문제나 오류가 발생하면 주저하지 말고 알려주세요! 피드백은 우리의 생명줄이며 문제를 해결하는 데 도움이 될 수 있습니다. **bindmodel@gmail.com ** 😎로 메시지를 보내주세요

3. 😊 **경험은 어땠나요?**  
   첫인상은 중요하며, 상황이 어떻게 진행되었는지 알고 싶습니다. 모든 생각, 피드백 또는 제안은 따뜻하게 환영합니다. 이메일(**bindmodel@gmail.com ** 🙏)