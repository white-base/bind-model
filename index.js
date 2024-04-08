/**
 * ES5, CJS, NS
 */
const IBind                 = require('./src/i-bind').IBind;
const IBindCommand          = require('./src/i-bind-command').IBindCommand;
const IBindModel            = require('./src/i-bind-model').IBindModel;
const ICommandCallback      = require('./src/i-command-callback').ICommandCallback;
const IModelCallback        = require('./src/i-model-callback').IModelCallback;
const IService              = require('./src/i-service').IService;
const IAjaxService          = require('./src/i-service-ajax').IAjaxService;
const HTMLColumn            = require('./src/html-column').HTMLColumn;
const BaseBind              = require('./src/base-bind').BaseBind;
const BindCommand           = require('./src/bind-command').BindCommand;
const BindCommandAjax       = require('./src/bind-command-ajax').BindCommandAjax;
const BindModel             = require('./src/bind-model').BindModel;
const BindModelAjax         = require('./src/bind-model-ajax').BindModelAjax;
const Util                  = require('./src/util');

module.exports = {
    Util: Util,
    IBind: IBind,
    IBindCommand: IBindCommand,
    IBindModel: IBindModel,
    ICommandCallback: ICommandCallback,    
    IModelCallback: IModelCallback,    
    IService: IService,    
    IAjaxService: IAjaxService,    
    ICommandCallback: ICommandCallback,  
    HTMLColumn: HTMLColumn,
    BaseBind: BaseBind,
    BindCommand: BindCommand,
    BindCommandAjax: BindCommandAjax,
    BindModel: BindModel,
    BindModelAjax: BindModelAjax,
    BaseBind: BaseBind,
    // namespace
    Common: {
        Util: Util,
    },
    Meta: {
        Entity: {
            HTMLColumn: HTMLColumn,
        },
        Bind: {
            BaseBind: BaseBind,
            BindCommand: BindCommand,
            BindCommandAjax: BindCommandAjax,
            BindModel: BindModel,
            BindModelAjax: BindModelAjax,
            BaseBind: BaseBind,
        }        
    },
    Interface: {
        IBind: IBind,
        IBindCommand: IBindCommand,
        IBindModel: IBindModel,
        ICommandCallback: ICommandCallback,    
        IModelCallback: IModelCallback,    
        IService: IService,    
        IAjaxService: IAjaxService,    
        ICommandCallback: ICommandCallback,    
    },
}