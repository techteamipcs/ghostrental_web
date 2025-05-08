import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgClass, NgIf } from '@angular/common'; // Import NgClass
import { CategoryService } from '../../providers/category/category.service';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Import NgClass
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; // ✅ Import this
import { RouterModule } from '@angular/router'; // ✅ Import this
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {
	baseUrl: any;
	backendUrl: any;
	isScrolled = false;
	// isMegaMenuOpen = false;

	categoryData: any = [];
	subCategoryData: any = [];
	categorycollection: any = [];
	categoryUrlKey: any;
	private routerSub!: Subscription;
	imageUrl: any;
	searchText = '';
	userData: any = true;
	locationImg: boolean = false;
	changeImg: boolean = false;
	wishlistImg: boolean = false;
	logoutImg: boolean = false;
	isHomePage = false;
	category: any = [];
	afLoginHeader: boolean = false;
	bfLoginHeader: boolean = true;
	getallcollections: any = [];
	filteredproductcategory:any=[];
	filteredcategoryseries:any=[];
	activeItem: string = '';
	constructor(
		public categoryService: CategoryService,
		private router: Router, @Inject(PLATFORM_ID) private platformId: Object,) {
		this.baseUrl = environment.url;
		this.backendUrl = environment.baseUrl;
		this.imageUrl = environment.url;
		this.locationImg = false;
		this.changeImg = false;
		this.wishlistImg = false;
		this.logoutImg = false;

	}
	setActiveItem(item: string) {
		this.activeItem = item;
	}
	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			const path = window.location.pathname;
			this.checkRoute(this.router.url); // Initial load

			// Watch for route changes
			this.routerSub = this.router.events.subscribe(event => {
				if (event instanceof NavigationEnd) {
					this.checkRoute(event.urlAfterRedirects);
				}
			});
		}
		this.get_categoryData();
		this.get_subCategoryData();
		this.getAllcategorycollections();
		this.getAllCollections();
	}
	ngOnDestroy(): void {
		this.routerSub?.unsubscribe();
	}
	private checkRoute(url: string): void {
		this.isHomePage = url === '/' || url.startsWith('/home');

		// If NOT home page, immediately apply scrolled logo & sticky
		if (!this.isHomePage) {
			this.isScrolled = true;
		} else {
			this.isScrolled = window.scrollY > 100;
		}
	}
	@HostListener('window:scroll', [])
	onScroll(): void {
		if (this.isHomePage) {
			this.isScrolled = window.scrollY > 100;
		}
	}
	// showMegaMenu() {
	// 	this.isMegaMenuOpen = true;
	// }

	// hideMegaMenu() {
	// 	this.isMegaMenuOpen = false;
	// }
	onclickSearch() {
		this.router.navigate(['productsearch', this.searchText])
	}
	onSearch() {
		if (this.searchText) {
			this.router.navigateByUrl('/productsearch/' + this.searchText, { skipLocationChange: false }).then(() => {
				window.location.reload();
			});
		}
	}
	getCartCount() {
		let tempData = 0;
		// localStorage.getItem('cart-count');
		let cartCount = 0;
		if (tempData) {
			cartCount = Number(tempData);
		}
		return cartCount;
	}
	logout() {
		// localStorage.clear();
		this.afLoginHeader = false;
		this.bfLoginHeader = true;
		this.router.navigate(['/home']).then(() => {
			window.location.reload();
		});
	}
	get_categoryData() {
		this.categoryService.getAllCategory({}).subscribe(
			(response) => {
				if (response.code == 200) {
					if (response.result != null && response.result != '') {
						this.categoryData = response.result;
						if (this.categoryData && this.categoryData.length > 0) {
							// let tempCat = this.categoryData.filter((cat) => cat.url_key == this.categoryUrlKey);
							let tempCat = this.categoryData.filter((cat: any) => cat.url_key == this.categoryUrlKey);

							if (tempCat && tempCat.length > 0) {
								this.categoryData = this.categoryData.map((cat: any) => {
									if (cat.url_key == this.categoryUrlKey) {
										cat['isnavtabactive'] = 'active';
									} else {
										cat['isnavtabactive'] = '';
									}
									return cat;
								})
							}
						}
					}
					else {
					}
				}
			},
		);
	}

	get_subCategoryData() {
		this.categoryService.getSubCategory({}).subscribe(
			(response) => {
				if (response.code == 200) {
					if (response.result != null && response.result != '') {
						this.subCategoryData = response.result;
						this.filteredproductcategory=response.result;
					}
					else {
					}
				}
			},
		);
	}
	getAllcategorycollections() {
		let obj = {};
		this.categoryService.getAllCategorycollections(obj).subscribe((response: any) => {
			if (response.code == 200) {
				if (response.result != null && response.result != '') {
					this.categorycollection = response.result;
				} else {

				}
			}
		})
	}
	getAllCollections() {
		let obj = {};
		this.categoryService.getAllCollections(obj).subscribe((response: any) => {
			if (response.code == 200) {
				if (response.result != null && response.result != '') {
					this.getallcollections = response.result;
				} else {

				}
			}
		})

	}

	//subcategory loop

	onCollectioncatgoryselection(collection_id:any){
		if(collection_id){
			if(this.subCategoryData && this.subCategoryData.length > 0){
				this.filteredproductcategory = [];
				this.subCategoryData.forEach((subcat:any) => {
					if(subcat && subcat.parent_collection_category_data && subcat.parent_collection_category_data.length > 0){
						let temparr = subcat.parent_collection_category_data.filter((cat:any) =>cat._id == collection_id );
						if(temparr && temparr[0]){
							let result = temparr[0];
							this.filteredproductcategory.push(subcat);
						}
					}
				});
			}

			//series loop

			if(this.getallcollections && this.getallcollections.length > 0){
					this.filteredcategoryseries=[];
					this.getallcollections.forEach((series:any) =>{
						if(series && series.collection_category_data && series.collection_category_data.length > 0){
							let temp_arr=series.collection_category_data.filter((ser:any)=> ser._id == collection_id);
							if(temp_arr && temp_arr[0]){
								this.filteredcategoryseries.push(series);
							}
						}
					})
			}
		}
	}
}
