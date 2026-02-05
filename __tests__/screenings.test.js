import { describe, it, expect, jest } from "@jest/globals";
import { getScreenings } from '../server/getUpcomingScreenings.js';

describe('getScreenings()', () => {
  it('returns empty array when API returns no data', async () => {
    const mockLoadScreenings = jest.fn().mockResolvedValue([]);

    const result = await getScreenings({
      now: new Date("2026-01-20T12:00:00Z"),
      loadScreenings: mockLoadScreenings,
    });

    expect(result).toEqual([]);
  });

  it('excludes screenings in the past', async () => {
    const mockLoadScreenings = jest.fn().mockResolvedValue([
      {
        id: 1,
        attributes: {
          start_time: "2026-01-19T12:00:00.000Z",
          room: "Stora salongen",
        },
      },
      {
        id: 2,
        attributes: {
          start_time: "2026-01-21T12:00:00.000Z",
          room: "Stora salongen",
        },
      },
    ]);

    const result = await getScreenings({
      now: new Date("2026-01-20T12:00:00.000Z"),
      loadScreenings: mockLoadScreenings,
    });

    const total = result.flatMap(d => d.screenings);

    expect(total).toHaveLength(1);
    expect(total[0].id).toBe(2);
  });

  it('returns max 10 screenings total', async () => {
    const mockLoadScreenings = jest.fn().mockResolvedValue(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        attributes: {
          start_time: `2026-01-21T${String(10 + i).padStart(2, "0")}:00:00.000Z`,
          room: "Stora salongen",
        },
      }))
    );

    const result = await getScreenings({
      now: new Date("2026-01-20T12:00:00.000Z"),
      loadScreenings: mockLoadScreenings,
    });

    const total = result.flatMap(d => d.screenings).length;
    expect(total).toBe(10);
  });

  it('returns max 5 days', async () => {
    const mockLoadScreenings = jest.fn().mockResolvedValue(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        attributes: {
          start_time: `2026-01-${21 + i}T12:00:00.000Z`,
          room: "Stora salongen",
        },
      }))
    );

    const result = await getScreenings({
      now: new Date("2026-01-20T12:00:00.000Z"),
      loadScreenings: mockLoadScreenings,
    });

    expect(result).toHaveLength(5);
  });
  it('groups screenings correctly by day', async () => {
    const mockLoadScreenings = jest.fn().mockResolvedValue([
      {
        id: 1,
        attributes:
        {
          start_time: "2026-01-21T10:00:00.000Z",
          room: "Stora salongen"
        },
      },
      {
        id: 2,
        attributes: {
          start_time: "2026-01-21T14:00:00.000Z",
          room: "Stora salongen"
        },
      },
      {
        id: 3,
        attributes: {
          start_time: "2026-01-22T12:00:00.000Z",
          room: "Stora salongen"
        },
      },
    ]);

    const result = await getScreenings({
      now: new Date("2026-01-20T12:00:00.000Z"),
      loadScreenings: mockLoadScreenings,
    });

    expect(result).toHaveLength(2);

    expect(result[0].date).toBe("2026-01-21");
    expect(result[0].screenings).toHaveLength(2);
    expect(result[0].screenings.map(s => s.id)).toEqual([1, 2]);

    expect(result[1].date).toBe("2026-01-22");
    expect(result[1].screenings).toHaveLength(1);
    expect(result[1].screenings[0].id).toBe(3);
  });

});
