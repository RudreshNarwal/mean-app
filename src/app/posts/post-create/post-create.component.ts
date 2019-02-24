// If subscribe is used with http client then we don't have to unsubscribe it as angular take care for that.
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostService } from '../post.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.modal';
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  isLoading = false;
  private mode = 'create';
  private postId: string;
  public post: Post;
  

  constructor(public postsService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; // initializing spinner
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false; // terminating spinner 
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    }); // paramMap is an observable which we have subscribe as parameter in the url could change
    // with this we can listen to changes in routes 
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true; // we don't need to change it's value to false as we will navigate away from this page anyway and when we begin, it's initial value will be false
    if (this.mode == 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
