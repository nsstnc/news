import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const ModalForm = ({show, handleClose, isAdding, showArticles, data=null}) => {
    {/*модальное окно формы изменения/добавления записи*/
    }
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
                                        <Form.Control type="file"/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Тема</Form.Label>
                                        <Form.Control type="text" placeholder="Тема"/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Заголовок</Form.Label>
                                        <Form.Control type="text" placeholder="Заголовок"/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        >
                                        <Form.Label>Содержание</Form.Label>
                                        <Form.Control as="textarea" rows={50}/>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-outline-danger" onClick={handleClose}>
                                    Закрыть
                                </button>
                                <button className="btn btn-success" onClick={handleClose}>
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
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Изображение</Form.Label>
                                        <Form.Control type="file"/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Тема</Form.Label>
                                        <Form.Control type="text" placeholder="Тема" value={data.tag}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3">
                                        <Form.Label>Заголовок</Form.Label>
                                        <Form.Control type="text" placeholder="Заголовок" value={data.title}/>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                    >
                                        <Form.Label>Содержание</Form.Label>
                                        <Form.Control as="textarea" rows={50} value={data.subtitle}/>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-outline-danger" onClick={handleClose}>
                                    Закрыть
                                </button>
                                <button className="btn btn-success" onClick={handleClose}>
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