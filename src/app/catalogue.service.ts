import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  

  //definition d une variable de type host
  public host: String = "http://localhost:8090";

  constructor(private http:HttpClient) { }

  //methode pour retourner la ressources en fonction de l'url
//elle sera utilise pour envoye  des requetes avec get
  getRessources(url){
  return this.http.get(this.host+url);
  }

  getProduct(url):Observable<Product>{
    return this.http.get<Product>(url);
    }

  uploadPhotoProducts(file: File, idproduct) : Observable<HttpEvent<{}>> {
    let formdata : FormData = new FormData();
    formdata.append('file', file);
    const req  =new HttpRequest('POST', this.host+'/uploadPhoto/'+idproduct, formdata, {
      reportProgress : true,
      responseType : 'text'
    });


    return this.http.request(req);
    
  }
}
