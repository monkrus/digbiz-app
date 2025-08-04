# digbiz‑app

`digbiz‑app` is a cross‑platform Expo/React‑Native application for creating and sharing digital business cards.  Users can sign in with an email and password, edit their personal card details, and share their card via a unique URL.  Card data is stored in Firebase Firestore and authentication is handled by Firebase Auth.

## Features

* **Authentication** – email/password authentication powered by Firebase Auth.
* **Business card management** – users can create, edit and save their contact details, which are persisted in Firestore.
* **Sharing** – cards can be viewed by others by navigating to a URL containing the user’s ID.

## Getting started

### Prerequisites

* [Node.js](https://nodejs.org/) ≥ 18
* [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally (`npm install -g expo-cli`)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/monkrus/digbiz-app.git
   cd digbiz-app
   ```

2. Install dependencies.  Use `expo install` to ensure compatible native dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root with your own Firebase configuration (see `.env` in this repo for an example).  **Never commit real API keys to version control.**

   ```bash
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefg1234567
   ```

### Running the app

To run the development server, execute:

```bash
expo start
```

Then follow the instructions in the terminal to open the app on an iOS simulator, Android emulator or a physical device via the Expo Go app.

### Testing

This project currently does not include tests.  To add tests, install `jest` and `@testing-library/react-native` and write unit tests for components and Firebase interactions.

## Security considerations

Sensitive values (API keys, service account IDs, etc.) should be stored in environment variables and **never** committed to version control.  See the `.env` example above.  In production, you should also configure Firestore security rules to restrict access to the `cards` collection so that users can only read/write their own document.

## Contributing

Pull requests are welcome.  For major changes, please open an issue first to discuss what you would like to change.

## License

This project is provided without a license.  Please add an appropriate open‑source license if you intend to share or distribute it.