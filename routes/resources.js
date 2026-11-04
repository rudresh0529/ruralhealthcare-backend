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
        console.error("Get resources error:", error);
        res.status(500).json({
            message: "Unable to fetch resources"
        });
    }
});

// Submit a resource request
router.post("/requests", async (req, res) => {
    try {
        const {
            hospital,
            hospitalName,
            resourceType,
            quantity,
            bloodGroup,
            contact,
            email
        } = req.body;

        const finalHospitalName = hospitalName || hospital;

        // Check required fields
        if (
            !finalHospitalName ||
            !resourceType ||
            quantity === undefined ||
            quantity === null ||
            Number(quantity) < 1 ||
            !contact ||
            !email
        ) {
            return res.status(400).json({
                message: "Please provide all required details"
            });
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Save request in Firebase
        const docRef = await db.collection("resourceRequests").add({
            hospitalName: finalHospitalName,
            resourceType,
            quantity: Number(quantity),
            bloodGroup: resourceType === "Blood"
                ? (bloodGroup || null)
                : null,
            contact,
            email,
            status: "Pending",
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Resource request submitted successfully",
            id: docRef.id
        });

    } catch (error) {
        console.error("Resource request error:", error);

        res.status(500).json({
            message: "Unable to submit resource request"
        });
    }
});

module.exports = router;