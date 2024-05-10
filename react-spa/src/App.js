import './App.css';
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import axios from 'axios';
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
            const response = await axios.get('https://localhost:5001/check_auth', {
                withCredentials: true
            });
            if (response.status === 200) {
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
        try {
            const response = await axios.get('https://localhost:5001/articles');
            // обновляем массив статей
            setArticles(response.data);
            // обновляем массив счетчиков
            setCounts(Array(response.data.length).fill(0));
        } catch (error) {
            console.error('Ошибка при получении данных с сервера:', error);
        }
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
            <MainPage articles={articles}> </MainPage>
        </div>


    );
}

export default App;
