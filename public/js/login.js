document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (!email || !password) {
        alert("❌ Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Login successful!");
            window.location.href = "home.html";
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        alert("❌ Server error. Please try again later.");
        console.error("Login error:", error);
    }
});
