'''
========================
терминал
========================
>  cd /Users/olgazakimatova/REACT/my-project/frontend
>  cd /Users/olgazakimatova/REACT/my-project/backend

> backend olgazakimatova$ source .venv/bin/activate  // активация виртуальной среды
> (.venv) MacBook-Air:backend olgazakimatova$ python3 backend.py // запуск сервера (backend.py)
> (.venv) MacBook-Air:frontend olgazakimatova$ npm start // запуск приложения 


> npm install react-data-grid
> npm start  // запуск React 
> npm view react-data-grid version
> npm install ag-grid-community ag-grid-react
> npm install @ag-grid-community/all-modules




flask-cors - помогает настроить CORS (Cross-Origin Resource Sharing), чтобы 
            разрешить запросы с твоего React (localhost:3000) к Flask (localhost:5001)
> (.venv) MacBook-Air:backend olgazakimatova$ pip install flask-cors

> npm start   
- запуска dev-сервера React
- запуск в терминале, находясь в папке с твоим React-проектом — там, где лежит файл package.json
- запускается локальный сервер разработки (development server), обычно он слушает порт 3000
этот сервер берёт все  React-компоненты (включая App.js), собирает их через сборщик 
(чаще всего это Webpack или Vite), и преобразует код в обычный JavaScript, понятный браузеру.
CTRL + C - остановка
'''

"""
Проект создан с помощью Create React App (CRA)
> npx create-react-app frontend

======================
SQL - запросы
========================
SELECT * FROM bd_name - выбрать все записи


=================================
PostgreSQL

> psql --version // проверка установлен PostgreSQL или нет (путь не важен)
установка через Homebrew
> brew --version // роверка установлен Homebrew или нет
> brew install postgresql  // установка PostgreSQL
// после установки необходимо запустить PostgreSQL как сервис
// Чтобы PostgreSQL запускался автоматически при каждом включении компьютера:
> brew services start postgresql@14
> psql postgres  // Проверим, что всё работает после запуска (ответ  postgres=#

// Следующий шаг — создадим базу данных и пользователя для твоего приложения
postgres=# CREATE DATABASE task_tracker; создадим БД  для  приложения
postgres=# CREATE USER zakimatova WITH PASSWORD 'zakimatova1971!';  создадим пользователя
postgres=# GRANT ALL PRIVILEGES ON DATABASE task_tracker TO zakimatova; права на эту бд
сообщение GRANT означает что все норм
postgres=# \q  - выйти из режима psql

brew services list - Проверить, запущен ли сервер PostgreSQL
ответ такой: postgresql@14 started olgazakimatova ~/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist
если нет, запустить:
brew services start postgresql



// доп библиотеки (не важно какая папка, главное активно виртуальное окружение)
> (.venv) MacBook-Air:backend olgazakimatova$ pip install psycopg2-binary

"""
