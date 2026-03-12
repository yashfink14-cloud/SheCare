/*************************************
 ✅ UNIVERSAL HAMBURGER TOGGLE
 Works for:
 - Home header (.menu)
 - Women hygiene header (.wohy-menu)
*************************************/
function toggleMenu() {
  const homeMenu = document.querySelector(".menu");
  const wohyMenu = document.querySelector(".wohy-menu");

  if (homeMenu) homeMenu.classList.toggle("active");
  if (wohyMenu) wohyMenu.classList.toggle("active");
}

/*************************************
 ✅ HOME PAGE SCROLL ANIMATION
*************************************/
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".tip-card, .myth-card, .cycle-content, .cycle-image, .hero"
  );

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );

    animatedElements.forEach((el) => observer.observe(el));

    // Add animation CSS once
    const style = document.createElement("style");
    style.textContent = `
      .show {
        opacity: 1 !important;
        transform: translateY(0px) !important;
      }
      .tip-card, .myth-card, .cycle-content, .cycle-image, .hero {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.7s ease-out;
      }
    `;
    document.head.appendChild(style);
  }
});

/*************************************
 ✅ PRODUCT FILTERING
*************************************/
function filterProducts(category, btn) {
  const cards = document.querySelectorAll(".product-card");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  cards.forEach((card) => {
    if (category === "all" || card.classList.contains(category)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/*************************************
 ✅ PERIOD TRACKER
*************************************/
let cycles = JSON.parse(localStorage.getItem("cycles")) || [];

function openForm() {
  const form = document.getElementById("cycleForm");
  if (!form) return;

  form.style.display = "block";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("flow").value = "Moderate Flow";
  document.getElementById("editIndex").value = "";
}

function saveCycles() {
  localStorage.setItem("cycles", JSON.stringify(cycles));
  loadCycles();
}

function loadCycles() {
  const cycleList = document.getElementById("cycleList");
  if (!cycleList) return;

  let list = "";

  cycles.forEach((c, index) => {
    let days = Math.ceil(
      (new Date(c.end) - new Date(c.start)) / (1000 * 60 * 60 * 24)
    );

    list += `
      <div class="cycle-item">
        <div class="left">
          <h3>${formatDate(c.start)} → ${formatDate(c.end)}</h3>
          <span class="flow-tag">${c.flow}</span>
          <span class="days-tag">${days} days</span>
        </div>
        <div>
          <span class="icon-btn" onclick="editCycle(${index})">✏️</span>
          <span class="icon-btn" onclick="deleteCycle(${index})">🗑️</span>
        </div>
      </div>
    `;
  });

  cycleList.innerHTML = list;
  calculatePrediction();
}

function editCycle(i) {
  const c = cycles[i];
  openForm();

  document.getElementById("editIndex").value = i;
  document.getElementById("startDate").value = c.start;
  document.getElementById("endDate").value = c.end;
  document.getElementById("flow").value = c.flow;
}

function deleteCycle(i) {
  if (confirm("Delete this entry?")) {
    cycles.splice(i, 1);
    saveCycles();
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calculatePrediction() {
  const predictionEl = document.getElementById("predictionDate");
  if (!predictionEl) return;

  if (cycles.length < 1) {
    predictionEl.innerHTML = "Not enough data";
    return;
  }

  let last = cycles[cycles.length - 1];
  let lastEnd = new Date(last.end);

  let predicted = new Date(lastEnd);
  predicted.setDate(predicted.getDate() + 28);

  predictionEl.innerHTML = formatDate(predicted);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cycleForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const start = startDate.value;
      const end = endDate.value;
      const flow = document.getElementById("flow").value;
      const editIndex = document.getElementById("editIndex").value;

      const obj = { start, end, flow };

      if (editIndex === "") cycles.push(obj);
      else cycles[editIndex] = obj;

      saveCycles();
      this.style.display = "none";
    });

    loadCycles();
  }
});

/*************************************
 ✅ DISEASES & PREVENTION PAGE NAV
*************************************/
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 70,
      behavior: "smooth",
    });
  }
}

function toggleCardDetails(button) {
  const card = button.closest(".card");
  const details = card.querySelector(".card-details");
  const iconSpan = button.querySelector("span");

  const isOpen = details.style.display === "block";
  details.style.display = isOpen ? "none" : "block";
  iconSpan.textContent = isOpen ? "+" : "−";
  button.firstChild.textContent = isOpen ? "Details " : "Hide ";
}

function toggleFAQ(item) {
  const answer = item.querySelector(".faq-answer");
  const icon = item.querySelector(".faq-toggle-icon");
  const isOpen = answer.style.display === "block";

  answer.style.display = isOpen ? "none" : "block";
  icon.textContent = isOpen ? "+" : "−";
}

