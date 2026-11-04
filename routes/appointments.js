const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

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

        res.status(201).json({
            success: true,
            message: "Appointment request submitted successfully",
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