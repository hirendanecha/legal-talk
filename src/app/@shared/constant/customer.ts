export class Customer {
  Id: number;
  Email: string;
  Username: string;
  Password: string;
  FirstName: string;
  LastName: string;
  IsActive: string;
  Address: string;
  Zip: string;
  City: string;
  State: string;
  Country = 'US';
  MobileNo: string;
  County: string;
  PartnerId: string;
  DateCreation: string;
  IsSuspended: number;
  IsAdmin: string;
  ProfilePicName: string;
  CoverPicName: string;
  DateofBirth: Date;
  Gender: string;
  profileId: string;
  AccountType: string;
  termAndPolicy: boolean;
  UserID: number
}

export class Community {
  userId: string;
  profileId: string;
  CommunityName: string;
  slug: string;
  CommunityDescription: string;
  logoImg: string;
  coverImg: string;
  isApprove: string;
  pageType: string;
  Zip: string;
  City: string;
  State: string;
  Country = 'US';
}
