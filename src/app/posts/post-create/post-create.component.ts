// If subscribe is used with http client then we don't have to unsubscribe it as angular take care for that.
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostService } from '../post.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.modal';
import { mimeType } from './mime-type.validator'
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  public post: Post;
  

  constructor(public postsService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }) 
    }); //FormGroup constructor take JS object
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; // initializing spinner
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false; // terminating spinner 
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
        this.form.setValue({  // this setvalue is used only in reactive form only
          title: this.post.title,
          content: this.post.content
        }); //here we are initializing our post in case we got a loaded post
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    }); // paramMap is an observable which we have subscribe as parameter in the url could change
    // with this we can listen to changes in routes 
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];// this does simple type conversion // targeting 1st file 
    this.form.patchValue({ image: file });// storing file object  // patchValue allow you to target single value
    this.form.get("image").updateValueAndValidity(); // this inform angular that i modify the input so check it's validity
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    // console.log(file);
    // console.log(this.form);
  }


  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true; // we don't need to change it's value to false as we will navigate away from this page anyway and when we begin, it's initial value will be false
    if (this.mode == 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content

      );
    }
  //  this.form.resetForm();
  this.form.reset();
  }
}
