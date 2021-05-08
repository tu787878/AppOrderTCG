import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          },
          {
            path: 'parent',
            children: [
              {
                path: '',
                loadChildren: () => import('../inc/parent/parent.module').then( m => m.ParentPageModule)
              },
              {
                path: 'new-parent',
                loadChildren: () => import('../inc/new-parent/new-parent.module').then( m => m.NewParentPageModule)
              },
              {
                path: 'edit-parent',
                loadChildren: () => import('../inc/edit-parent/edit-parent.module').then( m => m.EditParentPageModule)
              },
            ]
          },
          {
            path: 'category',
            children: [
              {
                path: '',
                loadChildren: () => import('../inc/category/category.module').then( m => m.CategoryPageModule)
              },
              
              {
                path: 'new-category',
                loadChildren: () => import('../inc/new-category/new-category.module').then( m => m.NewCategoryPageModule)
              },
              {
                path: 'edit-category',
                loadChildren: () => import('../inc/edit-category/edit-category.module').then( m => m.EditCategoryPageModule)
              }
              
            ]
            
          },
          {
            path: 'service',
            children: [
              {
                path: '',
                loadChildren: () => import('../inc/service/service.module').then( m => m.ServicePageModule)
              },
              {
                path: 'new-service',
                loadChildren: () => import('../inc/new-service/new-service.module').then( m => m.NewServicePageModule)
              },
              {
                path: 'edit-service',
                loadChildren: () => import('../inc/edit-service/edit-service.module').then( m => m.EditServicePageModule)
              }
            ]
            
          },
          {
            path: 'employee',
            loadChildren: () => import('../inc/employee/employee.module').then( m => m.EmployeePageModule)
          }
          
        ]
        
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
