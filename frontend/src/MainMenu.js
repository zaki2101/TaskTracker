// 
import React, { useState } from 'react';
import Managers_table from './Managers_table';
import Tasks_table from './Tasks_table';
import Firms_table from './Firms_table';
import Login from './Login';

function MainMenu({ onSelect}) {

  // при нажатии кнопки вызывается функция onSelect из TaskTracker
  return (
    <div>
      <h3>Главное меню</h3>
      <button onClick={() => onSelect('screen_managers')}>Справочник менеджеров</button>
      <button onClick={() => onSelect('screen_tasks')}>Справочник задач</button>
      <button onClick={() => onSelect('screen_firms')}>Обновление - реестр</button>
    </div>
  );
}

export default MainMenu;


