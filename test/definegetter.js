var assert = require("assert");
var Table = require("../");

describe("__defineGetter__", function(){
  it("width", function(){
    var t = new Table();
    t.cell(1, 5, "foo");
    assert.equal(t.width, 6);
  });

  it("height", function(){
    var t = new Table();
    t.cell(3, 0, "foo");
    assert.equal(t.height, 4);
  });
});
