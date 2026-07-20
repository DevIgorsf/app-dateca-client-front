# Especificação — Backend do módulo de Provas (ProvaHub)

## Contexto

O frontend (Angular, `app-dateca-client-front`) já implementa duas telas novas:

- **Criar Prova** (`src/app/pages/client/criar-prova`): wizard de 4 passos (Informações, Questões, Configuração, Resumo) para um usuário criar uma prova manualmente, com questões de múltipla escolha (A–E).
- **Minhas Provas** (`src/app/pages/client/minhas-provas`): listagem das provas criadas pelo usuário logado, com status, participantes, datas e ranking.
- **Visualizar Prova** (`src/app/pages/client/visualizar-prova`): detalhe somente-leitura de uma prova.

Hoje essas telas funcionam **100% no cliente**, persistindo em `localStorage` através de `src/app/service/prova/prova.service.ts`, porque não existe nenhum endpoint de backend para o conceito de "prova" ainda. Este documento descreve o que precisa existir no backend para substituir esse mock por dados reais.

O backend já expõe (e o frontend já consome) os seguintes recursos análogos, que servem de referência de convenção:

- `GET  /questao/aluno` — retorna uma questão aleatória para o aluno responder.
- `GET  /questao/imagens/:id` — imagens da questão (campo `imagem` em base64).
- `POST /questao/answerQuestion/:id` — envia resposta do aluno.
- `GET  /enade/aluno`, `GET /enade/imagens/:id`, `POST /enade/answerEnade/:id` — mesmo padrão para questões do ENADE.
- Endpoints de aluno/estudante para ranking geral (consumidos por `StudentService.getRanking()` / `rankingStudent()`).
- Autenticação via JWT (Bearer token, ver `auth.interceptor.ts` / `token.service.ts`), toda chamada autenticada carrega o usuário logado.

O módulo de Provas deve seguir a mesma convenção de rotas (recurso em português, sem prefixo `/api`) e o mesmo padrão de autenticação.

## Modelo de dados (baseado no que o frontend já modela)

Ver `src/app/interfaces/prova.ts` no repositório para os tipos exatos hoje usados no mock.

### Entidade `Prova`

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | UUID/Long | gerado pelo backend | |
| `titulo` | string | sim | |
| `descricao` | string | não | |
| `disciplina` | string | sim | hoje é uma lista estática no frontend (`DISCIPLINAS` em `prova.service.ts`); avaliar se deve virar FK para a entidade `Course` já existente no backend |
| `dificuldade` | enum | sim | `Fácil` \| `Médio` \| `Difícil` — mesmo enum `PointsEnum` já usado em `Question`/`Enade` |
| `capaUrl` | string (base64 ou URL) | não | imagem de capa, PNG/JPG até 5MB; seguir o mesmo padrão de armazenamento usado hoje para imagens de questão |
| `dataAbertura` | date | não | |
| `horaAbertura` | time | não | |
| `dataEncerramento` | date | não | |
| `maxParticipantes` | int | não | `null`/vazio = sem limite |
| `visibilidade` | enum | sim | `TODOS` \| `AMIGOS` \| `GRUPO` — **`GRUPO` ainda não tem entidade de "grupo" no sistema**; o frontend hoje só avisa "em breve". Não é obrigatório implementar `GRUPO` nesta primeira versão, mas o enum deve reservar o valor. |
| `status` | enum | calculado | `Rascunho` \| `Agendado` \| `Ativo` \| `Encerrado` — ver regra de negócio abaixo |
| `criadorId` | FK (Professor/Student) | sim | usuário autenticado que criou a prova |
| `participantes` | int | calculado | contagem de respostas/submissões distintas |
| `criadaEm` | timestamp | gerado pelo backend | |

### Entidade `ProvaQuestao` (1:N com `Prova`)

| Campo | Tipo | Observação |
|---|---|---|
| `id` | UUID/Long | |
| `provaId` | FK | |
| `statement` | string | enunciado |
| `alternativeA..E` | string | 5 alternativas |
| `correctAnswer` | enum `A`\|`B`\|`C`\|`D`\|`E` | |
| `comment` | string | comentário/explicação da resposta correta, exibido após o aluno responder |
| `ordem` | int | ordem de exibição dentro da prova |

### Entidade `ProvaSubmissao` (para permitir ranking/participantes)

Análoga ao fluxo já existente de `answerQuestion`/`answerEnade`, mas por prova inteira:

| Campo | Tipo | Observação |
|---|---|---|
| `id` | UUID/Long | |
| `provaId` | FK | |
| `studentId` | FK | |
| `respostas` | lista de `{provaQuestaoId, respostaEscolhida}` | |
| `pontuacao` | int/decimal | calculada no backend a partir do gabarito |
| `respondidoEm` | timestamp | |

## Regras de negócio

