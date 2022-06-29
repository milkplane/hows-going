import { createSeed, Seed } from "../seed";
import { Size, toStringSize } from '../size';
import { Coords } from "../coords";
import { createNoise, formMapFromNoise, Noise } from "./noise";
import { createFlattenMap, createLandscapedMap, createMoisturedMap, MapData } from "../map";
import createBushCoords from "./maze";

export type MapConfig = {
    seed: Seed;
    size: Size;
    flatness: number; // [0, 1];
    isLandscaped: boolean;
}

type HashedEntry = [noise: Noise, bushes: Coords[]];

export const createMapConfig = (size: Size,
    flatness: number = 1,
    isLandscaped: boolean = false,
    seed: Seed = createSeed()) => {
    return {
        seed,
        size,
        flatness,
        isLandscaped,
    }
}

const mergeNoiseIntoMap = (noise: Noise, bushes: Coords[], config: MapConfig): MapData => {
    const rawMap = formMapFromNoise(noise);
    const flattenMap = createFlattenMap(rawMap, 1 - config.flatness);
    const moisturedMap = createMoisturedMap(flattenMap);
    const landscapedMap = config.isLandscaped ? createLandscapedMap(moisturedMap, bushes) : moisturedMap;

    return landscapedMap;
}

const withHash = () => {
    const hashed = new Map<Seed, HashedEntry>()
    return (config: MapConfig) => {
        const hash = toStringSize(config.size) + config.seed;
        const entry = hashed.get(hash) ||
        [createNoise(config.size), createBushCoords(config.size)];

        hashed.set(hash, entry);

        return mergeNoiseIntoMap(entry[0], entry[1], config);
    }
}

const configurable = withHash();

export default configurable;