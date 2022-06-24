import randomWords from 'random-words';

type Seed = string;

export const createSeed = (): Seed => {
    return randomWords(1)[0];
}
