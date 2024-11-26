import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensumsComponent } from './pensums.component';

describe('PensumsComponent', () => {
  let component: PensumsComponent;
  let fixture: ComponentFixture<PensumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PensumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PensumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
