import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs } from '@angular/fire/firestore';
import { Observable, from, map, BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';
import {Program} from "../models/program.model";

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private firestore = inject(Firestore);
  private notificationService = inject(NotificationService);

  private programsSubject = new BehaviorSubject<Program[]>([]);
  carouselObservable: Observable<Program[]> = this.programsSubject.asObservable();

  constructor() {
    this.loadPrograms();
  }

  private async loadPrograms() {
    const programsRef = collection(this.firestore, 'programs');
    const querySnapshot = await getDocs(programsRef);

    const programs: Program[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data() as Omit<Program, '_id'>;
      programs.push({ _id: doc.id, ...data });
    });

    this.programsSubject.next(programs);
  }

  getPrograms(): Observable<Program[]> {
    return this.carouselObservable;
  }

  createProgram(title: string,description: string, image: string = 'assets/images/aquecimento.jpg'): Observable<Program> {
    const programsRef = collection(this.firestore, 'programs');
    const newProgram: Omit<Program, '_id'> = {
      title,
      image,
      description,
      status: 'NEW'
    };

    return from(addDoc(programsRef, newProgram)).pipe(
      map(docRef => {
        const program: Program = {
          _id: docRef.id,
          ...newProgram
        };

        const currentPrograms = this.programsSubject.value;
        this.programsSubject.next([...currentPrograms, program]);

        this.notificationService.createNotification('Novo treino disponível', `Treino ${description} disponível`).subscribe();

        return program;
      })
    );
  }

  updateProgramStatus(id: string, status: 'STARTED' | 'COMPLETED' | 'NEW' | 'VISUALIZED'): Observable<void> {
    const programRef = doc(this.firestore, 'programs', id);

    return from(updateDoc(programRef, { status })).pipe(
      map(() => {
        const currentPrograms = this.programsSubject.value;
        const updatedPrograms = currentPrograms.map(program => {
          if (program._id === id) {
            return { ...program, status };
          }
          return program;
        });
        this.programsSubject.next(updatedPrograms);

        const program = currentPrograms.find(p => p._id === id);
        if (program) {
          if (status === 'STARTED') {
            this.notificationService.createNotification('Treino iniciado', `Treino ${program.description} iniciado`).subscribe();
          } else if (status === 'COMPLETED') {
            this.notificationService.createNotification('Treino concluído', `Treino ${program.description} concluído`).subscribe();
          }
        }
      })
    );
  }

  startProgram(id: string): Observable<void> {
    return this.updateProgramStatus(id, 'STARTED');
  }

  completeProgram(id: string): Observable<void> {
    return this.updateProgramStatus(id, 'COMPLETED');
  }

  visualizeProgram(id: string): Observable<void> {
    return this.updateProgramStatus(id, 'VISUALIZED');
  }

  deleteProgram(id: string): Observable<void> {
    const programRef = doc(this.firestore, 'programs', id);

    return from(deleteDoc(programRef)).pipe(
      map(() => {
        const currentPrograms = this.programsSubject.value;
        const updatedPrograms = currentPrograms.filter(program => program._id !== id);
        this.programsSubject.next(updatedPrograms);
      })
    );
  }
}
