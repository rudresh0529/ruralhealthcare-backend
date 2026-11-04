const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

// Get all hospitals
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("hospitals").get();

        const hospitals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a hospital
router.post("/", async (req, res) => {
    try {
        const hospital = req.body;

        if (!hospital.name || !hospital.location) {
            return res.status(400).json({
                message: "Hospital name and location are required"
            });
        }

        const docRef = await db.collection("hospitals").add({
            ...hospital,
            createdAt: new Date()
        });

        res.status(201).json({
            message: "Hospital added successfully",
            id: docRef.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;