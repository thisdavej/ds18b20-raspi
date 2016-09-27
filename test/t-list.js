// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('tap').test;
const tester = require('./tester');
const m = require('../');


function expArray(count, expectError) {
	return expectError ? [] : tester.deviceIds.slice(0, count);
}

const fn = m.list;

const arrArgs = [
	{ a: [], expErr: false },
];

for (const arg of arrArgs) {
	test('Getting list (0 devices)...', (t) => {
		tester(t, fn, arg.a, '0-devices', true, []);
	});

	test('Getting list (1 device)...', (t) => {
		tester(t, fn, arg.a, '1-device', arg.expErr, expArray(1, arg.expErr));
	});

	test('Getting list (2 devices)...', (t) => {
		tester(t, fn, arg.a, '2-devices', arg.expErr, expArray(2, arg.expErr));
	});

	test('Getting list (6 devices)...', (t) => {
		tester(t, fn, arg.a, '6-devices', arg.expErr, expArray(6, arg.expErr));
	});

	test('Getting list (1 device - no in file)...', (t) => {
		tester(t, fn, arg.a, '1-device-no', arg.expErr, expArray(1, arg.expErr));
	});

	test('Getting list (no devices)...', (t) => {
		tester(t, fn, arg.a, 'no-devices', true, []);
	});

	test('Getting list (non existent device)...', (t) => {
		tester(t, fn, arg.a, 'non-device-path', true, []);
	});
}
