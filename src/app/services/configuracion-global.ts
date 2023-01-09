
export class Configuracion{

   public endPoints: Map<string, string> = new Map(
    [
    ["Root", "http://localhost:8060"],
    ["Sistema", "sistema"],
    ["Auth", "auth"],
    ["Shared", "shared"],
    ["Compania", "compania"],
    ["Sede", "sede"],
    ["CCosto", "ccosto"],
    ["Almacen", "almacen"],
    ["Entidad", "entidad"],
    ["EntidadContacto", "entidadContacto"],
    ["EntidadTipo", "entidadTipo"],
    ["Tabla", "tabla"],
    ["TablaDet", "tabladet"],
    ["TipoTransaccion", "tipotransaccion"],
    ["Email", "email"]
    ]
   );


 // endPointRoot = this.endPoints.get("Root");

}
