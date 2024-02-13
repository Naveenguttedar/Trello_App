console.log("Hello World");
const task_list = document.getElementById('task_list');
const on_going_task = document.getElementById("on_going_tasks")
const completed_tasks=document.getElementById("completed_tasks")
const on_going_task_list = document.getElementById('on_going_task_list');
const completed_task_list = document.getElementById('completed_task_list');
const add_task_btn = document.getElementById('add_task');
console.log(completed_tasks);
let dumb_text = "Some quick example text to build on the card title and make up the bulk of the card's content."
let task_data = localStorage.getItem("task_data");
let on_going_task_data = localStorage.getItem("on_going_task_data");
let completed_task_data=localStorage.getItem("completed_task_data");
if (task_data == null) {
  task_data = [{ card_title: "card title 1", card_text: dumb_text }, { card_title: "card title 2", card_text: dumb_text }, { card_title: "card title 3", card_text: dumb_text }]
  localStorage.setItem("task_data", JSON.stringify(task_data));
}
task_data = JSON.parse(localStorage.getItem("task_data"));
if (on_going_task_data == null){
  on_going_task_data = [{ card_title: "card title 1", card_text: dumb_text }];
  localStorage.setItem("on_going_task_data", JSON.stringify(on_going_task_data));
}
on_going_task_data = JSON.parse(localStorage.getItem("on_going_task_data"))
if(completed_task_data==null){
completed_task_data = [{ card_title: "card title 1", card_text: dumb_text }];
  localStorage.setItem("completed_task_data", JSON.stringify(completed_task_data));
}

completed_task_data = JSON.parse(localStorage.getItem("completed_task_data"));
const makeCard = (card_type, card_idx, data) => {
  const card = document.createElement('div');
  card.setAttribute("draggable", "true")
  card.setAttribute("id",card_type+"-"+card_idx);
  card.classList.add('card');
  const cardId=card_type=="task"?1:card_type=="on_going"?2:3;
  card.innerHTML = `<div class="card_top_sec">
              <p class="card_title">${data.card_title}</p>
              <div class="dropdown">
                <i class="fas fa-ellipsis-v" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                  onclick="event.stopPropagation();"></i>
                <ul class="dropdown-menu active" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <div class="delet-btn" onclick="deletCard(${cardId},${card_idx})">
                      &nbsp;<i class="fas fa-trash-alt i"></i>&nbsp; Suppression
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="card_body_sec">
              <p>${data.card_text}</p>
            </div>`

  card.addEventListener("dragstart", (e) => { 
    card.classList.add('draggable');
    const cardObj={ card_type, card_idx,node:JSON.stringify(card)};
    e.dataTransfer.setData("text/plain", JSON.stringify(cardObj));
  })
  card.addEventListener('dragend',()=>{
    card.classList.remove('draggable');
  })
  return card;
}

task_data.map((e, i) => {
  const card = makeCard("task", i, task_data[i]);
  task_list.appendChild(card);
})
on_going_task_data.map((e, i) => {
  const card = makeCard("on_going", i, on_going_task_data[i]);
  on_going_task_list.appendChild(card);
})

completed_task_data.map((e, i) => {
  const card = makeCard("completed", i, completed_task_data[i]);
    completed_task_list.appendChild(card);
})
const addToLocalStorage=(key,value)=>{
    localStorage.setItem(key, JSON.stringify(value))
}
function deletCard(card_type_id, card_idx) {
  const card_type=card_type_id==1?"task":card_type_id==2?"on_going":"completed"
    let element = document.getElementById(card_type+"-" + card_idx);
  if (card_type_id == 1) {
    element.remove();
    task_data.splice(card_idx, 1);
    addToLocalStorage("task_data",task_data)
  }
  else if(card_type_id==2){
    element.remove();
    on_going_task_data.splice(card_idx,1);
    addToLocalStorage("on_going_task_data",on_going_task_data)
  }
  else{
    element.remove();
    completed_task_data.splice(card_idx,1);
    addToLocalStorage("completed_task_data",completed_task_data)
  }
}
add_task_btn.addEventListener('click', () => {
  task_data.push({ card_title: "newbi", card_text: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat." })
  localStorage.setItem("task_data", JSON.stringify(task_data));
  const card = makeCard("task", task_data.length-1,task_data[task_data.length-1]);
  task_list.appendChild(card);
})

// Drag&Drop functionlity
function onDragenter(e) {
  if (e.target.classList.contains("dropzone")) {
    e.target.classList.add("dragover");
  }
}
function onDragleave(e) {
  if (e.target.classList.contains("dropzone")) {
    e.target.classList.remove("dragover");
  }
}
function onDragover(e) {
  e.preventDefault();
}
function onDrop(e,container_type, container_list) {
  let cardObj = e.dataTransfer.getData("text");
  cardObj = JSON.parse(cardObj);
  let card_type=cardObj.card_type,card_idx=cardObj.card_idx;
  if(container_type==card_type){
    console.log("this are same types");
    return
  }
  const card_data=card_type=="task"?{id:1,list:task_data}:card_type=="on_going"?{id:2,list:on_going_task_data}:{id:3,list:completed_task_data};
  if(container_type=="on_going"){
    on_going_task_data.push(card_data.list[card_idx]);
  addToLocalStorage("on_going_task_data",on_going_task_data)
    let len = on_going_task_data.length - 1;
    const card = makeCard("on_going", len, on_going_task_data[len]);
    deletCard(card_data.id,card_idx);
   container_list.appendChild(card);
  }
  else{
    completed_task_data.push(card_data.list[card_idx]);
    let len = completed_task_data.length - 1 ; addToLocalStorage("completed_task_data",completed_task_data);
    const card = makeCard("completed", len, completed_task_data[len]);
    deletCard(card_data.id,card_idx);
    container_list.appendChild(card);
  }
  e.target.classList.remove("dragover");
  e.preventDefault();
}

on_going_task.addEventListener('dragover', (e) => onDragover(e ))
on_going_task.addEventListener('dragenter', (e) => onDragenter(e))
on_going_task.addEventListener('dragleave', (e) => onDragleave(e))
on_going_task.addEventListener('drop', (e) => onDrop(e,"on_going", on_going_task_list));
console.log(completed_tasks)
completed_tasks.addEventListener('dragover', (e) => onDragover(e))
completed_tasks.addEventListener('dragenter', (e) => onDragenter(e))
completed_tasks.addEventListener('dragleave', (e) => onDragleave(e))
completed_tasks.addEventListener('drop', (e) => onDrop(e,"completed", completed_task_list))












