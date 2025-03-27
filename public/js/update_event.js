document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    if (!eventId) {
        console.error("❌ No event ID found in URL.");
        return;
    }

    try {
        const response = await fetch(`/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event details.");

        const event = await response.json();

        document.getElementById("eventTitle").value = event.title;
        document.getElementById("eventDescription").value = event.description;
        document.getElementById("eventDateTime").value = event.dateTime.slice(0, 16);
        document.getElementById("eventLocation").value = event.location;
        document.getElementById("eventStatus").value = event.status;

        if (event.eventPicture) {
            const img = document.getElementById("previewImage");
            img.src = `http://localhost:3001/uploads/${event.eventPicture}`;
            img.style.display = "block";
        }
    } catch (error) {
        console.error("❌ Error fetching event:", error);
    }

    document.getElementById("updateEventForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        try {
            const response = await fetch(`/events/${eventId}`, {
                method: "PUT",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Event updated successfully!");
                window.location.href = "event_management.html";
            } else {
                alert("❌ " + result.message);
            }
        } catch (error) {
            console.error("❌ Error updating event:", error);
        }
    });
});
