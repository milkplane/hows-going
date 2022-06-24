import { CellType } from "../cell";
import { createSize } from "../size"
import configurable, { createMapConfig } from "./configurable"

describe("configurable map creator", () => {
    it("should create map with a proper size", () => {
        for (let i = 0; i < 100; i++) {
            const heigth = Math.floor(Math.random() * 100) + 1;
            const width = Math.floor(Math.random() * 100) + 1;
            const size = createSize(heigth, width);
            const map = configurable(createMapConfig(size, 1, false));

            expect(map.length).toBe(size.height);
            expect(map[0].length).toBe(size.width);
        }
    })

    it("should create landscaped map", () => {
        const size = createSize(10, 15);
        const map = configurable(createMapConfig(size, 1, true));
        
        const isBushInMap = map.some(row => {
            return row.some(cell => cell.type === CellType.Bush);
        });

        expect(isBushInMap).toBe(true);
    })

    it("shouldnt create any cell height outside flatness range", () => {
        for (let i = 0; i < 100; i++) {
            const flatness = Math.random();
            const size = createSize(10, 15);
            const map = configurable(createMapConfig(size, flatness, false));

            map.forEach((row) => {
                row.forEach(cell => {
                    const absHeight = Math.abs(cell.height);
                    expect(absHeight).toBeLessThanOrEqual(1 - flatness)
                })
            })
        }
    })
})