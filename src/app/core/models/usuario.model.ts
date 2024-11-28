export class ProfesorModel {
  constructor(
    public readonly _id: string,
    public nombre: string,
    public apellido1: string,
    public apellido2: string
  ) {}
}

export class CarreraUsuarioModel {
  constructor(
    public readonly _id: string,
    public nombre: string
  ) {}
}

export class HorarioClaseModel {
  constructor(
    public readonly _id: string,
    public dia: string,
    public horaEntrada: string,
    public horaSalida: string
  ) {}
}

export class MateriaCodigoModel {
  constructor(
    public readonly _id: string,
    public nombre: string,
    public curso: string,
    public seccion: number,
    public semestre: number,
    public creditos: number
  ) {}
}

export class HorarioModel {
  constructor(
    public readonly _id: string,
    public sede: string,
    public nrc: number,
    public profesor: ProfesorModel,
    public horarioClase: HorarioClaseModel[],
    public materiaCodigo: MateriaCodigoModel
  ) {}
}

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
    public carrera: CarreraUsuarioModel[],
    public idEstu: number,
    public creditosAdquiridos: number,
    public createdAt: Date,
    public token: string,
    public horario: HorarioModel[],
    public fechaNacimiento?: Date
  ) {}
}
