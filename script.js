let total = 0; // Keeps track of the total amount of expenses.
//update expenses//
let expensesValue=document.getElementById("expensesValue");
const tbody = document.querySelector("#expenseTable tbody"); // Table body where rows will go.
const addBtn = document.getElementById('addBtn'); // Button to add a new expense.
let salary="0";
//update balance
let balaeditCurrentBalanceValue=document.getElementById("editCurrentBalance").innerHTML;
function formatCurrency(amount) {
    return 'R' + amount.toFixed(2); // Example: R10.00
}

function updateTotal() {
    document.getElementById("totalAmount").textContent = formatCurrency(total);
    expensesValue.innerHTML=formatCurrency(total);
    salary=document.getElementById("editCurrentSalary").innerHTML;
    document.getElementById("editCurrentBalance").innerHTML=parseInt(salary)-total;
    console.log("salary is "+salary);
}

function addRow(itemName, itemPrice, category, date) {
    // Create a new row
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itemName}</td>
        <td>${formatCurrency(itemPrice)}</td>
        <td>${category}</td>
        <td>${date}</td>
        <td>
            <button class="deleteBtn">Delete</button>
            <button class="editBtn">Edit</button>
        </td>
    `;

    // Add the row to the table
    tbody.appendChild(row);

    // Update the total expense
    total += itemPrice;
    
    updateTotal();
}

function deleteRow(row, price) {
    tbody.removeChild(row); // Remove the row from the table
    total -= price; // Subtract the price from the total
    updateTotal(); // Update the total display
}

function editRow(row) {
    const cells = row.querySelectorAll('td');
    const nameCell = cells[0];
    const priceCell = cells[1];
    const categoryCell = cells[2];
    const dateCell = cells[3];

    // Allow the user to edit the row's data directly
    nameCell.contentEditable = true;
    priceCell.contentEditable = true;
    categoryCell.contentEditable = true;
    dateCell.contentEditable = true;

    // Change the "Edit" button to "Save"
    const editBtn = row.querySelector('.editBtn');
    editBtn.textContent = 'Save';

    // When "Save" is clicked, update the row with the new values
    editBtn.onclick = function () {
        nameCell.contentEditable = false;
        priceCell.contentEditable = false;
        categoryCell.contentEditable = false;
        dateCell.contentEditable = false;

        // Get new values and update the table
        const newName = nameCell.textContent;
        const newPrice = parseFloat(priceCell.textContent.replace(/[^\d.-]/g, ''));
        const newCategory = categoryCell.textContent;
        const newDate = dateCell.textContent;

        // Update the total amount (subtract old price, add new price)
        const oldPrice = parseFloat(priceCell.textContent.replace(/[^\d.-]/g, ''));
        total = total - oldPrice + newPrice;
        updateTotal();

        // Update the row with the new values
        nameCell.textContent = newName;
        priceCell.textContent = formatCurrency(newPrice);
        categoryCell.textContent = newCategory;
        dateCell.textContent = newDate;

        // Change the "Save" button back to "Edit"
        editBtn.textContent = 'Edit';
        editBtn.onclick = function () {
            editRow(row); // If the user clicks again, start editing again
        };
    };
}

// Add event listener to the "Add Expense" button
addBtn.addEventListener('click', function () {
    const itemName = document.getElementById('itemName').value;
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('buyDate').value;
    //force user to input salary informstion first
    const salaryValue=document.getElementById("editCurrentSalary").innerText;
    //const balance value=document.getElementById("editCurrentBalance").value;
    if(parseInt(salaryValue)<=0){
        alert("Please fill in salary field first")
        return;
    }
    //console.log("salary is a "+typeof(parseInt(salaryValue)));
    // Validate inputs
    if (!itemName || isNaN(itemPrice) || itemPrice <= 0 || !category || !date) {
        alert("Please fill in all expense fields with valid data.");
        return;
    }

    // Add the new row to the table
    addRow(itemName, itemPrice, category, date);

    // Clear the input fields after adding
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('category').value = '';
    document.getElementById('buyDate').value = '';
});

// Event delegation for handling delete and edit actions
tbody.addEventListener('click', function (event) {
    const target = event.target;

    // If it's a "Delete" button, remove the row
    if (target.classList.contains('deleteBtn')) {
        const row = target.closest('tr'); // Get the closest row to the delete button
        const price = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, ''));
        deleteRow(row, price); // Call deleteRow function
    }

    // If it's an "Edit" button, start editing the row
    if (target.classList.contains('editBtn')) {
        const row = target.closest('tr'); // Get the closest row to the edit button
        editRow(row); // Call editRow function
    }
});
//edit and update salary
let currentBalance = document.getElementById("editCurrentBalance");
let currentSalary = document.getElementById("editCurrentSalary");

const editSalaryBtn = document.getElementById("editSalaryBtn");

editSalaryBtn.addEventListener('click', function() {
    let isEditable = currentBalance.contentEditable === "true" || currentSalary.contentEditable === "true";
    
    if (isEditable) {
        // If the elements are already editable, change them back to not editable
        //currentBalance.contentEditable = "false";
        currentSalary.contentEditable = "false";
        editSalaryBtn.innerText = "Edit"; 
    } else {
        // If not, make them editable
        //currentBalance.contentEditable = "true";
        currentSalary.contentEditable = "true";
        editSalaryBtn.innerText = "Save";
    }
    document.getElementById("editCurrentBalance").innerHTML=document.getElementById("editCurrentSalary").innerHTML;
});

