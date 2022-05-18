import { useEffect } from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Coords, createCoords } from "../../common/coords";
import MapRow from "./MapRow";
import { toolApplied } from "./mapSlice";

const Map = (props: any) => {
    const height = useAppSelector(state => state.map.size.height);
    const [hoveredCell, setHoveredCell] = useState<Coords>(createCoords(3, 3));
    const [isMapPressed, setIsMapPressed] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const rows = [];

    for (let i = 0; i < height; i++) {
        rows.push(<MapRow key={i} row={i} onCellChanged={setHoveredCell} />)
    }

    const onMapPressed = () => {
        setIsMapPressed(true);
        document.addEventListener('mouseup', () => setIsMapPressed(false));
    }

    useEffect(() => {
        if (!isMapPressed) return;

        dispatch(toolApplied(hoveredCell));
        
        const timer = setInterval(() => {
            dispatch(toolApplied(hoveredCell));
        }, 1000 / 2);

        return  () => {
            clearInterval(timer);
        }
        
    }, [isMapPressed, hoveredCell])

    return <table>
        <tbody onMouseDown={onMapPressed}>
            {rows}
        </tbody>
    </table>
}

export default Map;