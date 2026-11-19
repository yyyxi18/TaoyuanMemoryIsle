# 桃憶島｜桃園地方記憶地圖

桃憶島以桃園街區、地標與居民生活記憶為核心，提供故事探索、地點瀏覽與故事投稿的互動網站。第一階段以桃園舊城為起點，並以五個主題整理地方故事：廟口與舊城、市場與移民、客庄與聚落、埤塘與田野、鐵道與產業。

## 專案目錄

```text
TaoyuanMemoryIsle/
├── FrontEnd/     # React、TypeScript、Vite 網站
└── BackEnd/      # Node.js、Express、TypeScript API 範例
```

## 目前功能

前端可獨立啟動，使用內建示範資料操作：

- 首頁介紹與主題故事卡片
- 故事探索、關鍵字搜尋、行政區與主題篩選
- 故事詳情與同地點故事推薦
- 文字投稿、投稿預覽與送交審核流程
- 管理後台示意與投稿狀態展示
- 桌面與手機版響應式介面

目前投稿資料只保存在頁面執行期間；重新整理後會回到初始示範資料。AI 整理、語音錄製／辨識、資料庫儲存、登入與正式審核權限尚未接通。網站中的地圖為示意圖，故事及影像為展示素材，正式公開前請確認內容、圖片授權及來源標示。

## 前端啟動

需求：Node.js 與 npm。

```bash
cd FrontEnd
npm ci
npm run dev
```

Vite 預設會顯示本機網址，通常是 <http://localhost:5173/>。

建立正式版靜態檔案：

```bash
npm run build
```

輸出目錄為 `FrontEnd/dist/`。本機預覽正式版：

```bash
npm run preview
```

## 後端狀態

`BackEnd/` 是 Express + TypeScript 的 API 範例，目前路由仍是原始學生資料範例（例如 `/api/v1/user/findAll`），並非桃憶島的故事 API。後端透過 `dotenv` 讀取環境變數，MongoDB 連線設定使用：

| 變數 | 用途 |
| --- | --- |
| `PORT` | API 服務埠號 |
| `DBUSER` | MongoDB 使用者名稱 |
| `DBPASSWORD` | MongoDB 密碼 |
| `DBHOST` | MongoDB 主機 |
| `DBPORT` | MongoDB 埠號 |
| `DBNAME` | 資料庫名稱 |
| `assetsPath` | 靜態檔案目錄 |

目前後端 `package.json` 的 `build` 指令會以 watch 模式執行 TypeScript 編譯；正式執行前仍需補齊環境設定，並依部署方式調整編譯與啟動腳本。請勿將含有真實密碼的 `.env` 提交到版本控制。

## 技術架構

- 前端：React 18、TypeScript、Vite、React Router
- 後端範例：Node.js、Express、TypeScript、Mongoose
- 規劃中的資料層：MongoDB
- 規劃中的故事模型：故事、地點、投稿者同意、審核紀錄與故事回應

## 建議後續工作

1. 建立桃憶島故事與地標的 API、資料模型及資料庫連線設定。
2. 將前端示範故事改為 API 資料，並增加載入、錯誤與空資料狀態。
3. 實作投稿草稿、同意紀錄、待審／核准／退回／撤下狀態及管理者權限。
4. 串接語音上傳與 AI 轉錄／摘要，並保留投稿者確認步驟。
5. 決定並落實正式地圖、音檔及圖片的授權與儲存方式。
