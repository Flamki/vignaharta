
export interface HeroSection {
  title: string;
  subtitle: string;
  projectName: string;
  location: string;
  price1Label: string;
  price1Value: string;
  price2Label: string;
  price2Value: string;
}

export interface AboutSection {
  title: string;
  description: string;
}

export interface Amenity {
  id: string;
  title: string;
  icon: string; // identifying string for icon component
}

export interface AmenitySection {
  title: string;
  subtitle: string;
  items: Amenity[];
}

export interface ConnectivityItem {
  id: string;
  location: string;
  time: string;
}

export interface ConnectivitySection {
  title: string;
  description: string;
  mapUrl: string; // For iframe src
  items: ConnectivityItem[];
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface ConstructionUpdateItem {
  id: string;
  title: string;
  description: string;
  image: string;
  status: string; // e.g., "Completed" or "Under Construction"
}

export interface DeveloperSection {
  title: string;
  description: string;
  stats: Stat[];
  updates: ConstructionUpdateItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AppContent {
  hero: HeroSection;
  about: AboutSection;
  amenities: AmenitySection;
  connectivity: ConnectivitySection;
  developer: DeveloperSection;
  faq: FAQItem[];
}

export interface User {
  email: string;
  isAuthenticated: boolean;
}
