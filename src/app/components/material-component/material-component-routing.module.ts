import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatiereComponent } from './matiere/matiere.component';
import { EnseignantComponent } from './enseignant/enseignant.component';
import { ClasseComponent } from './classe/classe.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CoursComponent } from './cours/cours.component';
import { EmploiComponent } from './emploi/emploi.component';
import { TarifsComponent } from './tarifs/tarifs.component';
import { ReglementComponent } from './reglement/reglement.component';
import { AbsenceComponent } from './absence/absence.component';
import { LabsenceComponent } from './labsence/labsence.component';
import { NotificationComponent } from './notification/notification.component';
import { NoteComponent } from './note/note.component';
import { JoursComponent } from './jours/jours.component';
import { HoraireComponent } from './horaire/horaire.component';
import { AppreciationComponent } from './appreciation/appreciation.component';
import { CoefficientComponent } from '../coefficient/coefficient.component';
import { EleveComponent } from '../eleve/eleve.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { EvaluationComponent } from '../evaluation/evaluation.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path:'dashboard',
    component: DashboardComponent   
},
{
  path:'utilisateur',
  component: UserComponent   
},
{
  path:'tarifs',
  component: TarifsComponent   
},
{
  path:'eleves/reglement',
  component: ReglementComponent   
},
{
  path:'eleves/eleve',
  component: EleveComponent
},
{
  path:'eleves/inscription',
  component: InscriptionComponent   
},
{
  path:'enseignant/absence',
  component: AbsenceComponent   
},
{
  path:'enseignant/labsence',
  component: LabsenceComponent   
},
{
  path:'enseignant/evaluation',
  component: EvaluationComponent
},
{
  path:'notification',
  component: NotificationComponent   
},
{
  path:'enseignant/note',
  component: NoteComponent   
},
{
  path:'jours',
  component: JoursComponent   
},
{
  path:'horaire',
  component: HoraireComponent   
},
{
  path:'apreciation',
  component: AppreciationComponent   
},
{
  path:'cours/coefficient',
  component: CoefficientComponent
},
  {
    path:'cours/matiere',
    component: MatiereComponent   
},
{
  path:'enseignant/enseignant',
  component: EnseignantComponent   
},
{
  path:'cours/cours',
  component: CoursComponent   
},
{
  path:'cours/emploi',
  component: EmploiComponent   
},
{
  path:'cours/classe',
  component: ClasseComponent   
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialComponentRoutingModule { }
