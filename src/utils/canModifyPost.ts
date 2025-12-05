export function canModifyPost(postUserId: string, currentUserId?: string | null) {
  if (!currentUserId) return false;
  return postUserId === currentUserId;
}
