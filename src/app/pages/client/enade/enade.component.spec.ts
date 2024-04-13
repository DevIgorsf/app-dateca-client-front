import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnadeComponent } from './enade.component';

describe('EnadeComponent', () => {
  let component: EnadeComponent;
  let fixture: ComponentFixture<EnadeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnadeComponent]
    });
    fixture = TestBed.createComponent(EnadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
