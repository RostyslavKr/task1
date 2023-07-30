import notesItems from "./notes.js";

const refs = {
  notesTable: document.querySelector("[data-table-notes]"),
  summaryNotesTable: document.querySelector("[data-table-summary-notes]"),
  openModalCreateNoteBtn: document.querySelector("[data-open-modal]"),
  closeModalBtn: document.querySelector("[data-close-modal]"),
  createNotesBtn: document.querySelector("[data-btn-create-note]"),
  modal: document.querySelector("[data-modal]"),
  modalContent: document.querySelector(".modal-content"),
};

refs.openModalCreateNoteBtn.addEventListener("click", onCreateNote);
refs.closeModalBtn.addEventListener("click", toggleModal);
refs.notesTable.addEventListener("click", onNotesTable);
refs.summaryNotesTable.addEventListener("click", onSummaryNotesTable);

// Function to toggle the modal visibility
function toggleModal() {
  refs.modal.classList.toggle("is-hidden");
}

// Function to render the header of the notes table
function renderTableHeader() {
  const markup = `<li class="table-header">
        <div>Name</div>
        <div>Created</div>
        <div>Category</div>
        <div>Content</div>
        <div>Dates</div>
        <div>
        <svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-pencil"></use>
          </svg>
          <svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-add"></use>
          </svg>
          <svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-bin2"></use>
          </svg>
        </div>
      </li>`;
  return (refs.notesTable.innerHTML = markup);
}

// Function to handle the "Create Note" button click and display the form for creating a new note
function onCreateNote() {
  formCreateNote();
  toggleModal();
  const formCreate = document.querySelector(".js-form-note");
  formCreate.addEventListener("submit", onFormSubmit);
}

// Function to render the form for creating a new note
function formCreateNote() {
  const markup = `<form class="form js-form-note">
            <label for="name">Name<input id="name" type="text" name="name" /></label>
            
            <label for="category">Category<select id="category" name="category" required>
              <option value="Task">Task</option>
              <option value="Random Thought">Random Thought</option>
              <option value="Idea">Idea</option>
            </select></label>
            
            <label for="content">Content<input id="content" type="text" name="content" /></label>
            
            <button type="submit" class="create-note" data-btn-create-note>
              Create Note
            </button>
          </form>`;
  return (refs.modalContent.innerHTML = markup);
}

// Function to get the current date in a specific format
function createDate() {
  const timeStamp = Date.now();
  const monthsNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(timeStamp);
  const month = date.getMonth();
  const createdDate =
    monthsNames[month] + " " + date.getDay() + "," + date.getFullYear();
  return createdDate;
}

// Function to extract dates from the content of a note using regular expressions
function extractDates(content) {
  const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/g;
  return content.match(dateRegex) || [];
}

// Function to handle the form submission when creating a new note
function onFormSubmit(e) {
  e.preventDefault();

  if (e.target.classList.contains("js-form-note")) {
    const {
      elements: { name, content, category },
    } = e.currentTarget;
    if (!name.value || !created.value || !content.value || !category.value) {
      alert("Please fill in all fields before creating a note.");
      return;
    }
    const createdDate = createDate();
    const note = {
      id: Date.now(),
      name: name.value,
      created: createdDate,
      content: content.value,
      category: category.value,
      dates: extractDates(content.value),
      archived: false,
    };
    notesItems.push(note);
    renderTableHeader();
    renderNote(notesItems);
    renderSummaryTable();
    toggleModal();
  }
}

// Function to handle the click on the notes table
function onNotesTable(e) {
  const itemKey = e.target.parentNode.dataset.key;
  if (e.target.classList.contains("js-delete-note")) {
    return onDeleteNote(itemKey);
  }
  if (e.target.classList.contains("js-edit-note")) {
    return onEditNote(itemKey);
  }
  if (e.target.classList.contains("js-archive-note")) {
    return archiveNote(itemKey);
  }
}

// Function to handle the click on the delete note button
function onDeleteNote(id) {
  const index = notesItems.findIndex((note) => note.id === Number(id));
  notesItems.splice(index, 1);
  renderTableHeader();
  renderNote(notesItems);
  renderSummaryTable();
}

// Function to handle the click on the edit note button
function onEditNote(id) {
  const noteIndex = notesItems.findIndex((note) => note.id === Number(id));

  if (noteIndex !== -1) {
    const editedNote = { ...notesItems[noteIndex] };
    formEditNote(editedNote);
    const formEdit = document.querySelector(".js-form-edit-note");
    formEdit.addEventListener("submit", onFormEditNoteSubmit);
  }
}

// Function to handle the form submission when editing a note
function onFormEditNoteSubmit(e) {
  e.preventDefault();
  if (e.target.classList.contains("js-form-edit-note")) {
    const {
      elements: { name, content, category },
    } = e.currentTarget;
    if (!name.value || !content.value || !category.value) {
      alert("Please fill in all fields before editing the note.");
      return;
    }
    const noteId = e.currentTarget.id;
    const noteIndex = notesItems.findIndex(
      (note) => note.id === Number(noteId)
    );

    if (noteIndex !== -1) {
      const editedNote = { ...notesItems[noteIndex] };
      editedNote.name = name.value;
      const extractedDates = extractDates(content.value);
      editedNote.content = content.value;
      editedNote.category = category.value;
      editedNote.dates = `${editedNote.dates} , ${extractedDates}`;

      notesItems[noteIndex] = editedNote;
      renderTableHeader();
      renderNote(notesItems);
      renderSummaryTable();
      toggleModal();
    }
  }
}

// Function to handle the click on the summary notes table
function onSummaryNotesTable(e) {
  const itemKey = e.target.parentNode.dataset.key;
  if (e.target.classList.contains("js-unarchive-modal-note")) {
    return onUnarchiveModal(itemKey);
  }
}

