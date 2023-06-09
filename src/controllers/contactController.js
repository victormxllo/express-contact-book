const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    res.render('contact.ejs', {
        contact: {}
    });
};

exports.register = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.register();

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contact/index'));
            return;
        };

        req.flash('success', 'Successfully registered contact.');
        req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('error-page.ejs');
    };
};

exports.editIndex = async (req, res) => {
    if (!req.params.id) {
        console.log('There is no id.');
        return res.render('error-page.ejs');
    };

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        console.log('There is no contact with this id.')
        return res.render('error-page.ejs');
    };

    res.render('contact.ejs', { contact });
};

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) {
            console.log('There is no id.');
            return res.render('error-page.ejs');
        };

        const contact = new Contact(req.body);
        await contact.edit(req.params.id);

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contact/index'));
            return;
        };

        req.flash('success', 'Contact updated successfully.');
        req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
        return;
    } catch (e) {
        console.log(e);
        res.render('error-page.ejs');
    };
};

exports.delete = async (req, res) => {
    try {
        if (!req.params.id) {
            console.log('There is no id.');
            return res.render('error-page.ejs');
        };

        const contact = await Contact.delete(req.params.id);
        if (!contact) {
            console.log('There is no contact with this id.')
            return res.render('error-page.ejs');
        };

        req.flash('success', 'Contact deleted successfully.');
        req.session.save(() => res.redirect('/contact/index'));
        return;
    } catch (e) {
        console.log(e);
        res.render('error-page.ejs');
    }
};