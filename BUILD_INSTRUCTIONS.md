# Building APK from React App

## Prerequisites

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK and build tools
   - Set up Android Virtual Device (AVD) for testing

2. **Install Java Development Kit (JDK)**
   - Install JDK 11 or higher
   - Set JAVA_HOME environment variable

3. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

## Setup Steps

### 1. Initialize Capacitor (First time only)
```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Initialize Capacitor in your project
npx cap init "Staff Time Management" "com.company.stafftime"
```

### 2. Add Android Platform
```bash
# Add Android platform
npx cap add android
```

### 3. Build and Sync
```bash
# Build the web app
npm run build

# Copy web assets to native project
npx cap copy android

# Sync native dependencies
npx cap sync android
```

### 4. Open in Android Studio
```bash
# Open Android project in Android Studio
npx cap open android
```

## Building APK

### Method 1: Using Android Studio (Recommended)
1. Open the project in Android Studio
2. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. APK will be located in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Method 2: Using Command Line
```bash
# Navigate to android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing)
./gradlew assembleRelease
```

## Testing

### 1. Test on Emulator
```bash
# Run on Android emulator
npx cap run android
```

### 2. Test on Physical Device
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npx cap run android --target=<device-id>`

## Release Build (Production)

### 1. Generate Signing Key
```bash
# Generate keystore file
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### 2. Configure Signing
Create `android/app/build.gradle` signing config:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/my-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release APK
```bash
cd android
./gradlew assembleRelease
```

## Troubleshooting

### Common Issues:

1. **Gradle Build Failed**
   - Ensure Android SDK is properly installed
   - Check ANDROID_HOME environment variable
   - Update Android SDK tools

2. **App Crashes on Launch**
   - Check Android logs: `adb logcat`
   - Verify all permissions in AndroidManifest.xml

3. **White Screen on Launch**
   - Ensure web build is successful: `npm run build`
   - Run `npx cap sync` after building

4. **Network Issues**
   - Add network security config for HTTP requests
   - Check CORS settings on your API server

## File Locations

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Android Source**: `android/` directory
- **Web Build**: `dist/` directory

## Next Steps

1. Test thoroughly on different devices
2. Optimize app performance
3. Add app signing for Play Store
4. Submit to Google Play Store (optional)

## Useful Commands

```bash
# Clean build
npx cap clean android

# Update Capacitor
npm install @capacitor/cli@latest @capacitor/core@latest @capacitor/android@latest

# Check Capacitor doctor
npx cap doctor

# Live reload during development
npx cap run android --livereload --external
```