import test from "tape";
import { GeojsonEquality as Equality } from "../";

test("geojson-equality for Point", (t) => {
  const g1 = { type: "Point", coordinates: [30, 10] },
    g2 = { type: "Point", coordinates: [30, 10] },
    g3 = { type: "Point", coordinates: [30, 11] },
    g4 = { type: "Point", coordinates: [30, 10, 5] },
    g5 = { type: "Point", coordinates: [30, 10, 5] };

  {
    const eq = new Equality();
    t.true(eq.compare(g1, g2), "are equal");
  }

  {
    const eq = new Equality();
    t.false(eq.compare(g1, g3), "are not equal");
  }

  {
    const eq = new Equality();
    t.false(
      eq.compare(g1, g4),
      "are not equal with different point dimensions"
    );
  }

  {
    const eq = new Equality();
    t.true(eq.compare(g4, g5), "are equal with 3d points");
  }

  t.end();
});

test("geojson-equality for LineString", (t) => {
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
        [30, 10],
        [10, 30],
        [40, 40],
      ],
    };

  {
    const eq = new Equality();
    t.true(eq.compare(g1, g2), "are equal");
  }

  const g3 = {
    type: "LineString",
    coordinates: [
      [31, 10],
      [10, 30],
      [40, 40],
    ],
  };

  {
    const eq = new Equality();
    t.false(eq.compare(g1, g3), "are not equal");
  }

  const g4 = {
    type: "LineString",
    coordinates: [
      [40, 40],
      [10, 30],
      [30, 10],
    ],
  };

  {
    const eq = new Equality();
    t.true(
      eq.compare(g1, g4),
      "reverse direction, direction is not matched, so both are equal"
    );
  }

  {
    const eq = new Equality({ direction: true });
    t.false(
      eq.compare(g1, g4),
      "reverse direction, direction is matched, so both are not equal"
    );
  }

  t.end();
});

test("geojson-equality for Polygon", (t) => {
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
  };
  const g2 = {
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

  {
    const eq = new Equality();
    t.true(eq.compare(g1, g2), "are equal");
  }

  const g3 = {
    type: "Polygon",
    coordinates: [
      [
        [30, 10],
        [41, 40],
        [20, 40],
        [10, 20],
        [30, 10],
      ],
    ],
  };

  {
    const eq = new Equality();
    t.false(eq.compare(g1, g3), "are not equal");
  }

  const g4 = {
    type: "Polygon",
    coordinates: [
      [
        [30, 10],
        [10, 20],
        [20, 40],
        [40, 40],
        [30, 10],
      ],
    ],
  };

  {
    const eq = new Equality();
    t.true(
      eq.compare(g1, g4),
      "reverse direction, direction is not matched, so both are equal"
    );
  }

  {
    const eq = new Equality({ direction: true });
    t.false(
      eq.compare(g1, g4),
      "reverse direction, direction is matched, so both are not equal"
    );
  }

  const g5 = {
    type: "Polygon",
    coordinates: [
      [
        [10, 20],
        [20, 40],
        [40, 40],
        [30, 10],
        [10, 20],
      ],
    ],
  };

  {
    const eq = new Equality();
    t.true(
      eq.compare(g1, g5),
      "reverse direction, diff start index, direction is not matched, so both are equal"
    );
  }

  {
    const eq = new Equality({ direction: true });
    t.false(
      eq.compare(g1, g5),
      "reverse direction, diff start index, direction is matched, so both are not equal"
    );
  }

  const gh1 = {
    type: "Polygon",
    coordinates: [
      [
        [45, 45],
        [15, 40],
        [10, 20],
        [35, 10],
        [45, 45],
      ],
      [
        [20, 30],
        [35, 35],
        [30, 20],
        [20, 30],
      ],
    ],
  };
  const gh2 = {
    type: "Polygon",
    coordinates: [
      [
        [35, 10],
        [45, 45],
        [15, 40],
        [10, 20],
        [35, 10],
      ],
      [
        [20, 30],
        [35, 35],
        [30, 20],
        [20, 30],
      ],
    ],
  };

  {
    const eq = new Equality({ direction: false });
    t.true(
      eq.compare(gh1, gh2),
      "have holes too and diff start ind, direction is not matched, both are equal"
    );
  }

  {
    const eq = new Equality({ direction: true });
    t.true(
      eq.compare(gh1, gh2),
      "have holes too and diff start ind, direction is matched, so both are not equal"
    );
  }

  const gprecision1 = {
    type: "Polygon",
    coordinates: [
      [
        [30, 10],
        [40.12345, 40.12345],
        [20, 40],
        [10, 20],
        [30, 10],
      ],
    ],
  };
  const gprecision2 = {
    type: "Polygon",
    coordinates: [
      [
        [30, 10],
        [40.123389, 40.123378],
        [20, 40],
        [10, 20],
        [30, 10],
      ],
    ],
  };

  {
    const eq = new Equality({ precision: 3 });
    t.true(
      eq.compare(gprecision1, gprecision2),
      "after limiting precision, are equal"
    );
  }

  {
    const eq = new Equality({ precision: 10 });
    t.false(
      eq.compare(gprecision1, gprecision2),
      "with high precision, are not equal"
    );
  }

  t.end();
});

