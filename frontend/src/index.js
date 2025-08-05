/*
index.js — техническая точка старта (запускает всё).
React «вставляет»  приложение (TaskTracker) в HTML-страницу (в элемент с id='root')
TaskTracker.js — основной компонент, логический корень приложения (описывает, что показывать).
Дальше  MainMenu.js, ManagersTable.js и т.д.
*/


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import Managers_table from './Managers_table';
import TaskTracker from './TaskTracker';  // импортируем главный компонент приложения
import reportWebVitals from './reportWebVitals'; // анализ производительности (не обязательно)

// Создание корня и рендер
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskTracker />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();





/////////
