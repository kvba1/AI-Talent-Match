// src/app/candidate.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from './candidate.model';  // Import the Candidate interface

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private apiUrl = 'http://localhost:5001/top_candidates?n=50';

  constructor(private http: HttpClient) { }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

}
