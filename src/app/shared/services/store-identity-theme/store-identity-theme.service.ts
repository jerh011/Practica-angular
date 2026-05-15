import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environtment.development';
import type { IdentityStoreSettingsDto } from '@ecommerce-ma/shared/contracts/store-settings/dto/output/identity-store-settings.dto';
import type { ApiResponse } from '@shared/interfaces';

type IdentityThemePalette = {
  primaryColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
};

const DEFAULT_THEME: IdentityThemePalette = {
  primaryColorHex: '#3B82F6',
  secondaryColorHex: '#1698B8',
  accentColorHex: '#F59E0B',
};

@Injectable({
  providedIn: 'root',
})
export class StoreIdentityThemeService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly hasLoaded = signal(false);
  private readonly isLoading = signal(false);

  ensureLoaded(): void {
    if (this.hasLoaded() || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.http
      .get<ApiResponse<IdentityStoreSettingsDto | null>>(
        `${environment.apiUrl}/store-settings/identity`,
      )
      .subscribe({
        next: ({ data }) => {
          this.applyTheme(data ?? DEFAULT_THEME);
          this.hasLoaded.set(true);
          this.isLoading.set(false);
        },
        error: () => {
          this.applyTheme(DEFAULT_THEME);
          this.hasLoaded.set(true);
          this.isLoading.set(false);
        },
      });
  }

  private applyTheme(settings: Partial<IdentityThemePalette>): void {
    const palette: IdentityThemePalette = {
      primaryColorHex: settings.primaryColorHex || DEFAULT_THEME.primaryColorHex,
      secondaryColorHex:
        settings.secondaryColorHex || DEFAULT_THEME.secondaryColorHex,
      accentColorHex: settings.accentColorHex || DEFAULT_THEME.accentColorHex,
    };

    const root = this.document.documentElement;
    root.style.setProperty('--inventory-primary', palette.primaryColorHex);
    root.style.setProperty(
      '--inventory-primary-soft',
      this.toAlpha(palette.primaryColorHex, 0.14),
    );
    root.style.setProperty(
      '--inventory-primary-softer',
      this.toAlpha(palette.primaryColorHex, 0.08),
    );
    root.style.setProperty('--inventory-secondary', palette.secondaryColorHex);
    root.style.setProperty(
      '--inventory-secondary-soft',
      this.toAlpha(palette.secondaryColorHex, 0.14),
    );
    root.style.setProperty('--inventory-accent', palette.accentColorHex);
    root.style.setProperty(
      '--inventory-accent-soft',
      this.toAlpha(palette.accentColorHex, 0.14),
    );
    root.style.setProperty(
      '--inventory-divider',
      this.toAlpha(palette.primaryColorHex, 0.16),
    );
    root.style.setProperty('--inventory-neutral-soft', '#cbd5e1');
  }

  private toAlpha(hex: string, alpha: number): string {
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) {
      return hex;
    }

    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
}
