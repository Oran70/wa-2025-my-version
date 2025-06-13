import React, {useState} from "react";
import emailjs from "@emailjs/browser";
import "./ContactForm.css";

export const emailCredentials = {
    serviceId: 'serviceId',
    templateId: 'templateID',
    userId: 'userId',
};

const ContactForm = () => {
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = document.getElementById("contact-form"); // Reference the form by its id
        emailjs
            .sendForm(
                emailCredentials.serviceId,
                emailCredentials.templateId,
                form,
                emailCredentials.userId
            )
            .then(
                (result) => {
                    setIsEmailSent(true);
                    result.text = "Message sent successfully!";
                    result.status = 200;
                },
                (error) => {
                    setIsEmailSent(false);
                    error.text = "Something went wrong, please try again!";
                    error.status = 400;
                }
            );
        form.reset(); // Reset the form
    };

    return (
        <div className="contact-page">
            <div className="contact-address">
                <h2>ISW Gasthuislaan</h2>
                <p>Gasthuislaan 145</p>
                <p>2694 BE 's-Gravenzande</p>
                <p>Postbus 78 2690 AB 's-Gravenzande</p>
                <p>(0174) 44 55 88</p>
                <p>gasthuislaan@isw.info</p>
            </div>
            <form
                id="contact-form"
                onSubmit={ handleFormSubmit }
                className="contact-form">
                <div className="contact-formgroup">
                    <label htmlFor="first-name">Voornaam</label>
                    <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        required
                    />
                    <label htmlFor="last-name">Achternaam</label>
                    <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        required
                    />
                    <label htmlFor="name-student">Naam leerling</label>
                    <input
                        type="text"
                        name="name-student"
                        id="name-student"
                    />
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        required
                    />
                    <label htmlFor="message">Bericht</label>
                    <textarea
                        name="message"
                        id="message"
                        rows="4"
                        required
                    />
                </div>
                <div className="button-container">
                    <button
                        type="submit"
                        className="submit-button"
                        onClick={ () => setIsEmailSent(false) }
                    >
                        Verstuur
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
