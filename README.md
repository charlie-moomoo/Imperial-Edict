# 傳聖旨
使用Google Apps Script將最新Classroom公告傳到Google Chat群組。
# 如何設定
1. 準備一個學校帳號。 (只能是學校的，Gmail不行)
2. 建立一個新Google Chat群組。
3. 為那個群組建立一個Email地址([詳細方法見此](https://support.google.com/chat/answer/14929313?hl=zh-Hant))，並先留著備用。
4. [建立一個Google Apps Script](https://script.google.com/home/)。
5. 把[script.gs](https://raw.githubusercontent.com/charlie-moomoo/Imperial-Edict/refs/heads/main/script.gs)的程式碼貼進去。
6. 在旁邊「服務」的地方，把`Gmail API`和`Google Classroom API`加進去。 (不要改任何設定，就用預設)
7. 把第三步留著的Email填進第四行的`groupEmail`的引號裡面。
8. 上面下拉選單選`run`，然後點執行。
9. 它應該會彈窗叫你登入，就跟著它的步驟登入。
10. 登入好之後，下面會出現你所有課程的名稱和ID，如果有想要忽略的課程，請將ID填到第三行的`[]`裡面，以逗號分隔。<br><br>
現在，你的getConfig function應該會長的像這樣：
```js
function getConfig() {
  return {
    ignoredCourses: ["111111111111", "222222222222", "333333333333"], // Fill in the course IDs you want to ignore here
    groupEmail: "imperial-edict@example.com" // Set the email of the Google Chat group here
  }
}
```
11. 上面那個填好之後，一樣下拉選單選`run`，然後點執行。<br>
它會開始抓所有課程的最新訊息。
12. 在旁邊的「觸發條件」，點進去選「新增觸發條件」，<br>「選擇您要執行的功能」選`run`，<br>「選取時間型觸發條件類型」選「分鐘計時器」，<br>「選取分鐘間隔」選「每分鐘」。
13. 完成！之後你應該就會在Google Chat群組收到「聖旨」了。
# 一些有的沒有的問題
## 為什麼叫「傳聖旨」？
因為同學把「傳老師的話」叫做「傳聖旨」。
## 為什麼要做這個東西？
因為Classroom通知都不準時，但Google Chat通知每次都超準時。