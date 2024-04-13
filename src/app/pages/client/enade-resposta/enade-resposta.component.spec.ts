import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnadeRespostaComponent } from './enade-resposta.component';

describe('EnadeRespostaComponent', () => {
  let component: EnadeRespostaComponent;
  let fixture: ComponentFixture<EnadeRespostaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnadeRespostaComponent]
    });
    fixture = TestBed.createComponent(EnadeRespostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
