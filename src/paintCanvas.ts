export function paintCanvas(canvas: HTMLCanvasElement): void {
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
