import flat from "../features/finding/mapCreators/flat";
import { Selectable } from "./ObjectSelect";

export const mapCreators: Selectable[] = [
    {
        id: 1,
        toString: () => "Плоская поверхонсть",
        value: flat,
    }
]