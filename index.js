const fs = require('fs');
const path = require('path');
const async = require('async');
const roundTo = require('round-to');

let w1Directory = '/sys/bus/w1/devices/w1_bus_master1';
const W1_MASTER = 'w1_master_slaves';
const DEFAULT_DIGITS = 3;
const TEMPERATURE_NOT_FOUND_VALUE = null;

function setW1Directory(devicePath) {
	w1Directory = devicePath;
}

function pathExists(fp, cb) {
	if (typeof cb === 'function') {
		fs.stat(fp, (err) => {
			cb(err, !err);
			return;
		});
		return pathExists;
	}

	try {
		fs.statSync(fp);
		return true;
	} catch (err) {
		return false;
	}
}

function asSensorListSync(data) {
	if (!data) return [];
	const sensors = data.split('\n');
	sensors.pop();
	const finalSensors = [];
	for (const sensorId of sensors) {
		const fp = path.join(w1Directory, `${sensorId}/w1_slave`);
		if (pathExists(fp)) {
			finalSensors.push(sensorId);
		}
	}
	return finalSensors;
}

function asSensorList(data, cb) {
	if (typeof cb === 'function') {
		if (!data) return cb(null, []);
		const sensors = data.split('\n');
		sensors.pop();
		const finalSensors = [];

		async.each(sensors, (sensorId, done) => {
			const fp = path.join(w1Directory, `${sensorId}/w1_slave`);
			pathExists(fp, (err, exists) => {
				if (exists) {
					finalSensors.push(sensorId);
				}
				done();
			});
		}, (err) => {
			if (err) {
				return cb(err);
			}
			return cb(null, finalSensors);
		});
	}
	return asSensorListSync(data);
}

function convertCtoF(tempC) {
	return (tempC * (9 / 5)) + 32;
}

function list(cb) {
	const filePath = path.join(w1Directory, W1_MASTER);
	const errorMsg = 'Error: Could not find any 1-Wire sensors to list';

	if (typeof cb === 'function') {
		pathExists(filePath, (fpErr, exists) => {
			if (!exists) return cb(errorMsg, []);
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					return cb(err, false);
				}
				asSensorList(data, (error, sensorList) => {
					if (sensorList.length === 0) {
						return cb(errorMsg, []);
					}
					return cb(null, sensorList.sort());
				});
				return list;
			});
			return list;
		});
	} else {
		try {
			const dataSync = fs.readFileSync(filePath, 'utf8');
			return asSensorList(dataSync).sort();
		} catch (e) {
			return [];
		}
	}
	return true;
}

function parseTemperature(data, id, opts) {
	const arr = data.split('\n');
	const digits = opts.digits !== undefined ? opts.digits : DEFAULT_DIGITS;
	let temp = TEMPERATURE_NOT_FOUND_VALUE;

	// Ensure "crc=00" is not present since this indicates the sensor has been disconnected.
	if (arr[0].indexOf('YES') > -1 && arr[0].indexOf('crc=00') === -1) {
		const out = data.match(/t=(-?(\d+))/);
		if (out !== null) {
			temp = parseInt(out[1], 10) / 1000;
			if (opts.degF) {
				temp = convertCtoF(temp);
			}
			temp = roundTo(temp, digits);
		}
	}

	let result;
	if (opts.valueOnly) {
		result = temp;
	} else {
		result = { id, t: temp };
	}
	return result;
}
  
function getTemperatureFileContents(filePath, id, opts, cb) {
	const sensorText = id ? ` for deviceId = ${id}` : '';
	const errorMsg = `Error: Could not find 1-Wire temperature sensor${sensorText}`;
	const emptyValue = opts.valueOnly ? TEMPERATURE_NOT_FOUND_VALUE :
		{ id, t: TEMPERATURE_NOT_FOUND_VALUE };

	if (typeof cb === 'function') {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return cb(err, emptyValue);
			}

			return cb(null, parseTemperature(data, id, opts));
		});
	}

	let result;
	try {
		const dataSync = fs.readFileSync(filePath, 'utf8');
		result = parseTemperature(dataSync, id, opts);
	} catch (e) {
		console.error(errorMsg);
		result = emptyValue;
	}
	return result;
}

