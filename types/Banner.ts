export interface Banner {
  id: string;
  campaignName: string;
  businessName: string;
  bannerType: string;
  mediaPath: string;
  redirectUrl: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBanner {
  campaignName: string;
  businessName: string;
  bannerType: string;
  mediaPath: string;
  redirectUrl: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}