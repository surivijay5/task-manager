 const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items


// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
const statusListArray = ['backlog','progress','complete','onHold']
const statusListEl = [backlogList,progressList,completeList,onHoldList]

let draggedItem
let currentColumn

// Drag Functionality


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
  return [backlogListArray,progressListArray,completeListArray,onHoldListArray]
}

// Set localStorage Arrays
function updateSavedColumns() {
  const tempListArr = [backlogListArray,progressListArray,completeListArray,onHoldListArray]
  for(let i = 0 ; i < tempListArr.length; i++){
    localStorage.setItem(`${statusListArray[i]}Items`, JSON.stringify(tempListArr[i]));
  }
}

function addToColumn(column){
  const item = addItems[column].textContent
  const selectedArr = statusListEl[column]
  addItems[column].textContent = ""
  createItemEl(selectedArr,column,item,statusListEl[column].children.length )
  rebuildArrays()
  updateSavedColumns()
}

function updateItem(event,el, id){
  const selectedEl = event.target
  if(selectedEl.textContent == ""){
    const parent = itemLists[el]
    parent.removeChild(selectedEl)
  }
  rebuildArrays()
  updateSavedColumns()
}

function showInputBox(column){
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

function hideInputBox(column){
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.innerText = item
  listEl.draggable = true
  listEl.dataset.id = index
  listEl.setAttribute('ondragstart',"drag(event)")
  listEl.setAttribute('onfocusout',`updateItem(event,${column}, ${index})`)
  listEl.contentEditable = true
  columnEl.appendChild(listEl)
}

function drag(ev) {
  const el = ev.target
  draggedItem = el
  console.log('dragged el' , el)
}

function dragEnter(column){
    itemLists[column].classList.add('over')
    currentColumn = column
}
 
function allowDrop(ev){
  ev.preventDefault()
}

function drop(ev) {
  ev.preventDefault();
  console.log('dropped',ev)
  itemLists.forEach(col => {
    col.classList.remove('over')
  })

   const parent = itemLists[currentColumn]
   parent.appendChild(draggedItem)
   
   rebuildArrays()
   updateSavedColumns()
}

function rebuildArrays(){
  backlogListArray = []
  progressListArray = []
  completeListArray = []
  onHoldListArray = []

  for(let i = 0 ; i < backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent)
  }

  for(let i = 0 ; i < progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent)
  }
  for(let i = 0 ; i < completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent)
  }
  for(let i = 0 ; i < onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once

  rebuildArrays()
  const statusList = getSavedColumns()
  statusListArray.forEach((item,idx) => {
    statusList[idx].forEach((i,id) => {
      createItemEl(statusListEl[idx],idx,i,id )
    })
  })
 
}

updateDOM()

