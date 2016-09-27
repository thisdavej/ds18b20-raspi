// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('tap').test;
const tester = require('./tester');
const m = require('../');
const expected = require('./expected_results.json');

function expArray(result, count, expectError) {
	const value = expectError ? null : result;
	const arr = tester.deviceIds.slice(0, count).sort();
	const expValues = [];

	for (const id of arr) {
		expValues.push({ id, t: value });
	}
	return expValues;
}

const configs = [{ fn: m.readAllC, exp: expected.C },
	{ fn: m.readAllF, exp: expected.F }];

const arrArgs = [
	{ a: [2], i: 2, expErr: false },
	{ a: [3], i: 3, expErr: false },
	{ a: ['junk'], i: 3, expErr: false },
];

for (const c of configs) {
	for (const arg of arrArgs) {
		test(`Getting temperature using ${c.fn.name} (0 device)...`, (t) => {
			tester(t, c.fn, arg.a, '0-devices', true, []);
		});

		test(`Getting temperature using ${c.fn.name} (1 device)...`, (t) => {
			tester(t, c.fn, arg.a, '1-device', arg.expErr, expArray(c.exp[arg.i], 1, arg.expErr));
		});

		test(`Getting temperature using ${c.fn.name} (2 devices)...`, (t) => {
			tester(t, c.fn, arg.a, '2-devices', arg.expErr, expArray(c.exp[arg.i], 2, arg.expErr));
		});

		test(`Getting temperature using ${c.fn.name} (6 devices)...`, (t) => {
			tester(t, c.fn, arg.a, '6-devices', arg.expErr, expArray(c.exp[arg.i], 6, arg.expErr));
		});

		test(`Getting temperature using ${c.fn.name} (1 device-no in file)...`, (t) => {
			tester(t, c.fn, arg.a, '1-device-no', false, [{ id: '28-011111111111', t: null }]);
		});

		test(`Getting temperature using ${c.fn.name} (no devices)...`, (t) => {
			tester(t, c.fn, arg.a, 'no-devices', true, []);
		});

		test(`Getting temperature using ${c.fn.name} (non existent device)...`, (t) => {
			tester(t, c.fn, arg.a, 'non-device-path', true, []);
		});
	}
}
