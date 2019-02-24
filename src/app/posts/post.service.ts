import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscriber } from 'rxjs'; //is a event emitter
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import _ from 'lodash';// for findIndex

import { Post } from './post.modal';


@Injectable({ providedIn: 'root' })
export class PostService {
    // private as you can't edit it form outside
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>(); // Passing list of post as payload 

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        // If we edit this spread operator array then our original array will reamin unmutable.
        // try to use unmutable array. It's good practise in programming
       // return [...this.posts];
       this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
         .pipe(map((postData) => {  //here we will use operator that is provided by observable. It simply convert _id from server to 
                                      //  id as we have used id in our front end. After this call simply is passed to Subscribe.  
                    return postData.posts.map(post => {  // returning modified postData to .subscribe
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id
                        };
                    });
                 })) // above pipe data is passed to subscribe 
         .subscribe((transformedPosts) => {
             this.posts = transformedPosts;
             this.postsUpdated.next([...this.posts]);
         });
    }

    getPostUpdateListener() { 
        return this.postsUpdated.asObservable();  //get post updated 
    }

    getPost(id: string) {   // for post edit mode in postCreateComponent
        // return {...this.posts.find(p => p.id === id)};
        return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
    }

    addPost(title: string, content: string) {   // POST data request
        const post: Post = { id: null, title: title, content: content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
          .subscribe((responseData) => {
              const id = responseData.postId;
              post.id =id;
              this.posts.push(post);
              this.postsUpdated.next([...this.posts]);
              this.router.navigate(["/"]); // adding navigation to postList after adding post
          });  
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = { id: id, title: title, content: content };
        this.http.put('http://localhost:3000/api/posts/'+ id, post)
               .subscribe(response => { 
                   // locally update post
                   const updatedPosts = [...this.posts];
                   const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);// adding post to that index
                   updatedPosts[oldPostIndex] = post;
                   this.posts = updatedPosts;  
                   this.postsUpdated.next([...this.posts]);  //updating post data
                   this.router.navigate(["/"]);  // adding navigation to postList after adding post
                });
    }

    deletePost(postId: string){
        this.http.delete('http://localhost:3000/api/posts/' + postId)
          .subscribe(() => {
              const updatedPosts = this.posts.filter(post => post.id !== postId);
              this.posts = updatedPosts;
              this.postsUpdated.next([...this.posts]);
          });
    }
}