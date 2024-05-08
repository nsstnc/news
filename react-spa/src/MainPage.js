import React from 'react';
import './MainPage.css';
//импортируем компонент из другого файла
import ArticleData from './ArticleData';

function MainPage({articles, counts, incrementCounts}) {
    return (
        <div className="">
            <div className="header">
                <a href="/admin" className="enter-button">Вход</a>
            </div>

            <div className="main">
                {articles.map((article, index) => (
                    // применяем внешний компонент к каждой полученной новости
                    <ArticleData index={index} count={counts[index]} incrementCounts={incrementCounts}
                                 article={article}/>
                ))}
            </div>
        </div>
    );
}

export default MainPage;