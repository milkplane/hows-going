import { createSeed } from "./seed";

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
})