function readTCore(id, opts, cb) {
	const filePath = path.join(w1Directory, `${id}/w1_slave`);
	return getTemperatureFileContents(filePath, id, opts, cb);
}


function readCore(id, digits, degF, cb) {
	if (typeof digits === 'function') {
		cb = digits;
		digits = DEFAULT_DIGITS;
	}
	digits = Number.isInteger(digits) ? digits : DEFAULT_DIGITS;
	const opts = { degF, digits, valueOnly: true };
	return readTCore(id, opts, cb);
}

function readC(id, digits, cb) {
	return readCore(id, digits, false, cb);
}

function readF(id, digits, cb) {
	return readCore(id, digits, true, cb);
}

function sensorReadSimpleError(sensors) {
	let errorMessage;
	if (sensors.length === 0) {
		errorMessage = 'Error: no 1-Wire sensors found';
	} else {
		errorMessage = 'Error: found multiple 1-Wire sensors so readSimple methods cannot be used.';
		const deviceIds = list().join(', ');
		errorMessage += ` Found the following device Ids: ${deviceIds}`;
	}
	return errorMessage;
}

function readSimpleCore(degF, digits, cb) {
	if (typeof digits === 'function') {
		cb = digits;
		digits = DEFAULT_DIGITS;
	}
	digits = Number.isInteger(digits) ? digits : DEFAULT_DIGITS;
	const opts = { digits, degF, valueOnly: true };

	if (typeof cb === 'function') {
		list((error, sensors) => {
			if (sensors.length !== 1) {
				cb(sensorReadSimpleError(sensors), TEMPERATURE_NOT_FOUND_VALUE);
				return;
			}

			readTCore(sensors[0], opts, (err, reading) => {
				cb(err, reading);
				return;
			});
		});
	}

	const sensors = list(null);

	if (sensors.length !== 1) {
		console.error(sensorReadSimpleError(sensors));
		return TEMPERATURE_NOT_FOUND_VALUE;
	}
	return readTCore(sensors[0], opts, null);
}

function readSimpleC(digits, cb) {
	return readSimpleCore(false, digits, cb);
}

function readSimpleF(digits, cb) {
	return readSimpleCore(true, digits, cb);
}

function readAllCore(degF, digits, cb) {
	if (typeof digits === 'function') {
		cb = digits;
		digits = DEFAULT_DIGITS;
	}
	digits = Number.isInteger(digits) ? digits : DEFAULT_DIGITS;

	const opts = { digits, degF, valueOnly: false };

	if (typeof cb === 'function') {
		list((error, sensors) => {
			if (error) {
				cb('Error: Could not list 1-Wire sensors', []);
				return;
			}

			const results = [];
			async.each(sensors, (sensorId, done) => {
				readTCore(sensorId, opts, (err, reading) => {
					results.push(reading);
					done();
				});
			}, (err) => {
				if (err) console.error(err);
				results.sort((a, b) => { // eslint-disable-line arrow-body-style
					return a.id.localeCompare(b.id);
				});
				return cb(null, results);
			});
		});
	}

	const sensors = list(null);
	const resultsSync = [];
	for (const sensorId of sensors) {
		resultsSync.push(readTCore(sensorId, opts, null));
	}
	return resultsSync;
}

function readAllC(digits, cb) {
	return readAllCore(false, digits, cb);
}

function readAllF(digits, cb) {
	return readAllCore(true, digits, cb);
}

module.exports.list = list;
module.exports.readC = readC;
module.exports.readF = readF;
module.exports.readSimpleC = readSimpleC;
module.exports.readSimpleF = readSimpleF;
module.exports.readAllC = readAllC;
module.exports.readAllF = readAllF;
module.exports.setW1Directory = setW1Directory;
