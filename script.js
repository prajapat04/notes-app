let notes = [];

document.getElementById("search").addEventListener("input", renderNotes);

window.onload = function () {
    const saved = localStorage.getItem("notes");
    if(saved){
        notes = JSON.parse(saved);
        displayNotes();
    }
};

const toggle = document.getElementById("toggle-mode");
const body = document.body;

if(localStorage.getItem("dark-mode") === "enabled"){
    body.classList.add("dark-mode");
    toggle.textContent = "☀️";
}

toggle.addEventListener("click", ()  => {
    body.classList.toggle("dark-mode");

    if(body.classList.contains("dark-mode")){
        localStorage.setItem("dark-mode", "enabled");
        toggle.textContent = "☀️";
    }  else {
        localStorage.setItem("dark-mode", "disabled");
        toggle.textContent = "🌙";
    }
});


function addNote() {
    const note = document.getElementById("input-note").value.trim();
    if(!note){
        alert("Enter your notes.");
        return;
    }
    const timestamp = new Date().toISOString();

    if(note){
        notes.push({note, timestamp});
    }
    displayNotes();
    saveNote();
    clearform();

}
function clearform() {
    document.getElementById("input-note").value = "";
}
function saveNote(){
    localStorage.setItem("notes", JSON.stringify(notes));
}

function displayNotes(){
    const container = document.getElementById("notes-container");
    container.innerHTML = "";

    notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.className = "notesBox";
        div.innerHTML = `
        <p>${note.note}</p>
        <button onclick = "editNote(${index})">edit</button>    
        <button onclick = "confirmDeleteNote(${index})">Delete</button>    
        <p class="note-timestamp">Saved on: ${new Date(note.timestamp).toLocaleString()}</p>
        `;
        container.appendChild(div);
    });
}

function renderNotes() {
  const container = document.getElementById("notes-container");
  const searchTerm = document.getElementById("search").value.toLowerCase();

  container.innerHTML = "";

  const filtered = notes.filter(note =>
    note.note.toLowerCase().includes(searchTerm)
  );

  if (filtered.length === 0) {
    container.innerHTML = "<p>No matching notes found.</p>";
    return;
  }

  filtered.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "notesBox";

    noteDiv.innerHTML = `
      <p>${note.note}</p>
        <button onclick = "editNote(${index})">edit</button>    
        <button onclick = "confirmDeleteNote(${index})">Delete</button>    
        <p class="note-timestamp">Saved on: ${new Date(note.timestamp).toLocaleString()}</p>
    `;

    container.appendChild(noteDiv);
  });
}



function confirmDeleteNote(index){
    const result = confirm("Are you really sure to delete this note.");
    if(result){
    deleteNote(index);
    return;    
}
}
function deleteNote(index) {
      notes.splice(index, 1);
      saveNote();
      displayNotes();
}


let editingIndex = null;
function editNote(index){
    document.getElementById("input-note").value = notes[index].note;
    editingIndex = index;
    const btn = document.getElementById("submit-note");
    btn.innerText = "Update";
    btn.onclick = updateNote;
}

function updateNote() {
    const input = document.getElementById("input-note");
    const upNote = input.value.trim();

    if(upNote === ""){
        alert("please re cheak you edit note.");
        return;
    }
    notes[editingIndex].note = upNote;
    alert("Updated Sucessfully.")
    editingIndex = null;
    input.value = "";

    const addBtn = document.getElementById("submit-note");
    addBtn.innerText = "add Note";
    addBtn.onclick = addNote;
    saveNote();
    displayNotes();
    
}