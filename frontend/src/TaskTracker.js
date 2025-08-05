// Главный компонент
// Навигация - В нем определяется куда я пойду (меню, менеджеры, задачи, реестр и т.д)
import React, { useState } from 'react';
import MainMenu from './MainMenu';  
import Managers_table from './Managers_table';
import Tasks_table from './Tasks_table';
import Firms_table from './Firms_table';
import Login from './Login';


function TaskTracker() {
  const [view, setView] = useState('screen_login') // начальное состояние
  // состояние, которое хранит, что показывать - переключатель экранов:
  // 'screen_menu' – показываем главное меню
  // 'screen_managers' – показываем таблицу менеджеров
  // 'screen_tasks' – показываем таблицу задач
  // onSelect={ setView } - выбор экрана

    // Функция-обработчик успешного входа
  const handleLogin = (username) => {
    // переключаемся в меню
    setView('screen_menu');
  };

  return (
    <div>
      {view === 'screen_login' && <Login onLogin={ handleLogin } />} 
      {view === 'screen_menu' && <MainMenu onSelect={ setView } />} 
      {view === 'screen_managers' && <Managers_table onBack={() => setView('screen_menu')} />}
      {view === 'screen_tasks' && <Tasks_table onBack={() => setView('screen_menu')} />}
      {view === 'screen_firms' && <Firms_table onBack={() => setView('screen_menu')} />}
    </div>
  );
}

export default TaskTracker;

