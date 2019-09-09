import { Component, OnInit } from '@angular/core';
import { CatalogueService } from '../catalogue.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification.service';
import { Product } from '../model/product.model';
import { CaddyService } from '../services/caddy.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private products;
  editPhoto: boolean;
  currentProduct;
  selectedFiles;
  progress: number;
  currentUploadFiles: any;
  title : String;
  timestamp : number=0;

  constructor(private catServices: CatalogueService,
    private route : ActivatedRoute, 
    private router : Router,
    public authService: AuthentificationService,
    public caddyservice:CaddyService) { }

  ngOnInit() {
    this.router.events.subscribe((val)=>{
      if(val instanceof NavigationEnd){
        let url = val.url;
        let p1 = this.route.snapshot.params.p1;
        if(p1==1){
          this.getProducts('/products/search/selectedProducts');
          this.title="Produits selectionnés"
        }else if(p1==2){
          let idCat = this.route.snapshot.params.p2;
          this.title="Produits de la categorie "+idCat
          this.getProducts('/categories/'+idCat+'/products');
        }else if(p1==3){
          this.title="Produits en promotion"
          this.getProducts('/products/search/promoProducts');
        }else if(p1==4){
          this.title="Produits disponibles"
          this.getProducts('/products/search/dispoProducts');
        }else if(p1==5){
          this.title="Recherche..."
          this.getProducts('/products/search/dispoProducts');
        }
        
      }
    });
      let p1 = this.route.snapshot.params.p1;
        if(p1==1){
          this.getProducts('/products/search/selectedProducts');
        }
  
    
  }

  getProducts(url) {
   this.catServices.getRessources(url).
   subscribe(data=>{
      this.products = data;
   }),err=>{
     console.log(err);
   }
  }

  onEditPhototo(p){
    this.currentProduct = p;
    this.editPhoto = true;
  }

  onSelectedFile(event){
    this.selectedFiles = event.target.files;
  }

  uploadPhoto(){
    this.progress = 0;
    this.currentUploadFiles = this.selectedFiles.item(0);
    this.catServices.uploadPhotoProducts(this.currentUploadFiles, this.currentProduct.id)
    .subscribe(event=>{
      if(event.type=== HttpEventType.UploadProgress){
        this.progress = Math.round(100*event.loaded / event.total);
        console.log(this.progress);
      }else if(event instanceof HttpResponse){
        //this.getProducts('/products/search/selectedProducts')
        this.timestamp = Date.now();
      }
      
    },err=>{
      alert("probleme au chargement de la photo");

    })
    
    this.selectedFiles = undefined;

  }

  getTS(){
    return this.timestamp;
  }
  public isAdmin(){
    return this.authService.isAdmin();
  }

  onProductDetails(p:Product){
    let url = btoa(p._links.product.href);
    this.router.navigateByUrl('product-detail/'+url);
  }

  private onAddProductToCaddy(p:Product){
    this.caddyservice.addProductToCaddy(p);

}

}
