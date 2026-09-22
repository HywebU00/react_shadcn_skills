# 元件無障礙與 ARIA／鍵盤矩陣

這份參考只在使用對應元件時讀取。表格描述的是套用本 skill 的目標專案最低契約；若目標專案的原生 HTML 能提供更完整的行為，優先使用原生 HTML。

## 表單與選擇控制項

| 元件 | 語意與名稱 | 必要狀態／關聯 | 鍵盤與注意事項 |
| --- | --- | --- | --- |
| Field／Form | `form` 可用 `aria-labelledby` 命名；群組用 `fieldset`／`legend` | 子欄位各有 `id`、`name`、label；提示／錯誤用 `aria-describedby` | 送出、錯誤摘要、第一個錯誤焦點可完成 |
| Input／Textarea | 原生 `input`／`textarea` 與可見 label | `required`、`aria-invalid`、`aria-describedby` 依狀態同步 | 不用 placeholder 取代 label |
| Label | 原生 `label` | `for` 必須指向唯一控制項 id | 點 label 能聚焦或切換控制項 |
| Native Select | 原生 `select` | `label`、`required`、`aria-invalid`、`aria-describedby` | 保留瀏覽器原生方向鍵與 Home／End |
| Select | 若可行改用 Native Select；自訂版是 combobox/listbox 契約 | `aria-expanded`、`aria-controls`、目前值、option selected | 方向鍵、Enter、Escape、Home、End；關閉後焦點回 trigger |
| Combobox／Command | 輸入控制項 `role="combobox"` | `aria-expanded`、`aria-controls`、`aria-autocomplete`；清單 `listbox`，項目 `option` | 方向鍵移動、Enter 選取、Escape 關閉；目前項目用 `aria-activedescendant` 或 roving tabindex |
| Checkbox | 優先原生 checkbox | `checked`／`indeterminate`、label、invalid／describedby | Space 切換；群組選項用 fieldset／legend |
| Radio Group | `fieldset`／`legend` 與原生 radio 優先 | 同組共用 name；每個 radio 有 label；錯誤關聯群組 | 方向鍵移動，Tab 進入目前選項 |
| Switch | 原生 checkbox 或 switch primitive | `aria-checked` 只用於自訂 switch；名稱與狀態一致 | Space／Enter 切換；不要用文字顏色表達狀態 |
| Toggle／Toggle Group | button；群組依需求使用 group 或 toolbar | `aria-pressed`；群組有名稱；目前模式可用 selected | Space／Enter；toolbar 才使用方向鍵與 roving tabindex |
| Slider | 原生 range 優先；自訂使用 `role="slider"` | `aria-valuemin`、`aria-valuemax`、`aria-valuenow`、名稱、orientation；鍵盤焦點必須在可見 thumb 上有高對比指示 | 方向鍵、Home、End、PageUp／PageDown；值也要有文字呈現；若實際焦點落在隱藏 input，需把 `:focus-visible` 樣式轉呈到 thumb |
| Input OTP | 一組輸入控制項或明確的 composite widget | 群組名稱、每格可辨識 label 或完整說明；錯誤／提示關聯 | 不阻擋貼上、刪除與螢幕閱讀器輸入；不可只靠 aria-label 數字化命名 |
| Questionnaire | 問題用 fieldset／legend 或具名區域 | 問題說明、選項群組、錯誤、目前步驟與條件區塊有關聯 | 選項可用 Tab／方向鍵；下一步與錯誤焦點順序一致 |

## 展開、彈出與對話框

