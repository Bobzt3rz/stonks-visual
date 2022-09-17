import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("fetching data");
  const response = await fetch("https://www.sec.gov/include/ticker.txt", {
    headers: {
      "User-Agent": "bunnavit bunnavit@airtechnology.io",
      "Accept-Encoding": "gzip, deflate",
      Host: "www.sec.gov",
    },
  });
  if (!response.ok) throw new Error("Something went wrong");
  console.log("fetched data");
  const text = await response.text();

  console.log(text);
  res.status(200).send(text);
}
