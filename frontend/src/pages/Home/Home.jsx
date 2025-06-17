import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Plus, Minus, Bell, Shield } from 'lucide-react';
import './Home.css';
import homeImage from '../../assets/homePage.png';
import quoteToekomst from '../../assets/quoteToekomst.png';
import imageHome from '../../assets/imageHome.png';


const Home = () => {
    const navigate = useNavigate();
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const features = [
        {
            icon: <Calendar className="feature-icon" />,
            title: "Eenvoudig plannen",
            description: "Het maken van een afspraak verloopt in een paar overzichtelijke stappen. U hoeft hiervoor niet in te loggen."
        },
        {
            type: "image",
            image: quoteToekomst,
            alt: "Quote Toekomst"
        },
        {
            icon: <Bell className="feature-icon" />,
            title: "Automatische bevestiging",
            description: "Na het plannen van de afspraak ontvangt u per e-mail een bevestiging met alle details."
        },
        {
            icon: <Users className="feature-icon" />,
            title: "Voor ouders en medewerkers",
            description: "Het platform is ontworpen voor zowel ouders als medewerkers."
        },
        {
            type: "image",
            image: imageHome,
            alt: "Foto impressie"
        },
        {
            icon: <Shield className="feature-icon" />,
            title: "Privacy en veiligheid",
            description: "Wij gaan zorgvuldig om met uw gegevens. Alles is in lijn met de AVG-richtlijnen."
        }
    ];

    const stepsParents = [
        {
            number: "1",
            title: "Vul unieke code in",
            description: "U ontvangt een unieke toegangscode per brief of e-mail"
        },
        {
            number: "2",
            title: "Kies medewerker en tijdslot",
            description: "Selecteer de medewerker waarmee u wilt spreken en een beschikbaar tijdslot"
        },
        {
            number: "3",
            title: "Bevestiging",
            description: "Na het plannen van de afspraak ontvangt u per e-mail een bevestiging"
        }
    ];

    const stepsTeachers = [
        {
            number: "1",
            title: "Log in",
            description: "Gebruik uw gebruikernaam en wachtwoord om in te loggen op het lerarenportaal"
        },
        {
            number: "2",
            title: "Stel beschikbaarheid in",
            description: "Geef aan op welke dagen en tijden u beschikbaar bent"
        },
        {
            number: "3",
            title: "Beheer afspraken",
            description: "Bekijk een overzicht van geplande afspraken"
        }
    ];

    const faqs = [
        {
            question: "Hoe maak ik een account aan?",
            answer: "Als medewerker ontvangt u van school uw inloggegevens. Als ouder hoeft u niet in te loggen, u ontvangt een unieke code per brief of via e-mail waarmee u een afspraak kunt plannen."
        },
        {
            question: "Kunnen ouders afspraken annuleren?",
            answer: "Ouders kunnen een gemaakte afspraak annuleren via de bevestigingsmail of door contact op te nemen met de school."
        },
        {
            question: "Kunnen medewerkers afspraken annuleren?",
            answer: "Medewerkers kunnen afspraken annuleren bij ziekte of afmelding van ouders via het portaal."
        },
        {
            question: "Kan ik afspraken maken voor meerdere kinderen?",
            answer: "Ja, u kunt voor elk kind apart een afspraak inplannen met de bijbehorende unieke code."
        },
        {
            question: "Wat als ik mijn afspraak moet verzetten?",
            answer: "Neem contact op met de school of annuleer via de bevestigingsmail om een nieuwe afspraak te maken."
        }
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="home-page">
                <div className="home-welcome">
                    <h1 className="hero-title">Welkom bij EduPlan!</h1>
                    <p className="hero-subtitle">
                        Goede gesprekken tussen ouders en school dragen bij aan de ontwikkeling van iedere leerling. EduPlan maakt het plannen van deze gesprekken nu eenvoudiger dan ooit.
                    </p>
                    <div className="button-row">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/code")}
                        >
                            Ouder
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate("/login")}>
                            Medewerker
                        </button>
                    </div>
                </div>

                <div className="home-image">
                    <div className="home-image-placeholder">
                        <img src={homeImage} alt="EduPlan illustratie" className="home-image-img bordered-image" />
                    </div>
                </div>
            </div>

            {/* Section Divider */}
            <div className="section-divider"></div>

            {/* How It Works Section - Parents */}
            <div className="section-container">
                <h2 className="section-title">Hoe werkt het voor ouders?</h2>
                <div className="steps-grid">
                    {stepsParents.map((step, index) => (
                        <div key={index} className="step-card">
                            <div className="step-number">
                                {step.number}
                            </div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Divider */}
            <div className="section-divider"></div>

            {/* How It Works Section - Teachers */}
            <div className="section-container">
                <h2 className="section-title">Hoe werkt het voor leraren?</h2>
                <div className="steps-grid">
                    {stepsTeachers.map((step, index) => (
                        <div key={index} className="step-card">
                            <div className="step-number">
                                {step.number}
                            </div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Divider */}
            <div className="section-divider"></div>

            {/* Features Section */}
            <div className="section-container">
                <h2 className="section-title">Waarom EduPlan?</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className={feature.type === "image" ? "feature-image-card" : "feature-card"}>
                            {feature.type === "image" ? (
                                <img src={feature.image} alt={feature.alt} className="feature-image" />
                            ) : (
                                <>
                                    <div className="feature-icon-container">
                                        {feature.icon}
                                    </div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Divider */}
            <div className="section-divider"></div>

            {/* FAQ Section */}
            <div className="section-container">
                <h2 className="section-title">Veelgestelde Vragen</h2>
                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                                {openFAQ === index ?
                                    <Minus className="faq-icon" /> :
                                    <Plus className="faq-icon" />
                                }
                            </button>
                            {openFAQ === index && (
                                <div className="faq-answer">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Klaar om te beginnen?</h2>
                    <p className="cta-subtitle">
                    </p>
                    <button
                        className="btn btn-primary btn-large"
                        onClick={() => navigate("/code")}
                    >
                        Ik ben een ouder
                    </button>
                    <button
                        className="btn btn-primary btn-large"
                        onClick={() => navigate("/login")}
                    >
                        Ik ben een medewerker
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;