export const CURRENT_USER = {
  name: "Dr. Sita Ram",
  handle: "@sitaram",
  universityId: "FAC2024001",
  avatar: "/placeholder-avatar.svg",
  role: "Faculty",
  department: "Department of Computer Science",
  designation: "Assistant Professor",
  biography:
    "Passionate researcher in AI and Knowledge Graphs, dedicated to enhancing institutional collaboration at AMU.",
  researchInterests: "Artificial Intelligence",
  lastUpdated: "2026-02-14T15:30:00Z",
  accountStatus: "Verified",
};

export const RESEARCH_PUBLICATIONS = [
  {
    id: 1,
    type: "Project Recommendation",
    matchScore: 98,
    title: "Deep Learning Architectures for Academic Knowledge Graphs",
    leadResearcher: "Prof. Rajesh Khan",
    department: "Computer Science",
    domain: "Artificial Intelligence",
    description:
      "A novel approach to structuring institutional academic data using graph neural networks to foster better researcher discovery and collaboration.",
    stats: { citations: 45, views: "1.2k", relevance: "Core Match" },
    avatar: "/placeholder-avatar.svg",
    time: "New Match",
    moderationStatus: "Approved",
    projectStatus: "Active",
    externalLinks: [
      {
        label: "GitHub Repository",
        url: "https://github.com/example/knowledge-graphs",
      },
      {
        label: "Project Dissertation",
        url: "https://example.com/dissertation.pdf",
      },
    ],
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
    stats: { citations: 12, views: "850", relevance: "Strong Signal" },
    avatar: "/placeholder-avatar.svg",
    time: "2d ago",
    moderationStatus: "Approved",
    projectStatus: "Research Phase",
    externalLinks: [
      { label: "Research Paper", url: "https://example.com/paper.pdf" },
      { label: "Dataset Access", url: "https://example.com/data" },
    ],
  },
  {
    id: 3,
    type: "Personal Project",
    matchScore: 100,
    title: "Graph Neural Networks for Institutional Data",
    leadResearcher: "Dr. Sita Ram",
    department: "Computer Science",
    domain: "Artificial Intelligence",
    description:
      "Exploiting the structural properties of academic networks to improve recommendation engines within the AMU ecosystem.",
    stats: { citations: 5, views: "300", relevance: "Owner" },
    avatar: "/placeholder-avatar.svg",
    time: "3m ago",
    moderationStatus: "Approved",
    approvalStatus: "Approved",
    projectStatus: "Active",
    team: [
      {
        name: "Dr. Samir Rizvi",
        role: "Co-Investigator",
        avatar: "/placeholder-avatar.svg",
      },
      {
        name: "Ammar Siddiqui",
        role: "Research Assistant",
        avatar: "/placeholder-avatar.svg",
      },
    ],
    externalLinks: [
      { label: "Dataset", url: "https://example.com/graph-data" },
    ],
  },
  {
    id: 4,
    type: "Collaborative Project",
    matchScore: 95,
    title: "Eco-friendly Campus Initiatives",
    leadResearcher: "Dr. Sita Ram",
    department: "Computer Science",
    domain: "Sustainability",
    description:
      "A joint effort to digitize and optimize waste management systems across various university departments.",
    stats: { citations: 1, views: "150", relevance: "Owner" },
    avatar: "/placeholder-avatar.svg",
    time: "1w ago",
    moderationStatus: "Approved",
    approvalStatus: "Pending",
    projectStatus: "Ongoing",
    externalLinks: [],
  },
];

