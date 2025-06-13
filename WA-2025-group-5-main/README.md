# WA-2025-group-5 EduPlan Afspraakplanner
### **Eleonora A. || Eline C. || Ensar I. || Furkan O.**

## Vision Statement
Voor Mentoren, decanen, teamleiders en ouders die oudergesprekken niet meer handmatig willen plannen is De Afspraakplanner
een digitale oplossing die het oudercontact op middelbare scholen vereenvoudigt en structureert; dit in tegenstelling tot handmatige briefjes, 
Excel-bestanden of losse e-mails. Ons product biedt een AVG-proof platform waarmee mentoren, decanen en teamleiders hun 
beschikbaarheid kunnen aangeven en ouders op een laagdrempelige manier afspraken kunnen boeken. 

## Doel
Het doel is om een functionele, gebruikersvriendelijke en visuele aantrekkelijke website te bouwen die aansluit bij de 
eisen en wensen van de gebruikers. Aan de hand van een visiedocument gan we een applicatie implementeren die 
een oplossing biedt voor de gekozen doel. In de eerst instantie is dat een mock-up van de applicatie waar we de rest 
van het semester mee aan de slag gaan.
Nadat ons visiedocument goedgekeurd is (vanaf week 10), gaan we daadwerkelijk aan de slag met het bouwen van de webapplicatie. 
Wij maken een ontwerpdocument op basis van ons visiedocument.

## Minimum eisen voor een voldoende:

    De website bevat minimaal 5 pagina's en bestaat uit zowel een front-end als een back-end.
    Er is een werkende inlogportaal voor de beheerder van de website.
    De front-end is geïmplementeerd met behulp van het React framework.
    De back-end is geïmplementeerd met node.js.
    De benodigde (input) data moet worden opgeslagen in een zelfgekozen database.
    De website moet worden gedeployed in een Azure-omgeving.
    Bij het UI/UX-designproces moeten minimaal 5 designrichtlijnen uit de opgegeven literatuur worden geïmplementeerd.
    De website moet beschermd zijn tegen de meest voorkomende beveiligingsproblemen.
    Het product wordt gerealiseerd via iteraties (zie kopje Project aanpak).
    De code wordt wekelijks gepusht naar Github als een nieuwe versie.
    Verder zijn jullie vrij om deze eisen aan te vullen met andere die het beste bij jullie oplossing passen.

## Extra:

    In de back-end maak je gebruik van de voordelen van een ORM-framework.
    Daar waar mogelijk is, gewone gebruikers moeten zich kunnen registreren voor extra mogelijkheden, terwijl niet-geregistreerde gebruikers toegang moeten hebben tot een deel van de website.

## Project aanpak

Als richtlijn voor het uitvoeren van dit project gaan we de volgende stappen volgen:

**Een project backlog opstellen:** Stel een backlog op met alle functies en functionaliteiten die in de webapplicatie moeten worden opgenomen. 
Prioriteer de functies op basis van de belangrijkheid en urgentie.
**Sprint plannen /daily scrum:** Plan sprints van drie weken, waarin een aantal items van de backlog worden geselecteerd om aan te werken. 
Hier worden de geselecteerde items in kleinere taken opgesplitst en worden de taken toegewezen aan teamleden. Wij gan hiervoor Trello kunnen gebruiken.
**Sprint uitvoeren:** Gedurende de sprint werken de teamleden aan hun toegewezen taken en houden ze elkaar op de hoogte van hun voortgang.
**Sprint review en retrospective:** Aan het einde van elke sprint wordt er een review gehouden om de voltooide taken te laten 
zien en feedback te verzamelen. Deze review sessies vinden plaats op de donderdag op het einde van de sprint. 
In de retrospective bespreekt het team hoe het ging tijdens de sprint doormiddel van een presentatie.
In de retrospective bespreekt het team hoe het ging tijdens de sprint en welke verbeteringen kunnen worden aangebracht in 
de toekomstige sprints. 
**Iteraties:** Op basis van de feedback uit de sprint review en retrospective, kan de backlog worden aangepast en 
prioriteiten worden gesteld voor de volgende sprint. Het proces van sprint planning, uitvoering en review wordt herhaald 
totdat de webapplicatie volledig is ontwikkeld.

#### **Oplevering (week 18):**

Bij oplevering wordt het volgende verwacht:

    Lever alle code van de webapplicatie in (de eindversie uit GitHub) als zip-bestand en een geactualiseerde versie van het ontwerpdocument als word-bestand met nier meer dan 25 pagina's.
    De webapplicatie draaien in Azure (gebruik hiervoor Azure for students account). In het ontwerpdocument hebben we de login gegevens staan die gebruikt kunnen worden om de webapplicatie te testen.
    Een eigen logboek (een uitbreiding van het document uit sprint 1 en 2) met de verantwoording van je eigen aandeel in het project, je eigen ontwikkeling, de samenwerking met de medestudenten, etc…


# Edu-Plan Project

A monorepo containing both frontend and backend for the Edu-Plan application.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/WA-2025-group-5.git
   cd WA-2025-group-5
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install
   
   # Install workspace dependencies
   npm run setup
   ```

### Running the Application

1. Start both frontend and backend in development mode
   ```bash
   npm run dev
   ```

2. Access the application
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:8000](http://localhost:8000)
    - API Documentation: [http://localhost:8000](http://localhost:8000)

### Other Commands

- Start in production mode
   ```bash
   npm start
   ```

- Build the frontend
   ```bash
   npm run build
   ```

- Run only the frontend
   ```bash
   npm run dev:frontend
   ```

- Run only the backend
   ```bash
   npm run dev:backend
   ```

## Project Structure

```
WA-2025-group-5/
├── .env                     # Shared environment variables
├── package.json             # Root package.json with workspaces
├── frontend/                # Frontend React application
│   ├── src/                 # Frontend source code
│   └── package.json         # Frontend-specific dependencies
└── backend/                 # Backend Express application
    ├── src/                 # Backend source code
    └── package.json         # Backend-specific dependencies
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:8000
SESSION_SECRET=your-secret-key-here
```

## DATABASE ORM SEQUELIZE MIGRATIONS
# Run this to apply the migration and populate data

# 1. Run the migration
npx sequelize-cli db:migrate

# 2. Run the seeder
npx sequelize-cli db:seed:all

# Or if you want to run a specific seeder
npx sequelize-cli db:seed --seed 20250519000001-demo-users.js

# To undo (rollback)
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:seed:undo:all


bash# Check all tables exist
psql -d eduplandb -c "\dt"

# Check table structures
psql -d eduplandb -c "\d user"
psql -d eduplandb -c "\d student"

# Check data in a table
psql -d eduplandb -c "SELECT * FROM user"
psql -d eduplandb -c "SELECT * FROM student"
# Check all databases
psql -l
# Check all tables exist
psql -d eduplandb -c "\dt"

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Sources

Color palette inspiration: https://colorhunt.co/palette/034c53007074f38c79ffc1b4
SVG Generator: https://www.svgrepo.com
SVG Illustrations: https://lukaszadam.com/illustrations 
