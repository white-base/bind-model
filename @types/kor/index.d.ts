// outter module
import ExtendError          = require("logic-core/extend-error");
import Observer             = require("logic-core/observer");
import Util                 = require("logic-core/util");
import Type                 = require("logic-core/type");
import Message              = require("logic-core/message");

import IObject              = require("logic-core/i-object");
import IMarshal             = require("logic-core/i-marshal");
import ICollection          = require("logic-core/i-collection");
import IPropertyCollection  = require("logic-core/i-collection-property");
import IElement             = require("logic-core/i-element");
import IList                = require("logic-core/i-list");
import IListControl         = require("logic-core/i-control-list");
import ISerialize           = require("logic-core/i-serialize");
import IArrayCollection     = require("logic-core/i-collction-array");

import NamespaceManager     = require("logic-core/namespace-manager");
import MetaRegistry         = require("logic-core/meta-registry");
import MetaObject           = require("logic-core/meta-object");
import MetaElement          = require("logic-core/meta-element");

import BaseCollection       = require("logic-core/base-collection");
import ArrayCollection      = require("logic-core/collection-array");
import PropertyCollection   = require("logic-core/collection-property");

import T                    = require("logic-core/T");

// local modlue
import BaseColumn           = require("logic-entity/base-column");
import BaseEntity           = require("logic-entity/base-entity");
import BaseColumnCollection = require("logic-entity/collection-column");
import TransactionCollection= require("logic-entity/collection-transaction");
import IExportControl       = require("logic-entity/i-control-export");
import IGroupControl        = require("logic-entity/i-control-group");
import IImportControl       = require("logic-entity/i-control-import");
import ISchemaControl       = require("logic-entity/i-control-schema");
import ITransaction         = require("logic-entity/i-transaction");
import MetaColumn           = require("logic-entity/meta-column");
import MetaRow              = require("logic-entity/meta-row");
import MetaSet              = require("logic-entity/meta-set");
import MetaTable            = require("logic-entity/meta-table");
import MetaView             = require("logic-entity/meta-view");
import ObjectColumn         = require("logic-entity/object-column");
import TransactionQueue     = require("logic-entity/trans-queue");


// local modlue
import BaseBind             = require("./base-bind");
import BindCommandAjax      = require("./bind-command-ajax");
import BindCommand          = require("./bind-command");
import BindModelAjax        = require("./bind-model-ajax");
import BindModel            = require("./bind-model");
import HTMLColumn           = require("./html-column");
import IBindCallback        = require("./i-bind-callback");
import IBindCommandCallback = require("./i-bind-command-callback");
import IBindCommand         = require("./i-bind-command");
import IBindModel           = require("./i-bind-model");
import IBind                = require("./i-bind");
import IServiceAjax         = require("./i-service-ajax");
import IService             = require("./i-service");

// local
export {
    BaseBind,
    BindCommandAjax,
    BindCommand,
    BindModelAjax,
    BindModel,
    HTMLColumn,
    IBindCallback,
    IBindCommandCallback,
    IBindCommand,
    IBindModel,
    IBind,
    IServiceAjax,
    IService
};

export {
    BaseColumn,
    BaseEntity,
    BaseColumnCollection,
    TransactionCollection,
    IExportControl,
    IGroupControl,
    IImportControl,
    ISchemaControl,
    ITransaction,
    MetaColumn,
    MetaRow,
    MetaSet,
    MetaTable,
    MetaView,
    ObjectColumn,
    TransactionQueue
};

export {
    T,
    ExtendError,
    Observer,
    Util,
    Type,
    Message,
    IObject,
    IMarshal,
    ICollection,
    IPropertyCollection,
    IElement,
    IList,
    IListControl,
    ISerialize,
    IArrayCollection,
    NamespaceManager,
    MetaRegistry,
    MetaObject,
    MetaElement,
    BaseCollection,
    ArrayCollection,
    PropertyCollection
};
export namespace Common {
    /** Util 네임스페이스 TODO: */
    let Util;
    /** Type 네임스페이스 TODO: */
    let Type;
}
export namespace Interface {
    var IObject : IObject;
    var IMarshal : IMarshal;
    var ICollection : ICollection;
    var IPropertyCollection : IPropertyCollection;
    var IElement : IElement;
    var IList : IList;
    var IListControl : IListControl;
    var ISerialize : ISerialize;
    var IArrayCollection : IArrayCollection;
    var IExportControl : IExportControl;
    var IGroupControl : IGroupControl;
    var IImportControl : IImportControl;
    var ISchemaControl : ISchemaControl;
    var ITransaction : ITransaction;
    // local
    var IBindCallback : IBindCallback;
    var IBindCommandCallback : IBindCommandCallback;
    var IBindCommand : IBindCommand;
    var IBindModel : IBindModel;
    var IBind : IBind;
    var IServiceAjax : IServiceAjax;
    var IService : IService;
}
export namespace Meta {
    var NamespaceManager : NamespaceManager;
    var MetaRegistry : MetaRegistry;
    var MetaObject : MetaObject;
    var MetaElement : MetaElement;
}
export namespace Meta.Entity {
    var BaseBind : BaseBind;
    var BaseEntity : BaseEntity;
    var BaseColumnCollection : BaseColumnCollection;
    var MetaColumn : MetaColumn;
    var MetaRow : MetaRow;
    var MetaSet : MetaSet;
    var MetaTable : MetaTable;
    var MetaView : MetaView;
    var ObjectColumn : ObjectColumn;
    // local
    var BaseColumn : BaseColumn;
}

export namespace Meta.Bind {
    var BindCommandAjax : BindCommandAjax;
    var BindCommand : BindCommand;
    var BindModelAjax : BindModelAjax;
    var BindModel : BindModel;
    var HTMLColumn : HTMLColumn;
}

export namespace Collection {
    var BaseCollection : BaseCollection;
    var ArrayCollection : ArrayCollection;
    var PropertyCollection : PropertyCollection;
    // local
    var TransactionCollection : TransactionCollection;
    var TransactionQueue : TransactionQueue;
}