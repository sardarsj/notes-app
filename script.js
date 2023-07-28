const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = document.querySelector("header p"),
  closeIcon = document.querySelector("header i"),
  titleTag = document.querySelector("input"),
  descTag = document.querySelector("textarea");
const addBtn = popupBox.querySelector("button");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let isUpdate = false,
  updateId;

//getting local storage notes if they exist and parse them to js object
// else prasing them empty
//earlier only one note was stored at a time in local storage and everytime it was overwritten
//but now it wont be override, it will be saved
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// classList is used to add multiple classes to the element
addBox.addEventListener("click", () => {
  titleTag.focus();
  popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  addBtn.innerText = "Add Note";
  popupTitle.innerText = "Add a new Note";
  popupBox.classList.remove("show");
});

//to print localstorage value from there to console
function showNotes() {
  //removing previous notes before adding new ones
  document.querySelectorAll(".note").forEach((note) => note.remove());

  notes.forEach((note, index) => {
    //litag was copy pasted from html part that was initially done
    let liTag = ` <li class="note">
                            <div class="details">
                            <p>${note.title}</p>
                            <span
                                >${note.description}</span>
                            </div>
                            <div class="bottom-content">
                                <span>${note.date}</span>
                                <div class="settings">
                                    <i onclick = "showMenu(this)" class="uil uil-ellipsis-h"></i>
                                    <ul class="menu">
                                    <li onclick="updateNote(${index},'${note.title}', '${note.description}' )"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                                    </ul>
                                </div>
                            </div>
                        </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showNotes(); //pehle toh storage da data dikhda rhe

function showMenu(elem) {
  // console.log(elem);
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    //removing show class from the settings menu on document click
    //pehle ni hatt rea c menu, it was fixed
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(nodeId) {
  let confirmDel = confirm("Are you sure you want to delete this note ?");
  if (!confirmDel) return;
  notes.splice(nodeId, 1); //removing selected note from array/task
  //saving updated notes to local storage
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}
function updateNote(nodeId, title, desc) {
  isUpdate = true;
  updateId = nodeId;
  addBox.click();
  titleTag.value = title;
  descTag.value = desc;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Clicking on a "Submit" button, prevent it from submitting a form.
  let noteTitle = titleTag.value;
  let noteDesc = descTag.value;

  if (noteTitle || noteDesc) {
    // getting date info down below
    let dateObj = new Date(),
      month = months[dateObj.getMonth()],
      day = dateObj.getDate(),
      year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${month} ${day}, ${year}`,
    };
    if (!isUpdate) {
      //if isUpdate is false only then new note will be created
      //  const notes = [];
      //see notes object in line 31
      //adding new note to notes
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo; //updating specified note
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    //our noteinfo was displayed as object
    //to convert it object to string
    //we used json.stringify
    //Here, "notes" is key and after comma it is value.
    closeIcon.click(); //it is done such that after pressing submit button, the add-box will disappear
    showNotes(); //data entered will be displayed on the moment
  }
});
