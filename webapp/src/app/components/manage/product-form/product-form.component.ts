import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Brand } from '../../../types/brand';
import { Category } from '../../../types/category';
import { BrandService } from '../../../services/brand.service';
import { CategoryServices } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, 
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
  MatCheckboxModule,
  RouterModule 
],
    
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  formBuilder = inject(FormBuilder);
  productForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(5)]],
    description: [null, [Validators.required, Validators.minLength(10)]],
    reference: [null, [Validators.required, Validators.minLength(12)]],
    price: [null, [Validators.required]],
    categoryId: [null, [Validators.required]],
    brandId: [null, [Validators.required]], 
    isFeatured:[false],
    isNewProduct:[false],
    images: this.formBuilder.array([]),
    marca: [null, [Validators.required]], // Compatibilidad principal
    modelo: [null, [Validators.required]], // Ej: "CB500"
    año: [null, [Validators.required]],
    // NUEVO: FormArray para compatibilidad extendida
    compatibilidad: this.formBuilder.array([])
  });

  categoryServices = inject(CategoryServices);
  brandService = inject(BrandService);
  productService = inject(ProductService);
  brand: Brand[] = [];
  categories: Category[] = [];
  id!: string;
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.categoryServices.getCategories().subscribe(result => {
      this.categories = result;
    });
    
    this.brandService.getBrands().subscribe(result => {
      this.brand = result;
    });
    
    this.id = this.route.snapshot.params["id"];
    console.log(this.id);
    
    if(this.id) {
      this.productService.getProductbyId(this.id).subscribe(result => {
        // Cargar imágenes
        for (let index = 0; index < result.images.length; index++) {
          this.addImage();
        }
        
        // Cargar compatibilidad extendida
        if (result.compatibilidad && result.compatibilidad.length > 0) {
          for (let index = 0; index < result.compatibilidad.length; index++) {
            this.addCompatibility();
          }
        } else {
          // Si no hay compatibilidad extendida, añadir una vacía
          this.addCompatibility();
        }
        
        this.productForm.patchValue(result as any);
      });
    } else {
      this.addImage();
      this.addCompatibility(); // Añadir una compatibilidad vacía por defecto
    }
  }

  addProduct() {
    let value = this.productForm.value;
    console.log(value);
    this.productService.addProduct(value as any).subscribe(result => {
      alert("Producto Added");
      this.router.navigateByUrl("/admin/products");
    });
  }

  updateProduct() {
    let value = this.productForm.value;
    console.log(value);
    this.productService.updateProduct(this.id, value as any).subscribe(result => {
      alert("Producto Updated");
      this.router.navigateByUrl("/admin/products");
    });
  }

  // MÉTODOS PARA IMÁGENES
  addImage() {
    this.images.push(this.formBuilder.control(null));
  }

  removeImage() {
    if (this.images.length > 1) {
      this.images.removeAt(this.images.controls.length - 1);
    }
  }

  get images() {
    return this.productForm.get('images') as FormArray;
  }

  // NUEVOS MÉTODOS PARA COMPATIBILIDAD
  addCompatibility() {
    this.compatibilidad.push(this.formBuilder.group({
      marca: [null, [Validators.required]],
      modelo: [null, [Validators.required]],
      año: [null, [Validators.required]]
    }));
  }

  removeCompatibility(index: number) {
    if (this.compatibilidad.length > 1) {
      this.compatibilidad.removeAt(index);
    }
  }

  get compatibilidad() {
    return this.productForm.get('compatibilidad') as FormArray;
  }

  // Método para obtener los controles de compatibilidad como FormArray
  getCompatibilidadControls() {
    return (this.productForm.get('compatibilidad') as FormArray).controls;
  }
}