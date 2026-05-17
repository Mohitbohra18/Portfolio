
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  useCallback,
  useMemo
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  ArrowUp,
  ExternalLink,
  Code2,
  Cpu,
  Brain,
  Sparkles,
  Award,
  Trophy,
  Globe,
  Terminal,
  Quote,
  MapPin,
  Download,
  Filter,
  ChevronRight,
  Stars,
  BookOpen,
  GitBranch,
  Rocket,
  Zap,
  BarChart3,
  GraduationCap,
  Mic2,
  Keyboard,
  LayoutGrid,
  Search
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

// ---------------- THEME CONTEXT ----------------

const ThemeContext = createContext();

const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ---------------- CUSTOM HOOKS ----------------

// Typing effect
const useTypingEffect = (text, speed = 80, delay = 400) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed((prev) => prev + text.charAt(i));
        i += 1;
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);
  return displayed;
};

// Intersection Observer hook
const useSectionObserver = (sectionIds) => {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-45% 0px -55% 0px",
      threshold: 0.1
    };
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveId(id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
};

// Cursor trail effect
const useCursorTrail = (length = 8) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const handleMove = (e) => {
      setPoints((prev) => {
        const next = [...prev, { x: e.clientX, y: e.clientY }];
        if (next.length > length) next.shift();
        return next;
      });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [length]);

  return points;
};

// Scroll progress
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const pct = docHeight ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
};

// ---------------- UTILS ----------------

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const yOffset = -80; // navbar height
  const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
  window.scrollTo({
    top: y,
    behavior: "smooth"
  });
};

// Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const glassClasses =
  "backdrop-blur-xl bg-white/60 dark:bg-[#242424]/80 border border-white/30 dark:border-white/5 shadow-[0_20px_60px_rgba(15,23,42,0.25)]";

// ---------------- MAIN APP ----------------

