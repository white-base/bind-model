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

    /**
     * DOM 말단(leaf) 요소의 텍스트를 수집하고
     * 불필요한 중간 태그·:nth-child(1) 을 정리한 셀렉터 목록을 반환합니다.
     * 각 단계는 공백(자손 선택자)으로 구분됩니다.
     *
     * @returns {string[]}  예) #sod_fin_orderer tr:nth-child(1) td | text | 홍길동
     */
    function extractSelector(): string[];
  }
}
