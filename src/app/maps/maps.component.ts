import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Person } from '../person';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';


import { InlineSVGModule } from 'ng-inline-svg';
import * as Svg from 'svg.js'

import { OfficeFloors, OfficeLocation } from '../datatables/officelocation';
import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapComponent implements OnInit {

  public floorURL = 'http://am-api:3030/api/v1/officefloors';
  public officelocationURL = 'http://am-api:3030/api/v1/officelocations';

  @ViewChildren('nGForArray') filtered;
  public floor = ['04', '05', '12', '13', '18', '26', '27', '28', '29'];
  public floorID = null;
  public cities = ['CC', 'LA', 'OC', 'SD', 'SF'];
  public cityName = null;
  public officeID = null;
  public showAdvFilter = false;
  public searchTerm = null;
  public individualid = null;

  public la28 = ['o2859', 'o2855', 'o2854', 'o2852', 'o2850', 'o2849', 'o2848', 'o2847', 
    'o2846', 'o2842', 'o2839', 'o2838', 'o2837', 'o2836', 'o2835', 'o2831', 'o2830', 
    'o2829', 'o2827', 'o2826', 'o2823', 'o2822', 'o2821', 'o2817', 'o2817', 'o2816',
    'o2815', 'o2813', 'o2812', 'o2845', 'o2857B', 'o2857A', 'o2832D', 'o2832B', 'o2832A', 
    'o2819D', 'o2819C', 'o2819B', 'o2819A', 'o2801', 'o2878', 'o2853', 'o2841', 'o2825',
    'o2818', 'o2814', 'o2808', 'o2805', 'o2804', 'o2803'  
  ]

  floors: OfficeFloors[];
  officelocations: OfficeLocation[];
  people: Person[];
  regions: any[];

  constructor(
    private staffService: APIService,
    private route: ActivatedRoute,
    protected sanitizer: DomSanitizer,
    private _router: Router
  ) { }

  ngOnInit() {
    //this.getOfficeFloors();
    //this.getOfficeLocations();
    this.colorOffice('o2849');
  }

  getOfficeFloors(): void {
    this.staffService.getOfficeFloors(this.floorURL)
    .subscribe(floors => {
      this.floors = floors;
    });
  }

  getOfficeLocations(): void {
    this.staffService.getOfficeLocations(this.officelocationURL)
    .subscribe(officelocations => {
      this.officelocations = officelocations;
    });
  }

  sanitizeScript(sanitizer: DomSanitizer) { }


  displayMap(): SafeHtml {
    var mapIMG;
    const queryStrings: any = this.route.queryParamMap;
    this.executeQueryParams(queryStrings.source.value);
    mapIMG = '<object id="svgObject" data="../../assets/' + this.cityName + '-' + this.floorID + '.svg" type="image/svg+xml" ></object>';
    return this.sanitizer.bypassSecurityTrustHtml(mapIMG);
  }

  highlightOffice(offid: string): void {
    var highlight;
    let a = document.getElementById('svgObject') 
    //highlight = a.DOCUMENT_FRAGMENT_NODE; 
    console.log(a);
    //highlight.setAttribute("fill", "red");
    console.log(offid);
    //return highlight;
  }

  labelMap(city: string, floor: number): string {
    const queryStrings: any = this.route.queryParamMap;
    this.executeQueryParams(queryStrings.source.value);
    //console.log(city);
    //console.log(floor);
    var label;

    switch (city) {
      case 'cc':
        label = "Century City:&nbsp;";
        break;
      case 'la':
        label = "Los Angeles:&nbsp;";
        break;
      case 'oc':
        label = "Orange County:&nbsp;";
        break;
      case 'sd':
        label = "Dan Diego:&nbsp;";
        break;
      case 'sf':
        label = "San Francisco:&nbsp;";
        break;
    }
    label = label + floor + "th&nbsp;Floor&nbsp;";

    return label;
  }

  generateMap(): string {
    var mapImg = '<img src="assets/la-28.svg" class="basemap">';
    return mapImg;
  }

  colorOffice(officeID: string): void {
    let officesvg = document.getElementById("map");
    //  officesvg.getSVGDocument() - this doesn't work
    //  but I need someway to get the element. 

    //  Get the element in the SVG map file - and adjust the fill. 
    //officesvg.fill = "#FFC1C1";
  }

  clearALL(key): void {
    this.searchTerm = null;
    switch (key) {
      case "city":
        this.addQueryParams({ location: null });
        break;
      case "floor":
        this.addQueryParams({ floor: null });
        break;
      case "offid":
        this.addQueryParams({ office: null });
        break;
      case "ind":
        this.addQueryParams({ ind: null });
        break;
    }
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    switch (keys[0]) {
      case 'city':
        this.cityName = values[0];
        break;
      case 'floor':
        this.floorID = values[0];
        break;
      case 'offid':
        this.officeID = values[0];
        break;
      case 'ind':
        this.individualid = values[0];
        break;
    }
    //console.log(query);

    if (query === "") {
      query = null;
    }
    this._router.navigate([''], {
      queryParams: {
        ...query
      },
      queryParamsHandling: 'merge',
    });
  }

  clearQueryParams(): void {
    //console.log('clearing params');
    this._router.navigate([''], {
      queryParams: {
      },
    });
    this.cityName = null;
    this.floorID = null;
    this.officeID = null;
    this.individualid = null;
  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    for (const q of queries) {
      switch (q[0]) {
        case 'city':
          this.cityName = q[1];
          break;
        case 'floor':
          this.floorID = +q[1];
          break;
        case 'offid':
          this.officeID = +q[1];
          break;
        case 'ind':
          this.individualid = +q[1];
          break;
      }
    }
  }
  setToolTips(city: string, floor: number, offid: string): string {
    var officetooltip;
    
    return officetooltip;
  }

  LA28() { 
    let o2859 =  {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/19B3E95B222B47B8BE4EFED7CA5F4BF1.ashx" alt="Allen%2C+Frederick" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Allen, Frederick L. (Fred)</strong></p><p>Founder Emeritus</p><p>Administration</p><p>LA 2859</p><p>x15500</p><p>d: (213) 955-5500</p><p>Assistant: Dallow, Holly x12308</p><p>Timekeeper #: 1551</p></td><td>&nbsp</td></tr></table></div>' },
    o2855 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/DE65F7176CE94F2FB37B1C24829ED7A6.ashx" alt="Hall%2C+Debra" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Hall, Debra </strong></p><p>Partner</p><p>Corporate & Finance: Finance</p><p>LA 2855</p><p>x15536</p><p>d: (213) 955-5536</p><p>Assistant: Hanks, Stephanie x12317</p><p>Timekeeper #: 1578</p></td><td>&nbsp</td></tr></table></div>' },
    o2854 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/56F177F93AA64140BF57DD612A144412.ashx" alt="Ertman%2C+Matthew" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Ertman, Matthew J. (Matt)</strong></p><p>Partner</p><p>Corporate & Finance: Corporate</p><p>LA 2854</p><p>x15579</p><p>d: (213) 955-5579</p><p>Assistant: Hanks, Stephanie x12317</p><p>Timekeeper #: 1039</p></td><td>&nbsp</td></tr></table></div>' },
    o2852 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/D9A2F570226A461F938FB568BD7C0BD7.ashx" alt="Henning%2C+Thomas" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Henning, Thomas W. (Tom)</strong></p><p>Partner</p><p>Corporate & Finance: Tax</p><p>LA 2852</p><p>x15528</p><p>d: (213) 955-5528</p><p>Assistant: Hanks, Stephanie x12317</p><p>Timekeeper #: 1581</p></td><td>&nbsp</td></tr></table></div>' },
    o2850 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/E8682098DB254CA997D6EEBD69F45E9C.ashx" alt="Thorbourne%2C+Alana" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Thorbourne, Alana U.</strong></p><p>Associate</p><p>Litigation: General</p><p>LA 2850</p><p>x15661</p><p>d: (213) 955-5661</p><p>Assistant: Finnerty, Patricia x12398</p><p>Timekeeper #: 2094</p></td><td>&nbsp</td></tr></table></div>' },
    o2849 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="https://www.allenmatkins.com/~/media/8C0B7C43F4CE4E4F8D0A5E3900B9C935.jpg" alt="Aspis%2C+Norman" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Aspis, Norman M.</strong></p><p>Associate</p><p>Litigation: Bankruptcy</p><p>LA 2849</p><p>x15621</p><p>d: 213-955-5621</p><p>Assistant: Diaz, Martha x12304</p><p>Timekeeper #: 2369</p></td><td>&nbsp</td></tr></table></div>' , attr: { fill: '#f67777', stroke: '#000000' } },
    o2848 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://allenmatkins.com/~/media/4F42B592E88747CEA45FEFCCC27079AE.jpg" alt="Witlen%2C+Alan" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Witlen, Alan M</strong></p><p>Associate</p><p>Corporate & Finance: Tax</p><p>LA 2848</p><p>x15561</p><p>d: 213-955-5561</p><p>Assistant: Richter, Stephanie x12319</p><p>Timekeeper #: 2324</p></td><td>&nbsp</td></tr></table></div>' },
    o2847 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/makerblom.jpg" alt="Akerblom%2C+Margaret" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Akerblom, Margaret R. (Marty)</strong></p><p>Associate</p><p>Real Estate: Land Use</p><p>LA 2847</p><p>x15623</p><p>d: 213-955-5623</p><p>Assistant: Gomez, Stephanie x12326</p><p>Timekeeper #: 2376</p></td><td>&nbsp</td></tr></table></div>' },
    o2846 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/C795B6132E864357BE41331A1C93B66D.ashx" alt="Rawn%2C+Max" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Rawn, Max E</strong></p><p>Associate</p><p>Corporate & Finance: Finance</p><p>LA 2846</p><p>x15654</p><p>d: 213-955-5654</p><p>Assistant: Richter, Stephanie x12319</p><p>Timekeeper #: 2256</p></td><td>&nbsp</td></tr></table></div>' },
    o2842 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/ntampinco.jpg" alt="Tampinco%2C+Neil" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Tampinco, Neil O.</strong></p><p>Docket Manager</p><p>Administration</p><p>LA 2842</p><p>x15575</p><p>d: (213) 955-5575</p><p>Timekeeper #: 2099</p></td><td>&nbsp</td></tr></table></div>' },
    o2839 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/E439279A52834EC396D76CB62BEF086E.ashx" alt="Stevens%2C+Pauline" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Stevens, Pauline M.</strong></p><p>Partner</p><p>Corporate & Finance: Finance</p><p>LA 2839</p><p>x15606</p><p>d: (213) 955-5606</p><p>Assistant: Richter, Stephanie x12319</p><p>Timekeeper #: 2096</p></td><td>&nbsp</td></tr></table></div>' },
    o2838 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/E5C0FFF772324A6AA8843931F395D1D2.ashx" alt="Perry%2C+Patrick" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Perry, Patrick A.</strong></p><p>Partner</p><p>Real Estate: Land Use</p><p>LA 2838</p><p>x15504</p><p>d: (213) 955-5504</p><p>Assistant: Rogers, Sharon x12324</p><p>Timekeeper #: 1165</p></td><td>&nbsp</td></tr></table></div>' },
    o2837 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/jnittel.jpg" alt="Nittel%2C+Jason" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Nittel, Jason A</strong></p><p>Director, Litigation Technology and Support</p><p>Technology</p><p>LA 2837</p><p>x15630</p><p>d: 213-955-5630</p><p>m: 310-990-6363</p><p>Assistant: Dallow, Holly x12308</p><p>Timekeeper #: 2284</p></td><td>&nbsp</td></tr></table></div>' },
    o2836 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://allenmatkins.com/~/media/83FD3E0EFB554D6EAE0379074AE9F335.jpg" alt="Young%2C+Marc+" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Young, Marc  D</strong></p><p>Partner</p><p>Real Estate: General</p><p>LA 2836</p><p>x15619</p><p>d: 213-955-5619</p><p>Assistant: Hodges, Laura x12316</p><p>Timekeeper #: 2317</p></td><td>&nbsp</td></tr></table></div>' },
    o2835 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/kdixon.jpg" alt="Dixon%2C+Kevin" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Dixon, Kevin C.</strong></p><p>Senior Manager, Marketing and Business Development</p><p>Marketing</p><p>LA 2835</p><p>x15547</p><p>d: 213-955-5547</p><p>Assistant: Dallow, Holly x12308</p><p>Timekeeper #: 2230</p></td><td>&nbsp</td></tr></table></div>' },
    o2831 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://allenmatkins.com/~/media/E175527CCA7C4CED9F4626E2FD7992C6.jpg" alt="Lee%2C+Karen" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Lee, Karen S.</strong></p><p>Associate</p><p>Real Estate: General</p><p>LA 2831</p><p>x15629</p><p>d: 213-955-5629</p><p>Assistant: Miyatake, Mari x12312</p><p>Timekeeper #: 2282</p></td><td>&nbsp</td></tr></table></div>' },
    o2830 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/CA8CABE446B4432B86DB71EC724E9A79.ashx" alt="Goldstein%2C+Hadar" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Goldstein, Hadar Gonen</strong></p><p>Senior Counsel</p><p>Real Estate: General</p><p>LA 2830</p><p>x15562</p><p>d: (213) 955-5562</p><p>Assistant: Miyatake, Mari x12312</p><p>Timekeeper #: 2145</p></td><td>&nbsp</td></tr></table></div>' },
    o2829 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/918E80AB0D1E47F0AE9820539D58595A.ashx" alt="Richmond%2C+Jillian" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Richmond, Jillian J.</strong></p><p>Associate</p><p>Real Estate: General</p><p>LA 2829</p><p>x15553</p><p>d: 213-955-5553</p><p>Assistant: Ramirez, Evelyn x12343</p><p>Timekeeper #: 2192</p></td><td>&nbsp</td></tr></table></div>' },
    o2827 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/nmartinez.jpg" alt="Martinez%2C+Natalie" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Martinez, Natalie </strong></p><p>Manager, Recruiting and Professional Development</p><p>Recruiting</p><p>LA 2827</p><p>x15574</p><p>d: 213-955-5574</p><p>Timekeeper #: 2375</p></td><td>&nbsp</td></tr></table></div>' },
    o2826 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/28AFE511AA174FB6BD42A38ECC50A962.ashx" alt="Cerrina%2C+Michael" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Cerrina, Michael H. (Mike)</strong></p><p>Partner</p><p>Real Estate: General</p><p>LA 2826</p><p>x15600</p><p>d: (213) 955-5600</p><p>Assistant: Miyatake, Mari x12312</p><p>Timekeeper #: 1562</p></td><td>&nbsp</td></tr></table></div>' },
    o2823 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/A5FCC5F006A04B6484162530D1161D8B.ashx" alt="Jarrell%2C+Charles" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Jarrell, Charles D. (Chuck)</strong></p><p>Partner</p><p>Litigation: General</p><p>LA 2823</p><p>x15635</p><p>d: (213) 955-5635</p><p>Assistant: Finnerty, Patricia x12398</p><p>Timekeeper #: 1088</p></td><td>&nbsp</td></tr></table></div>' },
    o2822 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://allenmatkins.com/~/media/095AB385EB8E4576A201241EC95F303A.jpg" alt="Miller%2C+O%27Malley" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Miller, O\'Malley M.</strong></p><p>Partner</p><p>Real Estate: General</p><p>LA 2822</p><p>x15580</p><p>d: 213-955-5580</p><p>Assistant: Hodges, Laura x12316</p><p>Timekeeper #: 2303</p></td><td>&nbsp</td></tr></table></div>' },
    o2821 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/D950F091851E494CA4D794AE16E56E97.ashx" alt="Murphy%2C+Erin" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Murphy, Erin L.</strong></p><p>Partner</p><p>Real Estate: General</p><p>LA 2821</p><p>x15622</p><p>d: (213) 955-5622</p><p>Assistant: Ramirez, Evelyn x12343</p><p>Timekeeper #: 1744</p></td><td>&nbsp</td></tr></table></div>' },
    o2817 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/80909EBE162C425FA718A1BC123102AF.ashx" alt="McGinity%2C+Timothy" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>McGinity, Timothy B. (Tim)</strong></p><p>Partner</p><p>Litigation: General</p><p>LA 2817</p><p>x15587</p><p>d: (213) 955-5587</p><p>Assistant: Finnerty, Patricia x12398</p><p>Timekeeper #: 1182</p></td><td>&nbsp</td></tr></table></div>' },
    o2816 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/00E8AC034ACF43768C7B3BF8223E5C2C.ashx" alt="Gluck%2C+Neil" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Gluck, Neil N.</strong></p><p>Partner</p><p>Real Estate: General</p><p>LA 2816</p><p>x15612</p><p>d: (213) 955-5612</p><p>Assistant: Ramirez, Evelyn x12343</p><p>Timekeeper #: 1573</p></td><td>&nbsp</td></tr></table></div>' },
    o2815 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/87DB448BB28147E2ADA4B682D12A3578.ashx" alt="Farenbaugh%2C+Steven" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Farenbaugh, Steven M. (Steve)</strong></p><p>Associate</p><p>Real Estate: General</p><p>LA 2815</p><p>x15645</p><p>d: (213) 955-5645</p><p>Assistant: Ramirez, Evelyn x12343</p><p>Timekeeper #: 2148</p></td><td>&nbsp</td></tr></table></div>' },
    o2813 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/dfreedman.jpg" alt="Freedman%2C+Danielle" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Freedman, Danielle </strong></p><p>Associate</p><p>Real Estate: General</p><p>LA 2813</p><p>x15616</p><p>d: 213-955-5616</p><p>Assistant: Dallow, Holly x12308</p><p>Timekeeper #: 2304</p></td><td>&nbsp</td></tr></table></div>' },
    o2812 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://www.allenmatkins.com/~/media/B9F5F1D236B64509969E9902AAD23CF3.ashx" alt="Bernard%2C+Martha" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Bernard, Martha </strong><img class="icon" title="CPR Certified" alt="CPR Certified" src="Styles/Basic/Images/cpr.gif"></p><p>Director of Administration</p><p>Administration</p><p>LA 2812</p><p>x15554</p><p>d: (213) 955-5554</p><p>Timekeeper #: 152</p></td><td>&nbsp</td></tr></table></div>' },
    o2845 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/cnguyen.jpg" alt="Nguyen%2C+Cathy" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Nguyen, Cathy </strong></p><p>Library Assistant</p><p>Library</p><p>LA 2845</p><p>x15674</p><p>Timekeeper #: 1249</p></td><td>&nbsp</td></tr></table></div>' },
    o2857B = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/shanks.jpg" alt="Hanks%2C+Stephanie" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Hanks, Stephanie A.</strong><img class="icon" title="Notary" alt="Notary" src="Styles/Basic/Images/np.gif"><img class="icon" title="CPR Certified" alt="CPR Certified" src="Styles/Basic/Images/cpr.gif"></p><p>Legal Secretary</p><p>Administration</p><p>LA 2857-B</p><p>x12317</p><p>Supports: Chu, Jessica<br>Ertman, Matthew<br>Hall, Debra<br>Henning, Thomas<br></p><p>Timekeeper #: 1927</p></td><td>&nbsp</td></tr></table></div>' },
    o2857A = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/hdallow.jpg" alt="Dallow%2C+Holly" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Dallow, Holly </strong></p><p>Legal Secretary</p><p>Administration</p><p>LA 2857-A</p><p>x12308</p><p>Supports: Allen, Frederick<br>Dixon, Kevin<br>Freedman, Danielle<br>Mallory, Richard<br>Nittel, Jason<br></p><p>Timekeeper #: 1741</p></td><td>&nbsp</td></tr></table></div>' },
    o2832D = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/mmiyatake.jpg" alt="Miyatake%2C+Mari" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Miyatake, Mari C.</strong></p><p>Legal Secretary</p><p>Administration</p><p>LA 2832-D</p><p>x12312</p><p>Supports: Cerrina, Michael<br>Goldstein, Hadar<br>Lee, Karen<br>Stone, David<br></p><p>Timekeeper #: 244</p></td><td>&nbsp</td></tr></table></div>' },
    o2832B = {tooltip: '<div class="toolbio"><table><tr><td><img class="photo" src="http://marketing/utils/img/personnel/lhodges.jpg" alt="Hodges%2C+Laura" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Hodges, Laura L.</strong></p><p>Legal Secretary</p><p>Administration</p><p>LA 2832-B</p><p>x12316</p><p>Supports: Etheredge, Stephen<br>Miller, O\'Malley<br>Shapiro, Maxwell<br>Young, Marc <br></p><p>Timekeeper #: 2309</p></td><td><img class="photo" src="http://marketing/utils/img/personnel/hdeleon.jpg" alt="De+Leon%2C+Hector" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>De Leon, Hector </strong></p><p>Recruiting Assistant</p><p>Recruiting</p><p>LA 2832-B</p><p>x15581</p><p>d: 213-955-5581</p><p>Timekeeper #: 2377</p></td></tr></table></div>' },
    o2832A = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/srichter.jpg" alt="Richter%2C+Stephanie" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Richter, Stephanie A.</strong></p><p>Legal Secretary</p><p>Administration</p><p>LA 2832-A</p><p>x12319</p><p>Supports: Kraus, Katherine<br>Obico, Paul<br>Rawn, Max<br>Stevens, Pauline<br>Witlen, Alan<br></p><p>Timekeeper #: 2308</p></td><td>&nbsp</td></tr></table></div>' },
    o2819D = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/pfinnerty.jpg" alt="Finnerty%2C+Patricia" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Finnerty, Patricia M.</strong></p><p>Legal Secretary</p><p>Administration</p><p>LA 2819-D</p><p>x12398</p><p>Supports: Jarrell, Charles<br>McGinity, Timothy<br>Thorbourne, Alana<br></p><p>Timekeeper #: 1438</p></td><td>&nbsp</td></tr></table></div>' },
    o2819C = {tooltip: '<div class="toolbio"><table><tr><td><img class="photo" src="http://marketing/utils/img/personnel/ktaylor.jpg" alt="Taylor%2C+Karin" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Taylor, Karin L. (Kaadi)</strong></p><p></p><p>Word Processing</p><p>LA 2819-C</p><p>x12441</p><p>Timekeeper #: 2313</p></td><td><img class="photo" src="http://marketing/utils/img/personnel/arussell.jpg" alt="Guild%2DRussell%2C+Angela" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Guild-Russell, Angela </strong></p><p>Word Processor</p><p>Word Processing</p><p>LA 2819-C</p><p>x12403</p><p>Timekeeper #: 2147</p></td></tr></table></div>' },
    o2819B = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/eramirez.jpg" alt="Ramirez%2C+Evelyn" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Ramirez, Evelyn R.</strong></p><p>Legal Secretary</p><p>Administration</p><p>LA 2819-B</p><p>x12343</p><p>Supports: Farenbaugh, Steven<br>Gluck, Neil<br>Murphy, Erin<br>Richmond, Jillian<br></p><p>Timekeeper #: 267</p></td><td>&nbsp</td></tr></table></div>' },
    o2819A = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/lwilliams.jpg" alt="Williams%2C+Lecie" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Williams, Lecie A.</strong></p><p>Word Processor Coordinator</p><p>Word Processing</p><p>LA 2819-A</p><p>x12485</p><p>Timekeeper #: 1029</p></td><td>&nbsp</td></tr></table></div>' },
    o2801 = {tooltip: '<div class="toolbio"><table><td><img class="photo" src="http://marketing/utils/img/personnel/jgarcia.jpg" alt="Garcia%2C+Josephine" onerror="imgMissing(this)" /></td><td class="biotd"><p><strong>Garcia, Josephine C. (Josie)</strong></p><p>Receptionist</p><p>Administration</p><p>LA 2801</p><p>x10000</p><p>Timekeeper #: 1457</p></td><td>&nbsp</td></tr></table></div>' },
    o2878 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2878" onerror="imgMissing2(this)" /></td></tr><tr><td>Storage</td></tr></table></div>'},
    o2853 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2853" onerror="imgMissing2(this)" /></td></tr><tr><td><strong><center>GRIFFITH OBSERVATORY</strong></center></td></tr></table></div>'},
    o2841 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2841" onerror="imgMissing2(this)" /></td></tr><tr><td><STRONG><CENTER>UNIVERSAL CITY</CENTER></STRONG></td></tr></table></div>'},
    o2825 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2825" onerror="imgMissing2(this)" /></td></tr><tr><td>GRAND CENTRAL MARKET</td></tr></table></div>'},
    o2818 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2818" onerror="imgMissing2(this)" /></td></tr><tr><td>UNION STATION</td></tr></table></div>'},
    o2814 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2814" onerror="imgMissing2(this)" /></td></tr><tr><td>Guest Office 2814</td></tr></table></div>'},
    o2808 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2808" onerror="imgMissing2(this)" /></td></tr><tr><td>PANTRY</td></tr></table></div>'},
    o2805 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2805" onerror="imgMissing2(this)" /></td></tr><tr><td><strong><center>WATTS TOWER</strong></center></td></tr></table></div>'},
    o2804 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2804" onerror="imgMissing2(this)" /></td></tr><tr><td><strong><center>HOLLYWOOD BOWL</strong></center></td></tr></table></div>'},
    o2803 = {tooltip: '<div class="toolroom"><table><tr><td><img src="MapSVG/maps/" alt="o2803" onerror="imgMissing2(this)" /></td></tr><tr><td><strong><center>L.A. LIVE</strong></center></td></tr></table></div>'}
    this.regions = [o2859, o2855, o2854, o2852, o2850, o2849, o2848, o2847, o2846, o2842, o2839, o2838, o2837, o2836,
      o2835, o2831, o2830, o2829, o2827, o2826, o2823, o2822, o2821, o2817, o2817, o2816, o2815, o2813, o2812, o2845,
      o2857B, o2857A, o2832D, o2832B, o2832A, o2819D, o2819C, o2819B, o2819A, o2801, o2878, o2853, o2841, o2825,
      o2818, o2814, o2808, o2805, o2804, o2803    
    ]
  }; 
  
  showconsole(obj){
    var keys = [];
    for(var key in obj){
    console.log(key," ",obj[key]);
    }
  }
  
  

}
