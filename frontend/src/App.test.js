import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders login screen by default', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});
