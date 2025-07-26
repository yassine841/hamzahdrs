# Soccer Manager - Deployment Guide

This guide will help you deploy the Soccer Manager PWA to various platforms.

## 🚀 Quick Start

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd soccer-manager
   npm run setup
   ```

2. **Configure Firebase**
   - Copy `.env.example` to `.env`
   - Update Firebase configuration in `src/services/firebase.ts`
   - Or use environment variables (recommended for production)

3. **Build and Test**
   ```bash
   npm run build
   npm run preview
   ```

## 🔥 Firebase Deployment

### Prerequisites
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project with Authentication and Firestore enabled

### Steps
1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not done)**
   ```bash
   firebase init
   ```
   Select:
   - Firestore
   - Hosting
   - Use existing project

3. **Deploy**
   ```bash
   npm run firebase:deploy
   ```

### Firebase Configuration
Update `src/services/firebase.ts` with your project config:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🔧 Vercel Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app.vercel.app`

## 📦 Netlify Deployment

### Option 1: Drag and Drop
1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area

### Option 2: Git Integration
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🐳 Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

Build and run:
```bash
docker build -t soccer-manager .
docker run -p 80:80 soccer-manager
```

## 🔒 Security Considerations

### Firebase Security Rules
Ensure your Firestore rules are properly configured (see `firestore.rules`):
- Users can only access their own data
- Tournament and match data is read-only for clients
- Proper authentication checks

### Environment Variables
Never commit sensitive data:
- Add `.env` to `.gitignore`
- Use environment variables for all secrets
- Different configs for dev/staging/production

### HTTPS
Always use HTTPS in production:
- Firebase Hosting provides HTTPS by default
- Vercel and Netlify also provide HTTPS
- Configure custom domains with SSL certificates

## 📊 Monitoring and Analytics

### Firebase Analytics
Add to your Firebase config:
```typescript
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

### Performance Monitoring
```typescript
import { getPerformance } from "firebase/performance";
const perf = getPerformance(app);
```

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Firebase Crashlytics for crash reporting

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 🧪 Testing Before Deployment

1. **Build Test**
   ```bash
   npm run build
   npm run preview
   ```

2. **Lighthouse Audit**
   - Check PWA score
   - Performance metrics
   - Accessibility compliance

3. **Device Testing**
   - Test on various screen sizes
   - Verify PWA installation works
   - Check offline functionality

## 📱 PWA Deployment Checklist

- [ ] Manifest.json configured
- [ ] Service worker registered
- [ ] Icons (192x192, 512x512) added
- [ ] HTTPS enabled
- [ ] Lighthouse PWA score > 90
- [ ] Install prompt works
- [ ] Offline functionality tested

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Check Firebase config
   - Verify project permissions
   - Check network connectivity

2. **Build Failures**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all imports

3. **PWA Installation Issues**
   - Ensure HTTPS is enabled
   - Check manifest.json syntax
   - Verify service worker registration

4. **Routing Issues**
   - Configure server for SPA routing
   - Check Firebase hosting rewrites
   - Verify React Router setup

### Getting Help
- Check browser console for errors
- Review Firebase logs
- Check deployment platform logs
- Review GitHub issues and documentation

---

**Note**: This is a comprehensive deployment guide. Choose the platform that best fits your needs and follow the corresponding section.