import type { MetaTable }            from 'logic-entity/ko';
import type { BaseBindCommand }     from './base-bind-command.d.ts';
import type { BaseBindModel }        from './base-bind-model.d.ts';
import type { OutputOption }        from './T.js';

/**
 * 바인드 명령을 AJAX를 통해 구현하는 클래스입니다.  
 * 이 클래스는 서버와의 데이터 통신을 처리하고, 바인드 명령을 AJAX 방식으로 실행합니다.  
 */
type BindCommand = {

     /**
     * AJAX 요청에 대한 설정값입니다.  
     * axios 의 `config`와 동일한 형식입니다.  
     */
    config: object;  // TODO: 타입 추출

    /**
     * AJAX 요청의 URL을 설정합니다.
     */
    url: string;

    /**
     * 유효성 검사를 수행합니다.  
     * 검사할 컬럼은 `valid.columns` 속성을 통해 설정됩니다.  
     */
    _execValid(): boolean;

    /**
     * AJAX 바인딩을 구현합니다.  
     * 서버와의 데이터 통신을 설정하고 요청을 처리합니다.  
     * 
     * @returns {Promise<void>} 비동기 작업의 완료를 나타내는 `Promise` 객체입니다.
     */
    _execBind(): Promise<void>;

    /**
     * AJAX 요청이 성공적으로 완료된 경우 호출됩니다.
     * 
     * @param result - 서버로부터 받은 결과 데이터
     * @param status - 요청 상태
     * @param xhr - `XMLHttpRequest` 객체
     */
    _ajaxSuccess(result: object, status: object, xhr: object): void;

    /**
     * AJAX 요청이 실패한 경우 호출됩니다.
     * 
     * @param xhr - `XMLHttpRequest` 객체
     * @param status - 요청 상태
     * @param error - 오류 정보
     */
    _execError(xhr: object, status: object, error: object): void;

    /**
     * AJAX 어댑터 패턴을 구현합니다.  
     * 웹 및 Node.js 환경에서 사용됩니다.  
     * 
     * @param setup - `axios` 설정 객체
     * @returns `axios` 호출 결과를 나타내는 `Promise` 객체입니다.
     * 
     */
    _ajaxCall(setup: object): Promise<void>;

    /**
     * 바인드 명령을 실행합니다.  
     * 유효성 검사, 바인딩, 결과 처리, 성공 및 오류 콜백을 포함한 전체 실행 프로세스를 수행합니다.  
     * 
     * @param outputOption - 출력 옵션 설정 : 0: 제외, 1: 존재하는 커럼의 로우만 가져오고, value 설정, 2: 모든 컬럼의 로우 가져옴, 3: 존재하는 컬럼의 로우만 가져옴
     * @param p_config axios 설정 객체 또는 url
     * @returns 실행 결과를 나타내는 `Promise` 객체입니다.
     */
    execute(outputOption?: OutputOption, config?: object | string): Promise<void>;

    /**
     * 바인드 명령을 실행합니다.  
     * 유효성 검사, 바인딩, 결과 처리, 성공 및 오류 콜백을 포함한 전체 실행 프로세스를 수행합니다.  
     * 
     * @param outputOption - 출력 옵션 설정 : 0: 제외, 1: 존재하는 커럼의 로우만 가져오고, value 설정, 2: 모든 컬럼의 로우 가져옴, 3: 존재하는 컬럼의 로우만 가져옴
     * @param p_config axios 설정 객체 또는 url
     * @returns 실행 결과를 나타내는 `Promise` 객체입니다.
     */
    exec(outputOption?: OutputOption, config?: object | string): Promise<void>;

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

} & BaseBindCommand;

export interface BindCommandConstructor {
    /**
     * 바인드 명령 AJAX 객체를 생성합니다.
     * 
     * @param BaseBindModel - 바인드 모델 객체
     * @param outputOpt - 출력 옵션
     * @param baseTable - 기본 테이블 객체
     */
    new (BaseBindModel: BaseBindModel, outputOpt: OutputOption, baseTable: MetaTable): BindCommand;
}

declare const BindCommand: BindCommandConstructor;

export default BindCommand;
export { BindCommand };