export class ventaResponseDto {
    id: number;
    codigoEmpleado: string;
    nombreEmpleado: string;
    cantidadUnidad?: number;
    idProducto: number;
    nombreProducto: string;
    precioSugerido?: number;
    montoTotal: number;
    pagoEfectivo: number;
    fechaCracion: string;
}