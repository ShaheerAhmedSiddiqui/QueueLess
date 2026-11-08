const home = (req, res) => {
    return res.render('home', {title: 'Less Waiting, Better Service' })
};
const about = (req, res) => {
    return res.render('about', {title: 'About QueueLess'})
}
const contact = (req, res) => {
    return res.render('contact', {title: 'Contact Us'})
}
const login = (req, res) => {
    return res.render('auth/login', {title: 'Login QueueLess'})
}
const register = (req, res) => {
    return res.render('auth/register', {title: 'Register QueueLess'})
}
const forgotPassword = (req, res) => {
    return res.render('auth/forgot-password', {title: 'forgot password'})
}
const resetPassword = (req, res) => {
    return res.render('auth/reset-password', {title: 'reset password'})
}

module.exports  = {
    home,
    about,
    contact,
    login,
    register,
    forgotPassword,
    resetPassword
}