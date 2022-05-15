import { Coords, CoordsShift, createShiftedCoords, stringifyCoords } from "../../../../common/coords";
import { MapData } from "../../../../common/map";

const matrixFinder = (map: MapData) => {
    const takenCoords: { [key: string]: boolean } = {};

    const isAlreadyTaken = (coords: Coords) => {
        return takenCoords[stringifyCoords(coords)];
    }

    const markAsTaken = (coords: Coords) => {
        takenCoords[stringifyCoords(coords)] = true;
    }

    return { markAsTaken, isAlreadyTaken };
}

export default matrixFinder;