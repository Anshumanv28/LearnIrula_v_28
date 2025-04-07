# LearnIrula App

This is a React Native/Expo application for learning the Irula language.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd LearnIrula_v_28
```

2. Install dependencies:
```bash
# Using npm
npm install

# OR using yarn
yarn install
```

3. Start the development server:
```bash
# Using npm
npm start

# OR using yarn
yarn start
```

## Running the App

### For Android
```bash
npm run android
# OR
yarn android
```

### For iOS
```bash
npm run ios
# OR
yarn ios
```

### For Web
```bash
npm run web
# OR
yarn web
```

## Additional Setup

### Firebase Configuration
The app uses Firebase for authentication and other services. Make sure to:
1. Create a Firebase project
2. Add your Firebase configuration to the appropriate configuration files
3. Enable the required Firebase services (Authentication, etc.)

### Environment Variables
Create a `.env` file in the root directory with necessary environment variables:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
# Add other required environment variables
```

## Troubleshooting

If you encounter any issues:
1. Clear the cache:
```bash
npm start -- --clear
# OR
yarn start --clear
```

2. Reinstall dependencies:
```bash
rm -rf node_modules
npm install
# OR
yarn install
```

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details. 