1. **Cálculo de `status`** (não deve ser um campo livre editável pelo usuário, exceto `Rascunho`):
   - `Rascunho`: prova salva mas não publicada (ação explícita "Salvar rascunho" no wizard). Nunca muda sozinha.
   - `Agendado`: publicada, com `dataAbertura` no futuro.
   - `Ativo`: publicada, `dataAbertura` já passou e (`dataEncerramento` vazio ou no futuro).
   - `Encerrado`: publicada, `dataEncerramento` já passou.
2. **Ranking** só fica disponível (`rankingDisponivel = true`) quando `status` é `Ativo` ou `Encerrado`.
3. **Visibilidade**:
   - `TODOS`: qualquer usuário autenticado pode visualizar/responder.
   - `AMIGOS`: apenas amigos do criador (o sistema de amizades já existe — ver `FriendshipService`/`friendship` no backend). Validar amizade ao consultar/responder a prova.
   - `GRUPO`: reservado para o futuro; pode ser tratado como equivalente a `TODOS` por ora, ou retornar erro/feature-flag desligada.
4. **Permissões**:
   - Apenas o `criadorId` pode editar, excluir ou ver uma prova em `Rascunho`.
   - Provas `Ativo`/`Encerrado`/`Agendado` publicadas podem ser listadas/visualizadas por quem tem permissão de visibilidade, mas só o criador pode editar/excluir.
5. **Compartilhamento**: o frontend hoje gera um link `client/provas/visualizar/:id` — não exige endpoint extra, só que o `id` seja estável e a visualização respeite a regra de visibilidade acima.
6. **Contagem de participantes** = número de `ProvaSubmissao` distintas por `provaId`.

## Endpoints necessários

Todos autenticados (Bearer token), seguindo o padrão já usado pelo `auth.interceptor.ts`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/prova/minhas` | Lista as provas criadas pelo usuário autenticado (para a tela "Minhas Provas"), já com `status` calculado, `participantes` e `rankingDisponivel`. |
| `GET` | `/prova/:id` | Detalhe completo de uma prova (para editar ou visualizar), respeitando permissão/visibilidade. |
| `POST` | `/prova` | Cria uma prova (rascunho ou já publicada, conforme `status` enviado/ação do wizard). Corpo: dados de `Prova` + lista de `ProvaQuestao`. |
| `PUT` | `/prova/:id` | Atualiza uma prova existente (usado tanto para editar quanto para "salvar rascunho" novamente). |
| `DELETE` | `/prova/:id` | Exclui a prova (com confirmação já feita no frontend). |
| `POST` | `/prova/:id/publicar` | Publica um rascunho, transicionando de `Rascunho` para `Agendado`/`Ativo` conforme a data de abertura. *(Opcional: pode ser absorvido pelo `PUT` acima se preferir.)* |
| `POST` | `/prova/:id/capa` | Upload da imagem de capa (multipart ou base64), retorna a URL/base64 salvo. |
| `GET` | `/prova/publicas` | Lista provas visíveis para o usuário autenticado (para uma futura tela de "Biblioteca"/descobrir provas) — respeita `visibilidade`. *(Não é bloqueante para as duas telas já implementadas, mas é o próximo passo natural.)* |
| `GET` | `/prova/:id/questoes/aluno` | Retorna a prova para o aluno responder (sem o campo `correctAnswer`/`comment` até ele enviar a resposta), no mesmo espírito de `/questao/aluno`. |
| `POST` | `/prova/:id/responder` | Envia as respostas do aluno (`ProvaSubmissao`), calcula pontuação e retorna o resultado com gabarito/comentários, análogo a `/questao/answerQuestion/:id`. |
| `GET` | `/prova/:id/ranking` | Ranking dos participantes daquela prova especificamente (pontuação, nome, posição), disponível apenas quando `status` é `Ativo`/`Encerrado`. |

## Formato esperado do payload de criação/edição (`POST`/`PUT /prova`)

```json
{
  "titulo": "Matemática Avançada — Cálculo Diferencial",
  "descricao": "Revisão de derivadas e limites.",
  "disciplina": "Matemática",
  "dificuldade": "Médio",
  "capaUrl": "data:image/png;base64,...",
  "questoes": [
    {
      "statement": "Qual a derivada de x²?",
      "alternativeA": "x",
      "alternativeB": "2x",
      "alternativeC": "x²",
      "alternativeD": "2",
      "alternativeE": "0",
      "correctAnswer": "B",
      "comment": "A derivada de x^n é n*x^(n-1)."
    }
  ],
  "dataAbertura": "2026-08-01",
  "horaAbertura": "08:00",
  "dataEncerramento": "2026-08-15",
  "maxParticipantes": null,
  "visibilidade": "TODOS",
  "status": "Rascunho"
}
```

## Fora de escopo desta primeira entrega

- Entidade/CRUD de "Grupo" para a opção de visibilidade `GRUPO` (o frontend já trata como "em breve").
- Tela de "Biblioteca" (descobrir provas públicas de outros usuários) — só o endpoint `GET /prova/publicas` foi antecipado acima para não travar o modelo de dados depois.

---

## Prompt pronto para o time/agente de backend

> Copie o bloco abaixo ao pedir para um agente (ou desenvolvedor) implementar o backend.

```
Preciso que você implemente, no backend do projeto DATECA/ProvaHub, o módulo de "Provas" (exames de múltipla escolha criados manualmente pelos usuários), que hoje só existe como mock no frontend Angular.

