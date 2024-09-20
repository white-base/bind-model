
[![Node.js CI](https://github.com/white-base/bind-model/actions/workflows/ci.yml/badge.svg)](https://github.com/white-base/bind-model/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/white-base/bind-model/branch/main/graph/badge.svg)](https://codecov.io/gh/white-base/bind-model)
[![npm version](https://img.shields.io/npm/v/logic-bind-model.svg)](https://www.npmjs.com/package/logic-bind-model)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)


website : https://bindmodel.com

## What is BindModel?

BindModel is a front-end framework that operates on the web and in Node.js environments. It is designed for simplicity and productivity based on commands and entities (Table, View). Once you are familiar with the basics of HTML, CSS, and JavaScript, you can easily create websites using BindModel.

- Manage all data as an entity (MetaTable, MetaView).
- It acts as a controller in the MVC pattern and is completely separate from the View.
- It provides a command-based processor to provide a consistent development pattern.
- It is a harmonious collection of libraries needed for web development, such as routing, form management, and client-server communication.
- It can be used in conjunction with other frameworks.


## props drilling issue

The problem of Props drilling with React, Vue, and Angular can be solved all at once by BindModel, which manages data centrally and clearly separates business logic to significantly improve maintenance and reusability.

BindModel's components, MetaTable and MetaView, are defined as standard interfaces, making screen configurations more flexible. React and Vue only manage screen-related responsibilities and delegate business logic to BindModel, allowing business logic to be reused on a variety of screens.

## Vue & React Mix

By separating Vue and React from complex state management, mixing with BindModel clearly separates the state management and business logic of existing codes, this can greatly improve the readability, maintenance, and reuse of codes, particularly for large projects and complex data processing.

https://bindmodel.com/exam/notice/ See Example

Example source when mixing vue and bindModel
```js
// app.js
import NoticeList from './components/NoticeList.js';
import NoticeForm from './components/NoticeForm.js';
import NoticeAdminService from './service/notice-admin-svc.js'

const { createApp, ref } = Vue
const bm = new _L.BindModel(new NoticeAdminService());  

bm.url =' /notice/data/list.json';

const app = createApp({
  data() {
    return {
      notices: [],
      selectedNotice: null,
      statusOptions: {
        'D': 'Standby',
        'A': 'Activation',
        'H': 'Hidden'
      },
      bindModel: bm,
    };
  },
  methods: {
    selectNotice(idx) {
      this.selectedNotice = idx;
    },
    deselectNotice() {
      this.selectedNotice = null;
    },
  },
  components: {
    'notice-list': NoticeList,
    'notice-form': NoticeForm
  }
});

app.mount('#app');
```

```js
// components/NoticeList.js
export default {
    props: ['bindModel'],
    emits: ['select-notice'],
    template: `
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="bindModel.cmd.list.output.rows.length === 0">
            <td colspan="3">There is no content.</td>
          </tr>
          <tr v-for="(notice, index) in bindModel.cmd.list.output.rows" :key="notice.ntc_idx">
            <td><a href="#" @click.prevent="readClick(index)">{{ notice.title }}</a></td>
            <td>{{ notice.active_cd }}</td>
            <td>{{ notice.create_dt }}</td>
          </tr>
        </tbody>
      </table>
    `,
    async created() {     
      await this.bindModel.cmd['list'].execute();
    },
    methods: {
      async readClick(idx) {
        this.bindModel.cmd['read'].outputOption.index = Number(idx);
        await this.bindModel.cmd['read'].execute();
        this.$emit('select-notice', idx);
      }
    }
  };
```


## Installation

Learn how to install and use BindModel

### Installation using npm

To install BindModel in a Node.js environment, use the following command.

```sh
npm install logic-bind-model
```

### Installing in a browser environment

In a browser environment, BindModel is available via CDN.

```html
<script src="https://unpkg.com/logic-bind-model/dist/bindmodel.pack.js"></script>
```

## Use

BindModel is the core object of the framework.

### Server Environment (node.js)

In the Node.js environment, you can use the BindModel through a require or import statement.

Example: Using with CommonJS
```js
const { BindModel } = require('logic-bind-model');

const bm = new BindModel();
```


Example: Using with ESM
```js
import { BindModel } from 'logic-bind-model';  

const bm = new BindModel();
```

### HTML Environment

In the browser environment, it is accessed through the '_L' global variable.

Example: Using in HTML Environments
```html    
<script src="https://unpkg.com/logic-bind-model/dist/bindmodel.pack.js"></script>
<script>
	const bm = new _L.BindModel();
</script>
```


## Packaging

BindModel relies on axios and jQuery modules to perform asynchronous communication and DOM operations with the server; reflecting this dependency, it provides a variety of deployment packages.

### bindmodel.js

This package contains only BindModel and does not include axios and jQuery. This package is useful when externally already including axios and jQuery, or if you are managing them separately.

### bindmodel.pack.js

This package contains the axios and jQuery libraries along with BindModel. This package can be fully functional with just one bind-model.pack.js, without having to install axios or jQuery from the outside.

'packageName + min.js' is a compressed file.
* bindmodel.min.js
* bindmodel.pack.min.js

# Basic Usage

Let's learn the basic usage simply.

## Create BindModel

Creating 'BindModel' objects is the first step for data binding and server-to-server communication.
 This object serves as the key to managing AJAX communication with the server.
 

```js
var bm = new BindModel();

bm.url = '/user';
```
- The '/user' path is set as the default path to handle API requests related to the user's information.
- You can also set "url" for each "command".


## Add command

To add a new command to a BindModel object, use the addcommand() method, which creates a Bindcommand object and registers it with the BindModel to manage data communication with the server.

The Bindcommand object contains MetaView objects that play three key roles in data communication with the server.
- **valid**: serves to validate the data.
- **bind**: serves to bind the client's data before it is passed to the server.
- **output** : It is responsible for fetching data received from the server.

```js
bm.addCommand('newCmd', 3);

// bm.command['newCmd'] === bm.cmd['newCmd']
// bm.command['newCmd'] instanceof BindCommand
// bm.cmd['newCmd'].vallid instanceof MetaView
// bm.cmd['newCmd'].bind instanceof MetaView
// bm.cmd['newCmd'].output instanceof MetaView
```
- It operates differently depending on output options (range: 0, 1, 2, 3)
- You can access the 'Bindcommand' object with 'bm.command['name']'.
- 'bm.cmd['name']' refers to the same object, of which shorter 'bm.cmd' can be used as an alias.


## Add column

The addColumn() method provides the ability to add a column to a BindModel object and set the column to the MetaView for the specified Bindcommand object. Additionally, you can use the addColumnValue() method to set the initial value of the column.

Example: Adding an Empty Column
```js
bm.addColumn('aa', 'newCmd', 'valid');
bm.addColumn('bb', 'newCmd', ['valid', 'bind']);
bm.addColumn('cc', 'newCmd', '$all');
```
- Add a column with the name 'aa' and set it to the valid (MetaView) in cmd['newCmd'].
- Add a column with the name 'bbb' and set it to 'valid', 'bind' in cmd ['newCmd'].
- Add a column with the name 'cc' and set it to the whole of the cmd ['newCmd'] ('valid', 'bind', 'output').

Example: Adding a column as an initial value
```js
bm.addColumnValue('aa', 100, 'newCmd', 'valid');
bm.addColumnValue('bb', 'B', 'newCmd', ['valid', 'bind']);
bm.addColumnValue('cc', true, 'newCmd', '$all');
```
- Add a column with the 'aa' name as the initial value of '100' and set it to 'valid' in cmd['newCmd'].
- Add a column with the initial value of 'B' under the name 'bbb' and set it to 'valid', 'bind' in cmd['newCmd'].
- Add a column with the initial value of 'true' under the name 'cc' and set it throughout cmd['newCmd'].


## Execute

The execute() method of the Bindcommand object handles three main steps: validation, data request, and data reception. Each step can be controlled through the callback function, which lets you manage the flow of requests in detail.

```js
bm.command['newCmd'].execute();
```
- There are three main steps when calling the execute() method.
- Validation : Perform a validation of the 'valid' column, and call a 'cbFail' callback if it fails.
- Data Binding: Request 'bind' to server path same as column.
- Data Receipt : Gets received data as 'output'.

# How objects are created

'BindModel' offers a number of creation methods to suit the needs of the user, understand the pros and cons of each method and choose the appropriate method as needed.

### 1. Creation by service objects

Service objects can be managed separately to increase productivity. Define the items and commands needed to create objects at once.

```js
var bm = new BindModel({
	items: {
		aa: 10,
		bb: 20,
		cc: 30,
		dd: 40
	},
	command: {
		create: {},
		read: {
			outputOption: 3
		}
	},
	mapping: {
		aa: { create: 'valid'},
		bb: { read: ['bind', 'output']},
		cc: { $all: 'output'}
	}
});

// Check
// bm.command['create'].valid.columns.count   == 1 ('aa')
// bm.command['create'].bind.columns.count    == 0
//  bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 2 ('bb','cc')
// bm.columns.count  // 3 ('aa','bb','cc')
```

### 2. Map after adding to items

Specifies a commonly managed item, which is useful if columns are used for multiple commands.

```js
var bm = new BindModel();

// Add command
bm.addCommand('create');
bm.addCommand('read', 3);

// Add Item
bm.items.add('aa', 10);
bm.items.add('bb', 20);
bm.items.add('cc', 30);
bm.items.add('dd', 40);

// mapping
bm.setMapping({
	aa: { create: 'valid' },
	bb: { read: 'bind' },
	cc: { $all: ['output'] }   // $all = all command
});

// Check
// bm.command['create'].valid.columns.count  == 1 ('aa')
// bm.command['create'].bind.columns.count   == 0
// bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 1 ('cc')

// bm.columns.count  == 3 ('aa','bb')

// bm.columns['aa'].value; == 10
// bm.columns['bb'].value; == 20
// bm.columns['cc'].value; == 30
```

### 3. Setting commands when adding columns

This is how you specify the command at the time of column generation. It is effective when you gradually expand the functionality.

```js
var bm = new BindModel();

// Add command
bm.addCommand('create');
bm.addCommand('read', 3);

// Add Column and Set Commands
bm.addColumn('aa', 'create', 'valid');
bm.addColumn('bb', 'read', 'bind');
bm.addColumn('cc', '$all', 'output');   

// Check
// bm.command['create'].valid.columns.count  == 1 ('aa')
// bm.command['create'].bind.columns.count   == 0
// bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 1 ('cc')

// bm.columns.count  // 3 'aa','bb'
```

### 4. Set to command after adding column

It is a method of creating a column to be managed in advance and setting it up and using it in the necessary command. You can reduce code duplication by managing tables separately or generating common columns in advance.

```js
var bm = new BindModel();

// Add command
bm.addCommand('create');
bm.addCommand('read', 3);

// Add a column to the default columns
bm.columns.addValue('aa', 10);
bm.columns.addValue('bb', 20);
bm.columns.addValue('cc', 30);

// Set to Command
bm.command['create'].setColumn('aa', 'valid');
bm.command['create'].setColumn('cc', 'output');
bm.command['read'].setColumn('bb', ['bind']);
bm.command['read'].setColumn('cc', ['output']);

// Check
// bm.command['create'].valid.columns.count  == 1 ('aa')
// bm.command['create'].bind.columns.count   == 0
// bm.command['create'].output.columns.count == 1 ('cc')

// bm.command['read'].valid.columns.count    == 0
// bm.command['read'].bind.columns.count     == 1 ('bb')
// bm.command['read'].output.columns.count   == 1 ('cc')

// bm.columns.count  // 3 ('aa','bb')
```

### 5. Register column by command

It is a method of generating columns for each command, which is useful if you manage them as independent columns for each command.

```js
var bm = new BindModel();
bm.addCommand('create');
bm.addCommand('read');
bm.command['create'].addColumn('aa', 'valid');
bm.command['read'].addColumn('bb', ['bind', 'output']);

// Check
// bm.command['create'].valid.count  == 1 ('aa')
// bm.command['create'].bind.count   == 0
// bm.command['create'].output.count == 0

// bm.command['read'].valid.count    == 0
// bm.command['read'].bind.count     == 1 ('bb')
// bm.command['read'].output.count   == 1 ('bb')

// bm.columns.count  == 2 ('aa','bb')
```
This variety of object generation methods allow us to flexibly utilize BindModel, and it is important to consider the advantages and disadvantages of each method and choose the appropriate method.

For more information, please visit (https://bindmodel.com ).


## Feedback & Suggestions

We'd love to hear from you! Your feedback is incredibly valuable as we work to make this project better. Whether you spot an issue, have suggestions for improvement, or just want to share your experience, feel free to reach out!

1. 💡 **Notice something off or think of a way to improve?**  
   We're constantly growing and improving, and your input helps us get there faster! Drop us a line at **bindmodel@gmail.com** 😊

2. 🚀 **"Something's broken!"**  
   If you run into any issues or errors, don't hesitate to let us know! Your feedback is our lifeline and can help us fix things pronto. Send us a message at **bindmodel@gmail.com** 😎

3. 😊 **How was your experience?**  
   First impressions are important, and we're eager to know how things went for you. Any thoughts, feedback, or suggestions are warmly welcomed. Email us at **bindmodel@gmail.com** 🙏


