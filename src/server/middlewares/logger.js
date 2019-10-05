import winston from 'winston';
const { splat, align, combine, timestamp, printf, simple, errors, colorize } = winston.format;
import 'winston-daily-rotate-file';
import serverConfig from './../config.js';

const _dir = './log';
const _lev = serverConfig.log.level;
const _datePattern = 'YYYY-MM-DD-HH';

const _timestamp = () => {
    return new Date().toISOString();
};

const _transform = {
    transform(details) {
        const { timestamp, label, message } = details;
        const level = details[Symbol.for('level')];
        let args = "", msg = message;
        if (details[Symbol.for('splat')]) {
            args = details[Symbol.for('splat')].map(JSON.stringify).join(' ');
        }
        if (typeof message === 'object') {
            msg = JSON.stringify(message);
        }
        details[Symbol.for('message')] = `${timestamp} [${level}] ${msg} ${args}`;
        return details;
    }
};

const logFile = new (winston.transports.DailyRotateFile)({
    filename: `app-${process.pid}-%DATE%.log`,
    auditFile: `${_dir}/audit-${process.pid}.json`,
    datePattern: _datePattern,
    dirname: _dir,
    zippedArchive: false,
    maxSize: '5m',
    maxFiles: '14d',
    level: _lev,
    format: combine(
        timestamp({
            format: _timestamp
        }),
        _transform
    ),
});

const colorizer = colorize();

const _printf = printf((details) => {
    if (serverConfig.log.colorize) {
        return colorizer.colorize(details[Symbol.for('level')], details[Symbol.for('message')]);
    } else {
        return details[Symbol.for('message')];
    }
});

const logConsole = new winston.transports.Console({
    handleExceptions: true,
    level: _lev,
    format: combine(
        timestamp({
            format: _timestamp
        }),
        _transform,
        _printf
    ),
});

const exeFile = new (winston.transports.DailyRotateFile)({
    filename: `exe-${process.pid}-%DATE%.log`,
    auditFile: `${_dir}/audit-${process.pid}.json`,
    datePattern: _datePattern,
    dirname: _dir,
    utc: true,
    zippedArchive: false,
    maxSize: '5m',
    maxFiles: '14d',
    level: _lev,
    format: combine(
        simple()
    ),
});

let t = [];

if (serverConfig.log.output.includes("console")) {
    t.push(logConsole);
}

if (serverConfig.log.output.includes("file")) {
    t.push(logFile);
}

const logger = winston.createLogger({
    exitOnError: false,
    transports: t,
    exceptionHandlers: [
        exeFile
    ]
});

logger.error = item => {
    logger.log({ level: 'error', message: item instanceof Error ? item.stack : item });
};

logger.stream = {
    write: function(message, encoding) {
        logger.info(message.substring(0,message.lastIndexOf('\n')));
    },
};

export default logger;