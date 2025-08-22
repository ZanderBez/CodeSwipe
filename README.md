# CodeSwipe

![CodeSwipe Header Image](./ReadMeAssets/CodeSwipeHeader.png)
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors](https://img.shields.io/github/contributors/ZanderBez/CodeSwipe.svg?style=for-the-badge)](https://github.com/ZanderBez/CodeSwipe/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/ZanderBez/CodeSwipe.svg?style=for-the-badge)](https://github.com/ZanderBez/CodeSwipe/network/members)
[![Stargazers](https://img.shields.io/github/stars/ZanderBez/CodeSwipe.svg?style=for-the-badge)](https://github.com/ZanderBez/CodeSwipe/stargazers)
[![Issues](https://img.shields.io/github/issues/ZanderBez/CodeSwipe.svg?style=for-the-badge)](https://github.com/ZanderBez/CodeSwipe/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## Table of Contents
- [About CodeSwipe](#about-codeswipe)
- [Built With](#built-with)
- [How To Install](#how-to-install)
- [Features](#features)
- [Future Implementations](#future-implementations)
- [The Idea](#the-idea)
- [Development Process](#development-process)
- [Challenges](#challenges)
- [Usage](#usage)
  - [Try It Yourself](#try-it-yourself)
- [Mockups](#mockups)
- [License](#license)
- [Contributing](#contributing)
- [Authors](#authors)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)
- [Demonstration Video](#demonstration-video)


<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

# About CodeSwipe

**CodeSwipe** is a mobile-first learning app that helps beginner coders build consistent coding habits. It uses a swipe-based flashcard system to turn daily practice into a lightweight game:

- Right — I know it  
- Left — I don’t  

Built with **React Native + Expo** and backed by **Firebase**, CodeSwipe supports secure accounts, progress persistence, and an admin role for managing question decks.

---

## Built With

<p align="left">
  <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" /></a>
  <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white" /></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></a>
  <a href="https://reactnavigation.org/"><img src="https://img.shields.io/badge/React_Navigation-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" /></a>
  <a href="https://github.com/alexbrillant/react-native-deck-swiper"><img src="https://img.shields.io/badge/Deck_Swiper-FF4081?style=for-the-badge&logo=react&logoColor=white" /></a>
</p>

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## How To Install

### Step 1: Clone the Repository

You can either:
- **Option A:** Click "Code" on the [GitHub repo](https://github.com/ZanderBez/CodeSwipe), then choose "Open with GitHub Desktop"
- **Option B:** Use the terminal to clone the repo:

```bash
git https://github.com/ZanderBez/CodeSwipe
```

### Step 2: Open the Project Directory

If using the terminal:
```bash
cd CodeSwipe
```
If using GitHub Desktop, the folder should be opened automatically in your editor after cloning.

### Step 3: Install Dependencies

```bash
npm install
```
### Step 4: Run Locally

```bash
npx expo start
```
- Scan the QR with Expo Go (Android/iOS), or Press a for Android emulator, i for iOS simulator.

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

## Features

| Feature                 | Description |
|--------------------------|-------------|
| Splash + Onboarding      | Introductory screens that guide the user into the app. |
| Authentication           | Sign up / log in with email & password. Google login supported in test mode. |
| Home Page                | Displays user "Code Points" and lets them choose quiz difficulty. |
| Flashcard Quiz           | Swipe-based quiz: right = correct, left = incorrect. |
| Performance Page         | Shows total correct answers across the app, correct answers per deck, and motivational coding quotes from an external API. |
| Profile Management       | Update name, password, and profile picture. |
| Unlockable Card Creation | After answering 20 cards correctly, users can create their own cards per deck. |
| Card Management          | Users can edit or delete the custom cards they created. |


<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

## Future Implementations

- Full Google authentication (production-ready).  
- Advanced progress tracking with streaks and detailed history.  
- Adaptive difficulty and spaced repetition for smarter quizzes.  
- Notifications and daily reminders to build consistent habits.  
- Ability to share and import decks with other users.  
- Community features such as rating or commenting on decks.  


## The Idea

CodeSwipe was created to make learning how to code less overwhelming and more consistent.  
Instead of forcing users into long lessons or complex environments, the app uses quick, swipe based flashcards to help learners build daily habits.  
The focus is on:
- **Simplicity** — one swipe decides if you know the answer or not.  
- **Progression** — Track correct answers across decks.  
- **Motivation** — unlock the ability to create your own cards after proving progress, and get inspired with motivational coding quotes.  
- **Personalization** — users can manage their profile and eventually expand their own decks of cards.  

By combining habit building mechanics with coding concepts, CodeSwipe helps beginners turn small, daily practice sessions into long term skill growth.
<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

## Development Process

### Highlights
- **User-Centered Flow** — Designed a simple onboarding system to introduce the app before users begin.  
- **Authentication Integration** — Implemented Firebase for secure email/password sign-up and login, with Google login in test mode.  
- **Habit-Driven Design** — Added “Code Points” and unlockable features to encourage consistent learning.  
- **Quiz System** — Built a swipe-based flashcard quiz system that allows users to quickly test themselves and reinforce concepts.  
- **Performance Tracking** — Created a dedicated performance page that shows total correct answers, correct answers per deck, and motivational coding quotes from an API.  
- **Profile Management** — Users can update their profile details and upload a profile picture.  
- **Unlockable Features** — Restricted card creation until a user reaches 20 correct answers, gamifying progress.  

### Challenges
- **Google Authentication** — While Firebase login works, production-ready Google OAuth was difficult to set up because of Cloud configuration and testing restrictions.  
- **Swipe Logic** — Ensuring smooth, responsive swipe gestures for quizzes while avoiding accidental swipes was tricky to fine-tune.  
- **Card Creation Rules** — Designing the logic so users only unlock card creation after reaching 20 correct answers required custom state management.  
- **Image Uploads** — Adding and managing profile pictures across devices needed Firebase Storage integration and testing.  
- **Consistency Across Devices** — Making sure the app works in landscape orientation and looks good on both iOS and Android took extra layout adjustments.  
<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

## Usage

After installing and running the app, users can:

1. **Start at the Splash Screen**  
   - The app launches with a splash screen before navigation begins.  

2. **Sign Up / Login**  
   - Create an account with email and password.  
   - Log in with existing credentials.  
   - Google login is supported in test mode.  

3. **Onboarding**  
   - View a quick overlay that explains how CodeSwipe works.  

4. **Home Page**  
   - See “Code Points” representing progress.  
   - Choose quiz difficulty to begin.  

5. **Flashcard Quiz**  
   - Swipe **right** for correct answers.  
   - Swipe **left** for incorrect answers.  

6. **Performance Page**  
   - Track total correct answers across the app.  
   - See correct answers per deck.  
   - Read motivational coding quotes from the integrated API.  

7. **Profile Page**  
   - Update name and password.  
   - Upload or change a profile picture.  

8. **Unlock Card Creation**  
   - Once 20 cards are answered correctly, create your own cards for decks.  
   - Edit or delete your created cards at any time.  

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

### Try It Yourself

Want to try CodeSwipe right now?  

1. Install the **Expo Go** app on your phone:  
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)  
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)  

2. Open Expo Go and scan the QR code below:  

![CodeSwipe QR Code](./assets/QRCode.png)

3. The app will load instantly in Expo Go.  

## Mockups

> Add screenshots to `./ReadMeAssets/` and link them here.

- Splash Screen – `./ReadMeAssets/Splash.png`  
- Sign Up / Login – `./ReadMeAssets/Login.png`  
- Onboarding – `./ReadMeAssets/Onboarding.png`  
- Home Page – `./ReadMeAssets/Home.png`  
- Flashcard Quiz – `./ReadMeAssets/Quiz.png`  
- Performance Page – `./ReadMeAssets/Performance.png`  
- Profile Page – `./ReadMeAssets/Profile.png`  
- Card Creation – `./ReadMeAssets/CardCreation.png`  

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

---

## License

MIT © CodeSwipe. See [LICENSE](./LICENSE) for details.

## Contributing

Contributions are welcome! If you'd like to help improve CodeSwipe:

1. Fork the repo  
2. Create a new branch (`git checkout -b feature/NewFeature`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to the branch (`git push origin feature/NewFeature`)  
5. Open a pull request  


## Authors
- **Zander Bezuidenhout** – [GitHub](https://github.com/ZanderBez)

<p align="right"><a href="#readme-top">[⬆️ Back to top]</a></p>

## Contact

📧 Zander Bezuidenhout — [bezuidenhoutzander8@gmail.com](mailto:bezuidenhoutzander8@gmail.com)  

## Acknowledgements

- **[Armand Pretorius](mailto:armand@openwindow.co.za)** – Lecturer and project supervisor at Open Window, School of Creative Technologies.  
- [Expo](https://expo.dev/) – for powering the app runtime and OTA (over-the-air) updates.  
- [Firebase](https://firebase.google.com/) – for authentication, storage, and database.  
- [React Native Deck Swiper](https://github.com/alexbrillant/react-native-deck-swiper) – for the flashcard swipe functionality.  
- [Open Window — School of Creative Technologies](https://www.openwindow.co.za/) – for academic support during development.  
- [Motivational Quotes API](https://github.com/lukePeavey/quotable) – for providing coding-inspired quotes used on the performance page.  
- [Shields.io](https://shields.io/) – for the README badges.  

## Demonstration Video

You can watch the CodeSwipe demo here:  

[CodeSwipe Demo Video](https://drive.google.com/file/d/YOUR_VIDEO_ID/view?usp=sharing)

