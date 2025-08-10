/* импорт библиотек
React — основная библиотека для работы с React-компонентами
useState — хук (функция), который позволяет хранить внутреннее состояние (список менеджеров)
useEffect — хук для выполнения «побочных эффектов», например, сетевых запросов, при загрузке страницы
*/

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';  // для работы с таблицами
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// !!! Новый импорт стилей для новой темы Quartz (Theming API)
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import './custom-grid.css';  // мой css
import translator from './labels_ru';  // Надписи на русском языке для интерфейса


// Регистрация модулей для ag-grid
ModuleRegistry.registerModules([AllCommunityModule]);


function Managers_table({ onBack }) { 
  /* функция, которая определяет React-компонент, всё, что внутри неё, описывает, 
  как компонент работает и что он будет показывать */

  const [managers, setManagers] = useState([]);  // Состояние для списка менеджеров
  /* 
    managers - хранится текущее значение 
    setManagers  - функция, чтобы это значение менять
    useState([]) — задаём начальное значение в скобках, в данном случае []
  */
 
  // Состояние для показа/скрытия формы для добавления менеджера
  const [showForm, setShowForm] = useState(false);  

  // Состояние для хранения данных новой записи
  const [newManager, setNewManager] = useState({
    manager: '',
    phone: '',
    email: '',
    login: '',
    role: ''
  });

  // Состояние для принудительного перезапроса данных (мы меняем эту переменную, и useEffect реагирует)
  const [refreshKey, setRefreshKey] = useState(0);

  // Загрузка данных с сервера
  useEffect(() => {   
    /*  отправляет HTTP-запрос на указанный адрес (в нашем случае к нашему backend, 
    который отдаёт JSON-список менеджеров)*/  
    fetch('http://localhost:5001/api/managers', {credentials: 'include'})  
    .then(response => response.json())      // когда сервер вернул ответ => преобразуем его в json 
    .then(data => { setManagers(data);  // обновляет состояние переменной managers
    })  
    .catch(error => console.error('Ошибка при загрузке менеджеров:', error));
  }, [refreshKey]); // [] - массив зависимостей, если пустой, то этот эффект должен выполниться только один раз
      // при изменении refreshKey эффект выполняктся повторно, данные загружаются заново

  // Обработчик изменения поля формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setNewManager(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик нажатия на кнопку "Сохранить"
  const handleSave = async () => {
    // Проверка что все поля заполнены (trim() - удаление пробелов в начале и конце)
    if (!newManager.manager.trim() || !newManager.login.trim() || 
        !newManager.email.trim())
        { alert('Внимание! Все поля должны быть заполнены!');
        return; // прерываем выполнение, не отправляем запрос 
        }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/add_manager', {
        method: 'POST', // добавляем данные
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json' //  отправка данных в форматем json
        }, body: JSON.stringify(newManager) // превращаем объект newManager в JSON‑строку для отправки
      });

      if (!response.ok) {
      /* обработка ответа.. response.ok — булевое значение:
                          true если код ответа от сервера 200–299.
                          false если что‑то пошло не так (например, 400, 500)
      */
        console.error('Ошибка при добавлении менеджера');
      } else {
        console.log('Менеджер успешно добавлен');
        setShowForm(false);  // скрываем форму
        setNewManager({ manager: '', phone: '', email: '', login: '', role: '' }); // очищаем поля
        setRefreshKey(old => old + 1); // изменяем ключ, чтобы useEffect снова загрузил данные
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }
    };

  // Определение колонок для AG Grid
  // field - Ключ из объекта данных (managers)
  // editable	- Разрешает редактировать
  // sortable	- Позволяет сортировать
  // filter -	Включает или выключает фильтр
  // resizable	Разрешает пользователю менять ширину этой колонки
  const columnDefs = [
    { headerName: 'Фамилия', field: 'manager', editable: true, sortable: true, resizable: true,
      valueSetter: (params) => {
      if (!params.newValue || !params.newValue.trim()) {
        alert('Поле "Фамилия" не может быть пустым!');
        return false;
      }
      params.data.manager = params.newValue;
      return true;
    },
      filter: 'agTextColumnFilter',
      filterParams: { filterOptions: ['startsWith'], suppressAndOrCondition: true } },  

    { headerName: 'Телефон', field: 'phone', editable: true, sortable: false, filter: false, resizable: true },

    { headerName: 'Email', field: 'email', editable: true, sortable: false, filter: false, resizable: true, 
      valueSetter: (params) => {
      if (!params.newValue || !params.newValue.trim()) {
        alert('Поле "email" не может быть пустым!');
        return false;
      }
      params.data.email = params.newValue;
      return true;
    },
    },

    { headerName: 'Логин', field: 'login', editable: true, sortable: false, filter: false, resizable: true,
      valueSetter: (params) => {
      if (!params.newValue || !params.newValue.trim()) {
        alert('Поле "Логин" не может быть пустым!');
        return false;
      }
      params.data.login = params.newValue;
      return true;
    },
    },

    { headerName: 'Роль', field: 'role', editable: true, sortable: true, filter: false, resizable: true,
                  cellEditor: 'agSelectCellEditor', cellEditorParams: {values: ['admin', 'user', 'it']} },

    { headerName: 'Действия', editable: false, sortable: false, filter: false, resizable: true,
      cellRenderer: (params) => (
        <button onClick={() => handleDelete(params.data.id)}>❌</button>
      )
    }
  ];

  // Удаление строки
  const handleDelete = async (id) => {
  if (!window.confirm('Вы уверены, что хотите удалить этого менеджера?')) {
    return;
  }
  try {
    const response = await fetch(`http://localhost:5001/api/delete_manager/${id}`, {
      method: 'DELETE',
      credentials: 'include'  // необходимо для разрешения передавать cookies
    });
    if (response.ok) {
      console.log('Менеджер успешно удалён');
      setRefreshKey(old => old + 1); // перезагружаем данные
    } else {
      console.error('Ошибка при удалении менеджера');
    }
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
  }
  };

    
  // Обработчик изменения ячейки
  const handleCellValueChanged = async (event) => {
      const id = event.data.id;  // Получаем ID записи, которую редактировали
      const updatedField = event.colDef.field;   // Определяем, какое именно поле обновилось
      const oldValue = event.oldValue;           // Старое значение
      let newValue = event.newValue;  // Новое значение этого поля

      if (newValue === null) {newValue = '';}

      // Проверка: если редактируются поля и новое значение пустое
      if ((updatedField === 'manager' || 
          updatedField === 'email' ||
          updatedField === 'login' ||
          updatedField === 'role'
      ) && !newValue.trim()) {
          // Откатить значение в таблице к старому
          event.node.setDataValue(updatedField, oldValue);

          // Перерисовать ячейку сразу, чтобы пользователь увидел старое значение
          event.api.refreshCells({ rowNodes: [event.node] });

          return; // Прерываем выполнение функции, не отправляем запрос
        }
        try {
          // Делаем PATCH-запрос на сервер с новым значением для частичного обновления
          const response = await fetch(`http://localhost:5001/api/update_cell`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',  // необходимо для разрешения передавать cookies
          body: JSON.stringify({ 
            table: 'managers',
            field: updatedField,
            value: newValue,
            id: id
          })  
        });

        if (!response.ok) { console.error('Ошибка при обновлении данных на сервере'); }
        else { console.log('Данные успешно обновлены'); }
      } 
        catch (error) { console.error('Ошибка при отправке запроса:', error); }
    };




  // Рендер
  return (
    <div>
      <h3>&nbsp;&nbsp;Список менеджеров</h3>
      <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
          <button onClick={onBack} style={{ fontSize: '22px', marginLeft: '10px'}}>🏠</button>
          <button onClick={() => setShowForm(true)} style={{ fontSize: '22px' }}>➕</button>   
      </div>

      {/* Форма для новой записи (показывается только если showForm=true) */}
      {showForm && (
        <div style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px' }}>
          <input
            name="manager"
            placeholder="Фамилия"
            value={newManager.manager || ''}
            onChange={handleInputChange}
          />
          <input
            name="phone"
            placeholder="Телефон"
            value={newManager.phone || ''}
            onChange={handleInputChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={newManager.email || ''}
            onChange={handleInputChange}
          />
          <input
            name="login"
            placeholder="Логин"
            value={newManager.login || ''}
            onChange={handleInputChange}
          />

          
          {/* Поле выбора роли */}
          <select
            name="role"
            value={newManager.role}
            onChange={handleInputChange}
          >
            <option value="">Выберите роль</option> {/* Пустой вариант, чтобы не было выбрано по умолчанию */}
            <option value="admin">admin</option>
            <option value="user">user</option>
            <option value="it">it</option>
          </select>

          <button onClick={handleSave}>✅ Сохранить</button>
          <button onClick={() => setShowForm(false)}>❌ Отменить</button>
        </div>
      )}

      {/* Таблица */}
      {/* rowData={managers} - данные, которые будут в таблице */}
      {/*  columnDefs={columnDefs} - передается таблице массив описаний колонок*/}
      <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={managers}  
          columnDefs={columnDefs} 
          defaultColDef={{
            flex: 1,
            filter: true,
            sortable: true,
            resizable: true,
            editable: true
          }}
          localeText={translator}
          onCellValueChanged={handleCellValueChanged}
        />
      </div>
    </div>
  );
}

export default Managers_table;




////////////////////////////////////////
///////////////////////////////////////////
