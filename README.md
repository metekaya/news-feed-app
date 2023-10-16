<h1 align="center">
    <a href="http://localhost:3000/" target="blank_">
        <img height="100" alt="HTTPie" src="/frontend/src/assets/logo-transparent.png" />
    </a>
    <br>
    Spotlight • Personalized News Feed App(interview task)
</h1>
Welcome to Spotlight! This application aims to provide users with a personalized news experience tailored to their interests and preferences, with a user friendly UI.

## Features

- **Personalized News Feed**: Receive news articles based on your chosen topics and preferences.
- **Customizable Preferences**: Tailor your news feed by selecting specific categories and topics that interest you.
- **Save Preferences**: You can save your desired preferences and they'll be loaded when you login.
- **User-Friendly Interface**: Enjoy a clean and intuitive user interface for seamless navigation and reading.


## Prerequisites

Before you begin, ensure that you have met the following requirements:

- You have installed Node.js. If not, you can download it from [here](https://nodejs.org/).

## Installation

1. Clone the repository using the following command:\
```git clone https://github.com/metekaya/news-feed-app.git```
2. Navigate to the `frontend` folder and install the necessary dependencies:\
```cd frontend```\
```npm install```
3. Run the `frontend`:\
```npm run start```
4. Open a new terminal or split the current one (`Ctrl+Shift+5` on VS Code) and navigate to the `server` folder and install the necessary dependencies:\
```cd server```\
```npm install```
5. Copy the `config.example.json` file and rename it to `config.json` in the `server` folder:

6. Open the `config.json` file and add your API credentials and necessary configurations. In this case your `secretKey`, `newsAPIKey` and `guardianAPIKey`
   - You can get your NewsAPI key from [here](https://newsapi.org/register) by registering and creating a new api key.
   - You can get your GuardianAPI key from [here](https://bonobo.capi.gutools.co.uk/register/developer) by registering and creating a new api key.
7. Run the `server` and the app is ready to operate:\
```npm run dev```

## Usage

- After installing and running the application, you can navigate to the [http://localhost:3000/](http://localhost:3000/).
- Sign up by clicking [Create an account](http://localhost:3000/signup) button on login page, and create an account.
- Login to your account with your account information.
- Customize your news feed preferences to get articles tailored to your interests.
- You can save your applied filters with Save Preferences button.
- You can search any article by their title, author, source and publication date.
- Enjoy reading the latest news in your personalized news feed!

## Contact

If you have any questions, suggestions, or feedback, please feel free to reach out to me at [metekaya55@gmail.com](mailto:your-email@example.com)

---

Thank you for using the Spotlight! I hope you enjoy your personalized news experience.
