export const projectsQuery = `
  *[_type == "project" && published != false] | order(orderRank asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    tags,
    gradient,
    role,
    year,
    overview,
    content,
    "coverImageUrl": coverImage.asset->url,
  }
`;

export const uxCasesQuery = `
  *[_type == "uxCase" && published != false] | order(orderRank asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    tags,
    gradient,
    role,
    year,
    overview,
    content,
    "coverImageUrl": coverImage.asset->url,
  }
`;

export const aboutMeQuery = `
  *[_type == "aboutMe"][0] {
    name,
    bio,
    "avatarUrl": avatar.asset->url,
    skills,
    tools,
    experience,
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    uxCasePassword,
  }
`;
