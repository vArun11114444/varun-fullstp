import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function Login({ setIsAuthenticated }) {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = `${API_BASE_URL}/auth/login`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setIsAuthenticated(true);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else if (error) {
                const details = error?.details?.[0]?.message;
                handleError(details || 'Unable to login');
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message || 'Unable to login');
        }
    };

    return (
        <div className='auth-shell'>
            <section className='auth-hero'>
                <p className='eyebrow'>MERN Auth Suite</p>
                <h1>Welcome back to your workspace.</h1>
                <p className='hero-copy'>
                    Sign in to manage your products, keep your account secure, and continue from where you left off.
                </p>
                <div className='hero-highlights'>
                    <div className='highlight-card'>
                        <span className='highlight-value'>Fast</span>
                        <span className='highlight-label'>JWT authentication flow</span>
                    </div>
                    <div className='highlight-card'>
                        <span className='highlight-value'>Clean</span>
                        <span className='highlight-label'>Responsive product dashboard</span>
                    </div>
                </div>
            </section>

            <section className='auth-card'>
                <div className='auth-card-header'>
                    <p className='section-kicker'>Login</p>
                    <h2>Access your account</h2>
                    <p>Use the email and password you created during signup.</p>
                </div>

                <form className='auth-form' onSubmit={handleLogin}>
                    <div className='field-group'>
                        <label htmlFor='email'>Email Address</label>
                        <input
                            id='email'
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='name@example.com'
                            value={loginInfo.email}
                        />
                    </div>
                    <div className='field-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            id='password'
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password'
                            value={loginInfo.password}
                        />
                    </div>
                    <button className='primary-button' type='submit'>Login</button>
                    <p className='auth-switch'>
                        Don&apos;t have an account?
                        <Link to='/signup'>Create one</Link>
                    </p>
                </form>
            </section>
            <ToastContainer />
        </div>
    );
}

export default Login
