import mindverseImg from '../assets/mindverse_preview.png';
import jobmatchaiImg from '../assets/jobmatchai_preview.png';
import trackphoneImg from '../assets/trackphone_preview.png';
import neurolearnImg from '../assets/neurolearn_preview.png';
import crimedashboardImg from '../assets/crimedashboard_preview.png';

// Import new MindVerse screenshots
import mindverseDetail1 from '../assets/mindverse_detail_1.png';
import mindverseDetail2 from '../assets/mindverse_detail_2.png';
import mindverseDetail3 from '../assets/mindverse_detail_3.png';

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  subtitle: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  architecture: string;
  challenges: string;
  githubUrl: string;
  demoUrl: string;
  gallery: string[];
  isMobileOnly?: boolean;
  mobileImages?: string[];
}

export const projectsList: Project[] = [
  {
    id: 1,
    slug: 'mindverse',
    title: 'MindVerse',
    category: 'AI & Mental Wellness',
    image: mindverseImg,
    subtitle: 'Cognitive Neural Hub & AI Assistant',
    problem: 'Traditional note-taking is static and unstructured. MindVerse maps your knowledge into a live interactive 3D neural map with automated contextual linking.',
    solution: 'An AI-powered workspace that dynamically connects thoughts, notes, and research. Using state-of-the-art vector embeddings, MindVerse analyzes user entries in real-time, instantly graphing semantic relationships in a responsive 3D WebGL canvas.',
    features: [
      'Dynamic 3D knowledge graphs using Three.js',
      'AI-generated notes summation & parsing',
      'Low-latency semantic cross-referencing',
      'Custom mental health sentiment mapping'
    ],
    techStack: ['React', 'Next.js', 'LLM / LangChain', 'Three.js', 'Python', 'Tailwind CSS'],
    architecture: 'Microservices architecture with a Next.js frontend communicating with a FastAPI backend. Vector storage is managed via Pinecone, and LLM processing is handled via LangChain pipelines.',
    challenges: 'Rendering 10,000+ interactive nodes in a WebGL environment without dropping below 60fps was solved by implementing custom shader materials, instanced meshes, and worker-thread physics simulation.',
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    isMobileOnly: true,
    mobileImages: [mindverseDetail1, mindverseDetail2, mindverseDetail3],
    gallery: [
      mindverseDetail1,
      mindverseDetail2,
      mindverseDetail3,
      mindverseImg
    ]
  },
  {
    id: 2,
    slug: 'jobmatchai',
    title: 'JobMatchAI',
    category: 'AI Recruitment',
    image: jobmatchaiImg,
    subtitle: 'Resume Parser & Talent Matching Agent',
    problem: 'Human screening of thousands of CVs results in massive bias, fatigue, and poor alignment with rapidly changing tech stacks.',
    solution: 'An autonomous agentic recruitment system that parses, screens, and ranks candidates based on deep skill-set semantic understanding rather than keyword matching.',
    features: [
      'High-accuracy PDF parsing engine',
      'Semantic candidate ranking matrices',
      'Automated interview feedback loops',
      'Bias-reduction profiling configuration'
    ],
    techStack: ['Python', 'OpenCV / OCR', 'NLP / Transformers', 'Flask', 'React', 'Tailwind'],
    architecture: 'Vite React frontend backed by a Flask API. Heavy PDF parsing is decoupled via Celery queues, while transformer embeddings calculate candidate relevance matrices.',
    challenges: 'Deciphering multi-column resumes and complex CV layouts. Resolved by leveraging OCR pre-processing alongside layout-aware NLP layout parsers.',
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 3,
    slug: 'trackphone',
    title: 'Track My Phone',
    category: 'Mobile Security',
    image: trackphoneImg,
    subtitle: 'Anti-Theft & Spatial Security App',
    problem: 'Stolen phones frequently get powered off immediately, rendering stock trackers useless. This provides silent background beacons and triggers.',
    solution: 'A native mobile security layer that continues tracking device status silently. Employs battery-saving background beacons, SMS triggers, and simulated "Fake Shutdown" screens to trap unauthorized users.',
    features: [
      'Low-latency socket telemetry updates',
      'SMS trigger commands parser',
      'Remote encrypted data wipe system',
      'Intelligent ambient voice recording triggers'
    ],
    techStack: ['Flutter', 'Firebase', 'Flask', 'Google Maps API', 'Dart'],
    architecture: 'Cross-platform Flutter application integrated with a Python Flask service for SMS routing, using Firestore for real-time telemetry syncing.',
    challenges: 'Executing background processes reliably across strict iOS and Android OS restrictions. Solved by implementing platform-specific native background services and push notifications.',
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    gallery: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 4,
    slug: 'neurolearn',
    title: 'NeuroLearn',
    category: 'AI Education',
    image: neurolearnImg,
    subtitle: 'Cognitive Engagement Tracker',
    problem: 'E-learning modules lack real-time feedback loop parameters, leading to high drop-out rates and poor retention monitoring.',
    solution: 'An AI-powered virtual classroom assistant that gauges student focus and engagement levels in real time through custom browser-based webcam facial gaze modeling.',
    features: [
      'Real-time facial attention models',
      'Attention-level charts dashboard',
      'Optimized space-repetition notifications',
      'Dynamic curriculum pacing algorithm'
    ],
    techStack: ['TensorFlow.js', 'Python', 'Firebase', 'APIs', 'React', 'Tailwind'],
    architecture: 'Fully client-side TensorFlow.js model runner built in React, synchronizing learning metadata to Firebase Firestore for analytical dashboard rendering.',
    challenges: 'Running deep learning face-mesh calculations directly inside low-power browser engines. Solved by pruning standard neural network layers and running model steps inside WebGL shaders.',
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    gallery: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 5,
    slug: 'crimedashboard',
    title: 'Crime Dashboard',
    category: 'Data Visualization',
    image: crimedashboardImg,
    subtitle: 'Spatial Analytics & Predictive Mapping',
    problem: 'Municipalities fail to utilize historical geospatial data effectively to deploy emergency responses preemptively.',
    solution: 'An interactive geographical analysis interface designed for law enforcement to identify high-density incident locations, forecast trend spikes, and dispatch patrols.',
    features: [
      'Predictive clustering algorithms (K-Means)',
      'Interactive choropleth map layers',
      'Automated priority response updates',
      'Dynamic date-range and type filtering'
    ],
    techStack: ['Python', 'TensorFlow', 'Power BI / Deck.gl', 'React', 'Tailwind CSS'],
    architecture: 'Geospatial pipeline extracting data via Python ETLs, serving coordinates through a serverless API, and mapping with Mapbox/Deck.gl on the React frontend.',
    challenges: 'Plotting 500,000+ geographical points in real-time without sluggish zoom interactions. Solved by implementing client-side spatial indexing and octree-based spatial search algorithms.',
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    gallery: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop'
    ]
  }
];
