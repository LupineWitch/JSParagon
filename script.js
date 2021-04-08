
var items = [];

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
    let index = Number.parseInt(row.firstChild.textContent);

    console.log("EDIT" + index);
}

function elementDelete()
{
    let row = this.parentElement;
    let index = Number.parseInt(row.firstChild.textContent);

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


const myform = document.getElementById("add-el");
myform.onsubmit = (event) => {
   let element = new Element(myform.name.value,myform.count.value,myform.price.value);
    items.push(element);
    RebuildRecipt();
 event.preventDefault()
}