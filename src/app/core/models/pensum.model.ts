export interface PensumModel {
  _id: string;
  nombre: string; 
  facultad: string; 
  materiaCodigo: string[];
  idPensum: string; 
  creditosTotales: number;
  createdAt?: Date;
}