| 元件 | 語意與名稱 | 必要狀態／關聯 | 鍵盤與注意事項 |
| --- | --- | --- | --- |
| Accordion／Collapsible | button + 可展開內容 | 觸發器動態 `aria-expanded`、唯一 `aria-controls`；內容必要時用 `aria-labelledby` | Enter／Space 切換；收合內容使用 `hidden`／`inert` 移出無障礙樹與 Tab；一般 disclosure 焦點留在 trigger；只有 accordion 模式才加入方向鍵與 roving tabindex |
| Dialog | `role="dialog"`、可見標題 | `aria-modal="true"`、`aria-labelledby`、必要時 `aria-describedby` | 開啟移焦點、Tab 不離開、Escape 關閉、關閉後還原 |
| Alert Dialog | `role="alertdialog"` | 同 dialog，且有明確確認／取消名稱 | 初始焦點放安全操作；不可無名稱或只用 icon |
| Drawer／Sheet | 視 modal 或非 modal 選擇 dialog 語意 | label、description、modal 狀態與具名的可見 close button；圖示按鈕需有文字名稱 | 開啟焦點進入 modal；簡單內容可聚焦 close button，複雜內容聚焦標題／第一段；Escape、關閉還原焦點；遮罩關閉只能作為補充；窄螢幕不可裁切 |
| Popover | 非 modal 補充或互動內容 | trigger `aria-expanded`、`aria-controls`；互動內容要有名稱 | Escape 關閉；非必要提示不搶焦點 |
| Hover Card／Tooltip | 補充資訊 | trigger 用 `aria-describedby`；Tooltip 不承載必要內容 | 滑鼠、鍵盤 focus 都可取得；Escape 可關閉；不設 focus trap |
| Dropdown Menu | `menu`／`menuitem` | trigger `aria-expanded`、`aria-controls` | 方向鍵、Home、End、Escape；選取後焦點回 trigger |
| Context Menu | `menu`／`menuitem` | 右鍵觸發器與選單有名稱 | Shift+F10／Context Menu 鍵也能開啟；Escape 關閉 |
| Menubar | `menubar`、子項 `menuitem` | 展開狀態、submenu controls 與名稱 | 方向鍵依水平／垂直方向移動；Escape 回上一層 |

## 導覽與選取

| 元件 | 語意與名稱 | 必要狀態／關聯 | 鍵盤與注意事項 |
| --- | --- | --- | --- |
| Navigation Menu | `nav` 或 navigation landmark | `aria-label`；展開控制的 expanded／controls | Tab 進入，方向鍵或 Enter 依元件契約；不可誤用 menu |
| Breadcrumb | `nav aria-label="breadcrumb"` | 目前頁 `aria-current="page"`；separator 隱藏 | links 可正常 Tab；目前頁不可假裝可點 |
| Pagination | `nav aria-label` + list | 目前頁 `aria-current="page"`；上一頁／下一頁有名稱與 disabled 狀態 | 順序與頁碼一致；不可只用 icon |
| Tabs | `tablist`、`tab`、`tabpanel` | `aria-selected`、`aria-controls`、`aria-labelledby`；tabpanel 預設不加入 Tab 順序，需要時才明確使用 `tabindex="0"` 並提供可見 focus indicator | 方向鍵切 tab；Tab 從目前 tab 移到下一個實際可操作控制項；若 panel 明確可聚焦，再驗證 Tab 可進入及離開；selection model 要一致 |
| Calendar／Date Picker | grid、row、gridcell 或 primitive 提供的日期語意 | 每日按鈕有完整日期名稱；選取／今天／disabled 狀態同步 | 方向鍵移動日期，PageUp／Down 換月，Escape 關閉 popover |
| Carousel | 有名稱的 region 或 carousel | 上／下一頁按鈕有名稱；目前 slide 狀態；自動播放提供 pause | 不自動搶焦點；不以 live region 播報每次移動 |
| Sidebar | navigation landmark 或具名 region | 收合 button 的 `aria-expanded`、`aria-controls`；目前項目 current | Escape／快捷鍵行為要有替代方式；收合後隱藏內容不可聚焦 |

## 內容、狀態與資料

