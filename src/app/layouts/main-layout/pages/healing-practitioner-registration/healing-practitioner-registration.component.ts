import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';

@Component({
  selector: 'app-healing-practitioner-registration',
  templateUrl: './healing-practitioner-registration.component.html',
  styleUrls: ['./healing-practitioner-registration.component.scss'],
})
export class HealingPractitionerRegistrationComponent implements OnInit {
  profileId: number;

  allCountryData: any;
  selectedCountry = 'US';
  allStateData: any;
  selectedState = '';

  isCountryChecked: boolean = true;
  isWorldwideChecked: boolean = false;

  selectPractitionerPage: boolean;

  practitionerArea: any = [];
  selectedAreaValues: number[] = [];

  selectedCards: any[] = [];
  cards: any[] = [
    {
      title: 'Botanical Medicine',
      id: 1,
      description: `Plant-based supplements, tinctures, and topical applications that
    assist the body in healing. These may include either western or
    oriental herbal formulas with time-honored traditional healing
    applications for various symptoms and conditions.`,
    },
    {
      title: 'Homeopathy',
      id: 2,
      description: `Gentle effective therapy that utilizes a minute amount of a
    potentized substance to promote a beneficial healing response.`,
    },
    {
      title: 'Hydrotherapy',
      id: 3,
      description: `An important healing modality in traditional naturopathic
    medicine. Hydrotherapy utilizes the therapeutic benefits of water.
    It includes application of cool or warm water in specialized
    compresses or baths.`,
    },
    {
      title: 'Nutritional Counseling',
      id: 4,
      description: `Nutritional supplementation, dietary assessment, and advice in
    making the best food choices based on your unique health history
    and individual needs.`,
    },
    {
      title: 'Lifestyle Counseling',
      id: 5,
      description: `Help in making new choices that are healthier for you physically,
    emotionally, and psychologically.`,
    },
    {
      title: 'Touch for Health',
      id: 6,
      description: ` Touch for Health is a system of balancing posture, attitude and
    life energy to relieve stress, aches and pains, feel and function
    better, be more effective, clarify and achieve your goals and
    enjoy your life! Using a holistic approach we
    rebalance the body's energies and
    activate the body's intrinsic healing process so
    that the body can better heal itself, creating that sense of
    effortless effort, and being in the flow of Life.`,
    },
    {
      title: `German New Medicine, Spiritual, Psychosomatic or related healing modalities`,
      id: 7,
      description: `Various paradigms of medicine, that recognizes the profound
    effects of how an individual's consciousness is reflected in their
    health and well-being. It involves awakening the body's inherent
    self-healing properties. German New Medicine is founded of medical
    discoveries of Dr. med. Ryke Geerd Hamer`,
    },
  ];

  isFromHome = false;

  constructor(
    private seoService: SeoService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    private communityService: CommunityService,
  ) {
    const queryParams = this.route.snapshot.queryParams;
    const newParams = { ...queryParams };
    // console.log(this.router.routerState.snapshot.url);
    this.selectPractitionerPage = this.router.routerState.snapshot.url.includes('request-video-call') || false;
    this.isFromHome = this.router.routerState.snapshot.url.includes('request-video-call') || false;
    // console.log(this.selectPractitionerPage)
    // this.channelId = this.shareService?.channelData?.id;
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log(params.channelId);
    if (newParams['token']) {
      const token = newParams['token'];
      this.tokenStorage.saveToken(token)
      delete newParams['token']
      const navigationExtras: NavigationExtras = {
        queryParams: newParams
      };
      this.router.navigate([], navigationExtras);
    }

    this.profileId = Number(localStorage.getItem('profileId'));
    const data = {
      title: 'HealingTube Registration',
      url: `${window.window.location.href}`,
      description: '',
    };
    this.seoService.updateSeoMetaData(data);
  }

  ngOnInit(): void {
    this.getAllCountries();
    this.getCategories();
  }

  updateCheckbox(selectedOption: 'country' | 'worldwide') {
    if (selectedOption === 'country' && this.isWorldwideChecked) {
      this.isWorldwideChecked = false;
    } else if (selectedOption === 'worldwide' && this.isCountryChecked) {
      this.selectedCountry = '';
      this.selectedState = '';
      this.allStateData = null
      this.isCountryChecked = false;
    }
  }

  getAllCountries() {
    this.spinner.show();
    this.customerService.getCountriesData().subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allCountryData = result;
        this.getAllState();
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  getAllState() {
    this.spinner.show();
    const selectCountry = this.selectedCountry;
    this.customerService.getStateData(selectCountry).subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allStateData = result;
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }
  isSelected(id: number): boolean {
    return this.selectedCards.includes(id);
  }

  selectCard(cardId: string): void {
    const index = this.selectedCards.indexOf(cardId);
    if (index === -1) {
      this.selectedCards.push(cardId);
    } else {
      this.selectedCards = this.selectedCards.filter(id => id !== cardId);
    }
  }

  changeCountry() {
    if (this.isCountryChecked) {
      this.getAllState();
    }
  }

  backPreview() {
    this.selectPractitionerPage = !this.selectPractitionerPage;
  }

  nextPageSearch() {
    if (this.selectedCards.length > 0) {
      const practitionerRequirements = {
        selectedCard: this.selectedCards,
        selectedCountry: this.selectedCountry,
        selectedState: this.selectedState,
        selectedAreas: this.selectedAreaValues
      };
      this.router.navigate(['/health-practitioner'], { state: { data: practitionerRequirements } });
    } else if (this.isWorldwideChecked && this.selectedCards.length <= 0) {
      const areaValues = { selectedAreas: this.selectedAreaValues } 
      this.router.navigate(['/health-practitioner'], { state: { data: areaValues } });
    }
    else {
      this.toastService.danger('Please select What emphasis are you interested in healing');
    }
  }

  getCategories() {
    this.communityService.getCategories().subscribe({
      next: (res) => {
        this.practitionerArea = res.area;
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  onAreaboxChange(event: any, area: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedAreaValues.push(area.aId);
    } else {
      this.selectedAreaValues = this.selectedAreaValues.filter(
        (id) => id !== area.aId
      );
    }
  }
}
