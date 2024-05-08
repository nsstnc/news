import './App.css';
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import MainPage from './MainPage';
import LoginPage from "./LoginPage";
import AdminPage from "./AdminPage";

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

                throw new Error('Ошибка');
            }
        } catch (error) {
            window.location.href = '/login';
            console.error('Произошла ошибка:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (authenticated) {
        return (
            <AdminPage> </AdminPage>
        );
    }
}

function Login() {
    return (
        <LoginPage> </LoginPage>
    );
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
