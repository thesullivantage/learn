const zango = require('zangodb');

const DB_VERSION = 1;

const db = new zango.Db('learn', DB_VERSION, ['options', 'scores']);
const options = db.collection('options');
// const scores = db.collection('scores');

function getZangoOptions(cb) {
  options.findOne({ mathDrillOptions: { $exists: 1 } }, (findOneError, item) => {
    if (findOneError) {
      console.error('getZangoOptions error', findOneError);
      return cb(findOneError);
    }
    console.log('getZangoOptions found one:', item);
    if (item && item.mathDrillOptions) {
      return cb(findOneError, item.mathDrillOptions);
    }
    cb('No data found for mathDrillOptions');
  });
}

function saveZangoOptions(opts) {
  options.insert([{ mathDrillOptions: opts }], (error) => {
    if (error) {
      console.error('saveZangoOptions error:', error);
    } else {
      console.log('Inserted mathDrillOptions into options', opts);
    }
  });
}


class DB {
  static saveOptions(opts) {
    saveZangoOptions(opts);
    localStorage.setItem('mathDrillOptions', JSON.stringify(opts));
  }

  static getOptions(cb) {
    getZangoOptions((err, opts2) => {
      if (err) {
        return cb(err);
      }
      if (opts2) {
        return cb(null, err);
      }
      const opts = localStorage.getItem('mathDrillOptions');
      if (opts) {
        const o = JSON.parse(opts);
        saveZangoOptions(o);
        return o;
      }
      return opts;
    });
  }
}

module.exports = DB;
