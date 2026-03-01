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
  accountStatus: "Verified",
};

export const RESEARCH_PUBLICATIONS = [
  {
    id: 1,
    type: "Project Recommendation",
    matchScore: 98,
    title: "Deep Learning Architectures for Academic Knowledge Graphs",
    leadResearcher: "Prof. Rameez Khan",
    department: "Computer Science",
    domain: "Artificial Intelligence",
    description:
      "A novel approach to structuring institutional academic data using graph neural networks to foster better researcher discovery and collaboration.",
    keywords: ["AI", "Graph Theory", "Institutional Data"],
    stats: { citations: 45, views: "1.2k", relevance: "Core Match" },
    avatar: "/placeholder-avatar.svg",
    time: "New Match",
    moderationStatus: "Approved",
    projectStatus: "Active",
  },
  {
    id: 2,
    type: "Interdisciplinary Project",
    matchScore: 85,
    title: "Sustainable Urban Planning: A Machine Learning Perspective",
    leadResearcher: "Zoya Malik",
    department: "Civil Engineering",
    domain: "Sustainability",
    description:
      "Integrating ML models to predict urban growth patterns in Aligarh, specifically focusing on energy efficiency and heritage preservation.",
    keywords: ["Sustainability", "ML", "Urban Planning"],
    stats: { citations: 12, views: "850", relevance: "Strong Signal" },
    avatar: "/placeholder-avatar.svg",
    time: "2d ago",
    moderationStatus: "Approved",
    projectStatus: "Research Phase",
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
    domain: "Mental Health",
  },
  {
    id: 2,
    name: "Mohd Zaid",
    role: "Research Scholar",
    department: "Department of Physics",
    avatar: "/placeholder-avatar.svg",
    mutualConnections: 5,
    domain: "Quantum Physics",
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
    domain: "English Literature",
  },
  {
    id: 4,
    name: "Prof. Mansoor Ali",
    role: "Professor",
    department: "Department of Medicine",
    avatar: "/placeholder-avatar.svg",
    followers: 1500,
    domain: "Healthcare AI",
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
    type: "Research Project",
    title: "Neuroplasticity and Digital Learning Environments",
    leadResearcher: "Dr. Ayesha Khan",
    department: "Psychology",
    domain: "Neuroscience",
    description:
      "Investigating how prolonged exposure to interactive academic platforms influences cognitive mapping and retention in postgraduate students.",
    keywords: ["Psychology", "Neuroscience", "EdTech"],
    stats: { relevance: "Following" },
    avatar: "/placeholder-avatar.svg",
    time: "4h ago",
    projectStatus: "Ongoing",
  },
  {
    id: 1002,
    type: "Research Project",
    title: "Quantum Simulations of Crystalline Structures at AMU",
    leadResearcher: "Mohd Zaid",
    department: "Physics",
    domain: "Quantum Physics",
    description:
      "A computational study using DFT to predict the stability of new alloy configurations designed in the AMU department labs.",
    keywords: ["Physics", "Quantum", "Materials"],
    stats: { relevance: "Following" },
    avatar: "/placeholder-avatar.svg",
    time: "1d ago",
    projectStatus: "Proposed",
  },
];

export const ADMIN_STATS = {
  totalUsers: 1240,
  pendingVerifications: 8,
  pendingModerations: 12,
  totalPublications: 450,
  activeCollaborations: 86,
};

export const PENDING_VERIFICATIONS = [
  {
    id: "V001",
    name: "Ammar Siddiqui",
    role: "Research Scholar",
    department: "Department of Physics",
    universityId: "RS2025012",
    appliedAt: "2h ago",
    status: "Pending",
  },
  {
    id: "V002",
    name: "Dr. Farah Jafri",
    role: "Faculty",
    department: "Department of History",
    universityId: "FAC2026005",
    appliedAt: "5h ago",
    status: "Pending",
  },
  {
    id: "V003",
    name: "Zaid Ahmad",
    role: "Assistant Professor",
    department: "Department of Electronics Engineering",
    universityId: "FAC2026009",
    appliedAt: "1d ago",
    status: "Pending",
  },
  {
    id: "V004",
    name: "Sana Khan",
    role: "PhD Candidate",
    department: "Life Sciences",
    universityId: "RS2025099",
    appliedAt: "3d ago",
    status: "Pending",
  },
];

