

const axios = require("axios");
const { parse } = require("csv-parse/sync");

async function getZerodhaInstruments() {

    const response = await axios.get(
        "https://api.kite.trade/instruments",
        {
            headers: {
                "X-Kite-Version": "3"
            }
        }
    );

    const csv = response.data;

    const instruments = parse(csv, {
        columns: true,
        skip_empty_lines: true
    });

    return instruments;
}

module.exports = {
    getZerodhaInstruments
};