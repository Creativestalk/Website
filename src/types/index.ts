export interface Service {
  id: string;
  title: string;
  icon: string;
  subservices: string[];
}

export interface WorkItem {
  id: string;
  title: string;
  views?: string;
  thumbnail: string;
  videoUrl?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}