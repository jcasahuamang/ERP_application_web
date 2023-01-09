export class JwtDTO {
  token: string;
  type: string;
  idCliente: number;
  idUsuario: number;
  nombreUsuario: string;
  nombreCompleto: string;
  authorities: string[];
}
