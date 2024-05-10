import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import axios from 'axios';

function LoginPage() {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    // переменная для показа модального окна
    const [showError, setShowError] = useState(false);


    const handleSubmit = async (e) => {


        e.preventDefault();
        // Отправка данных на сервер для аутентификации

        try {
            const response = await axios.post('https://localhost:5001/login', {
                nickname,
                password
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log('Успешная аутентификация!');
                // Перенаправление на защищенную страницу
                window.location.href = '/admin';
            } else {
                setShowError(true);
                console.log(response);
                throw new Error('Ошибка');
            }
        } catch (error) {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
            setShowError(true);
        }


    };
    return (
        <div>
            <form className="login-form" onSubmit={handleSubmit} >
                <div className="form-group" style={{marginBottom: "10px"}}>
                    <input type="name" className="form-control" id="exampleInputEmail1" placeholder="имя"
                           onChange={(e) => setNickname(e.target.value)}/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="пароль"
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button style={{width: "100%"}} type="submit" className="btn btn-primary">Войти</button>
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
                                    onClick={() => setShowError(false)}>Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;