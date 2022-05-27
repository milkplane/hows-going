import { useAppSelector } from "../../app/hooks";
import { useMapInteraction, useMapResize, useSearch } from "./hooks";
import MapRow from "./MapRow";

const Map = (props: any) => {
    const height = useAppSelector(state => state.map.length);
    const start = useAppSelector(state => state.start);
    const end = useAppSelector(state => state.end);
    const tableRef = useMapResize<HTMLTableElement>(35);
    const { onMapPressed, setHoveredCell } = useMapInteraction(start, end);
    useSearch(60);

    const rows = [];

    for (let i = 0; i < height; i++) {
        rows.push(<MapRow key={i} row={i} onCellChanged={setHoveredCell} />)
    }

    return <table ref={tableRef} style={{ width: '100%', height: '100vh' }}>
        <tbody onMouseDown={onMapPressed}>
            {rows}
        </tbody>
    </table>
}

export default Map;