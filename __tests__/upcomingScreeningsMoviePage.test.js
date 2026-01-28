import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import getUpcomingScreeningsMoviePage from '../server/getUpcomingScreeningsMoviePage';

describe (`getUpcomingScreeningsMoviePage()`, () => {
    //Test 1: checking if function returns an empty array
    it(`returns empty array if there are no screenings`, () =>{
        const result = getUpcomingScreeningsMoviePage([]);

        expect(result).toEqual([]);
    })
    //Test 2: checking if function returns an empty array if argument is not array
     it('returns empty array when input is not an array', () => {
        const result1 = getUpcomingScreeningsMoviePage(null);
        const result2 = getUpcomingScreeningsMoviePage(undefined);
        const result3 = getUpcomingScreeningsMoviePage('not an array');
        const result4 = getUpcomingScreeningsMoviePage(123);
        
        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
        expect(result4).toEqual([]);
    });

})