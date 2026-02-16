export const CURRENT_USER = {
  name: "Dr. Sarah Ahmed",
  handle: "@sarahahmed",
  universityId: "FAC2024001",
  avatar: "/placeholder-avatar.svg",
  role: "Faculty",
  department: "Department of Computer Science",
  designation: "Assistant Professor",
  biography:
    "Passionate researcher in AI and Knowledge Graphs, dedicated to enhancing institutional collaboration at AMU.",
  researchInterests:
    "Artificial Intelligence, Knowledge Graphs, Semantic Web, Graph Neural Networks",
  lastUpdated: "2026-02-14T15:30:00Z",
};

export const RESEARCH_PUBLICATIONS = [
  {
    id: 1,
    type: "Publication Match",
    matchScore: 98,
    title: "Deep Learning Architectures for Academic Knowledge Graphs",
    authors: "Prof. Rameez Khan, et al.",
    venue: "IEEE Transactions on Neural Networks",
    abstract:
      "A novel approach to structuring institutional academic data using graph neural networks to foster better researcher discovery and collaboration.",
    tags: ["AI", "Graph Theory", "Institutional Data"],
    stats: { citations: 45, views: "1.2k", relevance: "Core Match" },
    avatar: "/placeholder-avatar.svg",
    time: "New Match",
  },
  {
    id: 2,
    type: "Interdisciplinary Find",
    matchScore: 85,
    title: "Sustainable Urban Planning: A Machine Learning Perspective",
    authors: "Zoya Malik, Dr. Ahmed Qadri",
    venue: "Sustainable Cities and Society",
    abstract:
      "Integrating ML models to predict urban growth patterns in Aligarh, specifically focusing on energy efficiency and heritage preservation.",
    tags: ["Sustainability", "ML", "Urban Planning"],
    stats: { citations: 12, views: "850", relevance: "Strong Signal" },
    avatar: "/placeholder-avatar.svg",
    time: "2d ago",
  },
];

export const SUGGESTED_USERS = [
  {
    name: "Dr. Ayesha Khan",
    role: "Faculty • Psychology",
    avatar: "/placeholder-avatar.svg",
  },
  {
    name: "Rahul Sharma",
    role: "Student • Physics",
    avatar: "/placeholder-avatar.svg",
  },
  {
    name: "Faizan Ali",
    role: "Alumni • 2018 Batch",
    avatar: "/placeholder-avatar.svg",
  },
];

export const FOLLOWING = [
  {
    id: 1,
    name: "Dr. Ayesha Khan",
    role: "Associate Professor",
    department: "Department of Psychology",
    avatar: "/placeholder-avatar.svg",
    mutualConnections: 12,
  },
  {
    id: 2,
    name: "Mohd Zaid",
    role: "Research Scholar",
    department: "Department of Physics",
    avatar: "/placeholder-avatar.svg",
    mutualConnections: 5,
  },
];

export const FOLLOWERS = [
  {
    id: 3,
    name: "Sana Fatima",
    role: "Assistant Professor",
    department: "Department of English",
    avatar: "/placeholder-avatar.svg",
    followers: 120,
  },
  {
    id: 4,
    name: "Prof. Mansoor Ali",
    role: "Professor",
    department: "Department of Medicine",
    avatar: "/placeholder-avatar.svg",
    followers: 1500,
  },
];

export const COLLABORATIONS = [
  {
    id: 201,
    name: "Modern AI Ethics Project",
    partners: ["Dr. Sameer Rizvi", "Dr. Sarah Ahmed"],
    avatar: "/placeholder-avatar.svg",
    status: "Active",
    progress: 65,
  },
  {
    id: 202,
    name: "Smart Campus Initiative",
    partners: ["Alina Abbas", "Dr. Sarah Ahmed"],
    avatar: "/placeholder-avatar.svg",
    status: "Planning",
    progress: 15,
  },
];

export const COLLABORATION_REQUESTS_RECEIVED = [
  {
    id: 301,
    name: "Knowledge Graph Research",
    from: "Dr. Sameer Ahmed",
    department: "Computer Science",
    avatar: "/placeholder-avatar.svg",
    time: "2h ago",
  },
  {
    id: 302,
    name: "Urban Data Analysis",
    from: "Prof. Zoya Malik",
    department: "Civil Engineering",
    avatar: "/placeholder-avatar.svg",
    time: "1d ago",
  },
];

export const COLLABORATION_REQUESTS_SENT = [
  {
    id: 401,
    name: "AI in Healthcare",
    to: "Prof. Mansoor Ali",
    department: "Medicine",
    avatar: "/placeholder-avatar.svg",
    time: "3h ago",
    status: "Pending",
  },
];

export const FOLLOWING_FEED = [
  {
    id: 1001,
    type: "Publication",
    title: "Neuroplasticity and Digital Learning Environments",
    authors: "Dr. Ayesha Khan, et al.",
    venue: "Journal of Educational Psychology",
    abstract:
      "Investigating how prolonged exposure to interactive academic platforms influences cognitive mapping and retention in postgraduate students.",
    tags: ["Psychology", "Neuroscience", "EdTech"],
    stats: { citations: 8, views: "650", relevance: "Following" },
    avatar: "/placeholder-avatar.svg",
    time: "4h ago",
  },
  {
    id: 1002,
    type: "Publication",
    title: "Quantum Simulations of Crystalline Structures at AMU",
    authors: "Mohd Zaid, Prof. Rameez Khan",
    venue: "Physical Review B",
    abstract:
      "A computational study using DFT to predict the stability of new alloy configurations designed in the AMU department labs.",
    tags: ["Physics", "Quantum", "Materials"],
    stats: { citations: 3, views: "280", relevance: "Following" },
    avatar: "/placeholder-avatar.svg",
    time: "1d ago",
  },
];
