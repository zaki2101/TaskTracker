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


function Tasks_table({ onBack }) { 
  /* функция, которая определяет React-компонент, всё, что внутри неё, описывает, 
  как компонент работает и что он будет показывать */

  const [tasks, setTasks] = useState([]);  // Состояние для списка задач

  // Состояние для показа/скрытия формы для добавления менеджера
  const [showForm, setShowForm] = useState(false);  
  
  // Состояние для хранения данных новой записи
  const [newTask, setNewTask] = useState({ task: '', col_1: '', col_2: '' });

  // Состояние для принудительного перезапроса данных (мы меняем эту переменную, и useEffect реагирует)
  const [refreshKey, setRefreshKey] = useState(0);

  // Загрузка данных с сервера
    useEffect(() => {   
      /*  отправляет HTTP-запрос на указанный адрес (в нашем случае к нашему backend, 
      который отдаёт JSON-список менеджеров)*/  
      fetch('http://localhost:5001/api/tasks')  
      .then(response => response.json())      // когда сервер вернул ответ => преобразуем его в json 
      .then(data => { setTasks(data);  // 
      })  
      .catch(error => console.error('Ошибка при загрузке справочника задач:', error));
    }, [refreshKey]); // [] - массив зависимостей, если пустой, то этот эффект должен выполниться только один раз
        // при изменении refreshKey эффект выполняктся повторно, данные загружаются заново
    
    // Обработчик изменения поля формы при добавлении записи
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewTask(prev => ({ ...prev, [name]: value }));
    };

    // Обработчик нажатия на кнопку "Сохранить"
    const handleSave = async () => {
      // Проверка что все поля заполнены (trim() - удаление пробелов в начале и конце)
      if (!newTask.task_name.trim())
        { alert('Внимание! Введите наименование задачи!');
        return; // прерываем выполнение, не отправляем запрос 
      }

      try {
        const response = await fetch('http://127.0.0.1:5001/api/add_task', {
          method: 'POST', // добавляем данные
          headers: {
            'Content-Type': 'application/json' //  отправка данных в форматем json
          }, body: JSON.stringify(newTask) // превращаем объект newManager в JSON‑строку для отправки
        });

        if (!response.ok) {
          /* обработка ответа.. response.ok — булевое значение:
                          true если код ответа от сервера 200–299.
                          false если что‑то пошло не так (например, 400, 500)
          */
          console.error('Ошибка при добавлении задачи');
        } else {
          console.log('Задача успешно добавлена');
          setShowForm(false);  // скрываем форму
          setNewTask({ task_name: '', col_1: '', col_2: '' }); // очищаем поля
          setRefreshKey(old => old + 1); // изменяем ключ, чтобы useEffect снова загрузил данные
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }
    };


    // Определение колонок для AG Grid
    // field - Ключ из объекта данных (таблица)
    // editable - Позволяет редактировать
    // sortable	- Позволяет сортировать
    // filter -	Включает или выключает фильтр
    // resizable	Разрешает пользователю менять ширину этой колонки
    const columnDefs = [
      { headerName: 'Задача', field: 'task_name', editable: true, sortable: true, resizable: true,
        valueSetter: (params) => {
          if (!params.newValue || !params.newValue.trim()) {
            alert('Поле "Задача" не может быть пустым!');
            return false;
          }
          params.data.task_name = params.newValue;
          return true;
        },
        filter: false },  

        { headerName: '# 1', field: 'col_1', editable: true, sortable: false, filter: false, resizable: true },
        { headerName: '# 2', field: 'col_2', editable: true, sortable: false, filter: false, resizable: true },
        { headerName: 'Действия', editable: false, sortable: false, filter: false, resizable: true,
                       cellRenderer: (params) => (
                       <button onClick={() => handleDelete(params.data.id)}>❌</button>
                     )
        }            
    ];

    // Удаление строки
    const handleDelete = async (id) => {
      if (!window.confirm('Вы уверены, что хотите удалить задачу?')) {
          return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/delete_task/${id}`, {
        method: 'DELETE'
      });
    
        if (response.ok) {
          console.log('Задача успешно удалён');
          setRefreshKey(old => old + 1); // перезагружаем данные
        } 
        else {
          console.error('Ошибка при удалении задачи');
        }
      } catch (error) { console.error('Ошибка при отправке запроса:', error); }
    };


    // Обработчик изменения ячейки
    const handleCellValueChanged = async (event) => {
        const id = event.data.id;  // Получаем ID записи, которую редактировали
        const updatedField = event.colDef.field;   // Определяем, какое именно поле обновилось
        const oldValue = event.oldValue;           // Старое значение
        let newValue = event.newValue;  // Новое значение этого поля

        if (newValue === null) {newValue = '';}

        // Проверка: если редактируется поле task_name и новое значение пустое
        if ((updatedField === 'task_name') && !newValue.trim()) {
          // Откатить значение в таблице к старому
          event.node.setDataValue(updatedField, oldValue);

          // Перерисовать ячейку сразу, чтобы пользователь увидел старое значение
          event.api.refreshCells({ rowNodes: [event.node] });

          return; // Прерываем выполнение функции, не отправляем запрос
        }
        try {
          // Делаем PATCH-запрос на сервер с новым значением для частичного обновления
          const response = await fetch(`http://127.0.0.1:5001/api/update_cell`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ 
            table: 'tasks',
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
        <h3>&nbsp;&nbsp;Справочник задач</h3>
        <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
          <button onClick={onBack} style={{ fontSize: '22px', marginLeft: '10px'}}>🏠</button>
          <button onClick={() => setShowForm(true)} style={{ fontSize: '22px' }}>➕</button>   
        </div>

        {/* Форма для новой записи (показывается только если showForm=true) */}
        {showForm && (
          <div style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px' }}>
            <input
              name="task_name"
              placeholder="Новая задача"
              value={newTask.task_name || ''}
              onChange={handleInputChange}
            />  
            <input
              name="col_1"
              placeholder="# 1"
              value={newTask.col_1 || ''}
              onChange={handleInputChange}
            />
            <input
              name="col_2"
              placeholder="# 2"
              value={newTask.col_2 || ''}
              onChange={handleInputChange}
            />
            <button onClick={handleSave} style={{ marginRight: '10px' }}>Сохранить</button>
            <button onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        )}






        {/* Таблица */}
        {/* rowData={tasks} - данные, которые будут в таблице */}
        {/*  columnDefs={columnDefs} - передается таблице массив описаний колонок*/}
        <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
          <AgGridReact
              rowData={tasks}  
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
    )
}
export default Tasks_table;