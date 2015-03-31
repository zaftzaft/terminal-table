var Table = require("./");
require("colors");

var t = new Table({
  rightPadding: 3,
  leftPadding: 1
});

t.cell(0, 0, "Header".red);
t.cell(0, 1, "ヘッダ");
t.cell(1, 0, "hogehoge");
t.cell(1, 1, "いろはにほへと".green);
t.push(["alpha", "bravo"]);
t.cell(0, 2, "new");

console.log(""+t);
