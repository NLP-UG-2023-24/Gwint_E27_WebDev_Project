let darkmode = localStorage.getItem('dark_mode');
const themeSwitch = document.getElementById('mode_button');

const enableDarkmode = () => {
    document.body.classList.add('dark_mode');
    localStorage.setItem('dark_mode', 'active');
    themeSwitch.innerText = "Light Mode";
};

const disableDarkmode = () => {
    document.body.classList.remove('dark_mode');
    localStorage.setItem('dark_mode', null);
    themeSwitch.innerText = "Dark Mode";
};

// Ustaw poprawny stan po załadowaniu strony
if (darkmode === 'active') {
    enableDarkmode();
} else {
    disableDarkmode();
}

// Obsługa kliknięcia przycisku
themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('dark_mode');
    if (darkmode !== 'active') {
        enableDarkmode();
    } else {
        disableDarkmode();
    }
});
