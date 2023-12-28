import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { ImgPickerComponent } from './components/img-picker/img-picker.component';
import { CommunityCardComponent } from './components/community-card/community-card.component';
import { RightSidebarComponent } from '../layouts/main-layout/components/right-sidebar/right-sidebar.component';
import { PostMetaDataCardComponent } from './components/post-meta-data-card/post-meta-data-card.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { TagUserInputComponent } from './components/tag-user-input/tag-user-input.component';
import { ImgPreviewComponent } from './components/img-preview/img-preview.component';
import { InlineLoaderComponent } from './components/inline-loader/inline-loader.component';
import { LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faAngleDoubleUp,
  faCamera,
  faEye,
  faXmark,
  faBars,
  faBorderAll,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faCirclePlus,
  faMagnifyingGlass,
  faDownload,
  faUser,
  faCalendarDays,
  faClock,
  faMessage,
  faThumbsUp,
  faRotate,
  faTrashCan,
  faEllipsis,
  faUserMinus,
  faPenToSquare,
  faLink,
  faComment,
  faImage,
  faPaperPlane,
  faBell,
  faHouse,
  faBookOpen,
  faPlay,
  faNetworkWired,
  faLayerGroup,
  faCertificate,
  faGear,
  faUserPlus,
  faUserXmark,
  faRightFromBracket,
  faUnlockKeyhole,
  faSun,
  faMoon,
  faPlus,
  faSatelliteDish,
  faVideo,
  faUserCheck,
  faCheck,
  faSquareCheck,
  faSquareXmark,
  faFileUpload,
  faFile,
  faFilePdf,
  faShare,
  faHouseMedical,
  faStethoscope,
  faArrowLeftLong,
  faArrowRightLong,
  faGlobe,
  faList,
  faCircle,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { ClaimTokenModalComponent } from './modals/clai-1776-token-modal/claim-token-modal.component';
import { WalletLinkComponent } from './modals/wallet-download-modal/1776-wallet.component';
import { ReplyCommentModalComponent } from './modals/reply-comment-modal/reply-comment-modal.component';
import { PipeModule } from './pipe/pipe.module';
import { VideoPostModalComponent } from './modals/video-post-modal/video-post-modal.component';
import { ForgotPasswordComponent } from '../layouts/auth-layout/pages/forgot-password/forgot-password.component';
import { MentionModule } from 'angular-mentions';
//import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PostDetailComponent } from '../layouts/main-layout/pages/home/post-detail/post-detail.component';
import { EditResearchModalComponent } from './modals/edit-research-modal/edit-research-modal.component';
import { SharePostModalComponent } from './modals/share-post-modal/share-post-modal.component';
import { RePostCardComponent } from './components/re-post-card/re-post-card.component';
import { HealthPraatitionerCardComponent } from './components/health-partitioner-card/health-partitioner-card.component';

const sharedComponents = [
  ConfirmationModalComponent,
  PostListComponent,
  PostCardComponent,
  ImgPickerComponent,
  CommunityCardComponent,
  RightSidebarComponent,
  PostMetaDataCardComponent,
  TagUserInputComponent,
  ImgPreviewComponent,
  InlineLoaderComponent,
  CopyClipboardDirective,
  ClaimTokenModalComponent,
  WalletLinkComponent,
  ReplyCommentModalComponent,
  VideoPostModalComponent,
  ForgotPasswordComponent,
  PdfPreviewComponent,
  PostDetailComponent,
  EditResearchModalComponent,
  SharePostModalComponent,
  RePostCardComponent,
  HealthPraatitionerCardComponent,
];

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbCollapseModule,
  NgbModule,
  NgxSpinnerModule,
  RouterModule,
  NgxTrimDirectiveModule,
  FontAwesomeModule,
  PipeModule,
  MentionModule,
  // PdfViewerModule
];

@NgModule({
  declarations: [sharedComponents],
  imports: [sharedModules],
  exports: [...sharedModules, ...sharedComponents],
  providers: [
    NgbActiveModal,
    NgbActiveOffcanvas,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
  ],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faAngleDoubleUp,
      faCamera,
      faEye,
      faXmark,
      faBars,
      faBorderAll,
      faChevronDown,
      faChevronUp,
      faChevronRight,
      faCirclePlus,
      faMagnifyingGlass,
      faDownload,
      faUser,
      faCalendarDays,
      faClock,
      faMessage,
      faThumbsUp,
      faRotate,
      faTrashCan,
      faEllipsis,
      faUserMinus,
      faPenToSquare,
      faLink,
      faComment,
      faImage,
      faPaperPlane,
      faBell,
      faHouse,
      faBookOpen,
      faPlay,
      faNetworkWired,
      faLayerGroup,
      faCertificate,
      faGear,
      faUserPlus,
      faUserXmark,
      faRightFromBracket,
      faUnlockKeyhole,
      faSun,
      faMoon,
      faPlus,
      faSatelliteDish,
      faVideo,
      faUserCheck,
      faCheck,
      faSquareCheck,
      faSquareXmark,
      faFileUpload,
      faFile,
      faFilePdf,
      faDownload,
      faShare,
      faHouseMedical,
      faStethoscope,
      faArrowLeftLong,
      faArrowRightLong,
      faGlobe,
      faList,
      faCircle,
      faPhone
    );
  }
}
