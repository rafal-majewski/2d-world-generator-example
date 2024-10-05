import type {Camera} from "./Camera.js";
import type {Coordinates} from "./Coordinates.js";
import {createCoordinates} from "./createCoordinates.js";
import type {TileFeatures} from "./TileFeatures.js";
import type {TileFeaturesGenerator} from "./TileFeaturesGenerator.js";

export function paintCanvas(
	canvas: HTMLCanvasElement,
	camera: Camera,
	tileFeaturesGenerator: TileFeaturesGenerator,
): void {
	const ctx = canvas.getContext("2d");

	if (ctx !== null) {
		const ctxScaleX = canvas.width / camera.fieldOfView.width;
		const ctxScaleY = canvas.height / camera.fieldOfView.height;
		ctx.resetTransform();

		ctx.transform(
			ctxScaleX,
			0,
			0,
			ctxScaleY,
			-camera.position.x * ctxScaleX + canvas.width / 2,
			-camera.position.y * ctxScaleY + canvas.height / 2,
		);

		const minimalVisibleTilePositionX = Math.floor(
			camera.position.x - camera.fieldOfView.width / 2 + 0.5,
		);

		const maximalVisibleTilePositionX = Math.ceil(
			camera.position.x + camera.fieldOfView.width / 2 - 0.5,
		);

		const minimalVisibleTilePositionY = Math.floor(
			camera.position.y - camera.fieldOfView.height / 2 + 0.5,
		);

		const maximalVisibleTilePositionY = Math.ceil(
			camera.position.y + camera.fieldOfView.height / 2 - 0.5,
		);

		for (
			let tilePositionY = minimalVisibleTilePositionY;
			tilePositionY <= maximalVisibleTilePositionY;
			++tilePositionY
		) {
			for (
				let tilePositionX = minimalVisibleTilePositionX;
				tilePositionX <= maximalVisibleTilePositionX;
				++tilePositionX
			) {
				const tilePosition: Coordinates = createCoordinates(tilePositionX, tilePositionY);
				const tileFeatures: TileFeatures = tileFeaturesGenerator(tilePosition);

				if (tileFeatures.height >= 0) {
					ctx.fillStyle = "green";
				} else {
					ctx.fillStyle = "blue";
				}

				ctx.fillRect(tilePositionX - 0.5, tilePositionY - 0.5, 1, 1);
			}
		}
	}
}
