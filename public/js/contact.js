document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.querySelector("input[placeholder='Your Name']").value.trim();
        const email = document.querySelector("input[placeholder='Your E-mail']").value.trim();
        const message = document.querySelector("textarea").value.trim();

        if (!name || !email || !message) {
            alert("❌ Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Message sent successfully!");
                form.reset();
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            alert("❌ Server error. Please try again later.");
            console.error("Contact submission error:", error);
        }
    });
});
