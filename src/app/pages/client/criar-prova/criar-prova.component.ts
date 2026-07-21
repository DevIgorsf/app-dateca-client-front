import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PointsEnum } from 'src/app/interfaces/pointsEnum';
import { ProvaDetalheDTO, ProvaForm, ProvaQuestaoForm, ProvaVisibilidade, novaQuestaoVazia } from 'src/app/interfaces/prova';
import { DISCIPLINAS, ProvaService } from 'src/app/service/prova/prova.service';
import { formatarDataBr } from 'src/app/shared/utils/date.util';
import { provaVisibilidadeLabel } from 'src/app/shared/utils/prova.util';

const ALTERNATIVAS: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
const MAX_CAPA_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-criar-prova',
  imports: [ReactiveFormsModule, RouterModule, MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './criar-prova.component.html',
  styleUrls: ['./criar-prova.component.scss']
})
export class CriarProvaComponent implements OnInit {
  readonly disciplinas = DISCIPLINAS;
  readonly dificuldades = Object.values(PointsEnum);
  readonly alternativas = ALTERNATIVAS;
  readonly formatarDataHora = formatarDataBr;

  currentStep = signal(1);
  maxStepReached = signal(1);
  capaPreview = signal<string | null>(null);
  capaErro = signal<string | null>(null);
  saving = signal(false);
  erroSalvar = signal<string | null>(null);
  editId: string | null = null;

  informacoesForm: FormGroup;
  questoesForm: FormArray;
  configuracaoForm: FormGroup;

  private existente?: ProvaDetalheDTO;

