import React, {useEffect, useState} from "react";
import Modal from 'react-bootstrap/Modal';
import './AdminPage.css';


import axios from "axios";
import TableArticles from "./TableArticles";
import TableUsers from "./TableUsers";
import ModalForm from "./ModalForm";


function AdminPage() {
    // массив статей
    const [articles, setArticles] = useState([]);
    // массив счетчиков для каждого элемента article
    const [users, setUsers] = useState([]);
    // состояние для отображения таблицы статей (true) или пользователей (false)
    const [showArticles, setShowArticles] = useState(true);
    // состояние для отображения всплывающего окна с текстом
    const [showSubtitle, setShowSubtitle] = useState(false);

    // состояние для текущей статьи в модальном окне
    const [showing, setShowing] = useState([]);



    // функция получения данных с бэка
    const getApiData = async () => {
        try {
            const response = await axios.get('https://localhost:5001/admin',{withCredentials: true});


            // обновляем массив статей
            setArticles(response.data.articles);
            // обновляем массив пользователей
            setUsers(response.data.users);
        } catch (error) {
            console.error('Ошибка при получении данных с сервера:', error);
        }
    };

    useEffect(() => {
        getApiData();
    }, []);

    // функция выхода пользователя
    const logOut = async () => {
        try {
            await axios.get('https://localhost:5001/logout', {
                withCredentials: true
            });

        } catch (error) {
            console.error('Ошибка при получении данных с сервера:', error);
        }
        window.location.reload();
    };





    return (
        <div>





            {/*модальное окно предпросмотра*/}
            <Modal show={showSubtitle} onHide={() => setShowSubtitle(false)}
                   scrollable
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   dialogClassName="modal-30w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>{showing.id}. {showing.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "justify" }}>
                    <img className="article-img" src={"https://localhost:5001/images/" + showing.url}/>
                    {/* Содержимое подзаголовка */}
                    {showing.subtitle}
                </Modal.Body>
            </Modal>

            <div className="admin_header">
                <h2>Добро пожаловать в админ-панель</h2>
                <div className="d-grid gap-2 d-md-block">
                    <button onClick={() => setShowArticles(true)} className="btn btn-primary me-md-2"
                            type="button">Статьи
                    </button>
                    <button onClick={() => setShowArticles(false)} className="btn btn-primary"
                            type="button">Пользователи
                    </button>
                    <button onClick={() => logOut()}
                            type="button" className="btn btn-outline-danger" style={{float: "right"}}>Выйти</button>
                </div>

            </div>


            <div className="admin_body">
                {showArticles ? (
                    <TableArticles data={articles} setShowing={setShowing} setShowSubtitle={setShowSubtitle} showArticles={showArticles} getApiData={getApiData}></TableArticles>
                ) : (
                    <TableUsers data={users} showArticles={showArticles} getApiData={getApiData}></TableUsers>
                )}
            </div>


        </div>
    );
}

export default AdminPage;