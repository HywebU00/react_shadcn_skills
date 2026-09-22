---
name: project-design-system
description: 為 React + shadcn 專案新增或修改頁面、表單、UI 元件、響應式樣式或 Figma／PSD／圖片設計轉碼時，套用目標專案的 design tokens、shadcn 元件、語意化 HTML、ARIA、鍵盤與表單無障礙規格。純業務邏輯或非 React + shadcn 專案不適用。
---

# React + shadcn 設計系統與無障礙規範

這個 skill 可交付到不同的 React + shadcn 專案，適用於目標專案的新頁面與共用元件。它是開發規範，不是自動認證工具；實際的 DOM、ARIA、互動與樣式必須由元件程式碼實作，完成後仍要用瀏覽器、無障礙樹與掃描工具驗證。

## 快速使用

將整個 skill 資料夾放到目標專案的 `.agents/skills/project-design-system/`，接著直接描述要建立或修改的頁面，並提供 Figma、PSD、JPG、截圖或文字需求即可。使用時不需要先建立 `src/design-system/`，也不需要先遷移舊頁面。

每次工作的最小流程是：

1. 自動找出目標專案的 shadcn 設定、元件輸出目錄、tokens、CSS 入口與頁面路由。
2. 先使用目標專案既有元件和設計規則；只有找不到對應能力時才使用 CLI／MCP 加入元件。
3. 依本 skill 建立語意化 DOM，再檢查 ARIA、鍵盤、focus、響應式與實際間距。
4. 完成後回報實際沿用的設計來源、使用的元件、已驗證項目與仍需人工確認的設計假設。

若自動偵測不到正式來源，不得直接猜測路徑或建立第二套設計系統；先從 `package.json`、`components.json`、CSS 入口和現有頁面找出可用資訊，仍無法判定時再請使用者指定來源。

## 使用範圍與來源

- 先確認目標專案的 `package.json`、`components.json`、Tailwind／CSS 入口、import alias、design-system 入口與 shadcn 元件輸出目錄；以下文件路徑都是示例，不得直接假設每個專案相同。
- 以目標專案實際的 tokens、patterns、共用 CSS 與元件 API 作為 source of truth。若專案沒有正式的 design-system 入口，先從現有 tokens、主題 CSS、元件變體與頁面 layout 整理可沿用的規則，再決定是否需要新增共用層。
- shadcn 原子元件使用目標專案設定的輸出目錄；`src/components/ui/` 只是常見預設路徑，也可以是元件檢視或無障礙測試目錄，不是本 skill 的固定要求。不要複製另一套元件或為了套 ARIA 而改寫 Base UI 行為。
- 若目標專案已有 Context Menu wrapper，使用該 wrapper，不要直接把 Base UI 原始 Trigger 放進頁面；若沒有 wrapper，先檢查產生的 Trigger 是否可 Tab 聚焦並支援 Enter、Space、Shift+F10 與 Context Menu 鍵，再決定共用修正位置。
- 視覺數值來自目標專案的 tokens；fieldset 等共用外觀修正集中在目標專案的共用 CSS 或元件層，不要在單頁補同一套 CSS。
- 需要新元件時可使用目標專案已設定的 shadcn CLI 或 MCP。CLI／MCP 只負責產生或加入元件，不保證本 skill 的 ARIA、鍵盤、focus 與版面契約；加入後必須依本文與 [ARIA／鍵盤矩陣](references/accessibility-aria.md) 檢查實際輸出的 DOM。

## Figma 排版與 shadcn 行為的分工

預設將 Figma 視為「排版參考」，除非使用者明確要求重現 Figma 視覺。排版參考只包含語意區塊、內容順序、欄列關係、對齊方式、同列／換列規則與響應式轉換；顏色、字體、字級、圓角、陰影、邊框、膠囊造型、裝飾線與控制項外觀一律由目標專案的 design system 和 shadcn 元件決定。

- 不得直接採用 Figma 產生的 JSX、Tailwind class、固定 `min-width`、固定高度或自訂控制項樣式；先把它們轉成版面規則，再使用 tokens 與既有元件實作。
- 在開始寫 JSX 前，先建立一份簡短的版面對照：區域名稱、DOM 語意、欄數、欄位順序、同列關係、條件顯示內容與窄版換列方式。這份對照是 Figma 的唯一實作輸入。

