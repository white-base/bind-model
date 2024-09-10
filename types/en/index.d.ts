/// <reference path="T.d.ts" />

export * from 'logic-entity';

import BaseBind             from './base-bind';
import BindCommand          from './bind-command';
import BaseBindCommand      from './base-bind-command';
import BindModel            from './bind-model';
import BaseBindModel        from './base-bind-model';
import HTMLColumn           from './html-column';
import IModelCallback       from './i-model-callback';
import ICommandCallback     from './i-command-callback';
import IBindCommand         from './i-bind-command';
import IBaseBindModel       from './i-bind-model';
import IBind                from './i-bind';
import IServiceAjax         from './i-service-ajax';
import IService             from './i-service';

export {
    BaseBind,
    BindCommand,
    BaseBindCommand,
    BindModel,
    BaseBindModel,
    HTMLColumn,
    IModelCallback,
    ICommandCallback,
    IBindCommand,
    IBaseBindModel,
    IBind,
    IServiceAjax,
    IService,
};
export namespace Interface {
    var IModelCallback : IModelCallback;
    var ICommandCallback : ICommandCallback;
    var IBindCommand : IBindCommand;
    var IBaseBindModel : IBaseBindModel;
    var IBind : IBind;
    var IServiceAjax : IServiceAjax;
    var IService : IService;
}

export namespace Meta.Entity {
    var HTMLColumn : HTMLColumn;
}

export namespace Meta.Bind {
    var BindCommand : BindCommand;
    var BaseBindCommand : BaseBindCommand;
    var BindModel : BindModel;
    var BaseBindModel : BaseBindModel;
}