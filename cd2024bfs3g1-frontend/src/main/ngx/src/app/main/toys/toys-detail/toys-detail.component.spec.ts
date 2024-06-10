import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToysDetailComponent } from './toys-detail.component';
import { ToysHomeComponent } from '../toys-home/toys-home.component';

describe('ToysDetailComponent', () => {
  let component: ToysDetailComponent;
  let categoryTest: ToysHomeComponent;
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
