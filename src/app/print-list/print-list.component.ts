import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Rider {
    Name: string;
    Number: string;
    Class: string;
    Size: number | string;
    Date: string;
    isMinor: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Email?: string;
}

interface GroupedRiders {
    [key: string]: Rider[];
}

interface ClassCount {
    class: string;
    count: number;
}

type SortOption = 'alphabetical' | 'recent';

@Component({
    selector: 'app-print-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './print-list.component.html',
    styleUrl: './print-list.component.css'
})
export class PrintListComponent implements OnInit {
    public groupedRiders: GroupedRiders = {};
    public sortOptions: { value: SortOption; label: string }[] = [
        { value: 'alphabetical', label: 'Name (A-Z)' },
        { value: 'recent', label: 'Most Recent First' }
    ];
    public selectedSort: SortOption = 'alphabetical';
    private allRiders: Rider[] = [];

    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {
        this.loadRiders();
    }

    private loadRiders(): void {
        this.apiService.getRiderList().subscribe(res => {
            this.allRiders = res;
            this.applyGroupingAndSorting();
        });
    }

    public onSortChange(): void {
        this.applyGroupingAndSorting();
    }

    private applyGroupingAndSorting(): void {
        this.groupedRiders = this.groupRidersByDate(this.allRiders);
    }

    private groupRidersByDate(riders: Rider[]): GroupedRiders {
        const grouped = riders.reduce((acc: GroupedRiders, rider: Rider) => {
            const date = new Date(rider.Date).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(rider);
            return acc;
        }, {});

        this.sortRiderGroups(grouped);
        return grouped;
    }

    private sortRiderGroups(grouped: GroupedRiders): void {
        Object.keys(grouped).forEach(date => {
            if (this.selectedSort === 'alphabetical') {
                grouped[date].sort((a, b) => a.Name.localeCompare(b.Name));
            } else {
                // Sort by createdAt timestamp in descending order (most recent first)
                grouped[date].sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });
            }
        });
    }

    public getClassCounts(riders: Rider[]): ClassCount[] {
        const classMap = riders.reduce(
            (acc: { [key: string]: number }, rider: Rider) => {
                acc[rider.Class] = (acc[rider.Class] || 0) + 1;
                return acc;
            },
            {}
        );

        // Define the desired order
        const order = ['A/B', 'C', 'Mini', 'Jr Track'];

        return Object.entries(classMap)
            .map(([className, count]) => ({ class: className, count }))
            .sort((a, b) => {
                const indexA = order.indexOf(a.class);
                const indexB = order.indexOf(b.class);

                // If both classes are in the order array, sort by their index
                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }
                // If only a.class is in the order, it comes first
                if (indexA !== -1) return -1;
                // If only b.class is in the order, it comes first
                if (indexB !== -1) return 1;

                // If neither class is in the order, sort alphabetically
                return a.class.localeCompare(b.class);
            });
    }

    public printRiderList(date: string): void {
        const tableContent = document.getElementById(`riders-table-${date}`);
        const totalsSection = document.getElementById(`totals-section-${date}`);
        const sortMethod =
            this.selectedSort === 'alphabetical'
                ? 'Name (A-Z)'
                : 'Most Recent First';

        if (tableContent && totalsSection) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write(
                    '<html><head><title>Rider List</title>'
                );
                printWindow.document.write(
                    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">'
                );
                printWindow.document.write('<style>');
                printWindow.document.write(`
                    table { width: 100%; margin: 20px 0; }
                    th, td { padding: 8px; text-align: left; }
                    th { background-color: #f8f9fa; }
                    .totals-section { margin-top: 15px; padding: 10px; background-color: #f8f9fa; }
                    .totals-section h4 { font-size: 1.1rem; margin-bottom: 10px; }
                    .totals-section li { padding: 5px 0; }
                    .totals-section .grand-total { font-weight: 600; border-top: 1px solid #dee2e6; margin-top: 5px; padding-top: 10px; }
                    .print-header { margin-bottom: 15px; }
                    .print-header h2 { font-size: 1.5rem; margin-bottom: 5px; }
                    .print-header p { color: #666; }
                    @media print {
                        table { border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; }
                    }
                `);
                printWindow.document.write('</style>');
                printWindow.document.write('</head><body>');

                // Add print header with sorting info
                printWindow.document.write(`
                    <div class="print-header">
                        <h2>Rider List - ${new Date(
                            date
                        ).toLocaleDateString()}</h2>
                        <p>Sorted by: ${sortMethod}</p>
                    </div>
                `);

                printWindow.document.write(tableContent.outerHTML);
                printWindow.document.write(totalsSection.outerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();

                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            } else {
                console.error('Could not open print window');
            }
        } else {
            console.error(
                'Could not find table or totals section for date:',
                date
            );
            if (!tableContent) console.error('Table not found');
            if (!totalsSection) console.error('Totals section not found');
        }
    }
}
