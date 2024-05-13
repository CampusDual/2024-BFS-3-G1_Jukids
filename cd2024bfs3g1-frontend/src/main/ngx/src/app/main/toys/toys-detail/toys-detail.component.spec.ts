import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToysDetailComponent } from './toys-detail.component';

describe('ToysDetailComponent', () => {
  let component: ToysDetailComponent;
  let fixture: ComponentFixture<ToysDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToysDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToysDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
