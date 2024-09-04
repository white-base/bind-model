import {PropertyCollection}     from 'logic-entity';
import {BaseColumnCollection}   from 'logic-entity';
import {MetaTable}              from 'logic-entity';
import BaseBindModel            from './base-bind-model';
import IServiceAjax             from './i-service-ajax';
import BaseBindCommand          from './base-bind-command';

/**
 * 바인드모델 Ajax 클래스
 * 이 클래스는 BaseBindModel을 상속하며, Ajax 통신을 위한 기능을 추가로 제공합니다.
 */
declare class BindModel extends BaseBindModel {

    /**
     * `BindModel` 생성자입니다.
     * 
     * @param {IServiceAjax} service - Ajax 서비스를 제공하는 객체입니다.
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
     * @param {BaseColumnCollection} collection - 검사할 컬럼 컬렉션입니다.
     * @returns {boolean} 검사 결과를 나타내는 boolean 값입니다.
     */
    checkSelector(collection: BaseColumnCollection): boolean;

    /**
     * 대상 셀렐터 목록을 얻습니다.
     * 
     * @param {PropertyCollection} [collection=items] - 검사할 속성 컬렉션입니다. 기본값은 items 입니다.
     * @returns {object[]} 셀렉터 목록을 나타내는 객체 배열입니다.
     */
    getSelector(collection: PropertyCollection): object[];

    /**
     * 명령을 추가합니다.
     * 
     * @param {string} name - 명령 이름입니다.
     * @param {number} option - 출력옵션입니다.
     * @param {MetaTable} [baseTable] - (선택적) 기본 테이블 객체입니다.
     * @returns {BaseBindCommand} 추가된 바인드 명령 객체입니다.
     */
    addCommand(name: string, option: number, baseTable: MetaTable): BaseBindCommand;

    /**
     * 서비스를 설정합니다.
     * 
     * @param {IServiceAjax} service - 서비스 객체입니다.
     * @param {boolean} [isRead=true] - 서비스 내의 prop를 item으로 로딩할지 여부를 나타내는 boolean 값입니다.
     */
    setService(service: IServiceAjax, isRead: boolean): void;

}

export = BindModel;