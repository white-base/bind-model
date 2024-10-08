---
lang: en
title: "BindCommand Class"
layout: single
permalink: /docs/api-bind-command/
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

The Bindcommand object contains MetaView with *valid, bind, and output* properties.
The 'output' property refers to the property 'output1' of the object in '_outputs' (MetaViewCollection).
You can add a view through the newOutput(name?) method, "output + sequential" to "_outputs"
The collection is added as a name.

Class diagram

![image-center](/assets/images/cmd-rel-diagram-2024-08-16-002011.png){: .align-center}

## an inheritance relationship

You can either inherit and extend Bindcommand or override Bindcommand to customize it.

![image-center](/assets/images/cmd-diagram-2024-08-16-004352.png){: .align-center}


# Components

## Properties

| Item | Description |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config | same as axios config |
| url | url path |
| \_outputs | '_outputs' MetaView collection property |
| \_model | '_model' BindModel object |
| valid | MetaView for inspection |
| bind | bind MetaView
| output | default output MetaView.See <br>\_outputs[0] object |
| Output Option | Output option. (Default = 0)<br>- 0: No view<br>-1: Import all columns and rows<br>- 2: Import the rows of existing columns<br>- 3: Import the rows of existing columns, set to value in the nth letter |
| cbBegin | execute() start callback.<br>'callback(bindComand)' |
| cbValid      | execute() valid 검사 전 콜백 입니다.<br>`callback(validView, bindComamnd)`                                                                                         |
| cbBind       | execute() bind  전 콜백 입니다.<br>`callback(validView, bindComamnd, config)`                                                                                    |
| cbResult     | execute() 회신  콜백 입니다.<br>`callback(data, bindComamnd, response)`                                                                                           |
| cbOutput     | execute() output View 매칭 후  콜백 입니다.<br>`callback(views, bindComamnd, response)`                                                                           |
| cbEnd        | execute() 종료 콜백 입니다.<br>`callback(status, bindComamnd, response)`                                                                                          |
| _guid | Unique identifier of the object (GUID). Uniquely identifies the object.


## Method

| Item | Description |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| execute(): Promise                          | 순서 :  `_execBegin()` >> `_execValid()` >> `_execBind()` >> `_execResult()` >> `_execOutput()` >> `_execEnd()` |
| addColumn(column, views, bTable?) | Add a column, add it to the specified table, and register the reference of the column to the valid, bind, output MetaView in Bindcommand. |
| addColumnValue (name, value, views, bTable?) | Add a column and value with the specified name, and register the reference of the column with the value, bind, output MetaView in Bindcommand. |
| setColumn (names, views, bTable?) | Sets the column of the meta table to the specified MetaView |
| release(names) | Remove the specified column from the destination MetView |
| add MetaView to the newOutput(name?) | '_output' MetaViewCollection.<br>* - default name = 'output' + _out.count |
| removeOutput(name)                          | `_output` MetaViewCollection 에 MetaView 을 제거합니다.                                                              |
| getObject(): object | Get object of the guid type of the current object |
| setObject(obj, origin) | Initialize the current object, and set it using the object of the specified guid type |
| equal(target) | Compare the current object with the specified object. |
| getTypes() | Returns the constructors of the current object and all the constructors of the prototype chain to the array. |
| instanceOf(target) | Verify that the current object is an instance of the specified type (with _UNION) |


## Events

| Item | Description |
| ---------- | ------------------------- |
| onExecute | common event before execution |
| OnExecuted | common event after execution | inspect()

# Detailed description 

## Key Properties

### config

> This is the setting for the AJAX request.
> Same format as 'config' in axios.

```ts
type config = object;
```

### url

> Set the URL for the AJAX request.

```ts
type url = string;
```

### \_outputs

> Collection that stores output results.

```ts
type _outputs = MetaViewCollection;
```

### \_model

> Bind model object.

```ts
type _model = BindModel;
```

### valid

> MetaView object to be inspected.

```ts
type valid = MetaView;
```

### bind

> Bind target MetaView object.

```ts
type bind = MetaView;
```

