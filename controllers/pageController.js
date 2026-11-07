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
export {
    home,
    about,
    contact,
    login
}