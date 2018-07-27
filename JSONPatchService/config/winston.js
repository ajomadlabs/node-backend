/*eslint-disable */
var winston = require('winston')

var options = {
  file: {
    level: 'info',
    filename: '../logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    filename: '../logs/app.log',
    handleExceptions: true,
    json: false,
    colorize: true,
  }
}

var logger = winston.createLogger({
  transports: [
    new (winston.transports.File)(options.file),
    new (winston.transports.Console)(options.console)
  ],
  exitOnError: false
})

logger.stream = {
  write: function(message, encoding) {
    logger.info(message)
  }
}

module.exports = logger