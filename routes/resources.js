const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

// Get available resources
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("resources").get();

        const resources = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit a resource request
router.post("/requests", async (req, res) => {
    try {
        const {
            hospitalName,
            resourceType,
            quantity,
            bloodGroup,
            contact
        } = req.body;

        if (!hospitalName || !resourceType || !quantity || !contact) {
            return res.status(400).json({
                message: "Please provide all required details"
            });
        }

        const docRef = await db.collection("resourceRequests").add({
            hospitalName,
            resourceType,
            quantity,
            bloodGroup: bloodGroup || null,
            contact,
            status: "Pending",
            createdAt: new Date()
        });

        res.status(201).json({
            message: "Resource request submitted successfully",
            id: docRef.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;