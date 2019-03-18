import { Component, OnInit, OnDestroy } from "@angular/core";
import {Subscription} from 'rxjs'
import { PageEvent } from '@angular/material'

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
   isLoading = false;
   color = 'accent';
   totalPosts = 0;
   postsPerPage = 2;
   currentPage = 1;
   pageSizeOptions = [1, 2, 5, 10];
   private postsSub: Subscription;

   constructor(public postsService: PostService) {}

   ngOnInit() {
       this.isLoading = true;
       this.postsService.getPosts(this.postsPerPage, 1);
       this.postsSub = this.postsService.getPostUpdateListener()
         .subscribe((postData: { posts: Post[], postCount: number}) => {
             this.isLoading = false;
             this.totalPosts =postData.postCount;
             this.posts = postData.posts;
         });   
   }

   onChangedPage(pageData: PageEvent) {
    this.isLoading = true; //we setting it's value to false when getPostUpdateListener
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

   onDelete(postId: string){
       this.isLoading=true;
       this.postsService.deletePost(postId).subscribe(() => {
           this.postsService.getPosts(this.postsPerPage, this.currentPage);
       });
   }

   ngOnDestroy(){
       this.postsSub.unsubscribe();  
   }

}