import { Component, effect, inject, signal } from '@angular/core';
import { BrandService } from '@brands/services/brand/brand.service';
import { Image, InputText, InputTextarea, Label, Spinner, Switch } from '@shared/components';
import { FormDivider } from '@shared/components/ui/form-divider/form-divider';
import { IDialogComponent } from '@shared/components/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/components/ui/dialog/models/dialog-ref.model';
import { Brand } from '@shared/models';

@Component({
    selector: 'ecom-brand-details.dialog',
    imports: [Label, InputText, Image, InputTextarea, Switch, FormDivider, Spinner],
    templateUrl: './brand-details.dialog.html',
    styleUrl: './brand-details.dialog.css',
    providers: [BrandService],
})
export class BrandDetailsDialog implements IDialogComponent<string, void> {
    private readonly brandService: BrandService = inject(BrandService);

    readonly brand = signal<Brand | null>(null);
    readonly isLoading = signal(false);
    private readonly brandId = signal<string>('');

    constructor() {
        effect(() => {
            const brandId = this.brandId();
            if (brandId) {
                this.loadBrandDetails(brandId);
            }
        });
    }

    private loadBrandDetails(brandId: string): void {
        this.brand.set(null);
        this.isLoading.set(true);

        this.brandService.getBrandById(brandId).subscribe({
            next: (response) => {
                this.brand.set(response.data);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.isLoading.set(false);
                console.error('Error loading brand details:', error);
            },
        });
    }

    setDialogRef(ref: DialogRef<string, void>): void {
        this.brandId.set(ref.data);
    }
}
