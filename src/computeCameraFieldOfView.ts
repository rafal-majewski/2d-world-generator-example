import type {Dimensions2D} from "./Dimensions2D.js";
const pixelsPerUnit = 50;

export function computeCameraFieldOfView(canvas: HTMLCanvasElement): Dimensions2D {
	return {
		width: canvas.width / pixelsPerUnit,
		height: canvas.height / pixelsPerUnit,
	};
}
