document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:3001/session", { credentials: "include" });
        const data = await response.json();

        if (response.ok && data.user) {
            document.getElementById("signInBtn").style.display = "none";
            const userDropdown = document.getElementById("userDropdown");
            userDropdown.style.display = "block";
            document.getElementById("userName").textContent = `👤 ${data.user.name}`;
            document.getElementById("userRole").textContent = `🔹 ${data.user.role}`;

            // **Toggle Dropdown on Click**
            document.getElementById("userIcon").addEventListener("click", function () {
                const dropdownContent = document.querySelector(".dropdown-content");
                dropdownContent.classList.toggle("show");
            });

            // **Logout Handling (No Alert, Direct Redirect)**
            document.getElementById("logoutBtn").addEventListener("click", async function () {
                try {
                    await fetch("http://localhost:3001/logout", {
                        method: "POST",
                        credentials: "include"
                    });
                    window.location.href = "login.html"; // ✅ Directly redirects to login page
                } catch (error) {
                    console.error("❌ Logout failed:", error);
                }
            });
        }
    } catch (error) {
        console.error("❌ Session check failed:", error);
    }
});
