import { string, undefined, z } from "zod";
import { createRouter } from "./context";

const IndexJsonRecord = z
  .record(
    z.object({
      cik_str: z.number(),
      ticker: z.string(),
      title: z.string(),
    })
  )
  .nullish();

type IndexJsonRecord = z.infer<typeof IndexJsonRecord>;

const IndexJsonArray = z
  .array(
    z.object({
      cik_str: z.number(),
      ticker: z.string(),
      title: z.string(),
    })
  )
  .nullish();

export type IndexJsonArray = z.infer<typeof IndexJsonArray>;

export const secRouter = createRouter()
  .query("getCikMap", {
    output: z.string().nullish(),
    async resolve({ ctx }) {
      try {
        console.log("fetching data");
        const response = await fetch("https://www.sec.gov/include/ticker.txt", {
          headers: {
            "User-Agent": "bunnavit bunnavit@airtechnology.io",
            "Accept-Encoding": "gzip, deflate",
            Host: "www.sec.gov",
          },
        });
        if (!response.ok) throw new Error("Something went wrong");
        // return response.text()
        const text = await response.text();
        return text;
      } catch (error) {
        console.log("error", error);
      }
    },
  })
  .query("getJsonMap", {
    output: IndexJsonArray,
    async resolve() {
      try {
        const response = await fetch(
          "https://www.sec.gov/files/company_tickers.json",
          {
            headers: {
              "User-Agent": "bunnavit bunnavit@airtechnology.io",
              "Accept-Encoding": "gzip, deflate",
              Host: "www.sec.gov",
            },
          }
        );
        if (!response.ok) throw new Error("Something went wrong");
        const jsonRecord: IndexJsonRecord = await response.json();
        const jsonArray: IndexJsonArray = jsonRecord
          ? Object.values(jsonRecord)
          : [];
        return jsonArray;
      } catch (error) {
        console.log("error", error);
      }
    },
  });
