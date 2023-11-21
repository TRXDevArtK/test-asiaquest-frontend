export interface TaskInterface { //set everything to optional
    id: number;
    description?: string;
    complete_at?: Date;
    order?: number;
}
