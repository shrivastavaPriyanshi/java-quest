document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("msg");
  const button = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.classList.remove("show");
    button.classList.add("loading");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showMessage("Please fill in both fields.", "#ffb3b3");
      button.classList.remove("loading");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("xp", data.xp || 0);
        localStorage.setItem("badges", JSON.stringify(data.badges || []));

        showMessage("🎉 Login successful! Redirecting...", "#b7f397");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);

      } else {
        showMessage(data.message || "Invalid credentials.", "#ffb3b3");
      }
    } catch (err) {
      console.error("Login Error:", err);
      showMessage("⚠️ Server error. Please try again later.", "#ffcc70");
    } finally {
      button.classList.remove("loading");
    }
  });

  function showMessage(text, color) {
    msg.style.color = color;
    msg.textContent = text;
    msg.classList.add("show");
  }
});
