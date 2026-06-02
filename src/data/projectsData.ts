import mindverseImg from '../assets/mindverse_preview.png';
import neurolearnImg from '../assets/neurolearn_preview.png';
import crimedashboardImg from '../assets/crimedashboard_preview.png';

// Import new MindVerse screenshots
import mindverseDetail1 from '../assets/mindverse/mindverse_detail_1.png';
import mindverseDetail2 from '../assets/mindverse/mindverse_detail_2.png';
import mindverseDetail3 from '../assets/mindverse/mindverse_detail_3.png';

// Import CPP project screenshots and video
import cppVideo from '../assets/cpp/CPP.mp4';
import cppImg1 from '../assets/cpp/CPP1.jpeg';
import cppImg2 from '../assets/cpp/CPP2.jpeg';
import cppImg3 from '../assets/cpp/CPP3.png';
import cppImg4 from '../assets/cpp/CPP4.png';

// Import PDF Chatbot screenshots
import chatbotSS1 from '../assets/pdf_chatbot/PDF Chatbot SS1.png';
import chatbotSS2 from '../assets/pdf_chatbot/PDF Chatbot SS2.png';
import chatbotSS3 from '../assets/pdf_chatbot/PDF Chatbot SS3.png';
import chatbotSS4 from '../assets/pdf_chatbot/PDF Chatbot SS4.png';
import chatbotSS5 from '../assets/pdf_chatbot/PDF Chatbot SS5.png';

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
  videoUrl?: string; // Video URL for project detail showcase
  isLaptopMockupImage?: boolean; // Flag to render screenshot inside laptop mockup screen
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
    slug: 'crypto-price-prediction',
    title: 'Crypto Price Prediction',
    category: 'Machine Learning',
    image: cppImg3,
    subtitle: 'XGBoost Time-Series Regressor & Flask API',
    problem: 'The cryptocurrency market presents unique challenges with its volatility and complexity. This solution aims to reduce uncertainty through data-driven predictions, provide accessible visualizations of potential market movements, help both novice and experienced traders make more informed decisions, and democratize access to sophisticated prediction tools typically available only to institutional investors.',
    solution: "We've developed a comprehensive solution that predicts cryptocurrency price movements using XGBoost regression models, helping investors make more informed decisions in this volatile market.",
    features: [
      'Real-time cryptocurrency price predictions',
      'Interactive data visualization',
      'Support for multiple cryptocurrencies (BTC, ETH, XRP, etc.)',
      'Responsive design for all devices',
      'Advanced XGBoost regression model',
      'Historical price analysis and trends'
    ],
    techStack: ['Python', 'Flask', 'XGBoost', 'React', 'Vite', 'Chart.js', 'Pandas', 'NumPy'],
    architecture: 'Backend: Flask API serving trained machine learning models. Frontend: Reactive Vite/React application providing intuitive visualizations. ML Models: Custom-trained XGBoost regressors for multiple cryptocurrencies, including BNB and Shiba Inu. Data Analysis: Historical 5-year price data analysis and feature engineering.',
    challenges: 'This project has deepened my expertise in: Time-series forecasting with XGBoost, backend services in Flask, responsive design in React, and financial market data analysis.',
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    videoUrl: cppVideo,
    gallery: [
      cppImg1,
      cppImg2,
      cppImg3,
      cppImg4
    ]
  },
  {
    id: 3,
    slug: 'ai-pdf-chatbot',
    title: 'AI PDF Chatbot (RAG-based)',
    category: 'AI & NLP',
    image: chatbotSS1,
    subtitle: 'LangChain & LangGraph Stateful Document QA Agent',
    problem: 'Traditional note-taking and documentation is static and hard to search. Users waste hours manually scanning through long PDFs to extract relevant context, facts, and citations.',
    solution: 'An autonomous agentic chatbot that ingests PDFs, stores vector embeddings in Supabase/ChromaDB, and answers user queries using OpenAI (or another LLM provider) utilizing LangChain and LangGraph as orchestration frameworks.',
    features: [
      'Document Ingestion Graph: Upload and parse PDFs into vector embeddings',
      'Retrieval Graph: Stateful graph orchestrator for retrieval and QA',
      'Streaming Responses: Real-time streaming of partial responses to UI',
      'LangGraph State-Machine: Stateful multi-agent graph visualization',
      'Next.js Frontend: File upload, real-time chat, and extensible React UI'
    ],
    techStack: ['Turborepo', 'Yarn Workspaces', 'Next.js 14', 'TypeScript', 'LangChain', 'LangGraph', 'OpenAI', 'Supabase', 'ChromaDB', 'Tailwind CSS'],
    architecture: 'Monorepo built with Turborepo and Yarn workspaces. Next.js 14 App Router frontend utilizing Tailwind CSS and Radix UI components. Node.js backend using TypeScript, LangChain, and LangGraph for stateful agent workflows, backed by Supabase and ChromaDB vector search indexes.',
    challenges: 'Managing retrieval workflows and agent checkpoints in complex conversation flows. Solved by employing LangGraph to structure the ingestion and retrieval processes as state machines, facilitating easy debugging, tracking, and telemetry.',
    githubUrl: 'https://github.com',
    demoUrl: 'https://demo.com',
    isLaptopMockupImage: true,
    gallery: [
      chatbotSS2,
      chatbotSS3,
      chatbotSS4,
      chatbotSS5
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
