declare module React {
    export module addons {
        export function classSet(obj: any): string;
    }
}


declare module 'react/addons' {
    export = React
}