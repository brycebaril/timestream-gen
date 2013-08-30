timestream-gen
=====

[![NPM](https://nodei.co/npm/timestream-gen.png)](https://nodei.co/npm/timestream-gen/)

Timeseries stream generators for [timestream](http://npm.im/timestream) streams. Creates objectMode streams of records of data by time.

Generate geometric or random timeseries data. Useful for generating test or line data for `timestream` or other timeseries uses.

```javascript
var ago = require("ago")
var concat = require("concat-stream")
function collect(records) {
  console.log(records)
}

// Generate a geometric sequence
var gen = require("timestream-gen").gen

gen({start: ago(1, "hr"), until: ago(1, "min"), interval: 360000})
  .pipe(concat(collect))

/*
[ { gen: 0, _t: 1377900714742 },
  { gen: 1, _t: 1377901074742 },
  { gen: 2, _t: 1377901434742 },
  { gen: 3, _t: 1377901794742 },
  { gen: 4, _t: 1377902154742 },
  { gen: 5, _t: 1377902514742 },
  { gen: 6, _t: 1377902874742 },
  { gen: 7, _t: 1377903234742 },
  { gen: 8, _t: 1377903594742 },
  { gen: 9, _t: 1377903954742 } ]
 */

// Generate a single record
var one = require("timestream-gen").one

one(ago(123, "days"), {foo: "bar"})
  .pipe(concat(collect))

/*
[ { foo: 'bar', _t: 1367277114747 } ]
 */

// Generate a random series
var rand = require("timestream-gen").rand

rand({start: ago(5, "mins"), until: ago(1, "s"), interval: 60000})
  .pipe(concat(collect))

/*
[ { rand: 0.6870060604996979, _t: 1377904014747 },
  { rand: 0.005321716424077749, _t: 1377904074747 },
  { rand: 0.222258769441396, _t: 1377904134747 },
  { rand: 0.21034391643479466, _t: 1377904194747 },
  { rand: 0.9517328571528196, _t: 1377904254747 } ]
 */

```

API
===

`gen(options)`
---

Generate a geometric stream of timeseries records.

Options:

  * start (required): A millisecond timestamp for the first record
  * until (required): A millsecond timestamp for the maximum possible timestamp in this series
  * interval (required): A number of milliseconds to increment each record's timestamp by
  * key: A name for the value at each record. Default `gen`
  * initial: An initial value for the first record. Default 0
  * increment: How much to increment the value by for each record. Default 1

`one(timestamp [,record])`
---

Generate a single record at a single point in time. Default record is {gen: 1}, accepts any type of record.

`rand(options)`
---

Generate stream of timeseries records with random values between 0 and 1 (Math.random).

Options:

  * start (required): A millisecond timestamp for the first record
  * until (required): A millsecond timestamp for the maximum possible timestamp in this series
  * interval (required): A number of milliseconds to increment each record's timestamp by
  * key: A name for the value at each record. Default `rand`

LICENSE
=======

MIT
