const order = require("../order");

// function createOrder() {
//     //get the first name 
//     var order_number  = document.getElementById('order_number').value
//     //construct the URL and redirect to it
//     alert(order_number)
//     window.location = '/order/' + order_number
// }
var rowNumber;
console.log(`rowNumber is ${rowNumber}`);
let lineNumber = 0;
var customer_context = [];

function startOrder(){
    rowNumber = 2;
    var order_number = document.querySelector('#order_number').value;
    var date = document.querySelector('#dateSelect').value;
    var customer_name = document.querySelector('#nameSelect').value;
    document.querySelector('#orderNumber').innerHTML = order_number;
    document.querySelector('#customerName').innerHTML = customer_name;
    document.querySelector('#orderDate').innerHTML = date;
    customer_context = [order_number, date, customer_name];
    document.querySelector('#startButton').classList.add('hidden');
    document.querySelector('#staticFields').classList.add('hidden');
    document.querySelector('#addButton').classList.remove('hidden');
    document.querySelector('#submitButton').classList.remove('hidden');
    document.querySelector('#addFields').classList.remove('hidden');
    document.querySelector('#notesField').classList.remove('hidden');
    document.querySelector('#orderInstructions').classList.add('hidden');
}


function addToOrder(){
    console.log(`inner rowNumber is ${rowNumber}`);
    var orderTable = document.querySelector('#orderTable');
    var year = document.querySelector('#selectYear').value;
    var brand = document.querySelector('#selectBrand').value;
    var model = document.querySelector('#selectModel').value;
    var price = document.querySelector('#selectModel').dataset.price;
    
    var row = orderTable.insertRow();
    var yearCell = row.insertCell(0);
    var brandCell = row.insertCell(1);
    var modelCell = row.insertCell(2);
    var priceCell = row.insertCell(3);
    var deleteCell = row.insertCell(4);
    yearCell.innerHTML = year;
    brandCell.innerHTML = brand;
    modelCell.innerHTML = model;
    priceCell.innerHTML = price;
    deleteCell.innerHTML = `<div class="btn btn-primary" onclick="deleteThisRow(${rowNumber})">Delete</div>`
    rowNumber ++;
}

function deleteThisRow(num){
    console.log(`num is ${num}`)
    table = document.querySelector('orderTable');
    table.deleteRow(num);
    
}