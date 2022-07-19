import Dexie, { Table } from 'dexie';

export interface ClipProps {
  id?: number;
  text: string;
  date: Date;
};

export class CopyboardsDexie extends Dexie {
  clips!: Table<ClipProps>;

  constructor() {
    super('clipsDatabase');
    this.version(1).stores({
      clips: '++id, text, date',
    });
  }
}

export const db = new CopyboardsDexie();
