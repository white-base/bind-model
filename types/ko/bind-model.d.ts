import type { PropertyCollection }          from 'logic-entity/ko';
import type { BaseColumnCollection }        from 'logic-entity/ko';
import type { MetaTable }                   from 'logic-entity/ko';
import type { BaseBindModel }               from './base-bind-model.d.ts';
import type { IServiceAjax }                from './i-service-ajax.d.ts';
import type { BindCommand }                 from './bind-command.d.ts';
import type { HTMLColumn }                  from './html-column.d.ts';
import type { OutputOption }                from './T.js';

/**
 * 바인드모델 Ajax 클래스  
 * 이 클래스는 BaseBindModel을 상속하며, Ajax 통신을 위한 기능을 추가로 제공합니다.  
 */
type BindModel = BaseBindModel & {

    /**
     * 바인딩 기본 config을 설정합니다.
     */
    baseConfig: object;  // TODO: 타입 분리

    /**
     * 바인딩 기본 config.url을 설정합니다.
     * 
     * @example
     * const bm = new BindModel(service);
     * bm.url = '/user';
     */
    url: string;

    /**
     * 셀렉터를 검사합니다.
     * 
     * @param collection - 검사할 컬럼 컬렉션
     * @returns 검사 결과를 나타내는 boolean 값입니다.
     */
    checkSelector(collection: BaseColumnCollection<HTMLColumn>): boolean;

    /**
     * 대상 셀렐터 목록을 얻습니다.
     * 
     * @param collection - 검사할 속성 컬렉션 (기본값은 items)
     * @returns 셀렉터 목록을 나타내는 객체 배열입니다.
     */
    getSelector(collection?: PropertyCollection<HTMLColumn>): object[];

    /**
     * 명령을 추가합니다.
     * 
     * @param name - 명령 이름
     * @param option - 출력 옵션
     * @param baseTable - (선택적) 기본 테이블 객체
     * @returns 추가된 바인드 명령 객체입니다.
     */
    addCommand(name: string, option?: OutputOption, baseTable?: MetaTable): BindCommand;

    /**
     * DOM 검사하여 지정한 타입으로 'selector' 를 컬럼으로 추가합니다.
     * 
     * @param name 컬럼 이름
     * @param selector 셀렉터 지시자
     * @param cmds  추가할 아이템 명령, [] 입력시 전체 command 선택됨
     * @param views 추가할 뷰 엔티티
     * @param bTable 기본 테이블
     */
    addSelector(name: string, selector: string | object, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 서비스를 설정합니다.
     * 
     * @param service - 서비스 객체
     * @param isRea - 서비스 내의 prop를 item으로 로딩할지 여부를 나타내는 boolean 값
     */
    setService(service: IServiceAjax, isRead?: boolean): void;

};

export interface BindModelConstructor {
    /**
     * `BindModel` 생성자입니다.
     * 
     * @param {IServiceAjax} service - Ajax 서비스를 제공하는 객체
     */
    new (service?: IServiceAjax): BindModel;
}

declare const BindModel: BindModelConstructor;

export default BindModel;
export { BindModel };