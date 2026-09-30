// Expense Tracker: plain JavaScript, data saved in the browser (localStorage)
const KEY = "expenses-v1";
let expenses = JSON.parse(localStorage.getItem(KEY)) || [];

const form = document.getElementById("form");
const list = document.getElementById("list");
const bars = document.getElementById("bars");
const filter = document.getElementById("filter");
const empty = document.getElementById("empty");

document.getElementById("date").valueAsDate = new Date();

function save() {
  localStorage.setItem(KEY, JSON.stringify(expenses));
}

function rupees(n) {
  return "₹" + n.toLocaleString("en-IN");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  expenses.unshift({
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  });
  save();
  form.reset();
  document.getElementById("date").valueAsDate = new Date();
  render();
});

filter.addEventListener("change", render);

function deleteExpense(id) {
  expenses = expenses.filter((x) => x.id !== id);
  save();
  render();
}

function render() {
  // total and count
  const total = expenses.reduce((sum, x) => sum + x.amount, 0);
  document.getElementById("total").textContent = rupees(total);
  document.getElementById("count").textContent = expenses.length;

  // category bars
  const byCat = {};
  expenses.forEach((x) => (byCat[x.category] = (byCat[x.category] || 0) + x.amount));
  bars.textContent = "";
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([cat, amt]) => {
    const pct = total ? Math.round((amt / total) * 100) : 0;
    const wrap = document.createElement("div");
    wrap.className = "bar";
    wrap.innerHTML = '<div class="top"><span></span><span></span></div><div class="track"><div class="fill"></div></div>';
    wrap.querySelectorAll(".top span")[0].textContent = cat;
    wrap.querySelectorAll(".top span")[1].textContent = rupees(amt) + " (" + pct + "%)";
    wrap.querySelector(".fill").style.width = pct + "%";
    bars.appendChild(wrap);
  });

  // list (with filter)
  const shown = expenses.filter((x) => filter.value === "All" || x.category === filter.value);
  list.textContent = "";
  shown.forEach((x) => {
    const li = document.createElement("li");
    li.innerHTML = '<div class="info"><span></span><small></small></div><div class="right"><span></span><button class="del" aria-label="Delete expense">×</button></div>';
    li.querySelector(".info span").textContent = x.title;
    li.querySelector("small").textContent = x.category + " · " + x.date;
    li.querySelector(".right span").textContent = rupees(x.amount);
    li.querySelector(".del").addEventListener("click", () => deleteExpense(x.id));
    list.appendChild(li);
  });
  empty.style.display = shown.length ? "none" : "block";
}

render();
