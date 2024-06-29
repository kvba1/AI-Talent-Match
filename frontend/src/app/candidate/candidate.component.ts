import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { Candidate } from '../candidate.model';  // Import the Candidate interface
import { trigger, keyframes, animate, transition } from "@angular/animations";
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
  placeholderImage: string = 'https://thispersondoesnotexist.com/';
  animationState: string = '';


  constructor(private candidateService: CandidateService) { }

  ngOnInit(): void {
    this.candidateService.getCandidates().subscribe((data: Candidate[]) => {
      this.candidates = data.map((candidate: Candidate) => ({
        ...candidate,
        imageUrl: this.placeholderImage
      }));
      
      this.currentCandidate = this.candidates[this.currentIndex];
    });
  }

  startAnimation(state :string) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    // Only push to selectedCandidates if the animation was for swipe right
    if (this.animationState === 'swiperight' && this.currentCandidate) {
      this.selectedCandidates.push(this.currentCandidate);
      console.log(this.selectedCandidates)
    }
    this.animationState = '';
    this.advanceCandidate();
  }

  swipeLeft() {
    this.startAnimation('swipeleft');
  }

  swipeRight() {
    this.startAnimation('swiperight');
    
  }

  advanceCandidate() {
    this.currentIndex++;
    if (this.currentIndex < this.candidates.length) {
      this.currentCandidate = this.candidates[this.currentIndex];
    } else {
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
