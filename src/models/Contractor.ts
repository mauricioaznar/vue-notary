export interface Contractor {
    id?: number;
    contractor_id: number;
    contractor_name: string;
    workforce_name: string;
    enabled: boolean;
    require_mileage: boolean;
    employee_type: string;
    employee_type_id: number | null;
    pto_accrues_on: Date;
    cutoff_ts: Date;
    mgmt_ts: Date | string;
    pay_day: Date;
    export_csv: boolean;
    export_distribution: string;
    export_pivot: boolean;
    personal_mileage: boolean;
    daily_ot: boolean;
}