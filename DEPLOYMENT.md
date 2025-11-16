# Deployment Guide for AI Assistant Chatbot

This guide covers multiple deployment options for your AI assistant chatbot, from simple static hosting to full-stack solutions.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Full-Stack)

Vercel provides excellent support for React apps with API routes and environment variables.

#### Steps:
1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Add AI chatbot"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     ```
     VITE_OPENAI_API_KEY=your_key_here
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_key
     VITE_WALLETCONNECT_PROJECT_ID=your_project_id
     ```

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

#### Vercel Configuration File
Create `vercel.json` in your root directory:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### Option 2: Netlify (Current Setup)

Since you're already on Netlify, here's how to add the chatbot:

#### Steps:
1. **Build and Deploy**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all required environment variables

3. **Netlify Functions (Optional)**
   Create `netlify/functions/` directory for serverless functions:

   ```javascript
   // netlify/functions/chat.js
   exports.handler = async (event, context) => {
     // Proxy OpenAI requests to hide API key
     const { message } = JSON.parse(event.body);
     
     const response = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         model: 'gpt-4o-mini',
         messages: [{ role: 'user', content: message }]
       })
     });
     
     const data = await response.json();
     
     return {
       statusCode: 200,
       body: JSON.stringify(data)
     };
   };
   ```

### Option 3: Railway (Full-Stack with Database)

Railway provides excellent PostgreSQL hosting alongside your app.

#### Steps:
1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Add PostgreSQL Service**
   - Click "New Project" → "Provision PostgreSQL"
   - Note the connection details

3. **Configure Environment Variables**
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   OPENAI_API_KEY=your_key
   WALLETCONNECT_PROJECT_ID=your_id
   ```

4. **Deploy**
   - Railway will automatically deploy on git push

### Option 4: Render (Alternative Full-Stack)

#### Steps:
1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository

2. **Create Web Service**
   - Build Command: `npm run build`
   - Start Command: `npm run preview`
   - Environment: Node

3. **Add PostgreSQL Database**
   - Create new PostgreSQL service
   - Connect to your web service

## 🔧 Backend API Setup (Optional)

For production, consider moving OpenAI API calls to the backend to protect your API key.

### Express.js Backend

Create `server/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(express.json());
app.use(limiter);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });
    
    res.json({
      message: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Update Frontend to Use Backend

Modify `src/lib/openai.ts`:

```typescript
export class ChatbotService {
  async generateResponse(
    messages: ChatMessage[],
    context: ChatContext
  ): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages, context })
      });
      
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('API Error:', error);
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }
}
```

## 🌐 Decentralized Deployment (Web3)

### IPFS with Fleek

For truly decentralized hosting:

#### Steps:
1. **Install Fleek CLI**
   ```bash
   npm install -g @fleek-platform/cli
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy to IPFS**
   ```bash
   fleek sites deploy
   ```

4. **Configure Domain**
   - Add custom domain in Fleek dashboard
   - Update DNS records

### Arweave Deployment

For permanent storage:

```bash
# Install Arweave CLI
npm install -g arweave-deploy

# Deploy
arweave-deploy dist --key-file wallet.json
```

## 📊 Monitoring & Analytics

### Plausible Analytics Setup

Add to your `index.html`:

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Custom Analytics Dashboard

The built-in admin dashboard provides:
- Real-time chat metrics
- Lead conversion tracking
- User engagement analytics
- Export functionality

## 🔒 Security Considerations

### Environment Variables
Never commit sensitive keys to git:

```bash
# .gitignore
.env
.env.local
.env.production
```

### API Rate Limiting
Implement rate limiting to prevent abuse:

```typescript
// Rate limiting middleware
const rateLimiter = new Map();

export const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  if (!rateLimiter.has(ip)) {
    rateLimiter.set(ip, []);
  }
  
  const requests = rateLimiter.get(ip);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= 10) { // 10 requests per minute
    return false;
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
};
```

### CORS Configuration
Configure CORS properly for production:

```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check API key validity
   - Verify sufficient credits
   - Check rate limits

2. **Supabase Connection Issues**
   - Verify URL and anon key
   - Check RLS policies
   - Ensure tables exist

3. **Web3 Connection Problems**
   - Verify WalletConnect Project ID
   - Check supported chains
   - Test with different wallets

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies

### Debug Mode

Enable debug logging:

```typescript
// Add to your main component
if (import.meta.env.DEV) {
  console.log('Debug mode enabled');
  // Add debug logs
}
```

## 📈 Performance Optimization

### Code Splitting
Implement lazy loading:

```typescript
const Chatbot = lazy(() => import('./components/Chatbot'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Chatbot />
</Suspense>
```

### Bundle Analysis
Analyze your bundle size:

```bash
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer dist/assets/*.js
```

### Caching Strategy
Implement service worker for offline support:

```javascript
// public/sw.js
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    // Don't cache API requests
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API keys secured
- [ ] Rate limiting implemented
- [ ] Error handling added
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] Security headers set
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy in place

---

Choose the deployment option that best fits your needs. For most use cases, Vercel or Netlify provide excellent performance and ease of use.