import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { lastValueFrom } from 'rxjs';
import { CandidateService } from '../candidate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedFile: File | null = null;
  numCandidates: number = 50;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private candidateService: CandidateService
  ) {
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  async upload(): Promise<void> {
    if (!this.selectedFile) {
      console.error('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    try {
      const response = await lastValueFrom(this.http.post('http://localhost:5001/upload', formData, {
        observe: 'response'
      }));
      console.log('Response:', response);
      if (response.status === 200) {
        // Display a message
        this.snackBar.open('Upload successful, navigating shortly...', 'Close', {
          duration: 3000  // Message duration
        });

        setTimeout(() => {
          this.router.navigate(['/candidates']);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  onCandidatesChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.numCandidates = parseInt(inputElement.value, 10);
    this.candidateService.setNumberCandidates(this.numCandidates);
  }
}
