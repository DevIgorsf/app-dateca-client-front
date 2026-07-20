import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { StudentService } from 'src/app/service/student/student.service';
import { FriendDTO, FriendshipService } from 'src/app/service/friendship/friendship.service';
import { buildRankingEntries, RankingEntry } from 'src/app/shared/utils/ranking.util';
import { RankingListComponent } from 'src/app/shared/components/ranking-list/ranking-list.component';
import { RankingSkeletonComponent } from 'src/app/shared/components/ranking-skeleton/ranking-skeleton.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { MyPositionCardComponent } from 'src/app/shared/components/my-position-card/my-position-card.component';

const FRIENDS_PAGE_SIZE = 100;

@Component({
    selector: 'app-pontuacao',
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatTabsModule,
        RankingListComponent,
        RankingSkeletonComponent,
        EmptyStateComponent,
        MyPositionCardComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './pontuacao.component.html',
    styleUrls: ['./pontuacao.component.scss']
})
export class PontuacaoComponent implements OnInit {
  protected geralEntries = signal<RankingEntry[]>([]);
  protected geralLoading = signal(true);

  protected amigosEntries = signal<RankingEntry[]>([]);
  protected amigosLoading = signal(true);

  protected myGeralEntry = computed(() => this.geralEntries().find((entry) => entry.isCurrentUser) ?? null);
  protected myAmigosEntry = computed(() => this.amigosEntries().find((entry) => entry.isCurrentUser) ?? null);

  private rawGeralRanking: any[] = [];
  private rawFriends: FriendDTO[] | null = null;
  private studentLoaded = false;
  private currentStudentName?: string;
  private currentStudentPoints = 0;

  constructor(
    private studentService: StudentService,
    private friendshipService: FriendshipService,
  ) {}

  ngOnInit(): void {
    this.studentService.getRanking().subscribe({
      next: (response) => {
        this.rawGeralRanking = response || [];
        this.refreshGeralEntries();
        this.geralLoading.set(false);
      },
      error: () => {
        this.geralLoading.set(false);
      }
    });

    this.studentService.getStudent().subscribe({
      next: (student) => {
        this.currentStudentName = student?.name;
        this.currentStudentPoints = student?.points ?? 0;
        this.studentLoaded = true;
        this.refreshGeralEntries();
        this.refreshAmigosEntries();
      },
      error: () => {
        this.studentLoaded = true;
        this.refreshAmigosEntries();
      }
    });

    this.friendshipService.getFriends(0, FRIENDS_PAGE_SIZE).subscribe({
      next: (page) => {
        this.rawFriends = page?.content ?? [];
        this.refreshAmigosEntries();
      },
      error: () => {
        this.rawFriends = [];
        this.refreshAmigosEntries();
      }
    });
  }

  private refreshGeralEntries(): void {
    this.geralEntries.set(buildRankingEntries(this.rawGeralRanking, this.currentStudentName));
  }

  private refreshAmigosEntries(): void {
    if (!this.studentLoaded || this.rawFriends === null) {
      return;
    }

    const combined = [
      ...this.rawFriends.map((friend) => ({ name: friend.name, points: friend.points })),
      ...(this.currentStudentName ? [{ name: this.currentStudentName, points: this.currentStudentPoints }] : []),
    ].sort((a, b) => b.points - a.points);

    this.amigosEntries.set(buildRankingEntries(combined.map((entry) => ({ student: entry })), this.currentStudentName));
    this.amigosLoading.set(false);
  }
}
