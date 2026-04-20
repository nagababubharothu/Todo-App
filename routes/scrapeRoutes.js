const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/data", async (req, res) => {
    try {
        let url = req.query.url;

        if (!url) {
            url = "http://books.toscrape.com/";
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let result = {
            title: "Sample Product",
            price: 100
        };

        // ✅ Better selectors for books site
        const title = $(".product_pod h3 a").first().attr("title");
        if (title) result.title = title;

        const priceText = $(".price_color").first().text();
        if (priceText) {
            const price = parseInt(priceText.replace(/[^0-9]/g, ""));
            if (price) result.price = price;
        }

        res.json(result);

    } catch (err) {
        console.log(err.message);
        res.json({
            title: "Default Product",
            price: 100
        });
    }
});

module.exports = router;