#!/usr/bin/env node
const meow = require('meow');
const sensor = require('./');
const Table = require('cli-table3');

const cli = meow(`
	Name
	  ds18b20 - get temperature readings from a DS18B20 1-Wire sensor connected to a Raspberry Pi

	Usage
	  $ ds18b20 [deviceId] [options]

	Options
	  --all, -a       Get readings of all temperature sensors found
	  --list, -l      List device ids of all 1-Wire sensors found
	  --degf, -f      Get temperature in degF instead of degC
	  --decimals, -d  Number of decimal digits to display
	  --help, -h      Show help
	  --version, -v   Display version information

	Examples
	  Get temperature of sensor (only works if there is exactly one DS18B20 1-Wire sensor present)
	  $ ds18b20

	  Get temperature readings of all 1-Wire sensors found
	  $ ds18b20 -a

	  Get temperature of a specific 1-Wire device id
	  $ ds18b20 28-051724b238ff

	  Get temperature of a specific 1-Wire device id in degF with 2 decimals
	  $ ds18b20 28-051724b238ff -f -d 2

	  List device ids of all 1-Wire sensors found
	  $ ds18b20 --list
`, {
	flags: {
		all: {
			type: "boolean",
			alias: "a"
		},
		list: {
			type: "boolean",
			alias: "l"
		},
		degf: {
			type: "boolean",
			alias: "f"
		},
		decimals: { alias: "d" },
		help: { alias: "h"},
		version: {alias: "v"}
	}
});


function sensorTable(data, head, notFoundMessage) {
	const table = new Table({
		head,
		style: { head: ['green'] },
	});

	if (data.length === 0) {
		const content = [{ colSpan: head.length, content: notFoundMessage, hAlign: 'center' }];
		table.push(content);
	} else {
		for (const row of data) {
			let values;
			if (typeof row === 'object') {
				values = Object.keys(row).map(key => row[key]);
			} else {
				values = [row];
			}
			table.push(values);
		}
	}
	return table.toString();
}

// accept --degF too since some people are accustomed to capitalizing "F"
const degF = cli.flags.degf || cli.flags.degF;
const c = console.log;
const flags = cli.flags;

const decimals = Number.isInteger(flags.decimals) ? flags.decimals : 3;
const units = degF ? 'degF' : 'degC';

if (flags.all) {
	const fn = degF ? sensor.readAllF : sensor.readAllC;
	c(sensorTable(fn(decimals), ['Device Id', `Temp (${units})`], 'No sensors found'));
} else if (flags.list) {
	c(sensorTable(sensor.list(), ['Device Id'], 'No sensors found'));
} else if (cli.input[0]) {
	const fn = degF ? sensor.readF : sensor.readC;
	c(`${fn(cli.input[0], decimals)} ${units}`);
} else {
	const fn = degF ? sensor.readSimpleF : sensor.readSimpleC;
	c(`${fn(decimals)} ${units}`);
}
