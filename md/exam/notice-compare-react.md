---
lang: en
title: "notice React Mix compare"
layout: fullwidth
permalink: /exam/notice-compare-react/
date: 2024-08-14T1
# toc: true
# toc_sticky: true
sidebar:
  nav: "exam"

last_modified_at: 2024-10-01
---
## Description


## React folder structure
```js
react-mix1/
├── componets/
│   ├── NoticeAdminPage.js
│   ├── NoticeForm.js
│   └── NoticeList.js
├── app.js
└── admin.html
```

### NoticeAdminPage.js : React
---
It is a code that implements business logic and core in the announcement.

```js
import React from 'https://esm.sh/react';

import NoticeList from './NoticeList.js';
import NoticeForm from './NoticeForm.js';

const { useState, useEffect } = React;

export default function NoticeAdminPage() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    contents: '',
    active_cd: 'D',
    top_yn: false,
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/notice/data/list.json');
      setNotices(response.data.rows);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  const handleRead = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      contents: notice.contents || '',
      active_cd: notice.active_cd || 'D',
      top_yn: notice.top_yn === 'Y',
    });
  };

  const handleList = () => {
    setSelectedNotice(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      alert('Title is required.');
      return;
    }

    try {
      const response = await axios.put(`data/list/${selectedNotice.ntc_idx}`, formData);
      console.log('Notice updated successfully:', response.data);
      fetchNotices();
      setSelectedNotice(null);
    } catch (error) {
      console.error('Failed to update notice:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`data/list/${selectedNotice.ntc_idx}`);
      console.log('Notice deleted successfully:', response.data);
      fetchNotices();
      setSelectedNotice(null);
    } catch (error) {
      console.error('Failed to delete notice:', error);
    }
  };

  return (
    React.createElement('div', { className: 'container mt-3' },
      React.createElement('h2', null, 'Notice Admin Page'),
      React.createElement('h5', null, 'Key Features: List inquiry/modification/deletion'),
      React.createElement('p', null, 'Data is transmitted when modified or deleted from the test page, but it is not actually processed.'),
      
      !selectedNotice ? (
        React.createElement(NoticeList, { notices, handleRead })
      ) : (
        React.createElement(NoticeForm, {
          selectedNotice,
          formData,
          handleChange,
          handleUpdate,
          handleDelete,
          handleList
        })
      )
    )
  );
}
```


### NoticeAdminPage.js : Mix React and BindModel
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

### notice-admin-svc.js : Mix Vue and BindModel
---

```js
export default class NoticeAdminService {
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
```
## Comparison


> The use of class components and BindModel in the mixed code provides the benefits of providing a clearer separation of React's health management and business logic, including.

1. Improved Reusability and Maintenance of Business Logic: BindModel lets you separate and manage business logic from components. By defining logic such as data binding and API calls inside BindModel, the same logic can be reused by other components, and maintenance is easy in the event of future logic changes. Structurally cleaner management is possible than implementing business logic directly like the first code.
2. Data Binding Consistency: You can ensure data binding consistency by explicitly connecting data with screen elements via BindModel.Managing column values in the same way as this.bm .cols[name].value allows you to efficiently synchronize user input with data changes.
3. Clear health management: Class components explicitly manage health conditions, and interaction with BindModel makes it easier to track changes in the state of each data. This allows for more systematic health management between components.
4. Flexibility in large-scale projects: This approach is particularly advantageous for large and complex projects. BindModel helps ensure consistent handling of business logic across multiple components, and is highly scalable and flexible.

In conclusion, the mixed code provides a clear separation between React's state management and business logic to significantly improve the readability, maintenance, and reusability of the code, especially for large-scale projects or complex data processing.