export class entradaInventariadoResponseDto {
    id: number;
    entrada: number;
    costo: number;
    fecha: Date;
}

export class inventarioResponseDto {
    id: number;
    codigo: string;
    clasificacionProducto: string;
    nombre_producto: string;
    unidad: string;
    inventario_inicial: number;
    costo_inicial: number;
    cantidad_actual: number;
    precio_actual: number;
    fecha: Date;
    entradaInventariado: entradaInventariadoResponseDto[];
}