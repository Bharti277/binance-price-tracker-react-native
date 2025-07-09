# 📱 Binance Live Prices – React Native App

This app connects to the Binance WebSocket API and shows real-time BTC/USDT price updates with timestamp and visual indicators for price changes.

---

## 🛠️ Tech Stack

- React Native (Expo)
- Binance WebSocket API
- FlatList

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Expo CLI:
  ```bash
  npm install -g expo-cli
  ```

## Get started and clone git repo

```bash
  https://github.com/Bharti277/binance-price-tracker-react-native.git
```

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## To generate APK file

1. Expo CLI installed globally

```bash
npm install -g expo-cli
```

2. Install EAS CLI

```bash
npm install -g eas-cli
```

3. Log in to Expo

```bash
eas login
```

4. Configure EAS Build

```bash
eas build:configure
```

5. Build the APK

```bash
eas build -p android --profile preview
```