export const SUGGESTED_USERS = [
  {
    name: "Dr. Ananya Iyer",
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
    name: "Dr. Ananya Iyer",
    role: "Associate Professor",
    department: "Department of Psychology",
    avatar: "/placeholder-avatar.svg",
    mutualConnections: 12,
    domain: "Mental Health",
  },
  {
    id: 2,
    name: "Mohit Zaid",
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
    name: "Sanya Fatima",
    role: "Assistant Professor",
    department: "Department of English",
    avatar: "/placeholder-avatar.svg",
    followers: 120,
    domain: "English Literature",
  },
  {
    id: 4,
    name: "Prof. Manoj Ali",
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
    partners: ["Dr. Samir Rizvi", "Dr. Sita Ram"],
    avatar: "/placeholder-avatar.svg",
    status: "Active",
    progress: 65,
  },
  {
    id: 202,
    name: "Smart Campus Initiative",
    partners: ["Alisha Abbas", "Dr. Sita Ram"],
    avatar: "/placeholder-avatar.svg",
    status: "Ongoing",
    progress: 15,
  },
  {
    id: 203,
    name: "Digital Humanities Framework",
    partners: ["Prof. Sanya Fatima", "Dr. Sita Ram"],
    avatar: "/placeholder-avatar.svg",
    status: "Finished",
    progress: 100,
  },
];

export const COLLABORATION_REQUESTS_RECEIVED = [
  {
    id: 301,
    name: "Knowledge Graph Research",
    from: "Dr. Samir Ahmed",
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
    to: "Prof. Manoj Ali",
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
    leadResearcher: "Dr. Ananya Iyer",
    department: "Psychology",
    domain: "Neuroscience",
    description:
      "Investigating how prolonged exposure to interactive academic platforms influences cognitive mapping and retention in postgraduate students.",
    stats: { relevance: "Following" },
    avatar: "/placeholder-avatar.svg",
    time: "4h ago",
    projectStatus: "Ongoing",
    externalLinks: [
      { label: "Lab Reports", url: "https://example.com/reports" },
      { label: "Case Study", url: "https://example.com/case-study" },
    ],
  },
  {
    id: 1002,
    type: "Research Project",
    title: "Quantum Simulations of Crystalline Structures at AMU",
    leadResearcher: "Mohit Zaid",
    department: "Physics",
    domain: "Quantum Physics",
    description:
      "A computational study using DFT to predict the stability of new alloy configurations designed in the AMU department labs.",
    stats: { relevance: "Following" },
    avatar: "/placeholder-avatar.svg",
    time: "1d ago",
    projectStatus: "Proposed",
    externalLinks: [
      { label: "Proposal Document", url: "https://example.com/proposal.pdf" },
    ],
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
    avatar: "/placeholder-avatar.svg",
    email: "ammar.siddiqui@gmail.com",
    biography:
      "Passionate physics researcher focusing on quantum entanglement and its applications in real-world communication systems. Seeking to collaborate with cross-disciplinary teams at AMU.",
    researchInterests: ["Quantum Physics", "Entanglement", "Optics"],
  },
  {
    id: "V002",
    name: "Dr. Farah Jafri",
    role: "Faculty",
    department: "Department of History",
    universityId: "FAC2026005",
    appliedAt: "5h ago",
    status: "Pending",
    avatar: "/placeholder-avatar.svg",
    email: "farah.jafri@gmail.com",
    biography:
      "Historian specializing in medieval architecture and socio-economic structures in Northern India. Dedicated to preserving AMU's rich cultural heritage through extensive research.",
    researchInterests: ["Medieval History", "Architecture", "Socio-Economics"],
  },
  {
    id: "V003",
    name: "Zaid Ahmad",
    role: "Assistant Professor",
    department: "Department of Electronics Engineering",
    universityId: "FAC2026009",
    appliedAt: "1d ago",
    status: "Pending",
    avatar: "/placeholder-avatar.svg",
    email: "zaid.ahmad@gmail.com",
    biography:
      "Assistant Professor researching next-generation micro-electronics and IoT devices. Always open to mentoring driven students and collaborating on innovative electronics projects.",
    researchInterests: ["Micro-electronics", "IoT", "Embedded Systems"],
  },
  {
    id: "V004",
    name: "Sana Khan",
    role: "PhD Candidate",
    department: "Life Sciences",
    universityId: "RS2025099",
    appliedAt: "3d ago",
    status: "Pending",
    avatar: "/placeholder-avatar.svg",
    email: "sanya.khan.phd@gmail.com",
    biography:
      "PhD candidate analyzing genetic markers in local flora. Aiming to discover sustainable agricultural practices through deep biological research.",
    researchInterests: ["Genetics", "Botany", "Agriculture"],
  },
];

