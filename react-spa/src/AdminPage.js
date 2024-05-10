import React, {useEffect, useState} from "react";
import Modal from 'react-bootstrap/Modal';
import './AdminPage.css';

import axios from "axios";

// TODO страница админ-панели с возможностью просматривать статьи, редактировать их, удалять, добавлять новые
// TODO возможность добавлять новых пользователей
// TODO сохранение просмотров в базе данных по id-новости, количество просмотров

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
            const response = await axios.get('https://localhost:5001/admin');
            console.log(response);

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


    return (
        <div>

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
                    {showing.subtitle}
                    {showing.subtitle}
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
                    <button type="button" className="btn btn-outline-danger" style={{float: "right"}}>Выйти</button>
                </div>

            </div>
            <div className="admin_body">
                {showArticles ? (
                    <div>
                        <caption>Статьи</caption>
                        <button type="button" className="btn btn-success"
                                style={{float: "left", marginBottom: "10px"}}>Добавить
                        </button>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Изображение</th>
                                <th>Тема</th>
                                <th>Заголовок</th>
                                <th>Содержание</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {articles.map(article => (
                                <tr key={article.id}>
                                    <td>{article.id}</td>
                                    <td>
                                        <img className="table-img" src={"https://localhost:5001/images/" + article.url}/>
                                    </td>
                                    <td>{article.tag}</td>
                                    <td>{article.title}</td>
                                    <td>
                                        {article.subtitle.length > 50 ? (
                                            <span className="title" onClick={() => {
                                                setShowSubtitle(true);
                                                setShowing(article);
                                            }} style={{cursor: "pointer"}}>
                                                {article.subtitle.substring(0, 50) + "..."}
                                            </span>
                                        ) : (
                                            <span className="title" onClick={() => {
                                                setShowSubtitle(true);
                                                setShowing(article);
                                            }} style={{cursor: "pointer"}}>
                                                {article.subtitle}
                                            </span>
                                        )}

                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-outline-secondary"
                                                style={{marginRight: "5px"}}>Изменить
                                        </button>
                                        <button type="button" className="btn btn-outline-danger">Удалить</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>
                        <caption>Пользователи</caption>
                        <button type="button" className="btn btn-success"
                                style={{float: "left", marginBottom: "10px"}}>Добавить
                        </button>

                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Никнейм</th>
                                <th>Пароль</th>
                                <th>Удалить</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.nickname}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <button type="button" className="btn btn-outline-danger">Удалить</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


        </div>
    );
}

export default AdminPage;