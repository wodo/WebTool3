import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {ReactiveFormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {GuideComponent} from './guide/guide.component';
import {TeamComponent} from './team/team.component';
import {DateComponent} from './date/date.component';
import {TimeComponent} from './time/time.component';
import {reducer as ValueReducer} from './store/value.reducer';
import {reducer as CalendarReducer} from './store/calendar.reducer';
import {NameEffects} from './store/name.effects';
import {ValueEffects} from './store/value.effects';
import {NamePipe, NamesPipe} from './store/name.pipe';
import {StatePipe} from './store/state.pipe';
import {ButtonModule} from 'primeng/button';
import {SidebarModule} from 'primeng/sidebar';
import {TreeModule} from 'primeng/tree';
import {MenuComponent} from './menu/menu.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ToastModule} from 'primeng/toast';
import {SplitButtonModule} from 'primeng/splitbutton';
import {CardModule} from 'primeng/card';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {RequiredDirective as DateRequiredDirective} from './date/required.directive';
import {RequiredDirective as GuideRequiredDirective} from './guide/required.directive';
import {MembernumberComponent} from './membernumber/membernumber.component';
import {
  CheckboxModule,
  DialogModule,
  DropdownModule,
  InputTextareaModule,
  InputTextModule,
  SpinnerModule
} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/multiselect';
import {MultiselectComponent} from './multiselect/multiselect.component';
import {DropdownComponent} from './dropdown/dropdown.component';
import {reducer as eventReducer} from './store/event.reducer';
import {reducer as instructionReducer} from './store/instruction.reducer';
import {reducer as instructionSummaryReducer} from './store/instruction-summary.reducer';
import {reducer as tourReducer} from './store/tour.reducer';
import {reducer as tourSummaryReducer} from './store/tour-summary.reducer';
import {reducer as sessionReducer} from './store/session.reducer';
import {reducer as sessionSummaryReducer} from './store/session-summary.reducer';
import {reducer as guideReducer} from './store/guide.reducer';
import {reducer as guideSummaryReducer} from './store/guide-summary.reducer';
import {reducer as profileReducer} from './store/profile.reducer';
import {reducer as userQualificationReducer} from './store/userqualification.reducer';
import {reducer as retrainingReducer} from './store/retraining.reducer';
import {InstructionSummaryEffects} from './store/instruction-summary.effects';
import {InstructionEffects} from './store/instruction.effects';
import {TourSummaryEffects} from './store/tour-summary.effects';
import {TourEffects} from './store/tour.effects';
import {SessionSummaryEffects} from './store/session-summary.effects';
import {SessionEffects} from './store/session.effects';
import {GuideSummaryEffects} from './store/guide-summary.effects';
import {GuideEffects} from './store/guide.effects';
import {reducer as stateReducer} from './store/state.reducer';
import {reducer as categoryReducer} from './store/category.reducer';
import {reducer as approximateReducer} from './store/approximate.reducer';
import {reducer as equipmentReducer} from './store/equipment.reducer';
import {reducer as skillReducer} from './store/skill.reducer';
import {reducer as fitnessReducer} from './store/fitness.reducer';
import {reducer as topicReducer} from './store/topic.reducer';
import {reducer as collectiveReducer} from './store/collective.reducer';
import {reducer as nameReducer} from './store/name.reducer';
import {reducer as qualificationReducer} from './store/qualification.reducer';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CalendarEffects} from './store/calendar.effects';
import {ApproxdropdownComponent} from './approxdropdown/approxdropdown.component';
import {CategoryselectComponent} from './categoryselect/categoryselect.component';
import {DatePipe} from './date/date.pipe';
import {TimePipe} from './time/time.pipe';
import { SkillselectComponent } from './skillselect/skillselect.component';
import { FitnessselectComponent } from './fitnessselect/fitnessselect.component';
import { QualificationselectComponent } from './qualificationselect/qualificationselect.component';
import { CollectiveselectComponent } from './collectiveselect/collectiveselect.component';
import { SexdropdownComponent } from './sexdropdown/sexdropdown.component';
import { CategoryMultiselectComponent } from './categorymultiselect/categorymultiselect.component';
import { UserqualificationselectComponent } from './userqualificationselect/userqualificationselect.component';
import { UserretrainingselectComponent } from './userretrainingselect/userretrainingselect.component';

