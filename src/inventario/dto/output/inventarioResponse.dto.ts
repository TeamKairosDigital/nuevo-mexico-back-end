export class entradaInventariadoResponseDto {
    id: number;
    entrada: number;
    costo: number;
    fecha: string;
}

export class inventarioResponseDto {
    id: number;
    codigo: string;
    clasificacionProducto: string;
    idClasificacionProducto?: number;
    nombre_producto: string;
    unidad: string;
    idUnidad?: number;
    inventario_inicial: number;
    costo_inicial: number;
    cantidad_actual: number;
    precio_actual: number;
    fecha: string;
    entradaInventariado: entradaInventariadoResponseDto[];
}