export const PENDING_PUBLICATIONS = [
  {
    id: "M101",
    title: "Quantum Entanglement in Microgravity Environments",
    author: "Zaid Ahmad",
    domain: "Quantum Physics",
    year: 2026,
    submittedAt: "1d ago",
  },
  {
    id: "M102",
    title: "The Socio-Economic Impact of Medieval AMU Structures",
    author: "Dr. Farah Jafri",
    domain: "Medieval History",
    year: 2025,
    submittedAt: "2d ago",
  },
  {
    id: "M103",
    title: "Next-Generation Neural Architectures for Academic Search",
    author: "Ammar Siddiqui",
    domain: "Computer Science",
    year: 2026,
    submittedAt: "3d ago",
  },
  {
    id: "M104",
    title: "Advancements in Photovoltaic Efficiency: A Comparative Study",
    author: "Sana Khan",
    domain: "Electronics Engineering",
    year: 2026,
    submittedAt: "4d ago",
  },
];

export const ANALYTICS_DATA = {
  profileDistribution: [
    { label: "Faculty", value: 340, color: "bg-amu-green" },
    { label: "Research Scholars", value: 580, color: "bg-blue-500" },
    { label: "Students", value: 320, color: "bg-amu-gold" },
  ],
  researchActivities: [
    { month: "Sep", publications: 45, citations: 120 },
    { month: "Oct", publications: 52, citations: 150 },
    { month: "Nov", publications: 48, citations: 180 },
    { month: "Dec", publications: 70, citations: 210 },
    { month: "Jan", publications: 65, citations: 240 },
    { month: "Feb", publications: 85, citations: 310 },
  ],
  collaborationTrends: [
    { type: "Inter-Departmental", value: 65, color: "bg-amu-green" },
    { type: "International", value: 25, color: "bg-blue-500" },
    { type: "Industry Partnerships", value: 15, color: "bg-purple-500" },
    { type: "Local/Community", value: 45, color: "bg-amu-gold" },
  ],
  topResearchFields: [
    { field: "Quantum Physics", count: 124, percentage: 85 },
    { field: "Islamic Studies", count: 98, percentage: 70 },
    { field: "Nanotechnology", count: 76, percentage: 55 },
    { field: "Machine Learning", count: 142, percentage: 95 },
    { field: "Medieval History", count: 65, percentage: 40 },
  ],
};

export const EXPLORE_RESEARCHERS = [
  {
    id: "r1",
    name: "Dr. Sarah Ahmed",
    role: "Faculty",
    department: "Department of Computer Science",
    interests: ["AI", "Knowledge Graphs"],
    avatar: "/placeholder-avatar.svg",
    domain: "Artificial Intelligence",
  },
  {
    id: "r2",
    name: "Dr. Ayesha Khan",
    role: "Assistant Professor",
    department: "Department of Psychology",
    interests: ["Mental Health", "Cognitive Science"],
    avatar: "/placeholder-avatar.svg",
    domain: "Psychology",
  },
  {
    id: "r3",
    name: "Mohd Zaid",
    role: "Research Scholar",
    department: "Department of Physics",
    interests: ["Quantum Computing", "Material Science"],
    avatar: "/placeholder-avatar.svg",
    domain: "Quantum Physics",
  },
  {
    id: "r4",
    name: "Prof. Arman Rasool Faridi",
    role: "Professor",
    department: "Department of Computer Science",
    interests: ["Software Engineering", "Collaboration Systems"],
    avatar: "/placeholder-avatar.svg",
    domain: "Computer Science",
  },
  {
    id: "r5",
    name: "Zoya Malik",
    role: "Research Scholar",
    department: "Department of Civil Engineering",
    interests: ["Sustainable Cities", "Urban Data"],
    avatar: "/placeholder-avatar.svg",
    domain: "Civil Engineering",
  },
];

export const EXPLORE_PROJECTS = RESEARCH_PUBLICATIONS;

export const FOLLOW_REQUESTS_RECEIVED = [
  {
    id: "fr1",
    name: "Ammar Siddiqui",
    role: "Research Scholar",
    department: "Department of Physics",
    avatar: "/placeholder-avatar.svg",
    appliedAt: "2h ago",
  },
  {
    id: "fr2",
    name: "Dr. Farah Jafri",
    role: "Faculty",
    department: "Department of History",
    avatar: "/placeholder-avatar.svg",
    appliedAt: "5h ago",
  },
  {
    id: "fr3",
    name: "Sana Khan",
    role: "PhD Candidate",
    department: "Life Sciences",
    avatar: "/placeholder-avatar.svg",
    appliedAt: "1d ago",
  },
];

export const FOLLOW_REQUESTS_SENT = [
  {
    id: "fs1",
    name: "Prof. Mansoor Ali",
    role: "Professor",
    department: "Department of Medicine",
    avatar: "/placeholder-avatar.svg",
    status: "Pending",
  },
  {
    id: "fs2",
    name: "Dr. Ayesha Khan",
    role: "Associate Professor",
    department: "Department of Psychology",
    avatar: "/placeholder-avatar.svg",
    status: "Pending",
  },
];
