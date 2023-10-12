import { useState } from "react";

export function Main() {
  const [todoItem, setTodoItem] = useState("");
  const [todos, setTodos] = useState([]);
  const [deadline, setDeadline] = useState("");
  const date = new Date();

  function setTime(target) {
    const selectedTime = target;
    const hour = selectedTime.split(":")[0];
    const minutes = selectedTime.split(":")[1];

    setDeadline(() => [
      {
        hour,
        minutes,
      },
    ]);
  }

  function addTodo() {
    if (!deadline) return;

    const currentHour = date.getHours();
    const currentMinutes = date.getMinutes();

    // ? erst beim zweiten mal wird setRemaining... gecallt

    const remainingHours = parseInt(deadline[0].hour) - currentHour;
    const remainingMinutes = parseInt(deadline[0].minutes) - currentMinutes;

    if (remainingHours < 0) {
      // invalid time selected
      return;
    }

    if (!todoItem) return;

    const item = {
      id: Math.floor(Math.random() * 5000),
      value: todoItem,
      checked: false,
      remainingHours,
      remainingMinutes,
    };

    setTodos((oldList) => [...oldList, item]);
    setTodoItem("");
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }

        return todo;
      });
    });
  }

  function deleteTodo(id) {
    const newArray = todos.filter((todo) => todo.id !== id);
    setTodos(newArray);
  }

  return (
    <main>
      <div className="input-form flex">
        <div className="input-box">
          <input
            type="text"
            placeholder="Create new todo"
            value={todoItem}
            onChange={(e) => setTodoItem(() => e.target.value)}
          />
          <input
            type="time"
            className="fa-calender"
            onChange={(e) => setTime(e.target.value)}></input>
        </div>
        <button
          className="add"
          onClick={() => addTodo()}>
          Add todo
        </button>
      </div>
      <div className="todo-list">
        <ul className="todos">
          {todos.map((todo) => {
            return (
              <li
                className="todo-item flex"
                key={todo.id}>
                <div className="flex">
                  <input
                    type="checkbox"
                    className="checkbox ui-checkbox"
                    onClick={(e) => toggleTodo(todo.id, e.target.checked)}
                  />
                  <p className="todo-text">{todo.value}</p>
                </div>
                <div className="flex">
                  <p className="time">
                    <span>
                      {todo.remainingMinutes < 0
                        ? todo.remainingHours - 1
                        : todo.remainingHours}
                      h
                    </span>
                    <span>
                      {todo.remainingMinutes < 0
                        ? todo.remainingMinutes + 60
                        : todo.remainingMinutes}
                      min
                    </span>
                  </p>
                  <button onClick={() => deleteTodo(todo.id)}>
                    <i className="fa-solid fa-x xmark"></i>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
