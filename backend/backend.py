
from flask import Flask  # основной класс для создания веб-приложения на Python
from flask import jsonify  # функция для преобразования данных Python в JSON
from flask_cors import CORS
#import sqlite3  # библиотека для работы с SQLite базой данных

# библиотека для работы с PostgreSQL
import psycopg2
from psycopg2 import sql  # основной драйвер Python для PostgreSQL

# request - предоставляет доступ к данным, которые пользователь отправляет на сервер
from flask import request  # используется для получения данных из форм
import os

app = Flask(__name__)  # создание экземпляра приложения Flask
CORS(app)  # Разрешаем CORS для всех маршрутов и доменов

# словарь с параметрами подключения
POSTGRESQL_CONFIG = {
    'dbname': 'task_tracker',       # имя БД
    'user': 'zakimatova',           # пользователь
    'password': 'zakimatova1971!',
    'host': 'localhost',
    'port': 5432                    # по умолчанию
}


# СОЗДАНИЕ всех БД
def init_db():
    conn = psycopg2.connect(**POSTGRESQL_CONFIG) # conn — объект соединения с PostgreSQL    
    cursor = conn.cursor()
    # conn.cursor() ты получаешь курсор, с помощью которого можно выполнять SQL-запросы

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS managers (
            id SERIAL PRIMARY KEY,
            manager TEXT NOT NULL UNIQUE,
            phone TEXT,
            email TEXT NOT NULL,
            login TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            task_name TEXT NOT NULL UNIQUE,
            col_1 TEXT,
            col_2 TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS firms (
            id SERIAL PRIMARY KEY,
            reg TEXT NOT NULL UNIQUE,       
            firm_name TEXT NOT NULL,
            cod_dc TEXT NOT NULL CHECK (cod_dc ~ '^[0-9]*$'),
            it_manager TEXT NOT NULL,
            serv_manager TEXT NOT NULL,      
            update_data TEXT,         
            problem_1 TEXT,
            description_1 TEXT,
            problem_2 TEXT,
            description_2 TEXT,    
            problem_3 TEXT,
            description_3 TEXT,  
            additional_information TEXT,
            comment_1 TEXT,   
            comment_2 TEXT               
        )
    ''')

    conn.commit()
    cursor.close()
    conn.close()


# определение маршрута (endpoint) для вывода всех записей таблицы МЕНЕДЖЕРЫ
@app.route('/api/managers')
def get_managers():
    table_name = 'managers'
    return jsonify(get_all_records(table_name))  # возвращение данных клиенту в формате JSON


# определение маршрута для вывода всех записей таблицы ЗАДАЧИ
@app.route('/api/tasks')
def get_tasks():
    table_name = 'tasks'
    return jsonify(get_all_records(table_name))  # возвращение данных клиенту в формате JSON


# определение маршрута для вывода всех записей таблицы ФИРМЫ
@app.route('/api/firms')
def get_firms():
    table_name = 'firms'
    return jsonify(get_all_records(table_name))  # возвращение данных клиенту в формате JSON


def get_all_records(table_name):  # получение всех записей из таблицы
    conn = psycopg2.connect(**POSTGRESQL_CONFIG) # объект соединения с базой данных. Пока он открыт можем делать SQL-запросы
    cursor = conn.cursor()  # специальный объект для отправления SQL-запросы к БД и получения результатов
    request_str = f'SELECT * FROM {table_name}'
    cursor.execute(request_str)  # выбираем все записи, * - все столбцы

    rows = cursor.fetchall()  # Все строки из результата запроса загружаются в память в виде списка кортежей

    #  Получаем имена столбцов 
    # cursor.description — это список описаний столбцов (имён и типов)
    # desc[0] - имя столбца
    colnames = [desc[0] for desc in cursor.description] # cursor.description — это список описаний столбцов (имён и типов

    #  Формирование списка словарей для удобного преобразования в JSON
    list_table = []
    for row in rows:
        line = dict(zip(colnames, row)) # быстрое преобразование строки в словарь
        list_table.append(line)

    cursor.close()
    conn.close()
    return list_table


# Удаление записи

@app.route('/api/delete_manager/<int:id>', methods=['DELETE'])
def delete_manager(id):
    return delete_record('managers', id)


@app.route('/api/delete_task/<int:id>', methods=['DELETE'])
def delete_task(id):
    return delete_record('tasks', id)


@app.route('/api/delete_firm/<int:id>', methods=['DELETE'])
def delete_firm(id):
    return delete_record('firms', id)


def delete_record(table_name, id):
    conn = psycopg2.connect(**POSTGRESQL_CONFIG)
    cursor = conn.cursor()
    request_str = f'DELETE FROM {table_name} WHERE id = %s'
    cursor.execute(request_str, (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Запись удалена'}), 200


# Добавление записи

@app.route('/api/add_firm', methods=['POST'])
def add_firm():
    request_str = '''
        INSERT INTO firms (
            reg, firm_name, cod_dc, it_manager, serv_manager,
            additional_information, comment_1
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    '''
    data = request.get_json()
    print(">>> Полученные данные:", data)
    values = (
        data['reg'],
        data['firm_name'],
        data['cod_dc'],
        data['it_manager'],
        data['serv_manager'],
        data.get('additional_information', ''),
        data.get('comment_1', '')
    )
    return add_record(request_str, values)


@app.route('/api/add_manager', methods=['POST'])
def add_manager():
    request_str = '''
        INSERT INTO managers (manager, phone, email, login, role)
        VALUES (%s, %s, %s, %s, %s)
    '''
    data = request.get_json()
    values = (
        data['manager'],
        data['phone'],
        data['email'],
        data['login'],
        data['role']
    )
    return add_record(request_str, values)


@app.route('/api/add_task', methods=['POST'])
def add_task():
    request_str = '''
        INSERT INTO tasks (task_name, col_1, col_2)
        VALUES (%s, %s, %s)
    '''
    data = request.get_json()
    values = (
        data['task_name'],
        data['col_1'],
        data['col_2'],
    )
    return add_record(request_str, values)


def add_record(request_str, values):    
    conn = psycopg2.connect(**POSTGRESQL_CONFIG)
    cursor = conn.cursor()
    cursor.execute(request_str, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Запись добавлена'}), 200


# Корректировка ячейки таблицы
@app.route('/api/update_cell', methods=['POST', 'PATCH'])
def update_cell():
    # JSON-объект, который приходит с фронтенда (из React) в теле POST-запроса. Он преобразуется в словарь
    data = request.get_json()  
    
    table_name = data['table']
    field_name = data['field']
    new_value = data['value']
    record_id = data['id']

    return update_cell_value(table_name, field_name, new_value, record_id)


def update_cell_value(table_name, field_name, new_value, record_id):
    conn = psycopg2.connect(**POSTGRESQL_CONFIG)
    cursor = conn.cursor()

    query = f"UPDATE {table_name} SET {field_name} = %s WHERE id = %s"

    try:
        cursor.execute(query, (new_value, record_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Ячейка обновлена'}), 200


# Запуск приложения, если файл запущен напрямую
if __name__ == '__main__':
    init_db()  # создаем таблицу, если ее нет
    app.run(debug=True, host='127.0.0.1', port=5001)






