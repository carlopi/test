import { tableFromIPC, tableFromJSON, tableToIPC } from 'apache-arrow';
import { Database } from 'duckdb';

const db = new Database(':memory:');

const tableAsJson = [
  {
    col: 'A',
  },
];

const q = `
WITH data_union AS (
    SELECT * FROM data
    UNION ALL
    SELECT * FROM data
)

SELECT * FROM data_union ORDER BY col
`;

describe('duckdb', () => {
  it('does not get killed', () => {
    const arrowTable = tableFromJSON(tableAsJson);
    db.exec(`INSTALL arrow; LOAD arrow;`, (err, _res) => {
      if (err) {
        throw err;
      }
      db.register_buffer(
        'data',
        [tableToIPC(arrowTable)],
        true,
        (err, _res) => {
          if (err) {
            throw err;
          }
          db.arrowIPCAll(q, (err, res) => {
            if (err) {
              throw err;
            }
            console.error(tableFromIPC(res).toString());
          });
        }
      );
    });
  });
});
