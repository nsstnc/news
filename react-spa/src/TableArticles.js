import React, {useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const TableArticles = ({data, setShowing, setShowSubtitle}) => {
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

    return (
        <div>
            <caption>Статьи</caption>
            <button type="button" className="btn btn-success"
                    style={{float: "left", marginBottom: "10px"}}>Добавить
            </button>
            <Dropdown>
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
                            <button type="button" className="btn btn-outline-secondary"
                                    style={{marginRight: "5px"}}>Изменить
                            </button>
                            <button type="button" className="btn btn-outline-danger">Удалить</button>
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