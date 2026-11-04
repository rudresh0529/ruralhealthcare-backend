const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Rural Healthcare Connect <onboarding@resend.dev>",
            to: [to],
            subject,
            html
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error };
        }

        console.log("Email sent successfully:", data.id);
        return { success: true, data };

    } catch (error) {
        console.error("Email sending failed:", error);
        return { success: false, error };
    }
};

module.exports = { sendEmail };