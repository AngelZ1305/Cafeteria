function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function login(email, password) {
  const users = getUsers();

  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) return { ok: false, message: "Email o contraseña incorrectos" };

  localStorage.setItem("currentUser", JSON.stringify({ id: found.email, email: found.password }));
  return { ok: true, message: "Login correcto" };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login");
  const msg = document.querySelector("#loginMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    const result = login(email, password);
    msg.textContent = result.message;

    if (result.ok) {
    window.location.href = "/Cafeteria/";
      console.log("hola")
    }
  });
});
