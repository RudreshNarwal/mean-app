import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; //is a event emitter
import { HttpClient } from '@angular/common/http';

import { Post } from './post.modal';

@Injectable({ providedIn: 'root' })
export class PostService {
    // private as you can't edit it form outside
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>(); // Passinf list of post as payload 

    constructor(private http: HttpClient) {}

    getPosts() {
        // If we edit this spread operator array then our original array will reamin unmutable.
        // try to use unmutable array. It's good practise in programming
       // return [...this.posts];
       this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
         .subscribe((postData) => {
             this.posts = postData.posts;
             this.postsUpdated.next([...this.posts]);
         });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content};
        this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
          .subscribe((responseData) => {
              console.log(responseData.message);
              this.posts.push(post);
              this.postsUpdated.next([...this.posts]);
          });
        
    }
}