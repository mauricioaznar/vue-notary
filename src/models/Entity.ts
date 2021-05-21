export interface Entity {
    id: number;
    entity_id: number;
    entity_name: string;
    entity_display: string;
    group_id: number | null;
    entity_enabled: boolean | null;
}