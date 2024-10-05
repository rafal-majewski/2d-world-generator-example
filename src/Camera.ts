import type {Coordinates} from "./Coordinates.js";
import type {Dimensions2D} from "./Dimensions2D.js";

export type Camera = Readonly<{
	position: Coordinates;
	fieldOfView: Dimensions2D;
}>;
