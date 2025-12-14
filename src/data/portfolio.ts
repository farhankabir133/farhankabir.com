import { Project, Skill, Experience, Testimonial, BlogPost } from '../types/portfolio';

export const projects: Project[] = [
  {
    id: 'pub1',
    title: 'Depression Detection From Social Media Textual Data Using Natural Language Processing and Machine Learning Techniques',
    description: 'Published at ICCIT 2023',
    longDescription:
      'This paper presents a novel approach for detecting depression from social media textual data using NLP and ML techniques. Published at ICCIT 2023.',
    image:
      'https://images.pexels.com/photos/256369/pexels-photo-256369.jpeg?auto=compress&fit=crop&w=800&q=80',
    category: 'Publication',
    technologies: ['NLP', 'ML', 'Social Media'],
    liveUrl: 'https://ieeexplore.ieee.org/document/10441612',
    featured: true,
  },
  {
    id: 'pub2',
    title: 'Emotion Detection From Textual Data Using Natural Language Processing and Machine Learning Techniques',
    description: 'Published at ECCE 2025',
    longDescription:
      'This paper explores emotion detection from text using advanced NLP and ML methods. Published at ECCE 2025.',
    image:
      'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&fit=crop&w=800&q=80',
    category: 'Publication',
    technologies: ['NLP', 'ML', 'Emotion Detection'],
    liveUrl: 'https://ieeexplore.ieee.org/document/11013284',
    featured: true,
  },
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with advanced features',
    longDescription:
      'A comprehensive e-commerce platform built with React and Node.js, featuring real-time inventory management, payment processing, and advanced analytics dashboard.',
    image:
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Secure and intuitive mobile banking experience',
    longDescription:
      'A cutting-edge mobile banking application with biometric authentication, real-time transactions, and AI-powered financial insights.',
    image:
      'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Mobile Development',
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    id: '3',
    title: 'Brand Identity Design',
    description: 'Complete brand identity for tech startup',
    longDescription:
      'Comprehensive brand identity design including logo, color palette, typography, and brand guidelines for an innovative tech startup.',
    image:
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Design',
    technologies: ['Adobe Creative Suite', 'Figma'],
    featured: false,
  },
  {
    id: '4',
    title: 'AI Dashboard',
    description: 'Machine learning analytics dashboard',
    longDescription:
      'Advanced analytics dashboard powered by machine learning algorithms, providing real-time insights and predictive analytics.',
    image:
      'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Data Science',
    technologies: ['Python', 'TensorFlow', 'D3.js', 'React'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: '5',
    title: 'SaaS Platform',
    description: 'Multi-tenant SaaS application',
    longDescription:
      'Scalable SaaS platform with multi-tenancy, subscription management, and comprehensive admin dashboard.',
    image:
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Web Development',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'AWS'],
    liveUrl: 'https://example.com',
    featured: false,
  },
  {
    id: '6',
    title: 'UI/UX Case Study',
    description: 'Complete redesign of healthcare app',
    longDescription:
      'Comprehensive UX research and UI redesign of a healthcare application, improving user engagement by 150%.',
    image:
      'https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Design',
    technologies: ['Figma', 'Adobe XD', 'Principle'],
    featured: false,
  },
  // --- Added portfolio projects extracted from repository analysis ---
  {
    id: 'altmail',
    title: 'AltMail (Alter_Mail)',
    description: 'Theme: Privacy Mail — Disposable email service for anonymous email generation',
    longDescription:
      'AltMail is a privacy-first disposable email service built to generate anonymous inboxes quickly. Key features include spam protection, ephemeral inboxes, and OAuth-based optional authentication.',
    image:
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&h=900&q=80',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Firebase'],
    liveUrl: '',
    githubUrl: 'https://github.com/farhankabir133/Alter_Mail',
    featured: true,
  },
  {
    id: 'fkhub',
    title: 'FK Hub (fkhub)',
    description: 'Theme: AI Assistant — Next-generation AI assistant chatbot integrated with portfolio',
    longDescription:
      'FK Hub integrates an AI chatbot, Web3 wallet support, voice chat, and analytics. Built with Supabase backend, OpenAI/Gemini integrations, and real-time features.',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&h=900&q=80',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Supabase', 'OpenAI', 'Wagmi', 'Viem'],
    liveUrl: '',
    githubUrl: 'https://github.com/farhankabir133/fkhub',
    featured: true,
  },
  {
    id: 'farhansite',
    title: 'farhankabir.com',
    description: 'Theme: Personal AI Portfolio — Personal portfolio with integrated AI assistant and Web3 features',
    longDescription:
      'The live personal site featuring an AI chatbot, blog, portfolio, and Web3 integrations. Built with React, TypeScript, Tailwind and hosted via GitHub Pages / Firebase assets.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&h=900&q=80',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Firebase'],
    liveUrl: 'https://farhankabir.com',
    githubUrl: 'https://github.com/farhankabir133/farhankabir.com',
    featured: true,
  },
  {
    id: 'interactiq',
    title: 'InteractIQ',
    description: 'Theme: Social Automator — AI-powered social media automation assistant',
    longDescription:
      'InteractIQ automates social interactions and content workflows using Google GenAI and integration with social APIs, analytics and visualizations.',
    image:
      'https://images.pexels.com/photos/35186747/pexels-photo-35186747.png?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Google GenAI', 'Recharts', 'Framer Motion'],
    liveUrl: '',
    githubUrl: 'https://github.com/farhankabir133/InteractIQ',
    featured: false,
  },
  {
    id: 'emotion-detection',
    title: 'Emotion Detection',
    description: 'Theme: Affective AI — Emotion detection from textual and multimodal inputs',
    longDescription:
      'Emotion Detection project uses NLP and ML techniques to extract emotional signals from text (and optional multimodal inputs). Includes experiments, model training, and visualization dashboards.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&h=900&q=80',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Express', 'Drizzle ORM', 'Neon'],
    liveUrl: '',
    githubUrl: 'https://github.com/farhankabir133/Emotion-Detection',
    featured: true,
  },
  {
    id: 'the-ink-home',
    title: 'The Ink Home',
    description: 'Theme: Literary Platform — Modern publication site for essays and stories',
    longDescription:
      'The Ink Home is a Medium-style platform for creative essays and storytelling, featuring GSAP/Pixi.js powered animations, offline-ready article pages, and a lightweight CMS for authors.',
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&h=900&q=80',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'GSAP', 'Pixi.js', 'Tailwind CSS'],
    liveUrl: '',
    githubUrl: 'https://github.com/farhankabir133/The-Ink-Home',
    featured: true,
  },
];

