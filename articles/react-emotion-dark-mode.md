---
path: "/articles/react-emotion-darkmode"
date: "2019-10-01"
title: "Reactとemotionでダークモードを実現する"
img: "dark-mode.png"
---

- 導入
  - hackernote でのダークモード
- ダークモード・事例
  - [Slack](https://slackhq.com/dark-mode-for-slack-desktop)
- 実装方法の全体
  - mode ごとの色をオブジェクトで定義
  - 現在のテーマをスタイルに当てる
  - テーマをコンテキストとして管理
- 他の方法
  - [Building Dark Mode on Desktop - Several People Are Coding](https://slack.engineering/building-dark-mode-on-desktop-811508b5d15f)
  - CSS variables
- デモ
  - codesandbox
- mode ごとの色をオブジェクトで定義
  - TS
- 現在のテーマをスタイルに当てる
  - emotion-theming
- react context でテーマを管理し、切り替える
- prefer-color-scheme
- ダークモードの注意点
- まとめ

### 参考

- [Dark mode comes to desktop: Here’s how you can access it | The Official Slack Blog](https://slackhq.com/dark-mode-for-slack-desktop)
- [Building Dark Mode on Desktop - Several People Are Coding](https://slack.engineering/building-dark-mode-on-desktop-811508b5d15f)
- [Emotion - Theming](https://emotion.sh/docs/theming)
- [Context – React](https://reactjs.org/docs/context.html)
- [Hello darkness, my old friend | web.dev](https://web.dev/prefers-color-scheme)
- [prefers-color-scheme - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
