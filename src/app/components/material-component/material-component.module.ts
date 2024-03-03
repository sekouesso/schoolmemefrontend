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
import { EleveDialogComponent } from './dialog/eleve-dialog/eleve-dialog.component';
import { CycleDialogComponent } from './dialog/cycle-dialog/cycle-dialog.component';
import { EmploiDialogComponent } from './dialog/emploi-dialog/emploi-dialog.component';
import { NoteDialogComponent } from './dialog/note-dialog/note-dialog.component';
import { AbsenceDialogComponent } from './dialog/absence-dialog/absence-dialog.component';
import { AppreciationDialogComponent } from './dialog/appreciation-dialog/appreciation-dialog.component';
import { CoefficientDialogComponent } from './dialog/coefficient-dialog/coefficient-dialog.component';
import { ClasseDialogComponent } from './dialog/classe-dialog/classe-dialog.component';
import { EvaluationDialogComponent } from './dialog/evaluation-dialog/evaluation-dialog.component';
import { NotificationDialogComponent } from './dialog/notification-dialog/notification-dialog.component';
import { JoursDialogComponent } from './dialog/jours-dialog/jours-dialog.component';
import { HoraireDialogComponent } from './dialog/horaire-dialog/horaire-dialog.component';
import { AnneScolaireDialogComponent } from './dialog/anne-scolaire-dialog/anne-scolaire-dialog.component';
import { LabsenceDialogComponent } from './dialog/labsence-dialog/labsence-dialog.component';
import { LnoteDialogComponent } from './dialog/lnote-dialog/lnote-dialog.component';
import { LemploiDialogComponent } from './dialog/lemploi-dialog/lemploi-dialog.component';
import { InscriptionDialogComponent } from './dialog/inscription-dialog/inscription-dialog.component';
import { ReglementDialogComponent } from './dialog/reglement-dialog/reglement-dialog.component';
import { NiveauDialogComponent } from './dialog/niveau-dialog/niveau-dialog.component';
import { TypenoteDialogComponent } from './dialog/typenote-dialog/typenote-dialog.component';
import { CoursDialogComponent } from './dialog/cours-dialog/cours-dialog.component';
import { TypenoteComponent } from './typenote/typenote.component';
import { CycleComponent } from './cycle/cycle.component';
import { NiveauComponent } from './niveau/niveau.component';
import { SharedModule } from '../../shared/shared/shared.module';
import { QuillModule } from 'ngx-quill';


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
    TarifsDialogComponent,
    EleveDialogComponent,
    CycleDialogComponent,
    EmploiDialogComponent,
    NoteDialogComponent,
    AbsenceDialogComponent,
    AppreciationDialogComponent,
    CoefficientDialogComponent,
    ClasseDialogComponent,
    EvaluationDialogComponent,
    NotificationDialogComponent,
    JoursDialogComponent,
    HoraireDialogComponent,
    AnneScolaireDialogComponent,
    LabsenceDialogComponent,
    LnoteDialogComponent,
    LemploiDialogComponent,
    InscriptionDialogComponent,
    ReglementDialogComponent,
    NiveauDialogComponent,
    TypenoteDialogComponent,
    CoursDialogComponent,
    TypenoteComponent,
    CycleComponent,
    NiveauComponent
  ],
  imports: [
    CommonModule,
    MaterialComponentRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MaterialModule,
    SharedModule,
    QuillModule.forRoot()
  ]
})
export class MaterialComponentModule { }
