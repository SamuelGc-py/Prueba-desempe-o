import { getAuthenticatedUser, logoutUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const navElements = {
        dashboard: document.getElementById('nav-dashboard'),
        createEvent: document.getElementById('nav-create-event'),
        login: document.getElementById('nav-login'),
        register: document.getElementById('nav-register'),
        logoutBtn: document.getElementById('logout-btn')
    };

    const currentUser = getAuthenticatedUser();

    // Helper function to set display style
    const setDisplay = (element, displayValue) => {
        if (element) {
            element.style.display = displayValue;
        }
    };

    if (currentUser) {
        // User logged in: show dashboard and create event links, hide login/register
        setDisplay(navElements.dashboard, 'inline-block');
        setDisplay(navElements.createEvent, 'inline-block');
        setDisplay(navElements.login, 'none');
        setDisplay(navElements.register, 'none');
        setDisplay(navElements.logoutBtn, 'inline-block');
    } else {
        // User not logged in: hide dashboard and create event, show login/register
        setDisplay(navElements.dashboard, 'none');
        setDisplay(navElements.createEvent, 'none');
        setDisplay(navElements.login, 'inline-block');
        setDisplay(navElements.register, 'inline-block');
        setDisplay(navElements.logoutBtn, 'none');
    }

    // Handle logout button click
    if (navElements.logoutBtn) {
        navElements.logoutBtn.addEventListener('click', () => {
            logoutUser();
            // Redirect to the login page after logout (or index.html if preferred)
            window.location.href = './login.html';
        });
    }
});