const { sendAdminContactMail } = require("../services/gmailServices");


const contactFormController = async (req, res, next) => {
    try {
        const details = req.body

        await sendAdminContactMail(details);

        return res.status(200).send({
            status: true,
            statusCode: 200,
            message: "Form Submitted Successfully",
        });


    } catch (err) {
        next(err)
    }
}

module.exports = {
    contactFormController
}