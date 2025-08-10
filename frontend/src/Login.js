// Авторизация

import React, { useState } from 'react';

/* Объявление функционального компонента Login
"что проиходит на экране входа"
он принимает функцию onLogin, она будет вызвана при успешном входе
*/
function Login({ onLogin }) {
  const [username, setUsername] = useState(''); //  хранит введённое имя пользователя
  const [error, setError] = useState('');  //  хранит сообщение об ошибке

  // Объявление функции-обработчика нажатия клавиш в поле ввода. Она асинхронная (async),  потому что внутри будет запрос к серверу
  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && username.trim() !== '') { // нажата клавиша Enter
      try {
        const response = await fetch('http://localhost:5001/api/login', {  // fetch — функция для отправки запроса; await - дождаться ответа
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // указывает серверу, что данные в теле запроса — JSON
          body: JSON.stringify({ username: username.trim() }),  // тело запроса
          credentials: 'include'  // необходимо для разрешения передавать cookies
        });

        const result = await response.json();  // преобразование ответа из JSON в объект JavaScript

        if (result.success) {  // вход успешный
          setError('');  // обнуление сообщения об ошибке
          onLogin(username.trim());  // вызов функции onLogin с передачей ей логина
        } else {
          setError(result.error || 'Неверный логин');
        }
      } catch (err) {   // в случае како-то ошибки
        setError('Ошибка соединения с сервером');
      }
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
      {error && <div style={{ color: 'red', marginTop: 5}}>{error}</div>}
    </div>
  );
}

export default Login;

/* 
* Пользователь что-то вводит — срабатывает onChange, обновляя состояние username
* Пользователь нажимает клавишу — срабатывает onKeyDown и вызывается функция handleKeyDown
* В handleKeyDown срабатывает проверка и отправка запроса
* Если нажата клавиша Enter и логин не пустой — вызывается fetch (встроенная в браузер функция, которая посылает HTTP-запрос на сервер)
* Браузер отправляет HTTP POST запрос серверу с введенным логином
* Запрос уходит на backend
В backend.py 
- Сервер принимает запрос, и Flask обрабатывает его
- Запускает функцию login()
- request.get_json() — берет тело запроса и превращает JSON в словарь Python (Теперь data — это Python-словарь {'username': 'введённый_логин'})
- Из него берём значение по ключу username
*/




