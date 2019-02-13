import { Component, OnInit, OnDestroy } from "@angular/core";
import {Subscription} from 'rxjs'

import { Post } from '../post.modal';
import { PostService} from '../post.service'

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     { title: "First Post", content: "This is first post" },
    //     { title: "Second Post", content: "This is second post" },
    //     { title: "Third Post", content: "This is third post" }
    // ]
    
   posts: Post[] = [];  //Post[] here refer to interface Post which define the structure of post wheather it will be string or number.
   private postsSub: Subscription;

   constructor(public postsService: PostService) {}

   ngOnInit() {
       this.postsService.getPosts();
       this.postsSub = this.postsService.getPostUpdateListener()
         .subscribe((posts: Post[]) => {
             this.posts = posts;
         });   
   }

   ngOnDestroy(){
       this.postsSub.unsubscribe();  
   }

}