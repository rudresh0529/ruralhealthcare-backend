const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

// Get all doctors
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("doctors").get();

        const doctors = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a doctor
router.post("/", async (req, res) => {
    try {
        const doctor = req.body;

        if (!doctor.name || !doctor.specialization) {
            return res.status(400).json({
                message: "Doctor name and specialization are required"
            });
        }

        const docRef = await db.collection("doctors").add({
            ...doctor,
            createdAt: new Date()
        });

        res.status(201).json({
            message: "Doctor added successfully",
            id: docRef.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;