| 元件 | 語意與名稱 | 必要狀態／關聯 | 鍵盤與注意事項 |
| --- | --- | --- | --- |
| Alert | `role="alert"` 僅用於重要即時訊息 | 標題與描述在同一語意區域 | 不重複播報；一般靜態提示不要使用 alert |
| Toast／Message／Bubble | status、log 或一般文字依用途選擇 | `aria-live="polite"` 僅用於需要通知的更新 | 不在每次按鍵時更新；提供可操作的 close button 名稱 |
| Spinner | `role="status"` 或可見文字 | `aria-label`／文字「載入中」；完成後移除或更新 | 不讓 spinner 成為唯一頁面內容名稱 |
| Progress | `progressbar` 或原生 progress | `aria-valuemin`、`aria-valuemax`、`aria-valuenow`、名稱 | 值也可用文字顯示；不只用顏色 |
| Chart | `figure`／`figcaption`、文字摘要或表格 | SVG／canvas 裝飾元素隱藏，資料摘要可讀取 | 不要求讀屏器解析圖形；提供等價資料 |
| Table／Data Table | `table`、caption、`thead`、`th scope` | header 與 data cell 關聯；排序狀態要有名稱／狀態 | 大型資料表提供分頁／捲動名稱；不要用 div 假造表格 |
| Card／Empty／Item | 原生 section、heading、list／listitem 依內容 | 有內容標題才使用 heading；操作按鈕有名稱 | 不把每張卡片都加 `role="region"`，除非有名稱且有導覽價值 |
| Badge／Marker／Kbd | 純文字或原生 `mark`／`kbd` | 文字本身包含狀態或快捷鍵意義 | 不任意加 status、button 或 heading role |
| Separator | 裝飾分隔線使用 `role="presentation"` 或隱藏 | 有語意的分隔線才用 `role="separator"` | 裝飾線不可打斷閱讀順序 |
| Skeleton／Aspect Ratio | 裝飾或載入佔位 | skeleton 通常 `aria-hidden`；載入狀態由 status／文字提供 | 不讓佔位區取代實際內容名稱 |
| Avatar | `img` 有 alt；裝飾圖片 alt 空字串 | fallback 文字可讀取；不要把圖片與 fallback 重複讀兩次 | 不以頭像作唯一身份名稱 |
| Attachment | 清單項目與檔名、狀態、操作 | 上傳中／完成／失敗用 status 或明確文字 | 操作按鈕可 Tab，刪除／下載名稱完整 |
| Direction | 文字方向由 provider 或 `dir` | RTL／LTR 範圍正確，不把 direction 當名稱 | 方向切換控制需有名稱與狀態 |
| Scroll Area | 有名稱且必要時 `role="region"` | `aria-label`／`aria-labelledby`；只有需要時設 tabindex=0 | 鍵盤可捲動；不重複建立巢狀焦點區域 |
| Resizable | split pane 與 separator | separator `aria-orientation`、`aria-valuenow`、min/max、名稱 | 方向鍵／Home／End 調整；更新值可讀取 |
| Input Group | named group 僅在前後綴與輸入確實是一組 | add-on icon `aria-hidden`；輸入仍有 label | 不以 group 取代輸入的 label |
| Button Group | group 或 toolbar 依操作關係 | 群組有名稱；每顆 button 有可存取名稱 | 一般 group 保持 Tab；toolbar 才採 roving tabindex |
| Typography | 原生文件語意與正確 heading 階層 | heading 不跳級；blockquote、list 使用原生元素 | 不用 CSS 大小假造 heading |

## 通用 ARIA 檢查

- 所有 `aria-labelledby`、`aria-describedby`、`aria-controls`、`aria-errormessage` 都必須指向目前 DOM 中存在且唯一的 id。
- `aria-expanded`、`aria-selected`、`aria-checked`、`aria-pressed`、`aria-current`、`aria-disabled` 的值要隨狀態更新；可用原生屬性時優先原生屬性。
- `aria-hidden="true"` 的元素及其後代不可保留焦點、互動或必要文字；需要整區移除互動時使用 `hidden` 或 `inert`。
- `aria-live` 只放在穩定的 live region；不要把整個頁面或輸入控制項設成 live。
- `aria-label` 會取代可見文字，不可在有更好的可見名稱時任意覆蓋；可見文字改變時同步檢查 accessible name。
- 不使用未知、過時或只為了讓掃描工具安靜而添加的 role／attribute。每個 ARIA 都要能說明它補足哪個原生語意或互動狀態。
