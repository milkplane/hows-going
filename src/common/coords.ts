export type Coords = {
    i: number;
    j: number;
}

export enum CoordsShift {
    Top,
    Bottom,
    Left,
    Right,
}

export const stringifyCoords = (coords: Coords): string => {
    return `(${coords.i}, ${coords.j})`;
}

export const createCoords = (i: number, j: number): Coords => {
    return {
        i,
        j,
    }
}

export const createShiftedCoords = (coords: Coords, shift: CoordsShift): Coords => {
    switch (shift) {
        case CoordsShift.Top:
            return createCoords(coords.i - 1, coords.j);
        case CoordsShift.Bottom:
            return createCoords(coords.i + 1, coords.j);
        case CoordsShift.Left:
            return createCoords(coords.i, coords.j - 1);
        case CoordsShift.Right:
            return createCoords(coords.i, coords.j + 1);
    }
}