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

        document.querySelector("h1").textContent = event.title;
        document.getElementById("eventImage").src = event.eventPicture
            ? `http://localhost:3001/uploads/${event.eventPicture}`
            : "images/event-placeholder.jpg";
        document.getElementById("eventDescription").textContent = event.description;
        document.getElementById("eventDateTime").textContent = new Date(event.dateTime).toLocaleString();
        document.getElementById("eventLocation").textContent = event.location;

        document.getElementById("deleteBtn").href = `delete_event.html?id=${eventId}`;

    } catch (error) {
        console.error("❌ Error fetching event:", error);
    }

});

