---
lang: en
title: "notice Vue Mix compare"
layout: fullwidth
permalink: /exam/notice-compare-vue/
date: 2024-08-14T1
# toc: true
# toc_sticky: true
sidebar:
  nav: "exam"

last_modified_at: 2024-10-01
---

## Description


## folder structure
```js
vue-mix/
├── componets/
│   ├── NoticeForm.js
│   └── NoticeList.js
├── app.js
└── admin.html
```

### app.js : Vue
---
It is a code that implements business logic and core in the announcement.
```js
import NoticeList from './components/NoticeList.js';
import NoticeForm from './components/NoticeForm.js';

const { createApp, ref } = Vue

const app = createApp({
  data() {
    return {
      notices: [],
      selectedNotice: null,
      statusOptions: {
        'D': 'Standby',
        'A': 'Activation',
        'H': 'Hidden'
      }
    };
  },
  methods: {
    fetchNotices() {
      axios.get('/notice/data/list.json')
      .then(response => {
        this.notices = response.data.rows.map(row => ({
          ntc_idx: row.ntc_idx,
          title: row.title,
          contents: row.contents,
          top_yn: row.top_yn,
          active_cd: row.active_cd,
          create_dt: row.create_dt
        })) || [];
      })
      .catch(error => {
        console.error('Error fetching notices:', error);
      });
    },
    selectNotice(notice) {
      this.selectedNotice = notice;
      axios.get(`/notice/data/list.json`)  // RESTful : `/notice/data/${ntc_idx}.json`
        .then(response => {
          const notice = response.data;
          this.selectedNotice = {
            ntc_idx: notice.ntc_idx,
            title: notice.title,
            contents: notice.contents, 
            top_yn: notice.top_yn,
            active_cd: notice.active_cd,
            create_dt: notice.create_dt
          };
        })
        .catch(error => {
          console.error('Error reading notice:', error);
        });
    },
    deselectNotice() {
      this.selectedNotice = null;
    },
    updateNotice(notice) {
      const isValid = this.validateNotice(notice);

      if (isValid) {
        axios.put(`/notice/data/list.json`, notice) // RESTful : '/notice/update/${notice.ntc_idx}`
          .then(() => {
            console.warn('Caution: Send to the test server, but the data is not reflected.', notice);
            this.deselectNotice();
          })
          .catch(error => {
            console.error('Error updating notice:', error);
          });
      } else {
        alert('Validation failed');
      }
    },
    deleteNotice(idx) {
      const deleteNotice = {
        ntc_idx: idx
      };
      if (confirm('Are you sure you want to delete it?')){
        axios.delete(`/notice/data/list.json`, deleteNotice)  // RESTful : `/notice/delete/${ntc_idx}`
          .then(() => {
            console.warn('Caution: Send to the test server, but the data is not reflected.', deleteNotice);
            this.deselectNotice();
            // 삭제 후 공지사항 목록을 다시 불러옴
            this.fetchNotices();
          })
          .catch(error => {
            console.error('Error deleting notice:', error);
          });
      }
    },
    validateNotice(notice) {
      let isValid = true;
      if (!notice.title || notice.title === '') {
        isValid = false;
      }
      if (!notice.top_yn || (notice.top_yn !== 'Y' && notice.top_yn !== 'N')) {
        isValid = false;
      }
      if (!notice.active_cd || (notice.active_cd !== 'D' && notice.active_cd !== 'A' && notice.active_cd !== 'H')) {
        isValid = false;
      }
      return isValid;
    }
  },
  mounted() {
    this.fetchNotices();
  },
  components: {
    'notice-list': NoticeList,
    'notice-form': NoticeForm
  }
});

app.mount('#app');
```


### app.js : Mix Vue and BindModel
---

```js
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

### notice-admin-svc.js : Mix Vue and BindModel
---

```js
export default class NoticeAdminService {
    constructor() {
        var _this       = this;
        var _template   = null;     // Handlebars template

        this.items = {
            ntc_idx: { required: true },
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
            },
            delete:     {
                cbValid(valid, cmd) { 
                    if (confirm('Are you sure you want to delete it?')) return true;
                },
                cbBind(bind, cmd, setup) {
                    console.warn('Caution: Send to the test server, but the data is not reflected.', setup.data);
                },
            },
            list:       {
                outputOption: 1,
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
    }    
}
```

## Comparison 
1. Isolation and Reusability of Business Logic:
The second code separated business logic into separate classes using BindModel and NoticeAdminService. This makes business logic separate from Vue components and reusable. This structure allows the same business logic to be recycled from other Vue components or projects, greatly improving maintenance and scalability.
2. Simplicity of data binding:
By encapsulating logic, such as importing data using BindModel, you can reduce the number of methods for Vue components. The first code uses direct axios calls, but the second code is responsible for this at BindModel, which makes the code much simpler.
3. Maintenance and scalability:
Because business logic is not directly dependent on Vue components, future API changes or service logic changes can only be modified by the NoticeAdminService. This simplifies the maintenance of the code. On the other hand, the first code contains business logic inside the Vue component, which may require modifying several components when changing logic.
4. Improved testability:
The second method separated the business logic into separate classes, so unit tests can be written independently for that class. The business logic inside the Vue component is more complex to test, but the BindModel method provides a testable code structure.

> In conclusion, the advantage of the second code is to separate the business logic, increasing the reusability, maintenance, and testability of the code.