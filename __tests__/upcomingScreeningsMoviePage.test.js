import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'; // import of jest-methods, 'jest' - library jest for work with mocking
import getUpcomingScreeningsMoviePage from '../server/getUpcomingScreeningsMoviePage.js';

describe('getUpcomingScreeningsMoviePage()', () => {
    //Test 1: checking if function returns an empty array if there are no screenings
    it('returns empty array if there are no screenings', () => {
        const result = getUpcomingScreeningsMoviePage([]);

        expect(result).toEqual([]); //.toEqual() - for comparing arrays and objects
    });

    //Test 2: checking if function returns empty array when input is not an array (API error, broken data)
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

    // set up MOCK TIME instead of real 'const now = new Date()' in tests
    beforeEach(() => {
        jest.useFakeTimers(); // tnable Jest fake timers
        // set fixed date/time for all tests in this describe block
        jest.setSystemTime(new Date('2026-03-17T14:00:00Z'));
    });

    afterEach(() => {
        jest.clearAllTimers(); // clean up mock timers (fake time) after each test
    });

    //Test 3: return only upcoming screenings (using mocking for dates)
    it('returns only upcoming screenings (excludes past ones)', () => {
        const mockScreenings = [
            mockScreening(1, {
                start_time: '2026-03-17T12:00:00.000Z', //past (12:00, now 14:00)
            }),
            mockScreening(2, {
                start_time: '2026-03-17T17:00:00.000Z', //upcoming (17:00)
            }),
            mockScreening(3, {
                start_time: '2026-03-18T10:00:00.000Z', //upcoming ("tomorrow")
            }),
            mockScreening(4, {
                start_time: '2025-03-16T21:00:00.000Z', //past ('yesterday')
            })
        ];

        const result = getUpcomingScreeningsMoviePage(mockScreenings);

        // only upcoming screenings
        expect(result).toHaveLength(2); //id 2 и 3
        expect(result[0].id).toBe(2);   //id 2 is 1st in  array of screenings
        expect(result[1].id).toBe(3);   //id 3 is 2nd in  array of screenings
        //.toBe() - for comparing primitives
    });
    // Test 4: returns empty array when all screenings are in the past
    it('returns empty array when all screenings are in the past', () => {
        const mockScreenings = [
            mockScreening(1, { start_time: '2026-03-16T10:00:00.000Z' }),
            mockScreening(2, { start_time: '2026-03-17T10:00:00.000Z' }),
        ];

        const result = getUpcomingScreeningsMoviePage(mockScreenings);
        
        expect(result).toEqual([]); 
    });

});

function mockScreening(id = 1, attributes = {}) {
    return {
        "id": id,   //not a number
        "attributes": {
            "start_time": "2025-03-17T12:00:00.000Z",   //default value
            "room": "Stora salongen",
            "createdAt": "2025-03-16T14:24:03.033Z",
            "updatedAt": "2025-03-16T14:24:03.033Z",
            ...attributes   //overwrite default values of attributes with provided ones
        }
    }
}