test("geojson-equality for Feature", (t) => {
  {
    const f1 = { type: "Feature", id: "id1" };
    const f2 = { type: "Feature", id: "id2" };
    const eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal with changed id");
  }

  {
    const f1 = { type: "Feature", id: "id1", properties: { foo: "bar" } },
      f2 = {
        type: "Feature",
        id: "id1",
        properties: { foo1: "bar", foo2: "bar" },
      },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal with different count of properties"
    );
  }

  {
    const f1 = { type: "Feature", id: "id1", properties: { foo1: "bar" } },
      f2 = { type: "Feature", id: "id1", properties: { foo2: "bar" } },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal with different keys in properties"
    );
  }

  {
    const f1 = { type: "Feature", id: "id1", properties: { foo: "bar1" } },
      f2 = { type: "Feature", id: "id1", properties: { foo: "bar2" } },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal with different properties");
  }

  {
    const f1 = {
        type: "Feature",
        id: "id1",
        properties: { foo: "bar1" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [30, 10],
              [41, 40],
              [20, 40],
              [10, 20],
              [30, 10],
            ],
          ],
        },
      },
      f2 = {
        type: "Feature",
        id: "id1",
        properties: { foo: "bar1" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [40, 20],
              [31, 10],
              [30, 20],
              [30, 10],
              [10, 40],
            ],
          ],
        },
      },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal with different geometry");
  }

  {
    const f1 = {
        type: "Feature",
        id: "id1",
        properties: { foo: { bar: "baz" } },
        geometry: { type: "Point", coordinates: [0, 1] },
      },
      f2 = {
        type: "Feature",
        id: "id1",
        properties: { foo: { bar: "baz" } },
        geometry: { type: "Point", coordinates: [0, 1] },
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "will be equal with nested properties");
  }

  {
    const f1 = {
        type: "Feature",
        id: "id1",
        properties: { foo: { bar: "baz" } },
        geometry: { type: "Point", coordinates: [0, 1] },
      },
      f2 = {
        type: "Feature",
        id: "id1",
        properties: { foo: { bar: "baz2" } },
        geometry: { type: "Point", coordinates: [0, 1] },
      },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal with different nested properties"
    );
  }

  {
    const f1 = {
        type: "Feature",
        id: "id1",
        properties: { foo_123: "bar" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [40, 20],
              [31, 10],
              [30, 20],
              [30, 10],
              [10, 40],
            ],
          ],
        },
      },
      f2 = {
        type: "Feature",
        id: "id1",
        properties: { foo_456: "bar" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [40, 20],
              [31, 10],
              [30, 20],
              [30, 10],
              [10, 40],
            ],
          ],
        },
      },
      eq = new Equality({
        objectComparator: function (obj1, obj2) {
          return "foo_123" in obj1 && "foo_456" in obj2;
        },
      });
    t.true(eq.compare(f1, f2), "will use a custom comparator if provided");
  }

  {
    const f1 = { type: "Feature", id: "id1", bbox: [1, 2, 3, 4] },
      f2 = { type: "Feature", id: "id1" },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal if one has bbox and other not"
    );
  }

  {
    const f1 = { type: "Feature", id: "id1", bbox: [1, 2, 3, 4] },
      f2 = { type: "Feature", id: "id1", bbox: [1, 2, 3, 5] },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal if bboxes are not equal");
  }

  {
    const f1 = {
        type: "Feature",
        id: "id1",
        properties: { foo: "bar1" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [30, 10],
              [41, 40],
              [20, 40],
              [10, 20],
              [30, 10],
            ],
          ],
        },
        bbox: [10, 10, 41, 40],
      },
      f2 = {
        type: "Feature",
        id: "id1",
        properties: { foo: "bar1" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [30, 10],
              [41, 40],
              [20, 40],
              [10, 20],
              [30, 10],
            ],
          ],
        },
        bbox: [10, 10, 41, 40],
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "equal features with bboxes");
  }

  {
    const f1 = {
        type: "Feature",
        id: "id1",
        properties: { foo: "bar1" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [30, 10],
              [41, 40],
              [20, 40],
              [10, 20],
              [30, 10],
            ],
          ],
        },
        bbox: [10, 10, 41, 40],
      },
      f2 = {
        type: "Feature",
        id: "id1",
        properties: { foo: "bar1" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [30, 10],
              [41, 40],
              [20, 40],
              [10, 20],
              [30, 1],
            ],
          ],
        },
        bbox: [10, 10, 41, 40],
      },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "not equal features with equal bboxes");
  }

  t.end();
});

