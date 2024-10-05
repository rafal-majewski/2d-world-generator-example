import type {Coordinates} from "./Coordinates.js";
import type {HeightTileFeatureGenerator} from "./HeightTileFeatureGenerator.js";
import type {TileFeatures} from "./TileData.js";
import type {TileFeaturesGenerator} from "./TileFeaturesGenerator.js";

export function createTileFeaturesGenerator(
	heightGenerator: HeightTileFeatureGenerator,
): TileFeaturesGenerator {
	return function tileFeaturesGenerator(tilePosition: Coordinates): TileFeatures {
		const height = heightGenerator(tilePosition);

		return {
			height,
		};
	};
}
