var items = [];
var editedID = -1;

var dragging;
var draggedOver;

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
    let sum = 0;
    while(tbl.rows.length > 1) 
    {
        tbl.deleteRow(1);
    }

    for(let i = 0 ; i < items.length ;i++)
    {
        //console.log(items);
        let newRoW = tbl.insertRow();
        sum += items[i].elementTotal();
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

    let sumCell = document.getElementById("sum");
    sumCell.textContent = "Całkowita suma to: " + sum;
}

const compare = (e) => {
   
    let indexDragging = Number.parseInt(dragging.firstChild.textContent) - 1 ;
    let indexDraggedOver = Number.parseInt(draggedOver.firstChild.textContent) - 1;
    console.log(dragging.firstChild );
    console.log(draggedOver.firstChild);
    console.log(indexDragging);
    console.log(indexDraggedOver);

    let itemDragging = items[indexDragging];
    items.splice( indexDragging - indexDraggedOver == -1 ? indexDraggedOver+1: indexDraggedOver, 0, itemDragging);
    items.splice(indexDragging > indexDraggedOver ? indexDragging + 1 : indexDragging, 1);
    RebuildRecipt();
};

const setDraggedOver = (e) => {
    e.preventDefault();
    draggedOver = e.target.parentElement;
   // console.log(draggedOver);
}

const setDragging = (e) => {
    e.preventDefault();
    dragging = e.target;
   // console.log(dragging);

}

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
       // localStorage.setItem("receiptArray", JSON.stringify(items));
        RebuildRecipt();
    }
    event.preventDefault();
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
        RebuildRecipt();
    }
    event.preventDefault()
}




 document.body.onload = function() {
    console.log("document is loaded");
    if (localStorage.getItem("receiptArray") != null)
    {
        var tmpItems = JSON.parse(localStorage.getItem("receiptArray") || "[]");
        console.log("GÓRA")
         console.log(tmpItems);
        for (let i = 0; i < tmpItems.length; i++)
        {
             items.push(new Element(tmpItems[i]._name, tmpItems[i]._count, tmpItems[i]._price));
         }
         console.log(items);
         RebuildRecipt();
     }

   }
   

   window.onbeforeunload = function()
    {       
         localStorage.setItem("receiptArray", JSON.stringify(items));
   }
   