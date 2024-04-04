import { BaseEntity } from "logic-entity";
import MetaElement           = require("logic-entity/meta-element");

/**
 * HTML 컬럼
 */
declare class HTMLColumn extends MetaElement {

    /**
     * HTML 컬럼
     * @param name 
     * @param entity 
     * @param prop 
     */
    constructor(name: string, entity: BaseEntity, prop: object);    // TODO: prop 타입 분리

    /**
     * 아이템 DOM 타입
     */
    domType: object;

    /**
     * 읽기전용 여부
     */
    isReadOnly: boolean;

    /**
     * 숨김 여부
     */
    isHide: boolean;

    /**
     * DOM 요소
     */
    element: object;

    /**
     * 셀렉터
     * @example
     * type
     *  - val | value   : 요소의 value 속성값
     *  - text          : 요소의 텍스트값
     *  - html          : 요소의 html값
     *  - css.속성명    : css 의 속성값 (객체)
     *  - prop.속성명   : 요소의 속성명값 (초기상태기준)
     *  - attr.속성명   : 요소의 속성명값 (현재상태)
     *  - none         : 아무일도 하지 않음, 표현의 목적
     */
    selector: string;

    /**
     * value 값 필터
     */
    getFilter: ()=>any;

    /**
     * value 값 필터
     */
    setFilter: ()=>any;

    /**
     * 아이템 값 (오버라이딩)
     * @override
     */
    value: any;

    /**
     * 아이템 DOM을 복제한다. 
     * @param entity 
     */
    clone(entity: BaseEntity): this;

    /**
     * 현재 객체를 직렬화(guid 타입) 객체로 얻습니다. 
     * (순환참조는 $ref 값으로 대체된다.) 
     * @param vOpt [p_vOpt=0] 가져오기 옵션
     * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
     * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
     * - opt=2 : 비침조 구조(_guid:No,  $ref:No) 
     * @param owned [p_owned={}] 현재 객체를 소유하는 상위 객체들
     * @example
     * a.getObject(2) == b.getObject(2
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * 직렬화(guid 타입) 객체를 현재 객체에 설정합니다.  
     * (객체는 초기화 된다.)
     * @param oGuid 직렬화 할 guid 타입의 객체
     * @param origin [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체  
     */
    setObject(oGuid: object, origin?: object);


    /**
     * 변환
     */
    toEntityColumn();
}

export = HTMLColumn;