export type ProjectPillar =
  | "TECHNOLOGY"
  | "EDUCATION"
  | "HEALTH"
  | "ENTREPRENEURSHIP"
  | "CULTURE";

export type PublicProjectResponse = {
  id: number;
  title: string;
  description: string;
  pillar: ProjectPillar;
  startsAt: string;
  endsAt: string;
  location: string;
  imageUrl: string | null;
};
