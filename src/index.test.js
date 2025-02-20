global.fetch = jest.fn(() => Promise.resolve([]));

//jest.mock("fetch");
jest.useFakeTimers();

const scan = require("./scan");

describe("should scan an URL", () => {
  test("should make full scan", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            scan: { status_code: 200 },
            tests: { hello: "world" },
          })
        )
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
      result: { scan: { status_code: 200 }, tests: { hello: "world" } },
      url: "http://www.free.fr",
    });
  });
});
