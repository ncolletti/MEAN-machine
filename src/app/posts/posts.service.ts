import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(formattedPosts => {
        this.posts = formattedPosts;
        this.postsUpdated.next([...this.posts]);
      });

    // return [...this.posts]; // create new array from old array for real copy
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`, {responseType: 'text'})
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        post.id = responseData.postId;
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
