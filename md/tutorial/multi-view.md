---
lang: ko
title: "멀티 뷰(output)"
layout: single
permalink: /ko/docs/multi-view/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---
멀티뷰는 서버에서 수신한 데이터가 2개 이상의 자료일 경우에 사용됩니다. BindCommand 객체는 기본적으로 output 속성의 MetaView를 포함하며, 이는 `_outputs['output1']`의 참조 속성입니다.

이 기능을 통해 여러 개의 MetaView를 추가하거나 제거할 수 있으며, 각 MetaView는 서버에서 수신한 데이터를 저장하고 관리하는 데 사용됩니다.

## BindCommand 의 output 구조

BindCommand 객체를 생성하면 기본적으로 output 속성이 추가됩니다. 이 output 속성은 `_outputs['output1']`의 참조입니다.

```js
var bm = new BindModel();

bm.addCommand('test');

// bm.command['test'].output == MetaView
// bm.command['test'].output1 == MetaView
```
- 여기서 output과 output1은 동일한 MetaView를 참조합니다.

## output (MetaView) 추가

타입 : newOutput
```ts
type newOutput = (outputName?: string) => void;
```
- outputName: 추가하는 output 이름입니다.

newOutput() 메소드를 사용하여 새로운 MetaView를 추가할 수 있습니다. 이 메소드는 선택적으로 outputName 을 인자로 받아 해당 이름으로 MetaView를 추가합니다. 
인자가 없을 경우, 기본적으로 `output + 순서` 형태의 이름으로 추가됩니다.

예제 : output 추가
```js
var bm = new BindModel();

bm.addCommand('test');
// bm.command['test'].output == MetaView
// bm.command['test'].output1 == MetaView
// bm.cmd['test']._outputs.count == 1

bm.cmd['test'].newOutput();
// bm.command['test'].output2 == MetaView
// bm.cmd['test']._outputs.count == 2

bm.cmd['test'].newOutput('three');
// bm.command['test'].output3 == MetaView
// bm.command['test'].three == MetaView
// bm.cmd['test']._outputs.count == 3
```
- 첫번째 newOutput() 메소드에서 인자를 주지 않으면 'output2'로 추가되었습니다.
- 두번째 newOutput() 메소드에서 'three' 과 'output3' 로 추가되었습니다.

ouput MetaView 을 추가후에 전체 command 에 컬럼을 추가하면 추가된 view 에도 매핑이 됩니다.

예제 : 전체 MetaView 에 컬럼 추가시
```js
var bm = new BindModel();

bm.addCommand('test');

bm.cmd['test'].newOutput('newOutput');
bm.cmd['test'].addColumn('aa');

// bm.cmd['test'].valid.count == 1 ('aa')
// bm.cmd['test'].bind.count == 1 ('aa')
// bm.cmd['test'].output.count == 1 ('aa')
// bm.cmd['test'].newOutput.count == 1 ('aa')
```
- 추가된 'newOutput' 에 추가한 'aa' 컬럼이 추가됩니다.

## output (MetaView) 제거

타입 : removeOutput
```ts
type newOutput = (outputName: string) => boolean;
```
- outputName: 제거할려는 output 이름입니다.

기본 프로퍼티 `ouput`, `output1` 는 제거할 수 없습니다.
```js
var bm = new BindModel();

bm.addCommand('test');

bm.cmd['test'].newOutput();
bm.cmd['test'].newOutput('three');

// Remove
bm.cmd['test'].removeOutput('output2');
bm.cmd['test'].removeOutput('three');
// bm.cmd['test'].removeOutput('output') : throw 발생
// bm.cmd['test']._outputs.count == 1
```
- 여기서 newOutput() 메소드로 으로 추가된 output2와 three를 제거할 수 있습니다.

위의 예제와 설명을 통해 멀티뷰 기능을 사용하여 여러 개의 MetaView를 추가하거나 제거하는 방법을 이해할 수 있습니다. 이는 서버에서 수신한 여러 데이터를 관리하고 처리하는 데 유용합니다.

