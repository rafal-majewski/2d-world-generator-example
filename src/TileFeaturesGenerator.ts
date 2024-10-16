import type {Coordinates} from "./Coordinates.js";
import type {TileFeatures} from "./TileFeatures.js";
export type TileFeaturesGenerator = (tilePosition: Coordinates) => TileFeatures;
