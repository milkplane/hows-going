import flat from "../features/finding/mapCreators/flat";
import random from "../features/finding/mapCreators/random";
import { Selectable } from "./ObjectSelect";

export const mapCreatorInfos: Selectable[] = [
    {
        id: 1,
        toString: () => "Плоская поверхонсть",
        value: flat,
    },
    {
        id: 2,
        toString: () => "Случайная поверхонсть",
        value: random,
    }
]