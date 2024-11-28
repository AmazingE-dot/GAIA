import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-pensum',
  standalone: true,
  imports: [ NgClass ],
  templateUrl: './cards-pensum.component.html',
  styleUrl: './cards-pensum.component.css'
})
export class CardsPensumComponent {
  @Input() titulo: string = ''; // Título de la tarjeta
  @Input() items: { nombre: string; estado: string }[] = [];
  @Input() classes: { [key: string]: string } = { // Clases personalizadas
    header: 'bg-gray-300 rounded-t-lg px-2 py-3 text-center transition-all group-hover:bg-gray-500 group-hover:text-white',
    body: 'py-4 px-8 bg-gray-50 group-hover:bg-gray-100',
    item: 'py-1 text-gray-800 hover:scale-105 hover:text-gray-800 transition-all',
    headerSuccess: 'bg-green-300 rounded-t-lg px-2 py-3 text-center transition-all group-hover:bg-green-500 group-hover:text-white',
    bodySuccess: 'py-4 px-8 bg-green-50 group-hover:bg-green-100',
    itemSuccess: 'py-1 hover:scale-105 hover:text-green-800 transition-all',
  };
}
