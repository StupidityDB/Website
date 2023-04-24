import { ReactNode } from "react"

/* metrics */
export interface RdbMetrics {
  currentReviewCount: number
  currentUsersCount: number
  currentRequestsCount: number
  targetReviewCount: number
  targetUsersCount: number
  targetRequestsCount: number
}
export interface MetricsObject {
  totalReviews: string;
  totalUsers: string;
  totalRequests: string;
}
export interface MetricsDisplayProps {
  reviewCount: number
  userCount: number
  requestsCount: number
}

/* getting rdb user info */
export interface GetUser {
  ID: number;
  discordID: string;
  username: string;
  profilePhoto: string;
  clientMod: string;
  warningCount: number;
  banEndDate: string;
  badges: {
    name: string;
    icon: string;
    redirectURL: string;
    type: number;
    description: string;
  }[];
  lastReviewID: number;
}

/* getting reviews */
export interface Badge {
  name: string;
  icon: string;
  redirectURL: string;
  type: number;
  description: string;
}
export interface Sender {
  id: number;
  discordID: string;
  username: string;
  profilePhoto: string;
  badges: Badge[];
}
export interface Review {
  id: number;
  sender: Sender;
  star: number;
  comment: string;
  type: number;
  timestamp: number;
  query?: string; // not part of the api response, this is added manually when needed
}
export interface GetReviews {
  success: boolean;
  message: string;
  reviews: Review[];
}

/* adding reviews */
export interface AddReview {
  success: boolean;
  message: string;
  updated: boolean;
}

/* deleting reviews */
export interface DeleteReview {
  success: boolean;
  message: string;
}

/* reporting reviews */
export interface ReportReview {
  success: boolean;
  message: string;
}

/* toggle props */
export interface ToggleProps {
  checked?: boolean;
  onChange?: (isChecked: boolean) => void;
  label?: string;
  className?: string;
}

/* review card props */
export interface ReviewCardProps {
  review: Review;
  handleReportReviewClick: (reviewId: number) => void;
  handleDeleteReviewClick: (reviewId: number, discordId: string) => void;
  isAdmin: boolean;
}
export interface ReviewDialogContentProps extends ReviewCardProps {
  closeDialog: () => void;
}

/* alert props */
export interface AlertOptions {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timeout?: number;
}

/* dialog props */
export interface DialogProps {
  content: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

/* localStorage props */
export interface SetLocalStorageItemParams {
  key: string;
  value: string;
}

export interface GetLocalStorageItemParams {
  key: string;
  defaultValue?: any;
}

/* rdb user settings */
export interface Settings {
  DiscordID: string;
  opt: boolean;
}
