import React, {useState, useEffect} from 'react';
import './MainPage.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles } from './features/articles/articleSlice';
//импортируем компонент из другого файла
import ArticleData from './ArticleData';
import Modal from "react-bootstrap/Modal";

function MainPage() {
    const dispatch = useDispatch();
    const articles = useSelector((state) => state.articles.items);
    const articleStatus = useSelector((state) => state.articles.status);
    const error = useSelector((state) => state.articles.error);


    // состояние для отображения всплывающего окна с текстом
    const [showSubtitle, setShowSubtitle] = useState(false);
    // состояние для текущей статьи в модальном окне
    const [showing, setShowing] = useState([]);

    useEffect(() => {
        if (articleStatus === 'idle') {
            dispatch(fetchArticles());
        }
    }, [articleStatus, dispatch]);

    if (articleStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (articleStatus === 'failed') {
        return <div>{error}</div>;
    }


    return (
        <div>

            <Modal show={showSubtitle} onHide={() => setShowSubtitle(false)}
                   scrollable
                   centered
                   dialogClassName="modal-30w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>{showing.title}</Modal.Title>
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
                {articles.map((article) => (
                    // применяем внешний компонент к каждой полученной новости
                    <ArticleData
                                 article={article} updateShowSubtitle={setShowSubtitle} updateShowing={setShowing} />
                ))}
            </div>
        </div>
    );
}

export default MainPage;