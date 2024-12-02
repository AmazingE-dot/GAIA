import { MateriaModel } from "./materia.model";

export class PensumModel {
  constructor(
    public readonly _id: string,
    public nombre: string,
    public facultad: string,
    public materiaCodigo: Array<{
      _id: string;
      nombre: string;
      materiaCodigo: string;
      curso: string;
      seccion: number;
      semestre: number;
      creditos: number;
    }>,
    public idPensum: string,
    public semestresTotales: number,
    public creditosTotales: number,
    public createdAt?: Date
  ) {}
}

export interface PensumResponse {
  pensum: {
    _id: string;
    nombre: string;
    facultad: string;
    materiaCodigo: string[];
    idPensum: string;
    semestresTotales: number;
    creditosTotales: number;
    createdAt: string;
  };
}

export interface MateriasResponse {
  materias: MateriaModel[];
}