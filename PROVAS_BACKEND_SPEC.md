# Especificação — Backend do módulo de Provas (ProvaHub)

## Contexto

O frontend (Angular 22, `app-dateca-client-front`) já implementa três telas novas, todas como componentes **standalone**:

- **Criar Prova** (`src/app/pages/client/criar-prova`): wizard de 4 passos (Informações, Questões, Configuração, Resumo) para criar uma prova manualmente, com questões de múltipla escolha (A–E). Serve tanto para criar quanto para editar (`/client/provas/editar/:id`).
- **Minhas Provas** (`src/app/pages/client/minhas-provas`): listagem das provas criadas pelo usuário logado, com status, participantes, datas e ranking.
- **Visualizar Prova** (`src/app/pages/client/visualizar-prova`): detalhe somente-leitura de uma prova (usada pelo dono e por quem recebe o link de compartilhamento).

O serviço `src/app/service/prova/prova.service.ts` já está escrito para chamar os endpoints HTTP reais descritos abaixo — **não existe mais mock em localStorage**. Ou seja, assim que o backend implementar essas rotas, as três telas funcionam sem nenhuma mudança adicional no frontend.

O backend hoje mistura duas convenções de rotas:

1. **Legado** (Question/Enade/Student), endpoints em português, sem prefixo `/api`: `GET /questao/aluno`, `POST /questao/answerQuestion/:id`, `GET /enade/aluno`, `GET /aluno/ranking`, `GET /aluno/perfil`, etc.
2. **Nova convenção** (Friendship, a feature real mais recente), em inglês, com paginação padronizada: `POST /friendships`, `PATCH /friendships/:id/accept`, `GET /me/friends`, `GET /users/search`, todas retornando um envelope `Page<T>`:
   ```ts
   interface Page<T> {
     content: T[];
     totalElements: number;
     totalPages: number;
     number: number;
     size: number;
     first: boolean;
     last: boolean;
     empty: boolean;
   }
   ```

Como "Provas" é uma feature nova (sem precedente legado), o frontend já foi implementado seguindo a **convenção nova** (estilo `friendship`): rotas em inglês, `/me/...` para "meus recursos", paginação `Page<T>`. A única exceção deliberada: o campo de dificuldade (`dificuldade`) reaproveita o enum `PointsEnum` já usado por `Question`/`Enade` (`'Fácil' | 'Médio' | 'Difícil'`), para não duplicar esse conceito no sistema.

Autenticação: Bearer token (JWT) via o interceptor já existente (`auth.interceptor.ts`). Toda rota abaixo é autenticada e deve resolver o usuário autenticado a partir do token.

## Modelo de dados

Ver `src/app/interfaces/prova.ts` no repositório para os tipos exatos.

### Enums novos

```ts
type ProvaStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'CLOSED';
type ProvaVisibility = 'EVERYONE' | 'FRIENDS' | 'GROUP';
type ProvaAlternative = 'A' | 'B' | 'C' | 'D' | 'E';
```

### `ProvaSummaryDTO` (item da listagem "Minhas Provas")

| Campo | Tipo | Observação |
|---|---|---|
| `id` | string (UUID) | |
| `titulo` | string | |
| `disciplina` | string | hoje é uma lista estática no frontend (`DISCIPLINAS` em `prova.service.ts`); avaliar se deve virar FK para a entidade `Course` já existente |
| `status` | `ProvaStatus` | calculado no servidor, nunca setado diretamente pelo cliente (ver regra abaixo) |
| `participantes` | number | contagem de submissões distintas |
| `dataAbertura` | string (`YYYY-MM-DD`) \| null | |
| `dataEncerramento` | string (`YYYY-MM-DD`) \| null | |
| `rankingDisponivel` | boolean | `true` somente quando `status` é `ACTIVE` ou `CLOSED` |

### `ProvaDTO` (detalhe completo — criar/editar/visualizar)

Estende `ProvaSummaryDTO` e adiciona:

