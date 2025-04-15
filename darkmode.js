let darkmode = localStorage.getItem('dark_mode')
const themeSwitch = document.getElementById('mode_button')

const enableDarkmode = () => {
    document.body.classList.add('dark_mode')
    localStorage.setItem('dark_mode', 'active')
}

const disableDarkmode = () => {
    document.body.classList.remove('dark_mode')
    localStorage.setItem('dark_mode', null)
}

if (darkmode === 'active'){
    enableDarkmode()
}

themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('dark_mode')
    if (darkmode !== 'active'){
        enableDarkmode()
    }
    else{
        disableDarkmode()
    }
})