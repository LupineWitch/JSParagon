
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
    while(tbl.rows.length > 1) {
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

const compare = (e) =>{
    let index1 = Number.parseInt(dragging.firstChild.textContent) - 1 ;
    let index2 = Number.parseInt(draggedOver.firstChild.textContent) - 1;
    
    let item1 = items[index1];
    items.splice(index2, 0, item1);
    items.splice(index1 > index2 ? index1 +1 : index1,1);
    RebuildRecipt();
  };


  const setDraggedOver = (e) => {
      e.preventDefault();
      draggedOver = e.target;
    }

    const setDragging = (e) =>{
        dragging = e.target;
      }


const addform = document.getElementById("add-el");
addform.onsubmit = (event) => {
   let element = new Element(addform.name.value,addform.count.value,addform.price.value);
    items.push(element);
    RebuildRecipt();
 event.preventDefault()
}

const editform = document.getElementById("edit-el");
editform.onsubmit = (event) => {
   let element = new Element(editform.name.value,editform.count.value,editform.price.value);
    items[editedID] = element;
    editedID = -1;
    let editForm = document.getElementById("edit_form");
    editForm.setAttribute("hidden", "");
    RebuildRecipt();
 event.preventDefault()
}