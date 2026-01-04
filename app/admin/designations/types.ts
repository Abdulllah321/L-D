export type TrackType = 'normal' | 'hi-po';
export type AnnualType = 'annual-regular' | 'annual-ecourse' | null;

export interface Designation {
  _id?: string;
  id: string;
  title: string;
  order?: number;
  subDesignations?: { id: string; title: string }[];
}

export interface Training {
  _id?: string;
  assignmentId?: string;
  programTitle: string;
  order?: number;
  designationId?: string;
  subDesignationId?: string;
  trackType?: TrackType;
  annualType?: AnnualType;
  learningPathId?: string;
  learningPathTitle?: string;
  isCustomTraining?: boolean; // Flag for custom training names not in database
  isLearningPath?: boolean; // Flag for learning paths
}

export interface AllTraining {
  _id?: string;
  programTitle: string;
  order?: number;
  designationId?: string;
  trackType?: TrackType;
  title?: string; // For compatibility if mixing types
}

export interface SelectedTraining {
  trainingId?: string; // Optional for custom items
  id: string; // Unique ID for UI handling (trainingId or random)
  title?: string; // For custom items
  isPlaceholder?: boolean;
  courseOverview?: string;
  frequency?: string;
}

export interface LearningPath {
  _id: string;
  title: string;
  description?: string;
  frequency?: string;
  deckId?: string; // Reference to parent deck
  categoryId?: string; // Category ID within deck
  trainings: (AllTraining | { 
    trainingId?: AllTraining | string, // can be populated object or text ID
    title?: string,
    isPlaceholder?: boolean,
    courseOverview?: string, 
    frequency?: string 
  })[]; 
}

export interface LearningDeck {
  _id: string;
  title: string;
  description?: string;
  categories: {
    id: string;
    title: string;
    description?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