- Figma 主要決定頁面構圖、欄寬、間距、色彩、字級、卡片層級、header、stepper 與 footer；不要因為使用 shadcn 就把整頁改成元件預設排列。
- shadcn／原生 HTML 主要提供表單控制項與互動契約，例如 `input`、`select`、`radio`、`checkbox`、`button`、`dialog`；控制項只能透過外層 `grid`／`flex`、tokens 或既有 variant 放入版面，不得為了貼合設計稿而重做控制項。
- 非表單區域優先以語意 HTML 加 Tailwind／design tokens 重建，不為了套用 Card、Button 或自訂 widget 而改變 Figma 的資訊階層。
- Figma 視覺與鍵盤、ARIA 或原生語意衝突時，保留可操作與可讀取的無障礙行為，再調整外層視覺；不得用 `div`、CSS 假控制項或絕對定位犧牲語意。
- 品牌 Logo、照片或必要插圖使用可追蹤的本地資產；沒有可用資產時先使用有意義的文字替代，不能依賴會過期的 Figma 預覽 URL。

### Figma 排版模式的元件映射檢查

每一個 Figma 控制項在寫入頁面前必須完成以下映射：

1. 先找目標專案已有的 shadcn 元件與公開 API；找不到時才使用原生 HTML。
2. 確認元件實際輸出的 DOM、可存取角色、focus 行為與 children／props 用法；不得從外觀猜測 wrapper API。以 `NativeSelect` 為例，若元件本身會輸出原生 `<select>`，只能傳入 `NativeSelectOption`，不可再巢狀放入另一個 `<select>`。
3. 用外層 layout 表達 Figma 的欄位關係；同列欄位用 `grid`，同列操作列用 `flex`，不要改寫元件內部結構。
4. 只有在 design system 已有對應 token 或 variant 時才套用視覺值；沒有對應規格時保留 shadcn 預設外觀。
5. 完成首輪畫面後，反向檢查頁面中是否出現 Figma-only 的膠囊、藍色整列標題、裝飾垂直線、重疊定位或未由 token 定義的尺寸；若有，移除或改用既有元件規格。

## Figma 轉碼的效率界線

- 每個頁面先取得一次 Figma 節點內容，整理成頁面骨架、欄位清單、互動狀態與視覺 token；不要為了相同資訊反覆抓取同一節點。
- 先完成可執行的語意頁面，再做一輪 build、桌面／窄版畫面與鍵盤／AX smoke test。非阻塞性的像素差異列為待確認項目，不反覆重跑整頁流程。
- 只有在驗證發現明確的功能、溢位、重疊、焦點或語意錯誤時才進行第二輪修改；每輪修改都要說明對應的驗證結果。

## 移植到既有 React + shadcn 專案

- 先辨識既有元件、tokens 與 CSS 的正式來源，再把本 skill 的規則映射到那些來源；不要把目前專案的資料夾名稱、class name 或元件 API 當成通用介面。
- 若既有元件已被客製化，保留其公開 API 與視覺規格，先檢查它的實際 DOM 和鍵盤行為，再補必要的共用無障礙修正。
- 既有上線頁面不需要因為導入 skill 而整批遷移。新頁面從本流程開始，並使用既有 design-system；只有共用元件的修正會影響既有使用端時，才先評估回歸風險。
- 若目標專案不是 React + shadcn，或無法取得其元件與樣式來源，停止套用本 skill，先補足專案資訊，不要猜測元件行為。

## 建立頁面的強制流程

建立新頁面或把 Figma／PSD／圖片轉成頁面時，必須在寫 JSX、CSS 或加入元件前完成以下順序；不能先做出頁面再把本 skill 當成事後檢查表：

