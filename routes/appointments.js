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
            hospital,
            doctor,
            preferredDate
        } = req.body;

        if (!patientName || !phone || !hospital || !doctor || !preferredDate) {
            return res.status(400).json({
                message: "Please provide all appointment details"
            });
        }

        const docRef = await db.collection("appointments").add({
            patientName,
            phone,
            hospital,
            doctor,
            preferredDate,
            status: "Pending",
            createdAt: new Date()
        });

        res.status(201).json({
            message: "Appointment request submitted",
            id: docRef.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;