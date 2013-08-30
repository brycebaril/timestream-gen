var test = require("tape").test

var concat = require("concat-stream")

var gen = require("../gen").gen
var one = require("../gen").one
var rand = require("../gen").rand

test("init", function (t) {
  t.equals(typeof gen, "function", "gen is a function")
  t.equals(typeof one, "function", "one is a function")
  t.equals(typeof rand, "function", "rand is a function")

  t.end()
})

test("one", function (t) {
  t.plan(1)

  function collect(records) {
    t.deepEquals(records, [{_t: 100, foo: "bar", zzz: 1101}], "Expected record streamed")
  }

  one(100, {foo: "bar", zzz: 1101})
    .pipe(concat(collect))
})

test("one errors", function (t) {
  t.throws(function () {one()}, "No args throws")
  t.throws(function () {one({foo: "bar"})}, "No timestamp throws")
  t.end()
})

test("gen", function (t) {
  t.plan(1)

  function collect(records) {
    var expected = [
      {_t: 500, gen: 0},
      {_t: 1000, gen: 1},
      {_t: 1500, gen: 2},
      {_t: 2000, gen: 3}
    ]
    t.deepEquals(records, expected, "Expected records streamed")
  }

  gen({start: 500, until: 2000, interval: 500})
    .pipe(concat(collect))
})

test("gen options", function (t) {
  t.plan(1)

  function collect(records) {
    var expected = [
      {_t: 500, foo: 203},
      {_t: 1000, foo: 206},
      {_t: 1500, foo: 209},
      {_t: 2000, foo: 212}
    ]
    t.deepEquals(records, expected, "Expected records streamed")
  }

  gen({start: 500, until: 2000, interval: 500, key: "foo", initial: 203, increment: 3})
    .pipe(concat(collect))
})

test("gen errors", function (t) {
  t.throws(function () {gen()}, "No args throws")
  t.throws(function () {gen({start: "bar", until: 10, interval: 1000})}, "Not enough/bad args")
  t.end()
})

test("rand", function (t) {
  t.plan(5)

  function collect(records) {
    records.map(function (r) {
      t.ok(r.rand >= 0 && r.rand <= 1, "value is probably a Math.random value")
      r.rand = 3
    })
    var expected = [
      {_t: 500, rand: 3},
      {_t: 1000, rand: 3},
      {_t: 1500, rand: 3},
      {_t: 2000, rand: 3}
    ]
    t.deepEquals(records, expected, "Expected records streamed")
  }

  rand({start: 500, until: 2000, interval: 500})
    .pipe(concat(collect))
})

test("rand options", function (t) {
  t.plan(5)

  function collect(records) {
    records.map(function (r) {
      t.ok(r.foo >= 0 && r.foo <= 1, "value is probably a Math.random value")
      r.foo = 3
    })
    var expected = [
      {_t: 500, foo: 3},
      {_t: 1000, foo: 3},
      {_t: 1500, foo: 3},
      {_t: 2000, foo: 3}
    ]
    t.deepEquals(records, expected, "Expected records streamed")
  }

  rand({start: 500, until: 2000, interval: 500, key: "foo"})
    .pipe(concat(collect))
})

test("rand errors", function (t) {
  t.throws(function () {rand()}, "No args throws")
  t.throws(function () {rand({start: "bar", until: 10, interval: 1000})}, "Not enough/bad args")
  t.end()
})