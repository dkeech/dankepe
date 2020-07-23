//Rough draft

const baseURL = `http://flip1.engr.oregonstate.edu:1776/customers`;

const addRow = () => {
    document.getElementById("new_data").addEventListener("click", function(event) {
        var payload = getNewData();
        if (payload.firstname == "") {
            return
        }

        var req = new XMLHttpRequest()
        req.open("POST", baseURL, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("add success")
                remakeCustomersTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    });
};


const getNewData = () => {
    var firstname = document.getElementById("inputFirstName").value;
    var lastname = document.getElementById("inputLastName").value;
    var street_address= document.getElementById("inputStreetAddress").value;
    var city = document.getElementById("inputCity").value;
    var state= document.getElementById("inputState").value;
    var zip = document.getElementById("inputZip").value;
    var phone= document.getElementById("inputPhone").value;
    var email = document.getElementById("inputEmail").value;
    var newdata = {"firstname": firstname, "lastname": lastname, "email": email, "street_address": street_address, "city": city, "state": state, "zip":zip}
    return newdata;

}


const remakeCustomersTable = (tabledata) => {

    if (document.getElementById("customers_data") != null) {
        document.getElementById("customers_data").remove();
    }
    
    console.log(tabledata.rows)
    var table = document.createElement("table")
    table.className = "customers_table"
    table.id = "customers_data"
    document.body.appendChild(table)

    var rows = tabledata.rows
    for (i=0; i < rows.length; i++) {
        var tablerow = makeRow();
        var data = rows[i]
        tablerow.firstChild.value = rows[i].customerid
        tablerow.firstChild.nextSibling.value = rows[i].firstname
        tablerow.firstChild.nextSibling.nextSibling.value = rows[i].lastname
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.value = rows[i].email
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.value = rows[i].street_address
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value = rows[i].city
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value = rows[i].state
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value = rows[i].zip
        document.getElementById("customers_data").appendChild(tablerow)
    }

    Array.from(document.getElementsByClassName("update_button")).forEach(
        function(element, index, array) {
            element.addEventListener("click", function() {
                UpdateRow(element)
            })
        }
    );

    Array.from(document.getElementsByClassName("delete_button")).forEach(
        function(element, index, array) {
            element.addEventListener("click", function() {
                DeleteRow(element)
            })
        }
    );
}


const makeRow = () => {
    var tr = document.createElement("tr")
    var id_td = document.createElement("input")
    id_td.required = true
    id_td.className = "id"
    id_td.type = "hidden"
    var fname_td = document.createElement("input")
    fname_td.type = "text"
    fname_td.required = true
    var lname_td = document.createElement("input")
    lname_td.type = "text"
    lname_td.required = true
    var email = document.createElement("input")
    email.type = "email"
    email.required = true
    var adress = document.createElement("input")
    adress.type = "text"
    adress.required = true
    var city = document.createElement("input")
    city.type = "text"
    city.required = true
    var state = document.createElement("input")
    state.type = "text"
    state.required = true
    var zip= document.createElement("input")
    zip.type = "text"
    zip.required = true
    var update_button = document.createElement("button")
    var update_text = document.createTextNode("Update")
    update_button.appendChild(update_text)
    update_button.style.width = "100px"
    update_button.className = "update_button"
    var delete_button = document.createElement("button")
    var delete_text = document.createTextNode("Delete")
    delete_button.className = "delete_button"
    delete_button.appendChild(delete_text)
    delete_button.style.width = "100px"

    // Append all the data to the tr

    tr.appendChild(id_td)
    tr.appendChild(fname_td)
    tr.appendChild(lname_td)
    tr.appendChild(email)
    tr.appendChild(adress)
    tr.appendChild(city)
    tr.appendChild(state)
    tr.appendChild(zip)
    tr.appendChild(update_button)
    tr.appendChild(delete_button)
    return tr
}

const UpdateRow = (row) => {
    valuearray = row.parentNode.childNodes
    var customerid = valuearray[0].value
    var firstname = valuearray[1].value
    var lastname = valuearray[2].value
    var email = valuearray[3].value
    var street_address = valuearray[4].value
    var city = valuearray[5].value
    var state = valuearray[6].value
    var zip = valuearray[7].value

    var newdata = {"firstname": firstname, "lastname": lastname, "email": email, "street_address": street_address, "city": city, "state": state, "zip":zip, "customerid":customerid}
    console.log(newdata)
    

    var req = new XMLHttpRequest()
        req.open("PUT", baseURL, true);
        var payload = newdata
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("update success")
                remakeCustomersTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    
}

const DeleteRow = (row) => {
    valuearray = row.parentNode.childNodes
    var customerid = valuearray[0].value

    var newdata = {"customerid":customerid}

    var req = new XMLHttpRequest()
        req.open("DELETE", baseURL, true);
        var payload = newdata
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("delete success")
                remakeCustomersTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    
}




document.addEventListener("load", addRow());
window.addEventListener("load", function(event) {
    console.log("turtle")
    var req = new XMLHttpRequest();
    req.open('GET', baseURL, true);
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        remakeCustomersTable(JSON.parse(req.responseText))
      } else {
        console.log("Something is big wrong.", req.statusText)
      }});
    req.send(null)
    event.preventDefault
})