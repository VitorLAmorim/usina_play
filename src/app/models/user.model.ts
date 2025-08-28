export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userLevel: UserLevel;
}


export enum UserLevel {
  PURPLE = 'PURPLE',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  VIOLET = 'VIOLET'
}

export const UserLevelLabel = {
  PURPLE: 'Nível Roxo',
  ORANGE: 'Nível Laranja',
  YELLOW: 'Nível Amarelo',
  GREEN: 'Nível Verde',
  BLUE: 'Nível Azul',
  VIOLET: 'Nível Violeta'
}
