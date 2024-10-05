export function resizeCanvasToItsContainer(canvas: HTMLCanvasElement): void {
	const container = canvas.parentElement as HTMLElement;
	canvas.width = container.clientWidth;
	canvas.height = container.clientHeight;
}
