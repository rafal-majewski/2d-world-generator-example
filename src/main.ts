import {paintCanvas} from "./paintCanvas.js";
import {resizeCanvasToItsContainer} from "./resizeCanvasToItsContainer.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
resizeCanvasToItsContainer(canvas);
paintCanvas(canvas);

window.addEventListener("resize", function handleWindowResize(): void {
	resizeCanvasToItsContainer(canvas);
	paintCanvas(canvas);
});

requestAnimationFrame(function animate(): void {
	paintCanvas(canvas);
	requestAnimationFrame(animate);
});
