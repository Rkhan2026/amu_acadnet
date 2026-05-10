import { getEmbedding, cosineSimilarity } from "../gemini.js";
import { prisma } from "../prisma.js";

/**
 * Generates collaboration recommendations for a specific user.
 */
export async function getCollaboratorRecommendations(universityID) {
  const currentUser = await prisma.user.findUnique({
    where: { universityID },
    include: {
      academicProfile: true,
      createdProjects: true,
    },
  });

  if (!currentUser || !currentUser.academicProfile) {
    return [];
  }

  const currentUserText = `
    Interests: ${currentUser.academicProfile.interestsSkills.join(", ")}
    Biography: ${currentUser.academicProfile.biography}
    Department: ${currentUser.department}
    Projects: ${currentUser.createdProjects.map((p) => p.title + ": " + p.description).join("; ")}
  `.trim();

  const currentUserEmbedding = await getEmbedding(currentUserText);
  if (!currentUserEmbedding) return [];

  const otherUsers = await prisma.user.findMany({
    where: {
      universityID: { not: universityID },
      academicProfile: { isNot: null },
    },
    include: {
      academicProfile: true,
      createdProjects: true,
    },
  });

  const recommendations = await Promise.all(
    otherUsers.map(async (user) => {
      const userText = `
        Interests: ${user.academicProfile.interestsSkills.join(", ")}
        Biography: ${user.academicProfile.biography}
        Department: ${user.department}
        Projects: ${user.createdProjects.map((p) => p.title + ": " + p.description).join("; ")}
      `.trim();

      const userEmbedding = await getEmbedding(userText);
      const similarity = cosineSimilarity(currentUserEmbedding, userEmbedding);
      return {
        user: {
          universityID: user.universityID,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
          interestsSkills: user.academicProfile.interestsSkills,
        },
        score: similarity,
      };
    }),
  );

  return recommendations
    .filter((r) => r.score > 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/**
 * Generates project recommendations for a specific user.
 */
export async function getProjectRecommendations(universityID, projects) {
  const currentUser = await prisma.user.findUnique({
    where: { universityID },
    include: {
      academicProfile: true,
    },
  });

  if (!currentUser || !currentUser.academicProfile) {
    return projects.map((p) => ({ ...p, matchScore: 0 }));
  }

  const currentUserText = `
    Interests: ${currentUser.academicProfile.interestsSkills.join(", ")}
    Biography: ${currentUser.academicProfile.biography}
    Department: ${currentUser.department}
  `.trim();

  const currentUserEmbedding = await getEmbedding(currentUserText);
  if (!currentUserEmbedding)
    return projects.map((p) => ({ ...p, matchScore: 0 }));

  const projectsWithScores = await Promise.all(
    projects.map(async (project) => {
      const projectText = `
        Title: ${project.title}
        Description: ${project.description}
        Domain: ${project.projectDomain}
      `.trim();

      const projectEmbedding = await getEmbedding(projectText);
      const similarity = cosineSimilarity(
        currentUserEmbedding,
        projectEmbedding,
      );

      // Boost if in the same user department (optional, might not be relevant for projects)

      const score = Math.round(similarity * 100);
      return {
        ...project,
        matchScore: isNaN(score) ? 0 : score,
      };
    }),
  );

  console.log(
    `[Engine] Generated scores for ${projectsWithScores.length} projects for user ${universityID}`,
  );
  return projectsWithScores;
}

/**
 * Generates user recommendations for a specific project.
 */
export async function getUsersForProjectRecommendations(projectID) {
  const project = await prisma.academicProject.findUnique({
    where: { projectID },
  });

  if (!project) return [];

  const projectText = `
    Title: ${project.title}
    Description: ${project.description}
    Domain: ${project.projectDomain}
    Requirements: ${project.requirements.join(", ")}
  `.trim();

  const projectEmbedding = await getEmbedding(projectText);
  if (!projectEmbedding) return [];

  const users = await prisma.user.findMany({
    where: {
      role: { in: ["STUDENT", "RESEARCH_SCHOLAR", "FACULTY"] },
      academicProfile: { isNot: null },
      universityID: { not: project.universityID }, // Exclude creator
    },
    include: { academicProfile: true },
  });

  const userScores = await Promise.all(
    users.map(async (user) => {
      const userText = `
        Interests: ${user.academicProfile.interestsSkills.join(", ")}
        Biography: ${user.academicProfile.biography}
        Department: ${user.department}
      `.trim();

      const userEmbedding = await getEmbedding(userText);
      const similarity = cosineSimilarity(projectEmbedding, userEmbedding);
      return {
        user: {
          universityID: user.universityID,
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
          interestsSkills: user.academicProfile.interestsSkills,
        },
        score: Math.round(similarity * 100),
      };
    }),
  );

  return userScores
    .filter((u) => u.score > 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
