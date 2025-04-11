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
     * @param {string} name - 컬럼의 이름입니다.
     * @param {BaseEntity} entity - 이 컬럼이 속하는 엔티티입니다.
     * @param {object} prop - 컬럼의 추가 속성입니다.
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
     * @param {any | undefined} sVal - selector 가 존재시 selector 에서 얻는 값입니다.
     * @returns {any} 필터링된 value 값입니다.
     */
    getFilter: (sVal: any) => any;

    /**
     * value 값을 필터링하는 함수입니다.
     * 
     * @param {any | undefined} val - 필터로 적용할 값입니다.
     * @returns {any} 필터링 결과값이 있으면, selector 의 값을 설정합니다.
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
     * @param {BaseEntity} entity - 복제할 대상의 엔티티입니다.
     * @returns {this} 현재 인스턴스의 복제본입니다.
     * @override
     */
    clone(entity: BaseEntity): this;

    /**
     * 현재 객체를 직렬화된 객체로 얻습니다. 
     * 순환 참조는 `$ref` 값으로 대체됩니다.
     * 
     * @param {number} [vOpt=0] - 가져오기 옵션입니다.
     * - `0`: 참조 구조 (`_guid: Yes`, `$ref: Yes`)
     * - `1`: 중복 구조 (`_guid: Yes`, `$ref: Yes`)
     * - `2`: 비침조 구조 (`_guid: No`, `$ref: No`)
     * @param {object | object[]} [owned={}] - 현재 객체를 소유하는 상위 객체들입니다.
     * @returns {object} 직렬화된 객체입니다.
     * 
     * @example
     * const serialized = a.getObject(2);
     * const sameObject = b.getObject(2);
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * 직렬화된 객체를 현재 객체에 설정합니다.  
     * 객체는 초기화됩니다.
     * 
     * @param {object} oGuid - 직렬화된 GUID 객체입니다.
     * @param {object} [origin=oGuid] - 현재 객체를 설정하는 원본 객체입니다.
     */
    setObject(oGuid: object, origin?: object): void;

    /**
     * 변환 TODO:
     */
    // toEntityColumn(): void;
}

export default HTMLColumn;
export { HTMLColumn };