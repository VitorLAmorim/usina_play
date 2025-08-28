import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, addDoc } from '@angular/fire/firestore';

import {Notification} from "../models/notification.model";
import {Program} from "../models/program.model";

@Injectable({
  providedIn: 'root'
})
export class DataInitializerService {
  private firestore = inject(Firestore);

  private sampleNotifications: Omit<Notification, '_id'>[] = [
    {
      title: 'Novo treino',
      description: 'Novo treino disponível',
      read: false,
      timestamp: new Date()
    },
    {
      title: 'Novo conteúdo',
      description: 'Novo conteúdo disponível',
      read: false,
      timestamp: new Date()
    },
    {
      title: 'Promoção',
      description: 'Desconto 10% plano anual',
      read: true,
      timestamp: new Date()
    }
  ];

  private samplePrograms: Omit<Program, '_id'>[] = [
    {
      image: 'assets/images/aquecimento.jpg',
      title: 'AQUECIMENTO',
      description: 'Exercícios leves para preparar seu corpo e aumentar a circulação antes do treino principal.',
      status: 'NEW'
    },
    {
      image: 'assets/images/ioga.jpg',
      title: 'YOGA EXPERIENCE',
      description: 'Sessão de yoga focada em alongamento, respiração e equilíbrio para relaxar a mente e o corpo.',
      status: 'VISUALIZED'
    },
    {
      image: 'assets/images/corrida.jpg',
      title: 'CORRIDA',
      description: 'Treino de corrida para melhorar resistência cardiovascular e queimar calorias de forma eficiente.',
      status: 'STARTED'
    },
    {
      image: 'assets/images/musculacao.jpg',
      title: 'LEVANTAMENTO DE PESO',
      description: 'Treino de força com pesos para desenvolver músculos, aumentar a resistência e definir o corpo.',
      status: 'NEW'
    }
  ];

  async initializeData() {
    await this.initializeNotifications();
    await this.initializeSlides();
  }

  private async initializeNotifications() {
    const notificationsRef = collection(this.firestore, 'notifications');
    const snapshot = await getDocs(notificationsRef);

    if (snapshot.empty) {
      for (const notification of this.sampleNotifications) {
        await addDoc(notificationsRef, notification);
      }
    }
  }

  private async initializeSlides() {
    const programsRef = collection(this.firestore, 'programs');
    const snapshot = await getDocs(programsRef);

    if (snapshot.empty) {
      for (const program of this.samplePrograms) {
        await addDoc(programsRef, program);
      }
    }
  }
}
