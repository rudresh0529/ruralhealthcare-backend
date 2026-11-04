// RESOURCE REQUEST FORM HANDLING
const resourceForms = document.querySelectorAll("[data-resource-form]");

resourceForms.forEach(function (form) {

const resourceTypeInput = form.querySelector("#resourceType");
const bloodGroupInput = form.querySelector("#bloodGroup");

// Blood group is required only for blood requests.
if (resourceTypeInput && bloodGroupInput) {

    resourceTypeInput.addEventListener("change", function () {

        if (resourceTypeInput.value === "Blood") {
            bloodGroupInput.required = true;
        } else {
            bloodGroupInput.required = false;
            bloodGroupInput.value = "";
        }
    });
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = form.querySelector(".form-message");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (APP_CONFIG.DEMO_MODE) {
        if (message) {
            message.textContent =
                "Demo only: Your resource request has not been saved.";

            message.style.color = "#52644b";
        }

        return;
    }

    try {
        if (message) {
            message.textContent = "Submitting your resource request...";
            message.style.color = "#52644b";
        }

        const resourceData = Object.fromEntries(
            new FormData(form).entries()
        );

        // Match the backend field name.
        resourceData.hospitalName = resourceData.hospital;
        delete resourceData.hospital;

        resourceData.quantity = Number(resourceData.quantity);

        // Blood group is not applicable to oxygen requests.
        if (resourceData.resourceType === "Oxygen cylinders") {
            resourceData.bloodGroup = null;
        }

        const response = await fetch(
            `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.API_ENDPOINTS.RESOURCE_REQUESTS}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(resourceData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to submit resource request."
            );
        }

        if (message) {
            message.textContent =
                result.message ||
                "Resource request submitted successfully.";

            message.style.color = "green";
        }

        form.reset();

        if (bloodGroupInput) {
            bloodGroupInput.required = false;
        }

    } catch (error) {
        console.error("Resource request submission error:", error);

        if (message) {
            message.textContent =
                error.message ||
                "Something went wrong. Please try again.";

            message.style.color = "red";
        }
    }
});

});