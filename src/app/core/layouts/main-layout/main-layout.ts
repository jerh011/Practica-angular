import { Component, inject, OnInit } from '@angular/core';
import { Sidebar } from '../../../shared/component/sidebar';
import { SidebarService } from '../../../shared/component/services/sidebar/sidebar-service';

import {
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ecom-main-layout',
  imports: [Sidebar, NgClass, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  host: {
    class: '',
  },
  providers: [SidebarService],
})
export class MainLayout implements OnInit {
  sidebarService: SidebarService = inject(SidebarService);

  isOpenSidebar = this.sidebarService.isOpen;

  toggleSidebar = () => this.sidebarService.toggle();

  ngOnInit(): void {
    this.sidebarService.options.set([
      {
        label: 'Catálogos',
        href: '/catalogs',
        icon: faBookOpen,
      },
    ]);
  }
}
