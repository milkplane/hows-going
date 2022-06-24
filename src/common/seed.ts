import randomWords from 'random-words';

export type Seed = string;

export const createSeed = (): Seed => {
    return randomWords(1)[0];
}
