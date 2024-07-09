import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { Candidate } from '../candidate.model';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from './keyframes';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate(750, keyframes(kf.swiperight))),
      transition('* => swipeleft', animate(750, keyframes(kf.swipeleft)))
    ])
  ]
})
export class CandidateComponent implements OnInit {
  candidates: Candidate[] = [];
  selectedCandidates: Candidate[] = [];
  currentIndex: number = 0;
  currentCandidate: Candidate | null = null;
  animationState: string = '';
  searchQuery: string = '';

  constructor(private candidateService: CandidateService) { }

  ngOnInit(): void {
    this.candidateService.getCandidates().subscribe((data: Candidate[]) => {
      this.candidates = data.map((candidate: Candidate, index: number) => ({
        ...candidate,
        imageUrl: `imgs/candidate${index + 1}.jpg`
      }));
      
      console.log(`Total candidates fetched: ${this.candidates.length}`);
      if (this.candidates.length > 0) {
        this.currentIndex = 0;
        this.currentCandidate = this.candidates[this.currentIndex];
      } else {
        this.currentCandidate = null;
      }
    });
  }

  startAnimation(state: string) {
    if (!this.animationState) {
      console.log(`Start animation: ${state}`);
      this.animationState = state;
    }
  }

  resetAnimationState() {
    console.log('Reset animation state:', this.animationState);
    if (this.animationState) { // Ensure this block only executes once per animation
      if (this.animationState === 'swiperight' && this.currentCandidate) {
        this.selectedCandidates.push(this.currentCandidate);
        console.log('Selected candidates:', this.selectedCandidates);
      }
      this.advanceCandidate();
      this.animationState = '';
    }
  }

  swipeLeft() {
    console.log('Swipe left triggered');
    this.startAnimation('swipeleft');
  }

  swipeRight() {
    console.log('Swipe right triggered');
    this.startAnimation('swiperight');
  }

  advanceCandidate() {
    console.log('Advancing candidate');
    this.currentIndex++;
    console.log('Current index:', this.currentIndex);
    console.log('Candidates length:', this.candidates.length);

    if (this.currentIndex < this.candidates.length) {
      this.currentCandidate = this.candidates[this.currentIndex];
    } else {
      console.log('No more candidates to display');
      this.currentCandidate = null;
    }
  }

  downloadResume(candidate: Candidate): void {
    const doc = new jsPDF();

    doc.text('Resume', 10, 10);
    doc.text(`Name: ${candidate.first_name} ${candidate.last_name}`, 10, 20);
    doc.text(`Email: ${candidate.email}`, 10, 30);
    doc.text(`Phone: ${candidate.phone_number}`, 10, 40);
    doc.text(`Last Job: ${candidate.category}`, 10, 50);
    doc.text(`Resume: ${candidate.resume}`, 10, 60);

    doc.save(`${candidate.first_name}_${candidate.last_name}_resume.pdf`);
  }
}
