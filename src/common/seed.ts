import randomWords from 'random-words';

export type Seed = string;

export const createSeed = (): Seed => {
    return randomWords(1)[0];
}

export const getNumberFromSeed = (seed: Seed): number => {
    if (seed.length === 0) return 0;

    let number = seed.charCodeAt(0);

    for (let i = 1; i < seed.length; i++) {
        number = (number * Math.pow(seed[i].charCodeAt(0), i)) % 4294967295;
    }

    return number;
}

export const getUnitFromSeed = (seed: Seed): number => {
    return getNumberFromSeed(seed) / 4294967295;
}
