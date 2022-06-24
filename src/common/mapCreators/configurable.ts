import { createSeed, Seed } from "../seed";;
import SimplexNoise from 'simplex-noise';
import { CellType, createCell, isCellHeightAllowed } from '../cell';
import { Size } from '../size';
import flat from './flat';
import landscape from "./landscape";

export type MapConfig = {
    seed: Seed;
    size: Size;
    flatness: number; // [0, 1];
    isLandscaped: boolean;
}

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

const createMoisturedCell = (height: number) => {
    if (isCellHeightAllowed(height, CellType.Water)) {
        return createCell(height, CellType.Water)
    }

    return createCell(height);
}

const configurable = (config: MapConfig) => {
    const simplex = new SimplexNoise(config.seed);
    const flatMatrix = flat(config.size);
    const zoom = 12;

    for (let i = 0; i < config.size.height; i++) {
        for (let j = 0; j < config.size.width; j++) {
            const cellHeight = simplex.noise2D(i / zoom, j / zoom) * (1 - config.flatness); // flatness [0,1]
            flatMatrix[i][j] = createMoisturedCell(cellHeight);
        }
    }

    landscape(flatMatrix)

    return flatMatrix;
}

export default configurable;