  constructor(
    private fb: FormBuilder,
    private provaService: ProvaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.informacoesForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      disciplina: ['', Validators.required],
      dificuldade: [PointsEnum.Regular, Validators.required],
    });

    this.questoesForm = this.fb.array([this.criarQuestaoGroup()]);

    this.configuracaoForm = this.fb.group({
      dataAbertura: [''],
      horaAbertura: [''],
      dataEncerramento: [''],
      maxParticipantes: [null],
      visibilidade: ['TODOS' as ProvaVisibilidade, Validators.required],
    });
  }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.provaService.getProva(this.editId).subscribe({
        next: (prova) => {
          this.existente = prova;
          this.preencherFormulario(prova);
        },
        error: () => {
          this.erroSalvar.set('Não foi possível carregar esta prova.');
        }
      });
    }
  }

  private criarQuestaoGroup(questao?: ProvaQuestaoForm): FormGroup {
    const q = questao ?? novaQuestaoVazia();
    return this.fb.group({
      statement: [q.statement],
      alternativeA: [q.alternativeA],
      alternativeB: [q.alternativeB],
      alternativeC: [q.alternativeC],
      alternativeD: [q.alternativeD],
      alternativeE: [q.alternativeE],
      correctAnswer: [q.correctAnswer],
      comment: [q.comment],
    });
  }

  private preencherFormulario(prova: ProvaDetalheDTO): void {
    this.informacoesForm.patchValue({
      titulo: prova.titulo,
      descricao: prova.descricao,
      disciplina: prova.disciplina,
      dificuldade: prova.dificuldade,
    });

    this.questoesForm.clear();
    if (prova.questoes.length === 0) {
      this.questoesForm.push(this.criarQuestaoGroup());
    } else {
      prova.questoes.forEach((questao) => this.questoesForm.push(this.criarQuestaoGroup(questao)));
    }

    this.configuracaoForm.patchValue({
      dataAbertura: prova.dataAbertura,
      horaAbertura: prova.horaAbertura,
      dataEncerramento: prova.dataEncerramento,
      maxParticipantes: prova.maxParticipantes,
      visibilidade: prova.visibilidade,
    });

    this.capaPreview.set(prova.capaUrl);
    this.maxStepReached.set(4);
  }

  get questoesArray(): FormGroup[] {
    return this.questoesForm.controls as FormGroup[];
  }

  get questoesPreenchidas(): number {
    return this.questoesArray.filter((q) => (q.get('statement')?.value ?? '').trim().length > 0).length;
  }

  alternativeControl(index: number, letra: string): FormControl {
    return this.questoesArray[index].get('alternative' + letra) as FormControl;
  }

  correctAnswerControl(index: number): FormControl {
    return this.questoesArray[index].get('correctAnswer') as FormControl;
  }

  statementControl(index: number): FormControl {
    return this.questoesArray[index].get('statement') as FormControl;
  }

  commentControl(index: number): FormControl {
    return this.questoesArray[index].get('comment') as FormControl;
  }

  adicionarQuestao(): void {
    this.questoesForm.push(this.criarQuestaoGroup());
  }

  removerQuestao(index: number): void {
    this.questoesForm.removeAt(index);
  }

  onDropCapa(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.lerCapa(file);
    }
  }

  onCapaSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.lerCapa(file);
    }
    input.value = '';
  }

  removerCapa(): void {
    this.capaPreview.set(null);
    this.capaErro.set(null);
  }

  private lerCapa(file: File): void {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.capaErro.set('Envie uma imagem PNG ou JPG.');
      return;
    }
    if (file.size > MAX_CAPA_BYTES) {
      this.capaErro.set('A imagem deve ter até 5MB.');
      return;
    }
    this.capaErro.set(null);
    const reader = new FileReader();
    reader.onload = () => {
      this.capaPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  get step1Valido(): boolean {
    return this.informacoesForm.valid;
  }

  get step2Valido(): boolean {
    return this.questoesArray.some((q) => this.questaoCompleta(q));
  }

  get step3Valido(): boolean {
    const abertura = this.configuracaoForm.get('dataAbertura')?.value;
    const encerramento = this.configuracaoForm.get('dataEncerramento')?.value;
    if (abertura && encerramento) {
      return abertura <= encerramento;
    }
    return true;
  }

  private questaoCompleta(q: FormGroup): boolean {
    const v = q.value;
    return !!(v.statement?.trim() && v.alternativeA?.trim() && v.alternativeB?.trim()
      && v.alternativeC?.trim() && v.alternativeD?.trim() && v.alternativeE?.trim() && v.correctAnswer);
  }

  irParaStep(step: number): void {
    if (step <= this.maxStepReached()) {
      this.currentStep.set(step);
    }
  }

  proximoStep(): void {
    if (this.currentStep() === 1 && !this.step1Valido) {
      this.informacoesForm.markAllAsTouched();
      return;
    }
    if (this.currentStep() === 2 && !this.step2Valido) {
      return;
    }
    if (this.currentStep() === 3 && !this.step3Valido) {
      return;
    }
    const proximo = Math.min(4, this.currentStep() + 1);
    this.currentStep.set(proximo);
    this.maxStepReached.set(Math.max(this.maxStepReached(), proximo));
  }

  anteriorStep(): void {
    this.currentStep.set(Math.max(1, this.currentStep() - 1));
  }

  cancelar(): void {
    this.router.navigate(['/client/provas']);
  }

  get prontaParaPublicar(): boolean {
    return this.step1Valido && this.step2Valido && this.step3Valido;
  }

  get visibilidadeLabel(): string {
    return provaVisibilidadeLabel(this.configuracaoForm.get('visibilidade')?.value);
  }

  salvarRascunho(): void {
    this.salvar(true);
  }

  publicar(): void {
    if (!this.prontaParaPublicar) {
      return;
    }
    this.salvar(false);
  }

  private salvar(comoRascunho: boolean): void {
    this.saving.set(true);
    this.erroSalvar.set(null);
    const info = this.informacoesForm.value;
    const config = this.configuracaoForm.value;
    const questoes: ProvaQuestaoForm[] = this.questoesArray
      .map((q) => q.value as ProvaQuestaoForm)
      .filter((q) => q.statement.trim().length > 0);

    const form: ProvaForm = {
      titulo: info.titulo,
      descricao: info.descricao,
      disciplina: info.disciplina,
      dificuldade: info.dificuldade,
      capaUrl: this.capaPreview(),
      questoes,
      dataAbertura: config.dataAbertura || null,
      horaAbertura: config.horaAbertura || null,
      dataEncerramento: config.dataEncerramento || null,
      maxParticipantes: config.maxParticipantes || null,
      visibilidade: config.visibilidade,
      status: comoRascunho ? 'Rascunho' : null,
    };

    const resultado$ = this.editId
      ? this.provaService.atualizarProva(this.editId, form)
      : this.provaService.criarProva(form);

    resultado$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/client/provas']);
      },
      error: () => {
        this.saving.set(false);
        this.erroSalvar.set('Não foi possível salvar a prova. Tente novamente.');
      }
    });
  }
}
