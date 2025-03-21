import { Route } from "@angular/router";
import { adminGuard } from "../../core/guards/admin.guard";
import { authGuard } from "../../core/guards/auth.guard";
import { AdminComponent } from "./admin.component";
import { ProductUpdateComponent } from "./edit/product-update.component";
import { ProductCreateComponent } from "./create/product-create.component";


export const adminRoutes: Route[] = [
    { path: '', component: AdminComponent, canActivate: [authGuard, adminGuard] },
    { path: 'edit/product-update/:id', component: ProductUpdateComponent, canActivate: [authGuard, adminGuard] },
    { path: 'create/product-create', component: ProductCreateComponent, canActivate: [authGuard, adminGuard] }
]