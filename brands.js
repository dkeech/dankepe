//Rough draft

const baseURL = `http://flip1.engr.oregonstate.edu:1776/brands`;

const addRow = () => {
    document.getElementById("new_data").addEventListener("click", function(event) {
        var payload = getNewData();
        if (payload.brandname == "") {
            return
        }

        var req = new XMLHttpRequest()
        req.open("POST", baseURL, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("add success")
                remakeBrandsTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    });
};


const getNewData = () => {
    var name = document.getElementById("brandname_input").value;
    var newdata = {"brandname": name}
    return newdata;

}


const remakeBrandsTable = (tabledata) => {

    if (document.getElementById("brands_data") != null) {
        document.getElementById("brands_data").remove();
    }
    
    console.log(tabledata.rows)
    var table = document.createElement("table")
    table.className = "brands_table"
    table.id = "brands_data"
    document.body.appendChild(table)

    var rows = tabledata.rows
    for (i=0; i < rows.length; i++) {
        var tablerow = makeRow();
        var data = rows[i]
        tablerow.firstChild.value = rows[i].brandid
        tablerow.firstChild.nextSibling.value = rows[i].brandname
        document.getElementById("brands_data").appendChild(tablerow)
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
    var name_td = document.createElement("input")
    name_td.type = "text"
    name_td.required = true
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
    tr.appendChild(update_button)
    tr.appendChild(delete_button)
    return tr
}

const UpdateRow = (row) => {
    valuearray = row.parentNode.childNodes
    var brandid = valuearray[0].value
    var brandname = valuearray[1].value
    

    var newdata = {"brandname": brandname, "brandid": brandid}
    

    var req = new XMLHttpRequest()
        req.open("PUT", baseURL, true);
        var payload = newdata
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("update success")
                remakeBrandsTable(JSON.parse(req.responseText))
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    
}

const DeleteRow = (row) => {
    valuearray = row.parentNode.childNodes
    var brandid = valuearray[0].value

    var newdata = {"brandid": brandid}

    var req = new XMLHttpRequest()
        req.open("DELETE", baseURL, true);
        var payload = newdata
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("delete success")
                remakeBrandsTable(JSON.parse(req.responseText))
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
        remakeBrandsTable(JSON.parse(req.responseText))
      } else {
        console.log("Something is big wrong.", req.statusText)
      }});
    req.send(null)
    event.preventDefault
})