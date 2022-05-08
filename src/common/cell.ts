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

const MAX_WATER_HEIGHT = 0 - Number.EPSILON;
const MIN_BUSH_HEIGHT = -0.1 - Number.EPSILON;
const MAX_BUSH_HEIGHT = 0.3 - Number.EPSILON;

const getVerifiedType = (height: number, type: CellType): CellType => {
    if (type === CellType.Bush && height > MAX_BUSH_HEIGHT ||
        type === CellType.Bush && height < MIN_BUSH_HEIGHT ||
        type === CellType.Water && height > MAX_WATER_HEIGHT) {
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