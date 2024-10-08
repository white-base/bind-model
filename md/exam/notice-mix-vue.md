---
lang: en
title: "notice Vue Mix"
layout: fullwidth
permalink: /exam/notice-mix-vue/
date: 2011-06-23T1
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
vue-mix/
├── componets/
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
  <title>Notice Admin Page</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div id="app" class="container mt-3">
  <h2>Notice Admin Page</h2>
  <h5>Key Features: List inquiry/modification/deletion</h5>
  <p>Data is transmitted when modified or deleted from the test page, but it is not actually processed.</p>

  <notice-list :bind-model="bindModel" 
               @select-notice="selectNotice">
  </notice-list>
  <notice-form v-if="selectedNotice" 
               :status-options="statusOptions" 
               :bind-model="bindModel" 
               @deselect-notice="deselectNotice"
               >
  </notice-form>
</div>

<script src="https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js"></script>
<script src="/dist/bindmodel.pack.min.js"></script>
<script src="app.js" type="module"></script>
</body>
</html>
```

### app.js
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

### service/notice-admin-svc.js
---

```js
class NoticeAdminService {
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

export {
    NoticeAdminService as default,
    NoticeAdminService
}
```

### components/NoticeForm.js
---

```js
export default {
    props: ['statusOptions', 'bindModel'],
    data() {
      return {
        formData: { ...this.notice }
      };
    },
    emits: ['deselect-notice'],
    template: `
      <div id="class-form">
        <form @submit.prevent="updateClick">
          <div class="form-group">
            <label>날짜</label>
            <p id="create_dt">{{ bindModel.cols.create_dt.value }}</p>
          </div>
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" v-model="bindModel.cols.title.value" required>
          </div>
          <div class="form-group">
            <label for="contents">Content</label>
            <textarea class="form-control" id="contents" v-model="bindModel.cols.contents.value" rows="3"></textarea>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="check1" v-model="bindModel.cols.top_yn.value" true-value="Y" false-value="N">
                <label class="form-check-label" for="check1">Top notice</label>
              </div>
            </div>
            <div class="col">
              <div class="form-check" v-for="(label, value) in statusOptions" :key="value">
                <input type="radio" class="form-check-input" :id="\`radio\${value}\`" v-model="bindModel.cols.active_cd.value" :value="value">
                <label class="form-check-label" :for="\`radio\${value}\`">{{ label }}</label>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-3">Update</button>
          <button type="button" class="btn btn-danger mt-3" @click="deleteClick">Delete</button>
          <button type="button" class="btn btn-secondary mt-3" @click="$emit('deselect-notice')">List</button>
        </form>
      </div>
    `,
    async created() {
      var _this = this;

      this.bindModel.cmd['update'].cbEnd = function(status, cmd, res) {
        if (res) {
          alert('The post has been modified.');
          _this.$emit('deselect-notice');
        }
      };
      this.bindModel.cmd['delete'].cbEnd = function(status, cmd, res) {
        if (res) {
          alert('The post has been deleted.');
          _this.$emit('deselect-notice');
        }
      };
    },
    methods: {
      updateClick() {
        for (var prop in this.formData) {
          this.bindModel.columns[prop].value = this.formData[prop];
        }
        this.bindModel.cmd['update'].execute();
      },
      deleteClick() {
        this.bindModel.cmd['delete'].execute();
      }

    }
  };
```

### components/NoticeList.js
---

```js
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


