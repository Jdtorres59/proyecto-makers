// Metro (con la configuración de Expo) soporta require.context; TypeScript no lo conoce.
interface RequireContext {
  keys(): string[];
  (id: string): any;
}
declare namespace NodeJS {
  interface Require {
    context(directorio: string, recursivo?: boolean, filtro?: RegExp): RequireContext;
  }
}