bind (MetaView) is a list of columns that are sent to the server.
The column name and column value in the bind.column collection are sent (requested) to the server.

Internal operating structure
```js
var bm = new BindModel();
bm.url = '/user'
bm.addCommand('test');
bm.cmd['test'].addColumnValue('user_name', 'Neo');
bm.cmd['test'].addColumnValue('passwd', '1234');
bm.cmd['test'].execute();

///// Send to internal
var axiosConfig = {
	url: '/user',
	data: {
		user_name: 'Neo',
		passwd: '1234'
	}
}
```

### output
> Dynamic added output MetaView object.


```ts
type output = MetaView;
```

### outputOption
> Output attribute options.
> - 0: Except
> - 1: Import rows of all columns
> - 2: Import only rows of existing columns
> - 3: Import only rows of existing curums, set value

```ts
type outputOption = object;
```

### outOpt

Alias for > outputOptions.

```ts
type outOpt = object;
```

### cbBegin

> This is the callback function that is called at the start of execution.

```ts
type cbBegin = (cmd: BindCommand) => void;
```
- cmd - This is the current bind command object.

### cbValid

> Callback function called before valid.

```ts
type cbValid = (valid: MetaView, command: BindCommand) => boolean;
```
- valid : object 'MetaView' to be inspected.
- command : The current bind command object.
- return : A boolean value representing the result of the examination.

### cbBind

> This is the callback function that is called before bind.

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

### cbResult

> This is a callback function that handles binding results.
> Mainly used for processing result data.

```ts
type cbResult = (
	data: object, 
	command: BindCommand, 
	response: object
) => object;
```
- data : Bind result data object.
- cmd : This is the current bind command object.
- response —Response object.
- return : Processed result data.
### cbOutput

> This is a callback function that outputs binding results.
> Mainly used for the output of lists.

```ts
type cbOutput = (
	outputs: MetaViewCollection, 
	command: BindCommand, 
	response: object
) => object;
```
- outputs : Metabiew collection.
- command : The current bind command object.
- response —Response object.
- return —Returns the processed result object.
### cbEnd

> This is a callback function that is called after processing is finished.

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

### execute()

> Run the bind command.
> Performs the entire execution process, including validation, binding, result processing, success, and error callback.

```ts
type execute = () => Promise<void>;
```
- return : This is the 'Promise' object representing the execution result.

```js
var bm = new BindModel();

bm.addCommand('test1');
bm.addCommand('test2');
...

bm.cmd['test1'].execute();
bm.cmd['test2'].execute();
```

### addColumn()

> Add a column and map it to the specified view.

```ts
type addColumn = (
	column: string | MetaColumn, 
	views: string | string[], 
	bTable: string | MetaTable
) => void;
```
- column : column object to be registered; it could be a string or 'MetaColumn' object.
- views : The name of the view entity to be added; it can be a string or array of strings.
- bTable : (Optional) Default table object or table name to be mapped.
### addColumnValue()

> Add columns and values and map them to the specified view.

```ts
type addColumnValue = (
	name: string, 
	value: any, 
	views?: string | string[], 
	bTable?: string | MetaTable
) => void;
```
- name : The name of the column.
- value : The value of the column.
- views —(Optional) Name of the view entity to be added.
- bTable : (Optional) Default table object or table name to be mapped.

### setColumn()

> Set the column.

```ts
type setColumn = (name: string | string[], views: string | string[]) => void;
```
- name —Column name or array of names.
- views —The name or array of views to set.

### release()

> Release the column from the target entity.

```ts
type release = (name: string | string[], views: string | string[]) => void;
```
- name —Column name or array of names to release.
- views —The name or array of view entities to be disabled.

### newOutput()

> Add a view entity to use for the output.
> The default name is 'output' + _outputs.count.

```ts
type newOutput = (name?: string) => void;
```
- name —(Optional) The name of the view to be referenced additionally.

### removeOutput()

> Delete the output view.

```ts
type removeOutput = (name: string) => boolean;
```
- name — The name of the view to be deleted.

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

