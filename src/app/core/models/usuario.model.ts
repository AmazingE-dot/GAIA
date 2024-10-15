export class UsuarioModel {
    constructor(
      public readonly _id: string,
      public nombre: string,
      public apellido1: string,
      public apellido2: string,
      public password: string,
      public rol: string,
      public tipoDocumento: string,
      public documento: string,
      public correo: string,
      public celular: number,
      public tipoCarrera: string,
      public modalidad: string,
      public carrera: string,
    //   public fechaNacimiento: Date,
      public idEstu: number
    ) {}
  }