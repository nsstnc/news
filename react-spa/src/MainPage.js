import React, {useState} from 'react';
import './MainPage.css';
//импортируем компонент из другого файла
import ArticleData from './ArticleData';
import Modal from "react-bootstrap/Modal";

function MainPage({articles}) {



    // состояние для отображения всплывающего окна с текстом
    const [showSubtitle, setShowSubtitle] = useState(false);
    // состояние для текущей статьи в модальном окне
    const [showing, setShowing] = useState([]);

    const updateShowing = (newValue) => {
        setShowing(newValue);
    };

    const updateShowSubtitle = (newValue) => {
        setShowSubtitle(newValue);
    };


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
                </Modal.Body>
            </Modal>

            <div className="header">
                <a href="/admin" className="enter-button">Вход</a>
            </div>

            <div className="main">
                {articles.map((article, index) => (
                    // применяем внешний компонент к каждой полученной новости
                    <ArticleData
                                 article={article} updateShowSubtitle={updateShowSubtitle} updateShowing={updateShowing} />
                ))}
            </div>
        </div>
    );
}

export default MainPage;