test("geojson-equality for FeatureCollection", (t) => {
  {
    const f1 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
          },
        ],
      },
      f2 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
          },
        ],
      },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal with different number of features"
    );
  }

  {
    const f1 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
          },
        ],
      },
      f2 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [1, 1] },
          },
        ],
      },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal with different features");
  }

  {
    const f1 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [1, 1] },
          },
        ],
      },
      f2 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [1, 1] },
          },
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
          },
        ],
      },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal with different order of features"
    );
  }

  {
    const f1 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [1, 1] },
          },
        ],
      },
      f2 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [1, 1] },
          },
        ],
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "will be equal with equal features");
  }

  {
    const f1 = {
        type: "FeatureCollection",
        features: [],
      },
      f2 = {
        type: "FeatureCollection",
        features: [],
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "will be equal with equal with no features");
  }

  {
    const f1 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "id1",
            properties: { foo_123: "bar" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [40, 20],
                  [31, 10],
                  [30, 20],
                  [30, 10],
                  [10, 40],
                ],
              ],
            },
          },
        ],
      },
      f2 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "id1",
            properties: { foo_456: "bar" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [40, 20],
                  [31, 10],
                  [30, 20],
                  [30, 10],
                  [10, 40],
                ],
              ],
            },
          },
        ],
      },
      eq = new Equality({
        objectComparator: function (obj1, obj2) {
          return "foo_123" in obj1 && "foo_456" in obj2;
        },
      });
    t.true(eq.compare(f1, f2), "will use a custom comparator if provided");
  }

  {
    const f1 = { type: "FeatureCollection", features: [], bbox: [1, 2, 3, 4] },
      f2 = { type: "FeatureCollection", features: "[]" },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal if one has bbox and other not"
    );
  }

  {
    const f1 = { type: "FeatureCollection", features: [], bbox: [1, 2, 3, 4] },
      f2 = { type: "FeatureCollection", features: [], bbox: [1, 2, 3, 5] },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal if bboxes are not equal");
  }

  {
    const f1 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "id1",
            properties: { foo: "bar1" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [30, 10],
                  [41, 40],
                  [20, 40],
                  [10, 20],
                  [30, 10],
                ],
              ],
            },
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      f2 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "id1",
            properties: { foo: "bar1" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [30, 10],
                  [41, 40],
                  [20, 40],
                  [10, 20],
                  [30, 10],
                ],
              ],
            },
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "equal feature collections with bboxes");
  }

  {
    const f1 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "id1",
            properties: { foo: "bar1" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [30, 10],
                  [41, 40],
                  [20, 40],
                  [10, 20],
                  [30, 10],
                ],
              ],
            },
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      f2 = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "id1",
            properties: { foo: "bar1" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [30, 10],
                  [41, 40],
                  [20, 40],
                  [10, 20],
                  [30, 1],
                ],
              ],
            },
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "not equal features with equal bboxes");
  }

  t.end();
});

