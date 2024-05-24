import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {addArticle, updateArticle} from './features/articles/articleSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

const ModalForm = ({show, handleClose, isAdding, showArticles, getApiData, data, checkUserExists}) => {
    const dispatch = useDispatch();
    {/*модальное окно формы изменения/добавления записи*/}
    const [file, setFile] = useState(null);
    const [tag, setTag] = useState("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [old_password, setOldPassword] = useState("");
    const [current_password, setCurrentPassword] = useState("");

    // переменная для показа модального окна ошибки
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState("Пользователь с таким именем уже существует");

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tag", tag);
        formData.append("title", title);
        formData.append("subtitle", subtitle);

        try {
            await dispatch(addArticle(formData));
        } catch (error) {
            console.error("Error:", error);
        }
        // закрываем модальное окно
        handleClose();

        getApiData();
    };


    const editHandle = async () => {
        const formData = new FormData();

        formData.append("id", data.id);
        formData.append("file", file);
        formData.append("tag", tag);
        formData.append("title", title);
        formData.append("subtitle", subtitle);

        try {
            await dispatch(updateArticle(formData))

        } catch (error) {
            console.error("Error:", error);
        }
        // закрываем модальное окно
        handleClose();
        // сбрасываем состояние формы
        setFile(null);
        setTag("");
        setTitle("");
        setSubtitle("");

        getApiData();
    };

    const editUserHandle = async () => {
        const userExists = await checkUserExists(nickname, data.id);
        try{
            if (userExists) {
                setMessage("Пользователь с таким именем уже существует");
                throw new Error('Ошибка');
            } else {
                const formData = new FormData();

                formData.append("id", data.id);
                formData.append("nickname", nickname);
                formData.append("password", password);
                formData.append("old_password", old_password);

                try {
                    const response = await axios.put("https://localhost:5001/edit_user_by_id", formData, {
                        withCredentials: true,
                    });
                    if (response.status === 401) {
                        throw new Error('Unauthorized');
                    }

                    // закрываем модальное окно
                    handleClose();
                    // сбрасываем состояние формы
                    setNickname("");
                    setPassword("");
                    setOldPassword("");
                    // обновляем содержимое страницы
                    getApiData();

                } catch (error) {
                    setMessage("Неверный пароль");
                        setShowError(true);
                    console.error("Error:", error);
                }

            }
        } catch (error) {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
            setShowError(true);
        }
    };

    const handleUserSubmit = async () => {
        const userExists = await checkUserExists(nickname);
        try{
            if (userExists) {
                setMessage("Пользователь с таким именем уже существует");
                throw new Error('Ошибка');
            } else {
                const formData = new FormData();

                formData.append("nickname", nickname);
                formData.append("password", password);
                formData.append("current_password", current_password);

                try {
                    const response = await axios.post("https://localhost:5001/add_user", formData, {
                        withCredentials: true,
                    });
                    if (response.status === 401) {
                        throw new Error('Unauthorized');
                    }
                    // закрываем модальное окно
                    handleClose();
                    // обновляем содержимое страницы
                    getApiData();
                } catch (error) {
                    setMessage("Неверный пароль");
                    setShowError(true);
                    console.error("Error:", error);
                }

            }
        } catch (error) {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
            setMessage("Пользователь с таким именем уже существует");
            setShowError(true);
        }
    };



    useEffect(() => {
        console.log(data)
        // Обновление состояний при изменении data
        if (data) {
            setTag(data.tag);
            setTitle(data.title);
            setSubtitle(data.subtitle);
            setNickname(data.nickname);
            setPassword(data.password);
        }
    }, [data]);


    return (
        <div>
            {/* Модальное окно для отображения ошибки */}
                {
                showArticles ? (
                    isAdding ? (
                        /* Когда показываем статьи и добавляем */
                        <Modal show={show}
                               size="lg"
                               onHide={handleClose}
                               scrollable
                               aria-labelledby="contained-modal-title-vcenter"
                               centered
                                >
                            <Modal.Header closeButton>
                                <Modal.Title>Добавление статьи</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Изображение</Form.Label>
                                        <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Тема</Form.Label>
                                        <Form.Control type="text" placeholder="Тема" on onChange={(e) => setTag(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Заголовок</Form.Label>
                                        <Form.Control type="text" placeholder="Заголовок" onChange={(e) => setTitle(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        >
                                        <Form.Label>Содержание</Form.Label>
                                        <Form.Control as="textarea" rows={50} onChange={(e) => setSubtitle(e.target.value)}/>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-outline-danger" onClick={handleClose}>
                                    Закрыть
                                </button>
                                <button className="btn btn-success" onClick={handleSubmit}>
                                    Добавить
                                </button>
                            </Modal.Footer>
                        </Modal>

                    ) : (
                        /* Когда показываем статьи и не добавляем */
                        <Modal show={show}
                               size="lg"
                               onHide={handleClose}
                               scrollable
                               aria-labelledby="contained-modal-title-vcenter"
                               centered>

                            <Modal.Header closeButton>
                                <Modal.Title>Изменение статьи</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <img className="article-img"
                                         src={"https://localhost:5001/images/" + data?.url}/>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Изображение</Form.Label>
                                        <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Тема</Form.Label>
                                        <Form.Control type="text" placeholder="Тема" value={tag} onChange={(e) => setTag(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Заголовок</Form.Label>
                                        <Form.Control type="text" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                    >
                                        <Form.Label>Содержание</Form.Label>
                                        <Form.Control as="textarea" rows={50} value={subtitle} onChange={(e) => setSubtitle(e.target.value)}/>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-outline-danger" onClick={handleClose}>
                                    Закрыть
                                </button>
                                <button className="btn btn-success" onClick={editHandle}>
                                    Сохранить
                                </button>
                            </Modal.Footer>
                        </Modal>
                    )
                ) : (
                    isAdding ? (
                        /* Когда показываем не статьи и добавляем */
                        <Modal show={show}
                               size="lg"
                               onHide={handleClose}
                               scrollable
                               aria-labelledby="contained-modal-title-vcenter"
                               centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Добавление пользователя</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Пароль текущего пользователя</Form.Label>
                                        <Form.Control type="password" placeholder="Пароль" onChange={(e) => setCurrentPassword(e.target.value)}/>
                                    </Form.Group>

                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Никнейм</Form.Label>
                                        <Form.Control type="text" placeholder="Никнейм" onChange={(e) => setNickname(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Пароль</Form.Label>
                                        <Form.Control type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)}/>
                                    </Form.Group>
                                </Form>
                                <a style={{display: showError ? 'block' : 'none', color: 'red'}}>{message}</a>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-outline-danger" onClick={()=> {
                                    handleClose();
                                    setShowError(false);
                                }}>
                                    Закрыть
                                </button>
                                <button className="btn btn-success" onClick={()=> {
                                    setShowError(false);
                                    handleUserSubmit();
                                }}>
                                    Добавить
                                </button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        /* Когда показываем не статьи и не добавляем */
                        <Modal show={show}
                               size="lg"
                               onHide={handleClose}
                               scrollable
                               aria-labelledby="contained-modal-title-vcenter"
                               centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Изменение пользователя</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Никнейм</Form.Label>
                                        <Form.Control type="text" placeholder="Никнейм" value={nickname} onChange={(e) => setNickname(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Старый пароль</Form.Label>
                                        <Form.Control type="password" placeholder="Старый пароль" onChange={(e) => setOldPassword(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Пароль</Form.Label>
                                        <Form.Control type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)}/>
                                    </Form.Group>
                                </Form>
                                <a style={{display: showError ? 'block' : 'none', color: 'red'}}>{message}</a>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-outline-danger" onClick={()=> {
                                    handleClose();
                                    setShowError(false);
                                }}>
                                    Закрыть
                                </button>
                                <button className="btn btn-success" onClick={()=> {
                                    setShowError(false);
                                    editUserHandle();
                                }}>
                                    Изменить
                                </button>
                            </Modal.Footer>
                        </Modal>
                    )
                )
                }
        </div>
    );
}

export default ModalForm;