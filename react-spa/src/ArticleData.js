import React from 'react';

function ArticleData({index, count, incrementCounts, article }) {
    return (
        <div className="card" >
            <div className="card__header">
                <img src={"https://localhost:5001/images/" + article.url} alt="card__image" className="card__image"
                     width="600" onClick={()=> incrementCounts(index)}/>
            </div>
            <div className="card__body">
                <span className="tag tag-blue">{article.tag}</span>
                    <h4 className="title" onClick={()=> incrementCounts(index)}>{article.title}</h4>
                <p>{article.subtitle}</p>
            </div>
            <div className="card__footer">
                <h5>Просмотры: {count}</h5>
            </div>
        </div>
    );
}

export default ArticleData;