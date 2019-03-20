import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscriber } from 'rxjs'; // is a event emitter
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import _ from 'lodash'; // for findIndex

import { Post } from './post.modal';


@Injectable({ providedIn: 'root' })
export class PostService {
    // private as you can't edit it form outside
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>(); // Passing list of post as payload

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        // If we edit this spread operator array then our original array will reamin unmutable.
        // try to use unmutable array. It's good practise in programming
       // return [...this.posts];
       const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;  // bacticks allow us to add dynamic content in JS
       this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
         .pipe(map((postData) => {  // here we will use operator that is provided by observable. It simply convert _id from server to
                                      //  id as we have used id in our front end. After this call simply is passed to Subscribe.
                    return {posts: postData.posts.map(post => {  // returning modified postData to .subscribe
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath
                        };
                    }),
                    maxPosts: postData.maxPosts};
                 })) // above pipe data is passed to subscribe
         .subscribe((transformedPostsData) => {
             this.posts = transformedPostsData.posts;
             this.postsUpdated.next({
                 posts: [...this.posts],
                 postCount: transformedPostsData.maxPosts
                });
         });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();  // get post updated
    }

    getPost(id: string) {   // for post edit mode in postCreateComponent
        // return {...this.posts.find(p => p.id === id)};
        return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id);
    }

    addPost(title: string, content: string, image: File) {   // POST data request
        // const post: Post = { id: null, title: title, content: content};
        const postData = new FormData(); // FormData allow us to pass both text value and file.
        postData.append('title', title);
        console.log(image)
        postData.append('content', content);
        postData.append('image', image, title); // passing title name with image it will also be included in the name
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
          .subscribe((responseData) => {
              this.router.navigate(['/']); // adding navigation to postList after adding post
          });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {  // for new file
            const postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {
            const postData: Post = {
                id: id,
                title: title,
                content: content,
                imagePath: image
            };
        }

        this.http.put('http://localhost:3000/api/posts/'+ id, postData)
               .subscribe(response => {
                   // locally update post

                //    this.postsUpdated.next([...this.posts]);  //updating post data
                   this.router.navigate(["/"]);  // adding navigation to postList after adding post
                });
    }

    deletePost(postId: string){
        return this.http.delete('http://localhost:3000/api/posts/' + postId)

    }
}
