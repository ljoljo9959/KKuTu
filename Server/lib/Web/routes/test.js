var fs = require("fs");

const list = "대한민국\n민주주의";
const listsplit = list.split(/[,\r\n]+/)
console.log(listsplit);
console.log(listsplit.join("\n"))

