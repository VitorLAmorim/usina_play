export interface Program {
  _id: string;
  image: string;
  title: string;
  description: string;
  status: 'STARTED' | 'COMPLETED' | 'NEW' | 'VISUALIZED';
}
