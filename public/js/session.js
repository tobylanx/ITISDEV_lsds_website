document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:3001/session", { credentials: "include" });
        const data = await response.json();

        if (response.ok && data.user) {
            const user = data.user;

            // Show user dropdown, hide Sign In
            const signInBtn = document.getElementById("signInBtn");
            const userDropdown = document.getElementById("userDropdown");
            if (signInBtn) signInBtn.style.display = "none";
            if (userDropdown) userDropdown.style.display = "block";

            // Set user name and role
            const userName = document.getElementById("userName");
            const userRole = document.getElementById("userRole");
            if (userName) userName.textContent = `👤 ${user.name}`;
            if (userRole) userRole.textContent = `🔹 ${user.role}`;

            // Toggle dropdown
            const userIcon = document.getElementById("userIcon");
            if (userIcon) {
                userIcon.addEventListener("click", () => {
                    const dropdownContent = document.querySelector(".dropdown-content");
                    if (dropdownContent) dropdownContent.classList.toggle("show");
                });
            }

            // Logout
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", async () => {
                    try {
                        await fetch("http://localhost:3001/logout", {
                            method: "POST",
                            credentials: "include"
                        });
                        window.location.href = "login.html";
                    } catch (error) {
                        console.error("❌ Logout failed:", error);
                    }
                });
            }

            // Officer-only page protection
            const path = window.location.pathname;
            const isOfficerPage =
                path.includes("officer_home.html") ||
                path.includes("event_management.html") ||
                path.includes("announcementAdmin.html");

            if (isOfficerPage && user.role !== "officer") {
                alert("❌ Access denied. Officers only.");
                window.location.href = "login.html";
                return;
            }

            // 🔄 Always update HOME and logo links based on role
            const homeLinks = document.querySelectorAll('a[href="home.html"]');
            homeLinks.forEach(link => {
                if (user.role === "officer") {
                    link.href = "officer_home.html";
                } else if (user.role === "member") {
                    link.href = "member_home.html"; // ✅ enforce member redirect
                }
            });

            const logoLink = document.querySelector('.nav-left a[href="home.html"]');
            if (logoLink) {
                logoLink.href = user.role === "officer"
                    ? "officer_home.html"
                    : "member_home.html"; // ✅ enforce member redirect
            }

            // ✅ Optional: Redirect member visiting home.html to member_home.html
            const currentPage = window.location.pathname.split("/").pop();
            if (user.role === "member" && currentPage === "home.html") {
                window.location.href = "member_home.html";
            }

        } else {
            // Unauthenticated but trying to access officer-only pages
            const officerPages = ["officer_home.html", "event_management.html", "announcementAdmin.html"];
            const currentPage = window.location.pathname.split("/").pop();
            if (officerPages.includes(currentPage)) {
                alert("❌ Access denied. Please log in first.");
                window.location.href = "login.html";
            }
        }
    } catch (error) {
        console.error("❌ Session check failed:", error);
    }
});
