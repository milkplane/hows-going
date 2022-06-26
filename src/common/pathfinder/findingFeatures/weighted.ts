import { Coords, stringifyCoords } from "../../coords";

type MappedCoords = {
    [key: string]: number;
}

const weighted = () => {
    const pathLengths: MappedCoords = {};

    const setPathLength = (coords: Coords, length: number): void => {
        pathLengths[stringifyCoords(coords)] = length;
    }

    const getPathLength = (coords: Coords): number => {
        return pathLengths[stringifyCoords(coords)] || 0;
    }

    return {
        setPathLength,
        getPathLength,
    }
}

export default weighted;
