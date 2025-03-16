document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:5000/session", {
            credentials: "include"
        });
        const data = await response.json();

        if (response.ok) {
            document.getElementById("signInBtn").style.display = "none";
            document.getElementById("userDropdown").style.display = "block";
            document.getElementById("userName").textContent = `👤 ${data.user.name}`;
            document.getElementById("userRole").textContent = `🔹 ${data.user.role}`;
        }
    } catch (error) {
        console.error("Session check failed:", error);
    }

    document.getElementById("logoutBtn").addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:5000/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                alert("✅ Logged out successfully!");
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    });
});
