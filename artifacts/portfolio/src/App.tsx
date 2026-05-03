import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { MdLockOutline, MdOutlineSend, MdArrowBack, MdKeyboardArrowDown } from "react-icons/md";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityClient } from "./sanity/client";
import { projectsQuery, uxCasesQuery, aboutMeQuery, siteSettingsQuery } from "./sanity/queries";
import { PortableTextRenderer } from "./sanity/portableText";

const bgImage = "/bg.jpg";

const greetings = ["Hi! I'm João", "Olá! Eu sou João", "¡Hola! Soy João", "Ciao! Sono João"];

// ─── Translations ─────────────────────────────────────────────────────────────
type Lang = "en" | "pt";

const T = {
  en: {
    navHome: "Home",
    navUxCases: "UX Cases",
    navAbout: "About Me",
    subtitle: "Designer with experience in digital products, focused on data-driven and user-centered solutions.",
    myProjects: "My Projects",
    uxCasesTitle: "UX Cases",
    uxCasesSubtitle: "End-to-end design processes — from research to final UI.",
    protectedTitle: "Protected content",
    protectedHint: "Enter the password to view the UX case studies.",
    passwordPlaceholder: "Password",
    accessGranted: "✓ Access granted",
    lock: "Lock",
    skills: "Skills",
    tools: "Tools",
    experience: "Experience",
    back: "Back",
    metaRole: "Role",
    metaYear: "Year",
    metaType: "Type",
    typeProject: "UI/UX Project",
    typeUxCase: "UX Case Study",
    contentOverviewLabel: "Overview",
    contentOverviewText: "This section will contain a detailed description of the project context, goals, and constraints. Add your own copy and images here.",
    contentProcessLabel: "Process",
    contentProcessText: "Walk through the key design phases — research, ideation, wireframing, prototyping, and testing. Upload process screenshots or diagrams to illustrate each step.",
    contentOutcomeLabel: "Outcome",
    contentOutcomeText: "Share the final results: key metrics, stakeholder feedback, and lessons learned. Include before/after screens or a prototype embed here.",
    moreProjects: "More Projects",
    moreUxCases: "More UX Cases",
    defaultBio: "UI/UX Designer passionate about building digital experiences that are beautiful, accessible, and driven by real user insights. I work across research, interaction design, and visual design — bridging strategy with craft.",
    loading: "Loading content…",
  },
  pt: {
    navHome: "Início",
    navUxCases: "Cases de UX",
    navAbout: "Sobre Mim",
    subtitle: "Designer com experiência em produtos digitais, focado em soluções orientadas por dados e centradas no usuário.",
    myProjects: "Meus Projetos",
    uxCasesTitle: "Cases de UX",
    uxCasesSubtitle: "Processos de design ponta a ponta — da pesquisa à UI final.",
    protectedTitle: "Conteúdo protegido",
    protectedHint: "Digite a senha para visualizar os cases de UX.",
    passwordPlaceholder: "Senha",
    accessGranted: "✓ Acesso concedido",
    lock: "Bloquear",
    skills: "Habilidades",
    tools: "Ferramentas",
    experience: "Experiência",
    back: "Voltar",
    metaRole: "Função",
    metaYear: "Ano",
    metaType: "Tipo",
    typeProject: "Projeto UI/UX",
    typeUxCase: "Case de UX",
    contentOverviewLabel: "Visão Geral",
    contentOverviewText: "Esta seção conterá uma descrição detalhada do contexto, objetivos e restrições do projeto. Adicione seu próprio texto e imagens aqui.",
    contentProcessLabel: "Processo",
    contentProcessText: "Percorra as principais fases do design — pesquisa, ideação, wireframing, prototipagem e testes. Faça upload de capturas de tela do processo ou diagramas para ilustrar cada etapa.",
    contentOutcomeLabel: "Resultados",
    contentOutcomeText: "Compartilhe os resultados finais: métricas-chave, feedback das partes interessadas e lições aprendidas. Inclua telas de antes/depois ou um protótipo incorporado aqui.",
    moreProjects: "Mais Projetos",
    moreUxCases: "Mais Cases de UX",
    defaultBio: "Designer UI/UX apaixonado por criar experiências digitais bonitas, acessíveis e orientadas por pesquisa real com usuários. Atuo em pesquisa, design de interação e design visual — conectando estratégia e execução.",
    loading: "Carregando conteúdo…",
  },
} as const;

