// --- STATE & INITIALIZATION ---
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salary = parseFloat(localStorage.getItem("salary")) || 0;
let goal = parseFloat(localStorage.getItem("budgetGoal")) || 0;

const tbody = document.querySelector("#expenseTable tbody");
const currentSalary = document.getElementById("editCurrentSalary");
const currentBalance = document.getElementById("editCurrentBalance");
const expensesValue = document.getElementById("expensesValue");
const budgetGoalInput = document.getElementById("budgetGoal");

window.onload = () => {
    currentSalary.innerText = salary;
    budgetGoalInput.value = goal;
    renderAll();
    updateDashboard();
};

function formatCurrency(amount) {
    return 'R ' + parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2});
}

// --- CORE FUNCTIONS ---
function updateDashboard() {
    const total = expenses.reduce((sum, exp) => sum + exp.price, 0);
    const balance = salary - total;

    document.getElementById("totalAmount").textContent = formatCurrency(total);
    expensesValue.innerHTML = total.toFixed(2);
    currentBalance.innerHTML = balance.toFixed(2);
    currentBalance.style.color = balance < 0 ? "#ef4444" : "white";

    updateBehavior(total);
    save();
}

function updateBehavior(total) {
    const behaviorBox = document.querySelector(".yourBehavior");
    const currentGoal = parseFloat(budgetGoalInput.value) || salary;
    const percent = currentGoal > 0 ? (total / currentGoal) * 100 : 0;
    
    let color = "#10b981";
    if (percent > 90) color = "#ef4444";
    else if (percent > 70) color = "#f59e0b";

    behaviorBox.innerHTML = `
        <div class="analysis-card">
            <h2 class="yourBehaviorHeading">Spending Behavior</h2>
            <p>Status: <strong style="color:${color}">${percent > 100 ? 'OVER BUDGET' : 'On Track'}</strong></p>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${Math.min(percent, 100)}%; background: ${color}"></div>
            </div>
            <p>${percent.toFixed(1)}% of your R${currentGoal} goal used.</p>
        </div>
    `;
}

function renderAll() {
    tbody.innerHTML = "";
    expenses.forEach(exp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exp.name}</td>
            <td>${formatCurrency(exp.price)}</td>
            <td><span class="category-tag">${exp.category}</span></td>
            <td>${exp.date}</td>
            <td><button class="deleteBtn" onclick="deleteExp(${exp.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// --- INTERACTION ---
document.getElementById('addBtn').addEventListener('click', () => {
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const cat = document.getElementById('category').value;
    const date = document.getElementById('buyDate').value;

    if (salary <= 0) return alert("Set salary first!");
    if (!name || isNaN(price) || !date) return alert("Fill all fields!");

    expenses.push({ id: Date.now(), name, price, category: cat, date });
    renderAll();
    updateDashboard();
    document.querySelectorAll('.userInput input').forEach(i => i.value = "");
});

function deleteExp(id) {
    expenses = expenses.filter(e => e.id !== id);
    renderAll();
    updateDashboard();
}

document.getElementById('editSalaryBtn').addEventListener('click', function() {
    const isEdit = currentSalary.contentEditable === "true";
    if (isEdit) {
        salary = parseFloat(currentSalary.innerText) || 0;
        currentSalary.contentEditable = "false";
        this.innerText = "Edit Salary";
        updateDashboard();
    } else {
        currentSalary.contentEditable = "true";
        currentSalary.focus();
        this.innerText = "Save";
    }
});

// --- UTILITIES ---
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('#expenseTable tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    });
});

document.getElementById('exportBtn').addEventListener('click', () => {
    let csv = "Item,Price,Category,Date\n" + expenses.map(e => `${e.name},${e.price},${e.category},${e.date}`).join("\n");
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.download = "expenses.csv";
    link.click();
});

budgetGoalInput.addEventListener('input', () => {
    goal = parseFloat(budgetGoalInput.value) || 0;
    updateDashboard();
});

function save() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("salary", salary);
    localStorage.setItem("budgetGoal", goal);
}
