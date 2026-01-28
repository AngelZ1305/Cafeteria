async function users() {
  const already = localStorage.getItem("users");
  if (already) return;

  const res = await fetch("../../users.json");
  if (!res.ok) throw new Error("No se pudo cargar users.json");

  const users = await res.json();
  localStorage.setItem("users", JSON.stringify(users));
  console.log("Usuarios cargados a localStorage:", users);
}

users().catch(console.error);
