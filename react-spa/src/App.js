import './App.css';
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import MainPage from './MainPage';


function App() {

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                </Routes>
            </div>
        </Router>
    );
}

function Admin() {
    const [authenticated, setAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            const response = await fetch('https://localhost:5001/check_auth', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                console.log('Успешная аутентификация!');
                setAuthenticated(true);
            } else {
                console.log(response);
                window.location.href = '/login';
                throw new Error('Ошибка');
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (authenticated) {
        return (
            <div>
                <h2>Добро пожаловать в админ-панель</h2>
            </div>
        );
    } else {
        return (
            <div>
                <h2>Не удалось войти</h2>
            </div>
        )
    }
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // переменная для показа модального окна
    const [showError, setShowError] = useState(false);


    const handleSubmit = async (e) => {


        e.preventDefault();
        // Отправка данных на сервер для аутентификации

        await fetch('https://localhost:5001/login', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({email, password}),
        }).then(response => {
            if (!response.ok) {
                setShowError(true); // Показываем модальное окно
                console.log(response);
                throw new Error('Ошибка');

            }
            // Обработка успешного ответа, если требуется
            // Обработка успешной аутентификации
            console.log('Успешная аутентификация!');
            // Перенаправление на защищенную страницу
            window.location.href = '/admin_panel';
        })
            .catch(error => {
                // Обработка ошибок
                console.error('Произошла ошибка:', error);
                setShowError(true); // Показываем модальное окно
            });


    };

    return (


        <div class="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exampleInput1">Nickname</label>
                    <input type="name" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                           onChange={(e) => setEmail(e.target.value)}/>

                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1"
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            {/* Модальное окно для отображения ошибки */}
            <div className="modal" tabIndex="-1" role="dialog" style={{display: showError ? 'block' : 'none'}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ошибка</h5>
                        </div>
                        <div className="modal-body">
                            Не удалось войти
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                    onClick={() => setShowError(false)}>Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
        ;
}


function Main() {

    // массив статей
    const [articles, setArticles] = useState([]);
    // массив счетчиков для каждого элемента article
    const [counts, setCounts] = useState([]);


    // функция получения данных с бэка
    const getApiData = async () => {
        const response = await fetch(
            "https://localhost:5001/articles",
        ).then((response) => response.json());
        // обновляем массив статей
        setArticles(response);
        // обновляем массив счетчиков
        setCounts(Array(response.length).fill(0));
    };

    useEffect(() => {
        getApiData();
    }, []);


    console.log(counts)


    // функция обновления счетчиков
    const incrementCounts = (index) => {
        setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index]++;
            return newCounts;
        });
    };


    return (
        <div class="container">
            <MainPage articles={articles} counts={counts} incrementCounts={incrementCounts}> </MainPage>
        </div>


    );
}

export default App;
