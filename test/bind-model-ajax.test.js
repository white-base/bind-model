/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
const { MetaRegistry }          = require('logic-entity');
const { BindModelAjax }         = require('../src/bind-model-ajax');
const { HTMLColumn }            = require('../src/html-column');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;

//==============================================================
// test
describe("[target: bind-model-ajax.js]", () => {
    describe("BindModelAjax :: 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
        });

        describe("BindModelAjax.BindModelAjax(): 생성자", () => {
            it("- 확인", () => {
                var bm = new BindModelAjax();
                expect(bm._columnType).toEqual(HTMLColumn)
            });
        });
        describe(" BindModelAjax static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BindModelAjax._UNION).toEqual([])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BindModelAjax._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BindModelAjax._PARAMS).toEqual(['$service'])
            });
        });
        describe("BindModel.baseAjaxSetup: 기본 ajax 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var ajax = {url: '', type: 'GET', dataType: 'json', async: true, crossDomain: false}
                
                expect(bm.baseAjaxSetup).toEqual(ajax);
            });
            it("- 변경 ", () => {
                var bm = new BindModelAjax();
                expect(()=>bm.baseAjaxSetup = {}).toThrow('getter')
            });
        });
        describe("BindModel.barUrl: 기본 ajax url 설정 ", () => {
            it("- 확인 ", () => {
                var bm = new BindModelAjax();
                var url = 'URL'
                bm.baseUrl = url

                expect(bm.baseAjaxSetup.url).toBe(url);
                expect(bm.baseUrl).toBe(url);
            });
            it("- 변경 ", () => {
                var bm = new BindModelAjax();
                expect(()=>bm.baseUrl = {}).toThrow('string')
                expect(()=>bm.baseUrl = '').toThrow('string')
            });
        });

        describe("MetaObject <- BaseBind <- BindModel : 상속 ", () => {

        });
    });
});
