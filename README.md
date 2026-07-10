# わりかんBOT PWA セットアップ手順

保存ができるようになるまでに必要な作業は大きく2つです。
**①Firebaseプロジェクトを作る（データの保存先）**
**②アプリをどこかにホスティングする（URLとして公開する）**

所要時間：合計15〜20分程度

---

## ① Firebaseプロジェクトを作る（無料）

1. https://console.firebase.google.com/ にアクセスし、Googleアカウントでログイン
2. 「プロジェクトを作成」→ 好きな名前を入力（例: warikan-bot）→ 作成
3. 左メニューの「構築」→「Firestore Database」→「データベースを作成」
   - ロケーションは `asia-northeast1`（東京）を推奨
   - モードは「**テストモードで開始**」を選択（後述の注意点あり）
4. 左メニューの「プロジェクトの概要」の横にある歯車アイコン →「プロジェクトの設定」
5. 下にスクロールし「マイアプリ」→ `</>`（ウェブ）アイコンをクリック
6. アプリのニックネームを適当に入力 →「アプリを登録」
7. 表示された `firebaseConfig = { apiKey: "...", ... }` をコピー

8. `index.html` を開き、以下の部分を探して、コピーした内容に置き換える：

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### ⚠️ セキュリティについて（重要）
「テストモード」は誰でも読み書きできる設定で、**30日で自動的に読み書き不可になります**。
个人的な利用や身内のグループなら大きな問題は起きにくいですが、長く使うなら
Firestoreの「ルール」タブで以下のように変更してください（ルームコードを知っていれば読み書き可、という緩めの制限です）：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /warikanGroups/{roomId} {
      allow read, write: if true;
    }
  }
}
```

より厳密にしたい場合はFirebase Authenticationの導入が必要になりますが、
個人〜小規模グループ利用であれば上記で十分実用的です。

---

## ② アプリを公開する

どれか一つでOKです。どれも無料です。

### 方法A: Firebase Hosting（Firebaseと一体型でおすすめ）
1. パソコンにNode.jsをインストール
2. ターミナルで以下を実行：
   ```
   npm install -g firebase-tools
   firebase login
   cd warikan-pwa
   firebase init hosting
   firebase deploy
   ```
3. 発行されたURL（例: `https://warikan-bot.web.app`）にアクセス

### 方法B: Netlify Drop（一番簡単・コマンド不要）
1. https://app.netlify.com/drop にアクセス
2. `warikan-pwa` フォルダをまるごとブラウザにドラッグ＆ドロップ
3. 数秒で発行されるURLにアクセス

### 方法C: GitHub Pages
1. GitHubに新しいリポジトリを作り、フォルダの中身をすべてアップロード
2. リポジトリの Settings → Pages → ブランチを選んで有効化
3. 発行されたURL（`https://ユーザー名.github.io/リポジトリ名/`）にアクセス

---

## ③ 使い方

1. 発行されたURLにスマホのSafari/Chromeでアクセス
2. 「新しいルームを作る」でルームコードが発行される
3. そのコードをLINEグループなどでメンバーに共有
4. メンバーは同じURLを開き「ルームに参加する」でコードを入力
5. 以降、全員の入力がリアルタイムで同期されます

### ホーム画面に追加する（アプリっぽく使う）
- **iPhone(Safari)**: 共有ボタン →「ホーム画面に追加」
- **Android(Chrome)**: メニュー →「ホーム画面に追加」／自動で表示されるバナーをタップ

これでアイコンをタップすればアプリのように全画面で起動します。

---

## ファイル構成

```
warikan-pwa/
├── index.html          … アプリ本体（firebaseConfigをここに設定）
├── manifest.json        … PWA設定（アプリ名・アイコン等）
├── service-worker.js    … オフラインキャッシュ
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── icon-maskable-512.png
```

## うまくいかないときは
- ブラウザの開発者ツール（Consoleタブ）にエラーが出ていないか確認
- `firebaseConfig` の値に余計なスペースや引用符の消し忘れがないか確認
- Firestoreのルールが「テストモード」の期限切れ（30日）になっていないか確認
