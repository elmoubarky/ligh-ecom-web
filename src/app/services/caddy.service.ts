import { Injectable } from "@angular/core";
import { Caddy } from '../model/caddy.model';
import { AuthentificationService } from './authentification.service';
import { ItemProduct } from '../model/item-product.model';
import { Product } from '../model/product.model';

@Injectable({
    providedIn:'root'
})
export class CaddyService{
    
    public currentCaddyName:string="Caddy1";
    public listCaddies:Array<{num:number, name:string}>=[{num:1, name:'caddy1'}];
    public caddies:Map<string,Caddy>=new Map();

    constructor(private authService:AuthentificationService){

        let caddy = new Caddy(this.currentCaddyName);
        this.caddies.set(this.currentCaddyName, caddy);

    }

    public addProductToCaddy(product:Product):void{
        let caddy=this.caddies.get(this.currentCaddyName);
        let productItem:ItemProduct=caddy.items.get(product.id);

        if(productItem){
            productItem.quantity+=product.quantity;
            console.log("if : "+productItem);
        }else{
            productItem=new ItemProduct();
            productItem.price=product.currentPrice;
            productItem.quantity=product.quantity;
            productItem.product=product;
            
            caddy.items.set(product.id, productItem);
        }

    }

    public getTotal():number{
        let total=0;
        let items:IterableIterator<ItemProduct> = this.getCurrentCaddy().items.values();
       // let caddy  = this.caddies[this.currentCaddyName];
        for(let pi of items){
            total+=pi.price*pi.quantity;
        }
        return total;
    }

    public removeProduct(id:number):void{
        let caddy=this.caddies[this.currentCaddyName];
        delete caddy.items[id];
        this.saveCaddy();
    }

    public addProduct(product:Product){
       // this.addProductToCaddy(product.id, product.name, product.currentPrice, product.quantity);
        this.saveCaddy();
    }

    saveCaddy() {
        let cad = this.caddies[this.currentCaddyName];
        //localStorage.setItem("myCaddy_"+this.authenticatedUser.username+"_"+this.currentCaddyName);
    }

    getCaddy() {
        let caddy = this.caddies[this.currentCaddyName];
        return caddy;
    }

    getCurrentCaddy():Caddy{
        return this.caddies.get(this.currentCaddyName);
    }
    getSize(){
        let caddy = this.caddies[this.currentCaddyName];
        return Object.keys(caddy.items).length;
    }


    loadCaddyFromLocalStorage() {
       // let myCaddiesList=localStorage.getItem("ListCaddies_"+this.authService.authenticatedUser.username);
     //   this.listCaddies=myCaddiesList==undefined?[{num:1, name:'Caddy1'}]:JSON.parse(myCaddiesList);
        this.listCaddies.forEach(c=>{
          //  let cad = localStorage.getItem("myCaddy_"+this.authenticatedUser.username+"_"+c.name);
           // this.caddies[c.name]=cad==undefined?new Caddy(c.name):JSON.parse(cad);
        })
       
    }
}