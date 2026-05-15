const axios = require('axios');
require('dotenv').config();

const getLanguageById = (lang) => {

    const language = {
        'c++': 54,
        'java': 62,
        'javascript': 63,
    };

    return language[lang.toLowerCase()];
};


// 🔹 SUBMIT BATCH (FIXED)
const submitBatch = async (submissions) => {

    try {
        const response = await axios.post(
            'https://judge0-ce.p.rapidapi.com/submissions/batch',
            {
                submissions
            },
            {
                params: {
                    base64_encoded: 'false'
                },
                headers: {
                    'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
};


// 🔹 WAIT FUNCTION (FIXED)
const waiting = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


// 🔹 SUBMIT TOKEN (FIXED + SAME STRUCTURE IDEA)
const submitToken = async (resultToken) => {

    try {

        while (true) {

            const response = await axios.get(
                'https://judge0-ce.p.rapidapi.com/submissions/batch',
                {
                    params: {
                        tokens: resultToken.join(","),
                        base64_encoded: 'false',
                        fields: '*'
                    },
                    headers: {
                        'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
                        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
                    }
                }
            );

            const results = response.data.submissions;

            // check if all finished
            const isResultObtained = results.every(
                (r) => r.status.id > 2
            );

            if (isResultObtained) {
                return results;
            }

            await waiting(1000);
        }

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
};


module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
};