test("geojson-equality for MultiPoint", (t) => {
  const g1 = {
      type: "MultiPoint",
      coordinates: [
        [0, 40],
        [40, 30],
        [20, 20],
        [30, 10],
      ],
    },
    g2 = {
      type: "MultiPoint",
      coordinates: [
        [0, 40],
        [20, 20],
        [40, 30],
        [30, 10],
      ],
    };

  {
    const eq = new Equality();
    t.true(eq.compare(g1, g2), "are equal");
  }

  const g3 = {
    type: "MultiPoint",
    coordinates: [
      [10, 40],
      [20, 20],
      [40, 30],
      [30, 10],
    ],
  };
  {
    const eq = new Equality();
    t.false(eq.compare(g1, g3), "are not equal");
  }

  t.end();
});

test("geojson-equality for MultiLineString", (t) => {
  const g1 = {
      type: "MultiLineString",
      coordinates: [
        [
          [30, 10],
          [10, 30],
          [40, 40],
        ],
        [
          [0, 10],
          [10, 0],
          [40, 40],
        ],
      ],
    },
    g2 = {
      type: "MultiLineString",
      coordinates: [
        [
          [40, 40],
          [10, 30],
          [30, 10],
        ],
        [
          [0, 10],
          [10, 0],
          [40, 40],
        ],
      ],
    };

  {
    const eq = new Equality();
    t.true(
      eq.compare(g1, g2),
      "reverse direction, direction is not matched, so both are equal"
    );
  }

  {
    const eq = new Equality({ direction: true });
    t.false(
      eq.compare(g1, g2),
      "reverse direction, direction is matched, so both are not equal"
    );
  }

  const g3 = {
    type: "MultiLineString",
    coordinates: [
      [
        [10, 10],
        [20, 20],
        [10, 40],
      ],
      [
        [40, 40],
        [30, 30],
        [40, 20],
        [30, 10],
      ],
    ],
  };

  {
    const eq = new Equality();
    t.false(eq.compare(g1, g3), "both are not equal");
  }

  t.end();
});

