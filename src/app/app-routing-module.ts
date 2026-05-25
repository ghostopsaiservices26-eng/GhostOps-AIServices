import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { HowItWorks } from './pages/how-it-works/how-it-works';
import { Contact } from './pages/contact/contact';
import { Community } from './pages/community/community';
import { Admin } from './pages/admin/admin';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'services', component: Services },
  { path: 'how-it-works', component: HowItWorks },
  { path: 'contact', component: Contact },
  { path: 'community', component: Community },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
