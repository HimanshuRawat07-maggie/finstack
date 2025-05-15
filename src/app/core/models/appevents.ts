/*
Class: AppEvent
Purpose: A class to hold app event data
Notes: App events are sent by components. Any other component can subscribe to these events and process them.
*/

export class AppEvent {
    id: Number;
    name: string;
    data: any;

    constructor(id: number, name: string, data: any) {
        this.id = id;
        this.name = name;
        this.data = data;
    }
}


