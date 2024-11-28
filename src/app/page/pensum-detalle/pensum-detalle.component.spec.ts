import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensumDetalleComponent } from './pensum-detalle.component';

describe('PensumDetalleComponent', () => {
  let component: PensumDetalleComponent;
  let fixture: ComponentFixture<PensumDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PensumDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PensumDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
