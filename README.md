# geojson-equality-ts

Check two valid geojson geometries for equality.

## installation

```
npm install geojson-equality-ts
```

## usage

Use as either a class or function.

```javascript
import { geojsonEquality, GeojsonEquality } from "geojson-equality";

geojsonEquality(g1, g2, { precision: 3 }); // returns boolean

const eq = new GeojsonEquality({ precision: 3 });
eq.compare(g1, g2); // returns boolean
```

In more detail.

```javascript
const GeojsonEquality = require("geojson-equality");
const eq = new GeojsonEquality();

const g1 = {
    type: "Polygon",
    coordinates: [
      [
        [30, 10],
        [40, 40],
        [20, 40],
        [10, 20],
        [30, 10],
      ],
    ],
  },
  g2 = {
    type: "Polygon",
    coordinates: [
      [
        [30, 10],
        [40, 40],
        [20, 40],
        [10, 20],
        [30, 10],
      ],
    ],
  };

eq.compare(g1, g2); // returns true
const g3 = {
  type: "Polygon",
  coordinates: [
    [
      [300, 100],
      [400, 400],
      [200, 400],
      [100, 200],
      [300, 100],
    ],
  ],
};

eq.compare(g1, g3); // returns false
```

- **precision** number as floating points precision required. Defualt is **17**

```javascript
const g1 = { type: "Point", coordinates: [30.2, 10] };
const g2 = { type: "Point", coordinates: [30.22233, 10] };

geojsonEquality(g1, g2, { precision: 3 }); // returns false

geojsonEquality(g1, g2, { precision: 1 }); // returns true
```

- **direction** true | false, direction of LineString or Polygon (orientation) is ignored if false. Default is **false**.

```javascript
const g1 = {
    type: "LineString",
    coordinates: [
      [30, 10],
      [10, 30],
      [40, 40],
    ],
  },
  g2 = {
    type: "LineString",
    coordinates: [
      [40, 40],
      [10, 30],
      [30, 10],
    ],
  };

geojsonEquality(g1, g2, { direction: false }); // returns true

geojsonEquality(g1, g2, { direction: true }); // returns false
```

- **objectComparator** **Temporarily disabled** function, custom function for use in comparing Feature properties. Default is a shallow comparison.

```javascript
// using lodash isEqual to deep comparison
const isEqual = require("lodash/lang/isEqual");
const eq = new GeojsonEquality({ objectComparator: isEqual });
```

## developing

Once you run

`npm install`

then for running test

`npm run test`

to create build

`npm run build`

## license

This project is licensed under the terms of the MIT license.
