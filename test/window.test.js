/**
 * @jest-environment jsdom
 */
/**
 * ES6 + CJS + JEST
 */
//==============================================================
// gobal defined
'use strict';

//==============================================================
// test
describe("[L.*]", () => {
    describe("[Interface.*]", () => {
        describe("i-bind-command.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/i-bind-command.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/i-bind-command.js')).toThrow(/ExtendError/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-bind-command.js');
        
                expect(global._L.IBindCommand).toBeDefined();
                expect(global._L.Interface.IBindCommand).toBeDefined();
            });
        });
        describe("i-bind-model.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/i-bind-model.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/i-bind-model.js')).toThrow(/ExtendError/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-bind-model.js');
        
                expect(global._L.IBindModel).toBeDefined();
                expect(global._L.Interface.IBindModel).toBeDefined();
            });
        });
        describe("i-bind.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/i-bind.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/i-bind.js')).toThrow(/ExtendError/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-bind.js');
        
                expect(global._L.IBind).toBeDefined();
                expect(global._L.Interface.IBind).toBeDefined();
            });
        });
        describe("i-command-callback.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/i-command-callback.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/i-command-callback.js')).toThrow(/ExtendError/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-command-callback.js');
        
                expect(global._L.ICommandCallback).toBeDefined();
                expect(global._L.Interface.ICommandCallback).toBeDefined();
            });
        });
        describe("i-model-callback.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/i-model-callback.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/i-model-callback.js')).toThrow(/ExtendError/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-model-callback.js');
        
                expect(global._L.IModelCallback).toBeDefined();
                expect(global._L.Interface.IModelCallback).toBeDefined();
            });
        });
        describe("i-service-ajax.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/i-service-ajax.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/i-service-ajax.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/i-service-ajax.js')).toThrow(/Util/);
            });
            it("- 예외 : IService 로딩이 인된경우", () => {
                require('logic-entity');

                expect(() => require('../src/i-service-ajax.js')).toThrow(/IService/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/util.js');
                require('../src/i-bind-model.js');
                require('../src/i-model-callback.js');
                require('../src/i-service.js');
                require('../src/i-service-ajax.js');
        
                expect(global._L.IAjaxService).toBeDefined();
                expect(global._L.Interface.IAjaxService).toBeDefined();
            });
        });
        describe("i-service.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/i-service.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/i-service.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/i-service.js')).toThrow(/Util/);
            });
            it("- 예외 : IBindModel 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/util.js');

                expect(() => require('../src/i-service.js')).toThrow(/IBindModel/);
            });
            it("- 예외 : IModelCallback 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/util.js');
                require('../src/i-bind-model.js');

                expect(() => require('../src/i-service.js')).toThrow(/IModelCallback/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/util.js');
                require('../src/i-bind-model.js');
                require('../src/i-model-callback.js');
                require('../src/i-service.js');
        
                expect(global._L.IService).toBeDefined();
                expect(global._L.Interface.IService).toBeDefined();
            });
        });
    });
    describe("[Meta.Entity.*]", () => {
        describe("html-column.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/html-column.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/html-column.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/html-column.js')).toThrow(/Util/);
            });
            it("- 예외 : MetaColumn 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaColumn;

                expect(() => require('../src/html-column.js')).toThrow(/MetaColumn/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/html-column.js')

                expect(global._L.HTMLColumn).toBeDefined();
                expect(global._L.Meta.Entity.HTMLColumn).toBeDefined();
            });
        });
    })
    describe("[Common.*]", () => {
        describe("util.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/util.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/util.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/util.js')).toThrow(/Util/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/util.js')

                expect(global._L.Util).toBeDefined();
                expect(global._L.Common.Util).toBeDefined();
            });
        });
    })
    describe("[Meta.Bind.*]", () => {
        describe("base-bind.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/base-bind.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/base-bind.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Type 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Type;

                expect(() => require('../src/base-bind.js')).toThrow(/Type/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/base-bind.js')).toThrow(/Util/);
            });
            it("- 예외 : Observer 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Observer;

                expect(() => require('../src/base-bind.js')).toThrow(/Observer/);
            });
            it("- 예외 : MetaRegistry 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaRegistry;

                expect(() => require('../src/base-bind.js')).toThrow(/MetaRegistry/);
            });
            it("- 예외 : MetaObject 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaObject;

                expect(() => require('../src/base-bind.js')).toThrow(/MetaObject/);
            });
            it("- 예외 : MetaTable 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaTable;

                expect(() => require('../src/base-bind.js')).toThrow(/MetaTable/);
            });
            
            it("- 예외 : IBind 로딩이 인된경우", () => {
                require('logic-entity');

                expect(() => require('../src/base-bind.js')).toThrow(/IBind/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-bind.js')
                require('../src/base-bind.js')

                expect(global._L.Util).toBeDefined();
                expect(global._L.Common.Util).toBeDefined();
            });

        });
        describe("bind-model.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/bind-model.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/bind-model.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Type 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Type;

                expect(() => require('../src/bind-model.js')).toThrow(/Type/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/bind-model.js')).toThrow(/Util/);
            });
            it("- 예외 : MetaRegistry 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaRegistry;

                expect(() => require('../src/bind-model.js')).toThrow(/MetaRegistry/);
            });
            it("- 예외 : MetaObject 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaObject;

                expect(() => require('../src/bind-model.js')).toThrow(/MetaObject/);
            });
            it("- 예외 : MetaColumn 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaColumn;

                expect(() => require('../src/bind-model.js')).toThrow(/MetaColumn/);
            });
            it("- 예외 : BaseEntity 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.BaseEntity;

                expect(() => require('../src/bind-model.js')).toThrow(/BaseEntity/);
            });
            it("- 예외 : PropertyCollection 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.PropertyCollection;

                expect(() => require('../src/bind-model.js')).toThrow(/PropertyCollection/);
            });
            it("- 예외 : MetaTable 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaTable;

                expect(() => require('../src/bind-model.js')).toThrow(/MetaTable/);
            });
            it("- 예외 : MetaTableCollection 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaTableCollection;

                expect(() => require('../src/bind-model.js')).toThrow(/MetaTableCollection/);
            });
            it("- 예외 : IBindModel 로딩이 인된경우", () => {
                require('logic-entity');

                expect(() => require('../src/bind-model.js')).toThrow(/IBindModel/);
            });
            it("- 예외 : IBindModel 로딩이 인된경우", () => {
                require('logic-entity');

                expect(() => require('../src/bind-model.js')).toThrow(/IBindModel/);
            });
            it("- 예외 : IModelCallback 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')

                expect(() => require('../src/bind-model.js')).toThrow(/IModelCallback/);
            });
            it("- 예외 : IService 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')
                require('../src/i-model-callback.js')

                expect(() => require('../src/bind-model.js')).toThrow(/IService/);
            });
            it("- 예외 : BaseBind 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')
                require('../src/i-model-callback.js')
                require('../src/i-service.js')

                expect(() => require('../src/bind-model.js')).toThrow(/BaseBind/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')
                require('../src/i-model-callback.js')
                require('../src/i-service.js')

                require('../src/i-bind.js')
                require('../src/base-bind.js')
                
                require('../src/bind-model.js')

                expect(global._L.BindModel).toBeDefined();
                expect(global._L.Meta.Bind.BindModel).toBeDefined();
            });
        });
        describe("bind-command.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/bind-command.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/bind-command.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Type 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Type;

                expect(() => require('../src/bind-command.js')).toThrow(/Type/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/bind-command.js')).toThrow(/Util/);
            });
            it("- 예외 : MetaRegistry 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaRegistry;

                expect(() => require('../src/bind-command.js')).toThrow(/MetaRegistry/);
            });
            it("- 예외 : MetaObject 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaObject;

                expect(() => require('../src/bind-command.js')).toThrow(/MetaObject/);
            });
            it("- 예외 : MetaColumn 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaColumn;

                expect(() => require('../src/bind-command.js')).toThrow(/MetaColumn/);
            });
            it("- 예외 : BaseEntity 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.BaseEntity;

                expect(() => require('../src/bind-command.js')).toThrow(/BaseEntity/);
            });
            it("- 예외 : MetaTable 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaTable;

                expect(() => require('../src/bind-command.js')).toThrow(/MetaTable/);
            });
            it("- 예외 : MetaView 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaView;

                expect(() => require('../src/bind-command.js')).toThrow(/MetaView/);
            });
            it("- 예외 : MetaViewCollection 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.MetaViewCollection;

                expect(() => require('../src/bind-command.js')).toThrow(/MetaViewCollection/);
            });
            it("- 예외 : IBindCommand 로딩이 인된경우", () => {
                require('logic-entity');

                expect(() => require('../src/bind-command.js')).toThrow(/IBindCommand/);
            });
            // it("- 예외 : IBindModel 로딩이 인된경우", () => {
            //     require('logic-entity');

            //     expect(() => require('../src/bind-command.js')).toThrow(/IBindModel/);
            // });
            it("- 예외 : ICommandCallback 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/i-bind-command.js')

                expect(() => require('../src/bind-command.js')).toThrow(/ICommandCallback/);
            });
            it("- 예외 : BaseBind 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/i-bind-command.js')
                require('../src/i-command-callback.js')

                expect(() => require('../src/bind-command.js')).toThrow(/BaseBind/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')
                require('../src/i-command-callback.js')
                
                require('../src/i-model-callback.js')
                require('../src/i-service.js')
                require('../src/i-bind.js')
                require('../src/i-bind-command.js')
                require('../src/base-bind.js')
                require('../src/bind-command.js')

                expect(global._L.BindCommand).toBeDefined();
                expect(global._L.Meta.Bind.BindCommand).toBeDefined();
            });
        });
        describe("bind-model-ajax.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/bind-model-ajax.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;

                expect(() => require('../src/bind-model-ajax.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Type 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Type;

                expect(() => require('../src/bind-model-ajax.js')).toThrow(/Type/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;

                expect(() => require('../src/bind-model-ajax.js')).toThrow(/Util/);
            });
            it("- 예외 : PropertyCollection 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.PropertyCollection;

                expect(() => require('../src/bind-model-ajax.js')).toThrow(/PropertyCollection/);
            });
            it("- 예외 : IAjaxService 로딩이 인된경우", () => {
                require('logic-entity');

                expect(() => require('../src/bind-model-ajax.js')).toThrow(/IAjaxService/);
            });
            it("- 예외 : BindModel 로딩이 인된경우", () => {
                require('logic-entity');
                
                require('../src/i-bind-model.js')
                require('../src/i-model-callback.js')
                require('../src/i-service.js')
                require('../src/i-service-ajax.js')

                expect(() => require('../src/bind-model-ajax.js')).toThrow(/BindModel/);
            });
            it("- 예외 : HTMLColumn 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')
                require('../src/i-model-callback.js')
                require('../src/i-service.js')
                require('../src/i-service-ajax.js')
                
                require('../src/i-bind.js')
                require('../src/i-bind-command.js')
                require('../src/i-command-callback.js')
                require('../src/base-bind.js')
                require('../src/bind-model.js')

                expect(() => require('../src/bind-model-ajax')).toThrow(/HTMLColumn/);
            });
            it("- 예외 : BindCommandAjax 로딩이 인된경우", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')
                require('../src/i-model-callback.js')
                require('../src/i-service.js')
                require('../src/i-service-ajax.js')
                
                require('../src/i-bind.js')
                require('../src/i-bind-command.js')
                require('../src/i-command-callback.js')
                require('../src/base-bind.js')
                require('../src/bind-model.js')

                require('../src/html-column.js')

                expect(() => require('../src/bind-model-ajax.js')).toThrow(/BindCommandAjax/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                require('../src/i-bind-model.js')
                require('../src/i-model-callback.js')
                require('../src/i-service.js')
                require('../src/i-service-ajax.js')
                
                require('../src/i-bind.js')
                require('../src/i-bind-command.js')
                require('../src/i-command-callback.js')
                require('../src/base-bind.js')
                require('../src/bind-model.js')

                require('../src/html-column.js')
                
                require('../src/bind-command.js') 
                global.$ = require('jquery');
                require('../src/bind-command-ajax.js') 
                require('../src/bind-model-ajax.js') 

                expect(global._L.BindModelAjax).toBeDefined();
                expect(global._L.Meta.Bind.BindModelAjax).toBeDefined();
            });
        });
        describe("bind-command-ajax.js", () => {
            beforeEach(() => {
                jest.resetModules();
                global._L = null;
            });
            it("- 예외 : 전체 로딩이 인된경우", () => {
                expect(() => require('../src/bind-command-ajax.js')).toThrow(/Cannot read properties/);
            })
            it("- 예외 : ExtendError 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.ExtendError;
                global.$ = require('jquery');

                expect(() => require('../src/bind-command-ajax.js')).toThrow(/ExtendError/);
            });
            it("- 예외 : Util 로딩이 인된경우", () => {
                require('logic-entity');
                delete global._L.Util;
                global.$ = require('jquery');

                expect(() => require('../src/bind-command-ajax.js')).toThrow(/Util/);
            });
            it("- 예외 : BindCommand 로딩이 인된경우", () => {
                require('logic-entity');
                global.$ = require('jquery');
                
                expect(() => require('../src/bind-command-ajax.js')).toThrow(/BindCommand/);
            });
            it("- 로딩 성공 ", () => {
                require('logic-entity');
                
                require('../src/i-bind.js')
                require('../src/i-bind-command.js')
                require('../src/i-command-callback.js')
                require('../src/base-bind.js')
                
                require('../src/bind-command.js') 
                global.$ = require('jquery');
                require('../src/bind-command-ajax.js') 

                expect(global._L.BindCommandAjax).toBeDefined();
                expect(global._L.Meta.Bind.BindCommandAjax).toBeDefined();
            });
        });
    });
});
