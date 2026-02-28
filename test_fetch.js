const https = require("https");

https
  .get(
    "https://cura-ai-32.vercel.app/sitemap.xml",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    },
    (res) => {
      console.log("Status Code:", res.statusCode);
      console.log("Headers:", JSON.stringify(res.headers, null, 2));

      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        console.log("Content head:", rawData.substring(0, 150));
      });
    },
  )
  .on("error", (e) => {
    console.error(e);
  });