@NgModule({
  declarations: [
    GuideComponent, TeamComponent, DateComponent, TimeComponent, NamePipe, NamesPipe, MenuComponent,
    BreadcrumbComponent, DateRequiredDirective, GuideRequiredDirective, MembernumberComponent, DropdownComponent,
    MultiselectComponent, ApproxdropdownComponent, CategoryselectComponent, DatePipe, TimePipe, SkillselectComponent,
    FitnessselectComponent, QualificationselectComponent, CollectiveselectComponent, SexdropdownComponent, StatePipe,
    CategoryMultiselectComponent,
    UserqualificationselectComponent,
    UserretrainingselectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    AutoCompleteModule,
    ButtonModule,
    SplitButtonModule,
    SidebarModule,
    TreeModule,
    ScrollPanelModule,
    ToastModule,
    SpinnerModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    ToggleButtonModule,
    DialogModule,
    CheckboxModule,
    InputTextModule,
    InputTextareaModule,
    StoreModule.forFeature('values', ValueReducer),
    EffectsModule.forFeature([ValueEffects]),
    StoreModule.forFeature('events', eventReducer),
    StoreModule.forFeature('instructions', instructionReducer),
    EffectsModule.forFeature([InstructionEffects]),
    StoreModule.forFeature('instructionSummaries', instructionSummaryReducer),
    EffectsModule.forFeature([InstructionSummaryEffects]),
    StoreModule.forFeature('tours', tourReducer),
    EffectsModule.forFeature([TourEffects]),
    StoreModule.forFeature('tourSummaries', tourSummaryReducer),
    EffectsModule.forFeature([TourSummaryEffects]),
    StoreModule.forFeature('sessions', sessionReducer),
    EffectsModule.forFeature([SessionEffects]),
    StoreModule.forFeature('sessionSummaries', sessionSummaryReducer),
    EffectsModule.forFeature([SessionSummaryEffects]),
    StoreModule.forFeature('states', stateReducer),
    StoreModule.forFeature('categories', categoryReducer),
    StoreModule.forFeature('approximates', approximateReducer),
    StoreModule.forFeature('equipments', equipmentReducer),
    StoreModule.forFeature('skills', skillReducer),
    StoreModule.forFeature('fitness', fitnessReducer),
    StoreModule.forFeature('topics', topicReducer),
    StoreModule.forFeature('collectives', collectiveReducer),
    StoreModule.forFeature('qualifications', qualificationReducer),
    StoreModule.forFeature('calendar', CalendarReducer),
    EffectsModule.forFeature([CalendarEffects]),
    StoreModule.forFeature('names', nameReducer),
    EffectsModule.forFeature([NameEffects]),
    StoreModule.forFeature('guideSummaries', guideSummaryReducer),
    EffectsModule.forFeature([GuideSummaryEffects]),
    StoreModule.forFeature('guides', guideReducer),
    EffectsModule.forFeature([GuideEffects]),
    StoreModule.forFeature('profiles', profileReducer),
    StoreModule.forFeature('userQualifications', userQualificationReducer),
    StoreModule.forFeature('retrainings', retrainingReducer),
  ],
  exports: [
    GuideComponent, TeamComponent, DateComponent, TimeComponent, NamePipe, NamesPipe, MenuComponent,
    BreadcrumbComponent, DateRequiredDirective, GuideRequiredDirective, MembernumberComponent, DropdownComponent,
    MultiselectComponent, ButtonModule, ToggleButtonModule, ApproxdropdownComponent, CategoryselectComponent,
    DialogModule, CheckboxModule, InputTextModule, InputTextareaModule, DatePipe, TimePipe, SkillselectComponent,
    FitnessselectComponent, QualificationselectComponent, CollectiveselectComponent, CardModule, SexdropdownComponent,
    StatePipe, CategoryMultiselectComponent, UserqualificationselectComponent, UserretrainingselectComponent
  ]
})
export class CoreModule { }
