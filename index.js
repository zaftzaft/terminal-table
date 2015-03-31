var eaw = require("eastasianwidth");

function Table(options){
  this.table = [];
  this.rightPadding = options.rightPadding || 0;
  this.leftPadding = options.leftPadding || 0;
}


Table.prototype.space = function(n){
  return new Array(n + 1).join(" ");
};


Table.prototype.strlen = function(text){
  return eaw.length(text.replace(/\x1b\[[\d;]*m/g, ""));
};


Table.prototype.pad = function(text, n){
  text = this.space(this.leftPadding) + text + this.space(this.rightPadding);

  var l = this.strlen(text);
  if(n > l){
    text += this.space(n - l);
    //text = this.space(n - l) + text; right
  }
  return text;
};


Table.prototype.maxcell = function(column){
  var ps = this.leftPadding + this.rightPadding;
  var m = 0;
  for(var i = 0, l = this.table.length;i < l;i++){
    if(!this.table[i] || !this.table[i][column]){
      continue;
    }
    m = Math.max(m, this.strlen(this.table[i][column].text) + ps);
  }
  return m;
};


// Horizontal Length ->
Table.prototype.horlen = function(){
  return Math.max.apply(null, this.table.map(function(row){return row.length}));
};


Table.prototype.init = function(row, column){
  if(!this.table[row]){
    this.table[row] = [];
  }
  this.table[row][column] = {
    text: ""
  };
};


Table.prototype.cell = function(row, column, text){
  this.init(row, column);
  this.table[row][column].text = text;
};


Table.prototype.removeCell = function(row, column){
  this.init(row, column);
};


Table.prototype.removeRow = function(row, n){
  this.table.splice(row, n || 1);
};


Table.prototype.removeColumn = function(column, n){
  for(var i = 0, l = this.table.length;i < l;i++){
    if(!this.table[i]){
      continue;
    }
    this.table[i].splice(column, n || 1);
  }
};


Table.prototype.push = function(items){
  var row = this.table.length;
  for(var i = 0, l = items.length;i < l;i++){
    this.cell(row, i, items[i] || "");
  }
};


Table.prototype.output = Table.prototype.toString = function(){
  var text = "";
  var border = "+";
  var mcCache = [];
  var hlen = this.horlen();

  for(var i = 0, m;i < hlen;i++){
    m = mcCache[i] = this.maxcell(i);
    border += new Array(m + 1).join("-");
    border += "+";
  }

  text += border + "\n";

  var t = this.table;
  for(var row = 0, rowlen = t.length;row < rowlen;row++){
    text += "|";
    for(var column = 0, str;column < hlen;column++){
      str = (!t[row] || !t[row][column]) ? "" : t[row][column].text;
      text += this.pad(str, mcCache[column]) + "|";
    }
    text += "\n";
  }

  text += border;

  return text;
};


module.exports = Table;
