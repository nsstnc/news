import React, {useEffect, useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import ModalForm from "./ModalForm";
import axios from "axios";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { useDispatch } from 'react-redux';
import {deleteArticle} from './features/articles/articleSlice';

const DeleteConfirmationModal = ({ show, handleClose, deleteHandle, id }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение удаления</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы уверены, что хотите удалить этот элемент?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Отмена
                </Button>
                <Button variant="danger" onClick={() => deleteHandle(id)}>
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


const TableArticles = ({data, setShowing, setShowSubtitle, showArticles, getApiData}) => {
    const dispatch = useDispatch();

    // различные состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = data.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage + 1 <= totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage - 1 >= 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const updateItemsPerPage = (value) => {
        setItemsPerPage(value);
    };

    const getDataById = async (id) =>  {
        try {
            const response = await axios.post('https://localhost:5001/get_article_by_id', {
                id
            }, {
                withCredentials: true
            });
            setItem(response.data.article);
        } catch (error) {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
        }
    }

    const deleteHandle = async (id) => {
        try {
            await dispatch(deleteArticle(id));

        } catch (error) {
            console.error("Error:", error);
        }
        // Закрываем модальное окно подтверждения удаления
        handleCloseConfirmationModal();
        getApiData();
    };

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    // Открыть модальное окно удаления
    const handleDeleteConfirmation = () => {
        setShowConfirmationModal(true);
    };
    // Закрыть модальное окно удаления
    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    // состояния для модального окна формы
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [adding, setAdding] = useState(true);
    const [currentId, setCurrentId] = useState(1);
    const [item, setItem] = useState( null);

    useEffect(() => {
        getDataById(currentId);
    }, [currentId]);



    return (
        <div>
            <DeleteConfirmationModal
                show={showConfirmationModal}
                handleClose={handleCloseConfirmationModal}
                deleteHandle={deleteHandle}
                id={currentId}
            />
            <ModalForm show={show} handleClose={handleClose} isAdding={adding} showArticles={showArticles} getApiData={getApiData} data={item}
            ></ModalForm>

            <caption>Статьи</caption>
            <Dropdown>
                <button onClick={() => {
                    handleShow();
                    setAdding(true);
                }} className="btn btn-success"
                        style={{float: "left", marginBottom: "10px"}}>Добавить
                </button>
                <Dropdown.Toggle variant="" id="dropdown-basic" style={{marginLeft: "10px"}}>
                    Кол-во записей
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => updateItemsPerPage(5)}>5</Dropdown.Item>
                    <Dropdown.Item onClick={() => updateItemsPerPage(10)}>10</Dropdown.Item>
                    <Dropdown.Item onClick={() => updateItemsPerPage(50)}>50</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <nav aria-label="Page navigation example" style={{float: "right"}}>
                <ul className="pagination">
                    <li className="page-item" onClick={prevPage} disabled={currentPage === 1}>
                        <a className="page-link" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li className="page-item"><a className="page-link">{currentPage}</a></li>
                    <li className="page-item" onClick={nextPage} disabled={currentPage === totalPages}>
                        <a className="page-link" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Изображение</th>
                    <th>Тема</th>
                    <th>Заголовок</th>
                    <th>Содержание</th>
                    <th>Изменено</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(article => (
                    <tr key={article.id}>

                        <td>{article.id}</td>
                        <td>
                            <img className="table-img"
                                 src={"https://localhost:5001/images/" + article.url}/>
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
                            {moment(article.updated).format('DD.MM.YYYY, HH:mm')}
                        </td>
                        <td>
                            <button onClick={() => {
                                handleShow();
                                setAdding(false);
                                setCurrentId(article.id);
                            }} type="button" className="btn btn-outline-secondary"
                                    style={{marginRight: "5px"}}>Изменить</button>
                            <button onClick={() => {
                                 handleDeleteConfirmation(article.id);
                                 setCurrentId(article.id);
                            }} type="button" className="btn btn-outline-danger">Удалить</button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{marginTop: "10px"}}>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item" onClick={prevPage} disabled={currentPage === 1}>
                            <a className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li className="page-item"><a className="page-link">{currentPage}</a></li>
                        <li className="page-item" onClick={nextPage} disabled={currentPage === totalPages}>
                            <a className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>


    );
};

export default TableArticles;