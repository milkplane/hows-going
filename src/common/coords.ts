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

export const getNeighboursCoords = (coords: Coords): Coords[] => {
    return [
        createShiftedCoords(coords, CoordsShift.Bottom),
        createShiftedCoords(coords, CoordsShift.Top),
        createShiftedCoords(coords, CoordsShift.Left),
        createShiftedCoords(coords, CoordsShift.Right),
    ]
}

export const areEqualCoords = (coords1: Coords, coords2: Coords) => {
    return coords1.i == coords2.i &&
        coords1.j == coords2.j
}