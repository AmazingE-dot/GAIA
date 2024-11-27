
export class MateriaModel {
    constructor (
        public readonly _id: string,
        public nombre: string,
        public materiaCodigo: string,
        public curso: string,
        public seccion: number,
        public semestre: number,
        public creditos: number,
        public usuario: string, // ID del usuario relacionado
        public createdAt?: Date, // Opcional, ya que puede no ser necesario al crear una nueva materia
    ){}
  }
  