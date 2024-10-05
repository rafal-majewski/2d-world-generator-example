import type {Coordinates} from "./Coordinates.js";
import type {HeightTileFeatureGenerator} from "./HeightTileFeatureGenerator.js";

type Coefficient = Readonly<{
	shiftX: number;
	shiftY: number;
	amplitude: number;
	frequency: number;
	angle: number;
}>;

const baseHeightCoefficients: readonly Coefficient[] = Array(100)
	.fill(null)
	.map(
		(_: null, index: number): Coefficient => ({
			shiftX: Math.random(),
			shiftY: Math.random(),
			amplitude: 8 * 1.05 ** -index,
			frequency: 0.006 * 1.05 ** index,
			angle: Math.random() * Math.PI * 2,
		}),
	);

const hillnessCoefficients: readonly Coefficient[] = Array(30)
	.fill(null)
	.map(
		(_: null, index: number): Coefficient => ({
			shiftX: Math.random(),
			shiftY: Math.random(),
			amplitude: 3 * 1.05 ** -index,
			frequency: 0.003 * 1.05 ** index,
			angle: Math.random() * Math.PI * 2,
		}),
	);

function evaluateCoefficients(coefficients: readonly Coefficient[], position: Coordinates): number {
	return coefficients.reduce((accumulatedSum: number, coefficient: Coefficient): number => {
		const rotatedPosition: Coordinates = {
			x: position.x * Math.cos(coefficient.angle) - position.y * Math.sin(coefficient.angle),
			y: position.x * Math.sin(coefficient.angle) + position.y * Math.cos(coefficient.angle),
		};

		return (
			accumulatedSum +
			coefficient.amplitude *
				Math.sin(Math.PI * 2 * (coefficient.frequency * rotatedPosition.x + coefficient.shiftX)) *
				Math.sin(Math.PI * 2 * (coefficient.frequency * rotatedPosition.y + coefficient.shiftY))
		);
	}, 0);
}

function computeHeight(position: Coordinates): number {
	const baseHeight = evaluateCoefficients(baseHeightCoefficients, position);
	const hillness = evaluateCoefficients(hillnessCoefficients, position);

	if (hillness > 1) {
		return baseHeight * hillness;
	}

	return baseHeight;
}

export function createHeightTileFeatureGenerator(): HeightTileFeatureGenerator {
	const cache = new Map<Coordinates["x"], Map<Coordinates["y"], number>>();
	return function heightTileFeatureGenerator(tilePosition: Coordinates): number {
		const cachedRow = cache.get(tilePosition.x);

		if (typeof cachedRow !== "undefined") {
			const cachedValue = cachedRow.get(tilePosition.y);

			if (typeof cachedValue !== "undefined") {
				return cachedValue;
			}

			const height = computeHeight(tilePosition);
			cachedRow.set(tilePosition.y, height);
			return height;
		}

		const height = computeHeight(tilePosition);
		const newRow = new Map<Coordinates["y"], number>();
		newRow.set(tilePosition.y, height);
		cache.set(tilePosition.x, newRow);
		return height;
	};
}
