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

const getVerifiedHeight = (height: number, type: CellType): number => {
    if (type === CellType.Bush) {
        if (height > MAX_BUSH_HEIGHT) return MAX_BUSH_HEIGHT;
        if (height < MIN_BUSH_HEIGHT) return MAX_BUSH_HEIGHT;
    } else if (type === CellType.Water && height > MAX_WATER_HEIGHT) {
        return MAX_WATER_HEIGHT;
    }

    return height;
}

const shouldBeGround = (height: number, type: CellType): boolean => {
    return type === CellType.Bush && height > MAX_BUSH_HEIGHT ||
    type === CellType.Bush && height < MIN_BUSH_HEIGHT ||
    type === CellType.Water && height > MAX_WATER_HEIGHT;
}

const getVerifiedType = (height: number, type: CellType): CellType => {
    if (shouldBeGround(height, type)) {
        return CellType.Ground;
    }

    return type;
}

export const createCell = (height: number, type: CellType = CellType.Ground): Cell => {
    const newHeight = getVerifiedHeight(height, type);
    const newType = getVerifiedType(newHeight, type);
    return {
        height: newHeight, 
        type: newType,
    };
}