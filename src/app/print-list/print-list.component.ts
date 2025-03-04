import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

interface Rider {
    Name: string;
    Number: string;
    Class: string;
    Size: number;
    Date: string;
    isMinor: boolean;
}

interface GroupedRiders {
    [key: string]: Rider[];
}

interface ClassCount {
    class: string;
    count: number;
}

@Component({
    selector: 'app-print-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './print-list.component.html',
    styleUrl: './print-list.component.css'
})
export class PrintListComponent implements OnInit {
    public groupedRiders: GroupedRiders = {};

    constructor(private apiService: ApiService) {}

    public ngOnInit(): void {
        this.apiService.getRiderList().subscribe(res => {
            this.groupedRiders = this.groupRidersByDate(res);
        });
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

        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => a.Name.localeCompare(b.Name));
        });

        return grouped;
    }

    public getClassCounts(riders: Rider[]): ClassCount[] {
        const classMap = riders.reduce(
            (acc: { [key: string]: number }, rider: Rider) => {
                acc[rider.Class] = (acc[rider.Class] || 0) + 1;
                return acc;
            },
            {}
        );

        return Object.entries(classMap)
            .map(([className, count]) => ({ class: className, count }))
            .sort((a, b) => a.class.localeCompare(b.class));
    }

    public printRiderList(date: string): void {
        const tableContent = document.getElementById(`riders-table-${date}`);
        const totalsSection = document.getElementById(`totals-section-${date}`);

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
                    @media print {
                        table { border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; }
                    }
                `);
                printWindow.document.write('</style>');
                printWindow.document.write('</head><body>');
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
