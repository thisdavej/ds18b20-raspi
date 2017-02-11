# ds18b20-raspi

Get temperature readings from a [DS18B20](https://www.maximintegrated.com/en/products/analog/sensors-and-sensor-interface/DS18B20.html) 1-Wire sensor connected to a Raspberry Pi.

## Noteworthy Features

- Includes `readSimpleC` (degC) and `readSimpleF` (degF) functions to make it simple to read temperatures if only a single 1-Wire sensor is present. No need to supply the 1-Wire deviceId as a parameter.
- Both asynchronous and synchronous versions provided.  Invoke the synchronous version of a given function by simply not providing a callback function.
- Built-in CLI (see documentation at the end of this page) for easy reading of temperatures from the command-line with an extensive set of options.

## Install

```
$ npm install --save ds18b20-raspi
```


## Usage/API

```js
const sensor = require('ds18b20-raspi');
```


### readSimpleC([decimals], [callback(error, reading)])

Get temperature (degC) of sensor (only works if there is exactly one DS18B20 1-Wire sensor present)

```js
const tempC = sensor.readSimpleC();
console.log(`${tempC} degC`);

// round temperature reading to 1 digit
const tempC = sensor.readSimpleC(1);
console.log(`${tempC} degC`);


// async version
sensor.readSimpleC((err, temp) => {
	if (err) {
		console.log(err);
	} else {
	console.log(`${temp} degC`);
	}
});

// round temperature reading to 1 digit
sensor.readSimpleC(1, (err, temp) => {
	if (err) {
		console.log(err);
	} else {
	console.log(`${temp} degC`);
	}
});
```


### readSimpleF([decimals], [callback(error, reading)])

Get temperature (degF) of sensor (only works if there is exactly one DS18B20 1-Wire sensor present)

```js
const tempF = sensor.readSimpleF();
console.log(`${tempF} degF`);
```

See other `readSimpleC` examples above and change `readSimpleC` to `readSimpleF`.


### readAllC([decimals], [callback(error, readings)])

Get readings (degC) of all temperature sensors found

```js
const temps = sensor.readAllC();
console.log(temps);

// round temperature readings to 2 digits
const temps = sensor.readAllC(2);
console.log(temps);

// async version
sensor.readAllC((err, temps) => {
	if (err) {
		console.log(err);
	} else {
		console.log(temps);
	}
});

// round temperature readings to 2 digits
sensor.readAllC(2, (err, temps) => {
	if (err) {
		console.log(err);
	} else {
		console.log(temps);
	}
});
```


### readAllF([decimals], [callback(error, readings)])

Get readings (degF) of all temperature sensors found

```js
const temps = sensor.readAllF();
console.log(temps);
```

See other `readAllC` examples above and change `readAllC` to `readAllF`.


### readC(deviceId, [decimals], [callback(error, readings)])

Get temperature reading (degC) for a specific 1-Wire device id

```js
const deviceId = '28-051724b238ff';
const temp = sensor.readC(deviceId);
console.log(temp);

// round temperature readings to 2 digits
const deviceId = '28-051724b238ff';
const temp = sensor.readC(deviceId, 2);
console.log(temp);


// async version
const deviceId = '28-051724b238ff';
sensor.readC(deviceId, (err, temp) => {
	if (err) {
		console.log(err);
	} else {
		console.log(temp);
	}
});

// round temperature readings to 2 digits
const deviceId = '28-051724b238ff';
sensor.readC(deviceId, 2, (err, temp) => {
	if (err) {
		console.log(err);
	} else {
		console.log(temp);
	}
});
```


### readF(deviceId, [decimals], [callback(error, readings)])

Get temperature reading (degF) for a specific 1-Wire device id

```js
const deviceId = '28-051724b238ff';
const temp = sensor.readF(deviceId);
console.log(temp);
```

See other `readC` examples above and change `readC` to `readF`.


### list([callback(error, deviceIds)])

List device ids of all 1-Wire sensors found

```js
const list = sensor.list();
console.log(list);

// async version
sensor.list((err, deviceIds) => {
	if (err) {
		console.log(err);
	} else {
		console.log(deviceIds);
	}
});
```

## CLI

### Install

```
$ npm install -g ds18b20-raspi
```

### Usage

```
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
```

## License

MIT © [Dave Johnson (thisDaveJ)](http://thisdavej.com)
