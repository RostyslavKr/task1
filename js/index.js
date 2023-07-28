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
  const markup = `<tr>
        <td>${name}</td>
        <td>${created}</td>
        <td>${category}</td>
        <td>${content}</td>
        <td>${dates}</td>
        <td data-key=${id}>
        <button class="js-edit-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-pencil"></use>
          </svg>
          </button>
          <button class="js-archive-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-add"></use>
          </svg>
          </button>
          <button class="js-delete-note">
          <svg  width="18px" height="18px">
            <use href="./images/sprite.svg#icon-bin2"></use>
          </svg>
          </button>
          </td>
      </tr>`;
  refs.notesTable.insertAdjacentHTML("beforeend", markup);
  toggleModal();
}

function renderTableHeader() {
  const markup = `<tr>
        <th>Name</th>
        <th>Created</th>
        <th>Category</th>
        <th>Content</th>
        <th>Dates</th>
        <th>
          <svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-add"></use>
          </svg>
          <svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-bin2"></use>
          </svg>
        </th>
      </tr>`;
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
      return `<tr>
        <td>${name}</td>
        <td>${created}</td>
        <td>${category}</td>
        <td>${content}</td>
        <td>${dates}</td>
        <td data-key=${id}>
        <button class="js-edit-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-pencil"></use>
          </svg>
          </button>
          <button class="js-archive-note"><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-add"></use>
          </svg>
          </button>
          <button class="js-delete-note">
          <svg  width="18px" height="18px">
            <use href="./images/sprite.svg#icon-bin2"></use>
          </svg>
          </button>
          </td>
      </tr>`;
    })
    .join("");
  return refs.notesTable.insertAdjacentHTML("beforeend", markup);
}

function formEditNote(note) {
  const { id, name, category, content } = note;

  const markup = `
  
  <form id="${id}" class="js-form-edit-note">
          <input type="text" name="name" value="${name}" />
          <select name="category" value="${category}" required>
            <option value="Task">Task</option>
            <option value="Random Thought">Random Thought</option>
            <option value="Idea">Idea</option>
          </select>
          <input type="text" name="content" value="${content}" />
          <button   class="edit" data-btn-edit-note>Create Note</button>
        </form>
        `;
  refs.modalContent.innerHTML = markup;

  toggleModal();
}
function formCreateNote() {
  const markup = `<form class="js-form-note">
            <input type="text" name="name" />
            <select name="category" required>
              <option value="Task">Task</option>
              <option value="Random Thought">Random Thought</option>
              <option value="Idea">Idea</option>
            </select>
            <input type="text" name="content" />
            <button type="submit" class="create" data-btn-create-note>
              Create Note
            </button>
          </form>`;
  return (refs.modalContent.innerHTML = markup);
}
function renderSummaryTable() {
  const categories = ["Task", "Random Thought", "Idea"];
  refs.summaryNotesTable.innerHTML = `
    <tr>
      <th>Category</th>
      <th>Active</th>
      <th>Archived</th>
    </tr>
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
    <tr>
      <td>${category}</td>
      <td>${activeCount}</td>
      <td>${archivedCount} </td>
      ${renderUnarchiveButton(archivedCount, category)}
    </tr>
  `;
}

function renderUnarchiveButton(archivedCount, category) {
  if (archivedCount === 0) {
    return "";
  }

  const markup = `<td data-key="${category}"><button  class="js-unarchive-modal-note" ><svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-remove"></use>
          </svg>
          </button></td>`;

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
  const markup = `<table data-table-archived-notes>
      <tr>
        <th>Name</th>
        <th>Created</th>
        <th>Category</th>
        <th>Content</th>
        <th>Dates</th>
        <th>
          <svg width="18px" height="18px">
            <use href="./images/sprite.svg#icon-box-remove"></use>
          </svg>
        </th>
      </tr>
      ${archivedNotes.map(renderArchivedRow).join("")}
    </table>`;

  return (refs.modalContent.innerHTML = markup);
}

function renderArchivedRow(note) {
  const { id, name, created, category, content } = note;
  return `<tr >
            <td>${name}</td>
            <td>${created}</td>
            <td>${category}</td>
            <td>${content}</td>
            <td></td>
            <td data-key=${id}>
              <button class="js-unarchive-note">
                <svg width="18px" height="18px">
                  <use href="./images/sprite.svg#icon-box-remove"></use>
                </svg>
              </button>
            </td>
          </tr>`;
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
