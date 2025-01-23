import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrl: './animes.component.css'
})
export class AnimesComponent implements OnInit{
  animes: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAnimes().subscribe((data) => {
      this.animes = data;
    });
  }

}
