import { Component } from '@angular/core';
import { CardsPensumComponent } from "../../components/shared/cards-pensum/cards-pensum.component";

@Component({
  selector: 'app-pensums',
  standalone: true,
  imports: [CardsPensumComponent],
  templateUrl: './pensums.component.html',
  styleUrl: './pensums.component.css'
})
export class PensumsComponent {

}
