// Авторизация

import React, { useState } from 'react';

/* Объявление функционального компонента Login
"что проиходит на экране входа"
он принимает функцию onLogin, она будет вызвана при успешном входе
*/
function Login({ onLogin }) {
  const [username, setUsername] = useState(''); //  хранит введённое имя пользователя

  /* если нажата клавиша Enter и в поле есть непустое значение (удаляем пробелы с помощью trim()), 
  то вызываем функцию onLogin, передавая туда введённое имя без пробелов по краям
  */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && username.trim() !== '') {
      onLogin(username.trim());
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <label>
        Вход в систему:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ marginLeft: 10 }}
          placeholder="login"
        />
      </label>
    </div>
  );
}

export default Login;


/*
1. TaskTracker загружается	view = 'screen_login', показывается компонент Login
2. Ввод имени	Пользователь вводит имя и нажимает Enter
Когда пользователь вводит имя → мы отправляем запрос на сервер → сервер проверяет, 
есть ли это имя в таблице managers → если есть, впускаем в главное меню, если нет 
— показываем сообщение об ошибке
3. Login вызывает onLogin(username)	Это запускает handleLogin из TaskTracker
4. handleLogin меняет view	view становится 'screen_menu'
5. Показывается главное меню	Пользователь авторизован
*/