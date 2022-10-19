import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList()

  constructor() { }

  ngAfterContentInit(): void {
    this.tabs.first.activateTab()
  }

  activateTab(tab: TabComponent): boolean {
    this.tabs.forEach(elem => elem.isActive = false)

    tab.activateTab()

    return false
  }

}
