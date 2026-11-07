const home = (req, res) => {
    return res.render('home', {title: 'Less Waiting, Better Service' })
};
const about = (req, res) => {
    return res.render('about', {title: 'About QueueLess'})
}
const contact = (req, res) => {
    return res.render('contact', {title: 'About QueueLess'})
}
export {
    home,
    about,
    contact
}