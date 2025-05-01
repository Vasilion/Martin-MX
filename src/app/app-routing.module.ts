import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HiringFormComponent } from './hiring-form/hiring-form.component';

const routes: Routes = [
    { path: 'hiring', component: HiringFormComponent }
    // ... existing routes ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
