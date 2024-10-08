---
lang: en
title: "BindModel Class"
layout: single
permalink: /docs/api-bind-model/
date: 2024-08-14T1
toc: true
toc_sticky: true
sidebar:
  nav: "docs"

last_modified_at: 2024-10-01
# breadcrumbs: true
---
# the main structure
## Property Relationships

Create a BindModel object and create a Bind Command object in the *addCommmand()* method.
The generated 'command['identifier']' has MetaView with *valid, bind, and output* attribute values.
Ajax communication uses the 'axios' module internally.

Class diagram

![image-center](/assets/images/bind-rel-diagram-2024-08-16-002203.png){: .align-center}

## an inheritance relationship

You can either inherit and extend the BindModel or override the BindModel to customize it.

Class diagram

![image-center](/assets/images/bind-diagram-2024-08-16-002302.png){: .align-center}

# Components

## Properties

| Item | Description |
| ----------------------------------------------------- | -------------------------------------------------------- |
| baseConfig | Set binding default config |
| url | Set binding default config.url |
| \_tables | Meta-table collection. Manage multiple meta-tables. |
| [[52. BindModel Class-B#_columnType\|_columnType] | Set item type. |
| items | Item collection
| fn | collection of bound model functions. (Internal function + Exposure function) |
| command | collection of binding commands
| columns | Collection of columns. Represents the columns of the _baseTable. |
| first | The first dynamically generated meta table
| cbFail | Callback function called upon failure in inspection (valid) |
| cbError | Callback function called in case of error |
| cbBaseBegin | Default callback function before startup. <br> (used without cbBegin callback function) |
| cbBaseValid | Default callback function at inspection (valid) <br> (used without cbValid callback function) |
| cbBaseBind | Default callback function when bound. <br> (used without cbBind callback function) |
| cbBaseResult | Default callback function on the receipt of bind results. <br> (used without cbResult callback function) |
| cbBaseOutput | Output Default callback function.<br> (used without cbOutput callback function) |
| cbBaseEnd | Default callback function at execution completion. <br> (used without cbEnd callback function) |
| preRegister | callback function initially called upon init() call
| PreCheck | callback function that returns boolean on init() call.


## Method

| Item | Description |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Check Selector (collection?) | Examine the selector
| getSelector() | Get a list of destination selectors |
| addcommand (name, opt? , baseTable?) | add command
| setService(svc, chkType) | Set up a service
| Init() | Perform the initialization operation. Internally call 'preRegister()' -> 'preCheck()' -> 'preReady()'
| addTable(name) | Register the table
| addColumn (column, cmds? , views? , bTable?) | Add columns and map them with commands
| addColumnValue (name, value, cmds? , views? , bTable?) | Add columns and values, add them to the specified table, and register the reference to the column in the value, bind, output MetaView in Bindcommand. |
| setMapping (mapping: collection \ | object, bTable?) | Map columns
| getObject(): object | Gets the current object as a guid type object. (Circular reference is replaced by $ref value.) |
| setObject(obj, origin) | Set the serialization (guid type) object to the current object. (The object is initialized.) |
| equal(target) | Compare the current object with the specified object. |
| getTypes() | Returns the constructors of the current object and all the constructors of the prototype chain to the array. |
| instanceOf(target) | Verify that the current object is an instance of the specified type (with _UNION) |





## Events
| Item | Description |
| ---------- | ---------------------- |
| OnExecute | expecte() pre-execution event
| OnExecuted | expecte() post-execution event


# Detailed description

## Key Properties

### baseConfig

> Set the binding default config.

```ts
type baseConfig = object;
```


### url

> Set the binding default config.url.

```ts
type url = string;
```

### \_tables

> This is the meta table collection.
> Manage multiple meta tables.

```ts
type _tables = MetaTableCollection;
```

### \_columnType

> Set the column type.

```ts
type _columnType = MetaColumn;
```

### items

>It's an item collection.

```ts
type items = PropertyCollection;
```
### fn

> A collection of bound model functions. (Internal function + Exposure function)

```ts
type fn = PropertyCollection;
```

### command

> A collection of binding commands.

```ts
type command = PropertyCollection;
```

### cmd

> It's an alias for command.

```ts
type cmd = PropertyCollection;
```

### columns

> It's a column collection.
Indicates the column in > \_baseTable.

```ts
type columns = MetaTableColumnCollection;
```

### first

> This is the first dynamically generated meta table.
Reference value for > \_tables[0].

```ts
type first = MetaTable;
```

### cbFail

> This is the callback function that is called upon failure by valid.

```ts
type cbFail = (result: object, column: MetaColumn) => void;
```
- result : The object containing the result of the examination.
- column : 'MetaColumn' object used in the inspection.
### cbError

> This is the callback function that is called when an error occurs.

```ts
type cbError = (msg: string, status: object, response: object) => void;
```
- msg : Error message.
- status : The object containing status information.
- response —Response object.
### cbBaseBegin
> Default callback function before startup (used when cbBegin callback function is not present)

```ts
type cbBaseBegin = (command: BindCommand) => void;
```
- command : The current bind command object.
### cbBaseValid

> Default callback function at valid (used without cbValid callback function)

```ts
type cbBaseValid = (valid: MetaView, command: BindCommand) => boolean;
```
- valid : object 'MetaView' to be inspected.
- command : The current bind command object.
- return : A boolean value representing the result of the examination.

### cbBaseBind

> Default callback function when bound (used without cbBind callback function)

```ts
type cbBaseBind = (
	bind: MetaView, 
	command: BindCommand, 
	config: object
) => void;
```
- bind : object 'MetaView' to bind.
- command : The current bind command object.
- config : This is the setting object.

### cbBaseResult

> Default callback function when receiving bind results. (Used when cbResult callback function is not available)

```ts
type cbBaseResult = (
	data: object, 
	command: BindCommand, 
	response: object
) => object;
```
- data : Bind result data object.
- command : The current bind command object.
- response —Response object.
- return —Returns the processed result object.

### cbBaseOutput

> Output default callback function (used when cbOutput callback function is not present)

```ts
type cbBaseOutput = (
	outputs: MetaViewCollection, 
	command: BindCommand, 
	response: object
) => object;
```
- outputs : Metabiew collection.
- command : The current bind command object.
- response —Response object.
- return —Returns the processed result object.

### cbBaseEnd

> Default callback function at execution completion (used when cbEnd callback function is not present)

```ts
type cbBaseEnd = (
	status: object, 
	command: BindCommand, 
	response: object
) => void;
```
- status : The object containing status information.
- command : The current bind command object.
- response —Response object.

### preRegister

> This is the callback function that is initially called upon init().

```ts
type preRegister = (model: BindModel) => void;
```
- model : The current bound model object.

### preCheck

> Callback function that returns boolean on init() call.

```ts
type (model: BindModel)=>boolean;
```
- model : The current bound model object.
- return : A boolean value representing the result of the examination.

### preReady

> Callback function called when preCheck callback function result is true when invoking > init().

```ts
type preReady = (model: BindModel) => void;
```
- model : The current bound model object.

### \_baseTable

> Define the default entity.

```ts
type _baseTable = MetaTable;
```

### \_guid

> Unique identifier of the object (GUID). Uniquely identifies the object.

```ts
type _guid = string;
```

### \_type

> The generator function of the object, which was used when the object was created.

```ts
type _type = Function;
```

## Key Methods


### checkSelector()

> Examine the selector.

```ts
type checkSelector = (collection: BaseColumnCollection) => boolean;
```
- collection —Column collection to examine.
- return : A boolean value representing the result of the examination.

### getSelector()

> Obtain a list of destination selectors.

```ts
type getSelector = (collection: PropertyCollection) => object[];
```
- collection : A collection of properties to be examined; the default is items.
- return : An object array representing a list of selectors.

### addCommand()

> Add a command.

```ts
type addCommand = (
	name: string, 
	option: number, 
	baseTable: MetaTable
) => BindCommand;
```
- name : The name of the command.
- option : Output option.
- baseTable : (Optional) Default table object.
- return —Added bind command object.

### setService()

> Set up the service.

```ts
type setService = (service: IServiceAjax, passTypeChk: boolean) => void;
```
- service : service object.
- PassTypeChk : Whether the service object type inspection has passed or not. (Default: false)

### init()

> Perform the initialization operation.
> Internally, call 'preRegister()' -> 'preCheck()' -> 'preReady()'.

```ts
type init = () => void;
```

### addTable()

> Register the table.

```ts
type addTable = (name: string) => MetaTable;
```
- name : The name of the table to be registered.
- return : Returns the registered meta table object.

### addColumn()

> Add columns and map them to commands.

```ts
type addColumn = (
	column: MetaColumn, 
	cmds?: string | string[], 
	views?: string | string[], 
	bTable?: string | MetaTable
) => void;
```
- column: column object to be registered. It could be a string or 'MetaColumn' object.
- cmds : (Optional) Command to specify the location of the view; it can be a string or an array of strings.
- views —(Optional) Name of the view entity to be added; it can be a string or an array of strings.
- bTable : (Optional) Default table object or table name to be mapped.

### addColumnValue()

> Add columns and values, add them to the specified table, and register the reference to the column in the value, bind, and output MetaView in the Bindcommand.

```ts
type addColumnValue = (
	name: string, 
	value: any, 
	cmds?: string | string[], 
	views?: string | string[], 
	bTable?: string | MetaTable
) => void;
```
- name : The name of the column.
- value : The value of the column.
- cmds : Command to specify the location of the view; it can be a string or an array of strings.
- views : The name of the view entity to be added; it can be a string or array of strings.
- bTable : (Optional) Default table object or table name to be mapped.

### setMapping()

> Map columns.

```ts
type setMapping = (
	mapping: PropertyCollection | object, 
	baseTable?: string | MetaTable
) => void;
```
- mapping —Object or collection to map to MetaColumn
- baseTable —(Optional) Default table object or table name to be mapped.

### getObject()

> Obtain the current object as a guide type object.
> (Circular references are replaced by $ref values.)

```ts
type getObject = (vOpt?: number, owned?: object | Array<object>) => object;
```
- vOpt : Import option; default is 0.
	- opt=0: Reference structure (_guid:Yes, $ref:Yes)
	* opt=1: Redundant structure (_guid:Yes, $ref:Yes)
	* opt=2 : Non-tidal structure (_guid: No, $ref: No)
- aged : The parent objects that currently own the object. The default is an empty object.
- return —Returns serialized objects.

```js
a.getObject(2) == b.getObject(2)
```

### setObject()

> Set the Guid type object to the current object.
> (The object will be reset.)

```ts
type setObject = (oGuid: object, origin?: object) => void;
```
- oGuid : Object of the guid type to serialize.
- origin : This is the original object that sets the current object. The default is oGuid.

### equal()

> Compare the current object with the specified object.

```ts
type equal = (target: object) => boolean;
```
- return —Returns whether the two objects are identical.

### getTypes()

> Returns the creators of the current object and all the creators of the prototype chain to the array.

```ts
type getTypes = () => Array<Function>;
```
- return : Returns the array of generator functions.

```js
const types = obj.getTypes();
console.log(types); // [Function: MetaObject]
```
### instanceOf()

> Verify that the current object is an instance of the specified type (including _UNION)

```ts
type instanceOf = (target: object | string) => boolean;
```
- target : The type of object to be checked (object or string).
- return —Returns whether this is an instance of the specified type.


## Key Events

### onExecute

> Events that are called before the command is executed.

```ts
type onExecute = (cmd: BindCommand) => void;
```
- cmd : Command object to be executed.

### onExecuted

> An event that is called after the command is executed.

```ts
type onExecuted = (cmd: BindCommand, result: object) => void;
```
- cmd : Command object executed.
- result : The result object of the command execution.

