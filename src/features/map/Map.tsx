import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { Coords, createCoords } from "../../common/coords";
import { useTool } from "./hooks";
import MapRow from "./MapRow";

const Map = (props: any) => {
    const height = useAppSelector(state => state.map.size.height);
    const [hoveredCell, setHoveredCell] = useState<Coords>(createCoords(3, 3));
    const onMapPressed = useTool(hoveredCell);

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