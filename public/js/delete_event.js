document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    if (!eventId) {
        document.getElementById("event-details").textContent = "Invalid event ID.";
        return;
    }

    // Delete event on button click
    document.getElementById("confirm-delete").addEventListener("click", function () {
        fetch(`/events/${eventId}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete event");
                }
                return response.json();
            })
            .then(() => {
                alert("✅ Event deleted successfully!");
                window.location.href = "event_management.html";
            })
            .catch(error => {
                alert("❌ Error deleting event: " + error.message);
            });
    });
});
