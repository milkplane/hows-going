import { useAppSelector } from "../../app/hooks";
import MapRow from "./MapRow";

const Map = (props: any) => {
    const height = useAppSelector(state => state.map.size.height);

    const rows = [];

    for (let i = 0; i < height; i++) {
        rows.push(<MapRow key={i} row={i} />)
    }

    return <table>
        <tbody>
            {rows}
        </tbody>
    </table>
}

export default Map;