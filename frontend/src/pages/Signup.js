import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email and password are required');
        }
        try {
            const url = `${API_BASE_URL}/auth/signup`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details?.[0]?.message;
                handleError(details || 'Unable to signup');
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message || 'Unable to signup');
        }
    };

    return (
        <div className='auth-shell'>
            <section className='auth-hero auth-hero-alt'>
                <p className='eyebrow'>Secure Onboarding</p>
                <h1>Create an account that feels production-ready.</h1>
                <p className='hero-copy'>
                    Get started with a clean signup flow, protected product routes, and a dashboard you can build on.
                </p>
                <div className='hero-list'>
                    <span>Protected routes</span>
                    <span>Token-based access</span>
                    <span>Responsive UI foundation</span>
                </div>
            </section>

            <section className='auth-card'>
                <div className='auth-card-header'>
                    <p className='section-kicker'>Signup</p>
                    <h2>Build your account</h2>
                    <p>Fill in a few details and you&apos;ll be ready to sign in.</p>
                </div>

                <form className='auth-form' onSubmit={handleSignup}>
                    <div className='field-group'>
                        <label htmlFor='name'>Full Name</label>
                        <input
                            id='name'
                            onChange={handleChange}
                            type='text'
                            name='name'
                            autoFocus
                            placeholder='Varun Pawar'
                            value={signupInfo.name}
                        />
                    </div>
                    <div className='field-group'>
                        <label htmlFor='email'>Email Address</label>
                        <input
                            id='email'
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='name@example.com'
                            value={signupInfo.email}
                        />
                    </div>
                    <div className='field-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            id='password'
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Create a secure password'
                            value={signupInfo.password}
                        />
                    </div>
                    <button className='primary-button' type='submit'>Create account</button>
                    <p className='auth-switch'>
                        Already have an account?
                        <Link to='/login'>Login</Link>
                    </p>
                </form>
            </section>
            <ToastContainer />
        </div>
    );
}

export default Signup
