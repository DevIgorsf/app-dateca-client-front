import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {
  FriendDTO,
  FriendshipResponseDTO,
  FriendshipService,
  UserSearchDTO,
} from 'src/app/service/friendship/friendship.service';

const AVATAR_COLORS = [
  '#7C4DFF', '#2979FF', '#FF4081', '#00BFA5',
  '#FF6D00', '#43A047', '#D81B60', '#00897B',
];

@Component({
    selector: 'app-adicionar',
    templateUrl: './adicionar.component.html',
    styleUrls: ['./adicionar.component.scss'],
    standalone: false
})
export class AdicionarComponent implements OnInit, OnDestroy {
  search = '';
  searching = false;
  searchResults: UserSearchDTO[] = [];

  friendRequests: FriendshipResponseDTO[] = [];
  loadingRequests = true;

  sentRequests: FriendshipResponseDTO[] = [];
  loadingSentRequests = true;

  friends: FriendDTO[] = [];
  friendsCount = 0;
  loadingFriends = true;

  private search$ = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private friendshipService: FriendshipService,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadSentRequests();
    this.loadFriends();

    this.subscriptions.add(
      this.search$
        .pipe(
          debounceTime(350),
          distinctUntilChanged(),
          switchMap((query) => {
            const trimmed = query.trim();
            if (trimmed.length < 2) {
              return of(null);
            }
            this.searching = true;
            return this.friendshipService.searchUsers(trimmed).pipe(
              catchError(() => of(null))
            );
          })
        )
        .subscribe((page) => {
          this.searching = false;
          this.searchResults = page ? page.content.filter((user) => user.relationshipStatus !== 'SELF') : [];
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSearchChange(value: string): void {
    this.search = value;
    if (value.trim().length < 2) {
      this.searchResults = [];
    }
    this.search$.next(value);
  }

  sendRequest(user: UserSearchDTO): void {
    this.friendshipService.sendRequest(user.id).subscribe({
      next: (friendship) => {
        user.relationshipStatus = 'PENDING_SENT';
        this.sentRequests = [...this.sentRequests, friendship];
      }
    });
  }

  acceptRequest(request: FriendshipResponseDTO): void {
    this.friendshipService.acceptRequest(request.id).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter((item) => item.id !== request.id);
        this.loadFriends();
      }
    });
  }

  declineRequest(request: FriendshipResponseDTO): void {
    this.friendshipService.declineRequest(request.id).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter((item) => item.id !== request.id);
      }
    });
  }

  cancelRequest(request: FriendshipResponseDTO): void {
    this.friendshipService.cancelRequest(request.id).subscribe({
      next: () => {
        this.sentRequests = this.sentRequests.filter((item) => item.id !== request.id);
      }
    });
  }

  getInitials(name: string): string {
    return (name || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  getColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < (seed || '').length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  private loadRequests(): void {
    this.loadingRequests = true;
    this.friendshipService.getReceivedRequests().subscribe({
      next: (page) => {
        this.friendRequests = page.content;
        this.loadingRequests = false;
      },
      error: () => {
        this.loadingRequests = false;
      }
    });
  }

  private loadSentRequests(): void {
    this.loadingSentRequests = true;
    this.friendshipService.getSentRequests().subscribe({
      next: (page) => {
        this.sentRequests = page.content;
        this.loadingSentRequests = false;
      },
      error: () => {
        this.loadingSentRequests = false;
      }
    });
  }

  private loadFriends(): void {
    this.loadingFriends = true;
    this.friendshipService.getFriends().subscribe({
      next: (page) => {
        this.friends = page.content;
        this.friendsCount = page.totalElements;
        this.loadingFriends = false;
      },
      error: () => {
        this.loadingFriends = false;
      }
    });
  }
}
