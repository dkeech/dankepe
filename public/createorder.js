const order = require("../order");

var rowNumber;
console.log(`rowNumber is ${rowNumber}`);
let lineNumber = 0;
var customer_context = [];

function startOrder(){
    rowNumber = 2;
    var order_number = document.querySelector('#order_number').value;
    var date = document.querySelector('#dateSelect').value;
    var customerid = document.querySelector('#nameSelect').value;
    // var customer_name = document.querySelector('#nameSelect').value;
    var customer_name = convertToName(document.querySelector('#nameSelect'));
    document.querySelector('#orderNumber').innerHTML = order_number;
    document.querySelector('#customerName').innerHTML = customer_name;
    document.querySelector('#customerId').innerHTML = customerid;
    document.querySelector('#orderDate').innerHTML = date;
    customer_context = [order_number, date, customer_name];
    document.querySelector('#startButton').classList.add('hidden');
    document.querySelector('#staticFields').classList.add('hidden');
    document.querySelector('#addButton').classList.remove('hidden');
    document.querySelector('#submitButton').classList.remove('hidden');
    document.querySelector('#addFields').classList.remove('hidden');
    document.querySelector('#notesField').classList.remove('hidden');
    document.querySelector('#orderInstructions').classList.add('hidden');
    
    document.getElementById('customer_id_input').value = document.querySelector('#customerId').innerHTML;
    document.getElementById('order_date_input').value = document.querySelector('#orderDate').innerHTML;
}


function addToOrder(){
    var totalPrice = 0;
    var orderTable = document.querySelector('#orderTable');
    var year = document.querySelector('#p-modelyear').value;
    var brand = document.querySelector('#p-brandname').value;
    var model = document.querySelector('#p-model').value;
    var price = parseFloat(document.querySelector('#p-price').value);//.selectedOptions[0].dataset.price
    var vehicle = document.querySelector('#selectVehicle').value;
    
    var row = orderTable.insertRow();
    var yearCell = row.insertCell(0);
    var brandCell = row.insertCell(1);
    var modelCell = row.insertCell(2);
    var priceCell = row.insertCell(3);
    
    priceCell.classList.add('itemPrice');
    var deleteCell = row.insertCell(4);
    yearCell.innerHTML = year;
    brandCell.innerHTML = brand;
    modelCell.innerHTML = model;
    priceCell.innerHTML = price;
    priceCell.setAttribute('value', price);
    deleteCell.innerHTML = `<div class="btn btn-primary" onclick="deleteThisRow(this)">Delete</div>`;
    
    (function calculate(){
        var nodeList = document.querySelectorAll('.itemPrice');
        var prices = [];
        for(i of nodeList){
            prices.push(parseFloat(i.getAttribute('value')));
        }
        total = 0;
        for(i of prices){
            total += i;
        }
        totalPrice = total;
        tax = total * .09;
        total = total + tax;
        document.querySelector('#tax').innerHTML = tax.toFixed(2);
        document.querySelector('#total').innerHTML = total.toFixed(2);
    })();

    document.getElementById('price_input').value = totalPrice;
    document.getElementById('tax_input').value = document.querySelector('#tax').innerHTML;
    document.getElementById('total_input').value = document.querySelector('#total').innerHTML;
}

function deleteThisRow(r){
    
    var i = r.parentNode.parentNode.rowIndex;
    table = document.querySelector('#orderTable');
    table.deleteRow(i);
    
}

function convertToName(value){
    return value.options[value.selectedIndex].text;
}