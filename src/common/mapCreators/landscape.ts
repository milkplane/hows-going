import { CellType, isCellHeightAllowed } from "../cell";
import { Coords, createCoords } from "../coords";
import { getMapSize, MapData } from "../map";
import { createSize, Size } from "../size";
enum Orientation {
    Horizontal,
    Vertical,
}

const getDevideOrientaion = (size: Size) => {
    return size.height < size.width ? Orientation.Vertical : Orientation.Horizontal;
}

const getRandomIntExclude = (max: number) => {
    return Math.floor(Math.random() * max);
}

const isTooSmall = (mazeSize: Size) => {
    return mazeSize.height < 2 || mazeSize.width < 2;
}

// a = orientation === Orientation.Horizontal
// b = isHole
// a & b || !a & !b => a === b
const getAllowedIndexRange = (orientation: Orientation, size: Size, offsetCoords: Coords, isHole: boolean = false) => {
    let from = 0;

    if (orientation === Orientation.Horizontal === isHole) {
        from = offsetCoords.j;
    } else {
        from = offsetCoords.i;
    }

    let to = 0;

    if (orientation === Orientation.Horizontal === isHole) {
        to = from + size.width;
    } else {
        to = from + size.height;
    }

    return [from, to];
}

const getAllowedIndexes = (orientation: Orientation, size: Size, offsetCoords: Coords, isHole: boolean) => {
    const [from, to] = getAllowedIndexRange(orientation, size, offsetCoords, isHole);
    const shouldBeAdded = isHole ? (i: number) => i % 2 == 0 : (i: number) => i % 2 != 0;
    const indexes = [];

    for (let i = from, line = 0; i < to; i++, line++) {
        if (shouldBeAdded(i)) indexes.push(i);
    }

    return indexes;
}


// Math.floor(Math.random() * (length / 2)) * 2 + offset ?
const getRandomAllowedIndex = (orientation: Orientation, size: Size, offsetCoords: Coords, isHole: boolean) => {
    const indexes = getAllowedIndexes(orientation, size, offsetCoords, isHole);
    return indexes[getRandomIntExclude(indexes.length)];
}

const getWallToBeDrawn = (map: MapData, i: number, lineIndex: number, orientation: Orientation) => {
    if (orientation === Orientation.Horizontal) {
        return map[lineIndex][i];;
    } else {
        return map[i][lineIndex];
    }
}

const drawWall = (map: MapData, i: number, lineIndex: number, orientation: Orientation) => {
    const cell = getWallToBeDrawn(map, i, lineIndex, orientation);

    if (isCellHeightAllowed(cell.height, CellType.Bush)) {
        cell.type = CellType.Bush;
    } 
}

const drawLine = (orientation: Orientation, map: MapData, lineIndex: number,
    holeIndex: number, size: Size, offsetCoords: Coords) => {
    const from = orientation === Orientation.Horizontal ? offsetCoords.j : offsetCoords.i;
    const to = orientation === Orientation.Horizontal ? from + size.width : from + size.height;


    for (let i = from; i < to; i++) {
        if (i === holeIndex) continue;
        
        drawWall(map, i, lineIndex, orientation);
    }
}

const getSubSizes = (orientation: Orientation, size: Size, offsetCoords: Coords,
    lineIndex: number) => {
    const firstSubSizeHeight = orientation === Orientation.Horizontal ? lineIndex - offsetCoords.i : size.height;
    const firstSubSizeWidth = orientation === Orientation.Horizontal ? size.width : lineIndex - offsetCoords.j;
    const secondSubSizeHeight = orientation === Orientation.Horizontal ? size.height - (lineIndex - offsetCoords.i) - 1 : size.height;
    const secondSubSizeWidth = orientation === Orientation.Horizontal ? size.width : size.width - (lineIndex - offsetCoords.j) - 1;

    return [
        createSize(firstSubSizeHeight, firstSubSizeWidth),
        createSize(secondSubSizeHeight, secondSubSizeWidth),
    ]
}

const devideMatrix = (map: MapData, size: Size, offsetCoords: Coords) => {
    if (isTooSmall(size)) return;

    const devideLineOrientation = getDevideOrientaion(size);
    const lineIndex = getRandomAllowedIndex(devideLineOrientation, size, offsetCoords, false);
    const holeIndex = getRandomAllowedIndex(devideLineOrientation, size, offsetCoords, true);

    drawLine(devideLineOrientation, map, lineIndex, holeIndex, size, offsetCoords);

    const [firstSubSize, secondSubSize] = getSubSizes(devideLineOrientation, size, offsetCoords, lineIndex);
    const firstSubCoords = offsetCoords;
    const secondSubCoords = devideLineOrientation === Orientation.Horizontal ?
        createCoords(1 + lineIndex, offsetCoords.j) :
        createCoords(offsetCoords.i, 1 + lineIndex);

    devideMatrix(map, firstSubSize, firstSubCoords);
    devideMatrix(map, secondSubSize, secondSubCoords);
}

const landscape = (map: MapData) => {
    const size = getMapSize(map)
    devideMatrix(map, size, createCoords(0, 0));

    return map;
}

export default landscape;