1. 先讀取本 skill，再依目標專案實際路徑讀取 design-system 入口、tokens、共用 CSS、patterns 與元件 API，確認可用的設計規則與無障礙契約。
2. 先列出頁面的語意骨架、欄位群組、互動狀態、鍵盤流程、可存取名稱與每一層的間距責任，再完成 Figma 版面對照，最後把每一個需求映射到既有 shadcn 元件；找不到對應元件時，先確認是否能使用原生 HTML，再評估共用層新增 variant。
3. Figma 頁面先依版面對照建立非表單區域與表單控制項：前者用語意 HTML／layout／tokens 表達排列，後者用 shadcn／原生控制項實作；禁止把 Figma 視覺細節直接轉成單頁 class。頁面不得自行複製元件、繞過目標專案的 design-system，或用單頁 CSS 修正本應由共用元件處理的無障礙與外觀規則。
4. 每個新互動元件在提交前，至少驗證一次可存取名稱、角色、狀態、鍵盤操作、焦點回復與窄螢幕排列；完成後再做整頁的瀏覽器與建置檢查。

若頁面是在本流程建立前已存在，先把它視為待遷移頁面：新增內容仍必須從第 1 步開始，既有區塊則分批對照本 skill 修正與驗證；不能以「舊頁面」作為新功能跳過規範的理由。

## 規則讀取範圍

- 本文的語意 HTML、設計來源、版面責任、fieldset／legend、ARIA、focus、鍵盤與驗收規則，每次建立或修改頁面都必須遵守。
- [ARIA／鍵盤矩陣](references/accessibility-aria.md) 依實際使用的元件讀取；沒有使用該元件時，不需要把整份矩陣套到頁面上。
- 只有在目標專案已有特殊工具、元件行為或設計規格時，才讀取並遵守該專案自己的補充文件；補充文件不能降低本 skill 的最低無障礙要求。

## 展開／收合與鍵盤遊走

所有會顯示、隱藏或切換內容的設計，都必須先判定它是簡單 disclosure、accordion、menu、popover、dialog、drawer 或其他複合元件，再套用對應的鍵盤模型；不能只用 CSS 顯示切換或把所有情況都當成 accordion。

- 簡單展開／收合的觸發器優先使用原生 `button`，具有可理解的名稱、動態 `aria-expanded="false|true"`，並以唯一的 `aria-controls` 指向實際內容容器。
- `aria-expanded` 只放在真正控制展開狀態的觸發器上；不可固定寫成 `true`，也不可只更新 `data-state` 或顏色而不更新 DOM／ARIA 狀態。
- 收合時，內容及其後代必須使用 `hidden`、`inert` 或等效方式移出無障礙樹與 Tab 順序；不可用 `visibility`、透明度、負定位或 `tabindex="-1"` 代替整組隱藏。
- 展開時，Tab 順序必須從觸發器進入內容中的第一個可操作控制項，再依 DOM 與視覺順序前進；不得先跳到後方內容，也不得讓隱藏內容插入順序。
- 一般 disclosure 展開或收合後焦點留在觸發器；不要自動把焦點移到內容標題或第一個欄位，除非該元件的互動模式明確要求移焦點。收合後不得把焦點留在已隱藏的後代。
- 簡單 disclosure 不攔截方向鍵；只有 accordion、menu、tabs 等明確的複合模式才實作該模式規定的方向鍵、Home、End 與 roving tabindex。
- 巢狀展開內容只有在資料層級不同時才使用；每一層使用不同的控制器與內容 id，保持 DOM 順序，不使用正值 `tabindex` 或以滑鼠位置決定鍵盤順序。
- 若設計稿只畫出箭頭或圖示，仍要提供可見或視覺隱藏的操作名稱；圖示本身設為 `aria-hidden="true"`，不能讓圖示成為唯一名稱。
- 驗收時至少測試：關閉狀態 Tab 不會進入內容、Enter／Space 可切換、`aria-expanded` 會同步、展開後 Tab 進入第一個內容控制項、收合後焦點回到觸發器，且 Escape／方向鍵只在該元件模式需要時攔截。

## 設計來源格式

