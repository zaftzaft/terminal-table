var eaw = require("eastasianwidth");

function Table(options){
  options = options || {};
  this.table = [];
  this.borderStyle = options.borderStyle;
  this.horizontalLine = options.horizontalLine || false;
  this.width = options.width || [];
  this.rightPadding = options.rightPadding || 0;
  this.leftPadding = options.leftPadding || 0;

  if(this.borderStyle === 0){
    this.border = options.border;
  }
  else if(this.borderStyle === 2){
    this.border = {
      sep: "│",
      topLeft: "┌", topMid: "┬", top: "─", topRight: "┐",
      midLeft: "├", midMid: "┼", mid: "─", midRight: "┤",
      botLeft: "└", botMid: "┴", bot: "─", botRight: "┘"
    };
  }
  else if(this.borderStyle === 3){
    this.border = {
      sep: "┃",
      topLeft: "┏", topMid: "┳", top: "━", topRight: "┓",
      midLeft: "┣", midMid: "╋", mid: "━", midRight: "┫",
      botLeft: "┗", botMid: "┻", bot: "━", botRight: "┛"
    };
  }
  else{
    this.border = {
      sep: "|",
      topLeft: "+", topMid: "+", top: "-", topRight: "+",
      midLeft: "|", midMid: "+", mid: "-", midRight: "|",
      botLeft: "+", botMid: "+", bot: "-", botRight: "+"
    };
  }
}


Table.prototype.space = function(n){
  return new Array(n + 1).join(" ");
};


Table.prototype.strlen = function(text){
  return eaw.length(text.replace(/\x1b\[[\d;]*m/g, ""));
};


Table.prototype.pad = function(text, n, align){
  var l = this.strlen(text);
  if(n > l){
    var d = n - l;
    if(align === 2){
      text = this.space(d) + text;
    }
    else if(align === 1){
      text = this.space((d / 2 | 0) + (d % 2)) + text + this.space((d / 2 | 0));
    }
    else{
      text += this.space(d);
    }
  }
  return text;
};


Table.prototype.format = function(row, column, size){
  var t = this.table;
  var str = (!t[row] || !t[row][column]) ? "" : t[row][column].text;
  var lp = this.space(this.leftPadding);
  var rp = this.space(this.rightPadding);
  var align = this.getAttr(row, column, "align");

  if(this.strlen(lp + str + rp) <= size){
    str = lp + str + rp;
  }
  if(this.strlen(str) > size){
    // ajust
  }

  return this.pad(str, size, align === "right" ? 2 : align === "center" ? 1 : 0);
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


Table.prototype.calcWidth = function(){
  var integer = [], percent = [];
  var screenWidth;
  var sum = function(){
    return integer.reduce(function(m, n){return m + n;}, 0);
  };

  for(var i = 0, l = this.horlen();i < l;i++){
    if(!this.width[i]){
      integer[i] = this.maxcell(i);
    }
    else if(1 <= this.width[i]){
      integer[i] = this.width[i] | 0;
    }
    else{
      percent.push(i);
    }
  }

  screenWidth = process.stdout.columns - sum();

  for(var p, i = 0, l = percent.length;i < l;i++){
    p = this.width[percent[i]];

    // "xx%" -> 0.xx
    if(/\d+%/.test(p)){
      p = parseInt(p, 10) / 100;
    }

    integer[percent[i]] = screenWidth * p;
  }

  var borderSize = this.horlen() + 1;
  if(percent.length && (process.stdout.columns < sum() + borderSize)){
    var bpl = borderSize / percent.length | 0;
    var ex = borderSize % percent.length;
    for(var d, i = 0, l = percent.length;i < l;i++){
      d = bpl;
      ex && (d += ex, ex = 0);
      integer[percent[i]] -= d;
    }
  }

  return integer;
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


Table.prototype.attr = function(row, column, attr){
  if(!this.table[row] || !this.table[row][column]){
    return;
  }
  var cell = this.table[row][column];
  Object.keys(attr).forEach(function(key){
    cell[key] = attr[key];
  });
};


Table.prototype.getAttr = function(row, column, attr){
  if(!this.table[row] || !this.table[row][column]){
    return null;
  }
  return this.table[row][column][attr] || null;
}


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
  var mcCache = [];
  var hlen = this.horlen();

  mcCache = this.calcWidth();
  //for(var i = 0, m;i < hlen;i++){
  //  m = mcCache[i] = this.maxcell(i);
  //}

  var b = this.border;
  var topBorder = b.topLeft + mcCache.map(function(n){
    return new Array(n + 1).join(b.top);
  }).join(b.topMid) + b.topRight;
  var midBorder = b.midLeft + mcCache.map(function(n){
    return new Array(n + 1).join(b.mid);
  }).join(b.midMid) + b.midRight;
  var botBorder = b.botLeft + mcCache.map(function(n){
    return new Array(n + 1).join(b.bot);
  }).join(b.botMid) + b.botRight;

  text += topBorder + "\n";

  var t = this.table;
  for(var row = 0, rowlen = t.length;row < rowlen;row++){
    if(row != 0 && this.horizontalLine){
      text += midBorder + "\n";
    }
    text += b.sep;
    for(var column = 0, str;column < hlen;column++){
      text += this.format(row, column, mcCache[column]) + b.sep;
    }
    text += "\n";
  }

  text += botBorder;

  return text;
};


module.exports = Table;
