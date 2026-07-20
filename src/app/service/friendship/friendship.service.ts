import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'BLOCKED' | 'REMOVED';

export type RelationshipStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIEND' | 'BLOCKED' | 'SELF';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface FriendshipResponseDTO {
  id: string;
  requesterId: string;
  requesterName: string;
  receiverId: string;
  receiverName: string;
  status: FriendshipStatus;
  createdAt: string;
  acceptedAt: string | null;
  updatedAt: string;
}

export interface FriendDTO {
  id: string;
  registrationNumber: number;
  name: string;
  points: number;
  friendSince: string;
}

export interface UserSearchDTO {
  id: string;
  registrationNumber: number;
  name: string;
  friendsCount: number;
  relationshipStatus: RelationshipStatus;
}

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(
    private http: HttpClient,
  ) { }

  sendRequest(receiverId: string): Observable<FriendshipResponseDTO> {
    return this.http.post<FriendshipResponseDTO>(`${API}/friendships`, { receiverId });
  }

  acceptRequest(id: string): Observable<FriendshipResponseDTO> {
    return this.http.patch<FriendshipResponseDTO>(`${API}/friendships/${id}/accept`, {});
  }

  declineRequest(id: string): Observable<FriendshipResponseDTO> {
    return this.http.patch<FriendshipResponseDTO>(`${API}/friendships/${id}/decline`, {});
  }

  cancelRequest(id: string): Observable<FriendshipResponseDTO> {
    return this.http.patch<FriendshipResponseDTO>(`${API}/friendships/${id}/cancel`, {});
  }

  removeFriendship(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/friendships/${id}`);
  }

  blockUser(id: string): Observable<FriendshipResponseDTO> {
    return this.http.patch<FriendshipResponseDTO>(`${API}/friendships/${id}/block`, {});
  }

  unblockUser(id: string): Observable<FriendshipResponseDTO> {
    return this.http.patch<FriendshipResponseDTO>(`${API}/friendships/${id}/unblock`, {});
  }

  getFriends(page = 0, size = 20): Observable<Page<FriendDTO>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<FriendDTO>>(`${API}/me/friends`, { params });
  }

  getFriendsCount(): Observable<number> {
    return this.http.get<number>(`${API}/me/friends/count`);
  }

  getReceivedRequests(page = 0, size = 20): Observable<Page<FriendshipResponseDTO>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<FriendshipResponseDTO>>(`${API}/me/friendships/received`, { params });
  }

  getSentRequests(page = 0, size = 20): Observable<Page<FriendshipResponseDTO>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<FriendshipResponseDTO>>(`${API}/me/friendships/sent`, { params });
  }

  searchUsers(query: string, page = 0, size = 20): Observable<Page<UserSearchDTO>> {
    const params = new HttpParams().set('q', query).set('page', page).set('size', size);
    return this.http.get<Page<UserSearchDTO>>(`${API}/users/search`, { params });
  }
}
