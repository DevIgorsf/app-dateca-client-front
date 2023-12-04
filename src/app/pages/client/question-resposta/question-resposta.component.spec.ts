import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionRespostaComponent } from './question-resposta.component';

describe('QuestionRespostaComponent', () => {
  let component: QuestionRespostaComponent;
  let fixture: ComponentFixture<QuestionRespostaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionRespostaComponent]
    });
    fixture = TestBed.createComponent(QuestionRespostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
