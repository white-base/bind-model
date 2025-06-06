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
 *
 * @class
 */
type BindModel = {

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
     * @throws {ExtendError} - 명령이 존재하거나, 테이블이 존재하지 않는 경우
     */
    addCommand(name: string, option?: OutputOption, baseTable?: MetaTable): BindCommand;

    /**
     * DOM 검사하여 지정한 타입으로 'selector' 를 컬럼으로 추가합니다.  
     * {@link BindModelConstructor.addCommand | addCommand()}
     * 
     * @param name 컬럼 이름
     * @param selector 셀렉터 지시자
     * @param cmds  추가할 아이템 명령, [] 입력시 전체 command 선택됨
     * @param views 추가할 뷰 엔티티
     * @param bTable 기본 테이블
     * @returns 추가된 컬럼
     * @throws {ExtendError} 추가할 타입이 없거나, 추가할 수 없는 경우
     * 
     * @example
     * // 컬럼 추가 후 id 속성으로 셀렉터 추가
     * bm.addSelector('u_name', '#u_name'); 
     * bm.columns['u_name'].value);  // 컬럼(u_name)값 조회
     * 
     * @example
     * // 컬럼 추가 및 명령의 모든 뷰에 매핑
     * bm.addSelector('u_name', '#u_name', 'read');
     * // 명령(read) 실행, '/user/1' URL 로 GET 요청
     * bm.cmd['read'].exec('VIEW', '/user/1');
     * 
     * @example
     * // 컬럼 추가 및 명령의 지정한 뷰에 매핑
     * bm.addSelector('u_name', '#u_name', 'read', 'bind');
     */
    addSelector(name: string, selector: string | object, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): HTMLColumn;

    /**
     * 서비스를 설정합니다.
     * 
     * @param service - 서비스 객체
     * @param isRead - 서비스 내의 prop를 item으로 로딩할지 여부를 나타내는 boolean 값
     */
    setService(service: IServiceAjax, isRead?: boolean): void;

} & BaseBindModel;

export interface BindModelConstructor {
    /**
     * `BindModel` 생성자입니다.
     * 
     * @param {IServiceAjax} service - Ajax 서비스를 제공하는 객체
     * 
     * @example
     * // BindModel을 생성하고 명령을 실행합니다.
     * const bm = new BindModel(); // 빈 BindModel 생성
     * 
     * bm.addSelector('u_name', '#u_name'); // 컬럼 추가 후 id 속성으로 셀렉터 추가
     * bm.cmd['read'].exec('VIEW', '/user/1'); // 명령(read) 실행, '/user/1' URL 로 GET 요청
     * 
     * bm.addCommand('read', 'VIEW'); // 명령(read) 추가, VIEW로 설정
     * bm.command['read'] instanceof BindCommand; // true
     * bm.command['read'].url = '/user/1'; // URL 설정
     * bm.command['read'].execute();
     * 
     * @example
     * // 두번째 테이블을 생성합니다.
     * const bm = new BindModel(); // 빈 BindModel 생성
     * 
     * bm.addTable('second'); // 테이블(second) 추가
     * bm.second instanceof MetaTable; // true
     * bm.first instanceof MetaTable; // true
     * 
     * @example
     * // 컬럼을 추가합니다.
     * const bm = new BindModel(); // 빈 BindModel 생성
     * 
     * bm.addSelector('u_name', '#u_name'); // 컬럼 추가 후 id 속성으로 셀렉터 추가
     * bm.addColumnValue('u_id', { selector: '#u_id', type: 'value' }); // 컬럼 추가 후 id 속성으로 셀렉터 추가
     * bm.addColumn('age');
     * bm.columns['age'].value = 30; // 컬럼(age)값 설정
     * 
     * @example
     * // BindModel을 상속받은 클래스에서 preRegister, preCheck, preReady 메서드를 구현하여 전처리 로직을 추가할 수 있습니다.
     * const bm = new BindModel(); // 빈 BindModel 생성
     * 
     * bm.preRegister = function (selector) {
     *     // 전처리 등록 로직
     * };
     * bm.preCheck = function (selector) {
     *     // 전처리 검사 로직
     *     return true; // 검사 통과
     * };
     * bm.preReady = function (selector) {
     *     // 전처리 준비완료 로직
     * };
     * bm.init(); // 초기화
     */
    new (service?: IServiceAjax): BindModel;
}

declare const BindModel: BindModelConstructor;

export default BindModel;
export { BindModel };