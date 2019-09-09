import { Component, OnInit } from '@angular/core';
import { CatalogueService } from './catalogue.service';
import { Router } from '@angular/router';
import { AuthentificationService } from './services/authentification.service';
import { CaddyService } from './services/caddy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ecom-web';
  private categories;
  private currentCategories;

  constructor(private catService : CatalogueService, 
    private router : Router,
    private authService: AuthentificationService,
    public caddyService:CaddyService){}

  ngOnInit(): void {
    this.authService.loadAuthenticatedUserFromLocaleStorage();
    this.getCategories();
  }

  getCategories() {
    this.catService.getRessources("/categories").
    subscribe(data=>{
        this.categories = data;
    }),
    err=>{
      console.log(err);
    }
  }

  getProductsByCategorie(cat){
    this.currentCategories = cat;
    // console.log(cat.id);
    this.router.navigateByUrl('/products/2/'+cat.id);
  }

  onSelectedProducts(){
    this.currentCategories = undefined;
    this.router.navigateByUrl('/products/1/0');
  }
  
  onProductsPromo(){
    this.currentCategories = undefined;
    this.router.navigateByUrl('/products/3/0');
  }

  onProductsDispo(){
    this.currentCategories = undefined;
    this.router.navigateByUrl('/products/4/0');
  }

  logOut(){
    this.authService.removeTokenFromLocaleStorage();
    this.router.navigateByUrl('/login');
  }


  
}
