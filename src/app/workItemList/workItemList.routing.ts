import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { AreaPathsComponent } from "./components/areaPaths/areaPaths.component";

export const routes = RouterModule.forChild([
    {
        path: 'work',
        component: HomeComponent
    },
    {
        path: 'areaPaths',
        component: AreaPathsComponent
    },
    {
        path: 'work/areaPath/:areaPath',
        component: HomeComponent
    }
]);
