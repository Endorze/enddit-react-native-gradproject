export type User = {
    id: number,
    created_at: string,
    username: string,
    email: string,
}

export type ProfileViewProps = {
  id: string,
  username: string;
  description?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  isOwnProfile?: boolean;
  onEditProfilePress?: () => void;
  onAddFriendPress?: () => void;
  addFriendDisabled?: boolean;
};