const PortfolioApp = () => {
  const sectionIds = [
    "home",
    "about",
    "timeline",
    "skills",
    "projects",
    "achievements",
    "contact"
  ];
  const { theme, toggleTheme } = useTheme();
  const activeId = useSectionObserver(sectionIds);
  
  const subtitle = "Full-Stack Developer | AI/ML Enthusiast | Problem Solver";
  const scrollProgress = useScrollProgress();
  const cursorTrail = useCursorTrail(10);
  const [navOpen, setNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Projects filter
  const [projectFilter, setProjectFilter] = useState("All");
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Skills filter
  const [skillFilter, setSkillFilter] = useState("All");
  const [skillSearch, setSkillSearch] = useState("");

  // Achievements filter
  const [achievementFilter, setAchievementFilter] = useState("All");

  // Contact form
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState("idle"); // idle | loading | success | error

  // Initial loader
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const themeBg =
    theme === "light"
      ? "bg-[#FDF3E7] text-[#3D3D3D]"
      : "bg-[#050505] text-[#F5F5F5]";
  const primaryColor = "#FF8E72";
  const accentColor = "#FF6F61";

  // -------- DATA --------

  const timelineItems = [
    {
      title: "Academic Foundation",
      subtitle: "Completed 10th & 12th with strong foundation in mathematics",
      date: "2020 - 2022",
      icon: GraduationCap,
      color: "from-amber-400 to-orange-500"
    },
    {
      title: "BTech in Computer Science",
      subtitle: "Began journey into software engineering and CS fundamentals",
      date: "2022",
      icon: BookOpen,
      color: "from-sky-400 to-blue-500"
    },
    {
      title: "Mastered Programming Fundamentals",
      subtitle: "Python, C++, Java, and data structures & algorithms",
      date: "2022 - 2023",
      icon: Code2,
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Full-Stack Development Journey",
      subtitle: "Built proficiency in React, Node.js, Flask, and databases",
      date: "2023",
      icon: Globe,
      color: "from-purple-400 to-indigo-500"
    },
    {
      title: "Markdown Transpiler Project",
      subtitle: "Created developer productivity tool for content conversion",
      date: "2023",
      icon: Keyboard,
      color: "from-pink-400 to-rose-500"
    },
    {
      title: "Jarvis Voice Assistant",
      subtitle: "Developed voice-controlled OS assistant with AI integration",
      date: "2024",
      icon: Mic2,
      color: "from-orange-400 to-red-500"
    },
    {
      title: "ML Research & Publications",
      subtitle: "Published papers on solar fault detection and fertilizer systems",
      date: "2024",
      icon: Award,
      color: "from-lime-400 to-emerald-500"
    }
  ];

  const skillsData = {
    "Languages & Frameworks": [
      "Python",
      "C++",
      "Java",
      "JavaScript",
      "React.js",
      "Node.js",
      "Express.js",
      "Flask",
      "HTML/CSS",
      "Redux",
      "Bootstrap",
      "TailwindCSS"
    ],
    "AI/ML & Data Science": [
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "OpenCV",
      "Computer Vision",
      "NLP"
    ],
    "Database & Tools": [
      "MongoDB",
      "MySQL",
      "Mongoose",
      "Git",
      "GitHub",
      "VS Code",
      "Jupyter Notebook",
      "Postman",
      "Linux",
      "RESTful APIs"
    ]
  };

  const skillRadarData = [
    { skill: "AI/ML & Deep Learning", value: 90 },
    { skill: "Full-Stack Web Dev", value: 85 },
    { skill: "Python & Flask", value: 88 },
    { skill: "React & Frontend", value: 82 },
    { skill: "Research & Analysis", value: 87 }
  ];

  const projects = [
    {
      id: 1,
      title: "Weather Forecast Website | Real-Time Climate Information Platform",
      category: ["Web Dev"],
      badge: "Frontend-focused",
      description:
        "Developed a responsive weather forecasting web application that provides real-time weather updates based on user location and city search.",
      tech: ["React, JavaScript, OpenWeather API, HTML, CSS"],
      features: [
        "Developed a responsive weather forecasting web application that provides real-time weather updates based on user location and city search",
        "Implemented API integration with OpenWeather to fetch live temperature, humidity, wind speed, and weather conditions",
        "Designed a clean and intuitive user interface using React components, ensuring smooth user experience across devices",
        "Optimized state management and data rendering for fast, accurate weather information delivery"
      ],
      github: "https://github.com/Mohitbohra18/weather-Forcast",
      stats: { stars: 95, forks: 22, issues: 3 },
      learned: [
        "Developed a responsive weather forecasting web application that provides real-time weather updates based on user location and city search"
      ],
      details:
        "Designed a clean and intuitive user interface using React components, ensuring smooth user experience across devices"
    },
    {
      id: 2,
      title: "Solar Fault Detection System",
      category: ["AI/ML"],
      badge: "Research",
      description:
        "Novel computer vision system for automated detection and classification of solar panel defects using deep learning.",
      tech: ["Python", "TensorFlow", "Keras", "OpenCV"],
      features: [
        "Automated defect detection in solar panels",
        "Classification of micro-cracks, hotspots, degradation",
        "80% reduction in fault detection time",
        "Peer-reviewed research publication"
      ],
      github: "https://github.com/mohitbohra18",
      stats: { stars: 128, forks: 34, issues: 5 },
      learned: [
        "Training deep learning models on image datasets",
        "Optimizing computer vision pipelines for production",
        "Writing and presenting academic research papers"
      ],
      details:
        "Developed and published a deep learning system that identifies solar panel defects with high accuracy. Reduced fault detection time by 80%, enabling proactive maintenance. Research presented at AUTOCOM conference and published in peer-reviewed journal."
    },
    {
      id: 3,
      title: "Jarvis Voice Assistant",
      category: ["AI/ML", "Backend"],
      badge: "Voice OS",
      description:
        "Voice-controlled operating system assistant enabling hands-free execution of system operations through natural language commands.",
      tech: ["Python", "Flask", "SpeechRecognition", "pyttsx3"],
      features: [
        "Natural language processing for commands",
        "Application control and file management",
        "Volume adjustment and web searches",
        "Hands-free, accessible system control"
      ],
      github: "https://github.com/mohitbohra18",
      stats: { stars: 156, forks: 28, issues: 4 },
      learned: [
        "Building voice recognition pipelines",
        "Integrating system-level command execution",
        "Designing accessible user interfaces"
      ],
      details:
        "Built a comprehensive voice recognition pipeline with Flask backend that executes system operations via natural language. Enhanced accessibility and productivity for users through intuitive voice-based interaction design."
    },
    {
      id: 4,
      title: "Markdown-to-HTML Transpiler",
      category: ["Compilers", "Web Dev"],
      badge: "Dev Tool",
      description:
        "Web-based transpiler converting Markdown syntax to clean, responsive HTML markup with error handling and preview.",
      tech: ["Python", "Flask", "markdown2"],
      features: [
        "Complex markdown parsing (tables, code blocks, lists)",
        "Real-time preview functionality",
        "Clean, responsive HTML output",
        "Error handling and validation"
      ],
      github: "https://github.com/Mohitbohra18/Transpiler-mdHTML-",
      stats: { stars: 72, forks: 15, issues: 2 },
      learned: [
        "Implementing parser logic for markdown syntax",
        "Building scalable Flask applications",
        "Streamlining content publishing workflows"
      ],
      details:
        "Created a web-based transpiler that handles complex markdown elements and converts them to clean HTML. Streamlined workflow for content creators and developers, saving time and reducing errors in documentation and web publishing."
    },
    {
      id: 5,
      title: "MANREGA Management System",
      category: ["Web Dev", "Backend", "Ongoing"],
      badge: "Ongoing",
      description:
        "Comprehensive management system for MANREGA program workflow, worker tracking, and administrative operations.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      features: [
        "Worker registration and tracking",
        "Project management and allocation",
        "Payment processing and reporting",
        "Role-based access control (Admin/Worker)"
      ],
      github: "https://github.com/Mohitbohra18/Mgnerega-Dashboard",
      stats: { stars: 48, forks: 8, issues: 6 },
      learned: [
        "Building complex full-stack applications",
        "Implementing role-based authentication",
        "Managing state in large React applications"
      ],
      details:
        "Currently developing a full-stack MERN application to digitize MANREGA program operations. Features include worker registration, project allocation, payment processing, and comprehensive reporting dashboards for administrators."
    },
    {
      id: 6,
      title: "AI Interview Preparation Assistant",
      category: ["AI/ML", "Web Dev", "Ongoing"],
      badge: "Ongoing",
      description:
        "AI-powered platform providing personalized interview preparation with mock interviews, feedback, and skill assessment.",
      tech: ["Python", "React", "OpenAI API", "Flask", "NLP"],
      features: [
        "AI-generated interview questions",
        "Real-time response evaluation",
        "Personalized feedback and improvement tips",
        "Track progress across multiple domains"
      ],
      github: "https://github.com/your-ai-interview-prep",
      stats: { stars: 89, forks: 19, issues: 8 },
      learned: [
        "Integrating AI APIs into applications",
        "Natural language processing for evaluation",
        "Building interactive learning experiences"
      ],
      details:
        "Developing an intelligent interview preparation platform using AI to generate contextual questions, evaluate responses, and provide actionable feedback. Helps candidates prepare for technical and behavioral interviews with personalized learning paths."
    }
  ];

  const achievementItems = [
    {
      id: 1,
      title: "Research Publication",
      category: "Research",
      icon: Award,
      count: 1,
      details:
        "Published peer-reviewed research paper on AI-based Solar Fault Detection in national technical journal, demonstrating expertise in ML for renewable energy.",
      badge: "Published Researcher"
    },
    {
      id: 2,
      title: "Conference Presentations",
      category: "Research",
      icon: Mic2,
      count: 2,
      details:
        "Presented technical research at AUTOCOM (Automation and Computing) and CYBERCOM (Cybersecurity and Communication) conferences.",
      badge: "Speaker"
    },
    {
      id: 3,
      title: "Event Leadership",
      category: "Leadership",
      icon: Cpu,
      count: 5,
      details:
        "Organized and managed multiple university-level technical events, overseeing logistics, team coordination, and successful execution.",
      badge: "Event Organizer"
    },
    {
      id: 4,
      title: "Community Service",
      category: "Leadership",
      icon: Trophy,
      count: 2,
      details:
        "Earned NSS B & C Certificates for community service initiatives and social leadership, demonstrating commitment to societal impact.",
      badge: "Social Leader"
    },
    {
      id: 5,
      title: "Real-World Impact Projects",
      category: "Impact",
      icon: Zap,
      count: 4,
      details:
        "Built solutions achieving 15% farmer yield improvements and 80% faster solar fault detection, creating measurable real-world value.",
      badge: "Impact Maker"
    },
    {
      id: 6,
      title: "Technical Stack Mastery",
      category: "Learning",
      icon: Code2,
      count: 25,
      details:
        "Achieved proficiency in 25+ technologies across full-stack development, AI/ML, databases, and cloud platforms through hands-on projects.",
      badge: "Polyglot Developer"
    }
  ];

  // -------- FILTER CONFIGURATIONS (Bulletproof: labels can differ from values) --------
  
  // Skills filter config - maps display labels to actual data keys
  // IMPORTANT: The 'value' field MUST exactly match keys in skillsData object
  const skillFilterConfig = [
    { label: "All", value: "All" },
    { label: "Languages & Frameworks", value: "Languages & Frameworks" },
    { label: "AI/ML & Data Science", value: "AI/ML & Data Science" },
    { label: "Database & Tools", value: "Database & Tools" }
  ];

  // Projects filter config - maps display labels to actual category values
  // IMPORTANT: The 'value' field MUST exactly match values in projects[].category arrays
  const projectFilterConfig = [
    { label: "All", value: "All" },
    { label: "Web Dev", value: "Web Dev" },
    { label: "AI/ML", value: "AI/ML" },
    { label: "Backend", value: "Backend" },
    { label: "Compilers", value: "Compilers" },
    { label: "Ongoing", value: "Ongoing" }
  ];

  // Achievements filter config - maps display labels to actual category values
  // IMPORTANT: The 'value' field MUST exactly match values in achievementItems[].category
  const achievementFilterConfig = [
    { label: "All", value: "All" },
    { label: "Research", value: "Research" },
    { label: "Leadership", value: "Leadership" },
    { label: "Impact", value: "Impact" },
    { label: "Learning", value: "Learning" }
  ];

  // Validation helper: ensures filter configs match actual data
  // This runs in development to catch mismatches early
  if (process.env.NODE_ENV === 'development') {
    // Validate skills filters match skillsData keys
    const skillKeys = Object.keys(skillsData);
    skillFilterConfig.forEach(filter => {
      if (filter.value !== "All" && !skillKeys.includes(filter.value)) {
        console.warn(`⚠️ Skills filter "${filter.label}" has value "${filter.value}" that doesn't match any skillsData key!`);
      }
    });

    // Validate project filters match project categories
    const allProjectCategories = new Set();
    projects.forEach(p => p.category.forEach(cat => allProjectCategories.add(cat)));
    projectFilterConfig.forEach(filter => {
      if (filter.value !== "All" && !allProjectCategories.has(filter.value)) {
        console.warn(`⚠️ Project filter "${filter.label}" has value "${filter.value}" that doesn't match any project category!`);
      }
    });

    // Validate achievement filters match achievement categories
    const achievementCategories = new Set(achievementItems.map(a => a.category));
    achievementFilterConfig.forEach(filter => {
      if (filter.value !== "All" && !achievementCategories.has(filter.value)) {
        console.warn(`⚠️ Achievement filter "${filter.label}" has value "${filter.value}" that doesn't match any achievement category!`);
      }
    });
  }

  // -------- FILTERED DATA (Using exact values from config) --------
  // For Skills we filter inline in the JSX (see SKILLS section).
  // For Projects and Achievements we compute filtered lists here.

  const projectsForCurrentFilter = useMemo(
    () =>
      projects.filter(
        (p) => projectFilter === "All" || p.category.includes(projectFilter)
      ),
    [projectFilter, projects]
  );

  const achievementsForCurrentFilter = useMemo(
    () =>
      achievementItems.filter(
        (a) => achievementFilter === "All" || a.category === achievementFilter
      ),
    [achievementFilter, achievementItems]
  );


  // -------- HANDLERS --------

  const handleProjectFilterChange = (cat) => {
    setProjectFilter(cat);
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 450);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Please enter your name.";
    if (!form.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    ) {
      errors.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) errors.subject = "Please enter a subject.";
    if (!form.message.trim() || form.message.trim().length < 10) {
      errors.message = "Please enter a message (at least 10 characters).";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormStatus("loading");
    setTimeout(() => {
      setFormStatus("success");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setTimeout(() => setFormStatus("idle"), 2500);
    }, 1200);
  };

  const onChangeFormField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isDark = theme === "dark";

  // Easter egg: clicking logo many times toggles rainbow
  const [logoClicks, setLogoClicks] = useState(0);
  const [rainbowMode, setRainbowMode] = useState(false);
  const handleLogoClick = () => {
    setLogoClicks((c) => {
      const next = c + 1;
      if (next >= 7) {
        setRainbowMode((r) => !r);
        return 0;
      }
      return next;
    });
  };

  // -------- RENDER --------

  if (isLoading) {
    return (
      <div
        className={`${themeBg} min-h-screen flex items-center justify-center relative overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#FFB4A2_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#FF6F61_0,_transparent_55%)] opacity-60 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div
          className={`${glassClasses} relative px-10 py-8 rounded-3xl flex items-center gap-4`}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          <motion.div
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8E72] to-[#FF6F61]"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 0.95, 1]
            }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          />
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-semibold">
              Booting Portfolio 
            </p>
            <p className="mt-1 font-semibold text-lg">
              Loading Mohit&apos;s universe<span className="animate-pulse">
                ...
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`${themeBg} min-h-screen transition-colors duration-300 ease-out`}
    >
      {/* Cursor trail */}
      <div className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen">
        {cursorTrail.map((p, i) => (
          <motion.div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="w-3 h-3 rounded-full bg-[#FF6F61]/70 shadow-[0_0_16px_rgba(255,111,97,0.9)]"
            style={{
              position: "fixed",
              left: p.x - 6,
              top: p.y - 6
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-transparent z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] shadow-[0_0_16px_rgba(255,111,97,0.8)]"
          style={{ width: `${scrollProgress}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        />
      </div>

      {/* Floating gradient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-10 w-72 h-72 bg-[#FFB4A2]/60 rounded-full blur-3xl mix-blend-multiply dark:opacity-60" />
        <div className="absolute top-1/2 -right-10 w-80 h-80 bg-[#FF6F61]/50 rounded-full blur-3xl mix-blend-multiply dark:opacity-60" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FF8E72]/50 rounded-full blur-3xl mix-blend-multiply dark:opacity-60" />
      </div>

      {/* NAVBAR */}
      <header
        className="fixed top-3 inset-x-0 z-30 flex justify-center px-4"
        aria-label="Main navigation"
      >
        <motion.nav
          className={`${glassClasses} flex w-full max-w-6xl items-center justify-between rounded-3xl px-5 py-2.5 md:px-6 md:py-3 bg-opacity-80 dark:bg-opacity-80`}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F61] rounded-full"
          >
            <motion.div
              animate={
                rainbowMode
                  ? {
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 0.95, 1]
                    }
                  : {}
              }
              transition={
                rainbowMode
                  ? { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
                  : {}
              }
              className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] flex items-center justify-center shadow-[0_0_20px_rgba(255,111,97,0.75)]"
            >
              <Mic2 className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Portfolio 
              </span>
              <span
                className={`font-semibold text-sm md:text-base bg-clip-text ${
                  rainbowMode
                    ? "bg-[conic-gradient(from_0deg,_#FF6F61,_#FFB4A2,_#FF8E72,_#FF6F61)] text-transparent animate-pulse"
                    : "text-[#3D3D3D] dark:text-white"
                }`}
              >
                Mohit
              </span>
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {sectionIds.map((id) => {
              const label =
                id === "home"
                  ? "Home"
                  : id[0].toUpperCase() + id.slice(1).replace("-", " ");
              const isActive = activeId === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none ${
                    isActive
                      ? "text-[#1A1A1A] dark:text-black"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] shadow-[0_0_20px_rgba(255,111,97,0.85)]"
                      transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative flex h-9 w-16 items-center rounded-full bg-slate-200/80 dark:bg-slate-800/80 px-1 shadow-inner overflow-hidden focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none"
              aria-label="Toggle dark mode"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FF8E72] to-[#FF6F61] opacity-40"
                animate={{ opacity: isDark ? 0.2 : 0.6 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-[#242424] shadow-[0_6px_18px_rgba(15,23,42,0.45)]"
                layout
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ x: isDark ? 26 : 0 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-[#FFB4A2]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0, rotate: 90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-[#FF6F61]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/70 dark:bg-slate-900/70 shadow-md focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none"
              onClick={() => setNavOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {navOpen ? (
                  <motion.div
                    key="close"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ scale: 0, rotate: 90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {navOpen && (
            <motion.div
              className="absolute top-16 w-full max-w-6xl px-4 md:hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                className={`${glassClasses} rounded-3xl px-4 py-3 space-y-1 bg-opacity-90 dark:bg-opacity-90`}
              >
                {sectionIds.map((id) => {
                  const label =
                    id === "home"
                      ? "Home"
                      : id[0].toUpperCase() +
                        id.slice(1).replace("-", " ");
                  const isActive = activeId === id;
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => {
                        scrollToSection(id);
                        setNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] text-black shadow-lg"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                      }`}
                    >
                      <span>{label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-24 md:pt-28 lg:pt-32 pb-20">
        {/* HERO */}
        <section
          id="home"
          className="relative px-4 py-16 md:py-24 lg:py-28 max-w-6xl mx-auto"
        >
          <motion.div
            className="grid gap-10 md:grid-cols-[1.4fr,1fr] items-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Left */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-[#111]/70 px-3 py-1 shadow-lg shadow-slate-900/5 border border-white/60 dark:border-white/10 backdrop-blur-md mb-4">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF8E72] to-[#FF6F61] shadow-[0_0_10px_rgba(255,111,97,0.7)]">
                  <Sparkles className="w-3 h-3 text-white" />
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                  Aspiring Software Engineer | AI/ML Enthusiast
                </span>
              </div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              >
                <span className="block text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Hi, I&apos;m
                </span>
                <span className="relative inline-block">
                  <span className="relative bg-clip-text text-transparent bg-[conic-gradient(from_120deg,_#FF6F61,_#FF8E72,_#FFB4A2,_#FF6F61)] drop-shadow-[0_0_25px_rgba(255,142,114,0.45)]">
                    Mohit
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-2 rounded-full bg-gradient-to-r from-[#FF6F61]/40 to-transparent blur-sm" />
                </span>
              </motion.h1>

              <motion.p
                className="max-w-xl text-sm md:text-base text-slate-700 dark:text-slate-200 mb-6"
                variants={fadeUp}
              >
              Results-driven Software Engineer and AI/ML enthusiast with proven expertise in full-stack development, machine learning, and cybersecurity. Published researcher with hands-on experience building scalable applications that solve real-world problems. Demonstrated leadership through technical presentations at national conferences and successful event management. Passionate about leveraging technology to create meaningful impact in agriculture, renewable energy, and automation domains.
              </motion.p>

              <motion.p
                className="text-sm md:text-base font-mono text-[#FF6F61] dark:text-[#FFB4A2] mb-4 h-5"
                aria-label="Current focus"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
                <span className="inline-block w-3 h-4 bg-[#FF6F61] dark:bg-[#FFB4A2] ml-0.5 animate-pulse" />
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-3 mb-8"
                variants={fadeUp}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                  className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_15px_40px_rgba(255,111,97,0.5)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none"
                >
                  <span>View Projects</span>
                  <ChevronDown className="w-4 h-4" />
                  <motion.span
                    className="absolute inset-0 rounded-full border border-white/50"
                    animate={{
                      opacity: [0.5, 0.1, 0.5],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeInOut"
                    }}
                  />
                </button>
                <a
                  href="https://drive.google.com/file/d/1TYKaPH-dTNcMNLU0IoDNyWQcZPy3Kp9L/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#FF6F61]/60 bg-white/60 dark:bg-black/40 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 shadow-sm hover:bg-[#FF6F61]/10 hover:border-[#FF6F61] transition-all focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              </motion.div>

              <motion.div
                className="grid grid-cols-3 gap-3 max-w-md text-xs md:text-sm"
                variants={fadeUp}
              >
                <div
                  className={`${glassClasses} rounded-2xl px-3 py-2 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.35)] transition-transform`}
                >
                  <span className="text-[0.65rem] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Focus
                  </span>
                  <p className="font-semibold mt-1 leading-snug">
                    Full-Stack Development
                    <br />
                    AI & Machine Learning 
                  </p>
                </div>
                <div
                  className={`${glassClasses} rounded-2xl px-3 py-2 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.35)] transition-transform`}
                >
                  <span className="text-[0.65rem] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Stack
                  </span>
                  <p className="font-semibold mt-1 leading-snug">
                    Python • Flask • React
                  </p>
                </div>
                <div
                  className={`${glassClasses} rounded-2xl px-3 py-2 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.35)] transition-transform`}
                >
                  <span className="text-[0.65rem] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Education
                  </span>
                  <p className="font-semibold mt-1 leading-snug">
                    BTech CSE
                    <br />
                    (Current)
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Avatar & visuals */}
            <motion.div
              variants={fadeUp}
              className="relative flex justify-center md:justify-end"
            >
              <motion.div
                className="relative w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-[2.5rem] bg-gradient-to-br from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] shadow-[0_30px_80px_rgba(15,23,42,0.65)] overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 110, damping: 16 }}
              >
                <motion.div
                  className="absolute inset-5 rounded-[2rem] bg-[#1A1A1A]/95 dark:bg-black/95 border border-white/10 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="relative w-32 h-32 md:w-40 md:h-40 rounded-[1.75rem] bg-gradient-to-br from-[#FF8E72] via-[#FFB4A2] to-[#FF6F61] shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex items-center justify-center"
                      animate={{
                        rotateX: [24, 12, 24],
                        rotateY: [-20, -10, -20],
                        y: [0, -10, 0]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#050505] border border-white/12 flex flex-col items-center justify-center gap-1"
                        animate={{
                          boxShadow: [
                            "0 0 30px rgba(255,111,97,0.8)",
                            "0 0 45px rgba(255,142,114,0.9)",
                            "0 0 30px rgba(255,111,97,0.8)"
                          ]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3.2,
                          ease: "easeInOut"
                        }}
                      >
                        <Mic2 className="w-8 h-8 text-[#FFB4A2]" />
                        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-200">
                          MOHIT
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[0.7rem] text-slate-200"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#FFB4A2]" />
                    <span>AI Enthusiast</span>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-5 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[0.7rem] text-slate-200"
                    animate={{ y: [0, 5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.4,
                      ease: "easeInOut",
                      delay: 0.4
                    }}
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#FF6F61]" />
                    <span>Web Development</span>
                  </motion.div>
                  <motion.div
                    className="absolute top-16 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[0.7rem] text-slate-200"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.6,
                      ease: "easeInOut",
                      delay: 0.8
                    }}
                  >
                    <Brain className="w-3.5 h-3.5 text-[#FF8E72]" />
                    <span>Problem Solver</span>
                  </motion.div>
                </motion.div>

                <div className="absolute inset-0 opacity-40">
                  <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
                  <div className="absolute inset-y-0 right-1/3 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            type="button"
            onClick={() => scrollToSection("about")}
            className="mt-10 mx-auto flex flex-col items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-[#FF6F61] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none rounded-full w-fit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span>Scroll to explore</span>
            <motion.div
              className="w-7 h-10 rounded-full border border-slate-400/60 dark:border-slate-500/70 flex items-start justify-center p-1"
              animate={{
                y: [0, 4, 0]
              }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              <motion.div
                className="w-1.5 h-2 rounded-full bg-[#FF6F61]"
                animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.button>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="relative px-4 py-14 md:py-18 max-w-6xl mx-auto"
        >
          <motion.div
            className="flex flex-col md:flex-row md:items-start gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="flex-1" variants={fadeUp}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] flex items-center justify-center shadow-lg">
                  <UserIcon />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  About{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6F61] via-[#FF8E72] to-[#FFB4A2]">
                    Me
                  </span>
                </h2>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 mb-4">
                I&apos;m Mohit, a{" "}
                <span className="font-semibold">
                  BTech Computer Science student
                </span>{" "}
                and intelligent backends. My toolkit blends{" "}
                <span className="font-semibold">Python, Flask, AI/ML</span>,
                and modern frontend technologies to craft cohesive, delightful
                experiences.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 mb-4">
                I love designing systems that feel intuitive to humans:
                interfaces you can talk to, applications that anticipate your
                next step, and tools that remove friction rather than add it.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 mb-5">
                Right now, I&apos;m deepening my understanding of{" "}
                <span className="font-semibold">
                  machine learning, web designing and large-scale
                  architecture
                </span>
                . I&apos;m fascinated by how AI can transform user experiences,
                making technology more accessible and personalized.

              </p>

              <motion.div
                className={`${glassClasses} rounded-2xl px-4 py-3 flex items-start gap-3 border-l-4 border-l-[#FF6F61] mt-2`}
                variants={fadeUp}
              >
                <Quote className="w-5 h-5 text-[#FF6F61] mt-0.5 shrink-0" />
                <div className="text-xs md:text-sm">
                  <p className="italic text-slate-800 dark:text-slate-100">
                    &quot;The best interfaces are the ones you don&apos;t
                    notice—because they adapt to you.&quot;
                  </p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    My guiding principle in life &amp; AI design
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Cards + Stats */}
            <motion.div
              className="flex-1 space-y-4"
              variants={staggerContainer}
            >
              {/* Interests */}
              <motion.div
                className={`${glassClasses} rounded-3xl p-4 grid grid-cols-2 gap-3`}
                variants={fadeUp}
              >
                <InterestCard
                  icon={Mic2}
                  label="AI driven Systems"
                  description="Designing conversational interfaces and AI-driven workflows."
                />
                <InterestCard
                  icon={LayoutGrid}
                  label="Full-Stack Development"
                  description="Shipping end-to-end experiences from backend to polished UI."
                />
                <InterestCard
                  icon={Brain}
                  label="Machine Learning"
                  description="Training models that understand context and intent."
                />
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-3"
                variants={fadeUp}
              >
                <StatCard label="Projects" value="15+" sub="Completed" />
                <StatCard label="Tech" value="25+" sub="Skills Mastered" />
                <StatCard label="Lines" value="50k+" sub="Code Written" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* TIMELINE */}
        <section
          id="timeline"
          className="relative px-4 py-16 max-w-6xl mx-auto"
        >
          <SectionHeader
            title="Professional Timeline"
            subtitle="How I evolved from foundations to a Developer."
            icon={ClockIcon}
          />
          <motion.div
            className="relative mt-8 grid md:grid-cols-[1fr,0.9fr] gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Timeline */}
            <motion.div
              className={`${glassClasses} rounded-3xl p-5 relative overflow-hidden`}
              variants={fadeUp}
            >
              <div className="absolute inset-y-4 left-8 w-px bg-gradient-to-b from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] opacity-60" />
              <div className="relative space-y-6 pl-5">
                {timelineItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      className="relative flex gap-4 group"
                      variants={fadeUp}
                    >
                      <div className="absolute -left-[1.6rem] top-2 w-3.5 h-3.5 rounded-full bg-slate-900 dark:bg-slate-100 ring-4 ring-[#FF6F61]/40 flex items-center justify-center">
                        <motion.div
                          className={`w-2 h-2 rounded-full bg-gradient-to-br ${item.color}`}
                          whileHover={{ scale: 1.2 }}
                        />
                      </div>
                      <div className="w-full rounded-2xl bg-slate-50/80 dark:bg-black/40 border border-slate-200/70 dark:border-white/10 px-4 py-3.5 shadow-sm group-hover:shadow-[0_18px_40px_rgba(15,23,42,0.4)] transition-all group-hover:-translate-y-1">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white text-xs shadow-md">
                              <Icon className="w-4 h-4" />
                            </div>
                            <h3 className="font-semibold text-sm md:text-[0.92rem]">
                              {item.title}
                            </h3>
                          </div>
                          <span className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-200">
                          {item.subtitle}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[0.7rem] text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Stars className="w-3 h-3 text-[#FF6F61]" />
                            <span>
                              Step {index + 1} of {timelineItems.length}
                            </span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <motion.div
                className="absolute inset-y-4 left-7 w-1 rounded-full bg-[#FF6F61]/30"
                initial={{ scaleY: 0, originY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Radar skills */}
            <motion.div
              className={`${glassClasses} rounded-3xl p-5 flex flex-col`}
              variants={fadeUp}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#FF6F61]" />
                  <h3 className="text-sm md:text-base font-semibold">
                    Skill Constellation
                  </h3>
                </div>
                <span className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Powered by Recharts
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-200 mb-4">
                A snapshot of how my strengths distribute across
                backend, frontend, algorithms, and tooling.
              </p>
              <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadarData}>
                    <PolarGrid
                      stroke={isDark ? "#4b5563" : "#cbd5f5"}
                      strokeOpacity={0.8}
                    />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{
                        fill: isDark ? "#e5e7eb" : "#1f2933",
                        fontSize: 11
                      }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{
                        fill: isDark ? "#9ca3af" : "#4b5563",
                        fontSize: 10
                      }}
                    />
                    <Radar
                      dataKey="value"
                      stroke={accentColor}
                      fill={accentColor}
                      fillOpacity={0.45}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="relative px-4 py-16 max-w-6xl mx-auto"
        >
          <SectionHeader
            title="Skills"
            subtitle="Languages, frameworks, and tools I use to build voice-aware, production-ready systems."
            icon={Code2}
          />

          {/* Filters */}
          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3 justify-between"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex flex-wrap gap-2">
              {skillFilterConfig.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => setSkillFilter(filter.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border bg-white/70 dark:bg-black/40 transition-all hover:-translate-y-0.5 ${
                    skillFilter === filter.value
                      ? "border-[#FF6F61] text-[#1A1A1A] dark:text-black bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2]"
                      : "border-slate-300/60 dark:border-slate-700/70 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {filter.value === "All" ? (
                    <LayoutGrid className="w-3.5 h-3.5" />
                  ) : (
                    <Filter className="w-3.5 h-3.5" />
                  )}
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-60 md:w-72 mt-1 sm:mt-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full rounded-full bg-white/80 dark:bg-black/50 border border-slate-200/70 dark:border-slate-700/70 px-8 py-1.5 text-xs text-slate-800 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6F61]"
              />
            </div>
          </motion.div>

          {/* Cards */}
          <motion.div
            className="mt-6 grid md:grid-cols-2 gap-5"
            variants={staggerContainer}
            initial={false} // avoid being stuck in hidden state
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {Object.entries(skillsData).map(([category, list]) => {
              const show =
                skillFilter === "All" || skillFilter === category;

              const filteredList = list.filter((s) =>
                s.toLowerCase().includes(skillSearch.toLowerCase())
              );

              // Debug log to see how many skills each block has
              console.log("DEBUG skills block:", {
                category,
                show,
                filteredListLen: filteredList.length
              });

              if (!show) return null;

              return (
                <motion.div
                  key={category}
                  className={`${glassClasses} rounded-3xl p-4 flex flex-col`}
                  variants={fadeUp}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] flex items-center justify-center shadow-md text-white">
                        {category === "Languages & Frameworks" ? (
                          <Code2 className="w-4 h-4" />
                        ) : (
                          <Terminal className="w-4 h-4" />
                        )}
                      </span>
                      <div>
                        <h3 className="text-sm md:text-base font-semibold">
                          {category}
                        </h3>
                        <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                          {filteredList.length} skills
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                    {filteredList.map((skill) => (
                      <motion.div
                        key={skill}
                        className="group relative"
                        whileHover={{ y: -2 }}
                      >
                        <div
                          className="relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-slate-50/90 dark:bg-black/60 border border-slate-200/80 dark:border-slate-700/70 shadow-sm cursor-default"
                          title={skill}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] shadow-[0_0_8px_rgba(255,111,97,0.8)]" />
                          <span className="text-[0.7rem] font-medium text-slate-800 dark:text-slate-100">
                            {skill}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {filteredList.length === 0 && (
                      <p className="col-span-2 text-[0.75rem] text-slate-500 dark:text-slate-400 italic">
                        No skills match &quot;{skillSearch}&quot; in this
                        category.
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="relative px-4 py-16 max-w-6xl mx-auto"
        >
          <SectionHeader
            title="Projects"
            subtitle="A curated selection of work spanning Voice OS, compilers, AI/ML, and full-stack applications."
            icon={Terminal}
          />

          {/* Filters */}
          <motion.div
            className="mt-6 flex flex-wrap items-center justify-between gap-3"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 text-xs">
              {projectFilterConfig.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => handleProjectFilterChange(filter.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
                    projectFilter === filter.value
                      ? "bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] text-black border-transparent shadow-[0_15px_40px_rgba(255,111,97,0.5)]"
                      : "bg-white/60 dark:bg-black/50 border-slate-200/70 dark:border-slate-700/70 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <span>{filter.label}</span>
                  {projectFilter === filter.value && (
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-black/80"
                      layoutId="project-filter-dot"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Project grid */}
          <motion.div
            className="mt-7 grid md:grid-cols-2 gap-5"
            variants={staggerContainer}
            initial={false} // avoid cards staying hidden if viewport trigger fails
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {isFiltering
              ? [1, 2, 3, 4].map((i) => (
                  <SkeletonProjectCard key={i} />
                ))
              : projectsForCurrentFilter.map((proj) => (
                  <motion.article
                    key={proj.id}
                    className={`${glassClasses} rounded-3xl flex flex-col overflow-hidden group cursor-pointer`}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    onClick={() => setSelectedProject(proj)}
                    aria-label={`Open details for project ${proj.title}`}
                  >
                    {/* Image placeholder / hero */}
                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black">
                      <motion.div
                        className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#FFB4A2_0,_transparent_60%),_radial-gradient(circle_at_bottom,_#FF6F61_0,_transparent_60%)]"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 8,
                          ease: "linear"
                        }}
                      />
                      <motion.div
                        className="absolute inset-4 rounded-2xl border border-white/10 flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3 text-xs text-slate-200">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] text-white shadow-md">
                            <Code2 className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-medium tracking-wide">
                            {proj.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-black/40 text-[0.65rem] uppercase tracking-[0.12em]">
                            {proj.badge}
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[0.65rem] px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/60 border border-slate-200/80 dark:border-slate-700/70 text-slate-800 dark:text-slate-100"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[0.7rem] text-slate-500 dark:text-slate-400">
                        
                        <span className="inline-flex items-center gap-1 text-xs text-[#FF6F61]">
                          <span>View details</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="px-4 pb-3 flex items-center justify-between border-t border-slate-200/70 dark:border-slate-800/80 pt-2">
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-slate-800 dark:text-slate-100 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 border border-slate-200/80 dark:border-slate-700/70 hover:border-[#FF6F61] hover:text-[#FF6F61] transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                      {proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-[#FF6F61] px-2.5 py-1 rounded-full border border-[#FF6F61]/70 bg-[#FF6F61]/5 hover:bg-[#FF6F61]/15 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </motion.article>
                ))}
          </motion.div>

          {/* Project modal */}
          <AnimatePresence>
            {selectedProject && (
              <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>
        </section>

        {/* ACHIEVEMENTS */}
        <section
          id="achievements"
          className="relative px-4 py-16 max-w-6xl mx-auto"
        >
          <SectionHeader
            title="Achievements"
            subtitle="Milestones, recognitions, and contributions that shaped my journey."
            icon={Award}
          />

          {/* Filters */}
          <motion.div
            className="mt-6 flex flex-wrap gap-2 text-xs"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {achievementFilterConfig.map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => setAchievementFilter(filter.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
                  achievementFilter === filter.value
                    ? "bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] text-black border-transparent shadow-[0_15px_40px_rgba(255,111,97,0.5)]"
                    : "bg-white/60 dark:bg-black/50 border-slate-200/70 dark:border-slate-700/70 text-slate-700 dark:text-slate-200"
                }`}
              >
                <Stars className="w-3.5 h-3.5" />
                <span>{filter.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial={false} // avoid cards staying hidden if viewport trigger fails
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {achievementsForCurrentFilter.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.id}
                  className={`${glassClasses} rounded-3xl p-4 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(15,23,42,0.55)] transition-all cursor-default`}
                  variants={fadeUp}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] flex items-center justify-center shadow-md text-white">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{a.title}</h3>
                        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          {a.badge}
                        </p>
                      </div>
                    </div>
                    <CountUpBadge count={a.count} delay={0.2 + i * 0.1} />
                  </div>
                  <p className="mt-3 text-xs md:text-sm text-slate-700 dark:text-slate-200">
                    {a.details}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="relative px-4 py-16 max-w-6xl mx-auto"
        >
          <SectionHeader
            title="Contact"
            subtitle="Let’s collaborate on something ambitious—Voice OS, AI, or a full-stack experience."
            icon={Mail}
          />

          <motion.div
            className="mt-7 grid md:grid-cols-[1.2fr,1fr] gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Form */}
            <motion.div
              className={`${glassClasses} rounded-3xl p-5 relative overflow-hidden`}
              variants={fadeUp}
            >
              <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top,_#FFB4A2_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#FF6F61_0,_transparent_55%)]" />
              <div className="relative z-10">
                <h3 className="text-sm md:text-base font-semibold mb-1.5">
                  Let&apos;s build together
                </h3>
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 mb-4">
                  Whether it&apos;s a Voice OS experiment, AI/ML project, or
                  full-stack product, I&apos;m always excited about bold ideas.
                </p>

                <form
                  className="space-y-3 text-xs md:text-sm"
                  onSubmit={handleFormSubmit}
                  noValidate
                >
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FormField
                      label="Name"
                      id="name"
                      value={form.name}
                      error={formErrors.name}
                      onChange={(v) => onChangeFormField("name", v)}
                      placeholder="Your name"
                    />
                    <FormField
                      label="Email"
                      id="email"
                      type="email"
                      value={form.email}
                      error={formErrors.email}
                      onChange={(v) => onChangeFormField("email", v)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <FormField
                    label="Subject"
                    id="subject"
                    value={form.subject}
                    error={formErrors.subject}
                    onChange={(v) => onChangeFormField("subject", v)}
                    placeholder="Let’s talk about..."
                  />
                  <FormField
                    label="Message"
                    id="message"
                    value={form.message}
                    error={formErrors.message}
                    onChange={(v) => onChangeFormField("message", v)}
                    placeholder="Tell me about your project, idea, or question."
                    textarea
                    rows={4}
                  />

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="submit"
                      className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2] px-4 py-1.5 text-xs md:text-sm font-semibold text-black shadow-[0_15px_40px_rgba(255,111,97,0.5)] focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={
                        formStatus === "loading" || formStatus === "success"
                      }
                    >
                      {formStatus === "loading" ? (
                        <>
                          <Spinner />
                          <span>Sending...</span>
                        </>
                      ) : formStatus === "success" ? (
                        <>
                          <Stars className="w-4 h-4" />
                          <span>Sent!</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                    <a
                      href="https://drive.google.com/file/d/1eZ4qeh5qBC5AGRADPIDSwwH8O0wOXq4P/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[0.75rem] md:text-xs px-3 py-1 rounded-full border border-slate-300/80 dark:border-slate-700/80 bg-white/70 dark:bg-black/60 text-slate-800 dark:text-slate-100 hover:border-[#FF6F61] hover:text-[#FF6F61] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume</span>
                    </a>
                  </div>
                </form>
              </div>

              {/* Confetti on success */}
              <AnimatePresence>
                {formStatus === "success" && <ConfettiOverlay />}
              </AnimatePresence>
            </motion.div>

            {/* Contact cards / socials */}
            <motion.div className="space-y-4" variants={fadeUp}>
              <div
                className={`${glassClasses} rounded-3xl p-4 flex flex-col gap-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] flex items-center justify-center text-white shadow-md">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Direct Contact</h3>
                      <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                        Prefer a quick email or DM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <ContactCard
                    icon={Mail}
                    label="Email"
                    value="manvendarsinghbohra@gmail.com"
                    href="mailto:manvendarsinghbohra@gmail.com"
                  />
                  <ContactCard
                    icon={MapPin}
                    label="Location"
                    value="India (IST)"
                  />
                </div>
              </div>

              <div
                className={`${glassClasses} rounded-3xl p-4 flex flex-col gap-3`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Stars className="w-4 h-4 text-[#FF6F61]" />
                  <h3 className="text-sm font-semibold">Social Links</h3>
                </div>
                <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 mb-1">
                  Let&apos;s stay in touch across platforms.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <SocialButton
                    icon={Github}
                    label="GitHub"
                    href="https://github.com/mohitbohra18"
                    tooltip="View my repositories"
                  />
                  <SocialButton
                    icon={Linkedin}
                    label="LinkedIn"
                    href="https://www.linkedin.com/in/mohit-bohra-b30a21251/"
                    tooltip="Connect professionally"
                  />
                  <SocialButton
                    icon={Globe}
                    label="LeetCode"
                    href="https://leetcode.com/mohitbohra18"
                    tooltip="Explore my coding practice"
                  />
                  <SocialButton
                    icon={Terminal}
                    label="Portfolio Repo"
                    href="https://github.com/Mohitbohra18/FUTURE_FS_01/tree/main"
                    tooltip="This portfolio's source code"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/70 dark:border-slate-800/80 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs md:text-sm">
          <div className="grid sm:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Mohit
              </p>
              <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                AI Enthusiast • BTech CSE
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-center">
              {sectionIds.map((id) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="px-2 py-0.5 rounded-full text-[0.7rem] text-slate-600 dark:text-slate-300 hover:text-[#FF6F61] hover:bg-[#FF6F61]/10 transition-colors"
                >
                  {id === "home"
                    ? "Home"
                    : id[0].toUpperCase() + id.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} Mohit. All rights reserved.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 text-[0.65rem] text-slate-700 dark:text-slate-200">
                <span>Made with</span>
                <span className="text-[#FF6F61]">❤️</span>
                <span>and React</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2]"
                animate={{ x: ["-40%", "120%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-[0.7rem] shadow-md hover:bg-[#FF6F61] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF6F61] outline-none ml-2"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ---------------- SMALL COMPONENTS ----------------

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <motion.div
    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] flex items-center justify-center shadow-md text-white">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-[0.7rem] md:text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  </motion.div>
);

const InterestCard = ({ icon: Icon, label, description }) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl bg-slate-50/90 dark:bg-black/60 border border-slate-200/70 dark:border-slate-800/80 p-3 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.55)] transition-all"
    whileHover={{ rotateX: 4, rotateY: -3 }}
  >
    <div className="flex items-center gap-2 mb-1">
      <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] flex items-center justify-center text-white shadow-md">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
        {label}
      </p>
    </div>
    <p className="text-[0.7rem] text-slate-600 dark:text-slate-300">
      {description}
    </p>
  </motion.div>
);

const StatCard = ({ label, value, sub }) => (
  <motion.div
    className="rounded-2xl bg-slate-900 text-slate-100 dark:bg-black/80 
 px-3 py-2.5 shadow-[0_18px_40px_rgba(15,23,42,0.75)] flex flex-col"
    whileHover={{ y: -2, scale: 1.02 }}
  >
    <span className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-400">
      {label}
    </span>
    <span className="text-lg font-bold mt-1">{value}</span>
    <span className="text-[0.7rem] text-slate-400">{sub}</span>
  </motion.div>
);

const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  textarea,
  rows = 3
}) => (
  <div className="space-y-1">
    <label
      htmlFor={id}
      className="block text-[0.7rem] font-medium text-slate-700 dark:text-slate-200"
    >
      {label}
    </label>
    {textarea ? (
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-3 py-2 text-xs md:text-sm bg-white/80 dark:bg-black/60 text-slate-900 dark:text-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6F61] ${
          error
            ? "border-red-400 dark:border-red-500"
            : "border-slate-200/80 dark:border-slate-700/80"
        }`}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-3 py-1.5 text-xs md:text-sm bg-white/80 dark:bg-black/60 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F61] ${
          error
            ? "border-red-400 dark:border-red-500"
            : "border-slate-200/80 dark:border-slate-700/80"
        }`}
      />
    )}
    {error && (
      <p className="text-[0.65rem] text-red-500 mt-0.5" aria-live="polite">
        {error}
      </p>
    )}
  </div>
);

const Spinner = () => (
  <motion.div
    className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
  />
);

const ConfettiOverlay = () => {
  const pieces = Array.from({ length: 45 });
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {pieces.map((_, i) => (
        <motion.div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="absolute w-1.5 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: -8,
            backgroundColor:
              ["#FF6F61", "#FF8E72", "#FFB4A2", "#FACC15"][i % 4]
          }}
          animate={{
            y: ["0%", "120%"],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 1.6 + Math.random() * 0.6,
            ease: "easeIn"
          }}
        />
      ))}
    </motion.div>
  );
};

const ContactCard = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-center gap-2 rounded-2xl bg-slate-50/90 dark:bg-black/60 border border-slate-200/80 dark:border-slate-800/80 px-3 py-2">
    <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-[#FF8E72] to-[#FF6F61] flex items-center justify-center text-white shadow-md">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="flex-1">
      <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          className="text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-[#FF6F61] transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
          {value}
        </p>
      )}
    </div>
  </div>
);

const SocialButton = ({ icon: Icon, label, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center gap-1.5 rounded-2xl bg-slate-50/90 dark:bg-black/60 border border-slate-200/80 dark:border-slate-800/80 px-3 py-1.5 text-[0.75rem] text-slate-800 dark:text-slate-100 hover:border-[#FF6F61] hover:text-[#FF6F61] hover:-translate-y-0.5 transition-all"
  >
    <Icon className="w-3.5 h-3.5" />
    <span>{label}</span>
  </a>
);

const SkeletonProjectCard = () => (
  <div className="rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden animate-pulse">
    <div className="h-32 bg-slate-200/80 dark:bg-slate-800/80" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-3/4 bg-slate-200/90 dark:bg-slate-800/90 rounded-full" />
      <div className="h-3 w-full bg-slate-200/90 dark:bg-slate-800/90 rounded-full" />
      <div className="h-3 w-1/2 bg-slate-200/90 dark:bg-slate-800/90 rounded-full" />
      <div className="h-6 w-24 bg-slate-200/90 dark:bg-slate-800/90 rounded-full mt-2" />
    </div>
  </div>
);

const CountUpBadge = ({ count, delay = 0 }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    const duration = 900;
    const startTime = performance.now() + delay * 1000;

    const tick = (now) => {
      if (now < startTime) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.floor(count * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count, delay]);

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-2.5 py-1 text-[0.65rem] shadow-md">
      <Stars className="w-3 h-3 text-[#FFB4A2]" />
      <span>{value}+</span>
    </div>
  );
};

const ProjectModal = ({ project, onClose }) => (
  <motion.div
    className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="relative max-w-2xl w-full rounded-3xl bg-slate-50 dark:bg-[#050505] border border-slate-200/80 dark:border-slate-700/80 shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-hidden"
      initial={{ scale: 0.92, y: 12, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.92, y: 12, opacity: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative h-28 bg-gradient-to-r from-[#FF8E72] via-[#FF6F61] to-[#FFB4A2]">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#fff_0,_transparent_60%)]" />
        <div className="absolute inset-x-5 bottom-3 flex items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-black/20 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">{project.title}</p>
              <p className="text-[0.7rem] uppercase tracking-[0.18em]">
                {project.badge}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5">
              <Github className="w-3.5 h-3.5" />
              <span>{project.stats.stars}★</span>
            </span>
            <span className="inline-flex items-center gap-0.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span>{project.stats.forks}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3 text-xs md:text-sm text-slate-700 dark:text-slate-200">
        <p>{project.details}</p>
        <div>
          <h4 className="font-semibold mb-1 flex items-center gap-1">
            <Stars className="w-3.5 h-3.5 text-[#FF6F61]" />
            <span>Key Features</span>
          </h4>
          <ul className="list-disc ml-5 space-y-1">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#FF6F61]" />
            <span>What I Learned</span>
          </h4>
          <ul className="list-disc ml-5 space-y-1">
            {project.learned.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[0.65rem] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-2 text-[0.7rem]">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white hover:bg-[#FF6F61] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors"
        onClick={onClose}
        aria-label="Close project details"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  </motion.div>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4.5 h-4.5 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path
      d="M12 12a4 4 0 1 0-4-4 4.004 4.004 0 0 0 4 4Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 20a8 8 0 0 1 16 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    {...props}
  >
    <circle cx="12" cy="12" r="8" />
    <path
      d="M12 8v4l2.5 2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------- EXPORT WRAPPED WITH THEME ----------------

const App = () => (
  <ThemeProvider>
    <PortfolioApp />
  </ThemeProvider>
);

export default App;





