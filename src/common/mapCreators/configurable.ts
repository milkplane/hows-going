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
type HashGetter = (config: MapConfig) => string;

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


const getHashFromConfig = (config: MapConfig) => {
    return toStringSize(config.size) + config.seed;
}

const withCaching = (getHash: HashGetter) => {
    const hashed = new Map<Seed, HashedEntry>()
    return (config: MapConfig) => {
        const hash = getHash(config);
        const entry = hashed.get(hash) ||
        [createNoise(config.size, config.seed), createBushCoords(config.size, config.seed)];

        hashed.set(hash, entry);

        return mergeNoiseIntoMap(entry[0], entry[1], config);
    }
}

const configurable = withCaching(getHashFromConfig);

export default configurable;