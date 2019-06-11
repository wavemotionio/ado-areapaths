import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { AreaPathsComponent } from "./components/areaPaths/areaPaths.component";
import { IterationPathsComponent } from "./components/iterationPaths/iterationPaths.component";
export const routes = RouterModule.forChild([
    {
        path: 'work',
        component: HomeComponent
    },
    {
        path: 'work/workItem/:workItemId',
        component: HomeComponent
    },
    {
        path: 'areaPaths',
        component: AreaPathsComponent
    },
    {
        path: 'work/areaPath/:areaPath',
        component: HomeComponent
    },
    {
        path: 'iterationPaths',
        component: IterationPathsComponent
    },
    {
        path: 'work/iterationPath/:iterationPath',
        component: HomeComponent
    },
]);
