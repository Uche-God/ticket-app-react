// Protect page
if (!localStorage.getItem("ticketapp_session")) {
  alert("Please log in first!");
  window.location.href = "./auth.html";
}

// Load tickets
let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
let editingTicketId = null;

const form = document.getElementById("ticket-form");
const titleInput = document.getElementById("ticket-title");
const statusInput = document.getElementById("ticket-status");
const descInput = document.getElementById("ticket-desc");
const container = document.getElementById("tickets-container");

// Render tickets
function renderTickets() {
  container.innerHTML = "";
  tickets.forEach(ticket => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${ticket.title}</h3>
      <p>Status: <strong class="status ${ticket.status}">${ticket.status}</strong></p>
      <p>${ticket.description || ""}</p>
      <button class="edit-btn" data-id="${ticket.id}">Edit</button>
      <button class="delete-btn" data-id="${ticket.id}">Delete</button>
    `;
    container.appendChild(card);
  });
  addCardListeners();
}

// Add listeners
function addCardListeners() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      const ticket = tickets.find(t => t.id === id);
      titleInput.value = ticket.title;
      statusInput.value = ticket.status;
      descInput.value = ticket.description;
      editingTicketId = id;
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      if (confirm("Are you sure you want to delete this ticket?")) {
        tickets = tickets.filter(t => t.id !== id);
        localStorage.setItem("tickets", JSON.stringify(tickets));
        renderTickets();
      }
    });
  });
}

// Form submit
form.addEventListener("submit", e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const status = statusInput.value;

  if (!title || !status) {
    alert("Title and status are required!");
    return;
  }

  if (editingTicketId) {
    const ticket = tickets.find(t => t.id === editingTicketId);
    ticket.title = title;
    ticket.status = status;
    ticket.description = descInput.value;
    editingTicketId = null;
  } else {
    const id = tickets.length ? tickets[tickets.length - 1].id + 1 : 1;
    tickets.push({ id, title, status, description: descInput.value });
  }

  form.reset();
  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets();
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("ticketapp_session");
  alert("Logged out!");
  window.location.href = "./auth.html";
});

// Initial render
renderTickets();
