document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#contactForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();

        if (!name || !email || !message) {
            alert("❌ Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("/contact", { // Uses relative path for flexibility
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Message sent successfully!");
                form.reset(); // Resets the form fields
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            alert("❌ Server error. Please try again later.");
            console.error("❌ Contact submission error:", error);
        }
    });
});
