import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialComponentRoutingModule } from './material-component-routing.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MatiereComponent } from './matiere/matiere.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordDialogComponent } from './dialog/change-password-dialog/change-password-dialog.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { MatiereDialogComponent } from './dialog/matiere-dialog/matiere-dialog.component';
import { MaterialModule } from '../../shared/material.module';
import { ClasseComponent } from './classe/classe.component';
import { EnseignantComponent } from './enseignant/enseignant.component';
import { UserComponent } from './user/user.component';
import { CoursComponent } from './cours/cours.component';
import { EmploiComponent } from './emploi/emploi.component';
import { LemploiComponent } from './lemploi/lemploi.component';
import { AbsenceComponent } from './absence/absence.component';
import { LabsenceComponent } from './labsence/labsence.component';
import { NoteComponent } from './note/note.component';
import { LnoteComponent } from './lnote/lnote.component';
import { TarifsComponent } from './tarifs/tarifs.component';
import { ReglementComponent } from './reglement/reglement.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { AppreciationComponent } from './appreciation/appreciation.component';
import { AnneScolaireComponent } from './anne-scolaire/anne-scolaire.component';
import { NotificationComponent } from './notification/notification.component';
import { JoursComponent } from './jours/jours.component';
import { HoraireComponent } from './horaire/horaire.component';
import { EnseignantDialogComponent } from './dialog/enseignant-dialog/enseignant-dialog.component';
import { TarifsDialogComponent } from './dialog/tarifs-dialog/tarifs-dialog.component';


@NgModule({
  declarations: [
    ConfirmationComponent,
    ChangePasswordComponent,
    MatiereComponent,
    ConfirmationComponent,
    MatiereDialogComponent,
    ConfirmationDialogComponent,
    ChangePasswordDialogComponent,
    ClasseComponent,
    EnseignantComponent,
    UserComponent,
    CoursComponent,
    EmploiComponent,
    LemploiComponent,
    AbsenceComponent,
    LabsenceComponent,
    NoteComponent,
    LnoteComponent,
    TarifsComponent,
    ReglementComponent,
    InscriptionComponent,
    AppreciationComponent,
    AnneScolaireComponent,
    NotificationComponent,
    JoursComponent,
    HoraireComponent,
    EnseignantDialogComponent,
    TarifsDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialComponentRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MaterialModule
  ]
})
export class MaterialComponentModule { }
