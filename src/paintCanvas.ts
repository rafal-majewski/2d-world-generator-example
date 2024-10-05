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

const shallowWaterColor: RgbColor = {
	red: 0,
	green: 0,
	blue: 255,
};

const deepWaterColor: RgbColor = {
	red: 0,
	green: 0,
	blue: 128,
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
				const tileFeatures: TileFeatures = tileFeaturesGenerator(tilePosition);

				if (tileFeatures.height >= 100) {
					ctx.fillStyle = stringifyRgbColor(snowColor);
				} else if (tileFeatures.height >= 50) {
					const interpolatedRgbColor = interpolateBetweenRgbColors(
						mountainColor,
						snowColor,
						(tileFeatures.height - 50) / 50,
					);

					ctx.fillStyle = stringifyRgbColor(interpolatedRgbColor);
				} else if (tileFeatures.height >= 3) {
					const interpolatedRgbColor = interpolateBetweenRgbColors(
						grassColor,
						mountainColor,
						(tileFeatures.height - 3) / (50 - 3),
					);

					ctx.fillStyle = stringifyRgbColor(interpolatedRgbColor);
				} else if (tileFeatures.height >= 0) {
					const interpolatedRgbColor = interpolateBetweenRgbColors(
						sandColor,
						grassColor,
						tileFeatures.height / 3,
					);

					ctx.fillStyle = stringifyRgbColor(interpolatedRgbColor);
				} else if (tileFeatures.height >= -10) {
					const interpolatedRgbColor = interpolateBetweenRgbColors(
						deepWaterColor,
						shallowWaterColor,
						(tileFeatures.height + 10) / 10,
					);

					ctx.fillStyle = stringifyRgbColor(interpolatedRgbColor);
				} else {
					ctx.fillStyle = stringifyRgbColor(deepWaterColor);
				}

				// if (tileFeatures.height >= 3) {
				// 	ctx.fillStyle = "white";
				// } else if (tileFeatures.height <= 0) {
				// 	ctx.fillStyle = "black";
				// } else {
				// 	const interpolatedRgbColor = interpolateBetweenRgbColors(
				// 		{red: 0, green: 0, blue: 0},
				// 		{red: 255, green: 255, blue: 255},
				// 		tileFeatures.height / 3,
				// 	);

				// 	ctx.fillStyle = stringifyRgbColor(interpolatedRgbColor);
				// }

				ctx.fillRect(tilePositionX - 0.5, tilePositionY - 0.5, 1, 1);
			}
		}
	}
}