test("geojson-equality for MultiPolygon", (t) => {
  const g1 = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [30, 20],
            [45, 40],
            [10, 40],
            [30, 20],
          ],
        ],
        [
          [
            [15, 5],
            [40, 10],
            [10, 20],
            [5, 10],
            [15, 5],
          ],
        ],
      ],
    },
    g2 = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [30, 20],
            [45, 40],
            [10, 40],
            [30, 20],
          ],
        ],
        [
          [
            [15, 5],
            [40, 10],
            [10, 20],
            [5, 10],
            [15, 5],
          ],
        ],
      ],
    };

  {
    const eq = new Equality();
    t.true(eq.compare(g1, g2), "both are equal");
  }

  const g3 = {
    type: "MultiPolygon",
    coordinates: [
      [
        [
          [30, 20],
          [45, 40],
          [10, 40],
          [30, 20],
        ],
      ],
      [
        [
          [15, 5],
          [400, 10],
          [10, 20],
          [5, 10],
          [15, 5],
        ],
      ],
    ],
  };

  {
    const eq = new Equality();
    t.false(eq.compare(g1, g3), "both are not equal");
  }

  const gh1 = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [40, 40],
            [20, 45],
            [45, 30],
            [40, 40],
          ],
        ],
        [
          [
            [20, 35],
            [10, 30],
            [10, 10],
            [30, 5],
            [45, 20],
            [20, 35],
          ],
          [
            [30, 20],
            [20, 15],
            [20, 25],
            [30, 20],
          ],
          [
            [20, 10],
            [30, 10],
            [30, 15],
            [20, 10],
          ],
        ],
      ],
    },
    gh2 = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [20, 35],
            [10, 30],
            [10, 10],
            [30, 5],
            [45, 20],
            [20, 35],
          ],
          [
            [20, 10],
            [30, 10],
            [30, 15],
            [20, 10],
          ],
          [
            [30, 20],
            [20, 15],
            [20, 25],
            [30, 20],
          ],
        ],
        [
          [
            [40, 40],
            [20, 45],
            [45, 30],
            [40, 40],
          ],
        ],
      ],
    };

  {
    const eq = new Equality();
    t.true(eq.compare(gh1, gh2), "having holes, both are equal");
  }

  t.end();
});

test("geojson-equality for GeometryCollection", (t) => {
  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [{ type: "Point", coordinates: [0, 0] }],
      },
      f2 = {
        type: "GeometryCollection",
        geometries: [
          { type: "Point", coordinates: [0, 0] },
          { type: "Point", coordinates: [0, 0] },
        ],
      },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal with different number of geometries"
    );
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [{ type: "Point", coordinates: [0, 0] }],
      },
      f2 = {
        type: "GeometryCollection",
        geometries: [{ type: "Point", coordinates: [1, 1] }],
      },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal with different geometries");
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [
          { type: "Point", coordinates: [0, 0] },
          { type: "Point", coordinates: [1, 1] },
        ],
      },
      f2 = {
        type: "GeometryCollection",
        geometries: [
          { type: "Point", coordinates: [1, 1] },
          { type: "Point", coordinates: [0, 0] },
        ],
      },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal with different order of geometries"
    );
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [{ type: "Point", coordinates: [0, 0] }],
      },
      f2 = {
        type: "GeometryCollection",
        geometries: [{ type: "Point", coordinates: [0, 0] }],
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "will be equal with equal geometries");
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [],
      },
      f2 = {
        type: "GeometryCollection",
        geometries: [],
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "will be equal with equal with no geometries");
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [],
        bbox: [1, 2, 3, 4],
      },
      f2 = { type: "GeometryCollection", geometries: "[]" },
      eq = new Equality();
    t.false(
      eq.compare(f1, f2),
      "will not be equal if one has bbox and other not"
    );
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [],
        bbox: [1, 2, 3, 4],
      },
      f2 = { type: "GeometryCollection", geometries: [], bbox: [1, 2, 3, 5] },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "will not be equal if bboxes are not equal");
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Polygon",
            coordinates: [
              [
                [30, 10],
                [41, 40],
                [20, 40],
                [10, 20],
                [30, 10],
              ],
            ],
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      f2 = {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Polygon",
            coordinates: [
              [
                [30, 10],
                [41, 40],
                [20, 40],
                [10, 20],
                [30, 10],
              ],
            ],
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      eq = new Equality();
    t.true(eq.compare(f1, f2), "equal geometry collections with bboxes");
  }

  {
    const f1 = {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Polygon",
            coordinates: [
              [
                [30, 10],
                [41, 40],
                [20, 40],
                [10, 20],
                [30, 10],
              ],
            ],
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      f2 = {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Polygon",
            coordinates: [
              [
                [30, 10],
                [41, 40],
                [20, 40],
                [10, 20],
                [30, 1],
              ],
            ],
          },
        ],
        bbox: [10, 10, 41, 40],
      },
      eq = new Equality();
    t.false(eq.compare(f1, f2), "not equal geometries with equal bboxes");
  }

  t.end();
});
