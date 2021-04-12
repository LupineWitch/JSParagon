var items = [];
var editedID = -1;

var dragging;
var draggedOver;

items = JSON.parse(localStorage.getItem("receipt") || "[]");
console.log(items);

class Element
{
    constructor(name,count,price)
    {
        this._price = price;
        this._name = name;
        this._count = count;
    }

    elementTotal()
    {
        return this._price*this._count;    
    }
}

function elementEdit()
{
    let row = this.parentElement;
    editedID = Number.parseInt(row.firstChild.textContent) - 1;
    let aside = document.getElementById("edit_form");
    aside.removeAttribute("hidden");

    let editForm2 = document.getElementById("edit-el");
    editForm2.name.value = items[editedID]._name;
    editForm2.price.value = items[editedID]._price;
    editForm2.count.value = items[editedID]._count;
}

function elementDelete()
{
    let row = this.parentElement;
    let index = Number.parseInt(row.firstChild.textContent);
    let editForm = document.getElementById("edit_form");
    editForm.setAttribute("hidden", "");

    items.splice(index-1,1);
    RebuildRecipt();
}

function RebuildRecipt()
{
    let tbl = document.getElementById("recipt");
    while(tbl.rows.length > 1) 
    {
        tbl.deleteRow(1);
    }

    for(let i = 0 ; i < items.length ;i++)
    {
        let newRoW = tbl.insertRow();

        newRoW.draggable = true
        newRoW.addEventListener('drag', setDragging) 
        newRoW.addEventListener('dragover', setDraggedOver)
        newRoW.addEventListener('drop', compare) 

        let cellLp = newRoW.insertCell();
        let cellName = newRoW.insertCell();
        let cellCount = newRoW.insertCell();
        let cellPrice = newRoW.insertCell();
        let cellSum = newRoW.insertCell();

        let cellEdit = newRoW.insertCell();
        cellEdit.onclick = elementEdit;
        cellEdit.textContent = "EDIT";

        let cellDelete = newRoW.insertCell();
        cellDelete.onclick = elementDelete;
        cellDelete.textContent = "DELETE";

        cellLp.innerHTML = i+1;
        cellName.innerHTML = items[i]._name;
        cellCount.innerHTML = items[i]._count;
        cellPrice.innerHTML = items[i]._price;
        cellSum.innerHTML = items[i].elementTotal();
    }
}

const compare = (e) => {
    let indexDragging = Number.parseInt(dragging.firstChild.textContent) - 1 ;
    let indexDraggedOver = Number.parseInt(draggedOver.firstChild.textContent) - 1;
    
    let itemDragging = items[indexDragging];
    items.splice(indexDraggedOver, 0, itemDragging);
    items.splice(indexDragging > indexDraggedOver ? indexDragging + 1 : indexDragging, 1);
    RebuildRecipt();
};

function isEmptyOrSpaces(str)
{
    return str === null || str.match(/^ *$/) !== null;
}

const addform = document.getElementById("add-el");
addform.onsubmit = (event) => {
    let newCount = parseInt(addform.count.value);
    let newPrice = parseFloat(addform.price.value);
    if (!isEmptyOrSpaces(addform.name.value) && !isNaN(newCount) && !isNaN(newPrice))
    {
        let element = new Element(addform.name.value, newCount, newPrice);
        items.push(element);
        console.log(element);
        localStorage.setItem("receipt", JSON.stringify(items));
        RebuildRecipt();
    }
    //localStorage.receipt = JSON.stringify(items);
    event.preventDefault()
}

const editform = document.getElementById("edit-el");
editform.onsubmit = (event) => {

    let editCount = parseInt(editform.count.value);
    let editPrice = parseFloat(editform.price.value);
    if (!isEmptyOrSpaces(editform.name.value) && !isNaN(editCount) && !isNaN(editPrice))
    {
        let element = new Element(editform.name.value,editCount,editPrice);
        items[editedID] = element;
        editedID = -1;
        let editForm = document.getElementById("edit_form");
        editForm.setAttribute("hidden", "");
        localStorage.setItem("receipt", JSON.stringify(items));
        RebuildRecipt();
    }
    event.preventDefault()
}