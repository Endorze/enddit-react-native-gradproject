import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthorAvatar } from "../AvatarImage/avatarImage";
import { getCommentsForPost } from "../../utils/getPostComments";
import { Pressable, TextInput, View, Text } from "react-native";
import { addComment } from "../../utils/addComment";
import CommentsList from "../feed/CommentList";
import { useAuth } from "../../context/AuthContext";

const CommentSection = ({ postId }: { postId: number }) => {
    const [newComment, setNewComment] = useState("");
    const {accessToken} = useAuth();

    const {
        data: comments = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => getCommentsForPost(postId),
    });

    const mutation = useMutation({
        mutationFn: async () => {
            await addComment({ postId, newComment, accessToken});
        },
        onSuccess: () => {
            setNewComment("");
            refetch();
        },
    });

    if (isLoading) return <p className="text-center mt-4 text-gray-500 text-sm">Loading comments…</p>;

    return (
        <View>
            <View className="flex gap-2">
                <AuthorAvatar userId={""} />
                <View className="flex flex-col gap-2 border w-full border-gray-400 rounded-2xl px-3 py-2">
                    <TextInput
                        placeholder="Write a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        className="text-sm outline-0"
                    />
                    {newComment && newComment.length > 0 && (

                        <Pressable
                            onPress={() => {
                                if (!newComment.trim()) return;
                                mutation.mutate();
                            }}
                            disabled={mutation.isPending}
                            className="bg-blue-600 w-fit font-semibold text-white self-end px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Text>Send</Text>
                        </Pressable>
                    )}
                </View>
            </View>
            {comments.length === 0 ? (
                <View className="w-full">
                    {comments.length === 0 && newComment.length === 0 && (
                        <Text>No comments yet.</Text>
                    )}
                </View>
            ) : (
                <View className="space-y-2 mb-3">
                    <CommentsList comments={comments} />
                </View>
            )}

        </View>
    );
};

export default CommentSection;
