import SimplexNoise from "simplex-noise";
import { Cell, createCell } from "../cell";
import { formMap } from "../map";
import { createSize, Size } from "../size";

export type Noise = number[][];

export const createNoise = (size: Size): Noise => {
    const simplex = new SimplexNoise();
    const zoom = 12;
    const noise: Noise = [];

    for (let i = 0; i < size.height; i++) {
        const row: number[] = [];

        for (let j = 0; j < size.width; j++) {
            row.push(simplex.noise2D(i / zoom, j / zoom));
        }

        noise.push(row);
    }

    return noise;
}

const getNoiseSize = (noise: Noise) => {
    if (!noise || !noise[0]) return createSize(0, 0);

    return createSize(noise.length, noise[0].length);
}

export const formMapFromNoise = (noise: Noise) => {
    const matrix: Cell[][] = [];
    const size = getNoiseSize(noise);

    for (let i = 0; i < size.height; i++) {
        const row: Cell[] = [];

        for (let j = 0; j < size.width; j++) {
            const height = noise[i][j];
            row.push(createCell(height));
        }

        matrix.push(row);
    }

    return formMap(matrix);
}