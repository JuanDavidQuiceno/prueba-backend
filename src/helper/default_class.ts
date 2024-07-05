/* eslint-disable @typescript-eslint/no-explicit-any */
export class SuccessClass {
    message: string;
    data: any;
    error: boolean;

    constructor(message?: string, data?: any) {
        this.message = message ? message : "success";
        this.data = data;
        this.error = false;
    }
}

export class ErrorClass {
    // message puede ser un string o un objeto
    message: string | object;
    data: any;
    error: boolean;

    // si message es un string, data es un objeto
    // si message es un objeto, data es un string
    constructor(message?: string | object, data?: any) {
        this.message = message ? message : "error";
        this.data = data;
        this.error = true;
    }
}

export class AlertErrorClass {
    // message puede ser un string o un objeto
    title: string;
    content: any;
    error: boolean;

    // si message es un string, data es un objeto
    // si message es un objeto, data es un string
    constructor(title?: string, content?: any) {
        this.title = title ? title : "Error";
        this.content = content;
        this.error = true;
    }
}