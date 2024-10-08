---
lang: en
title: "Notice example"
layout: fullwidth
permalink: /exam/notice/
date: 2011-06-23T1
# toc: true
# toc_sticky: true
sidebar:
  nav: "exam"

last_modified_at: 2024-10-01
---

## Example screen

![image-left](/assets/images/notice-800.gif){: .align-center} 

## Configuring the Environment

```sh
git clone https://github.com/white-base/exam-bind-model.git
cd exam-bind-model
npx serve
```

## props drilling issue

The problem of Props drilling with React, Vue, and Angular can be solved all at once by BindModel, which manages data centrally and clearly separates business logic to significantly improve maintenance and reusability.

BindModel's components, MetaTable and MetaView, are defined as standard interfaces, making screen configurations more flexible. React and Vue only manage screen-related responsibilities and delegate business logic to BindModel, allowing business logic to be reused on a variety of screens.

