document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.querySelector("input[placeholder='Name']").value.trim();
        const email = document.querySelector("input[placeholder='E-mail']").value.trim();
        const password = document.querySelector("input[placeholder='Password']").value;
        const id_num = document.querySelector("input[placeholder='ID Number']").value.trim();
        const role = document.querySelector("select").value;

        if (!name || !email || !password || !id_num || !role) {
            alert("❌ Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password, id_num, role })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Registration successful!");
                window.location.href = "login.html";
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            alert("❌ Server error. Please try again later.");
            console.error("Registration error:", error);
        }
    });
});