// ─── Language dropdown pill ───────────────────────────────────────────────────
function LangPill({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { value: Lang; code: string; flag: string; label: string }[] = [
    { value: "en", code: "EN", flag: "🇺🇸", label: "English" },
    { value: "pt", code: "PT", flag: "🇧🇷", label: "Português" },
  ];
  const active = options.find((o) => o.value === lang)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="nav-wrapper">
        <div className="glass-nav flex items-center gap-2 px-6 py-3 cursor-pointer" style={{ fontSize: "18px" }} onClick={() => setOpen((v) => !v)}>
          <span className="font-medium text-white">{active.code}</span>
          <MdKeyboardArrowDown
            size={18}
            className={`text-white/50 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 flex flex-col overflow-hidden rounded-2xl"
            style={{
              background: "rgb(8, 4, 18)",
              border: "1px solid rgba(168,85,247,0.3)",
              boxShadow: "0 0 22px rgba(168,85,247,0.35), 0 8px 32px rgba(0,0,0,0.6)",
              minWidth: "140px",
            }}
          >
            {options.map(({ value, flag, label }) => (
              <button
                key={value}
                onClick={() => { setLang(value); setOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/8 ${
                  lang === value ? "text-white font-medium" : "text-white/50"
                }`}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <span className="text-xl leading-none">{flag}</span>
                {label}
                {lang === value && <span className="ml-auto text-purple-400 text-xs">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  _id?: string;
  title: string;
  slug?: string;
  tags: string[];
  gradient?: string;
  coverImageUrl?: string | null;
  role: string;
  year: string;
  overview: string;
  content?: PortableTextBlock[];
}

interface AboutData {
  name: string;
  bio: string;
  avatarUrl?: string | null;
  skills: string[];
  tools: string[];
  experience: Array<{ role: string; company: string; period: string; description?: string }>;
}

// ─── Default fallback data (shown while Sanity is loading or unconfigured) ────
const DEFAULT_SKILLS = ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems", "Interaction Design", "Visual Design", "Information Architecture"];
const DEFAULT_TOOLS = ["Figma", "Maze", "Hotjar", "Notion", "Miro", "Principle", "Zeplin", "Lottie"];
const DEFAULT_EXPERIENCE = [
  { role: "Senior UI/UX Designer", company: "Digital Agency", period: "2022 — Present" },
  { role: "Product Designer", company: "SaaS Startup", period: "2020 — 2022" },
  { role: "UI Designer", company: "Creative Studio", period: "2018 — 2020" },
];

const DEFAULT_PROJECTS: Project[] = [
  { title: "E-learning Platform", tags: ["UI", "UX", "Research"], gradient: "from-purple-500 to-indigo-600", role: "Lead UI/UX Designer", year: "2023", overview: "A comprehensive redesign of an e-learning platform, focused on improving student engagement and course completion rates through intuitive navigation and personalized learning paths." },
  { title: "UX for a Chrome Extension", tags: ["UI", "UX"], gradient: "from-blue-500 to-cyan-500", role: "Product Designer", year: "2023", overview: "Designed the full interface and interaction model for a productivity Chrome Extension, balancing a minimal footprint with powerful features accessible within a constrained popup environment." },
  { title: "Diversa", tags: ["UI", "UX", "Research"], gradient: "from-fuchsia-600 to-purple-600", role: "UI/UX Designer", year: "2022", overview: "Diversa is an inclusive hiring platform built to reduce bias in recruitment. The design system and interface prioritize accessibility and diversity-first workflows." },
  { title: "Plataforma Quan", tags: ["UI", "UX"], gradient: "from-slate-700 to-slate-900", role: "Product Designer", year: "2022", overview: "A B2B SaaS platform for financial data management. The challenge was translating complex financial workflows into a clean, actionable dashboard experience." },
  { title: "OCE Play", tags: ["UI"], gradient: "from-emerald-400 to-teal-500", role: "UI Designer", year: "2023", overview: "A gamified learning app for children. The interface uses bright, accessible visuals and reward mechanics to keep young users engaged while meeting educational goals." },
  { title: "TrekMine", tags: ["UI", "Research"], gradient: "from-teal-500 to-cyan-600", role: "UI/UX Designer", year: "2021", overview: "TrekMine is an outdoor adventure platform connecting hikers to trails and experiences. The design focused on clarity and speed of information retrieval in low-connectivity environments." },
  { title: "Law Firm Website", tags: ["UI", "UX", "Webdesign"], gradient: "from-teal-800 to-emerald-900", role: "Web Designer", year: "2021", overview: "A full website redesign for a legal firm, shifting from a dated look to a modern, trust-building digital presence with clear service communication and lead generation flows." },
];

const DEFAULT_UX_CASES: Project[] = [
  { title: "E-learning Redesign — Full Process", tags: ["UX Research", "Usability Testing", "Prototyping"], gradient: "from-violet-600 to-purple-800", role: "Lead UX Researcher & Designer", year: "2023", overview: "A full end-to-end UX process for the e-learning platform redesign — from discovery and user interviews through to validated prototypes and handoff." },
  { title: "Chrome Extension — End-to-End UX", tags: ["User Interviews", "Journey Mapping", "Wireframes"], gradient: "from-indigo-600 to-blue-700", role: "UX Designer", year: "2023", overview: "Conducted 12 user interviews to map the existing workflow, identified 3 critical friction points, and designed an interaction model that reduced task time by 40% in usability testing." },
  { title: "Diversa — Inclusive Design System", tags: ["Accessibility", "UX Research", "Design System"], gradient: "from-fuchsia-600 to-rose-600", role: "Design Systems & UX Lead", year: "2022", overview: "Built an accessible, WCAG 2.1 AA-compliant design system from scratch. The process included stakeholder workshops, component audits, and ongoing usability testing with diverse user groups." },
  { title: "Quan — Information Architecture", tags: ["Card Sorting", "IA", "Prototyping"], gradient: "from-purple-800 to-indigo-900", role: "UX Designer", year: "2022", overview: "Ran open and closed card sorting sessions with 24 participants to restructure the platform's IA. The new navigation reduced time-on-task by 35% and significantly improved first-click accuracy." },
  { title: "OCE Play — Gamification UX", tags: ["Gamification", "User Testing", "UX Writing"], gradient: "from-emerald-600 to-teal-700", role: "UX Designer & Researcher", year: "2023", overview: "Researched gamification frameworks and validated reward mechanics through 5 rounds of playtest sessions with children aged 7–12 and their parents." },
  { title: "TrekMine — Onboarding Flow", tags: ["Onboarding", "UX Research", "A/B Testing"], gradient: "from-teal-600 to-cyan-700", role: "UX Designer", year: "2021", overview: "Redesigned the onboarding flow after drop-off analysis revealed 60% of new users left before completing profile setup. A/B tested 3 variants, achieving a 45% improvement in completion." },
];

type Page = "home" | "ux-cases" | "about";
type Category = "project" | "ux-case";

interface DetailView {
  project: Project;
  category: Category;
}

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const FALLBACK_GRADIENT = "from-slate-700 to-slate-900";

// ─── Cover / gradient background helper ──────────────────────────────────────
function CoverBg({
  project,
  className,
  children,
}: {
  project: Project;
  className: string;
  children?: React.ReactNode;
}) {
  const grad = project.gradient ?? FALLBACK_GRADIENT;
  if (project.coverImageUrl) {
    return (
      <div
        className={`${className} relative overflow-hidden`}
        style={{ backgroundImage: `url(${project.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        {children}
      </div>
    );
  }
  return (
    <div className={`${className} bg-gradient-to-br ${grad} relative overflow-hidden`}>
      {children}
    </div>
  );
}

// ─── Image placeholder ────────────────────────────────────────────────────────
function ImagePlaceholder({ gradient, tall = false }: { gradient?: string; tall?: boolean }) {
  const grad = gradient ?? FALLBACK_GRADIENT;
  return (
    <div className={`w-full rounded-2xl bg-gradient-to-br ${grad} ${tall ? "h-64 md:h-80" : "h-48 md:h-56"} flex items-center justify-center opacity-40`}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

// ─── Related card ─────────────────────────────────────────────────────────────
function RelatedCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const grad = project.gradient ?? FALLBACK_GRADIENT;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -6 }}
      className="group flex flex-col gap-3 text-left w-full"
    >
      <CoverBg
        project={project}
        className={`h-40 w-full rounded-xl flex items-center justify-center p-4 transition-shadow duration-300 group-hover:shadow-xl ${!project.coverImageUrl ? `bg-gradient-to-br ${grad}` : ""}`}
      >
        <span className="relative z-10 text-white font-semibold text-base text-center drop-shadow">{project.title}</span>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </CoverBg>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="text-xs bg-white/15 text-white/70 rounded-full px-2.5 py-0.5">{t}</span>
        ))}
      </div>
    </motion.button>
  );
}

// ─── Detail page ──────────────────────────────────────────────────────────────
function DetailPage({
  detail,
  pool,
  onBack,
  onSelectRelated,
  lang,
}: {
  detail: DetailView;
  pool: Project[];
  onBack: () => void;
  onSelectRelated: (project: Project) => void;
  lang: Lang;
}) {
  const t = T[lang];
  const { project, category } = detail;
  const related = pool.filter((p) => p.title !== project.title).slice(0, 3);
  const grad = project.gradient ?? FALLBACK_GRADIENT;

  const contentSections = [
    { label: t.contentOverviewLabel, text: t.contentOverviewText },
    { label: t.contentProcessLabel, text: t.contentProcessText },
    { label: t.contentOutcomeLabel, text: t.contentOutcomeText },
  ];

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [project.title]);

  return (
    <motion.div
      key={project.title}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-3xl shadow-2xl glass-card overflow-hidden"
    >
      {/* Back button */}
      <div className="px-8 pt-8 pb-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors bg-transparent border-none cursor-pointer mb-6"
        >
          <MdArrowBack size={18} />
          {t.back}
        </button>
      </div>

      {/* Hero */}
      {project.coverImageUrl ? (
        <div
          className="mx-8 h-64 md:h-80 rounded-2xl flex items-end p-8 relative overflow-hidden"
          style={{ backgroundImage: `url(${project.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium bg-white/20 text-white rounded-full px-3 py-1 backdrop-blur-sm">{tag}</span>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow">{project.title}</h1>
          </div>
        </div>
      ) : (
        <div className={`mx-8 h-64 md:h-80 rounded-2xl bg-gradient-to-br ${grad} flex items-end p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium bg-white/20 text-white rounded-full px-3 py-1 backdrop-blur-sm">{tag}</span>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow">{project.title}</h1>
          </div>
        </div>
      )}

      {/* Meta row */}
      <div className="mx-8 mt-6 flex flex-wrap gap-6 border-b border-white/10 pb-6">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{t.metaRole}</p>
          <p className="text-white text-sm font-medium">{project.role}</p>
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{t.metaYear}</p>
          <p className="text-white text-sm font-medium">{project.year}</p>
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{t.metaType}</p>
          <p className="text-white text-sm font-medium">{category === "project" ? t.typeProject : t.typeUxCase}</p>
        </div>
      </div>

      {/* Overview */}
      <div className="mx-8 mt-8">
        <p className="text-white/80 text-base leading-relaxed">{project.overview}</p>
      </div>

      {/* Content — Portable Text when available, placeholder sections as fallback */}
      {project.content && project.content.length > 0 ? (
        <div className="mx-8 mt-10 pb-2">
          <PortableTextRenderer content={project.content} />
        </div>
      ) : (
        <div className="mx-8 mt-10 flex flex-col gap-12">
          {contentSections.map((section, i) => (
            <div key={section.label} className="flex flex-col gap-5">
              <h2 className="text-lg font-bold text-white">{section.label}</h2>
              <ImagePlaceholder gradient={project.gradient} tall={i === 0} />
              <p className="text-white/60 text-sm leading-relaxed">{section.text}</p>
              {i < contentSections.length - 1 && (
                <ImagePlaceholder gradient={project.gradient} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Related */}
      <div className="mx-8 mt-16 mb-10">
        <div className="border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-6">
            {category === "project" ? t.moreProjects : t.moreUxCases}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((p) => (
              <RelatedCard key={p.title} project={p} onClick={() => onSelectRelated(p)} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────
function GridCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const grad = project.gradient ?? FALLBACK_GRADIENT;
  return (
    <motion.article
      key={project.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -8 }}
      className="group flex flex-col gap-4 cursor-pointer"
      onClick={onClick}
    >
      {project.coverImageUrl ? (
        <div
          className="h-[260px] w-full rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          style={{ backgroundImage: `url(${project.coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg leading-tight mb-1">{project.title}</h3>
              {project.overview && (
                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{project.overview}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`h-[260px] w-full rounded-2xl bg-gradient-to-br ${grad} shadow-sm group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg leading-tight mb-1">{project.title}</h3>
              {project.overview && (
                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{project.overview}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium bg-white/15 text-white/80 rounded-full px-3 py-1">{tag}</span>
          ))}
        </div>
        <h4 className="font-semibold text-lg text-white text-center">{project.title}</h4>
      </div>
    </motion.article>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [uxUnlocked, setUxUnlocked] = useState(false);
  const [uxPasswordInput, setUxPasswordInput] = useState("");
  const [uxPassword, setUxPassword] = useState<string>("ux2024"); // fallback until Sanity loads
  const [uxError, setUxError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [detailView, setDetailView] = useState<DetailView | null>(null);
  const [projectsData, setProjectsData] = useState<Project[]>(DEFAULT_PROJECTS);
  const [uxCasesData, setUxCasesData] = useState<Project[]>(DEFAULT_UX_CASES);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [sanityReady, setSanityReady] = useState(false);
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("portfolio_lang");
    if (stored === "pt" || stored === "en") return stored;
    // Auto-detect from device/browser language — default to English unless pt-BR / pt
    const deviceLang = navigator.language || (navigator.languages?.[0] ?? "en");
    return deviceLang.toLowerCase().startsWith("pt") ? "pt" : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("portfolio_lang", l);
  };

  const t = T[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((i) => (i + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // ─── Fetch from Sanity ────────────────────────────────────────────────────
  const loadContent = useCallback(async () => {
    if (!sanityClient) return;
    try {
      const [fetchedProjects, fetchedUxCases, fetchedAbout, fetchedSettings] = await Promise.all([
        sanityClient.fetch<Project[]>(projectsQuery),
        sanityClient.fetch<Project[]>(uxCasesQuery),
        sanityClient.fetch<AboutData | null>(aboutMeQuery),
        sanityClient.fetch<{ uxCasePassword?: string } | null>(siteSettingsQuery),
      ]);

      if (fetchedProjects?.length) setProjectsData(fetchedProjects);
      if (fetchedUxCases?.length) setUxCasesData(fetchedUxCases);
      if (fetchedAbout) setAboutData(fetchedAbout);
      if (fetchedSettings?.uxCasePassword) setUxPassword(fetchedSettings.uxCasePassword);
      setSanityReady(true);
    } catch (err) {
      console.error("[Sanity] Failed to fetch content:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // ─── Real-time listener — auto-refresh on Studio saves ───────────────────
  useEffect(() => {
    if (!sanityClient) return;

    const subscription = sanityClient
      .listen('*[_type in ["project", "uxCase", "aboutMe", "siteSettings"]]')
      .subscribe((event) => {
        if (event.type === "mutation") {
          loadContent();
        }
      });

    return () => subscription.unsubscribe();
  }, [loadContent]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const openDetail = (project: Project, category: Category) => {
    setDetailView({ project, category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeDetail = () => setDetailView(null);

  const navLinks: { label: string; page: Page }[] = [
    { label: t.navHome, page: "home" },
    { label: t.navUxCases, page: "ux-cases" },
    { label: t.navAbout, page: "about" },
  ];

  return (
    <div className="min-h-[100dvh] w-full py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden flex flex-col items-center">
      {/* Fixed background — never shifts between pages */}
      <div
        className="fixed inset-0"
        style={{ zIndex: -1, backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "rgb(10, 5, 25)" }}
      />
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center mb-10 w-full max-w-[900px]"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="nav-wrapper">
            <nav className="glass-nav text-white px-6 py-3 flex items-center gap-6">
              {navLinks.map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); setDetailView(null); }}
                  className={`font-medium transition-colors ${currentPage === page && !detailView ? "text-white" : "text-white/50 hover:text-white/80"}`}
                  style={{ fontSize: "18px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {label}
                </button>
              ))}
              <a href="https://www.linkedin.com/in/joaomduarte/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={18} />
              </a>
            </nav>
          </div>
          <div className="hidden md:block">
            <LangPill lang={lang} setLang={setLang} />
          </div>
        </div>

        <div
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight text-center mb-6 h-[1.2em] flex items-center justify-center"
          style={{ perspective: "600px" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={greetingIndex}
              initial={{ rotateX: 90, opacity: 0, transformOrigin: "50% 0%" }}
              animate={{ rotateX: 0, opacity: 1, transformOrigin: "50% 0%" }}
              exit={{ rotateX: -90, opacity: 0, transformOrigin: "50% 100%" }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{ display: "block", backfaceVisibility: "hidden" }}
            >
              {greetings[greetingIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={lang}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-lg md:text-xl text-white/60 text-center max-w-2xl leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
        </AnimatePresence>
      </motion.header>

      {/* Page content */}
      <div className="card-glow-wrapper w-full max-w-[900px]" onMouseMove={handleCardMouseMove}>
        <AnimatePresence mode="wait">

          {/* ── Detail view ── */}
          {detailView && (
            <DetailPage
              key={`detail-${detailView.project.title}`}
              detail={detailView}
              pool={detailView.category === "project" ? projectsData : uxCasesData}
              onBack={closeDetail}
              onSelectRelated={(p) => openDetail(p, detailView.category)}
              lang={lang}
            />
          )}

          {/* ── Home ── */}
          {!detailView && currentPage === "home" && (
            <motion.main
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-3xl p-8 md:p-12 shadow-2xl glass-card"
            >
              <section className="w-full">
                <h2 className="text-2xl font-bold text-white mb-8 text-left">{t.myProjects}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {projectsData.map((project, index) => (
                    <GridCard key={project._id ?? project.title} project={project} index={index} onClick={() => openDetail(project, "project")} />
                  ))}
                </div>
              </section>
            </motion.main>
          )}

          {/* ── UX Cases ── */}
          {!detailView && currentPage === "ux-cases" && (
            <motion.main
              key="ux-cases"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-3xl p-8 md:p-12 shadow-2xl glass-card"
            >
              <section className="w-full">
                <h2 className="text-2xl font-bold text-white mb-2 text-left">{t.uxCasesTitle}</h2>
                <p className="text-white/50 text-sm mb-8">{t.uxCasesSubtitle}</p>

                <AnimatePresence mode="wait">
                  {!uxUnlocked && (
                    <motion.div key="gate" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="flex flex-col items-center gap-6 py-12">
                      <div className="w-16 h-16 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                        <MdLockOutline size={30} className="text-white/70" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold text-lg mb-1">{t.protectedTitle}</p>
                        <p className="text-white/50 text-sm">{t.protectedHint}</p>
                      </div>
                      <form
                        className="flex flex-col items-center gap-3 w-full max-w-xs"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (uxPasswordInput === uxPassword) {
                            setUxUnlocked(true);
                            setUxError(false);
                          } else {
                            setUxError(true);
                            setShakeKey((k) => k + 1);
                            setUxPasswordInput("");
                          }
                        }}
                      >
                        <div key={shakeKey} className={`w-full ${uxError ? "input-shake" : ""}`}>
                          <input
                            type="password"
                            placeholder={t.passwordPlaceholder}
                            value={uxPasswordInput}
                            onChange={(e) => { setUxPasswordInput(e.target.value); setUxError(false); }}
                            className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center tracking-widest text-lg ${uxError ? "border-red-400/60 ring-2 ring-red-400/40" : "border-white/15"}`}
                            autoFocus
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <MdOutlineSend size={18} />
                          {t.passwordPlaceholder}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {uxUnlocked && (
                    <motion.div key="unlocked" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                      <div className="flex items-center gap-2 mb-8">
                        <span className="text-green-400 text-sm">{t.accessGranted}</span>
                        <button onClick={() => { setUxUnlocked(false); setUxPasswordInput(""); }} className="text-white/30 hover:text-white/60 text-xs ml-2 transition-colors bg-transparent border-none cursor-pointer">{t.lock}</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {uxCasesData.map((project, index) => (
                          <GridCard key={project._id ?? project.title} project={project} index={index} onClick={() => openDetail(project, "ux-case")} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </motion.main>
          )}

          {/* ── About ── */}
          {!detailView && currentPage === "about" && (
            <motion.main
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-3xl p-8 md:p-12 shadow-2xl glass-card"
            >
              <section className="w-full flex flex-col gap-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="shrink-0 w-32 h-32 rounded-full overflow-hidden shadow-lg">
                    {aboutData?.avatarUrl ? (
                      <img src={aboutData.avatarUrl} alt={aboutData.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-4xl font-extrabold text-white">
                        {(aboutData?.name ?? "João")[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white">{aboutData?.name ?? "João"}</h2>
                    <p className="text-white/70 leading-relaxed">
                      {aboutData?.bio || t.defaultBio}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">{t.skills}</h3>
                  <div className="flex flex-wrap gap-3">
                    {(aboutData?.skills?.length ? aboutData.skills : DEFAULT_SKILLS).map((skill) => (
                      <span key={skill} className="text-sm font-medium bg-white/10 text-white/80 border border-white/10 rounded-full px-4 py-1.5">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">{t.tools}</h3>
                  <div className="flex flex-wrap gap-3">
                    {(aboutData?.tools?.length ? aboutData.tools : DEFAULT_TOOLS).map((tool) => (
                      <span key={tool} className="text-sm font-medium bg-purple-500/20 text-purple-200 border border-purple-400/20 rounded-full px-4 py-1.5">{tool}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">{t.experience}</h3>
                  <div className="flex flex-col gap-5">
                    {(aboutData?.experience?.length ? aboutData.experience : DEFAULT_EXPERIENCE).map((exp, i) => (
                      <div key={`${exp.role}-${i}`} className="flex flex-col md:flex-row md:items-center justify-between gap-1 border-b border-white/10 pb-4">
                        <div>
                          <p className="font-semibold text-white">{exp.role}</p>
                          <p className="text-white/50 text-sm">{exp.company}</p>
                        </div>
                        <span className="text-white/40 text-sm shrink-0">{exp.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.main>
          )}

        </AnimatePresence>
      </div>

      {/* Sanity config notice — only shown in dev when project ID is missing */}
      {!sanityReady && import.meta.env.DEV && !sanityClient && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-yellow-900/80 border border-yellow-600/40 text-yellow-200 text-xs rounded-xl px-4 py-3 backdrop-blur-sm z-50">
          <strong>Sanity not connected.</strong> Add <code className="bg-white/10 px-1 rounded">VITE_SANITY_PROJECT_ID</code> to your environment secrets to load live content.
        </div>
      )}
    </div>
  );
}

export default App;