export const skills: Skill[] = [
  { name: 'React', level: 95, category: 'technical', icon: '⚛️' },
  { name: 'TypeScript', level: 90, category: 'technical', icon: '📘' },
  { name: 'Node.js', level: 88, category: 'technical', icon: '🟢' },
  { name: 'Python', level: 85, category: 'technical', icon: '🐍' },
  { name: 'AWS', level: 80, category: 'technical', icon: '☁️' },
  { name: 'Docker', level: 75, category: 'technical', icon: '🐳' },
  { name: 'UI/UX Design', level: 92, category: 'creative', icon: '🎨' },
  { name: 'Figma', level: 90, category: 'creative', icon: '🔧' },
  { name: 'Adobe Creative Suite', level: 85, category: 'creative', icon: '🎭' },
  { name: 'Motion Graphics', level: 78, category: 'creative', icon: '🎬' },
  { name: 'Leadership', level: 88, category: 'soft', icon: '👑' },
  { name: 'Communication', level: 92, category: 'soft', icon: '💬' },
  { name: 'Problem Solving', level: 95, category: 'soft', icon: '🧩' },
  { name: 'Team Collaboration', level: 90, category: 'soft', icon: '🤝' },
];

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    company: 'Auto Spark',
    period: 'Aprill 2024 - Present',
    description:
      'Developed responsive web applications, ensuring compatibility across various browsers and devices. Implemented efficient front-end solutions and collaborated on back-end development tasks.',
    current: true,
  },
  {
    id: '2',
    title: 'Frontend Developer (Remote)',
    company: 'Hire My Tech',
    period: '2022 - 2023',
    description:
      'Built responsive web applications using React and modern JavaScript frameworks, collaborated with design team on user experience improvements.',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    period: '2020 - 2021',
    description: 'Created user-centered designs for web and mobile applications, conducted user research and usability testing.',
  },
  {
    id: '4',
    title: 'Junior Developer',
    company: 'WebAgency',
    period: '2019 - 2020',
    description: 'Developed websites and web applications, learned modern development practices and agile methodologies.',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Product Manager',
    company: 'TechCorp Inc.',
    content:
      'Working with Farhan has been an absolute pleasure. Their attention to detail and ability to translate complex requirements into elegant solutions is remarkable.',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'CEO',
    company: 'StartupXYZ',
    content:
      'Farhan delivered exceptional results on our project. The quality of work and professionalism exceeded our expectations. Highly recommended!',
    avatar:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'Design Director',
    company: 'Creative Agency',
    content:
      'The collaboration was seamless and the final product was beyond what we imagined. Kabir brings both technical expertise and creative vision.',
    avatar:
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt: 'Exploring emerging trends and technologies that will shape the future of web development.',
    date: '2024-01-15',
    readTime: 8,
    image:
      'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Design Systems at Scale',
    excerpt: 'How to build and maintain design systems for large organizations.',
    date: '2024-01-10',
    readTime: 12,
    image:
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Design',
  },
  {
    id: '3',
    title: 'Performance Optimization Tips',
    excerpt: 'Practical strategies to improve web application performance.',
    date: '2024-01-05',
    readTime: 6,
    image:
      'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Development',
  },
];

// Publication entries should be in the projects array above, not here.