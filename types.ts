
export interface WineDetails {
  name: string;
  vintage: string;
  region: string;
  country: string;
  rating: string;
  abv: string;
  description: string;
  grapesVariety: string;
  foodPairings: string[];
  judgmentPerception: string;
  climate: string;
  tastingNotes: string;
  soilStructure: string;
  funFact: string;
  scanDate?: string;
  id?: string;
}

export type AppState = 'landing' | 'scanning' | 'results' | 'loading' | 'error' | 'collection';

export interface UserStats {
  points: number;
  isPremium: boolean;
  savedWines: WineDetails[];
}