| Campo | Tipo | Observação |
|---|---|---|
| `descricao` | string | |
| `dificuldade` | `PointsEnum` | `'Fácil' \| 'Médio' \| 'Difícil'` — mesmo enum de `Question`/`Enade` |
| `capaUrl` | string \| null | imagem de capa como data-URI base64 (`data:image/png;base64,...`), PNG/JPG até 5MB. **Não há endpoint separado de upload** — o base64 vai embutido no próprio payload de criação/edição, mesmo padrão já usado pelo endpoint legado `/questao/imagens/:id` (que já retorna imagem em base64). |
| `questoes` | `ProvaQuestaoDTO[]` | |
| `horaAbertura` | string (`HH:mm`) \| null | |
| `maxParticipantes` | number \| null | `null` = sem limite |
| `visibilidade` | `ProvaVisibility` | |
| `criadorId` | string | usuário que criou a prova |
| `criadaEm` | string (timestamp ISO) | |

### `ProvaQuestaoDTO`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | string \| undefined | ausente ao criar |
| `statement` | string | enunciado |
| `alternativeA` … `alternativeE` | string | 5 alternativas |
| `correctAnswer` | `ProvaAlternative` | |
| `comment` | string | explicação exibida após o aluno responder |

### `ProvaRequest` (body de `POST /provas` e `PUT /provas/:id`)

Igual ao `ProvaDTO`, mas sem `id`, `status`, `participantes`, `rankingDisponivel`, `criadorId`, `criadaEm` (todos calculados/atribuídos pelo servidor), e com um campo adicional:

| Campo | Tipo | Observação |
|---|---|---|
| `publicar` | boolean | `true` = publicar imediatamente (transiciona para `SCHEDULED`/`ACTIVE` conforme a data de abertura); `false` = salvar como `DRAFT` (ação "Salvar rascunho" no wizard) |

### `ProvaSubmissaoDTO` (necessária para alimentar `participantes` e o ranking — fora do escopo imediato das 3 telas, mas precisa existir para os campos acima fazerem sentido)

| Campo | Tipo | Observação |
|---|---|---|
| `id` | string | |
| `provaId` | string | |
| `studentId` | string | |
| `respostas` | `{ provaQuestaoId: string; respostaEscolhida: ProvaAlternative }[]` | |
| `pontuacao` | number | calculada no backend a partir do gabarito |
| `respondidoEm` | string (timestamp ISO) | |

## Regras de negócio

1. **`status` é sempre calculado pelo servidor**, nunca aceito como valor livre do cliente (o cliente só manda `publicar: boolean`):
   - `DRAFT`: `publicar = false` na criação/edição. Nunca muda sozinho.
   - `SCHEDULED`: publicada (`publicar = true`) com `dataAbertura` no futuro.
   - `ACTIVE`: publicada, `dataAbertura` já passou e (`dataEncerramento` vazio ou no futuro).
   - `CLOSED`: publicada, `dataEncerramento` já passou.
2. **`rankingDisponivel`** = `true` somente quando `status` é `ACTIVE` ou `CLOSED`.
3. **Visibilidade**:
   - `EVERYONE`: qualquer usuário autenticado pode visualizar/responder.
   - `FRIENDS`: apenas amigos do criador — reaproveitar o sistema de amizades já existente (`FriendshipService`/entidade `Friendship`) para validar antes de servir `GET /provas/:id` ou `GET /provas/:id/questoes/aluno`.
   - `GROUP`: reservado para o futuro. **Não implementar entidade de grupo agora** — o frontend já avisa "em breve" e trata como se fosse `EVERYONE`. Só reserve o valor no enum para não quebrar o contrato depois.
4. **Permissões**:
   - Só o `criadorId` pode `PUT`/`DELETE` uma prova, e só ele pode ver uma prova com `status = DRAFT`.
   - Provas publicadas (`SCHEDULED`/`ACTIVE`/`CLOSED`) podem ser lidas por quem tem permissão de visibilidade, mas só o criador edita/exclui.
5. **Contagem de `participantes`** = número de `ProvaSubmissao` distintas por `provaId`.
6. **Compartilhamento**: o frontend gera o link `client/provas/visualizar/:id` no próprio cliente — não precisa de endpoint dedicado, só que `GET /provas/:id` respeite a regra de visibilidade do item 3.

## Endpoints necessários

