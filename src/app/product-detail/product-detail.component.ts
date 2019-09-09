import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogueService } from '../catalogue.service';
import { Product } from '../model/product.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public currentProduct : Product;
  editPhoto:boolean;
  selectedFile: any;
  progress: number;
  currentFileUpload: any;
  timestamp: number;
  currentTime: number;
  mode: number=0;

  constructor(private router: Router, private route: ActivatedRoute,
    public catalService:CatalogueService, 
    public authService:AuthentificationService ) { }

  ngOnInit() {
    let url = atob(this.route.snapshot.params.url);
    this.catalService.getProduct(url).
    subscribe(data=>{
      this.currentProduct =data;
    })
  }

  onEditPhoto(p){
    this.currentProduct=p;
    this.editPhoto=true;
  }
  onSelectedFile(event){
    this.selectedFile=event.target.files;
  }

  onUploadPhoto(){
    this.progress=0;
    this.currentFileUpload=this.selectedFile.item(0);
    this.catalService.uploadPhotoProducts(this.currentFileUpload, this.currentProduct.id).subscribe(event=>{
      if(event.type===HttpEventType.UploadProgress){
        this.progress = Math.round(100 * event.loaded / event.total);
  
      }else if(event instanceof  HttpResponse){
        this.timestamp = Date.now();
        this.editPhoto=false;
      }
        
    },err=>{
      alert("problem de chargement")
    })
    
    this.selectedFile=undefined;
  }

  getTS(){
    return this.timestamp;
  }
  onEditProduct(){
    this.mode=1;
  }
  

  onProductDetails(p: Product){
    let url = btoa(p._links.product.href);
    this.router.navigateByUrl("product-detail/"+url);
  }

  onUpdateProduct(data){
    
  }

}
