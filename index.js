// const messageCode_core              = require('logic-entity').messageCode;
const ExtendError                   = require('logic-entity').ExtendError;
const Type                          = require('logic-entity').Type;
// const Util                          = require('logic-entity').Util;
const EventEmitter                  = require('logic-entity').EventEmitter;
const BaseCollection                = require('logic-entity').BaseCollection;
const ArrayCollection               = require('logic-entity').ArrayCollection;
const PropertyCollection            = require('logic-entity').PropertyCollection;
const MetaObject                    = require('logic-entity').MetaObject;
const MetaElement                   = require('logic-entity').MetaElement;
const MetaRegistry                  = require('logic-entity').MetaRegistry;
const NamespaceManager              = require('logic-entity').NamespaceManager;
const IObject                       = require('logic-entity').IObject;
const IMarshal                      = require('logic-entity').IMarshal;
const ICollection                   = require('logic-entity').ICollection;
const IPropertyCollection           = require('logic-entity').IPropertyCollection;
const IElement                      = require('logic-entity').IElement;
const IList                         = require('logic-entity').IList;
const IListControl                  = require('logic-entity').IListControl;
const ISerialize                    = require('logic-entity').ISerialize;
const IArrayCollection              = require('logic-entity').IArrayCollection;
// const messageCode_entity            = require('logic-entity').messageCode;
const IExportControl                = require('logic-entity').IExportControl;
const IGroupControl                 = require('logic-entity').IGroupControl;
const IImportControl                = require('logic-entity').IImportControl;
const ISchemaControl                = require('logic-entity').ISchemaControl;
const ITransaction                  = require('logic-entity').ITransaction;
const TransactionQueue              = require('logic-entity').TransactionQueue;
const TransactionCollection         = require('logic-entity').TransactionCollection;
const MetaRowCollection             = require('logic-entity').MetaRowCollection;
const MetaRow                       = require('logic-entity').MetaRow;
const BaseColumn                    = require('logic-entity').BaseColumn;
const MetaColumn                    = require('logic-entity').MetaColumn;
const ObjectColumn                  = require('logic-entity').ObjectColumn;
const BaseColumnCollection          = require('logic-entity').BaseColumnCollection;
const MetaViewColumnCollection      = require('logic-entity').MetaViewColumnCollection;
const MetaTableColumnCollection     = require('logic-entity').MetaTableColumnCollection;
const BaseEntity                    = require('logic-entity').BaseEntity;
const MetaTable                     = require('logic-entity').MetaTable;
const MetaTableCollection           = require('logic-entity').MetaTableCollection;
const MetaView                      = require('logic-entity').MetaView;
const MetaViewCollection            = require('logic-entity').MetaViewCollection;
const MetaSet                       = require('logic-entity').MetaSet
// ################# local export #################
// const messageCode_bind      = require('./src/message-code').messageCode;
require('./src/message-code');
const Message               = require('./src/message-wrap').Message;
const Util                  = require('./src/util-wrap').Util;
const IBind                 = require('./src/i-bind').IBind;
const IBindCommand          = require('./src/i-bind-command').IBindCommand;
const IBindModel            = require('./src/i-bind-model').IBindModel;
const ICommandCallback      = require('./src/i-command-callback').ICommandCallback;
const IModelCallback        = require('./src/i-model-callback').IModelCallback;
const IService              = require('./src/i-service').IService;
const IAjaxService          = require('./src/i-service-ajax').IAjaxService;
const HTMLColumn            = require('./src/html-column').HTMLColumn;
const BaseBind              = require('./src/base-bind').BaseBind;
const BaseBindCommand           = require('./src/base-bind-command').BaseBindCommand;
const BindCommand       = require('./src/bind-command').BindCommand;
const BaseBindModel             = require('./src/base-bind-model').BaseBindModel;
const BindModel         = require('./src/bind-model').BindModel;

