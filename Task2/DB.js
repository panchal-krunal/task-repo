const dbConfig = require("./db.config.js");
var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port:3306
});

var DB = (function () {
  function _query(query, params, callback) {
    pool.getConnection(function (err, connection) {
      if (err) {
        if (typeof connection !== undefined && connection) connection.release();
        callback(err, null);
        throw err;
      }

      connection.query(query, params, function (err, rows) {
        if (typeof connection !== undefined && connection) connection.release();
        if (!err) {
          callback(null, rows);
        } else {
          callback(err, null);
        }
      });

      connection.on("error", function (err) {
        if (typeof connection !== undefined && connection) connection.release();
        callback(err, null);
        throw err;
      });
    });
  }

  return {
    query: _query,
  };
})();

module.exports = DB;
