import type {Coordinates} from "./Coordinates.js";

export function createCoordinates(x: number, y: number): Coordinates {
	return {
		x,
		y,
	};
}
