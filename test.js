var Table = require("./");
require("colors");

var t = new Table({
  borderStyle: 3,
  horizontalLine: true,
  width: [20, "50%", "50%"],
  rightPadding: 0,
  leftPadding: 1
});

t.cell(0, 0, "Header".red);
t.cell(0, 1, "ヘッダ");
t.cell(1, 0, "hogehoge");
t.cell(1, 1, "いろはにほへと".green);
t.push(["alpha", "bravo"]);
t.cell(0, 2, "new");

t.attr(1, 1, {align: "center"});
t.attr(0, 0, {align: "right"});

t.attrRange({row: [0, 1]}, {align: "center"});
console.log(t.getRange(0, 0, "align"));

console.log(""+t);