export const PENDING_PUBLICATIONS = [
  {
    id: "M101",
    title: "Quantum Entanglement in Microgravity Environments",
    author: "Zaid Ahmad",
    department: "Physics",
    domain: "Quantum Physics",
    year: 2026,
    submittedAt: "1d ago",
    description:
      "This project explores the behavior of quantum entangled particles under microgravity conditions using aboard-satellite simulators. The findings are expected to significantly advance our understanding of quantum communication networks for space applications.",
    team: [
      {
        name: "Zaid Ahmad",
        role: "Lead Researcher",
        avatar: "/placeholder-avatar.svg",
      },
      {
        name: "Dr. Ananya Iyer",
        role: "Supervisor",
        avatar: "/placeholder-avatar.svg",
      },
    ],
    externalLinks: [
      { label: "Experiment Proposal", url: "https://example.com/proposal.pdf" },
    ],
  },
  {
    id: "M102",
    title: "The Socio-Economic Impact of Medieval AMU Structures",
    author: "Dr. Farah Jafri",
    department: "History",
    domain: "Medieval History",
    year: 2025,
    submittedAt: "2d ago",
    description:
      "An in-depth analysis of the historical architecture within the AMU campus and their surrounding socio-economic influences during the medieval era. The study integrates archival research with modern structural assessments.",
    team: [
      {
        name: "Dr. Farah Jafri",
        role: "Principal Investigator",
        avatar: "/placeholder-avatar.svg",
      },
    ],
    externalLinks: [],
  },
  {
    id: "M103",
    title: "Next-Generation Neural Architectures for Academic Search",
    author: "Ammar Siddiqui",
    department: "Computer Science",
    domain: "Artificial Intelligence",
    year: 2026,
    submittedAt: "3d ago",
    description:
      "Developing novel transformer-based neural network architectures optimized for retrieving highly specific academic papers and institutional datasets, aiming to replace keyword-based search systems with semantic understanding.",
    team: [
      {
        name: "Ammar Siddiqui",
        role: "Lead Developer",
        avatar: "/placeholder-avatar.svg",
      },
      {
        name: "Dr. Sita Ram",
        role: "Co-Investigator",
        avatar: "/placeholder-avatar.svg",
      },
    ],
    externalLinks: [
      { label: "GitHub Repo", url: "https://github.com/example/neural-search" },
      { label: "Dataset Repository", url: "https://dataset.example.com" },
    ],
  },
  {
    id: "M104",
    title: "Advancements in Photovoltaic Efficiency: A Comparative Study",
    author: "Sanya Khan",
    department: "Electrical Engineering",
    domain: "Renewable Energy",
    year: 2026,
    submittedAt: "4d ago",
    description:
      "A comparative experimental study on various new-generation photovoltaic materials under extreme weather conditions typical to the northern Indian climate. The study aims to recommend optimal configurations for future university solar arrays.",
    team: [
      {
        name: "Sana Khan",
        role: "Lead Researcher",
        avatar: "/placeholder-avatar.svg",
      },
    ],
    externalLinks: [
      { label: "Material Specs", url: "https://example.com/specs" },
    ],
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
    name: "Dr. Sita Ram",
    role: "Faculty",
    department: "Department of Computer Science",
    interests: ["AI", "Knowledge Graphs"],
    avatar: "/placeholder-avatar.svg",
    domain: "Artificial Intelligence",
  },
  {
    id: "r2",
    name: "Dr. Ananya Iyer",
    role: "Assistant Professor",
    department: "Department of Psychology",
    interests: ["Mental Health", "Cognitive Science"],
    avatar: "/placeholder-avatar.svg",
    domain: "Psychology",
  },
  {
    id: "r3",
    name: "Mohit Zaid",
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
    name: "Prof. Manoj Ali",
    role: "Professor",
    department: "Department of Medicine",
    avatar: "/placeholder-avatar.svg",
    status: "Pending",
  },
  {
    id: "fs2",
    name: "Dr. Ananya Iyer",
    role: "Associate Professor",
    department: "Department of Psychology",
    avatar: "/placeholder-avatar.svg",
    status: "Pending",
  },
];
