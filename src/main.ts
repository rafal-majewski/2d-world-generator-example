import {paintCanvas} from "./paintCanvas.js";
import {adjustCameraFieldOfView} from "./adjustCameraFieldOfView.js";
import type {Camera} from "./Camera.js";
import {createCamera} from "./createCamera.js";
import {resizeCanvasToItsContainer} from "./resizeCanvasToItsContainer.js";
import {createTileFeaturesGenerator} from "./createTileFeaturesGenerator.js";
import {createHeightTileFeatureGenerator} from "./createHeightTileFeatureGenerator.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
resizeCanvasToItsContainer(canvas);

let camera: Camera = createCamera(
	{
		x: 0,
		y: 0,
	},
	canvas,
);

const heightTileFeaturesGenerator = createHeightTileFeatureGenerator();
const tileFeaturesGenerator = createTileFeaturesGenerator(heightTileFeaturesGenerator);
paintCanvas(canvas, camera, tileFeaturesGenerator);

window.addEventListener("resize", function handleWindowResize(): void {
	resizeCanvasToItsContainer(canvas);
	camera = adjustCameraFieldOfView(camera, canvas);
	paintCanvas(canvas, camera, tileFeaturesGenerator);
});

requestAnimationFrame(function animate(): void {
	camera = {
		...camera,
		position: {
			x: camera.position.x,
			y: camera.position.y + 1,
		},
	};
	paintCanvas(canvas, camera, tileFeaturesGenerator);
	requestAnimationFrame(animate);
});
