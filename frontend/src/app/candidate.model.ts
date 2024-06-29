// src/app/candidate.model.ts
export interface Candidate {
    category: string;
    resume: string;
    phone_number: string;
    email: string;
    first_name: string;
    last_name: string;
    score: number;
    imageUrl?: string;
  }
  