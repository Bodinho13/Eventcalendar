import {calcDaysOfMonth} from '../utils/useCalendar';


describe('Calculate how many days the given month has', () => {
    it('should return 31 for March 2024', () => {
        const [month, year, expected] = [3, 2024, 31];
        const res = calcDaysOfMonth(month, year);
        expect(res).toEqual(expected);
    });
    it('should return 30 for November 1967', () =>  {
        const [month, year, expected] = [11, 1967, 30];
        const res = calcDaysOfMonth(month, year);
        expect(res).toEqual(expected);
    });
    it('should return 29 for February 2000', () => {
        const [month, year, expected] = [2, 2000, 29];
        const res = calcDaysOfMonth(month, year);
        expect(res).toEqual(expected);
    });
    it('should return 28 for February 2013', () => {
        const [month, year, expected] = [2, 2013, 28];
        const res = calcDaysOfMonth(month, year);
        expect(res).toEqual(expected);
    });
});