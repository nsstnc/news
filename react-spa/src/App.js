import './App.css';
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import MainPage from './MainPage';
import LoginPage from "./LoginPage";
import AdminPage from "./AdminPage";

function App() {

   return (
        <Provider store={store}>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

function Admin() {
    const [authenticated, setAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const checkAuth = async () => {
        try {
            const response = await axios.get('https://localhost:5001/check_auth', {
                withCredentials: true
            });
            if (response.status === 200) {
                console.log('Успешная аутентификация!');
                setAuthenticated(true);
                setUserName(response.data);
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
            <AdminPage checkAuth={checkAuth} userName={userName}> </AdminPage>
        );
    }
}

function Login() {
    return (
        <LoginPage> </LoginPage>
    );
}


function Main() {

    return (
        <div class="container">
            <MainPage> </MainPage>
        </div>


    );
}

export default App;
