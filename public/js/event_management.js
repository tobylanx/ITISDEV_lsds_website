document.addEventListener("DOMContentLoaded", async function () {
    const eventList = document.querySelector(".event-list");
    const searchInput = document.getElementById("searchEvent");
    const filterSelect = document.getElementById("filterEvent");

    async function fetchEvents() {
        const searchQuery = searchInput.value.trim();
        const filter = filterSelect.value;
        let url = `http://localhost:3001/events?filter=${filter}&search=${searchQuery}`;

        try {
            const response = await fetch(url);
            const events = await response.json();
            renderEvents(events);
        } catch (error) {
            console.error("❌ Error fetching events:", error);
        }
    }

    function renderEvents(events) {
        eventList.innerHTML = ""; // Clear previous events
        if (events.length === 0) {
            eventList.innerHTML = "<p>No events found.</p>";
            return;
        }

        events.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");
            eventCard.innerHTML = `
                <img src="http://localhost:3001/uploads/${event.eventPicture}" alt="Event Image">
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <p><strong>Date:</strong> ${new Date(event.dateTime).toLocaleString()}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Status:</strong> ${event.status.toUpperCase()}</p>
                </div>
            `;

            eventCard.addEventListener("click", () => {
                if (!event.id) { // Change _id to id
                    console.error("❌ Event ID is missing:", event);
                    return;
                }
                const page = event.status === "upcoming" ? "view_upcoming.html" : "view_past.html";
                window.location.href = `${page}?id=${event.id}`; // Use id instead of _id
            });

            eventList.appendChild(eventCard);
        });
    }

    fetchEvents();

    searchInput.addEventListener("input", fetchEvents);
    filterSelect.addEventListener("change", fetchEvents);
});
