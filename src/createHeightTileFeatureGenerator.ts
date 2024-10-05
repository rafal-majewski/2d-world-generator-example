import type {Coordinates} from "./Coordinates.js";
import type {HeightTileFeatureGenerator} from "./HeightTileFeatureGenerator.js";

export function createHeightTileFeatureGenerator(): HeightTileFeatureGenerator {
	return function heightTileFeatureGenerator(tilePosition: Coordinates): number {
		return Math.sin(tilePosition.x * 0.5 + tilePosition.y * 0.5);
	};
}
