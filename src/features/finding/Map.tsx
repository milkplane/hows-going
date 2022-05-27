import { MouseEvent } from "react";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { areEqualCoords, Coords, createCoords } from "../../common/coords";
import { useGameObjectDrag, useMapResize, useSearch, useTool } from "./hooks";
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
    const tableRef = useMapResize<HTMLTableElement>(35);
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

    return <table ref={tableRef} style={{width: '100%', height: '100vh'}}>
        <tbody onMouseDown={onMapPressed}>
            {rows}
        </tbody>
    </table>
}

export default Map;