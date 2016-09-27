// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('tap').test;
const tester = require('./tester');
const m = require('../');
const expected = require('./expected_results.json');

const expResult = tester.expResult;

const configs = [{ fn: m.readSimpleC, exp: expected.C },
	{ fn: m.readSimpleF, exp: expected.F }];

const arrArgs = [
	{ a: [], i: 3, expErr: false },
	{ a: [2], i: 2, expErr: false },
	{ a: [3], i: 3, expErr: false },
];

for (const c of configs) {
	for (const arg of arrArgs) {
		test(`Getting temperature using ${c.fn.name} (0 device)...`, (t) => {
			tester(t, c.fn, arg.a, '0-devices', true, null);
		});

		test(`Getting temperature using ${c.fn.name} (1 device)...`, (t) => {
			tester(t, c.fn, arg.a, '1-device', arg.expErr, expResult(c.exp[arg.i], arg.expErr));
		});

		test(`Getting temperature using ${c.fn.name} (2 devices)...`, (t) => {
			tester(t, c.fn, arg.a, '2-devices', true, null);
		});

		test(`Getting temperature using ${c.fn.name} (6 devices)...`, (t) => {
			tester(t, c.fn, arg.a, '6-devices', true, null);
		});

		test(`Getting temperature using ${c.fn.name} (1 device-no in file)...`, (t) => {
			tester(t, c.fn, arg.a, '1-device-no', false, null);
		});

		test(`Getting temperature using ${c.fn.name} (no devices)...`, (t) => {
			tester(t, c.fn, arg.a, 'no-devices', true, null);
		});

		test(`Getting temperature using ${c.fn.name} (non existent device)...`, (t) => {
			tester(t, c.fn, arg.a, 'non-device-path', true, null);
		});
	}
}
