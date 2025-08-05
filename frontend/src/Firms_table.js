// useState — для создания состояния
// useEffect — для загрузки данных при запуске компонента setView
import React, { useState, useEffect } from 'react';

import { AgGridReact } from 'ag-grid-react';  // основной компонент AG Grid для отображения таблицы
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'; // для подключения всех возможностей AG Grid

// стили для таблицы
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import './custom-grid.css';  // мой css
import translator from './labels_ru';  // Надписи на русском языке для интерфейса

// Регистрация модулей для ag-grid для активации функциональности AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);


function Firms_table({ onBack }) { 
  /* функция, которая определяет React-компонент, всё, что внутри неё, описывает, 
  как компонент работает и что он будет показывать */

  const [firms, setFirms] = useState([]);  // Состояние и загрузка данных
  // firms — массив, в котором будут данные о фирмах
  // setFirms - функция для обновления этого массива
  // useState([]) - начальное значение

  // Состояние для показа/скрытия формы для добавления фирмы
  const [showForm, setShowForm] = useState(false);  
  
  // Состояние для хранения данных новой записи
  const [newFirm, setNewFirm] = useState({ reg: '', firm_name: '', cod_dc: '',
     it_manager: '', serv_manager: '', additional_information: '', comment_1: ''
     
   });

  // Состояние для принудительного перезапроса данных (мы меняем эту переменную, и useEffect реагирует)
  const [refreshKey, setRefreshKey] = useState(0);

  

  // Загрузка данных с сервера
  // useEffect — это специальный хук React, который позволяет выполнить побочные действия
  useEffect(() => 
    {   
    fetch('http://localhost:5001/api/firms')  
      /* fetch — это встроенная функция браузера для отправки HTTP-запросов
      GET-запрос по адресу ... */
      .then(response => response.json()) // когда сервер вернул HTTP-ответ => преобразуем его в json 
      .then(data => { setFirms(data);  // сохраняем полученные данные в состоянии firms, вызывая setFirms(data)
      })  
      .catch(error => console.error('Ошибка при загрузке списка фирм:', error));
    }, [refreshKey] // [] - массив зависимостей
  ); 
  
  
  // Универсальный обработчик изменения поля формы при добавлении записи
  // Получает имя и значение из любого поля формы и обновляет соответствующее поле в объекте newFirm
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewFirm(prev => ({ ...prev, [name]: value }));
    };    
   
  // Обработчик нажатия на кнопку "Сохранить"
  const handleSave = async () => {
    // Проверка что все поля заполнены (trim() - удаление пробелов в начале и конце)
    if (!newFirm.reg.trim() || !newFirm.firm_name.trim() || !newFirm.cod_dc.trim() ||
      !newFirm.it_manager.trim() || !newFirm.serv_manager.trim()
      )
        { alert('Внимание! Заполнить поля!');
        return; // прерываем выполнение, не отправляем запрос 
      }

      try {
        const response = await fetch('http://127.0.0.1:5001/api/add_firm', {
          method: 'POST', // добавляем данные
          headers: {
            'Content-Type': 'application/json' //  отправка данных в форматем json
          }, body: JSON.stringify(newFirm) // превращаем объект newFirm в JSON‑строку для отправки
        });

        if (!response.ok) {
          /* обработка ответа.. response.ok — булевое значение:
                          true если код ответа от сервера 200–299.
                          false если что‑то пошло не так (например, 400, 500)
          */
          console.error('Ошибка при добавлении компании');
        } else {
          console.log('Компания успешно добавлена');
          setShowForm(false);  // скрываем форму
          setNewFirm({ reg: '', firm_name: '', cod_dc: '', it_manager: '', 
            serv_manager: '', additional_information: '', comment_1: '' }); // очищаем поля
          setRefreshKey(old => old + 1); // изменяем ключ, чтобы useEffect снова загрузил данные
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }
    };


  // Определение колонок для AG Grid
    // field - Ключ из объекта данных 
    // editable - Позволяет редактировать
    // sortable	- Позволяет сортировать
    // filter -	Включает или выключает фильтр
    // resizable	Разрешает пользователю менять ширину этой колонки
    const columnDefs = [
      { headerName: 'Рег', field: 'reg', editable: false, sortable: false, resizable: true, filter: false, width: 90 },  
      { headerName: 'Наименование', field: 'firm_name', editable: false, sortable: true, filter: true, resizable: true, width: 170 },
      { headerName: 'Код ДЦ', field: 'cod_dc', editable: false, sortable: false, filter: false, resizable: true, width: 85 },
      { headerName: 'Тех. специалист', field: 'it_manager', editable: false, sortable: true, filter: true, resizable: true, width: 110 },
      { headerName: 'Менеджер', field: 'serv_manager', editable: false, sortable: true, filter: true, resizable: true, width: 110 },
      { headerName: 'Дата обн.', field: 'update_data', editable: false, sortable: false, filter: false, resizable: true, width: 100 },  
      { headerName: 'Инцидент 1', field: 'problem_1', editable: false, sortable: false, filter: false, resizable: true, width: 112 },
      { headerName: '# 1', field: 'description_1', editable: false, sortable: false, filter: false, resizable: true, width: 55 },
      { headerName: 'Инцидент 2', field: 'problem_2', editable: false, sortable: false, filter: false, resizable: true, width: 115 },
      { headerName: '# 2', field: 'description_2', editable: false, sortable: false, filter: false, resizable: true, width: 55 },
      { headerName: 'Инцидент 3', field: 'problem_3', editable: false, sortable: false, filter: false, resizable: true, width: 100 },
      { headerName: '# 3', field: 'description_3', editable: false, sortable: false, filter: false, resizable: true, width: 55 },
      { headerName: 'Дополнительная информация', field: 'additional_information', editable: true, sortable: false, filter: false, resizable: true, width: 100 },
      { headerName: 'Комментарий', field: 'comment_1', editable: false, sortable: false, filter: false, resizable: true, width: 112 },
      { headerName: 'Действия', editable: false, sortable: false, filter: false, resizable: true, width: 80, 
                       cellRenderer: (params) => (
                       <button onClick={() => handleDelete(params.data.id)}>❌</button>
                     )
      }        
    ];

    // Удаление строки
    const handleDelete = async (id) => {
      if (!window.confirm('Вы уверены, что хотите удалить компанию?')) {
          return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/delete_firm/${id}`, {
        method: 'DELETE'
      });
    
        if (response.ok) {
          console.log('Компания успешно удалена');
          setRefreshKey(old => old + 1); // перезагружаем данные
        } 
        else {
          console.error('Ошибка при удалении компании');
        }
      } catch (error) { console.error('Ошибка при отправке запроса:', error); }
    };


    // Рендер - Интерфейс
    return (
      <div>
        <h3>&nbsp;&nbsp;Обновление - реестр</h3>
        <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
          <button onClick={onBack} style={{ fontSize: '22px', marginLeft: '10px'}}>🏠</button>
          <button onClick={() => setShowForm(true)} style={{ fontSize: '22px' }}>➕</button>   
        </div>
        
        {/* Форма для новой записи (показывается только если showForm=true) */}
        {/* showForm && - Если равно true, тогда отображается содержимое в скобках*/}
        {/* onChange={handleInputChange} - функция, которая будет вызвана при изменении текста в поле. Она обновит newFirm*/}
        {showForm && (
          <div style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px' }}>
            <input
              name="reg"
              placeholder="Рег №"
              value={newFirm.reg || ''}
              onChange={handleInputChange}
            />  
            <input
              name="firm_name"
              placeholder="Наименование компании"
              value={newFirm.firm_name || ''}
              onChange={handleInputChange}
            />
            <input
              name="cod_dc"
              placeholder="Код ДЦ"
              value={newFirm.cod_dc || ''}
              onChange={handleInputChange}
            />
            <input
              name="it_manager"
              placeholder="Тех. специалист"
              value={newFirm.it_manager || ''}
              onChange={handleInputChange}
            />
            <input
              name="serv_manager"
              placeholder="Менеджер"
              value={newFirm.serv_manager || ''}
              onChange={handleInputChange}
            />
            <input
              name="additional_information"
              placeholder="Доп. информация"
              value={newFirm.additional_information || ''}
              onChange={handleInputChange}
            />
            <input
              name="comment_1"
              placeholder="Комментарий"
              value={newFirm.comment_1 || ''}
              onChange={handleInputChange}
            />

            <button onClick={handleSave} style={{ marginRight: '10px' }}>Сохранить</button>
            <button onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        )}
        

        {/* Таблица */}
        {/* rowData={firms} - данные, которые будут в таблице */}
        {/*  ƒ={columnDefs} - передается таблице массив описаний колонок*/}
        <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
            <AgGridReact
              rowData={firms}  
              columnDefs={columnDefs} 
              
              localeText={translator}
                                  
            />
        </div>
      </div>          
    )




}
       
export default Firms_table; // для импорта из других модулей
   