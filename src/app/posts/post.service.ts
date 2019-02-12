import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

import { Post } from './post.modal';

@Injectable({ providedIn: 'root' })
export class PostService {
    // private as you can't edit it form outside
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts() {
        // If we edit this spread operator array then our original array will reamin unmutable.
        // try to use unmutable array. It's good practise in programming
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {title: title, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}