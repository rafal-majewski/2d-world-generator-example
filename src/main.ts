import {paintCanvas} from "./paintCanvas.js";
import {adjustCameraFieldOfView} from "./adjustCameraFieldOfView.js";
import type {Camera} from "./Camera.js";
import {createCamera} from "./createCamera.js";
import {resizeCanvasToItsContainer} from "./resizeCanvasToItsContainer.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
resizeCanvasToItsContainer(canvas);

let camera: Camera = createCamera(
	{
		x: 0,
		y: 0,
	},
	canvas,
);

paintCanvas(canvas, camera);

window.addEventListener("resize", function handleWindowResize(): void {
	resizeCanvasToItsContainer(canvas);
	camera = adjustCameraFieldOfView(camera, canvas);
	paintCanvas(canvas, camera);
});

requestAnimationFrame(function animate(): void {
	paintCanvas(canvas, camera);
	requestAnimationFrame(animate);
});
