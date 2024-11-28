export class PensumModel {
  constructor(
    public readonly _id: string,
    public nombre: string,
    public facultad: string, 
    public materiaCodigo: string[],
    public idPensum: string,
    public semestresTotales: number,
    public creditosTotales: number,
    public createdAt?: Date,
  ){}
 
}
