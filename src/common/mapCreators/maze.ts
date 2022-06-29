import { Coords, createCoords } from "../coords";
import { Seed } from "../seed";
import { createSize, Size } from "../size";
import randomWithSeed, { RandomSeed } from "random-seed";

enum Orientation {
    Horizontal,
    Vertical,
}

const getDevideOrientaion = (size: Size) => {
    return size.height < size.width ? Orientation.Vertical : Orientation.Horizontal;
}

const getRandomIntExclude = (max: number, randomSeed: RandomSeed) => {
    return Math.floor(randomSeed.random() * max);
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
const getRandomAllowedIndex = (orientation: Orientation, size: Size, offsetCoords: Coords, isHole: boolean, randomSeed: RandomSeed) => {
    const indexes = getAllowedIndexes(orientation, size, offsetCoords, isHole);
    return indexes[getRandomIntExclude(indexes.length, randomSeed)];
}

const drawLine = (orientation: Orientation, coords: Coords[], lineIndex: number,
    holeIndex: number, size: Size, offsetCoords: Coords) => {
    const from = orientation === Orientation.Horizontal ? offsetCoords.j : offsetCoords.i;
    const to = orientation === Orientation.Horizontal ? from + size.width : from + size.height;
    const drawWall = orientation === Orientation.Horizontal ?
        (j: number) => coords.push(createCoords(lineIndex, j)):
        (i: number) => coords.push(createCoords(i, lineIndex));

    for (let i = from; i < to; i++) {
        if (i !== holeIndex) {
            drawWall(i);
        }
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

const devideMatrix = (coords: Coords[], size: Size, offsetCoords: Coords, randomSeed: RandomSeed) => {
    if (isTooSmall(size)) return;

    const devideLineOrientation = getDevideOrientaion(size);
    const lineIndex = getRandomAllowedIndex(devideLineOrientation, size, offsetCoords, false, randomSeed);
    const holeIndex = getRandomAllowedIndex(devideLineOrientation, size, offsetCoords, true, randomSeed);

    drawLine(devideLineOrientation, coords, lineIndex, holeIndex, size, offsetCoords);

    const [firstSubSize, secondSubSize] = getSubSizes(devideLineOrientation, size, offsetCoords, lineIndex);
    const firstSubCoords = offsetCoords;
    const secondSubCoords = devideLineOrientation === Orientation.Horizontal ?
        createCoords(1 + lineIndex, offsetCoords.j) :
        createCoords(offsetCoords.i, 1 + lineIndex);

    devideMatrix(coords, firstSubSize, firstSubCoords, randomSeed);
    devideMatrix(coords, secondSubSize, secondSubCoords, randomSeed);
}

const createBushCoords = (size: Size, seed: Seed) => {
    const bushCoords: Coords[] = [];
    const randomSeed = randomWithSeed.create(seed);
    devideMatrix(bushCoords, size, createCoords(0, 0), randomSeed);

    return bushCoords;
}

export default createBushCoords;