- **Figma**：若目標環境提供 Figma 工具，先讀取 `figma-design-to-code` skill，再取得節點內容。使用者指定「只參考排版」時，Figma 只用來確認內容、資訊階層、構圖與欄列關係；實作時映射到目標專案的 tokens、shadcn 元件與語意化 HTML，不直接貼上 Figma 產生的 Tailwind、視覺數值或自訂元件。
- **PSD／截圖／圖片**：只作為視覺參考，先辨識文字、控制項、狀態與響應式關係，再以真實 DOM 和 shadcn 元件重建。圖片內的文字不能取代 HTML 文字或表單 label；資訊圖片要有合適的 `alt`，裝飾圖片使用空 `alt` 或 `aria-hidden="true"`。
- **資產**：只有確實需要的品牌或內容圖片才加入目標專案的資產目錄（例如 `src/assets/`），使用可追蹤的本地檔案；不可依賴會過期的預覽 URL、base64 或暫存路徑。載入資產不應改變既有元件的互動、焦點或無障礙名稱。

## 頁面間距與排版

- 先建立頁面骨架再放入元件：`header`、`main`、內容容器、區段與操作列要有清楚的 DOM 順序；不要靠絕對定位把控制項疊到文字、邊框或分隔線上。
- 頁面容器使用單一的 `width`、`max-width`、水平 gutter 與 `margin-inline: auto` 規則；同一頁的主要區段沿用相同容器，不讓每張卡片各自決定左右基準線。
- 間距只使用設計系統 tokens 或 shadcn／Tailwind 的 spacing scale。相同層級的區段、卡片、欄位與操作列使用一致的垂直節奏；需要新間距時先增加共用 token，不在頁面 CSS 散落 magic number。
- 間距要有明確的責任層級，不把所有內容直接堆在同一個容器：頁面區段由 section／layout 的 `gap` 負責，Card 標題與說明由 `CardHeader` 負責，Card 標題區與內容區由 Card 本身負責，欄位的 label 與控制項由欄位 wrapper 負責，同列控制項由自己的 `flex`／`grid` `gap` 負責。父層間距不得被當成欄位內部間距使用。
- 每個 `label + input`、`label + select`、`label + textarea` 或說明文字與控制項的組合，都要有明確的欄位 wrapper（通常使用 `flex flex-col gap-2` 或等效的設計系統 pattern），並保留 `w-full`、`min-width: 0` 等必要的版面約束；不要讓 label 緊貼控制項，也不要用空白文字、`<br>`、負 margin 或絕對定位製造間距。
- 共用 fieldset reset 只能處理 `min-inline-size`、框線與 padding；不要用高權重的 `margin: 0` 蓋掉頁面 `space-y-*` 或 layout `gap`，否則條件欄位與下一組選項會黏在一起。修改 reset 後要用瀏覽器 computed style 和 bounding box 確認實際垂直間距。
- 原生 `legend` 有瀏覽器特殊排版行為，不要假設它會像一般 grid／flex 子元素自動與控制項同列。若題目文字需要與 radio／checkbox 同列，保留第一個子元素為語意 `legend`（可視覺隱藏），再用 `aria-hidden="true"` 的純視覺文字放入外層 grid；不要重複可存取名稱，也不要用絕對定位把 legend 疊到控制項上。
- 建立元件檢視卡或頁面範例時，先分辨外層卡片間距、標題／說明間距、欄位內部間距與同列控制項間距，再逐層套用 spacing token。完成後用瀏覽器檢查實際 bounding box，確認 label 到控制項、控制項到提示文字的距離一致，並確認不同元件的高度與對齊不因內容而高低不一。
- 複合元件若把實際焦點放在隱藏或定位的原生控制項（例如 Slider 的 `input[type="range"]`），不可只在外層視覺 thumb 寫 `focus-visible`；要用 `:has( :focus-visible)` 或元件提供的 focus state 將焦點樣式呈現在可見控制項上，並以足夠對比的 border／ring 通過鍵盤人工檢查。
- 表單與資料列優先用 `grid` 表達欄位關係，用 `flex` 處理同列的按鈕、選項或工具列。欄位容器加上 `min-width: 0`，控制項使用 `width: 100%` 或明確的 grid 欄寬，避免長 label、提示文字或 select 撐破版面。
- 同一列的 input、select、button 與自訂控制項保持相同高度與對齊方式；不要用負 margin、重疊定位或獨立 transform 修正視覺位置。左右成對欄位要共用欄寬與 gap，窄螢幕再依序堆疊。
- 圖示＋文字的資訊列要明確決定對齊責任：單行內容可使用 `items-center`；可能換行的內容使用 `items-start`，圖示固定 `shrink-0` 並以一致的第一行文字偏移對齊（例如 `mt-2`）。不要用過小的 `mt-0.5` 讓 16px 圖示貼在 36px 文字列頂端，也不要讓圖示因內容寬度被壓縮。
- 條件顯示內容（例如選擇「有」後出現的子欄位）要包成獨立的 layout group，使用自己的 `grid`／`gap`，不能讓巢狀問題與欄位直接貼在一起；隱藏狀態仍使用 `hidden`／`inert` 移出閱讀與 Tab 順序。
- 兩欄中的每個欄位若本身還有「label＋control」內部欄位，必須依內容寬度提前切換成單欄；不要等到最小手機斷點才切換，避免平板寬度出現右側欄位被擠出、裁切或水平溢位。
- Card、fieldset、legend 與提示文字的內外距要分工：Card 由 shadcn 的 `CardHeader`／`CardContent` 負責，fieldset 只負責語意與群組，頁面 CSS 不得重複加原生框線、預設縮排或第二套 padding。
- 版面完成後至少檢查 320、390、768、1440 CSS px，以及內容換行、控制項高度、焦點 ring、錯誤訊息、彈出層和水平捲動；確認任何按鈕、箭頭、下拉控制或分隔線都沒有互相覆蓋，再回報完成。
- Figma 排版模式的桌面驗收必須確認所有設計要求同列的區塊真的位於同一列，Stepper 或導覽項目不可因固定最小寬度被裁切；若窄版採水平捲動，必須是明確且可操作的設計決定，不能由內容溢位意外產生。
- 用瀏覽器實際 bounding box 和 `document.body.scrollWidth` 檢查版面；1440、768、390 CSS px 都要確認沒有非預期的水平溢位、文字截斷、label 換行破壞欄位關係或控制項重疊。`lint`／`build` 通過不能取代這項視覺檢查。

