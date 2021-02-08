export type SensorError = NodeJS.ErrnoException | string | null;

export type ValueWithID = {
	id: string;
	t: number | null;
};

export function list(cb: (err: SensorError, result: string[]) => any): any;
export function list(): string[];

export function readC(
	id: string,
	digits: number,
	cb: (err: SensorError, result: number | null) => any
): any;
export function readC(id: string, digits: number): number | null;

export function readF(
	id: string,
	digits: number,
	cb: (err: SensorError, result: number | null) => any
): any;
export function readF(id: string, digits: number): number | null;

export function readSimpleC(
	digits: number,
	cb: (err: SensorError, result: number | null) => any
): any;
export function readSimpleC(digits: number): number | null;

export function readSimpleF(
	digits: number,
	cb: (err: SensorError, result: number | null) => any
): any;
export function readSimpleF(digits: number): number | null;

export function readAllC(
	digits: number,
	cb: (err: string | null, result: ValueWithID[]) => any
): any;
export function readAllC(digits: number): ValueWithID[];

export function readAllF(
	digits: number,
	cb: (err: string | null, result: ValueWithID[]) => any
): any;
export function readAllF(digits: number): ValueWithID[];

export function setW1Directory(devicePath: string): void;
