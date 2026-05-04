export const projectsQuery = `
  *[_type == "project" && published != false] | order(orderRank asc, _createdAt desc) {
    _id,
    "title": {
      "en": coalesce(titleI18n.en, title, ""),
      "pt": coalesce(titleI18n.pt, titleI18n.en, title, "")
    },
    "slug": slug.current,
    tags,
    gradient,
    "role": {
      "en": coalesce(roleI18n.en, role, ""),
      "pt": coalesce(roleI18n.pt, roleI18n.en, role, "")
    },
    year,
    "overview": {
      "en": coalesce(overviewI18n.en, overview, ""),
      "pt": coalesce(overviewI18n.pt, overviewI18n.en, overview, "")
    },
    content,
    contentPt,
    "coverImageUrl": coverImage.asset->url,
  }
`;

export const uxCasesQuery = `
  *[_type == "uxCase" && published != false] | order(orderRank asc, _createdAt desc) {
    _id,
    "title": {
      "en": coalesce(titleI18n.en, title, ""),
      "pt": coalesce(titleI18n.pt, titleI18n.en, title, "")
    },
    "slug": slug.current,
    tags,
    gradient,
    "role": {
      "en": coalesce(roleI18n.en, role, ""),
      "pt": coalesce(roleI18n.pt, roleI18n.en, role, "")
    },
    year,
    "overview": {
      "en": coalesce(overviewI18n.en, overview, ""),
      "pt": coalesce(overviewI18n.pt, overviewI18n.en, overview, "")
    },
    content,
    contentPt,
    "coverImageUrl": coverImage.asset->url,
  }
`;

export const aboutMeQuery = `
  *[_type == "aboutMe"][0] {
    name,
    "bio": {
      "en": coalesce(bioI18n.en, bio, ""),
      "pt": coalesce(bioI18n.pt, bioI18n.en, bio, "")
    },
    "avatarUrl": avatar.asset->url,
    skills,
    tools,
    experience[] {
      role,
      company,
      period,
      description,
      descriptionPt,
    },
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    uxCasePassword,
  }
`;