## 核心原則

1. **原生 HTML 優先**：先用 `button`、`a`、`input`、`select`、`textarea`、`form`、`fieldset`、`table` 和正確的 heading；只有原生元素無法表達時才使用 ARIA。
2. **可存取名稱不可省略**：每個互動控制項、地標、對話框、群組與表格都要有可理解且唯一的名稱。優先用可見文字與 `aria-labelledby`；`aria-label` 只在沒有可見名稱時使用。
3. **不要重複語意**：原生 `fieldset` 不再加相同用途的 `role="group"`；原生 button 不加 `role="button"`；裝飾 icon 使用 `aria-hidden="true"`，不能把可聚焦元素或其祖先設為 `aria-hidden`。
4. **label 與 button 分工**：`label` 只用來命名及關聯 `input`、`select`、`textarea`、checkbox 或 radio 等表單控制項；文字本身要執行展開、開啟、切換、送出、刪除或其他動作時，使用 `button`（導覽使用 `a`）。不要用 `label` 冒充動作觸發器，也不要為了讓文字可點擊而把 `button` 放進 `label`。自訂 checkbox、radio、switch 若由 shadcn/Base UI 提供 `role`、狀態與鍵盤行為，保留該控制項並用 `aria-labelledby` 或正確的 label 關聯命名。
5. **狀態必須同步 DOM**：展開、選取、按下、勾選、忙碌、無效、停用、目前頁面與彈出狀態，必須反映在對應的原生屬性或 ARIA state/property；不能只改顏色或 data attribute。
   - 受控 radio／checkbox／switch／toggle 必須在變更回呼更新 state，再把最新值傳回元件；不可使用空的 `onValueChange` 或固定 `value`，造成方向鍵只移動焦點、Space 確認後狀態又被還原。
   - 真正的展開／收合觸發器要讓 `aria-expanded` 隨狀態動態切換 `false`／`true`，必要時同步 `aria-controls`；不可把 `aria-expanded="true"` 硬編碼在初始狀態。原生 `select`、tabs、tooltip、hover card 與 context menu 應使用各自的原生或 ARIA 語意，不要為了看起來像展開而強行加上 `aria-expanded`。
