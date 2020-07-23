//Kepe Bonner CS290 assignment 6
//Made with love

const baseURL = `http://flip1.engr.oregonstate.edu:1337/`;



const UpdateRow = (row) => {
    valuearray = row.parentNode.childNodes
    var id = valuearray[0].value
    var name = valuearray[1].value
    var reps = valuearray[2].value
    var weight = valuearray[3].value
    var unit = valuearray[4].value
    var date = valuearray[5].value

    var newdata = {"name": name, "reps": reps, "weight": weight, "unit": unit, "date": date, "id": id}
    

    var req = new XMLHttpRequest()
        req.open("PUT", baseURL, true);
        var payload = newdata
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("update success")
                remakeTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    
}

const DeleteRow = (row) => {
    valuearray = row.parentNode.childNodes
    var id = valuearray[0].value

    var newdata = {"id": id}

    var req = new XMLHttpRequest()
        req.open("DELETE", baseURL, true);
        var payload = newdata
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("delete success")
                remakeTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    
}


const makeRow = () => {
    var tr = document.createElement("tr")
    var id_td = document.createElement("input")
    id_td.required = true
    id_td.className = "id"
    id_td.type = "hidden"
    var name_td = document.createElement("input")
    name_td.type = "text"
    name_td.required = true
    var reps_td = document.createElement("input")
    reps_td.type = "number"
    reps_td.required = true
    var weight_td = document.createElement("input")
    weight_td.type = "number"
    weight_td.required = true
    var unit_td = document.createElement("select")
    unit_td.required = true
    var kg = document.createElement("option")
    kg.value = 1
    var lbs = document.createElement("option")
    lbs.value = 0
    kg.text = "kg"
    lbs.text = "lbs"
    unit_td.add(lbs)
    unit_td.add(kg)
    var date = document.createElement("input")
    date.type = "date"
    date.required = "true"
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
    tr.appendChild(name_td)
    tr.appendChild(reps_td)
    tr.appendChild(weight_td)
    tr.appendChild(unit_td)
    tr.appendChild(date)
    tr.appendChild(update_button)
    tr.appendChild(delete_button)
    return tr
}


const remakeTable = (tabledata) => {

    if (document.getElementById("workout_data") != null) {
        document.getElementById("workout_data").remove();
    }
    
    console.log(tabledata.rows)
    var table = document.createElement("table")
    table.className = "workout_table"
    table.id = "workout_data"
    document.body.appendChild(table)

    var rows = tabledata.rows
    for (i=0; i < rows.length; i++) {
        var tablerow = makeRow();
        var data = rows[i]
        tablerow.firstChild.value = rows[i].id
        tablerow.firstChild.nextSibling.value = rows[i].name
        tablerow.firstChild.nextSibling.nextSibling.value = rows[i].reps
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.value = rows[i].weight
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.value = rows[i].unit
        tablerow.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value = rows[i].date.slice(0,10)
        document.getElementById("workout_data").appendChild(tablerow)
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

    

// Proper array value order
const addRow = () => {
    document.getElementById("new_data").addEventListener("click", function(event) {
        var payload = getNewData();
        if (payload.name == "") {
            return
        }

        var req = new XMLHttpRequest()
        req.open("POST", baseURL, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("add success")
                remakeTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    });
};

const getNewData = () => {
    var name = document.getElementById("name_input").value;
    var reps = document.getElementById("reps_input").value;
    var weight = document.getElementById("weight_input").value;
    var unit = document.getElementById("unit_input").value;
    var date = document.getElementById("date_input").value;

    var newdata = {"name": name, "reps": reps, "weight": weight, "unit": unit, "date": date}
    return newdata;

}


document.addEventListener("load", addRow());
window.addEventListener("load", function(event) {
    console.log("turtle")
    var req = new XMLHttpRequest();
    req.open('GET', baseURL, true);
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        remakeTable(JSON.parse(req.responseText))
      } else {
        console.log("Something is big wrong.", req.statusText)
      }});
    req.send(null)
    event.preventDefault
})