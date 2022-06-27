import { createSeed, getNumberFromSeed, getUnitFromSeed } from "./seed";

describe("seed", () => {
    it("should generate one word", () => {
        const word = createSeed();

        expect(typeof word).toBe('string');
        expect(word).toBeTruthy();
    });

    it("should generate random word", () => {
        const words = [];
        const seedNumber = 1000;

        for (let i = 0; i < seedNumber; i++) {
            words.push(createSeed());
        }

        const uniqueWords = new Set(words);

        expect(uniqueWords.size).not.toBe(seedNumber);
    });

    it("should generate number from seed with collision up to 3%", () => {
        const letters = `ABCDEFGHIJKLMNOPQRSTUVWXYZ
        abcdefghijklmnopqrstuvwxyz
        АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ
        абвгдеёжзийклмнопрстуфхцчшщъыьэюя`

        const words = [];

        for (let i = 0; i < 100000; i++) {
            const length = Math.floor(Math.random() * 100);
            let word = "";

            for (let j = 0; j < length; j++) {
                word += letters[Math.floor(Math.random() * letters.length)];
            }

            words.push(word);
        }

        const numbers = words.map(word => getNumberFromSeed(word));
        const uniqueNumbers = new Set(numbers).size;
        const uniqueRatio = uniqueNumbers / words.length;

        expect(uniqueRatio).toBeGreaterThan(0.97);
    })

    it("should generate integer", () => {
        const words = [];

        for (let i = 0; i < 1000; i++) {
            words.push(createSeed());
        }

        const numbers = words.map(word => getNumberFromSeed(word));
        numbers.forEach(number => {
            expect(Math.round(number)).toBe(number);
        })

    })

    it("should generate number from seed less or equal than 32bit number", () => {
        const words = [];

        for (let i = 0; i < 1000; i++) {
            words.push(createSeed());
        }

        const numbers = words.map(word => getNumberFromSeed(word));
        numbers.forEach(number => {
            expect(Math.abs(number)).toBeLessThanOrEqual(4294967295);
        })

    })

    it("should generate unit number", () => {
        const words = [];

        for (let i = 0; i < 1000; i++) {
            words.push(createSeed());
        }

        const numbers = words.map(word => getUnitFromSeed(word));
        numbers.forEach(number => {
            expect(number).toBeLessThanOrEqual(1);
            expect(number).toBeGreaterThanOrEqual(-1);
        })

    })
})