Todos autenticados via Bearer token.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/me/provas?page=&size=` | `Page<ProvaSummaryDTO>` — provas criadas pelo usuário autenticado (tela "Minhas Provas"). |
| `GET` | `/provas/:id` | `ProvaDTO` completo, para editar ou visualizar. Aplica a regra de permissão/visibilidade do item 4. |
| `POST` | `/provas` | Body: `ProvaRequest`. Cria uma prova (rascunho ou já publicada, conforme `publicar`). Retorna `ProvaDTO`. |
| `PUT` | `/provas/:id` | Body: `ProvaRequest`. Atualiza uma prova existente (usado tanto para editar quanto para "salvar rascunho" de novo). Retorna `ProvaDTO`. |
| `DELETE` | `/provas/:id` | Exclui a prova (o frontend já confirma com o usuário antes de chamar). |
| `GET` | `/provas/:id/questoes/aluno` | *(Próximo passo, não bloqueia as 3 telas atuais)* Retorna a prova para o aluno responder, **sem** `correctAnswer`/`comment`, mesmo espírito de `/questao/aluno`. |
| `POST` | `/provas/:id/responder` | *(Próximo passo)* Recebe `ProvaSubmissaoDTO.respostas`, calcula `pontuacao`, retorna resultado com gabarito e comentários — análogo a `/questao/answerQuestion/:id`. |
| `GET` | `/provas/:id/ranking?page=&size=` | *(Próximo passo)* `Page<RankingEntryDTO>` dos participantes daquela prova, disponível só quando `rankingDisponivel = true`. |

As duas últimas linhas (`responder`/`ranking`) não são consumidas ainda pelas 3 telas já implementadas, mas foram antecipadas aqui porque os campos `participantes` e `rankingDisponivel` só fazem sentido de verdade quando esse fluxo existir — **priorize `GET /me/provas`, `GET /provas/:id`, `POST /provas`, `PUT /provas/:id` e `DELETE /provas/:id` primeiro**, que é o que já bloqueia o uso real das telas.

## Formato esperado do payload de criação/edição (`POST`/`PUT /provas`)

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
  "visibilidade": "EVERYONE",
  "publicar": true
}
```

Resposta (`ProvaDTO`) inclui adicionalmente `id`, `status` (calculado), `participantes`, `rankingDisponivel`, `criadorId`, `criadaEm`.

## Fora de escopo desta primeira entrega

- Entidade/CRUD de "Grupo" para a visibilidade `GROUP` (frontend já trata como "em breve" / equivalente a `EVERYONE`).
- Tela de "Biblioteca" (descobrir provas públicas de outros usuários).
- `POST /provas/:id/responder` e `GET /provas/:id/ranking` podem vir numa segunda entrega — não bloqueiam "Criar Prova" nem "Minhas Provas", só deixam `participantes`/`ranking` sempre zerados até existirem.

---

## Prompt pronto para o time/agente de backend

> Copie o bloco abaixo ao pedir para um agente (ou desenvolvedor) implementar o backend.

