import type {Camera} from "./Camera.js";
import type {Coordinates} from "./Coordinates.js";
import {createCoordinates} from "./createCoordinates.js";
import type {TileFeatures} from "./TileFeatures.js";
import type {TileFeaturesGenerator} from "./TileFeaturesGenerator.js";

type RgbColor = Readonly<{
	red: number;
	green: number;
	blue: number;
}>;

function interpolateBetweenRgbColors(color1: RgbColor, color2: RgbColor, weight: number): RgbColor {
	return {
		red: color1.red * (1 - weight) + color2.red * weight,
		green: color1.green * (1 - weight) + color2.green * weight,
		blue: color1.blue * (1 - weight) + color2.blue * weight,
	};
}

function stringifyRgbColor(color: RgbColor): string {
	return `rgb(${color.red},${color.green},${color.blue})`;
}

const snowColor: RgbColor = {
	red: 255,
	green: 255,
	blue: 255,
};

const mountainColor: RgbColor = {
	red: 128,
	green: 128,
	blue: 128,
};

const grassColor: RgbColor = {
	red: 0,
	green: 200,
	blue: 0,
};

const sandColor: RgbColor = {
	red: 255,
	green: 255,
	blue: 0,
};

const frozenWaterColor: RgbColor = {
	red: 204,
	green: 204,
	blue: 255,
};

const whiteColor: RgbColor = {
	red: 255,
	green: 255,
	blue: 255,
};

const blackColor: RgbColor = {
	red: 0,
	green: 0,
	blue: 0,
};

const waterColor: RgbColor = {
	red: 0,
	green: 0,
	blue: 255,
};

const tileTileToColorMap: Readonly<Record<TileFeatures["type"], RgbColor>> = {
	snow: snowColor,
	mountain: mountainColor,
	grass: grassColor,
	sand: sandColor,
	water: waterColor,
	frozenWater: frozenWaterColor,
};

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
				const tileAbovePosition: Coordinates = createCoordinates(tilePositionX, tilePositionY - 1);
				const tileFeatures: TileFeatures = tileFeaturesGenerator(tilePosition);
				const tileAboveFeatures: TileFeatures = tileFeaturesGenerator(tileAbovePosition);
				const originalTileColor = tileTileToColorMap[tileFeatures.type];
				// add lightness if water is shallow

				const tileColor =
					tileFeatures.type === "water"
						? interpolateBetweenRgbColors(
								originalTileColor,
								whiteColor,
								Math.max(0, tileFeatures.height * 0.02 + 0.2),
							)
						: originalTileColor;

				if (tileAboveFeatures.type !== "water" && tileAboveFeatures.type !== "frozenWater") {
					if (tileAboveFeatures.height > tileFeatures.height) {
						const weight = Math.min(1, (tileAboveFeatures.height - tileFeatures.height) / 10);
						const finalColor = interpolateBetweenRgbColors(tileColor, blackColor, weight);
						ctx.fillStyle = stringifyRgbColor(finalColor);
					} else if (tileAboveFeatures.height < tileFeatures.height) {
						const weight = Math.min(1, (tileFeatures.height - tileAboveFeatures.height) / 10);
						const finalColor = interpolateBetweenRgbColors(tileColor, whiteColor, weight);
						ctx.fillStyle = stringifyRgbColor(finalColor);
					} else {
						ctx.fillStyle = stringifyRgbColor(tileColor);
					}
				} else {
					ctx.fillStyle = stringifyRgbColor(tileColor);
				}

				ctx.fillRect(tilePositionX - 0.5, tilePositionY - 0.5, 1, 1);
			}
		}
	}
}
