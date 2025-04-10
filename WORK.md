# 작업 메모

## cypress 구성

브라우저 & 네트워크 통합 테스트

- cypress/ : 설정 구성
- public/ : 화면 리소스
- src/ : 테스트 소스

> 실행시 http-server 를 실행 후 npx cypress run


## jest

dom 테스트와 서버 전송 테스트는 분리해서 진행

### 테스트 종류
- esm 단위 테스트 : 기본 기능, 네트워크(msw)
- cjs 모듈 테스트 / 모듈에 따라 다르게 작동하는 기능
- browser 단위 테스트 / 모듈 테스트
- 
