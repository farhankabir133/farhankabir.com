<!-- Hero Section -->
<p align="center">
  <img src="https://images.pexels.com/photos/34100614/pexels-photo-34100614.png" alt="FK's Personal Site" height="120" />
</p>
<h1 align="center">🤖 A Personal Modern Website with AI Assistant Chatbot</h1>
<p align="center">
  <b>A next-generation AI assistant chatbot integrated with Farhan Kabir's portfolio.<br>Modern UX, Web3 features, and real-time analytics — right on your site.</b>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation--setup">Install</a> •
  <a href="#-configuration">Config</a> •
  <a href="#-deployment">Deploy</a> •
  <a href="#-analytics-dashboard">Analytics</a> •
  <a href="#-security-best-practices">Security</a> •
  <a href="#-customization">Customization</a> •
  <a href="#-contributing">Contribute</a> •
  <a href="#-future-enhancements">Roadmap</a>
</p>

---

## 🚀 Features

### 🤖 Core AI
- **Conversational AI:** GPT-4o-mini powered, answers about portfolio, skills & projects
- **Context Memory:** Remembers conversation context for natural chats
- **Voice Chat:** Speech recognition & text-to-speech
- **Lead Capture:** Secure visitor contact collection

### ✨ Modern UX/UI
- **Glassmorphism UI:** Stylish, translucent chat window
- **Lottie Animations:** Interactive, animated chatbot icon
- **Dark/Light Mode:** Automatic theme adaptation
- **Responsive:** Mobile and desktop optimized
- **Floating Button:** Minimal, easy access

### 🌐 Web3 Ready
- **Wallet Connect:** MetaMask + EVM wallet support
- **Identity/Badge System:** Wallet-based login & NFT/badge rewards
- **Decentralized Friendly:** Built for Web3 infra

### 📈 Analytics & Admin
- **Real-time Analytics:** Track usage, leads & engagement
- **Admin Dashboard:** Leads, metrics, CSV export, conversion tracking

---

## 🛠 Tech Stack

| Frontend           | Backend & DB     | Web3           |
| ------------------ | --------------- | -------------- |
| React 18 + TS      | Supabase        | Wagmi          |
| Framer Motion      | PostgreSQL (RLS)| Web3Modal      |
| Tailwind CSS       | OpenAI API      | Viem           |
| Lottie React       |                 |                |
| React Speech Kit   |                 |                |

---

## 📦 Installation & Setup

<details>
<summary><b>1. Clone & Install</b></summary>

```bash
git clone https://github.com/farhankabir133/portfolio.git
cd portfolio
npm install
```
</details>

<details>
<summary><b>2. Environment Variables</b></summary>

Create a `.env` file in root:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_PLAUSIBLE_DOMAIN=your_domain_here # optional
```
</details>

<details>
<summary><b>3. Supabase Setup</b></summary>

- Create a project at [supabase.com](https://supabase.com)
- Run migration in `supabase/migrations/create_chatbot_tables.sql` in SQL editor
</details>

<details>
<summary><b>4. OpenAI API</b></summary>

- Get API key from [OpenAI Platform](https://platform.openai.com)
- Add to your `.env`
</details>

<details>
<summary><b>5. Web3 Setup (optional)</b></summary>

- Get Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
- Add to `.env`
- Configure chains in `src/lib/web3.ts`
</details>

<details>
<summary><b>6. Run Locally</b></summary>

```bash
npm run dev
```
</details>

---

## 🔧 Configuration

### 🧠 Customizing AI Responses

Edit `SYSTEM_PROMPT` in `src/lib/openai.ts`:
```ts
const SYSTEM_PROMPT = `You are Farhan Kabir's AI assistant...
// Customize instructions here
`;
```

### 🏅 Add Badges (Web3)
Add badge objects in `src/lib/web3.ts`:
```ts
export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'new_badge',
    name: 'Badge Name',
    description: 'Badge description',
    image: '/badges/badge.svg',
    criteria: 'How to earn'
  },
  // ...
];
```

### 📊 Custom Analytics Events

Track events:
```ts
import { analytics } from '../lib/analytics';
analytics.track('custom_event', { property1: 'value1' });
```

---

## 🚀 Deployment

| Platform    | Steps |
|-------------|-------|
| **Vercel**  | Connect repo → Set env vars → Deploy on push |
| **Netlify** | Build: `npm run build` → Deploy `/dist` → Add env vars |
| **Custom**  | Deploy with Railway, Render, or DigitalOcean App Platform |

---

## 📊 Analytics Dashboard

- Access: Click 👁️ (eye icon) in bottom-left.
- Features: Real-time metrics, session & wallet stats, export leads, time filtering (24h/7d/30d).

---

## 🔒 Security Best Practices

- **API Keys:** Never expose in frontend code. Use env vars.
- **Database:** Row-level security enabled by default.
- **Rate Limiting:** Prevent abuse (example in code):

```ts
const rateLimiter = {
  requests: new Map(),
  limit: 10,
  window: 60000
};
```

---

## 🎨 Customization

- **Theming:** Edit `tailwind.config.js`:
```js
colors: { primary: { 500: '#your-primary-color', 600: '#your-primary-dark' } }
```
- **Animations:** Replace Lottie data in `ChatbotIcon.tsx`.

---

## 🤝 Contributing

1. Fork & branch: `git checkout -b feature/your-feature`
2. Commit: `git commit -am 'Add feature'`
3. Push: `git push origin feature/your-feature`
4. PR: Submit pull request

---

## 📝 License

MIT — see [LICENSE](LICENSE)

---

## 🆘 Support

- Email: <farhankabir133@gmail.com>
- [GitHub Issues](https://github.com/farhankabir133/portfolio/issues)

---

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced NLP & intent recognition
- [ ] Calendar/meeting scheduling
- [ ] Custom AI model fine-tuning
- [ ] Token gating, DAO integration
- [ ] Mobile app version
- [ ] ML-powered analytics

---



<div align="center">

## 💖 Acknowledgments

**Built with ❤️ by [Farhan Kabir](https://fkabir.netlify.app)**

### 🙏 Special Thanks

- **OpenAI** for GPT-4o-mini API
- **Supabase** for backend infrastructure  
- **Vercel** for hosting and deployment
- **React Community** for amazing tools and libraries

### ⭐ Show Your Support

If you found this project helpful, please consider:

[![Star on GitHub](https://img.shields.io/github/stars/farhankabir133/fk?style=social)](https://github.com/farhankabir133/fk)
[![Follow on Twitter](https://img.shields.io/twitter/follow/farhankabir133?style=social)](https://twitter.com/farhankabir133)
[![Connect on LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=social&logo=linkedin)](https://linkedin.com/in/farhankabir133)

---

<p align="center">
  <strong>🚀 Ready to build something amazing? Let's connect!</strong>
</p>

</div>


###Important Build Commands for production
rm -rf dist
npm run build
firebase deploy --only hosting







