import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function Home({ setIsAuthenticated }) {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        setIsAuthenticated(false);
        handleSuccess('User logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `${API_BASE_URL}/products`;
                const headers = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                };
                const response = await fetch(url, headers);
                const result = await response.json();
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('loggedInUser');
                        setIsAuthenticated(false);
                        navigate('/login');
                    } else {
                        handleError(result.message || 'Unable to fetch products');
                    }
                    return;
                }
                setProducts(result);
            } catch (err) {
                handleError(err.message || 'Unable to fetch products');
            }
        };

        fetchProducts();
    }, [navigate, setIsAuthenticated]);

    return (
        <div className='dashboard-shell'>
            <section className='dashboard-hero'>
                <div>
                    <p className='eyebrow'>Dashboard Overview</p>
                    <h1>Welcome back, {loggedInUser || 'there'}.</h1>
                    <p className='hero-copy'>
                        Your protected dashboard is live. This layout gives your MERN project a cleaner starting point for real product features.
                    </p>
                </div>
                <button className='secondary-button' onClick={handleLogout}>Logout</button>
            </section>

            <section className='stats-grid'>
                <article className='stat-card'>
                    <span className='stat-label'>Products Loaded</span>
                    <strong>{products.length}</strong>
                </article>
                <article className='stat-card'>
                    <span className='stat-label'>Top Category</span>
                    <strong>Electronics</strong>
                </article>
                <article className='stat-card'>
                    <span className='stat-label'>Session</span>
                    <strong>Authenticated</strong>
                </article>
            </section>

            <section className='products-panel'>
                <div className='panel-header'>
                    <div>
                        <p className='section-kicker'>Inventory</p>
                        <h2>Featured products</h2>
                    </div>
                    <span className='panel-chip'>Live API data</span>
                </div>

                <div className='product-grid'>
                    {products.map((item, index) => (
                        <article className='product-card' key={`${item.name}-${index}`}>
                            <div className='product-icon'>{item.name.charAt(0).toUpperCase()}</div>
                            <div className='product-copy'>
                                <h3>{item.name}</h3>
                                <p>Curated product from your protected backend route.</p>
                            </div>
                            <div className='product-price'>Rs. {item.price.toLocaleString()}</div>
                        </article>
                    ))}
                </div>
            </section>
            <ToastContainer />
        </div>
    );
}

export default Home
