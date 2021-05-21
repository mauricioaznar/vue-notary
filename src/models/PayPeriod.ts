export interface PayPeriod {
    payperiod_id: number;
    contractor_id: number;
    start_date: Date;
    end_date: Date;
    cutoff_ts: Date;
    mgmt_cutoff_ts: Date;
    pay_day: Date;
}