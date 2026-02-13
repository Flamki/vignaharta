import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';

const App: React.FC = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: unobserve if you want it to happen only once
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Function to observe elements
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
      elements.forEach(el => observer.observe(el));
    };

    // Initial observation
    observeElements();

    // Re-observe when DOM changes (simple polling for this assignment structure)
    const interval = setInterval(observeElements, 1000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
