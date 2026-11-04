const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { sendEmail } = require("../config/email");

// Get all appointments
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("appointments").get();

        const appointments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Book an appointment
router.post("/", async (req, res) => {
    try {
        const {
            patientName,
            phone,
            email,
            hospital,
            doctor,
            preferredDate
        } = req.body;

        // Validate all required details
        if (
            !patientName ||
            !phone ||
            !email ||
            !hospital ||
            !doctor ||
            !preferredDate
        ) {
            return res.status(400).json({
                message: "Please provide all appointment details"
            });
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Save appointment in Firebase
        const docRef = await db.collection("appointments").add({
            patientName,
            phone,
            email,
            hospital,
            doctor,
            preferredDate,
            status: "Pending",
            createdAt: new Date()
        });

        // Send appointment email
        const emailResult = await sendEmail({
            to: email,
            subject: "Appointment Request Received - Rural Healthcare Connect",
            html: `
                <h2>Appointment Request Received!</h2>
                <p>Hello ${patientName},</p>
                <p>Your appointment request has been submitted successfully.</p>
                <p><strong>Hospital:</strong> ${hospital}</p>
                <p><strong>Doctor:</strong> ${doctor}</p>
                <p><strong>Preferred Date:</strong> ${preferredDate}</p>
                <p><strong>Status:</strong> Pending</p>
                <p>We will notify you when your request is reviewed.</p>
                <p>Thank you,<br>Rural Healthcare Connect</p>
            `
        });

        res.status(201).json({
            success: true,
            message: "Appointment request submitted successfully",
            emailSent: emailResult.success,
            id: docRef.id
        });

    } catch (error) {
        console.error("Appointment submission error:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;