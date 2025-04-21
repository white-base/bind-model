import type { MetaColumn }       from 'logic-entity/ko';
import type { BaseEntity }       from 'logic-entity/ko';
/**
 * HTML 컬럼을 나타내는 클래스입니다.  
 * 이 클래스는 HTML DOM 요소와 상호작용할 수 있는 컬럼을 정의합니다.  
 */
declare class HTMLColumn extends MetaColumn {

    /**
     * HTML 컬럼 객체를 생성합니다.
     * 
     * @param name - 컬럼의 이름
     * @param entity - 이 컬럼이 속하는 엔티티
     * @param prop - 컬럼의 추가 속성
     */
    constructor(name: string, entity: BaseEntity, prop: object);    // TODO: prop 타입 분리

    /**
     * 아이템 DOM 타입을 정의합니다.
     */
    domType: object;

    /**
     * 읽기 전용 여부를 나타냅니다.
     */
    isReadOnly: boolean;

    /**
     * 숨김 여부를 나타냅니다.
     */
    isHide: boolean;

    /**
     * DOM 요소를 나타냅니다.
     */
    element: HTMLElement;

    /**
     * 셀렉터를 정의합니다.  
     * type  
     * - `val` 또는 `value`: 요소의 value 속성값  
     * - `text`: 요소의 텍스트값  
     * - `html`: 요소의 HTML 값  
     * - `css.속성명`: CSS의 속성값 (객체)  
     * - `prop.속성명`: 요소의 속성명값 (초기 상태 기준)  
     * - `attr.속성명`: 요소의 속성명값 (현재 상태)  
     * - `none`: 아무 작업도 수행하지 않음, 표현의 목적  
     * 예시: 'value', 'text', 'css.color', 'prop.disabled'  
     */
    selector: { key: string, type: string };

    /**
     * value 값을 필터링하는 함수입니다.
     * 
     * @param sVal - selector 가 존재시 selector 에서 얻는 값
     * @returns 필터링된 value 값입니다.
     */
    getFilter: (sVal: any) => any;

    /**
     * value 값을 필터링하는 함수입니다.
     * 
     * @param val - 필터로 적용할 값
     * @returns 필터링 결과값이 있으면, selector 의 값을 설정합니다.
     * 
     */
    setFilter: (val: any) => any;

    /**
     * 아이템의 값을 설정하거나 가져옵니다. 
     * 
     * @override
     */
    value: any;

    /**
     * 현재 컬럼을 복제합니다.
     * 
     * @param entity - 복제할 대상의 엔티티
     * @returns 현재 인스턴스의 복제본입니다.
     * @override
     */
    clone(entity: BaseEntity): this;

    /**
     * 객체를 GUID 타입의 객체 리터럴로 반환합니다.
     * 
     * @param mode - 가져오기 모드  
     * mode=0 : 참조 구조(_guid:Yes, $ref:Yes)  
     * mode=1 : 중복 구조(_guid:Yes, $ref:Yes)  
     * mode=2 : 비침조 구조(_guid:No,  $ref:No)   
     * @param context - 현재 객체를 포함(소유)하는 상위 객체
     * @returns GUID 타입의 객체 리터럴
     */
    getObject(mode?: number, context?: object | object[]): object;

    /**
     * GUID 타입의 객체 리터럴을 인스턴스 객체로 변환하여 설정합니다.
     * 
     * @param guidObj - 설정할 GUID 타입의 객체 리터럴
     * @param guidRootObj - 변환 과정에서 참조되는 초기 GUID 리터럴 객체  
     */
    setObject(guidObj: object, guidRootObj?: object): void;

    /**
     * 변환 TODO:
     */
    // toEntityColumn(): void;
}

export default HTMLColumn;
export { HTMLColumn };