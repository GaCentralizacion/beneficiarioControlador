import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'dense-layout',
    templateUrl: './dense.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    navigationAppearance: 'default' | 'dense' = 'dense';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public dataUser: any;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _gaService: GaService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.dataUser = JSON.parse(localStorage.getItem('user'));
        if (!this.dataUser) {
            this._router.navigateByUrl('sign-in')
        };
        this.createMenu();
        // Subscribe to navigation data
        // this._navigationService.navigation$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((navigation: Navigation) => {
        //         this.navigation = navigation;
        //     });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    createMenu = () => {
        const data = {
            idRol: 2
        };

        this._gaService.postService('login/menuApp', data).subscribe(res => {
            if (res[0].length > 0) {
                let _default: FuseNavigationItem[] = [];
                let childrenData: FuseNavigationItem[] = [];
                for (let data of res[0]) {
                    const itemNav: FuseNavigationItem = {
                        id: data.idMenu.toString(),
                        title: data.Title,
                        type: data.Type,
                        icon: data.Icon,
                        link: data.Link,
                    };
                    childrenData.push(itemNav)
                };

                _default.push({
                    id: 'beneficiario',
                    title: 'Beneficiario Controlador',
                    subtitle: '',
                    type: 'group',
                    icon: 'heroicons_outline:home',
                    children: childrenData
                });

                this.navigation = {
                    default: _default,
                    compact: [],
                    futuristic: [],
                    horizontal: []
                };
            } else {
                Swal.fire({
                    title: '¡Error!',
                    text: '[MenuError]',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
                this._router.navigateByUrl('sign-in')
            };


            // const _default: FuseNavigationItem[] = [
            //     {
            //         id: 'beneficiario',
            //         title: 'Beneficiario Controlador',
            //         subtitle: '',
            //         type: 'group',
            //         icon: 'heroicons_outline:home',
            //         children: [
            //             {
            //                 id: 'beneficiario.dashboard',
            //                 title: 'Dashboard',
            //                 type: 'basic',
            //                 icon: 'heroicons_outline:clipboard-check',
            //                 link: '/beneficiario/dashboard'
            //             },
            //             {
            //                 id: 'beneficiario.personas',
            //                 title: 'Personas',
            //                 type: 'basic',
            //                 icon: 'heroicons_outline:user-group',
            //                 link: '/beneficiario/personas'
            //             },
            //             {
            //                 id: 'beneficiario.accionista',
            //                 title: 'Accionistas',
            //                 type: 'basic',
            //                 icon: 'heroicons_outline:currency-dollar',
            //                 link: '/beneficiario/accionista'
            //             },
            //             {
            //                 id: 'beneficiario.series',
            //                 title: 'Series',
            //                 type: 'basic',
            //                 icon: 'heroicons_outline:cash',
            //                 link: '/beneficiario/series'
            //             }
            //         ]
            //     }
            // ];

        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: '[MenuError]',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            this._router.navigateByUrl('sign-in')
        });
    };

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    /**
     * Toggle the navigation appearance
     */
    toggleNavigationAppearance(): void {
        this.navigationAppearance = (this.navigationAppearance === 'default' ? 'dense' : 'default');
    }
}