// export default BindModel;
module.exports = {
    Util: Util,
    Type: Type,
    EventEmitter: EventEmitter,
    ExtendError: ExtendError,
    Message: Message,
    IObject: IObject,
    IMarshal: IMarshal,
    ICollection: ICollection,
    IPropertyCollection: IPropertyCollection,
    IElement: IElement,
    IList: IList,
    IListControl: IListControl,
    ISerialize: ISerialize,
    IArrayCollection: IArrayCollection,
    MetaObject: MetaObject,
    MetaElement: MetaElement,
    NamespaceManager: NamespaceManager,
    MetaRegistry: MetaRegistry,
    BaseCollection: BaseCollection,
    ArrayCollection: ArrayCollection,
    PropertyCollection: PropertyCollection,
    IExportControl: IExportControl,
    IGroupControl: IGroupControl,
    IImportControl: IImportControl,
    ISchemaControl: ISchemaControl,
    ITransaction: ITransaction,
    TransactionQueue: TransactionQueue,
    TransactionCollection: TransactionCollection,
    MetaRowCollection: MetaRowCollection,
    MetaRow: MetaRow,
    BaseColumn: BaseColumn,
    MetaColumn: MetaColumn,
    ObjectColumn: ObjectColumn,
    BaseColumnCollection: BaseColumnCollection,
    MetaViewColumnCollection: MetaViewColumnCollection,
    MetaTableColumnCollection: MetaTableColumnCollection,
    BaseEntity: BaseEntity,
    MetaTable: MetaTable,
    MetaTableCollection: MetaTableCollection,
    MetaView: MetaView,
    MetaViewCollection: MetaViewCollection,
    MetaSet: MetaSet,
    // ######### local #########
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
    BaseBindCommand: BaseBindCommand,
    BindCommand: BindCommand,
    BaseBindModel: BaseBindModel,
    BindModel: BindModel,
    BaseBind: BaseBind,
    // ---- namespace ------
    Common: {
        Util: Util,
        Type: Type,
        EventEmitter: EventEmitter,
        ExtendError: ExtendError,
        Message: Message,
    },
    Collection: {
        BaseCollection: BaseCollection,
        ArrayCollection: ArrayCollection,
        PropertyCollection: PropertyCollection,
        TransactionCollection: TransactionCollection,
        TransactionQueue: TransactionQueue,
    },
    Meta: {
        MetaObject: MetaObject,
        MetaElement: MetaElement,
        MetaRegistry: MetaRegistry,
        NamespaceManager: NamespaceManager,
        Entity: {
            BaseColumn: BaseColumn,
            BaseEntity: BaseEntity,
            BaseColumnCollection: BaseColumnCollection,
            MetaViewColumnCollection: MetaViewColumnCollection,
            MetaTableColumnCollection: MetaTableColumnCollection,
            TransactionCollection: TransactionCollection,
            MetaColumn: MetaColumn,
            MetaRow: MetaRow,
            MetaRowCollection: MetaRowCollection,
            MetaSet: MetaSet,
            MetaTable: MetaTable,
            MetaTableCollection: MetaTableCollection,
            MetaView: MetaView,
            MetaViewCollection: MetaViewCollection,
            // ######### local #########
            HTMLColumn: HTMLColumn,
        },
        Bind: {
            BaseBind: BaseBind,
            BaseBindCommand: BaseBindCommand,
            BindCommand: BindCommand,
            BaseBindModel: BaseBindModel,
            BindModel: BindModel,
            BaseBind: BaseBind,
        }  
    },
    Interface: {
        IObject: IObject,
        IMarshal: IMarshal,
        ICollection: ICollection,
        IPropertyCollection: IPropertyCollection,
        IElement: IElement,
        IList: IList,
        IListControl: IListControl,
        ISerialize: ISerialize,
        IArrayCollection: IArrayCollection,
        IExportControl: IExportControl,
        IGroupControl: IGroupControl,
        IImportControl: IImportControl,
        ISchemaControl: ISchemaControl,
        ITransaction: ITransaction,    
        // ######### local #########
        IBind: IBind,
        IBindCommand: IBindCommand,
        IBindModel: IBindModel,
        ICommandCallback: ICommandCallback,    
        IModelCallback: IModelCallback,    
        IService: IService,    
        IAjaxService: IAjaxService,    
        ICommandCallback: ICommandCallback,   
    },
    // messageCode: {
    //     core: messageCode_core,
    //     entity: messageCode_entity,
    //     // ######### local #########
    //     bind: messageCode_bind,
    // }
}