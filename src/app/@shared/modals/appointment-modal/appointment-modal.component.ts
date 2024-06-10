import {
  AfterViewInit,
  Component,
  Injectable,
  Input,
  inject,
} from '@angular/core';
import {
  NgbActiveModal,
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
  NgbDatepickerConfig,
  NgbInputDatepickerConfig,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { CustomerService } from '../../services/customer.service';
import * as moment from 'moment';
import { AppointmentsService } from '../../services/appointment.service';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day
      : null;
  }
}

@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: CustomAdapter }],
})
export class AppointmentModalComponent implements AfterViewInit {
  @Input() cancelButtonLabel: string;
  @Input() confirmButtonLabel: string;
  @Input() title: string;
  @Input() closeIcon: boolean;
  @Input() data: any;
  // model: string;
  timeSlot: any = [];
  today: any;
  currentDate = new Date().getDate();
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  isSelectedSlot = false;
  index: number;
  nextBtn = false;
  selectedDateSlot: string;
  selectedTimeSlot: string;
  pricingPage: boolean;
  totalAmt: number;
  selectedCards: any[] = [];
  cards: any[] = [
    {
      title: '600 Minutes of Video Time',
      id: 1,
      description: `600 minutes of video call time provides enough minutes for twenty 30-minute consultation calls per month.`,
      pricing: `$30.00 per month`,
      rate: 30,
    },
    {
      title: '3000 Minutes of Video Time',
      id: 2,
      description: `3000 minutes of video call time provides enough minutes for one hundred 30-minute consultation calls per month.`,
      pricing: `$120.00 per month`,
      rate: 120,
    },
    {
      title: '6000 Minutes of Video Time',
      id: 3,
      description: `6000 minutes of video call time provides enough minutes for two hundred 30-minute consultation calls per month.`,
      pricing: `$200.00 per month`,
      rate: 200,
    },
  ];

  featuredCards: any[] = [
    {
      title: 'Dedicated Server and Unlimited Minutes of Video Call Time',
      id: 11,
      description: `A dedicated server provides an unlimited number of call time minutes.
      Pricing is dependent on the selected server.
      Please contact us for details.`,
      pricing: `(Select and well contact you to discuss)`,
      rate: 0,
    },
    {
      title: 'Featured Practitioner',
      id: 22,
      description: `Become a Featured Practitioner and your practice will be featured throughout Healing.tube`,
      pricing: `$100.00 per month`,
      rate: 100,
    },
  ];

  practitioner: any;
  appointmentData: any;

  constructor(
    public activeModal: NgbActiveModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<any>,
    public calendar: NgbCalendar,
    private customerService: CustomerService,
    private appointmentsService: AppointmentsService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {
    this.today = this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    // console.log(this.today)
    // console.log(this.currentDate, this.currentMonth, this.currentYear,)
  }

  ngAfterViewInit(): void {
    this.getProfile(this.data.practitionerProfileId);
  }

  async generateTimeSlots(startTime, endTime, duration) {
    const timeSlots = [];

    // Convert start and end time to Date objects
    const startDate = new Date(`${this.selectedDateSlot} ${startTime}`);
    const endDate = new Date(`${this.selectedDateSlot} ${endTime}`);

    // Loop through the time range and generate time slots
    while (startDate < endDate) {
      const currentSlot = startDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      timeSlots.push(currentSlot);

      // Increment the current time by the specified duration
      startDate.setMinutes(startDate.getMinutes() + duration);
    }

    return timeSlots;
  }

  async selectDate() {
    this.timeSlot = await this.generateTimeSlots('09:00', '17:00', 15);
  }

  selectTime(time, i): void {
    this.nextBtn = true;
    this.selectedTimeSlot = time;
    // console.log(time, i);
    if (this.index !== i) {
      this.index = i;
    }
  }

  isSelected(id: number): boolean {
    return this.selectedCards.includes(id);
  }

  selectCard(cardId: string, amt: number): void {
    this.totalAmt = amt;
    const index = this.selectedCards.indexOf(cardId);
    if (index === -1) {
      this.selectedCards = [cardId];
    } else {
      this.selectedCards = [];
      this.totalAmt = null;
    }
  }

  feturedSelectCard(cardId: string, amt: number): void {
    // if (amt) {
    //   this.totalAmt = this.totalAmt + amt;
    // }
    const index = this.selectedCards.indexOf(cardId);
    if (index === -1) {
      this.selectedCards.push(cardId);
      // this.totalAmt = this.totalAmt + amt;
      this.totalAmt = isNaN(this.totalAmt) ? amt : this.totalAmt + amt;
    } else {
      this.selectedCards = this.selectedCards.filter((id) => id !== cardId);
      this.totalAmt = this.totalAmt - amt;
    }
  }

  backToApplication() {
    this.pricingPage = false;
  }

  nextToApplication() {
    const dateTime = moment(
      `${this.selectedDateSlot} ${this.selectedTimeSlot}`,
      'YYYY-M-D HH:mm'
    ).utc();
    const appointmentDateTime = dateTime.format('YYYY-MM-DDTHH:mm:ss[Z]');
    // console.log(appointmentDateTime);
    // console.log(this.practitioner);
    const topics = [];
    
    this.data.topics.map((e) => topics.push(e.name));
    const applicationObject = {
      appointment: {
        appointmentDateTime: appointmentDateTime,
        profileId: this.data.profileId,
        lawyerProfileId: this.data.practitionerProfileId,
        lawyerName: this.data.practitionerName,
      },
      topics: topics,
      slug: this.data.slug,
    };
    if (applicationObject && !this.pricingPage) {
      this.createAppointmentSchedule(applicationObject);
    }
    // console.log(applicationObject);

    if (appointmentDateTime && !this.pricingPage) {
      this.pricingPage = true;
    } else if (this.pricingPage) {
      this.activeModal.close();
    }
  }

  getProfile(id): void {
    this.customerService.getProfile(id).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.practitioner = res.data[0].Username;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  createAppointmentSchedule(data) {
    this.appointmentsService.createAppointment(data).subscribe({
      next: (res: any) => {
        this.toastService.success(res.message);
        console.log(res);
      },
      error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
      },
    });
  }
}
