import React, {useState} from 'react';

function ArticleData({article, updateShowSubtitle, updateShowing}) {



    return (
        <div className="card" key={article.id}>
            <div className="card__header">
                <img src={"https://localhost:5001/images/" + article.url} alt="card__image" className="card__image"
                     width="600" onClick={() => {
                    updateShowSubtitle(true);
                    updateShowing(article);
                }}/>

            </div>
            <div className="card__body">
                <span className="tag tag-blue">{article.tag}</span>
                    <h4 className="title" onClick={() => {
                        updateShowSubtitle(true);
                        updateShowing(article);
                    }}>{article.title}</h4>


                {article.subtitle.length > 100 ? (
                    <span onClick={() => {
                        updateShowSubtitle(true);
                        updateShowing(article);
                    }} style={{cursor: "pointer"}}>
                                                {article.subtitle.substring(0, 100) + "..."}
                                            </span>
                ) : (
                    <span onClick={() => {
                        updateShowSubtitle(true);
                        updateShowing(article);
                    }} style={{cursor: "pointer"}}>
                                                {article.subtitle}
                                            </span>
                )}
            </div>
            <div className="card__footer">
            </div>
        </div>
    );
}

export default ArticleData;