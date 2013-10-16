module.exports = gen
module.exports.gen = gen
module.exports.one = one
module.exports.rand = rand

var spigot = require("stream-spigot")
var isNumber = require("isnumber")

function gen(options) {
  if (!options) throw new Error("Syntax: gen(options)")

  if (!isNumber(options.start)) throw new Error("options.start must be a timestamp")
  if (!isNumber(options.until)) throw new Error("options.until must be a timestamp")
  if (!isNumber(options.interval)) throw new Error("options.interval must be a number")
  if (options.interval < 0) throw new Error("options.interval must be a positive number")
  if (options.start > options.until) throw new Error("options.start must come before options.until")

  options.key = options.key || "gen"
  options.initial = isNumber(options.initial) ? options.initial : 0
  options.increment = isNumber(options.increment) ? options.increment : 1

  var generator = incr(options)

  return spigot({objectMode: true}, generator)
}

function rand(options) {
  if (!options) throw new Error("Syntax: rand(options)")

  if (!isNumber(options.start)) throw new Error("options.start must be a timestamp")
  if (!isNumber(options.until)) throw new Error("options.until must be a timestamp")
  if (!isNumber(options.interval)) throw new Error("options.interval must be a number")

  options.key = options.key || "rand"

  var generator = random(options)

  return spigot({objectMode: true}, generator)
}

function one(ts, record) {
  if (!isNumber(ts)) throw new Error("Syntax: one(timestamp [,record])")
  if (record == null) record = {gen: 1}

  record._t = ts
  return spigot({objectMode: true}, [record])
}

function incr(options) {
  var current = +options.initial
  var _t = +options.start
  var interval = +options.interval

  var increment = isNumber(options.increment) ? options.increment : 1

  return function () {
    if (_t > options.until) return this.push(null)

    var record = {}
    record[options.key] = current
    record._t = _t

    _t += interval
    current += options.increment
    this.push(record)
  }
}

function random(options) {
  var _t = +options.start
  var interval = +options.interval

  return function () {
    if (_t > options.until) return this.push(null)

    var record = {}
    record[options.key] = Math.random()
    record._t = _t

    _t += interval

    this.push(record)
  }
}