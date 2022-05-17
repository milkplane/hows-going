import { useAppSelector } from "../../app/hooks";
import { getRoughness } from "../../common/cell";
import { createCoords } from "../../common/coords";
import { getCell } from "../../common/map";

type CellCoords = {
    row: number;
    column: number;
}

const MapCell = (props: CellCoords) => {
    const coords = createCoords(props.row, props.column);
    const roughness = useAppSelector(state => getRoughness(getCell(state.map.map, coords)));
    return <td>
        {roughness}
    </td>
}

export default MapCell;