document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    if (!form) {
        console.error("❌ Error: Login form not found!");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.querySelector('input[type="email"]').value.trim();
        const password = document.querySelector('input[type="password"]').value.trim();

        if (!email || !password) {
            alert("❌ Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = "home.html"; // ✅ Directly redirects to home
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    });
});