// Function to render the list of notes in the main table
function renderNote(notes) {
  const markup = notes
    .filter((note) => note.archived !== true)
    .map(({ id, name, created, category, content, dates }) => {
      return `<li class="table-row">
        <div>${name}</div>
        <div>${created}</div>
        <div>${category}</div>
        <div>${content}</div>
        <div>${dates}</div>
        <div class="wrapper-btn" data-key=${id}>
        <button class="btn-note edit-note js-edit-note"><svg  width="18px" height="18px">
            <use  href="./images/sprite.svg#icon-pencil"></use>
          </svg>
          </button>
          <button class="btn-note archive-note js-archive-note"><svg  width="18px" height="18px">
            <use  href="./images/sprite.svg#icon-box-add"></use>
          </svg>
          </button>
          <button class="btn-note delete-note js-delete-note">
          <svg   width="18px" height="18px">
            <use  href="./images/sprite.svg#icon-bin2"></use>
          </svg>
          </button>
          </div>
      </li>`;
    })
    .join("");
  return refs.notesTable.insertAdjacentHTML("beforeend", markup);
}

// Function to render the form for editing a note
function formEditNote(note) {
  const { id, name, category, content } = note;

  const markup = `
  
  <form id="${id}" class="form js-form-edit-note">
          <label for="name">Name<input id="name" type="text" name="name" value="${name}" /></label>
            
            <label for="category">Category<select id="category" name="category" value="${category}" required>
              <option value="Task">Task</option>
              <option value="Random Thought">Random Thought</option>
              <option value="Idea">Idea</option>
            </select></label>
            
            <label for="content">Content<input id="content" type="text" name="content" value="${content}" /></label>
          <button   class="create-note" data-btn-edit-note>Create Note</button>
        </form>
        `;
  refs.modalContent.innerHTML = markup;

  toggleModal();
}

// Function to render the summary table
function renderSummaryTable() {
  const categories = ["Task", "Random Thought", "Idea"];
  refs.summaryNotesTable.innerHTML = `
    <li class="table-header">
      <div>Category</div>
      <div>Active</div>
      <div>Archived</div>
    </li>
    ${categories.map(renderSummaryRow).join("")}
  `;
}

// Function to render a row in the summary table
function renderSummaryRow(category) {
  const activeCount = notesItems.filter(
    (note) => note.category === category && !note.archived
  ).length;
  const archivedCount = notesItems.filter(
    (note) => note.category === category && note.archived
  ).length;

  if (activeCount === 0 && archivedCount === 0) {
    return;
  }
  return `
    <li class="table-row">
      <div>${category}</div>
      <div>${activeCount}</div>
      <div>${archivedCount} ${renderUnarchiveButton(
    archivedCount,
    category
  )} </div>
      
    </li>
  `;
}

// Function to render the unarchive button in the summary table
function renderUnarchiveButton(archivedCount, category) {
  if (archivedCount === 0) {
    return "";
  }

  const markup = `<span data-key="${category}"><button class="btn-note unarchive-note js-unarchive-modal-note" ><svg class="js-unarchive-modal-note" width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-remove"></use>
          </svg>
          </button></span>`;

  return markup;
}

// Function to handle the unarchive note action
function onUnarchiveModal(category) {
  renderListArchivedNote(category);
  toggleModal();
  const tableArchivedNotes = document.querySelector(
    "[data-table-archived-notes]"
  );
  tableArchivedNotes.addEventListener("click", onArchivedTable);
}

// Function to handle the click on the archived table
function onArchivedTable(e) {
  const itemKey = e.target.parentNode.dataset.key;
  if (e.target.classList.contains("js-unarchive-note")) {
    return unarchiveNote(itemKey);
  }
}

// Function to render the list of archived notes
function renderListArchivedNote(category) {
  const archivedNotes = notesItems.filter(
    (note) => note.category === category && note.archived
  );
  const markup = `<ul data-table-archived-notes>
      <li class="table-header">
        <div>Name</div>
        <div>Created</div>
        <div>Category</div>
        <div>Content</div>
        <div>Dates</div>
        <div>
          <svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-remove"></use>
          </svg>
        </div>
      </li>
      ${archivedNotes.map(renderArchivedRow).join("")}
    </ul>`;

  return (refs.modalContent.innerHTML = markup);
}

// Function to render a row in the archived notes table
function renderArchivedRow(note) {
  const { id, name, created, category, content, dates } = note;
  return `<li class="table-row">
            <div>${name}</div>
            <div>${created}</div>
            <div>${category}</div>
            <div>${content}</div>
            <div>${dates}</div>
            <div data-key=${id}>
              <button class="btn-note unarchive-note js-unarchive-note">
                <svg class="js-unarchive-note" width="18px" height="18px">
                  <use href="./images/sprite.svg#icon-box-remove"></use>
                </svg>
              </button>
            </div>
          </li>`;
}

// Function to archive a note
function archiveNote(id) {
  const noteIndex = notesItems.findIndex((note) => note.id === Number(id));

  if (noteIndex !== -1) {
    notesItems[noteIndex].archived = true;
    renderTableHeader();
    renderNote(notesItems);
    renderSummaryTable();
  }
}

// Function to unarchive a note
function unarchiveNote(id) {
  const noteIndex = notesItems.findIndex((note) => note.id === Number(id));
  if (noteIndex !== -1) {
    notesItems[noteIndex].archived = false;
    renderTableHeader();
    renderNote(notesItems);
    renderSummaryTable();
    toggleModal();
  }
}

// Function to initialize the application when the DOM is loaded
function init() {
  renderTableHeader();
  renderNote(notesItems);
  renderSummaryTable();
}

document.addEventListener("DOMContentLoaded", init);
