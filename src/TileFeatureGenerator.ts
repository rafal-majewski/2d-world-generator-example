import type {Coordinates} from "./Coordinates.js";
export type TileFeatureGenerator<Feature> = (tilePosition: Coordinates) => Feature;
