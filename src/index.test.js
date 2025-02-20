jest.mock("node-fetch");
jest.useFakeTimers();

const scan = require("./scan");

const { default: fetch } = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");

describe("should scan an URL", () => {
  test("should make full scan", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify({ scan: { status_code: 200 } }))
      )
    );
    fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify({ results: { some: "result" } }))
      )
    );
    const result = await scan("http://www.free.fr");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://observatory-api.mdn.mozilla.net/api/v2/analyze?host=www.free.fr&hidden=true&rescan=true",
      {
        method: "POST",
      }
    );

    expect(result).toEqual({
      result: { scan: { status_code: 200 } },
      url: "http://www.free.fr",
    });
  });
});
