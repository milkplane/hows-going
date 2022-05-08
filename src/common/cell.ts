export enum CellType {
    Ground,
    Water,
    Bush,
}

export type Cell = {
    height: number;
    type: CellType;
}

export const copyCell = (cell: Cell): Cell => {
    return {
        ...cell,
    };
}

const TOO_HIGH_FOR_WATER = 0;
const TOO_HIGH_FOR_BUSH = 0.3;
const TOO_LOW_FOR_BUSH = -0.1;

const getVerifiedType = (height: number, type: CellType): CellType => {
    if (type === CellType.Bush && height >= TOO_HIGH_FOR_BUSH ||
        type === CellType.Bush && height <= TOO_LOW_FOR_BUSH ||
        type === CellType.Water && height >= TOO_HIGH_FOR_WATER) {
        return CellType.Ground;
    }

    return type;
}

export const createCell = (height: number, type: CellType = CellType.Ground): Cell => {
    return {
        height,
        type: getVerifiedType(height, type),
    };
}