6. **焦點可見且可預期**：不可使用正值 `tabindex`；保留 `:focus-visible`；彈出層開啟後移動焦點、關閉後還原到觸發器，且不把焦點留在隱藏內容。
7. **文字與操作不靠顏色、placeholder 或 hover**：必要說明、錯誤與操作名稱必須能由文字或輔助科技取得；placeholder 不能取代 label。

## 表單、fieldset 與錯誤

- 單一控制項使用 `label[for]` 與唯一 `id`；複合欄位或同一問題的選項才使用 `fieldset`／`legend`。
- 選項即使以膠囊、卡片或按鈕外觀呈現，只要語意是單選就使用 radio；題目放在 `legend`，每個選項保留自己的 label／可存取名稱，不要用一般 `button` 模擬 radio。
- `fieldset` 的第一個子元素必須是簡潔的 `legend`。legend 說明群組，子控制項仍各自保留 label、`id` 與 `name`。
- 巢狀 fieldset 只有在資料歸屬不同時使用；每一層 legend 都要有不同責任範圍，不增加重複標題、框線、縮排或 `role="group"`。
- 視覺區段標題（例如「雙親資料」或「養父母資料」）優先使用 `section` 搭配 `h2`；不要因為 Card 有標題就一律再包一層 fieldset。若改用可見 `legend` 作為區段標題，就不要同時輸出相同用途的 `h2`。
- 條件顯示的同一筆資料（例如父親、母親或配偶）可用外層 fieldset 命名資料歸屬，內層再分成「條件選擇」與「詳細資料」兩個 fieldset；只有在每層都提供不同閱讀上下文時才巢狀，legend 要避免重複人物名稱。
- 必填欄位提供可見文字「必填」或等價說明；原生控制項使用 `required`，自訂 widget 使用 `aria-required="true"`，並確保驗證狀態與文字一致。
- 說明文字、格式提示與錯誤使用穩定且唯一的 id，透過 `aria-describedby` 關聯；錯誤控制項加 `aria-invalid="true"`。若使用 `aria-errormessage`，必須同時有 `aria-invalid="true"` 且指向實際存在的錯誤節點。
- 送出失敗提供可見的 Error Summary；摘要本身可被命名，摘要連結能聚焦對應控制項，並將焦點移到摘要或第一個錯誤。
- 設計要求隱藏 label 時只能用視覺隱藏 class；不可刪除 label、使用 `display:none`、`hidden`、`aria-hidden` 或只依賴 placeholder。
- 條件欄位以控制題群組與顯示內容群組分開；隱藏時使用 `hidden`／`inert` 或等價方式移出閱讀與 Tab 順序，重新顯示後恢復正確順序。

## ARIA 與互動契約

實作或修改元件時，先讀取 [ARIA／鍵盤矩陣](references/accessibility-aria.md) 中對應項目。常見契約如下：

- disclosure／accordion／collapsible：觸發器是 button，提供 `aria-expanded` 和 `aria-controls`；內容區域只在有必要的語意名稱時使用 `aria-labelledby`。
- dialog／drawer／sheet／alert dialog：提供 `role`、`aria-modal`、`aria-labelledby`、`aria-describedby`；Drawer／Sheet 必須提供可見且有名稱的關閉按鈕，圖示按鈕要有視覺隱藏文字或 `aria-label`，圖示本身設為 `aria-hidden`；Escape 與遮罩關閉只能作為補充；一般 dialog 可取消，alert dialog 需明確的確認／取消操作；開啟、Escape、關閉後的焦點流程完整。
  - modal 開啟時初始焦點必須進入 modal；簡單且以關閉為主要操作的 Drawer／燈箱可聚焦關閉按鈕，內容複雜或很長時改聚焦可讀的標題／第一段內容（`tabindex="-1"`），不可把整個 dialog 容器當成預設焦點目標。
