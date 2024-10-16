import type {Coordinates} from "./Coordinates.js";
import type {TemperatureTileFeatureGenerator} from "./TemperatureTileFeatureGenerator.js";

type Coefficient = Readonly<{
	shiftX: number;
	shiftY: number;
	amplitude: number;
	frequency: number;
	angle: number;
}>;

const temperatureCoefficients: readonly Coefficient[] = Array(100)
	.fill(null)
	.map(
		(_: null, index: number): Coefficient => ({
			shiftX: Math.random(),
			shiftY: Math.random(),
			amplitude: 8 * 1.05 ** -index,
			frequency: 0.002 * 1.05 ** index,
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

function computeTemperature(position: Coordinates): number {
	return evaluateCoefficients(temperatureCoefficients, position) + 15;
}

export function createTemperatureTileFeatureGenerator(): TemperatureTileFeatureGenerator {
	const cache = new Map<Coordinates["x"], Map<Coordinates["y"], number>>();
	return function temperatureTileFeatureGenerator(tilePosition: Coordinates): number {
		const cachedRow = cache.get(tilePosition.x);

		if (typeof cachedRow !== "undefined") {
			const cachedValue = cachedRow.get(tilePosition.y);

			if (typeof cachedValue !== "undefined") {
				return cachedValue;
			}

			const temperature = computeTemperature(tilePosition);
			cachedRow.set(tilePosition.y, temperature);
			return temperature;
		}

		const temperature = computeTemperature(tilePosition);
		const newRow = new Map<Coordinates["y"], number>();
		newRow.set(tilePosition.y, temperature);
		cache.set(tilePosition.x, newRow);
		return temperature;
	};
}
