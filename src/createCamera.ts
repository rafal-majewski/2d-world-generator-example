import type {Camera} from "./Camera.js";
import {computeCameraFieldOfView} from "./computeCameraFieldOfView.js";
import type {Coordinates} from "./Coordinates.js";
import type {Dimensions2D} from "./Dimensions2D.js";

export function createCamera(position: Coordinates, canvas: HTMLCanvasElement): Camera {
	const fieldOfView: Dimensions2D = computeCameraFieldOfView(canvas);

	return {
		position,
		fieldOfView,
	};
}
