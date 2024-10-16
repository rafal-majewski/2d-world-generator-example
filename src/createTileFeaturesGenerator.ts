import type {Coordinates} from "./Coordinates.js";
import type {HeightTileFeatureGenerator} from "./HeightTileFeatureGenerator.js";
import type {TemperatureTileFeatureGenerator} from "./TemperatureTileFeatureGenerator.js";
import type {TileFeatures} from "./TileFeatures.js";
import type {TileFeaturesGenerator} from "./TileFeaturesGenerator.js";

function computeTileType(height: number, temperature: number): TileFeatures["type"] {
	if (temperature < 0) {
		if (height < 0) {
			return "frozenWater";
		}

		return "snow";
	}

	if (height <= 10) {
		return "water";
	}

	if (height * 1 < temperature) {
		return "sand";
	}

	if (height * 0.2 < temperature) {
		return "grass";
	}

	return "mountain";

	// if (temperature - height < 0.2) {
	// 	return "mountain";
	// }
}

export function createTileFeaturesGenerator(
	heightGenerator: HeightTileFeatureGenerator,
	temperatureGenerator: TemperatureTileFeatureGenerator,
): TileFeaturesGenerator {
	return function tileFeaturesGenerator(tilePosition: Coordinates): TileFeatures {
		const height = heightGenerator(tilePosition);
		const temperature = temperatureGenerator(tilePosition) - height * 0.1;
		const type: TileFeatures["type"] = computeTileType(height, temperature);

		return {
			height,
			temperature,
			type,
		};
	};
}
