export type TileFeatures = Readonly<{
	height: number;
	temperature: number;
	type: "snow" | "mountain" | "grass" | "sand" | "water" | "frozenWater";
}>;