```
Preciso que você implemente, no backend do projeto DATECA/ProvaHub, o módulo de "Provas" (exames de múltipla escolha criados manualmente pelos usuários). O frontend Angular já está pronto e chama HTTP real (não há mais mock) — preciso só do backend para as telas funcionarem.

Contexto do sistema existente:
- O backend tem duas convenções de rota convivendo: uma legada em português sem paginação (ex: GET /questao/aluno, GET /aluno/ranking) usada por Question/Enade/Student, e uma nova em inglês com paginação padronizada (ex: POST /friendships, GET /me/friends, GET /users/search — todas retornando um envelope Page<T> com content/totalElements/totalPages/number/size/first/last/empty) usada pela feature de amizades, que é a mais recente e madura do sistema.
- Siga a convenção NOVA (estilo friendship) para tudo que for novo aqui: rotas em inglês, prefixo /me/ para "meus recursos", envelope Page<T> para listagens paginadas.
- Exceção: reaproveite o enum PointsEnum já existente ('Fácil' | 'Médio' | 'Difícil'), usado hoje por Question e Enade, para o campo de dificuldade da prova — não crie um enum de dificuldade paralelo.
- Autenticação: Bearer token JWT, mesmo interceptor/guard já usado no resto do sistema.

O que preciso que você crie:

1. Entidade Prova: id, titulo, descricao, disciplina, dificuldade (reaproveitando PointsEnum), capaUrl (string, base64 data-URI, sem endpoint de upload separado — vai embutido no payload), dataAbertura, horaAbertura, dataEncerramento, maxParticipantes, visibilidade (enum EVERYONE/FRIENDS/GROUP), status (enum DRAFT/SCHEDULED/ACTIVE/CLOSED — SEMPRE calculado no servidor a partir das datas, nunca aceito como valor livre do cliente), criadorId (FK do usuário autenticado que criou), participantes (calculado) e criadaEm.

2. Entidade ProvaQuestao (1:N com Prova): statement, alternativeA a alternativeE, correctAnswer (A-E), comment.

3. Entidade ProvaSubmissao, para futuramente registrar quando um aluno responde uma prova inteira (provaId, studentId, respostas, pontuação calculada, respondidoEm) — crie o modelo agora mas os endpoints de responder/ranking podem vir numa segunda entrega, não são bloqueantes.

4. Regras de negócio:
   - status é derivado de dataAbertura/dataEncerramento no momento da leitura (ou recalculado num job, à sua escolha): SCHEDULED se dataAbertura no futuro, ACTIVE se já abriu e não encerrou, CLOSED se dataEncerramento já passou. DRAFT é setado explicitamente quando o cliente manda publicar=false e nunca muda sozinho.
   - rankingDisponivel = true somente quando status é ACTIVE ou CLOSED.
   - Só o criador pode PUT/DELETE uma prova, e só ele pode ler uma prova com status DRAFT.
   - visibilidade FRIENDS restringe a leitura a amigos do criador (reaproveite a entidade/lógica de amizade já existente). GROUP pode ser tratado como EVERYONE por enquanto — não crie entidade de grupo agora, só reserve o valor do enum.

5. Endpoints REST necessários, priorizados nesta ordem (os 5 primeiros são o que bloqueia as telas já prontas no frontend; os 2 últimos podem vir depois):
   - GET  /me/provas?page=&size= — Page<ProvaSummaryDTO> das provas criadas pelo usuário logado.
   - GET  /provas/:id — ProvaDTO completo (edição/visualização), respeitando a regra de permissão do item 4.
   - POST /provas — body ProvaRequest, cria a prova (rascunho ou publicada conforme o campo publicar). Retorna ProvaDTO.
   - PUT  /provas/:id — body ProvaRequest, atualiza. Retorna ProvaDTO.
   - DELETE /provas/:id — exclui.
   - GET  /provas/:id/questoes/aluno — retorna a prova para responder, SEM correctAnswer/comment.
   - POST /provas/:id/responder — recebe as respostas, calcula pontuação, retorna gabarito+comentários.
   - GET  /provas/:id/ranking?page=&size= — Page<RankingEntryDTO> dos participantes daquela prova.

O payload de POST/PUT /provas deve aceitar exatamente esta forma:
{
  "titulo": "string",
  "descricao": "string",
  "disciplina": "string",
  "dificuldade": "Fácil" | "Médio" | "Difícil",
  "capaUrl": "string (data-URI base64) ou null",
  "questoes": [
    { "statement": "string", "alternativeA": "string", "alternativeB": "string", "alternativeC": "string", "alternativeD": "string", "alternativeE": "string", "correctAnswer": "A"|"B"|"C"|"D"|"E", "comment": "string" }
  ],
  "dataAbertura": "YYYY-MM-DD ou null",
  "horaAbertura": "HH:mm ou null",
  "dataEncerramento": "YYYY-MM-DD ou null",
  "maxParticipantes": number ou null,
  "visibilidade": "EVERYONE" | "FRIENDS" | "GROUP",
  "publicar": boolean
}

A resposta (ProvaDTO) deve incluir também: id, status (calculado), participantes, rankingDisponivel, criadorId, criadaEm.

Não implemente a entidade de "Grupo" nem uma tela pública de "Biblioteca" nesta entrega.

Ao terminar, me diga quais rotas ou nomes de campo ficaram diferentes do especificado para eu conferir contra src/app/service/prova/prova.service.ts e src/app/interfaces/prova.ts no frontend Angular, que já foram escritos esperando exatamente este contrato.
```
