import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../types/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryServices {
  http=inject(HttpClient);
  constructor() {}
  
getCategories(){
      return this.http.get<Category[]>(' https://motofusion-production.up.railway.app');
    }

getCategoryById(id:string){
    return this.http.get<Category[]>('https://motofusion-production.up.railway.app'+id);
  }
addCategory(name:string){
return this.http.post('https://motofusion-production.up.railway.app',{
  name:name
});
}
updateCategory(id:string,name:string){
return this.http.put('https://motofusion-production.up.railway.app' +id,{
  name:name
});
}


deleteCategoryById(id:string){
    return this.http.delete('https://motofusion-production.up.railway.app'+id);
  }
  
}
