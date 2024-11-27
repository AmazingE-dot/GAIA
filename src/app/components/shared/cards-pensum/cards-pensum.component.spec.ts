import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPensumComponent } from './cards-pensum.component';

describe('CardsPensumComponent', () => {
  let component: CardsPensumComponent;
  let fixture: ComponentFixture<CardsPensumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPensumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsPensumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
