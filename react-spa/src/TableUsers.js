import React, {useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';


const TableUsers = ({data, showArticles, getApiData}) => {

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

    // состояния для модального окна формы
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <caption>Пользователи</caption>
            <Dropdown>
                <button onClick={handleShow} className="btn btn-success"
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
                    <th>Удалить</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nickname}</td>
                        <td>{user.password}</td>
                        <td>
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

export default TableUsers;