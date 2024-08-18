// State of the app

const todos = ['Buy milk', 'Clean the house', 'Go to the gym'];

// HTML element references

const addTodoInput = document.getElementById('todo-input');
const addTodoButton = document.getElementById('add-todo-btn');
const todosList = document.getElementById('todos-list');

// Initialize the view

for (const todo of todos) {
	todosList.append(renderTodoInReadMode(todo));
}

addTodoInput.addEventListener('input', () => {
	addTodoButton.disabled = addTodoInput.value.length < 3 || todos.includes(addTodoInput.value);
})

addTodoInput.addEventListener('keydown', ({ key }) => {
	if (key === 'Enter' && addTodoInput.value.length >= 3 && !todos.includes(addTodoInput.value)) {
		addTodo();
	}
})

addTodoButton.addEventListener('click', addTodo);

// Functions

function renderTodoInReadMode(todo) {
	const li = document.createElement('li');
	li.className = 'todos-list__item todos-list__item--read';
	const span = document.createElement('span');

	span.textContent = todo;
	span.addEventListener('dblclick', () => {
		const idx = todos.indexOf(todo);
		todosList.replaceChild(renderTodoInEditMode(todo), todosList.childNodes[idx]);
	})

	li.append(span);

	const btnsWrapper = document.createElement('div');
	btnsWrapper.className = 'todos-list__item__buttons';

	const buttonRemove = document.createElement('button');
	buttonRemove.textContent = 'X';
	buttonRemove.addEventListener('click', () => {
		const idx = todos.indexOf(todo);
		removeTodo(idx);
	})

	btnsWrapper.append(buttonRemove);

	const buttonDone = document.createElement('button');
	buttonDone.textContent = 'Done';
	buttonDone.addEventListener('click', () => {
		const idx = todos.indexOf(todo);
		crossTodo(idx);
	})

	btnsWrapper.append(buttonDone);

	li.append(btnsWrapper);

	return li;
}

function renderTodoInEditMode(todo) {
	const li = document.createElement('li');
	li.className = 'todos-list__item todos-list__item--edit';
	const input = document.createElement('input');
	input.type = 'text';
	input.value = todo;

	li.append(input);

	const btnsWrapper = document.createElement('div');
	btnsWrapper.className = 'todos-list__item__buttons';

	const saveBtn = document.createElement('button');
	saveBtn.textContent = 'Save';
	saveBtn.addEventListener('click', () => {
		const idx = todos.indexOf(todo);
		updateTodo(idx, input.value);
	})

	btnsWrapper.append(saveBtn);

	const cancelBtn = document.createElement('button');
	cancelBtn.textContent = 'Cancel';
	cancelBtn.addEventListener('click', () => {
		const idx = todos.indexOf(todo);
		todosList.replaceChild(renderTodoInReadMode(todo), todosList.childNodes[idx]);
	})

	btnsWrapper.append(cancelBtn);

	li.append(btnsWrapper);

	return li;
}

function addTodo() {
	const description = addTodoInput.value;

	todos.push(description);
	const todo = renderTodoInReadMode(description);
	todosList.append(todo);

	addTodoInput.value = '';
	addTodoButton.disabled = true;

	let utterance = new SpeechSynthesisUtterance(description);
	speechSynthesis.speak(utterance);
}

function removeTodo(index) {
	todos.splice(index, 1);
	todosList.childNodes[index].remove();
}

function updateTodo(index, description) {
	todos[index] = description;
	const todo = renderTodoInReadMode(description);
	todosList.replaceChild(todo, todosList.childNodes[index]);
}

function crossTodo(index) {
	todosList.childNodes[index].classList.toggle('todos-list__item--done');
}
