import type {Coordinates} from "./Coordinates.js";
import type {TileFeatures} from "./TileData.js";
export type TileFeaturesGenerator = (tilePosition: Coordinates) => TileFeatures;
