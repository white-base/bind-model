import 'logic-entity/ko';

declare module 'logic-entity/ko' {
  namespace Util {
    /**
     * 주어진 문자열이 유효한 CSS selector 인지 확인합니다.
     * 
     * @param selector - CSS selector 문자열
     * @returns 유효한 selector 인지 여부
     */
    function validSelector(selector: string): boolean;

    /**
     * 외부 경로의 스크립트를 로드합니다.  
     * 
     * @param url - 스크립트 URL
     * @param callback - 로드 완료 후 호출할 콜백 함수
     */
    function loadScript(url: string, callback?: Function): void
  }
}