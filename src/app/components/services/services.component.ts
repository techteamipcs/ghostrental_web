import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { PageService } from '../../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  imageURL: string = `${environment.url}/assets`;
  constructor(
    private route: ActivatedRoute,
    private router: Router,public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
  ) {
    this.get_PageMeta();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.route.fragment.pipe(first()).subscribe(fragment => {
        if (fragment) {
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 0);
        }
      });
    });
  } 
  goToVehiclePage(type: string) {
    this.router.navigate(['/product/search'], { queryParams: { type } });
  }
  get_PageMeta() {
		let obj = { pageName: 'services' };
		this.pageservice.getpageWithName(obj).subscribe((response) => {
			if (response.body.code == 200) {
				this.titleService.setTitle(response?.body.result.meta_title);
				this.metaTagService.updateTag({
					name: 'description',
					content: response?.body.result.meta_description,
				});
				this.metaTagService.updateTag({
					name: 'keywords',
					content: response?.body.result.meta_keywords,
				});
			} else if (response.code == 400) {
			} else {
			}
		});
	}
}
