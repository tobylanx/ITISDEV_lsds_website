document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registrationForm");

    if (!form) {
        console.error("❌ Error: Registration form not found!");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const firstName = document.querySelector("#firstName").value.trim();
        const lastName = document.querySelector("#lastName").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const idNumber = document.querySelector("#idNumber").value.trim();
        const role = document.querySelector("#role").value;

        const fullName = `${firstName} ${lastName}`; // ✅ Combine first and last name

        // **Validation Rules**
        const emailPattern = /^[a-zA-Z0-9._%+-]+@dlsu\.edu\.ph$/;
        const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
        const idNumPattern = /^\d{8}$/;

        if (!firstName || !lastName || !email || !password || !idNumber || !role) {
            alert("❌ Please fill in all fields.");
            return;
        }

        if (!emailPattern.test(email)) {
            alert("❌ Invalid email format. Use your @dlsu.edu.ph email.");
            return;
        }

        if (!passwordPattern.test(password)) {
            alert("❌ Password must be 8-16 characters long and contain at least one special character.");
            return;
        }

        if (!idNumPattern.test(idNumber)) {
            alert("❌ Invalid ID number. It should be an 8-digit DLSU student ID.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: fullName, email, password, id_num: idNumber, role })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Registration successful!");
                window.location.href = "home.html"; // ✅ Redirect to Home instead of Login
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            alert("❌ Server error. Please try again later.");
            console.error("Registration error:", error);
        }
    });
});

