const generateReply = require("../utils/generateReply.js");

const chatAi = async (req, res) => {

    try {

        const { 
            messages,
            title,
            description,
            testCases,
            startCode
        } = req.body;

        if (!messages) {
            return res.status(400).json({
                message: "Messages are required"
            });
        }

        const formattedMessages = messages.map((msg) => ({
            role: msg.role,
            parts: [
                {
                    text: msg.content
                }
            ]
        }));

        const reply = await generateReply({
            messages: formattedMessages,
            title,
            description,
            testCases,
            startCode
        });

        return res.status(200).json({
            message: reply
        });

    } catch (error) {

        console.log("REAL BACKEND ERROR:");
        console.log(error);

        res.status(500).json({
            message:
                error.message || "AI Error",
        });
    }
};

module.exports = { chatAi };