Contexto do sistema existente:
- O backend já tem entidades Question, Enade, Course, Professor, Student, PointsEnum (Fácil/Médio/Difícil) e um sistema de amizades entre estudantes.
- Os endpoints existentes seguem o padrão: recurso em português, sem prefixo /api (ex: GET /questao/aluno, POST /questao/answerQuestion/:id, GET /enade/aluno), autenticação via JWT Bearer token.
- O frontend já está pronto (telas "Criar Prova" e "Minhas Provas") e espera consumir os endpoints REST descritos abaixo — não é necessário alterar o frontend, apenas substituir a camada de mock (localStorage) pela API real quando o backend estiver pronto.

O que preciso que você crie:

1. Entidade `Prova` com os campos: id, titulo, descricao, disciplina, dificuldade (enum reaproveitando PointsEnum), capaUrl, dataAbertura, horaAbertura, dataEncerramento, maxParticipantes, visibilidade (enum TODOS/AMIGOS/GRUPO), status (enum Rascunho/Agendado/Ativo/Encerrado, calculado a partir das datas — nunca setado manualmente exceto Rascunho), criadorId (FK para o usuário autenticado que criou), participantes (calculado) e criadaEm.

2. Entidade `ProvaQuestao` (1:N com Prova): statement, alternativeA a alternativeE, correctAnswer (A-E), comment, ordem.

3. Entidade `ProvaSubmissao` para registrar quando um aluno responde uma prova inteira: provaId, studentId, respostas (lista de questão + resposta escolhida), pontuação calculada, respondidoEm. Isso alimenta a contagem de "participantes" e o ranking por prova.

4. Regras de negócio:
   - status é derivado das datas (dataAbertura/dataEncerramento) e nunca editável diretamente pelo cliente, exceto a transição para Rascunho.
   - rankingDisponivel = true somente quando status é Ativo ou Encerrado.
   - Apenas o criador pode editar/excluir/ver uma prova em Rascunho.
   - visibilidade AMIGOS restringe a visualização/resposta a amigos do criador (reaproveitar o sistema de amizades já existente).
   - visibilidade GRUPO pode ser tratada como TODOS por enquanto (ainda não existe entidade de grupo no sistema — não crie uma agora, só reserve o valor do enum).

5. Endpoints REST necessários (JSON, autenticados por Bearer token):
   - GET  /prova/minhas — provas criadas pelo usuário logado, com status/participantes/rankingDisponivel calculados.
   - GET  /prova/:id — detalhe completo (para editar/visualizar), respeitando permissão.
   - POST /prova — cria uma prova (rascunho ou publicada) com sua lista de questões.
   - PUT  /prova/:id — atualiza uma prova existente.
   - DELETE /prova/:id — exclui a prova.
   - POST /prova/:id/capa — upload da imagem de capa (PNG/JPG, até 5MB).
   - GET  /prova/:id/questoes/aluno — retorna a prova para o aluno responder, SEM correctAnswer/comment.
   - POST /prova/:id/responder — recebe as respostas do aluno, calcula pontuação, retorna resultado com gabarito e comentários (mesmo espírito de /questao/answerQuestion/:id).
   - GET  /prova/:id/ranking — ranking de participantes daquela prova específica.

O payload de criação/edição deve aceitar exatamente esta forma (exemplo):
{
  "titulo": "string",
  "descricao": "string",
  "disciplina": "string",
  "dificuldade": "Fácil" | "Médio" | "Difícil",
  "capaUrl": "string (base64) ou null",
  "questoes": [
    { "statement": "string", "alternativeA": "string", "alternativeB": "string", "alternativeC": "string", "alternativeD": "string", "alternativeE": "string", "correctAnswer": "A"|"B"|"C"|"D"|"E", "comment": "string" }
  ],
  "dataAbertura": "YYYY-MM-DD ou null",
  "horaAbertura": "HH:mm ou null",
  "dataEncerramento": "YYYY-MM-DD ou null",
  "maxParticipantes": number ou null,
  "visibilidade": "TODOS" | "AMIGOS" | "GRUPO",
  "status": "Rascunho" | "Agendado" | "Ativo" | "Encerrado"
}

Não é necessário implementar a entidade de "Grupo" nem a tela de "Biblioteca" (listagem pública de provas de terceiros) nesta entrega — apenas deixe o enum de visibilidade e o endpoint GET /prova/publicas previstos para não quebrar o modelo depois.

Ao terminar, me diga quais rotas ficaram diferentes do especificado (nome, verbo HTTP, formato de payload) para eu ajustar a camada de serviço no frontend Angular (src/app/service/prova/prova.service.ts) que hoje simula tudo em localStorage.
```
