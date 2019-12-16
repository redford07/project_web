module.exports = (function () {
  return {
    local: { // localhost
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123',
      database: 'bakze'
    },
    real: { // real server db info
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123',
      database: 'bakze'
    },
    dev: { // dev server db info
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123',
      database: 'bakze'
    }
  }
})();