- tabs：`tablist`、`tab`、`tabpanel` 成對關聯；tab 使用 `aria-selected`、`aria-controls` 和正確 roving `tabindex`，tabpanel 使用 `aria-labelledby`。tabpanel 預設不加入頁面 Tab 順序；只有需要鍵盤直接進入沒有可聚焦子內容的純內容時，才由頁面明確指定 `tabIndex={0}`，並提供可見 `:focus-visible` 樣式。驗證從目前 tab 按 Tab 會移到下一個實際可操作控制項，方向鍵仍能切換 tab。
- menu／menubar／context menu：使用正確的 `menu`／`menuitem` 語意與方向鍵、Home、End、Escape 行為；Context Menu 觸發器必須可 Tab 聚焦並支援 Enter、Space、Shift+F10 與 Context Menu 鍵；一般網站導覽不要誤用 menu。
- combobox／select／command：優先原生 `select`；自訂 combobox 必須同步 `role="combobox"`、`aria-expanded`、`aria-controls`、目前值、listbox／option 與鍵盤選取狀態。
- checkbox／radio／switch／toggle／slider／progress：優先原生控制項；自訂控制項同步 checked、selected、pressed、value、min/max 或 invalid 狀態，且有可存取名稱。
- navigation／breadcrumb／pagination／sidebar：使用對應 landmark 或 nav 名稱；目前頁面以 `aria-current` 表達，導覽控制有明確 label。
- alert／status／toast／spinner：只在需要時使用 `role="alert"` 或 `aria-live`；避免每次按鍵或暫存更新打斷輔助科技。載入狀態要有文字或 `role="status"`，完成後移除或更新內容。
- table／data table／chart：表格有 caption、`th`、`scope` 或正確 header 關聯；圖表同時提供可讀的文字、表格或摘要，不能只依賴 SVG 或顏色。
- tooltip／popover／hover card：補充資訊不能是唯一的操作名稱或必要內容；Tooltip 不搶焦點、不設焦點陷阱，互動內容才使用合適的 dialog／popover 語意。
- decorative card、badge、separator、skeleton、icon：不任意加 landmark 或 role；純裝飾內容從無障礙樹隱藏，有意義內容使用原生標題與文字階層。

## 鍵盤與焦點驗收

- Tab 只進入可操作且目前可見的控制項；順序符合視覺與 DOM 順序，不使用正值 `tabindex`。
- Enter／Space 觸發 button、checkbox、switch、toggle 等相應動作；方向鍵、Home、End、PageUp／PageDown 只在相應 composite widget 實作。
- Escape 關閉可關閉的 dialog、menu、popover、tooltip 或 drawer，並把焦點還原到觸發器。
- 複合 widget 使用 roving tabindex 或 `aria-activedescendant`，目前項目與鍵盤移動狀態一致。
- 禁用控制項不可聚焦、不可操作；唯讀控制項仍可被讀取；載入或條件隱藏不可留下可聚焦後代。
- 檢查 320、390、768、1440 CSS px：焦點 ring、錯誤文字、提示、成對欄位與彈出層不得被裁切或產生水平溢位。

## 完成前驗收

1. 實際檢查 DOM 與無障礙樹：名稱、角色、值、狀態、關聯 id、目前焦點與閱讀順序正確。
2. 以鍵盤完成每個操作流程，包含開啟、選取、取消、錯誤、條件顯示與焦點還原。
3. 檢查表單 `label`、`fieldset`／`legend`、`aria-describedby`、`aria-invalid`、`aria-errormessage` 與 Error Summary 關聯。
4. 檢查動態內容是否使用適當的 `aria-live`／`role="status"`，且沒有不必要的每次更新播報。
5. 執行專案既有的 build、lint、瀏覽器互動與元件檢視頁掃描。這些檢查不能宣稱完整 WCAG 認證；若有未驗證項目要明確列出。

## 參考依據

- [ARIA／鍵盤矩陣](references/accessibility-aria.md)
- https://www.w3.org/WAI/tutorials/forms/
- https://www.w3.org/WAI/ARIA/apg/
- https://www.w3.org/TR/wai-aria-1.2/
- https://www.w3.org/TR/accname-1.2/
