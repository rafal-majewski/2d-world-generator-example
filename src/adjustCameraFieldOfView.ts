import type {Camera} from "./Camera.js";
import {computeCameraFieldOfView} from "./computeCameraFieldOfView.js";
import type {Dimensions2D} from "./Dimensions2D.js";

export function adjustCameraFieldOfView(camera: Camera, canvas: HTMLCanvasElement): Camera {
	const newFieldOfView: Dimensions2D = computeCameraFieldOfView(canvas);

	return {
		...camera,
		fieldOfView: newFieldOfView,
	};
}
