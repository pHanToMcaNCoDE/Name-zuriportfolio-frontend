export interface UserInfo {
  data: {
    address: string;
    createdAt: string;
    firstName: string;
    id: string;
    lastName: string;
    location: string;
    profilePictureUrl: any;
    profileUrl: string;
    projects: number;
    provider: string;
    ranking: string;
    skills: string[];
    tag: string;
    track: string;
  }[];
}

export interface alltracksType {
  id: number;
  name: string;
}
