---
lang: ko
title: "execute() 동기화"
layout: single
permalink: /ko/docs/synchronization/
date: 2024-10-01T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---

BindCommand 객체의 execute() 메소드는 Promise를 반환합니다. 따라서 async 및 await 키워드를 사용하여 비동기적으로 명령을 실행하고 필요한 경우 동기화 코드를 작성할 수 있습니다. 

타입 : execute()
```ts
type execute () => Promise<void>;
```

## 단일 명멸어 동기화 예제

다음 코드는 'read_member' 라는 명령을 실행하고, 해당 명령이 완료된 후에 알림을 표시합니다.

```js
var bm = new BindModel();

bm.addCommand('read_member', 3);
// ... omit column settings

async function readView() {
    try {
        await bm.cmd['read_member'].execute();
        alert( 'Called membership information');
    } catch (error) {
        console.error ('Error encountered during command execution:', error);
    }
}
```
- 이 코드에서 execute() 메소드는 Promise를 반환하므로 await 키워드를 사용하여 명령이 완료될 때까지 대기합니다. 명령이 성공적으로 완료되면 알림 메시지를 표시합니다. 또한, try...catch 블록을 사용하여 명령 실행 중 발생할 수 있는 오류를 처리할 수 있습니다.

## 다중 명령어 동기화 예제

다음 코드는 read_meb와 read_corp라는 두 개의 명령을 순차적으로 실행합니다.
```js
var bm = new BindModel();

bm.addCommand('read_meb', 3);
bm.addCommand('read_corp', 3);
// ... omit column settings

async function readView() {
    try {
        await bm.cmd['read_meb'].execute();
        console.log ('calling private membership information');
        
        await bm.cmd['read_corp'].execute();
        console.log ('could get corporation information');
    } catch (error) {
        console.error ('Error encountered during command execution:', error);
    }
}
```
- 이 코드에서는 두 개의 명령을 순차적으로 실행하며, 각 명령이 완료될 때마다 로그 메시지를 출력합니다. try...catch 블록을 사용하여 두 명령 실행 중 발생할 수 있는 오류를 처리합니다.

## 동시 실행 예제

명령을 순차적으로 실행하는 대신 동시에 실행해야 하는 경우, Promise.all을 사용할 수 있습니다.

```js
var bm = new BindModel();

bm.addCommand('read_meb', 3);
bm.addCommand('read_corp', 3);
// ... Column Settings
async function readView() {
    try {
        await Promise.all([
            bm.cmd['read_meb'].execute(),
            bm.cmd['read_corp'].execute()
        ]);
        console.log ('Called all information');
    } catch (error) {
        console.error ('Error encountered during command execution:', error);
    }
}
```
- 이 코드에서는 Promise.all을 사용하여 두 명령을 동시에 실행하고, 모든 명령이 완료될 때까지 기다립니다. 모든 명령이 성공적으로 완료되면 로그 메시지를 출력합니다. 오류가 발생하면 catch 블록에서 처리합니다.

이와 같이 async 및 await 키워드를 사용하면 Promise 기반의 비동기 코드를 쉽게 동기화할 수 있습니다. 이를 통해 명령 실행 순서를 제어하고 오류를 처리할 수 있습니다.
