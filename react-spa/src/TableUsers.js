import React, {useEffect, useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalForm from "./ModalForm";
import Form from "react-bootstrap/Form";
import {deleteUser} from "./features/users/usersSlice";
import {useDispatch} from "react-redux";

const DeleteConfirmationModal = ({show, handleClose, deleteHandle, id}) => {
    const [password, setPassword] = useState("");
    // переменная для показа модального окна ошибки
    const [showError, setShowError] = useState(false);


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение удаления</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Вы уверены, что хотите удалить этот элемент?
                <p></p>
                <Form>
                    <Form.Group
                        className="mb-3">
                        <Form.Control type="password" placeholder="Пароль удаляемого пользователя"
                                      onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                </Form>
                <a style={{display: showError ? 'block' : 'none', color: 'red'}}>Неверный пароль</a>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    handleClose();
                    setShowError(false);
                }}>
                    Отмена
                </Button>
                <Button variant="danger" onClick={() => {
                    setShowError(false);
                    deleteHandle({setShowError}, id, password);
                }}>
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


const TableUsers = ({data, showArticles, getApiData}) => {
    const dispatch = useDispatch();

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

    const getDataById = async (id) => {
        try {
            const response = await axios.post('https://localhost:5001/get_user_by_id', {
                id
            }, {
                withCredentials: true
            });
            setItem(response.data.user);
        } catch (error) {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
        }
    }

    const deleteHandle = async ({setShowError}, id, password) => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("password", password);

        try {
            const response = await dispatch(deleteUser(formData));
            if (response.type === 'users/deleteUser/rejected') {
                throw new Error('Unauthorized');
            }


            // Закрываем модальное окно подтверждения удаления
            handleCloseConfirmationModal();
            // проверяем авторизацию
            getApiData();

        } catch (error) {
            setShowError(true);
            console.error("Error:", error);
        }


    };

    // метод проверки наличия пользователя
    const checkUserExists = async (nickname, id = 0) => {
        return data.some(user => user.nickname === nickname && user.id !== id);
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
    const [item, setItem] = useState(null);

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
            <ModalForm show={show} handleClose={handleClose} isAdding={adding} showArticles={showArticles}
                       getApiData={getApiData} data={item}
                       checkUserExists={checkUserExists}
            ></ModalForm>


            <caption>Пользователи</caption>
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
                    <th>Никнейм</th>
                    <th>Пароль</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nickname}</td>
                        <td style={{
                            wordWrap: 'break-word',
                            maxWidth: '200px'
                        }}>{user.password}</td>
                        <td>
                            <button onClick={() => {
                                handleShow();
                                setAdding(false);
                                setCurrentId(user.id);
                            }} type="button" className="btn btn-outline-secondary"
                                    style={{marginRight: "5px"}}>Изменить
                            </button>
                            <button onClick={() => {
                                handleDeleteConfirmation(user.id);
                                setCurrentId(user.id);
                            }} type="button" className="btn btn-outline-danger">Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>


            {/*пагинация*/}
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

export default TableUsers;