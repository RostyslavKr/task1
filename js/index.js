const refs = {
  notesTable: document.querySelector("[data-table-notes]"),
  summaryNotesTable: document.querySelector("[data-table-summary-notes]"),
  openModalBtn: document.querySelector("[data-open-modal]"),
  closeModalBtn: document.querySelector("[data-close-modal]"),
  createNotesBtn: document.querySelector("[data-btn-create-note]"),
  modal: document.querySelector("[data-modal]"),
  modalContent: document.querySelector(".modal-content"),
};

refs.openModalBtn.addEventListener("click", onCreateNote);
refs.closeModalBtn.addEventListener("click", toggleModal);
refs.notesTable.addEventListener("click", onNotesTable);
refs.summaryNotesTable.addEventListener("click", onSummaryNotesTable);

let notesItems = [];

function toggleModal() {
  refs.modal.classList.toggle("is-hidden");
}

function onFormSubmit(e) {
  e.preventDefault();

  if (e.target.classList.contains("js-form-note")) {
    const {
      elements: { name, content, category },
    } = e.currentTarget;
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
    renderNote(note);
    renderSummaryTable();
  }
}
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
function renderNote(note) {
  const { id, name, created, category, content, dates } = note;
  const markup = `<li class="table-row">
        <div>${name}</div>
        <div>${created}</div>
        <div>${category}</div>
        <div>${content}</div>
        <div>${dates}</div>
        <div class="wrapper-btn" data-key=${id}>
        <button class="btn-note edit-note js-edit-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-pencil"></use>
          </svg>
          </button>
          <button class="btn-note archive-note js-archive-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-add"></use>
          </svg>
          </button>
          <button class="btn-note delete-note js-delete-note">
          <svg  width="18px" height="18px">
            <use href="./images/sprite.svg#icon-bin2"></use>
          </svg>
          </button>
          </div>
      </li>`;
  refs.notesTable.insertAdjacentHTML("beforeend", markup);
  toggleModal();
}

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
function onCreateNote() {
  formCreateNote();
  toggleModal();
  const formCreate = document.querySelector(".js-form-note");
  formCreate.addEventListener("submit", onFormSubmit);
}
function onSummaryNotesTable(e) {
  const itemKey = e.target.parentNode.dataset.key;
  if (e.target.classList.contains("js-unarchive-modal-note")) {
    return onUnarchiveModal(itemKey);
  }
}
function onDeleteNote(id) {
  const index = notesItems.findIndex((note) => note.id === Number(id));
  notesItems.splice(index, 1);
  renderTableHeader();
  renderNotesAfterChanged(notesItems);
  renderSummaryTable();
}
function extractDates(content) {
  const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/g;
  return content.match(dateRegex) || [];
}
function onEditNote(id) {
  const noteIndex = notesItems.findIndex((note) => note.id === Number(id));

  if (noteIndex !== -1) {
    const editedNote = { ...notesItems[noteIndex] };
    formEditNote(editedNote);
    const formEdit = document.querySelector(".js-form-edit-note");
    formEdit.addEventListener("submit", onFormEditNoteSubmit);
  }
}

function onFormEditNoteSubmit(e) {
  e.preventDefault();
  if (e.target.classList.contains("js-form-edit-note")) {
    const {
      elements: { name, content, category },
    } = e.currentTarget;
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
      renderNotesAfterChanged(notesItems);
      renderSummaryTable();
      toggleModal();
    }
  }
}
function renderNotesAfterChanged(notes) {
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
        <button class="btn-note edit-note js-edit-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-pencil"></use>
          </svg>
          </button>
          <button class="btn-note archive-note js-archive-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-add"></use>
          </svg>
          </button>
          <button class="btn-note delete-note js-delete-note">
          <svg  width="18px" height="18px">
            <use href="./images/sprite.svg#icon-bin2"></use>
          </svg>
          </button>
          </div>
      </li>`;
    })
    .join("");
  return refs.notesTable.insertAdjacentHTML("beforeend", markup);
}

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

function renderUnarchiveButton(archivedCount, category) {
  if (archivedCount === 0) {
    return "";
  }

  const markup = `<span data-key="${category}"><button class="btn-note unarchive-note js-unarchive-modal-note" ><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-remove"></use>
          </svg>
          </button></span>`;

  return markup;
}
function onUnarchiveModal(category) {
  renderListArchivedNote(category);
  toggleModal();
  const tableArchivedNotes = document.querySelector(
    "[data-table-archived-notes]"
  );
  tableArchivedNotes.addEventListener("click", onArchivedTable);
}

function onArchivedTable(e) {
  const itemKey = e.target.parentNode.dataset.key;
  if (e.target.classList.contains("js-unarchive-note")) {
    return unarchiveNote(itemKey);
  }
}
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
                <svg width="18px" height="18px">
                  <use href="./images/sprite.svg#icon-box-remove"></use>
                </svg>
              </button>
            </div>
          </li>`;
}
function archiveNote(id) {
  const noteIndex = notesItems.findIndex((note) => note.id === Number(id));

  if (noteIndex !== -1) {
    notesItems[noteIndex].archived = true;
    renderTableHeader();
    renderNotesAfterChanged(notesItems);
    renderSummaryTable();
  }
}

function unarchiveNote(id) {
  const noteIndex = notesItems.findIndex((note) => note.id === Number(id));
  if (noteIndex !== -1) {
    notesItems[noteIndex].archived = false;
    renderTableHeader();
    renderNotesAfterChanged(notesItems);
    renderSummaryTable();
    toggleModal();
  }
}
