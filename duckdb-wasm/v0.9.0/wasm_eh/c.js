"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apache_arrow_1 = require("apache-arrow");
var duckdb_1 = require("duckdb");
var db = new duckdb_1.Database(':memory:');
var tableAsJson = [
    {
        col: 'A',
    },
];
var q = "\nWITH data_union AS (\n    SELECT * FROM data\n    UNION ALL\n    SELECT * FROM data\n)\n\nSELECT * FROM data_union ORDER BY col\n";
describe('duckdb', function () {
    it('does not get killed', function () {
        var arrowTable = (0, apache_arrow_1.tableFromJSON)(tableAsJson);
        db.exec("INSTALL arrow; LOAD arrow;", function (err, _res) {
            if (err) {
                throw err;
            }
            db.register_buffer('data', [(0, apache_arrow_1.tableToIPC)(arrowTable)], true, function (err, _res) {
                if (err) {
                    throw err;
                }
                db.arrowIPCAll(q, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.error((0, apache_arrow_1.tableFromIPC)(res).toString());
                });
            });
        });
    });
});
