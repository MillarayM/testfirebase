const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';


/// crear
const saveTask = (title, description) =>
  db.collection("tasks").doc().set({
    title,
    description,
  });

// leer

const getTasks = () => db.collection("tasks").get();
const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

// delete

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

// editar
const getTask = (id) => db.collection("tasks").doc(id).get();
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

// para mostrar en pantalla
window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
      <h3 class="h5">${task.title}</h3>
      <p>${task.description}</p>
      <div>
        <button class="btn btn-primary btn-delete" data-id="${doc.id}">
          🗑 Delete
        </button>
        <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
          🖉 Edit
        </button>
      </div>
    </div>`;
      // para borrar
      const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async (e) => {
          console.log(e.target.dataset.id);
          try {
            await deleteTask(e.target.dataset.id);
          } catch (error) {
            console.log(error);
          }
        })
      );


      // para editar
      const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          try {
            const doc = await getTask(e.target.dataset.id);
            const task = doc.data();
            taskForm["task-title"].value = task.title;
            taskForm["task-description"].value = task.description;
  
            editStatus = true;
            id = doc.id;
            taskForm["btn-task-form"].innerText = "Update";
  
          } catch (error) {
            console.log(error);
          }
        });
      });
      // fin editar

    });
  });
});

// para crear registros


taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
  
    try {
      if (!editStatus) {
        await saveTask(title.value, description.value);
      } else {
        await updateTask(id, {
          title: title.value,
          description: description.value,
        })
  
        editStatus = false;
        id = '';
        taskForm['btn-task-form'].innerText = 'Save';
      }
  
      taskForm.reset();
      title.focus();
    } catch (error) {
      console.log(error);
    }
  });
  


