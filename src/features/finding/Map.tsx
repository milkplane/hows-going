import { MouseEvent } from "react";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { areEqualCoords, Coords, createCoords } from "../../common/coords";
import { useGameObjectDrag, useSearch, useTool } from "./hooks";
import MapRow from "./MapRow";
import { endChanged, startChanged } from "./findingSlice";

const Map = (props: any) => {
    const height = useAppSelector(state => state.map.length);
    const [hoveredCell, setHoveredCell] = useState<Coords>(createCoords(3, 3));
    const handleToolPressed = useTool(hoveredCell);
    const start = useAppSelector(state => state.start);
    const end = useAppSelector(state => state.end);
    const handleStartPressed = useGameObjectDrag(start, hoveredCell, startChanged);
    const handleEngChanging = useGameObjectDrag(end, hoveredCell, endChanged);
    useSearch(60);

    const onMapPressed = (event: MouseEvent<HTMLTableSectionElement>) => {
        if (areEqualCoords(hoveredCell, start)) {
            handleStartPressed(event);
        } else if (areEqualCoords(hoveredCell, end)) {
            handleEngChanging(event);
        } else {
            handleToolPressed(event);
        }
    }

    const rows = [];

    for (let i = 0; i < height; i++) {
        rows.push(<MapRow key={i} row={i} onCellChanged={setHoveredCell} />)
    }

    return <table>
        <tbody onMouseDown={onMapPressed}>
            {rows}
        </tbody>
    </table>
}

export default Map;