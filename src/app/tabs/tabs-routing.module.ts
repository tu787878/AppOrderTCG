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
        loadChildren: () =>
        import('../tab4/tab4.module').then((m) => m.Tab4PageModule),
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
          },
          {
            path: 'order/:orderId',
            loadChildren: () =>
              import('../inc/detail-order/detail-order.module').then(
                (m) => m.DetailOrderPageModule
              ),
          },
        ],
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
          },
          {
            path: 'product-detail/:productId',
            loadChildren: () => import('../inc/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
          },
          {
            path: 'category',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../inc/category/category.module').then(
                    (m) => m.CategoryPageModule
                  ),
              },
              {
                path: 'new-category',
                loadChildren: () =>
                  import('../inc/new-category/new-category.module').then(
                    (m) => m.NewCategoryPageModule
                  ),
              },
              {
                path: 'edit-category',
                loadChildren: () =>
                  import('../inc/edit-category/edit-category.module').then(
                    (m) => m.EditCategoryPageModule
                  ),
              },
            ],
          },
          {
            path: 'service',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../inc/service/service.module').then(
                    (m) => m.ServicePageModule
                  ),
              },
              {
                path: 'new-service',
                loadChildren: () =>
                  import('../inc/new-service/new-service.module').then(
                    (m) => m.NewServicePageModule
                  ),
              },
              {
                path: 'edit-service',
                loadChildren: () =>
                  import('../inc/edit-service/edit-service.module').then(
                    (m) => m.EditServicePageModule
                  ),
              },
            ],
          },
          {
            path: 'employee',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../inc/employee/employee.module').then(
                    (m) => m.EmployeePageModule
                  ),
              },
              {
                path: 'new-employee',
                loadChildren: () =>
                  import('../inc/new-employee/new-employee.module').then(
                    (m) => m.NewEmployeePageModule
                  ),
              },
              {
                path: 'edit-employee',
                children: [
                  {
                    path: '',
                    loadChildren: () =>
                      import('../inc/edit-employee/edit-employee.module').then(
                        (m) => m.EditEmployeePageModule
                      ),
                  },
                  {
                    path: 'services-manager',
                    loadChildren: () =>
                      import(
                        '../inc/services-manager/services-manager.module'
                      ).then((m) => m.ServicesManagerPageModule),
                  },
                  {
                    path: 'time-manager',
                    loadChildren: () =>
                      import('../inc/time-manager/time-manager.module').then(
                        (m) => m.TimeManagerPageModule
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'tab4',
        children: [
          {
            path: 'shop-style',
            loadChildren: () =>
              import('../inc/shop-style/shop-style.module').then(
                (m) => m.ShopStylePageModule
              ),
          },
          {
            path: '',
            loadChildren: () =>
              import('../tab4/tab4.module').then((m) => m.Tab4PageModule),
          },
          {
            path: 'general',
            loadChildren: () =>
              import('../inc/general/general.module').then(
                (m) => m.GeneralPageModule
              ),
          },
          {
            path: 'time-shop',
            loadChildren: () =>
              import('../inc/time-shop/time-shop.module').then(
                (m) => m.TimeShopPageModule
              ),
          },
          {
            path: 'payment',
            loadChildren: () =>
              import('../inc/payment/payment.module').then(
                (m) => m.PaymentPageModule
              ),
          },
          {
            path: 'email-setting',
            loadChildren: () =>
              import('../inc/email-setting/email-setting.module').then(
                (m) => m.EmailSettingPageModule
              ),
          },
          {
            path: 'delivery',
            loadChildren: () =>
              import('../inc/delivery/delivery.module').then(
                (m) => m.DeliveryPageModule
              ),
          },
          {
            path: 'info',
            loadChildren: () =>
              import('../inc/info/info.module').then((m) => m.InfoPageModule),
          },
          {
            path: 'zipcode',
            loadChildren: () =>
              import('../inc/zipcode/zipcode.module').then(
                (m) => m.ZipcodePageModule
              ),
          },
          {
            path: 'shop-address',
            loadChildren: () =>
              import('../inc/shop-address/shop-address.module').then(
                (m) => m.ShopAddressPageModule
              ),
          },
          {
            path: 'discount',
            loadChildren: () =>
              import('../inc/discount/discount.module').then(
                (m) => m.DiscountPageModule
              ),
          },

          {
            path: 'product-category',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import(
                    '../inc/product-category/product-category.module'
                  ).then((m) => m.ProductCategoryPageModule),
              },
              {
                path: 'product-category-detail/:categoryId',
                loadChildren: () =>
                  import(
                    '../inc/product-category-detail/product-category-detail.module'
                  ).then((m) => m.ProductCategoryDetailPageModule),
              },
            ],
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/tab4',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab4',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
