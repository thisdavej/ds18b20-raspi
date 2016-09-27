const path = require('path');
const m = require('../');

// Special thanks to https://github.com/mraxus/ds18x20.js for providing testing ideas and testing files.

function tester(tst, fn, args, deviceChoice, expectedError, expectedResult) {
	const devicePath = path.resolve(__dirname, 'data', deviceChoice);
	m.setW1Directory(devicePath);

	function verify(t, err, result, syncFunctionCalled) {
		if (expectedError && !syncFunctionCalled) {
			t.ok(err, 'should error');
		} else {
			t.notOk(err, 'should not error');
		}

		console.log('result');
		console.log(result);
		console.log('expectedResult');
		console.log(expectedResult);

		t.deepEqual(result, expectedResult);
		t.end();
	}

	tst.test('... synchronous...', (t) => {
		verify(t, null, fn(...args), true);
	});
	tst.test('... asynchronous...', (t) => {
		fn(...args, (err, result) => {
			verify(t, err, result);
		});
	});
	tst.end();
}

function expResult(result, expectError) {
	if (expectError) {
		return null;
	}
	return result;
}

const deviceIds = ['28-011111111111',
	'28-022222222222',
	'28-033333333333',
	'28-044444444444',
	'28-055555555555',
	'28-066666666666'];

module.exports = tester;
module.exports.expResult = expResult;
module.exports.deviceIds = deviceIds;
