export class EmpleadoResponseDto {
    id: number;
    codigo_empleado: string;
    tipoEmpelado: string;
    nombre_Empleado: string;
    telefono: string;
    region_origen: string;
    acompanantes?: number;
    observaciones: string;
    fecha_creacion: string;
    usuario_creacion: string;
    fecha_modificacion: string;
    usuario_modificacion: string;
}