import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { FooterComponent } from '../../shared/footer/footer';
import { CourseService, CourseResponse } from '../../shared/services/course';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseListComponent implements OnInit {
  courses: CourseResponse[] = [];
  filteredCourses: CourseResponse[] = [];
  searchTerm = '';
  isLoading = true;
  error = '';

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = '';
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des cours.';
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.filteredCourses = this.courses.filter(
      (c) =>
        c.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (c.categoryName && c.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase())),
    );
  }
}