function saveSymptom() {
  const input = document.getElementById("symptomInput");
  const status = document.getElementById("symptomStatus");
  if (!input || !status) return;

  const text = input.value.trim();
  if (!text) {
    status.textContent = "Please type a note before saving.";
    status.style.color = "#e25a5a";
    return;
  }

  const existing = JSON.parse(localStorage.getItem("herHealthNotes") || "[]");
  existing.push({ text, date: new Date().toISOString() });
  localStorage.setItem("herHealthNotes", JSON.stringify(existing));

  status.textContent =
    "Saved in this browser. You can show this list to your doctor.";
  status.style.color = "#1b9d67";
  input.value = "";
}

/*************************************
 ✅ NAPKIN MACHINE TRACKER (napm.html)
*************************************/

const napmMachines = [
  // Kurla (2)
  {
    name: "Kurla Station – Ladies Washroom (Near Platform)",
    area: "Kurla",
    address: "Kurla Railway Station, Mumbai",
    googleQuery: "Kurla Railway Station ladies washroom napkin vending machine"
  },
  {
    name: "Phoenix Marketcity – Ladies Restroom (Napkin Vending)",
    area: "Kurla",
    address: "Phoenix Marketcity, LBS Marg, Kurla West, Mumbai",
    googleQuery: "Phoenix Marketcity Kurla napkin vending machine"
  },

  // Bandra (2)
  {
    name: "Rizvi College – Girls Washroom Block",
    area: "Bandra",
    address: "Rizvi College of Arts Science and Commerce, Bandra West, Mumbai",
    googleQuery: "Rizvi College Bandra napkin vending machine"
  },
  {
    name: "Bandra Terminus – Ladies Washroom Area",
    area: "Bandra",
    address: "Bandra Terminus Railway Station, Mumbai",
    googleQuery: "Bandra Terminus ladies washroom napkin vending machine"
  },

  // Santacruz (2)
  {
    name: "Santacruz Station – Ladies Washroom (West Side)",
    area: "Santacruz",
    address: "Santacruz Railway Station, Mumbai",
    googleQuery: "Santacruz station ladies washroom napkin vending machine"
  },
  {
    name: "Airport Terminal 1 – Ladies Restroom",
    area: "Santacruz",
    address: "Chhatrapati Shivaji Maharaj International Airport T1, Mumbai",
    googleQuery: "Mumbai Airport T1 napkin vending machine"
  },

  // Andheri (2)
  {
    name: "Andheri Station – Ladies Washroom (East Side)",
    area: "Andheri",
    address: "Andheri Railway Station, Mumbai",
    googleQuery: "Andheri station ladies washroom napkin vending machine"
  },
  {
    name: "Infinity Mall – Ladies Washroom (Napkin Vending)",
    area: "Andheri",
    address: "Infinity Mall, Andheri West, Mumbai",
    googleQuery: "Infinity Mall Andheri napkin vending machine"
  },

  // Dadar (2)
  {
    name: "Dadar Station – Ladies Washroom (Main Concourse)",
    area: "Dadar",
    address: "Dadar Railway Station, Mumbai",
    googleQuery: "Dadar station ladies washroom napkin vending machine"
  },
  {
    name: "Plaza Cinema Area – Public Toilet / Washroom Block",
    area: "Dadar",
    address: "Near Plaza Cinema, Dadar West, Mumbai",
    googleQuery: "Plaza cinema Dadar public toilet napkin vending machine"
  }
];

// render function
function napmRender(list) {
  const status = document.getElementById("napmStatus");
  const box = document.getElementById("napmResultsList");

  // If user is on another page, do nothing
  if (!status || !box) return;

  box.innerHTML = "";

  if (!list.length) {
    status.innerText = "No machines found for that search.";
    return;
  }

  status.innerText = `Showing ${list.length} machine(s).`;

  list.forEach((m, i) => {
    const link =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(m.googleQuery);

    const div = document.createElement("div");
    div.className = "napm-place";
    div.innerHTML = `
      <div class="napm-place-title">${i + 1}. ${m.name}</div>
      <div class="napm-meta"><b>Area:</b> ${m.area}</div>
      <div class="napm-meta"><b>Address:</b> ${m.address}</div>
      <span class="napm-badge">Napkin Vending Machine ✅</span>

      <div class="napm-actions">
        <a class="napm-linkbtn" href="${link}" target="_blank">Open in Google Maps</a>
      </div>
    `;
    box.appendChild(div);
  });
}

function napmSearchMachines() {
  const input = document.getElementById("napmSearchInput");
  const q = input ? input.value.trim().toLowerCase() : "";

  if (!q) {
    alert("Enter an area like Kurla / Bandra / Santacruz / Andheri / Dadar");
    return;
  }

  const filtered = napmMachines.filter((m) => {
    return (
      m.area.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.address.toLowerCase().includes(q)
    );
  });

  napmRender(filtered);
}

function napmShowAll() {
  const input = document.getElementById("napmSearchInput");
  if (input) input.value = "";
  napmRender(napmMachines);
}

// Auto render on napm page load
document.addEventListener("DOMContentLoaded", () => {
  napmRender(napmMachines);
});

