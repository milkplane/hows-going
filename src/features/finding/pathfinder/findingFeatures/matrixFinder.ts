import { Coords, stringifyCoords } from "../../../../common/coords";

const matrixFinder = () => {
    const takenCoords: { [key: string]: boolean } = {};

    const isAlreadyTaken = (coords: Coords) => {
        return takenCoords[stringifyCoords(coords)] || false;
    }

    const markAsTaken = (coords: Coords) => {
        takenCoords[stringifyCoords(coords)] = true;
    }

    return { markAsTaken, isAlreadyTaken };
}

export default matrixFinder;