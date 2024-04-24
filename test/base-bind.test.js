/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';
const { MetaObject }            = require('logic-entity');
const { MetaTable }             = require('logic-entity');
const { MetaRegistry }          = require('logic-entity');
const { BaseBind }              = require('../src/base-bind');
const { IBind }                 = require('../src/i-bind');

var SubBaseBind;

//==============================================================
// test


describe("[target: base-bind.js]", () => {
    describe("BaseBind :: 추상 클래스", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();

            SubBaseBind = class SubBaseBind extends BaseBind {
                constructor() {
                    super();
                }
            }
        });
        describe("BaseBind.BaseBind() : 생성자", () => {
            it("- 예외 : 추상클래스 생성 ", () => {
                expect(()=> new BaseBind()).toThrow('EL03111')
            });
            it("- 예외 : 추상클래스 생성 ", () => {
                var b1 = new SubBaseBind();
                expect(typeof b1).toBe('object')
            });
        });
        describe(" BaseBind static 타입  ", () => {
            it("- _UNION : 인터페이스 타입 ", () => {
                expect(BaseBind._UNION).toEqual([IBind])
            });
            it("- _NS : 인터페이스 타입 ", () => {
                expect(BaseBind._NS).toEqual('Meta.Bind')
            });
            it("- _PARAMS : 인터페이스 타입 ", () => {
                expect(BaseBind._PARAMS).toEqual([])
            });
            it("- _KIND : 인터페이스 타입 ", () => {
                expect(BaseBind._KIND).toEqual('abstract')
            });
        });
        describe("BaseBind.$KEYWORD: 키워드", () => {
            it("- 등록 조회 ", () => {
                var b1 = new SubBaseBind();
                b1.$KEYWORD = 'NEW';

                expect(b1.$KEYWORD.indexOf('NEW')> -1).toBe(true)
            });
            it("- 기존키 조회 ", () => {
                var b1 = new SubBaseBind();
                // MetaObject
                expect(b1.$KEYWORD.indexOf('equal')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('instanceOf')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('getTypes')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('_guid')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('_type')> -1).toBe(true)
                // BaseBind
                expect(b1.$KEYWORD.indexOf('$event')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('$KEYWORD')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('_baseTable')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('onExecute')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('onExecuted')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('_onExecute')> -1).toBe(true)
                expect(b1.$KEYWORD.indexOf('_onExecuted')> -1).toBe(true)
                // ETC
                expect(b1.$KEYWORD.indexOf('ETC')> -1).toBe(false)
            });
        });
        describe("BaseBind._baseTable: 기본 엔티티", () => {
            it("- 확인 ", () => {
                var b1 = new SubBaseBind();
                expect(b1._baseTable).toBe(null)
            });
        });
        describe("BaseBind.onExecute: 실행 전 이벤트", () => {
            it("- 확인 ", () => {
                var b1 = new SubBaseBind();
                var fun = (aa)=>true;
                b1.onExecute = fun

                expect(b1.$event._list.length).toBe(1)
            });
            it("- 예외 ", () => {
                var b1 = new SubBaseBind();
                var fun = (aa)=>true;
                b1.onExecute = fun

                expect(()=> b1.onExecute = {}).toThrow('function')
            });
        });
        describe("BaseBind.onExecuted: 실행 후 이벤트", () => {
            it("- 확인 ", () => {
                var b1 = new SubBaseBind();
                var fun = (aa)=>true;
                b1.onExecuted = fun

                expect(b1.$event._list.length).toBe(1)
            });
            it("- 예외 ", () => {
                var b1 = new SubBaseBind();
                var fun = (aa)=>true;
                b1.onExecuted = fun

                expect(()=> b1.onExecuted = {}).toThrow('function')
            });
        });
        describe("BaseBind.addColumn(bindCommnad): 컬럼 추가 ", () => {
            it("- 추상 메소드 호출 ", () => {
                var b1 = new SubBaseBind();
                expect(()=> b1.addColumn()).toThrow('addColumn')
            });
        });
        describe("MetaObject : 상속 ", () => {
        
            describe("MetaObject._guid : GUID ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBaseBind();
                    expect(b1._guid.length > 1).toBe(true)
                });
            });
            describe("MetaObject._type : 생성자 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBaseBind();
                    expect(b1._type === SubBaseBind).toBe(true)
                });
            });
            describe("MetaObject.eqaul() : 비교 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBaseBind();
                    var b2 = new SubBaseBind();
                    var t1 = new MetaTable('t1');
    
                    expect(b1.equal(b2)).toBe(true)
                    expect(b1.equal(t1)).toBe(false)
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBaseBind();
                    expect(b1.getTypes()).toEqual([SubBaseBind, BaseBind, MetaObject, Object])
                });
            });
            describe("MetaObject.getTypes() : 비교 ", () => {
                it("- 확인 ", () => {
                    var b1 = new SubBaseBind();
    
                    expect(b1.instanceOf('SubBaseBind')).toBe(true)
                    expect(b1.instanceOf('BaseBind')).toBe(true)
                    expect(b1.instanceOf('MetaObject')).toBe(true)
                    expect(b1.instanceOf('Object')).toBe(true)
                    expect(b1.instanceOf('MetaTable')).toBe(false)
                    expect(b1.instanceOf(SubBaseBind)).toBe(true)
                    expect(b1.instanceOf(BaseBind)).toBe(true)
                    expect(b1.instanceOf(MetaObject)).toBe(true)
                    expect(b1.instanceOf(Object)).toBe(true)
                    expect(b1.instanceOf(MetaTable)).toBe(false)
                });
            });
            describe("MetaObject.getObject() : 객체 얻기 ", () => {
                it("- 확인 ", () => {
                    var fun1 = (aa)=>{}
                    var b1 = new SubBaseBind();
                    var obj1  = b1.getObject()
                    b1.onExecute = fun1

                    expect(obj1._type).toBe("Meta.Bind.SubBaseBind")
                    expect(typeof obj1._guid).toBe('string')
                    expect(obj1._guid.length > 0).toBe(true)
                });
            });
            describe("MetaObject.setObject() : 객체 설정 ", () => {
                it("- 확인 ", () => {
                    var fun1 = (aa)=>{}
                    var b1 = new SubBaseBind()
                    var t1 = new MetaTable('b1');
                    b1.onExecute = fun1
                    b1._baseTable = t1;
                    var obj1  = b1.getObject()
                    var b2 = new SubBaseBind();
                    b2.setObject(obj1);

                    expect(b1.equal(b2)).toBe(true)
                    expect(b1.$event._list.length).toBe(1)
                    expect(b2.$event._list.length).toBe(1)
                });
            });
        });

    });
});
