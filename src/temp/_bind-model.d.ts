import type { PropertyCollection }      from 'logic-entity/ko';
import type { BaseColumnCollection }    from 'logic-entity/ko';
import type { MetaTable }               from 'logic-entity/ko';
import type { BaseBindModel }           from './base-bind-model.d.ts';
import type { IServiceAjax }            from './i-service-ajax.d.ts';
import type { BaseBindCommand }         from './base-bind-command.d.ts';
import type { HTMLColumn }              from './html-column.d.ts';

/**
 * 바인드모델 Ajax 클래스  
 * 이 클래스는 BaseBindModel을 상속하며, Ajax 통신을 위한 기능을 추가로 제공합니다.  
 */
declare class BindModel extends BaseBindModel {

    /**
     * `BindModel` 생성자입니다.
     * 
     * @param {IServiceAjax} service - Ajax 서비스를 제공하는 객체
     */
    constructor(service: IServiceAjax);

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
    addCommand(name: string, option: number, baseTable?: MetaTable): BaseBindCommand;

    /**
     * 서비스를 설정합니다.
     * 
     * @param service - 서비스 객체
     * @param isRea - 서비스 내의 prop를 item으로 로딩할지 여부를 나타내는 boolean 값
     */
    setService(service: IServiceAjax, isRead?: boolean): void;

}

export default BindModel;
export { BindModel };