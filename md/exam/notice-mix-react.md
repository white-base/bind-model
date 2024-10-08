---
lang: en
title: "notice React Mix"
layout: fullwidth
permalink: /exam/notice-mix-react/
date: 2024-08-14T1
# toc: true
# toc_sticky: true
sidebar:
  nav: "exam"

last_modified_at: 2024-10-01
---

## Description

As an example of "Notice", we excluded the user page as a page.

## folder structure
```js
react-mix1/
├── componets/
│   ├── NoticeAdminPage.js
│   ├── NoticeForm.js
│   └── NoticeList.js
├── service/
│   └── notice-admin-svc.js
├── app.js
└── admin.html
```

### admin.html
---

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notice Admin Page - React</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div id="root"></div>

<script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script> -->
 <!-- <script src="https://unpkg.com/logic-bind-model/dist/bindmodel.pack.min.js"></script> -->
<script src="/dist/bindmodel.pack.min.js"></script>
<script src="./App.js" type="module"></script>
</body>
</html>
```

### app.js
---

```js

import React from 'https://esm.sh/react';
import ReactDOM from 'https://esm.sh/react-dom';
import NoticeAdminPage from './components/NoticeAdminPage.js';

function App() {
  return React.createElement(NoticeAdminPage);
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
```

### service/notice-admin-svc.js
---

```js
class NoticeAdminService {
    constructor(reactThis) {
        const _this = this;

        this.items = {
            title: { required: true }
        },
        this.command = {
            create:     {
            },
            read:       {
                outputOption: 3,
            },
            update:     {
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
                cbEnd(status, cmd, res)  {
                    if (res) {
                      alert('The post has been modified.');
                      reactThis.handleList();
                    }
                  }
            },
            delete:     {
                cbValid(valid, cmd) { 
                    if (confirm('Are you sure you want to delete it?')) return true;
                },
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
                cbEnd(status, cmd, res) {
                    if (res) {
                      alert('The post has been deleted.');
                      reactThis.handleList();
                    }
                  }
            },
            list:       {
                outputOption: 1,
                cbEnd(status, cmd, res) {
                    reactThis.setState({ selectedNotice: null });
                }
            }
        };
        this.mapping = {
            ntc_idx:    { read:     ['bind', 'output'],     update:  'bind',               delete:     ['valid', 'bind'] },
            title:      { read:     'output',               update:  ['valid', 'bind'], },
            contents:   { read:     'output',               update:  'bind' },
            top_yn:     { read:     'output',               update:  ['valid', 'bind'], },
            active_cd:  { read:     'output',               update:  ['valid', 'bind'], },
            create_dt:  { read:     'output' },
        };
        this.fn = {
            handleRead: async (idx) => {
                _this.bindModel.cmd['read'].outputOption.index = Number(idx);
                await _this.bindModel.cmd['read'].execute();
                reactThis.setState({ selectedNotice: true });
            },
        };
    }    
}

export {
    NoticeAdminService as default,
    NoticeAdminService
}
```


### components/NoticeAdminPage.js
---

```js
import React, { Component } from 'https://esm.sh/react';
import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';
import NoticeAdminService from '../service/notice-admin-svc.js'

export default class NoticeAdminPage extends Component {
  constructor(props) {
    super(props);
    
    this.bm = new _L.BindModel(new NoticeAdminService(this));  
    this.bm.url = '/notice/data/list.json';
      
    this.state = { selectedNotice: null };
  }

  componentDidMount() {
    this.bm.cmd['list'].execute();
  }

  handleList = () => {
    this.setState({ selectedNotice: null });
  };

  handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === 'checkbox') value = checked ? 'Y' : 'N';
    this.bm.cols[name].value = value;  //  column value setting
    this.forceUpdate();           //  Forced screen rendering
  };

  render() {
    const { selectedNotice } = this.state;

    return (
      React.createElement('div', { className: 'container mt-3' },
        React.createElement('h2', null, 'Notice Admin Page'),
        React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
        React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
        
        React.createElement(NoticeList, { bindModel: this.bm }),
        !selectedNotice || (
          React.createElement(NoticeForm, {
            handleChange: this.handleChange,
            bindModel: this.bm
          })
        )
      )
    );
  }
}
```


### components/NoticeForm.js
---

```js
import React, { Component } from 'https://esm.sh/react';

export default class NoticeForm extends Component {
  render() {
    const { handleChange, bindModel } = this.props;

    return (
      React.createElement('div', { id: 'class-form' },
        React.createElement('form', null,
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', {}, '날짜'),
            React.createElement('p', { id: 'create_dt' }, bindModel.cols.create_dt.value)
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'title' }, 'Title'),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              id: 'title',
              name: 'title',
              value: bindModel.cols.title.value,
              onChange: handleChange
            })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'contents' }, 'Content'),
            React.createElement('textarea', {
              className: 'form-control',
              id: 'contents',
              name: 'contents',
              rows: '3',
              value: bindModel.cols.contents.value,
              onChange: handleChange
            })
          ),
          React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'col' },
              React.createElement('div', { className: 'form-check' },
                React.createElement('input', {
                  type: 'checkbox',
                  className: 'form-check-input',
                  id: 'check1',
                  name: 'top_yn',
                  checked: bindModel.cols.top_yn.value === 'Y',
                  onChange: handleChange
                }),
                React.createElement('label', { className: 'form-check-label', htmlFor: 'check1' }, 'top notice')
              )
            ),
            React.createElement('div', { className: 'col' },
              ['D', 'A', 'H'].map(value => (
                React.createElement('div', { className: 'form-check', key: value },
                  React.createElement('input', {
                    type: 'radio',
                    className: 'form-check-input',
                    id: `radio${value}`,
                    name: 'active_cd',
                    value: value,
                    checked: bindModel.cols.active_cd.value === value,
                    onChange: handleChange
                  }),
                  React.createElement('label', { className: 'form-check-label', htmlFor: `radio${value}` },
                    value === 'D' ? 'Standby' : value === 'A' ? 'Activation' : 'Hidden'
                  )
                )
              ))
            )
          )
        ),
        React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: ()=> bindModel.cmd['update'].execute() }, 'Update'),
        React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: ()=> bindModel.cmd['delete'].execute() }, 'Delete'),
        React.createElement('button', { type: 'button', className: 'btn btn-primary mt-3', onClick: ()=> bindModel.cmd['list'].execute() }, 'List')
      )
    );
  }
}
```


### components/NoticeList.js
---

```js
import React, { Component } from 'https://esm.sh/react';

export default class NoticeList extends Component {
  render() {
    const { bindModel } = this.props;
    const rows = bindModel.cmd.list.output.rows;

    return (
      React.createElement('table', { className: 'table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Title'),
            React.createElement('th', null, 'Status'),
            React.createElement('th', null, 'Date')
          )
        ),
        React.createElement('tbody', null,
          rows.count > 0 ? (
            rows.map((notice, i) => (
              React.createElement('tr', { key: notice.ntc_idx },
                React.createElement('td', null,
                  React.createElement('a', { href: '#', onClick: () => bindModel.fn.handleRead(i), className: 'btnNormal' },
                    notice.title
                  )
                ),
                React.createElement('td', null, notice.active_cd),
                React.createElement('td', null, notice.create_dt)
              )
            ))
          ) : (
            React.createElement('tr', null,
              React.createElement('td', { colSpan: '3' }, 'There is no content.')
            )
          )
        )
      )
    );
  }
}
```



