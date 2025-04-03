document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    if (!form) {
        console.error("❌ Login form not found.");
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
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Redirect based on role
                if (data.user.role === "officer") {
                    window.location.href = "officer_home.html";
                } else {
                    window.location.href = "home.html";
                }
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("❌ Something went wrong. Please try again.");
        }
    });
});
