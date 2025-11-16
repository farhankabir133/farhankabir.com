import { Project, Skill, Experience, Testimonial, BlogPost } from '../types/portfolio';

export const projects: Project[] = [
  {
    id: 'pub1',
    title: 'Depression Detection From Social Media Textual Data Using Natural Language Processing and Machine Learning Techniques',
    description: 'Published at ICCIT 2023',
    longDescription: 'This paper presents a novel approach for detecting depression from social media textual data using NLP and ML techniques. Published at ICCIT 2023.',
  image: 'https://images.pexels.com/photos/256369/pexels-photo-256369.jpeg?auto=compress&fit=crop&w=800&q=80',
    category: 'Publication',
    technologies: ['NLP', 'ML', 'Social Media'],
    liveUrl: 'https://ieeexplore.ieee.org/document/10441612',
    featured: true
  },
  {
    id: 'pub2',
    title: 'Emotion Detection From Textual Data Using Natural Language Processing and Machine Learning Techniques',
    description: 'Published at ECCE 2025',
    longDescription: 'This paper explores emotion detection from text using advanced NLP and ML methods. Published at ECCE 2025.',
  image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&fit=crop&w=800&q=80',
    category: 'Publication',
    technologies: ['NLP', 'ML', 'Emotion Detection'],
    liveUrl: 'https://ieeexplore.ieee.org/document/11013284',
    featured: true
  },
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with advanced features',
    longDescription: 'A comprehensive e-commerce platform built with React and Node.js, featuring real-time inventory management, payment processing, and advanced analytics dashboard.',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Secure and intuitive mobile banking experience',
    longDescription: 'A cutting-edge mobile banking application with biometric authentication, real-time transactions, and AI-powered financial insights.',
    image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Mobile Development',
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    liveUrl: 'https://example.com',
    featured: true
  },
  {
    id: '3',
    title: 'Brand Identity Design',
    description: 'Complete brand identity for tech startup',
    longDescription: 'Comprehensive brand identity design including logo, color palette, typography, and brand guidelines for an innovative tech startup.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Design',
    technologies: ['Adobe Creative Suite', 'Figma'],
    featured: false
  },
  {
    id: '4',
    title: 'AI Dashboard',
    description: 'Machine learning analytics dashboard',
    longDescription: 'Advanced analytics dashboard powered by machine learning algorithms, providing real-time insights and predictive analytics.',
    image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Data Science',
    technologies: ['Python', 'TensorFlow', 'D3.js', 'React'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: '5',
    title: 'SaaS Platform',
    description: 'Multi-tenant SaaS application',
    longDescription: 'Scalable SaaS platform with multi-tenancy, subscription management, and comprehensive admin dashboard.',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Web Development',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'AWS'],
    liveUrl: 'https://example.com',
    featured: false
  },
  {
    id: '6',
    title: 'UI/UX Case Study',
    description: 'Complete redesign of healthcare app',
    longDescription: 'Comprehensive UX research and UI redesign of a healthcare application, improving user engagement by 150%.',
    image: 'https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    category: 'Design',
    technologies: ['Figma', 'Adobe XD', 'Principle'],
    featured: false
  }
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
  { name: 'Team Collaboration', level: 90, category: 'soft', icon: '🤝' }
];

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    company: 'Auto Spark',
    period: 'Aprill 2024 - Present',
    description: 'Developed responsive web applications, ensuring compatibility across various browsers and devices. Implemented efficient front-end solutions and collaborated on back-end development tasks.',
    current: true
  },
  {
    id: '2',
    title: 'Frontend Developer (Remote)',
    company: 'Hire My Tech',
    period: '2022 - 2023',
    description: 'Built responsive web applications using React and modern JavaScript frameworks, collaborated with design team on user experience improvements.'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    period: '2020 - 2021',
    description: 'Created user-centered designs for web and mobile applications, conducted user research and usability testing.'
  },
  {
    id: '4',
    title: 'Junior Developer',
    company: 'WebAgency',
    period: '2019 - 2020',
    description: 'Developed websites and web applications, learned modern development practices and agile methodologies.'
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Product Manager',
    company: 'TechCorp Inc.',
    content: 'Working with Farhan has been an absolute pleasure. Their attention to detail and ability to translate complex requirements into elegant solutions is remarkable.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'CEO',
    company: 'StartupXYZ',
    content: 'Farhan delivered exceptional results on our project. The quality of work and professionalism exceeded our expectations. Highly recommended!',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'Design Director',
    company: 'Creative Agency',
    content: 'The collaboration was seamless and the final product was beyond what we imagined. Kabir brings both technical expertise and creative vision.',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 5
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt: 'Exploring emerging trends and technologies that will shape the future of web development.',
    date: '2024-01-15',
    readTime: 8,
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Design Systems at Scale',
    excerpt: 'How to build and maintain design systems for large organizations.',
    date: '2024-01-10',
    readTime: 12,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Performance Optimization Tips',
    excerpt: 'Practical strategies to improve web application performance.',
    date: '2024-01-05',
    readTime: 6,
    image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Development'
  }
];

// Publication entries should be in the projects array above, not here.