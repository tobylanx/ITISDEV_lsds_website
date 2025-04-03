document.getElementById("addEventForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", document.getElementById("eventTitle").value);
    formData.append("eventImage", document.getElementById("eventImage").files[0]); // Image file
    formData.append("description", document.getElementById("eventDescription").value);
    formData.append("dateTime", document.getElementById("eventDateTime").value);
    formData.append("location", document.getElementById("eventLocation").value);
    formData.append("status", document.getElementById("eventStatus").value);

    try {
        const response = await fetch("http://localhost:3001/events", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("✅ Event created successfully!");
            window.location.href = "event_management.html";
        } else {
            const errorData = await response.json();
            alert("❌ Failed to create event: " + errorData.message);
        }
    } catch (error) {
        console.error("❌ Error:", error);
        alert("❌ An error occurred while creating the event.");
    }
});
