import { describe, it, expect } from "@jest/globals";
import { getMovieRating } from "../server/getMovieRating.js";


//Test for getting rating from CMS if there are more than 5 reviews
describe("getMovieRating - CMS path", () => {
  it("Returns rating from CMS when there are five or more reviews", async () => {

    const fakeFetchJson = async (url) => ({
      data: [
        { attributes: { rating: 4 } },
        { attributes: { rating: 5 } },
        { attributes: { rating: 3 } },
        { attributes: { rating: 4 } },
        { attributes: { rating: 4 } }
      ],
    });

    const result = await getMovieRating(
      1, 
      fakeFetchJson, //Fake data
      "https://fake-cms" //Fake CMS-origin
    );

    expect(result.rating).toBe(4);
    expect(result.reviewCount).toBe(5);
    expect(result.source).toBe("cms");
  })
});

//Test for getting rating from IMDB if there are less than 5 reviews

describe("getMovieRating - IMDB path", () => {
  it("Returns rating from IMDB IF there are less than five reviews", async () => {

    const fakeFetchJson = async (url) => {

      if (url.includes("/api/reviews")) {
        return {
          data: [
            { attributes: { rating: 4 } },
            { attributes: { rating: 5 } },
          ]
        }
      }

      if (url.includes("/api/movies")) {
        return {
          data: {
            attributes: {
              imdbId: "tt1234567"
            }
          }
        }
      };

      if (url.includes("omdbapi.com")){
        return {
          imdbRating: "7.8"
        };
      }

      throw new Error("Not a valid url", url);
    }

    const result = await getMovieRating(
      1,
      fakeFetchJson,
      "https://fake-cms"
    );

    expect(result.rating).toBe(7.8);
    expect(result.reviewCount).toBe(2);
    expect(result.source).toBe("imdb");
  });
});