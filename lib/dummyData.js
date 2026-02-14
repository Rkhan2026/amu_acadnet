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
