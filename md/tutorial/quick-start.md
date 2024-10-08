---
lang: ko
title: "시작하기"
layout: single
permalink: /ko/docs/quick-start/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---
## BindModel 이란?

BindModel은 웹과 Node.js 환경에서 작동하는 프론트엔드 프레임워크입니다. 명령과 엔티티(Table, View)를 기반으로 하여 단순함과 생산성을 목표로 설계되었습니다. HTML, CSS, JavaScript의 기초를 숙지한 상태에서 BindModel을 사용하여 손쉽게 웹사이트를 제작할 수 있습니다.

- 모든 데이터를 엔티티(MetaTable, MetaView)로 관리합니다.
- MVC 패턴에서 Controller의 역할을 수행하며, View(화면)와 완전히 분리있습니다.
- 명령(BindCommand) 기반의 프로세서를 제공하여, 일관된 개발 패턴을 제공합니다.
- 라우팅, 폼 관리, 클라이언트-서버 통신 등 웹 개발에 필요한 라이브러리를 조화롭게 통합한 모음집입니다.
- 다른 프레임워크의 연동하여 사용할 수 있습니다.


<!-- **Note:** You won't ever assign this layout directly to a post or page. Instead all other layouts will build off of it by setting `layout: default` in their YAML Front Matter.
{: .notice} -->


<!-- ![image-left](/assets/images/image-alignment-150x150.jpg){: .align-left} The rest of this paragraph is filler for the sake of seeing the text wrap around the 150×150 image, which is **left aligned**. There should be plenty of room above, below, and to the right of the image. Just look at him there --- Hey guy! Way to rock that left side. I don't care what the right aligned image says, you look great. Don't let anyone else tell you differently. -->


## 설치

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


예제 : ES6 에서 사용
```js
import { BindModel } from 'logic-bind-model';  

const bm = new BindModel();
```

### HTML 환경

브라우저 환경에서는 `_L` 전역 변수를 통해서 접근합니다.

예제 : HTML 환경에서 사용
```html    
<script src="https://unpkg.com/logic-bind-model/dist/bindmodel.pack.js"></script>
<script>
	const bm = new _L.BindModel();
</script>
```


## 패키징

BindModel는 axios 와 jQuery 모듈에 의존하여 서버와의 비동기 통신 및 DOM 조작을 수행합니다. 이러한 의존성을 반영하여 다양한 배포 패키지를 제공합니다.

### bind-model.pack.js,  bind-model.pack.min.js

이 패키지는 BindModel와 함께 axios와 jQuery 라이브러리를 포함하고 있습니다. 이 패키지는 외부에서 별도로 axios나 jQuery를 설치하지 않아도, bind-model.pack.js 하나만으로 모든 기능을 사용할 수 있습니다. 

### bind-model.js,  bind-model.min.js

이 패키지는 BindModel 만을 포함하고 있으며, axios와 jQuery는 포함되지 않습니다. 이 패키지를 사용할 경우, 외부에서 axios와 jQuery를 이미 포함하고 있거나, 별도로 관리하고 있을 때 유용합니다.

{% capture notice-text %}
* bindmodel.min.js
* bindmodel.pack.min.js
{% endcapture %}

<div class="notice--info">
  See <h4>:</h4>
  {{ notice-text | markdownify }}
</div>