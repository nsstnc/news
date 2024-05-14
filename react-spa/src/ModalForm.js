import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

const ModalForm = ({show, handleClose, isAdding, showArticles, getApiData, data}) => {
    {/*модальное окно формы изменения/добавления записи*/}
    const [file, setFile] = useState(null);
    const [tag, setTag] = useState(data.tag);
    const [title, setTitle] = useState(data.title);
    const [subtitle, setSubtitle] = useState(data.subtitle);



    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tag", tag);
        formData.append("title", title);
        formData.append("subtitle", subtitle);

        try {
            const response = await axios.post("https://localhost:5001/upload", formData, {
                withCredentials: true,
            });

        } catch (error) {
            console.error("Error:", error);
        }
        // закрываем модальное окно
        handleClose();
        // сбрасываем состояние формы
        setFile(null);
        setTag(data.tag);
        setTitle(data.title);
        setSubtitle(data.subtitle);
        // обновляем содержимое страницы
        getApiData();
    };


    const editSubmit = async () => {
        const formData = new FormData();

        formData.append("id", data.id);
        formData.append("file", file);
        formData.append("tag", tag);
        formData.append("title", title);
        formData.append("subtitle", subtitle);

        try {
            const response = await axios.put("https://localhost:5001/edit_article_by_id", formData, {
                withCredentials: true,
            });

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
        // обновляем содержимое страницы
        getApiData();
    };

    useEffect(() => {
        // Обновление состояний при изменении data
        if (data) {
            setTag(data.tag);
            setTitle(data.title);
            setSubtitle(data.subtitle);
        }
    }, [data]);


    return (
        <div>
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
                                        <Form.Control type="text" placeholder="Тема" value="" on onChange={(e) => setTag(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Заголовок</Form.Label>
                                        <Form.Control type="text" placeholder="Заголовок" value="" onChange={(e) => setTitle(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        >
                                        <Form.Label>Содержание</Form.Label>
                                        <Form.Control as="textarea" rows={50} value="" onChange={(e) => setSubtitle(e.target.value)}/>
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
                                         src={"https://localhost:5001/images/" + data.url}/>
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
                                <button className="btn btn-success" onClick={editSubmit}>
                                    Сохранить
                                </button>
                            </Modal.Footer>
                        </Modal>
                    )
                ) : (
                    isAdding ? (
                        /* Когда не показываем статьи и добавляем */
                        <div></div>
                    ) : (
                        /* Когда не показываем статьи и не добавляем */
                        <div></div>
                    )
                )
                }


        </div>
    );
}

export default ModalForm;