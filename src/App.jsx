import React, { useEffect, useState } from 'react';
import axios from 'axios';

// axios.defaults.headers.post['Content-Type'] ='application/json';
// axios.defaults.withCredentials = true

const config = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  }
}

axios.get('https://crud-backend-c6ae58cf7bc6.herokuapp.com/')
.then(res => console.log(res))
.catch(err => console.log(err))

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://crud-backend-c6ae58cf7bc6.herokuapp.com/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!taskInput) return;

    try {
      const response = await axios.post('https://crud-backend-c6ae58cf7bc6.herokuapp.com/api/tasks', { task: taskInput }, config);
      if (response.status === 201) {
        setTaskInput('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    console.log(taskId)
    try {
      await axios.put(`https://crud-backend-c6ae58cf7bc6.herokuapp.com/api/tasks/${taskId.$oid}`, { task: updatedTask }, config);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://crud-backend-c6ae58cf7bc6.herokuapp.com/api/tasks/${taskId.$oid}`, config);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  function CloseInput(){
    document.getElementById('edit-box').style.display = 'none';
  }

  return (
    <div className="App">
      <h1>To-Do List</h1>

      <div className="todo-container">
        <form className="todo-input" onSubmit={handleSubmit}>
          <input
            type="text"
            id="task-input"
            placeholder="Enter a task"
            value={taskInput}
            onChange={handleTaskInputChange}
          />
          <button type="submit">Add Task</button>
        </form>
        <ul id="task-list">
          {tasks.map((task) => (
            <li key={task._id}>
              <input
                type="text"
                value={task.task}
                onChange={(e) => updateTask(task._id, e.target.value)}
              />
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;