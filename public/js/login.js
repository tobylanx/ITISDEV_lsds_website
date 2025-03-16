document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.querySelector("input[placeholder='E-mail']").value.trim();
        const password = document.querySelector("input[placeholder='Password']").value;

        if (!email || !password) {
            alert("❌ Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ Login successful! Welcome, ${data.user.name}`);
                window.location.href = "home.html";
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            alert("❌ Server error. Please try again later.");
            console.error("Login error:", error);
        }
    });
});
